#!/bin/bash

# Cloudflare Deploy Hook Trigger with Retry Logic
# This script triggers Cloudflare Pages builds after Firebase deployment
# with exponential backoff retry on failure.

set -e

# Configuration
MAX_RETRIES=4
RETRY_DELAYS=(2 4 8 16)  # Exponential backoff in seconds

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to trigger Cloudflare deploy hook with retry
trigger_cloudflare_hook() {
    local hook_url="$1"
    local site_name="$2"
    local attempt=0

    while [ $attempt -lt $MAX_RETRIES ]; do
        log_info "Triggering Cloudflare build for $site_name (attempt $((attempt + 1))/$MAX_RETRIES)..."

        # Trigger the deploy hook
        response=$(curl -s -w "\n%{http_code}" -X POST "$hook_url" 2>&1)
        http_code=$(echo "$response" | tail -n1)
        body=$(echo "$response" | sed '$d')

        if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 201 ]; then
            log_success "Cloudflare build triggered successfully for $site_name"
            echo "$body"
            return 0
        else
            log_warning "Build trigger failed with HTTP $http_code"

            attempt=$((attempt + 1))
            if [ $attempt -lt $MAX_RETRIES ]; then
                delay=${RETRY_DELAYS[$attempt - 1]}
                log_info "Retrying in ${delay}s..."
                sleep $delay
            fi
        fi
    done

    log_error "Failed to trigger Cloudflare build for $site_name after $MAX_RETRIES attempts"
    return 1
}

# Function to trigger build via Cloudflare API (alternative method)
trigger_cloudflare_api() {
    local account_id="$1"
    local project_name="$2"
    local api_token="$3"
    local branch="${4:-main}"
    local attempt=0

    while [ $attempt -lt $MAX_RETRIES ]; do
        log_info "Triggering Cloudflare Pages build via API for $project_name (attempt $((attempt + 1))/$MAX_RETRIES)..."

        response=$(curl -s -w "\n%{http_code}" -X POST \
            "https://api.cloudflare.com/client/v4/accounts/${account_id}/pages/projects/${project_name}/deployments" \
            -H "Authorization: Bearer ${api_token}" \
            -H "Content-Type: application/json" \
            -d "{\"branch\":\"${branch}\"}" 2>&1)

        http_code=$(echo "$response" | tail -n1)
        body=$(echo "$response" | sed '$d')

        if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 201 ]; then
            log_success "Cloudflare build triggered successfully for $project_name"
            echo "$body" | jq -r '.result.id // .result' 2>/dev/null || echo "$body"
            return 0
        else
            log_warning "API call failed with HTTP $http_code: $body"

            attempt=$((attempt + 1))
            if [ $attempt -lt $MAX_RETRIES ]; then
                delay=${RETRY_DELAYS[$attempt - 1]}
                log_info "Retrying in ${delay}s..."
                sleep $delay
            fi
        fi
    done

    log_error "Failed to trigger Cloudflare build for $project_name after $MAX_RETRIES attempts"
    return 1
}

# Function to check deployment status
check_deployment_status() {
    local account_id="$1"
    local project_name="$2"
    local deployment_id="$3"
    local api_token="$4"
    local max_wait=600  # 10 minutes max wait
    local interval=30   # Check every 30 seconds
    local elapsed=0

    log_info "Monitoring deployment status for $project_name..."

    while [ $elapsed -lt $max_wait ]; do
        response=$(curl -s \
            "https://api.cloudflare.com/client/v4/accounts/${account_id}/pages/projects/${project_name}/deployments/${deployment_id}" \
            -H "Authorization: Bearer ${api_token}" \
            -H "Content-Type: application/json")

        status=$(echo "$response" | jq -r '.result.latest_stage.status // "unknown"' 2>/dev/null)
        stage=$(echo "$response" | jq -r '.result.latest_stage.name // "unknown"' 2>/dev/null)

        case "$status" in
            "success")
                log_success "Deployment completed successfully!"
                return 0
                ;;
            "failure"|"canceled")
                log_error "Deployment failed with status: $status at stage: $stage"
                return 1
                ;;
            "active"|"idle")
                log_info "Deployment in progress - Stage: $stage, Status: $status"
                ;;
            *)
                log_warning "Unknown status: $status"
                ;;
        esac

        sleep $interval
        elapsed=$((elapsed + interval))
    done

    log_warning "Deployment monitoring timed out after ${max_wait}s"
    return 1
}

