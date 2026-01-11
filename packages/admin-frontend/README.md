Gestdoc Admin


Lo que se tiene que saber de este software.

1)Este sistema funciona con la API en Node de Gestdoc Admin y de Gestdoc Express API, ya que en la parte de operaciones, cuando se genera el paso a paso, el algoritmo que resuelve eso esta en Gestdoc Express, asi no hay duplicidad de codigo.



Variables de entorno que merecen explicacion

 REACT_APP_EXP   esta variable se refiere  al ID que tiene la compañia de Gestdoc Express... ya que esa compañia tendra cosas que no aplican para las otras empresas, como por ejemplo la opcion de plantilla HTML. por lo que el ID se saca del ObjectID de la collection en mongo atlas correspondiente a companies... 


REACT_EXPRESS_API  es la direccion de donde estara Gestdoc Admin


<a href="https://material-ui.com/store/items/bamburgh-react-admin-dashboard-pro">Bamburgh React Crypto Application with Material-UI PRO</a>
    
REACT_APP_SENTRY este es un servicio que monitorea los bugs. está configurado con una cuenta mencionada en la documentación del gestdoc

////////////Miselaneos////////////
¿Cómo añadir un paso nuevo al BPMN?
esto se hace en el archivo src/Container/Bpmn/properties-panel/PropertiesView.js

## Configuración

Se deben configurar los secretos del repositorio:

- **AWS_ACCESS_KEY_ID** : ID de clave de acceso AWS
- **AWS_SECRET_ACCESS_KEY** : Clase de acceso secreta de AWS
- **AWS_REGION** : Región de AWS (actualmente **us-east-1**)
- **AWS_S3_BUCKET** : Nombre del bucket en S3, tiene que ser el mismo nombre del dominio (ahora **admindevfront.gestdocexpress.cl**)
- **DOT_ENV_REACT_64** : Contenido en Base64 del archivo **.env** del proyecto React

Para convertir el contenido del archivo **.env** en base64, se puede utilizar la siguiente web: [https://www.base64encode.org](https://www.base64encode.org)

## Entorno de pruebas

Para poder visualizar los cambios subidos en desarrollo, basta con crear un **Pull Request**.
Cada vez que se abra o reabra un Pull Request, se disparará un Github Action que actualizará el contenido del sitio [http://admindevfront.gestdocexpress.cl](http://admindevfront.gestdocexpress.cl).

**Nota**: Se recomienda que si se suben cambios en un pull request, se cierre y se reabra el pull request para generar un nuevo compilado en el sitio de pruebas.

## Version env
1.0.2