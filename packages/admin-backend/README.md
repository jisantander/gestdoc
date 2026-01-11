# gestoria-documental

Sistema de gestión documental para cliente ALC

## Configuración para Github

Se deben configurar los secretos del repositorio:

- **USER_NAME** : Usuario de Github (usuario con acceso a repositorio Front y Backend)
- **ACCESS_TOKEN** : Token de Github (usuario con acceso a repositorio Front y Backend)
- **AWS_ACCESS_KEY_ID** : ID de clave de acceso AWS
- **AWS_SECRET_ACCESS_KEY** : Clase de acceso secreta de AWS
- **DOT_ENV_64** : Contenido en Base64 del archivo **.env** del proyecto. Estas serán usadas en **testing**
- **DOT_ENV_REACT_64** : Contenido en Base64 del archivo **.env** del proyecto React (frontend). Estas serán usadas en **testing**
- **DOT_ENV_PROD_64** : Contenido en Base64 del archivo **.env** del proyecto. Estas serán usadas en **producción**
- **DOT_ENV_PROD_REACT_64** : Contenido en Base64 del archivo **.env** del proyecto React (frontend). Estas serán usadas en **producción**

Para convertir el contenido del archivo **.env** en base64, se puede utilizar la siguiente web: [https://www.base64encode.org](https://www.base64encode.org)

## Entorno de pruebas

Para poder visualizar los cambios subidos en desarrollo, basta con crear un **Pull Request**.
Cada vez que se abra o reabra un Pull Request, se disparará un Github Action que actualizará el contenido del sitio [http://devadmin.gestdoc.cl](http://admin.gestdocexpress.cl).

**Nota**: Se recomienda que si se suben cambios en un pull request, se cierre y se reabra el pull request para generar un nuevo compilado en el sitio de pruebas.

## Pase a producción

Bastará con hacer un push a **master** para que el Github Action principal se encargue de hacer el deployment en **AWS Elastic Beanstalk**.
Este push puede ser directo o al aprobar un pull request (se recomienda esta opción para haber primero probado en el entorno de pruebas)
