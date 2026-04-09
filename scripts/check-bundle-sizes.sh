#!/usr/bin/env bash
# Measure JS and CSS bundle sizes for each site's dist folder.
# Outputs a markdown table to stdout. Always exits 0 (advisory only).

set -euo pipefail

DIST_DIRS="${@:-dist-wqt dist-cloud dist-landing}"
SITE_LABELS=("Marketplace" "Cloud" "Landing")

human_size() {
  local bytes=$1
  if [ "$bytes" -ge 1048576 ]; then
    printf "%.1f MB" "$(echo "scale=1; $bytes / 1048576" | bc)"
  elif [ "$bytes" -ge 1024 ]; then
    printf "%.0f KB" "$(echo "scale=0; $bytes / 1024" | bc)"
  else
    printf "%d B" "$bytes"
  fi
}

measure_size() {
  local dir=$1
  local ext=$2
  local total=0
  while IFS= read -r -d '' file; do
    size=$(wc -c < "$file")
    total=$((total + size))
  done < <(find "$dir/assets" -name "*.$ext" -print0 2>/dev/null)
  echo "$total"
}

measure_gzip_size() {
  local dir=$1
  local ext=$2
  local total=0
  while IFS= read -r -d '' file; do
    size=$(gzip -c "$file" | wc -c)
    total=$((total + size))
  done < <(find "$dir/assets" -name "*.$ext" -print0 2>/dev/null)
  echo "$total"
}

echo "## Bundle Size Report"
echo ""
echo "| Site | JS (raw) | JS (gzip) | CSS (raw) | CSS (gzip) |"
echo "|------|----------|-----------|-----------|------------|"

i=0
for dir in $DIST_DIRS; do
  label="${SITE_LABELS[$i]:-$dir}"
  i=$((i + 1))

  if [ ! -d "$dir" ]; then
    echo "| $label | - | - | - | - |"
    continue
  fi

  js_raw=$(measure_size "$dir" "js")
  js_gz=$(measure_gzip_size "$dir" "js")
  css_raw=$(measure_size "$dir" "css")
  css_gz=$(measure_gzip_size "$dir" "css")

  echo "| $label | $(human_size "$js_raw") | $(human_size "$js_gz") | $(human_size "$css_raw") | $(human_size "$css_gz") |"
done

echo ""
exit 0