# Main execution
main() {
    local mode="${1:-hook}"

    case "$mode" in
        "hook")
            # Deploy hook mode - uses pre-configured webhook URLs
            if [ -z "$CLOUDFLARE_DEPLOY_HOOK_WQT" ] && [ -z "$CLOUDFLARE_DEPLOY_HOOK_CLOUD" ] && [ -z "$CLOUDFLARE_DEPLOY_HOOK_SALES" ]; then
                log_error "No Cloudflare deploy hooks configured"
                log_info "Set CLOUDFLARE_DEPLOY_HOOK_WQT, CLOUDFLARE_DEPLOY_HOOK_CLOUD, or CLOUDFLARE_DEPLOY_HOOK_SALES"
                exit 1
            fi

            failed=0

            if [ -n "$CLOUDFLARE_DEPLOY_HOOK_WQT" ]; then
                trigger_cloudflare_hook "$CLOUDFLARE_DEPLOY_HOOK_WQT" "waterquality-trading" || failed=$((failed + 1))
            fi

            if [ -n "$CLOUDFLARE_DEPLOY_HOOK_CLOUD" ]; then
                trigger_cloudflare_hook "$CLOUDFLARE_DEPLOY_HOOK_CLOUD" "cloud-bluesignal" || failed=$((failed + 1))
            fi

            if [ -n "$CLOUDFLARE_DEPLOY_HOOK_SALES" ]; then
                trigger_cloudflare_hook "$CLOUDFLARE_DEPLOY_HOOK_SALES" "sales-bluesignal" || failed=$((failed + 1))
            fi

            if [ $failed -gt 0 ]; then
                log_error "$failed deployment(s) failed"
                exit 1
            fi
            ;;

        "api")
            # API mode - uses Cloudflare API with account ID and token
            if [ -z "$CLOUDFLARE_ACCOUNT_ID" ] || [ -z "$CLOUDFLARE_API_TOKEN" ]; then
                log_error "CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN are required for API mode"
                exit 1
            fi

            failed=0

            if [ -n "$CLOUDFLARE_PROJECT_WQT" ]; then
                trigger_cloudflare_api "$CLOUDFLARE_ACCOUNT_ID" "$CLOUDFLARE_PROJECT_WQT" "$CLOUDFLARE_API_TOKEN" "${2:-main}" || failed=$((failed + 1))
            fi

            if [ -n "$CLOUDFLARE_PROJECT_CLOUD" ]; then
                trigger_cloudflare_api "$CLOUDFLARE_ACCOUNT_ID" "$CLOUDFLARE_PROJECT_CLOUD" "$CLOUDFLARE_API_TOKEN" "${2:-main}" || failed=$((failed + 1))
            fi

            if [ -n "$CLOUDFLARE_PROJECT_SALES" ]; then
                trigger_cloudflare_api "$CLOUDFLARE_ACCOUNT_ID" "$CLOUDFLARE_PROJECT_SALES" "$CLOUDFLARE_API_TOKEN" "${2:-main}" || failed=$((failed + 1))
            fi

            if [ $failed -gt 0 ]; then
                log_error "$failed deployment(s) failed"
                exit 1
            fi
            ;;

        "single")
            # Single project mode - for targeting one specific site
            local site="$2"
            local hook_var="CLOUDFLARE_DEPLOY_HOOK_${site^^}"
            local hook_url="${!hook_var}"

            if [ -z "$hook_url" ]; then
                log_error "No deploy hook found for site: $site"
                log_info "Set $hook_var environment variable"
                exit 1
            fi

            trigger_cloudflare_hook "$hook_url" "$site"
            ;;

        *)
            echo "Usage: $0 [mode] [options]"
            echo ""
            echo "Modes:"
            echo "  hook              Trigger all configured deploy hooks (default)"
            echo "  api [branch]      Trigger builds via Cloudflare API"
            echo "  single <site>     Trigger a single site (wqt, cloud, or sales)"
            echo ""
            echo "Environment Variables (hook mode):"
            echo "  CLOUDFLARE_DEPLOY_HOOK_WQT    Deploy hook URL for waterquality-trading"
            echo "  CLOUDFLARE_DEPLOY_HOOK_CLOUD  Deploy hook URL for cloud-bluesignal"
            echo "  CLOUDFLARE_DEPLOY_HOOK_SALES  Deploy hook URL for sales-bluesignal"
            echo ""
            echo "Environment Variables (API mode):"
            echo "  CLOUDFLARE_ACCOUNT_ID         Cloudflare account ID"
            echo "  CLOUDFLARE_API_TOKEN          Cloudflare API token with Pages permissions"
            echo "  CLOUDFLARE_PROJECT_WQT        Project name for waterquality-trading"
            echo "  CLOUDFLARE_PROJECT_CLOUD      Project name for cloud-bluesignal"
            echo "  CLOUDFLARE_PROJECT_SALES      Project name for sales-bluesignal"
            exit 1
            ;;
    esac

    log_success "All Cloudflare deployments triggered successfully!"
}

main "$@"
