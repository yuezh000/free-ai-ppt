#!/usr/bin/env sh
set -eu

project_root="${1:-/app}"
render_root="${2:-/tmp/freeppt-render}"
slug_list="${3:-}"
files_dir="$project_root/public/templates/files"
previews_dir="$project_root/public/templates/previews"
pdf_dir="$render_root/pdfs"

mkdir -p "$pdf_dir" "$previews_dir"

render_template() {
  slug="$1"
  pptx="$files_dir/$slug.pptx"
  pdf="$pdf_dir/$slug.pdf"
  if [ ! -f "$pptx" ]; then
    echo "Missing template: $pptx" >&2
    exit 1
  fi
  libreoffice "-env:UserInstallation=file://$render_root/lo-profile-$slug" --headless --convert-to pdf --outdir "$pdf_dir" "$pptx" >/dev/null
  if [ ! -f "$pdf" ]; then
    echo "LibreOffice did not create: $pdf" >&2
    exit 1
  fi
  output_dir="$previews_dir/$slug"
  mkdir -p "$output_dir"
  for page in 1 2 3 4 5 6 7 8; do
    padded="$(printf '%02d' "$page")"
    pdftoppm -f "$page" -l "$page" -singlefile -jpeg -jpegopt quality=90 -r 144 "$pdf" "$output_dir/$padded"
  done
}

if [ -n "$slug_list" ]; then
  while IFS= read -r slug; do
    [ -n "$slug" ] && render_template "$slug"
  done < "$slug_list"
else
  for pptx in "$files_dir"/*.pptx; do
    render_template "$(basename "$pptx" .pptx)"
  done
fi

echo "Rendered template previews from generated PPTX files."
