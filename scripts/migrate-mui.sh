#!/bin/bash

# Script de migración automática de Material-UI v4 a MUI v5
# Usa codemods oficiales de MUI

set -e

echo "========================================="
echo "GESTDOC - Migración Material-UI v4 → MUI v5"
echo "========================================="
echo ""

# Verificar que jscodeshift esté instalado
if ! command -v jscodeshift &> /dev/null; then
    echo "⚠️  jscodeshift no está instalado. Instalando..."
    npm install -g jscodeshift
fi

echo "✅ jscodeshift instalado"
echo ""

# Función para migrar un paquete
migrate_package() {
    local package_path=$1
    local package_name=$2
    
    echo "📦 Migrando $package_name..."
    echo "   Ruta: $package_path"
    echo ""
    
    if [ ! -d "$package_path/src" ]; then
        echo "⚠️  Directorio src no encontrado en $package_path"
        return 1
    fi
    
    # Ejecutar codemods
    echo "   🔄 Aplicando preset-safe..."
    npx @mui/codemod v5.0.0/preset-safe "$package_path/src" --ignore-pattern="node_modules"
    
    echo "   ✅ $package_name migrado"
    echo ""
}

# Migrar admin-frontend
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Admin Frontend"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
migrate_package "./packages/admin-frontend" "Admin Frontend"

# Migrar express-frontend
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2. Express Frontend"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
migrate_package "./packages/express-frontend" "Express Frontend"

echo "========================================="
echo "✅ Migración completada"
echo "========================================="
echo ""
echo "⚠️  IMPORTANTE:"
echo "1. Revisa los cambios con: git diff"
echo "2. Prueba la aplicación: npm start"
echo "3. Ejecuta los tests: npm test"
echo "4. Algunos cambios pueden requerir ajustes manuales"
echo ""
echo "📚 Consulta MIGRATION_GUIDE.md para más detalles"
echo ""
