#!/bin/bash

# Copy SEO files (robots.txt, sitemap.xml) to the correct dist folders
# Usage: ./scripts/copy-seo-files.sh <target>
# Targets: wqt, cloud, landing, all

TARGET=$1
SCRIPT_DIR="$(dirname "$0")"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

copy_seo_files() {
    local target=$1
    local dist_dir=$2
    local seo_source="$ROOT_DIR/public/seo/$target"

    if [ -d "$seo_source" ] && [ -d "$dist_dir" ]; then
        echo "Copying SEO files for $target..."
        cp "$seo_source/robots.txt" "$dist_dir/robots.txt" 2>/dev/null && echo "  ✓ robots.txt"
        cp "$seo_source/sitemap.xml" "$dist_dir/sitemap.xml" 2>/dev/null && echo "  ✓ sitemap.xml"
    else
        echo "Warning: Source or destination not found for $target"
        [ ! -d "$seo_source" ] && echo "  Missing: $seo_source"
        [ ! -d "$dist_dir" ] && echo "  Missing: $dist_dir"
    fi
}

case $TARGET in
    wqt)
        copy_seo_files "wqt" "$ROOT_DIR/dist-wqt"
        ;;
    cloud)
        copy_seo_files "cloud" "$ROOT_DIR/dist-cloud"
        ;;
    landing)
        copy_seo_files "landing" "$ROOT_DIR/dist-landing"
        ;;
    all)
        copy_seo_files "wqt" "$ROOT_DIR/dist-wqt"
        copy_seo_files "cloud" "$ROOT_DIR/dist-cloud"
        copy_seo_files "landing" "$ROOT_DIR/dist-landing"
        ;;
    *)
        echo "Usage: $0 <wqt|cloud|landing|all>"
        exit 1
        ;;
esac

echo "SEO files copy complete!"
