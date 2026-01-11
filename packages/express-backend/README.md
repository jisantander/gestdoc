# Configuración de express-dummy

Se deben instalar las dependencias del proyecto:

```
npm install
```

Así mismo, se debe generar un archivo de configuración:

```
cp .env.example .env
```

## Para probar el servicio

Si estás en modo developer, tienes que utilizar [ngrok](https://ngrok.com) para que Flow llegue a comunicarse con tu backend.
Así mismo, se debe modificar el archivo **dummy/modelDoc.js** para tener un ID de transacción distinto.

## Sobre deployment

Register service

```
aws ecs register-task-definition --region us-east-1 --cli-input-json file://./task-definition.json
aws s3 cp Dockerrun.aws.json s3://gestdoc-eb/Dockerrun.aws.json
```

## Configuración para Github

Se deben configurar los secretos del repositorio:

-   **USER_NAME** : Usuario de Github (usuario con acceso a repositorio Front y Backend)
-   **ACCESS_TOKEN** : Token de Github (usuario con acceso a repositorio Front y Backend)
-   **AWS_ACCESS_KEY_ID** : ID de clave de acceso AWS
-   **AWS_SECRET_ACCESS_KEY** : Clase de acceso secreta de AWS
-   **DOT_ENV_64** : Contenido en Base64 del archivo **.env** del proyecto. Estas serán usadas en **testing**
-   **DOT_ENV_REACT_64** : Contenido en Base64 del archivo **.env** del proyecto React (frontend). Estas serán usadas en **testing**
-   **DOT_ENV_PROD_64** : Contenido en Base64 del archivo **.env** del proyecto. Estas serán usadas en **producción**
-   **DOT_ENV_PROD_REACT_64** : Contenido en Base64 del archivo **.env** del proyecto React (frontend). Estas serán usadas en **producción**
-   **SSH\_\_HOST**

Para convertir el contenido del archivo **.env** en base64, se puede utilizar la siguiente web: [https://www.base64encode.org](https://www.base64encode.org)

## Entorno de pruebas

Para poder visualizar los cambios subidos en desarrollo, basta con crear un **Pull Request**.
Cada vez que se abra o reabra un Pull Request, se disparará un Github Action que actualizará el contenido del sitio [http://dev.gestdocexpress.cl](http://dev.gestdocexpress.cl).

**Nota**: Se recomienda que si se suben cambios en un pull request, se cierre y se reabra el pull request para generar un nuevo compilado en el sitio de pruebas.

## Pase a producción

Bastará con hacer un push a **master** para que el Github Action principal se encargue de hacer el deployment en **AWS Elastic Beanstalk**.
Este push puede ser directo o al aprobar un pull request (se recomienda esta opción para haber primero probado en el entorno de pruebas)

## Historial de cambios GUI

-   2022-03-28: 1.2

## version env

verisión 1.0.2

##front
try to update front 1
