# GESTDOC - Scripts de Utilidad

## Migración

### migrate-mui.sh

Script automático para migrar de Material-UI v4 a MUI v5 usando codemods oficiales.

**Uso:**
```bash
cd /path/to/gestdoc
./scripts/migrate-mui.sh
```

**Qué hace:**
1. Verifica que jscodeshift esté instalado
2. Ejecuta codemods de MUI en admin-frontend
3. Ejecuta codemods de MUI en express-frontend
4. Actualiza imports automáticamente
5. Actualiza componentes deprecated

**Después de ejecutar:**
1. Revisar cambios: `git diff`
2. Probar aplicación: `npm start`
3. Ejecutar tests: `npm test`
4. Ajustar manualmente lo que sea necesario

**Nota**: Algunos cambios complejos pueden requerir ajustes manuales. Consulta `MIGRATION_GUIDE.md` para más detalles.

## Futuros Scripts

- `migrate-router.sh` - Migración de React Router v5 → v6
- `migrate-mongoose.sh` - Migración de Mongoose v5 → v8
- `update-aws-sdk.sh` - Actualización de AWS SDK v2 → v3 en controladores
