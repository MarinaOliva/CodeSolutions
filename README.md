# CodeSolutions: Sistema de Gestión de Proyectos

CodeSolutions es una aplicación web full-stack desarrollada con Node.js, Express y MongoDB, diseñada para la gestión integral de proyectos, empleados y tareas dentro de una organización.

## Características Principales

* **Gestión de Proyectos (CRUD):** Creación, lectura, actualización y baja lógica de proyectos.
* **Gestión de Empleados (CRUD):** Administración del personal.
* **Gestión de Tareas (CRUD):** Creación y asignación de tareas con seguimiento de horas.
* **Generación de Reportes:** Creación de reportes dinámicos sobre el avance de proyectos y las horas trabajadas por empleado.
* **Interfaz Responsiva:** Front-end moderno y 100% responsivo construido con Pug y Bootstrap 5.

## Stack de Tecnologías

* **Backend:** Node.js, Express.js
* **Base de Datos:** MongoDB (con Mongoose)
* **Motor de Plantillas (Frontend):** Pug 
* **Framework de UI:** Bootstrap 5
* **Utilitarios:**
    * `dotenv` para la gestión de variables de entorno.
    * `method-override` para habilitar los métodos PUT/DELETE desde formularios HTML.

## Instalación y Puesta en Marcha

Para ejecutar este proyecto:

### 1. Prerrequisitos

* [Node.js](https://nodejs.org/) (v16 o superior)
* [MongoDB](https://www.mongodb.com/try/download/community) (tener una instancia local o una URI de MongoDB Atlas)

### 2. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/codesolutions.git
cd codesolutions
```

### 3. Instalar Dependencias

```bash
npm install
```

### 4. Configurar Variables de Entorno
Este proyecto utiliza un archivo `.env.example` como plantilla. En este punto del proyecto, se puede copiar su contenido a un archivo `.env` local. que debe ser creado previamente en la raíz del proyecto.

### 5. Cargar la Base de Datos (Inicialización)

Antes de arrancar la app por primera vez, ejecutar el script `initDB.js` para poblar la base de datos con los datos iniciales.

```bash
node src/config/initDB.js
```

### 6. Ejecutar el Servidor
Una vez instaladas las dependencias y cargada la base de datos, iniciar el servidor:

```bash
# Para producción
npm start
```

```bash
# O para desarrollo (si se cuenta con nodemon)
npm run dev
```