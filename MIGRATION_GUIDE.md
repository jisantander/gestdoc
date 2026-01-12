# GESTDOC - Guía de Migración

## React 18 Migration

### ✅ Completado

**index.js actualizado en ambos frontends:**

```javascript
// Antes (React 16/17)
import ReactDOM from 'react-dom';
ReactDOM.render(<App />, document.getElementById('root'));

// Ahora (React 18)
import { createRoot } from 'react-dom/client';
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
```

### Nuevas Características de React 18

- **Automatic Batching**: Múltiples setState se agrupan automáticamente
- **Transitions**: Marca actualizaciones como no urgentes con `useTransition`
- **Suspense**: Mejor soporte para lazy loading
- **Concurrent Rendering**: Mejor rendimiento en apps grandes

## Material-UI v4 → MUI v5 Migration

### Cambios de Imports

**Paquetes:**
```javascript
// Antes
import { Button } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { DatePicker } from '@material-ui/pickers';

// Ahora
import { Button } from '@mui/material';
import { Alert } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
```

**Iconos:**
```javascript
// Antes
import AddIcon from '@material-ui/icons/Add';

// Ahora
import AddIcon from '@mui/icons-material/Add';
```

### Sistema de Estilos

**makeStyles → styled o sx prop:**

```javascript
// Antes
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}));

function Component() {
  const classes = useStyles();
  return <div className={classes.root}>Content</div>;
}

// Opción 1: sx prop (recomendado para estilos simples)
function Component() {
  return <Box sx={{ p: 2 }}>Content</Box>;
}

// Opción 2: styled (recomendado para componentes reutilizables)
import { styled } from '@mui/material/styles';

const StyledDiv = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
}));

function Component() {
  return <StyledDiv>Content</StyledDiv>;
}
```

### Cambios en Componentes

**Box:**
```javascript
// Antes
<Box display="flex" justifyContent="center">

// Ahora (igual, pero con mejor TypeScript)
<Box display="flex" justifyContent="center">
```

**Grid:**
```javascript
// Antes
<Grid container spacing={2}>
  <Grid item xs={12} sm={6}>

// Ahora (igual)
<Grid container spacing={2}>
  <Grid item xs={12} sm={6}>
```

**TextField:**
```javascript
// Antes
<TextField variant="outlined" />

// Ahora (variant="outlined" es el default)
<TextField />
```

**Button:**
```javascript
// Antes
<Button color="primary" variant="contained">

// Ahora (igual)
<Button color="primary" variant="contained">
```

### Theme

**createMuiTheme → createTheme:**

```javascript
// Antes
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

// Ahora
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});
```

### Codemod Automático

MUI proporciona codemods para migración automática:

```bash
# Instalar jscodeshift
npm install -g jscodeshift

# Ejecutar codemod
npx @mui/codemod v5.0.0/preset-safe packages/admin-frontend/src
npx @mui/codemod v5.0.0/preset-safe packages/express-frontend/src
```

## React Router v5 → v6 Migration

### Cambios Principales

**Switch → Routes:**
```javascript
// Antes
import { Switch, Route } from 'react-router-dom';

<Switch>
  <Route path="/home" component={Home} />
  <Route path="/about" component={About} />
</Switch>

// Ahora
import { Routes, Route } from 'react-router-dom';

<Routes>
  <Route path="/home" element={<Home />} />
  <Route path="/about" element={<About />} />
</Routes>
```

**Exact ya no es necesario:**
```javascript
// Antes
<Route exact path="/" component={Home} />

// Ahora
<Route path="/" element={<Home />} />
```

**useHistory → useNavigate:**
```javascript
// Antes
import { useHistory } from 'react-router-dom';

function Component() {
  const history = useHistory();
  const handleClick = () => history.push('/home');
}

// Ahora
import { useNavigate } from 'react-router-dom';

function Component() {
  const navigate = useNavigate();
  const handleClick = () => navigate('/home');
}
```

**useRouteMatch → useMatch:**
```javascript
// Antes
import { useRouteMatch } from 'react-router-dom';
const match = useRouteMatch('/users/:id');

// Ahora
import { useMatch } from 'react-router-dom';
const match = useMatch('/users/:id');
```

**Redirect → Navigate:**
```javascript
// Antes
import { Redirect } from 'react-router-dom';
<Redirect to="/home" />

// Ahora
import { Navigate } from 'react-router-dom';
<Navigate to="/home" replace />
```

**Nested Routes:**
```javascript
// Antes
<Route path="/users">
  <Users />
</Route>

function Users() {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/:id`} component={UserDetail} />
    </Switch>
  );
}

// Ahora
<Route path="/users/*" element={<Users />} />

function Users() {
  return (
    <Routes>
      <Route path=":id" element={<UserDetail />} />
    </Routes>
  );
}
```

## Mongoose v5 → v8 Migration

### Cambios en Queries

**Callbacks → Promises:**
```javascript
// Antes
User.find({}, (err, users) => {
  if (err) return handleError(err);
  console.log(users);
});

// Ahora
try {
  const users = await User.find({});
  console.log(users);
} catch (err) {
  handleError(err);
}
```

**mongoose-paginate → mongoose-paginate-v2:**
```javascript
// Antes
const mongoosePaginate = require('mongoose-paginate');
UserSchema.plugin(mongoosePaginate);

// Ahora
const mongoosePaginate = require('mongoose-paginate-v2');
UserSchema.plugin(mongoosePaginate);
```

### Deprecations Removidas

- `usePushEach` ya no es necesario
- `useNewUrlParser` ya no es necesario
- `useUnifiedTopology` ya no es necesario
- `useFindAndModify` ya no es necesario

```javascript
// Antes
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

// Ahora
mongoose.connect(uri);
```

## AWS SDK v2 → v3 Migration

### ✅ Completado

Creado servicio `services/s3Service.js` con API moderna.

**Uso:**
```javascript
const { uploadFile, downloadFile, deleteFile } = require('./services/s3Service');

// Upload
await uploadFile({
  bucket: 'my-bucket',
  key: 'path/to/file.pdf',
  body: fileBuffer,
  contentType: 'application/pdf'
});

// Download
const fileBuffer = await downloadFile({
  bucket: 'my-bucket',
  key: 'path/to/file.pdf'
});

// Delete
await deleteFile({
  bucket: 'my-bucket',
  key: 'path/to/file.pdf'
});
```

## Pasos de Migración Recomendados

### 1. Testing Antes de Migrar
```bash
npm test
```

### 2. Migración Gradual

**Orden recomendado:**
1. ✅ React 18 (completado)
2. Material-UI → MUI v5 (usar codemods)
3. React Router v6
4. Mongoose v8
5. AWS SDK v3 en controladores

### 3. Testing Después de Cada Paso
```bash
npm test
npm run lint
npm run build
```

### 4. Actualizar Documentación

Documentar cambios específicos del proyecto.

## Recursos

- [React 18 Upgrade Guide](https://react.dev/blog/2022/03/08/react-18-upgrade-guide)
- [MUI Migration Guide](https://mui.com/material-ui/migration/migration-v4/)
- [React Router v6 Migration](https://reactrouter.com/en/main/upgrading/v5)
- [Mongoose 8 Migration Guide](https://mongoosejs.com/docs/migrating_to_8.html)
- [AWS SDK v3 Migration](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/migrating-to-v3.html)

---

**Nota**: Esta es una guía de referencia. Los cambios específicos deben hacerse gradualmente y con testing exhaustivo.
