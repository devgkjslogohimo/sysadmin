#!/usr/bin/env bash

set -u

PROJECT_ROOT="$(pwd)"
PROJECT_NAME="$(basename "$PROJECT_ROOT")"
TIMESTAMP="$(date '+%Y%m%d_%H%M%S')"
OUTPUT="$PROJECT_ROOT/PROJECT_AUDIT_FULL_${TIMESTAMP}.txt"

exec > >(tee "$OUTPUT") 2>&1

echo "============================================================"
echo "PROJECT FULL AUDIT"
echo "============================================================"
echo "Project     : $PROJECT_NAME"
echo "Path        : $PROJECT_ROOT"
echo "Generated   : $(date '+%Y-%m-%d %H:%M:%S %z')"
echo "OS          : $(uname -a)"
echo ""

echo "============================================================"
echo "1. RUNTIME / TOOLCHAIN"
echo "============================================================"

echo "--- Node ---"
node --version 2>&1 || true

echo ""
echo "--- npm ---"
npm --version 2>&1 || true

echo ""
echo "--- Git ---"
git --version 2>&1 || true

echo ""
echo "--- Prisma ---"
npx prisma --version 2>&1 || true

echo ""

echo "============================================================"
echo "2. GIT STATUS"
echo "============================================================"

git status --short 2>&1 || true

echo ""
echo "--- Current branch ---"
git branch --show-current 2>&1 || true

echo ""
echo "--- Last commits ---"
git log --oneline -10 2>&1 || true

echo ""

echo "============================================================"
echo "3. PROJECT DIRECTORY TREE"
echo "============================================================"

find . \
  \( \
    -path './node_modules' -o \
    -path './node_modules/*' -o \
    -path './.git' -o \
    -path './.git/*' -o \
    -path './.tanstack' -o \
    -path './.tanstack/*' -o \
    -path './dist' -o \
    -path './dist/*' -o \
    -path './build' -o \
    -path './build/*' -o \
    -path './.vercel' -o \
    -path './.vercel/*' -o \
    -path './src/generated' -o \
    -path './src/generated/*' \
  \) -prune \
  -o -print \
  | sort

echo ""

echo "============================================================"
echo "4. PACKAGE.JSON"
echo "============================================================"

if [ -f package.json ]; then
  cat package.json
else
  echo "package.json NOT FOUND"
fi

echo ""

echo "============================================================"
echo "5. INSTALLED DEPENDENCIES"
echo "============================================================"

npm ls --depth=0 2>&1 || true

echo ""

echo "============================================================"
echo "6. ENVIRONMENT VARIABLE NAMES"
echo "VALUES ARE INTENTIONALLY REDACTED"
echo "============================================================"

if [ -f .env ]; then
  grep -E '^[A-Za-z_][A-Za-z0-9_]*=' .env \
    | sed -E 's/=.*$/=[REDACTED]/'
else
  echo ".env NOT FOUND"
fi

echo ""

for ENV_FILE in .env.local .env.development .env.production; do
  if [ -f "$ENV_FILE" ]; then
    echo "--- $ENV_FILE ---"

    grep -E '^[A-Za-z_][A-Za-z0-9_]*=' "$ENV_FILE" \
      | sed -E 's/=.*$/=[REDACTED]/'

    echo ""
  fi
done

echo "============================================================"
echo "7. PRISMA SCHEMA"
echo "============================================================"

if [ -f prisma/schema.prisma ]; then
  cat prisma/schema.prisma
else
  echo "prisma/schema.prisma NOT FOUND"
fi

echo ""

echo "============================================================"
echo "8. PRISMA MIGRATIONS"
echo "============================================================"

if [ -d prisma/migrations ]; then
  find prisma/migrations \
    -type f \
    -name '*.sql' \
    | sort \
    | while IFS= read -r file; do

        echo ""
        echo "############################################################"
        echo "FILE: $file"
        echo "############################################################"

        cat "$file"
      done
else
  echo "No prisma/migrations directory"
fi

echo ""

echo "============================================================"
echo "9. PROJECT CONFIGURATION FILES"
echo "============================================================"

CONFIG_FILES=(
  "vite.config.ts"
  "tsconfig.json"
  "tsr.config.json"
  "prisma7.config.ts"
  "components.json"
  "eslint.config.js"
  "prettier.config.js"
  ".prettierignore"
  ".gitignore"
  "vercel.json"
  ".cta.json"
)

for file in "${CONFIG_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo ""
    echo "############################################################"
    echo "FILE: $file"
    echo "############################################################"

    cat "$file"
  fi
done

echo ""

echo "============================================================"
echo "10. FULL APPLICATION SOURCE CODE"
echo "============================================================"

if [ -d src ]; then

  find src \
    -type f \
    ! -path 'src/generated/*' \
    \( \
      -name '*.ts' -o \
      -name '*.tsx' -o \
      -name '*.js' -o \
      -name '*.jsx' -o \
      -name '*.css' -o \
      -name '*.json' \
    \) \
    | sort \
    | while IFS= read -r file; do

        echo ""
        echo ""
        echo "############################################################"
        echo "FILE: $file"
        echo "############################################################"
        echo ""

        cat "$file"
      done
else
  echo "src directory NOT FOUND"
fi

echo ""

echo "============================================================"
echo "11. OTHER ROOT SOURCE FILES"
echo "============================================================"

find . \
  -maxdepth 1 \
  -type f \
  \( \
    -name '*.ts' -o \
    -name '*.tsx' -o \
    -name '*.js' -o \
    -name '*.jsx' \
  \) \
  | sort \
  | while IFS= read -r file; do

      echo ""
      echo "############################################################"
      echo "FILE: $file"
      echo "############################################################"

      cat "$file"
    done

echo ""

echo "============================================================"
echo "12. SEARCH FOR TODO / FIXME / HACK / ERROR"
echo "============================================================"

grep -RniE \
  'TODO|FIXME|HACK|XXX|console\.error|throw new Error' \
  src prisma \
  --exclude-dir=generated \
  2>/dev/null || true

echo ""

echo "============================================================"
echo "13. SEARCH FOR OLD OCR / AI AGENT REMNANTS"
echo "============================================================"

grep -RniE \
  'tesseract|opencv|KKScanner|KKScanResult|KKTableScanner|kk-image-table|kk-scanner|useKKScanner|useKKOcr|claude|cursor|devin|windsurf|\.agents' \
  src prisma package.json \
  2>/dev/null || true

echo ""

echo "============================================================"
echo "14. TYPESCRIPT CHECK"
echo "============================================================"

npx tsc --noEmit 2>&1 || true

echo ""

echo "============================================================"
echo "15. ESLINT CHECK"
echo "============================================================"

npm run lint 2>&1 || true

echo ""

echo "============================================================"
echo "16. BUILD CHECK"
echo "============================================================"

npm run build 2>&1 || true

echo ""

echo "============================================================"
echo "17. DATABASE / PRISMA VALIDATION"
echo "============================================================"

npx prisma validate 2>&1 || true

echo ""

echo "============================================================"
echo "18. FILE SIZE SUMMARY"
echo "============================================================"

du -sh . 2>/dev/null || true
du -sh src prisma node_modules 2>/dev/null || true

echo ""

echo "============================================================"
echo "AUDIT COMPLETE"
echo "============================================================"
echo "Generated file:"
echo "$OUTPUT"
echo ""
echo "SECURITY:"
echo "- .env values were NOT included."
echo "- node_modules was NOT included."
echo "- .git was NOT included."
echo "- src/generated Prisma client was NOT included."
echo "============================================================"

