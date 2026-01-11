# Frontend de Gestdoc Express

Proyecto en React para Gestdoc Express

## Configuración

Se deben configurar los secretos del repositorio:

- **AWS_ACCESS_KEY_ID** : ID de clave de acceso AWS
- **AWS_SECRET_ACCESS_KEY** : Clase de acceso secreta de AWS
- **AWS_REGION** : Región de AWS (actualmente **us-east-1**)
- **AWS_S3_BUCKET** : Nombre del bucket en S3, tiene que ser el mismo nombre del dominio (ahora **devfront.gestdocexpress.cl**)
- **DOT_ENV_REACT_64** : Contenido en Base64 del archivo **.env** del proyecto React

Para convertir el contenido del archivo **.env** en base64, se puede utilizar la siguiente web: [https://www.base64encode.org](https://www.base64encode.org)

## Entorno de pruebas

Para poder visualizar los cambios subidos en desarrollo, basta con crear un **Pull Request**.

Cada vez que se abra o reabra un Pull Request, se disparará un Github Action que actualizará el contenido del sitio [http://devfront.gestdocexpress.cl](http://devfront.gestdocexpress.cl).

**Nota**: Se recomienda que si se suben cambios en un pull request, se cierre y se reabra el pull request para generar un nuevo compilado en el sitio de pruebas.

#env version
1.0.0