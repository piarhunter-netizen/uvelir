#!/usr/bin/env bash
# Собирает демо и публикует его в ветку gh-pages (GitHub Pages).
set -e
cd "$(dirname "$0")"
MSYS_NO_PATHCONV=1 BASE_PATH=/uvelir npm run build
touch out/.nojekyll
cd out
rm -rf .git
git init -q -b gh-pages
git add -A
git commit -q -m "Публикация демо"
git push -f "$(git -C .. remote get-url origin)" gh-pages
rm -rf .git
