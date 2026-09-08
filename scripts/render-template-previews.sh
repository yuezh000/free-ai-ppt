#!/usr/bin/env sh
set -eu

project_root="${1:-/app}"
render_root="${2:-/tmp/freeppt-render}"
files_dir="$project_root/public/templates/files"
previews_dir="$project_root/public/templates/previews"
pdf_dir="$render_root/pdfs"

mkdir -p "$pdf_dir" "$previews_dir"
libreoffice "-env:UserInstallation=file://$render_root/lo-profile" --headless --convert-to pdf --outdir "$pdf_dir" "$files_dir"/*.pptx >/dev/null

for pdf in "$pdf_dir"/*.pdf; do
  slug="$(basename "$pdf" .pdf)"
  output_dir="$previews_dir/$slug"
  mkdir -p "$output_dir"
  for page in 1 2 3 4 5 6 7 8; do
    padded="$(printf '%02d' "$page")"
    pdftoppm -f "$page" -l "$page" -singlefile -jpeg -jpegopt quality=90 -r 144 "$pdf" "$output_dir/$padded"
  done
done

echo "Rendered template previews from generated PPTX files."
