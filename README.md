# ReadingTracker

# Developed by Juan Luis Blanco de los Santos - Máster Universitario en Desarrollo de sitios y aplicaciones web - UOC 2022

# INSTRUCCIONES DE USO

La aplicación estará disponible únicamente para usuarios registrados. La “landing page” mostrará una breve descripción del proyecto y dos botones, uno para acceder a la página de registro y otro para acceder a la página donde hacer login.

Una vez que el usuario ha hecho login se le redigirá a su home page. Aquí se mostrará un resumen de sus estadísticas y los últimos títulos añadidos a sus librerías.

En la barra de navegación habrá un botón para realizar búsquedas. En la página de búsqueda el usuario podrá introducir diferentes parámetros y se mostrarán diez resultados en pantalla. El usuario podrá hacer clic en los resultados y acceder a la página individual de un libro. Aquí se mostrará información detallada sobre el libro y el usuario podrá incluirlo en sus librerías. El usuario tendrá diferentes apartados o “shelves” donde mover el libro: “want to read”, “read” y “reading”. Si el usuario marca un título como “want to read” se pasará la información a la base de datos sin ofrecer la opción de añadir valoración o notas hasta que el libro se marque como leído o “read”. Si el título se ha marcado como “read” se mostrará un formulario con campos para indicar la fecha en la que se empezó a leer, la fecha en la que se terminó, la valoración con un sistema de cinco estrellas, y una sección para escribir notas sobre el libro.
El usuario podrá acceder a su librería en una sección titulada “Shelves”. Aquí se podrán filtrar los libros en función de su estado en las tres listas. Además, se podrán ordenar en orden ascendente o descendente por título, estrellas y fechas.

También se podrá acceder a un apartado “Stats” que mostrará datos personalizados a través de gráficos y cards. Debido a las limitaciones de Google Books API, estas estadísticas se centrarán en mostrar información sobre el número de páginas leídas, el libro más corto y largo que ha leído el usuario, y dos top cinco en un gráfico de barras, uno con los nombres de los autores más leídos y otro con los géneros que más se repiten en los libros leídos por el usuario.

Por último, el usuario puede acceder la página “Account” donde podrá cambiar su contraseña, exportar sus datos en formato .csv, y borrar su cuenta.

Además, lo usuarios podrán recuperar su cuenta si han olvidado la contraseña. Tendrán que introducir su correo electrónico y nombre de usuario. Si estos datos son correctos se enviará un correo a su cuenta con una contraseña generada por el servidor.

# INSTRUCCIONES DE INSTALACIÓN

La aplicación ha sido desarrollada de manera local con XAMPP, phpMyAdmin y Visual Studio Code. El front-end y el back-end se han desarrollado en paralelo mediante el uso de Angular CLI y NodeJS respectivamente.

A la hora del despliegue, los archivos pertenecientes al servidor se han incorporado al directorio raíz del proyecto de Angular. Estos archivos son:

• server.js que contiene el código principal de nuestro servidor.

• Una carpeta config que contiene el archivo config.json y un archivo db.config.js que alberga el código referente a la conexión con la base de datos mediante Sequelize.

• Por último, una carpeta con el nombre de sequelize-models que contiene dos archivos referentes a los modelos para crear las dos tablas principales de nuestra base de datos, Books.js y User.js.

El siguiente paso consistió en acoplar el código con las dependencias relevantes de los archivos package.json del servidor y el front-end en un solob archivo dentro del proyecto de Angular..

Además, se ha añadido la configuración de los motores que levantarán el proyecto.

1.  "engines": {
2.  "npm": "8.3.1",
3.  "node": "16.14.0"
4.  }

Este archivo package.json está disponible en el repositorio adjunto con esta memoria y contiene todos los scripts necesarios para levantar el proyecto usando Heroku.

Heroku es la PaaS elegida para el alojamiento de la aplicación ya que es una plataforma gratuita y además es compatible con los entornos de desarrollo más actuales, incluidas aplicaciones de Angular con NodeJS en el servidor. La plataforma ofrece una librería de add-ons, tanto gratuitos como de pago, entre ellos algunos con los que se podrá configurar la base de datos para esta aplicación. En este caso, la base de datos usará MySQL y Sequelize, por ello se ha escogido JawsDB, ya que este add-on permite manejar una base de datos que es compatible con la última versión de Sequelize.

Una vez que se ha configurado el proyecto, se instalará Heroku CLI y Git. Desde Visual Studio Code se deberá abrir el directorio del proyecto utilizando Bash en la terminal y se seguirán las instrucciones proporcionadas por Heroku para inicializar un nuevo repositorio, subir todos los archivos y hacer el primer commit y push.

1. heroku git:remote -a reading-tracker-app

1. git add .
1. git commit -m "My first commit"
1. git push heroku main

Para el correcto funcionamiento de la aplicación, será fundamental definir algunas variables config a través de los settings en el portal de Heroku. Estas variables se listan a continuación:

• ACCESS_TOKEN_SECRET
REFRESH_TOKEN_SECRET
• DB_HOST
• DB_NAME
• DB_USER
DB_PASSWORD
• NODEMAILER_MAIL
• NODEMAILER_PASSWORD

Para crear los valores de los tokens de autorización se utiliza la librería crypto de Node.
Para obtener los valores de los tokens en ambas variables se ejecutará el siguiente comando en la terminal:

1. require("crypto").randomBytes(64).toString("hex")

La instalación del add-on JawsDB a través del portal de Heroku definirá automáticamente una variable config con la información necesaria para conectarse a la base de datos. Sin embargo, el uso de un ORM impide utilizar esta variable de forma directa para realizar la conexión, por lo que tendremos que crear subvariables manualmente para definir los valores del archivo db.config.js.

1.  const Sequelize = require("sequelize");
2.
3.  const sequelize = new Sequelize(
4.  process.env.DB_NAME,
5.  process.env.DB_USER,
6.  process.env.DB_PASSWORD,
7.  {
8.          host: process.env.DB_HOST,
9.          dialect: "mysql",
10.     port: "3306",
11. }
12. );
13. module.exports = sequelize;

El valor de la variable sigue el siguiente formato de acuerdo con la documentación oficial:

1. mysql://username:password@hostname:port/database

Una vez se hayan recibido los archivos, Heroku ejecutara por defecto el comando npm run start que en nuestro package.json apuntará al archivo con la lógica del servidor. Después se ejecutará el comando post-build como se ve a continuación:

1.  "scripts": {
2.  "start": "node server.js",
3.  "heroku-postbuild": "ng build --configuration=production"

Con esto se compilará la aplicación y se iniciará el servidor. Si no ha ocurrido ningún problema durante este proceso la aplicación debería estar disponible y funcionar correctamente.

Para implementar la recuperación de contraseñas por correo se deberá tener acceso a una cuenta de correo electrónico que sea compatible con nodemailer y definir los campos en el transporter:

1.  const nodemailer = require("nodemailer");
2.  const transporter = nodemailer.createTransport({
3.  service: "hotmail",
4.  auth: {
5.          user: process.env.NODEMAILER_MAIL,
6.          pass: process.env.NODEMAILER_PASSWORD,
7.  },
8.  });

## Project

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.2.5.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

# reading-tracker
