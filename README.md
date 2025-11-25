# CodeSolutions: Sistema de Gestión de Proyectos

CodeSolutions es una aplicación web  y escalable desarrollada con Node.js, Express y MongoDB. Diseñada bajo el patrón MVC, permite la gestión integral de recursos empresariales con un fuerte enfoque en la seguridad, roles de usuario y automatización de flujos de trabajo.

🔗 **[Ver Demo Desplegada en Render](https://codesolutions-rgjw.onrender.com/)**

## Usuarios de Demostración

Estos accesos permiten explorar la aplicación con distintos roles.

> **Nota:** Todos los datos del sistema son ficticios y fueron creados únicamente con fines académicos.

| Rol | Usuario | Contraseña |
| :--- | :--- | :--- |
| **Administrador** | `luis.castillo@codesolutions.com` | `CastilloCode@85` |
| **Contadora** | `valentina.gomez@codesolutions.com` | `valeGo36$` |
| **Desarrollador** | `martin.rojas@codesolutions.com` | `Red!martin25` |
| **Jefe de Proyecto** | `patricia.ortega@codesolutions.com` | `%ProCode19` |
| **Soporte** | `elena.navarro@codesolutions.com` | `Ele*Navarr0` |

## Características Principales

### Seguridad y Autenticación
* **Autenticación Robusta:** Registro e inicio de sesión seguro utilizando **JWT (JSON Web Tokens)** almacenados en cookies `httpOnly` para prevenir ataques XSS.
* **Hashing de Contraseñas:** Encriptación automática mediante `bcryptjs` y hooks de Mongoose (`pre-save`).
* **Validación Doble:** Verificación de seguridad de contraseñas tanto en el frontend (feedback en tiempo real) como en el backend (Middlewares).

### Control de Acceso (RBAC)
* **Sistema de Roles:** Middleware personalizado (`rol.js`) que restringe el acceso a rutas y vistas según el perfil del usuario (`admin`, `soporte`, `desarrollador`, etc.).
* **Herencia de Permisos:** Al registrar un usuario, este hereda automáticamente el nivel de acceso configurado en su ficha de empleado.

### Módulo de Soporte y Automatización
* **Gestión de Tickets:** Ciclo de vida completo de incidencias (Crear, Editar, Listar, Cerrar).
* **Trazabilidad:** Vinculación automática del ticket con el usuario autenticado.
* **Automatización de Tareas:** Lógica de negocio avanzada que convierte automáticamente un Ticket de Soporte en una Tarea de Desarrollo si se asigna a un perfil técnico (Desarrollador/Jefe de Proyecto), cerrando el circuito administrativo-técnico.

### Gestión de Recursos (CRUDs)
* **Proyectos y Empleados:** Administración completa con validaciones de negocio.
* **Reportes Dinámicos:** Visualización de métricas de avance y horas trabajadas.

## Stack de Tecnologías

* **Backend:** Node.js, Express.js
* **Base de Datos:** MongoDB Atlas (Mongoose ODM)
* **Frontend:** Pug (Motor de plantillas), Bootstrap 5, Vanilla JS.
* **Seguridad:** `bcryptjs`, `jsonwebtoken`, `cookie-parser`.
* **Utilitarios:** `dotenv` (variables de entorno), `method-override`.

---

## Instalación y Desarrollo Local

Si deseas ejecutar este proyecto en tu máquina local para desarrollo o pruebas, sigue estos pasos:

### 1. Prerrequisitos
* [Node.js](https://nodejs.org/) (v16 o superior)
* Una cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas/database) (o una instancia local de MongoDB).

### 2. Clonar el Repositorio
```bash
git clone [https://github.com/tu-usuario/codesolutions.git](https://github.com/tu-usuario/codesolutions.git)
cd codesolutions
```

### 3. Instalar Dependencias

```bash
npm install
```

### 4. Configurar Variables de Entorno
Este proyecto utiliza un archivo `.env.example` como plantilla.

### 5. Ejecutar el Servidor
Una vez instaladas las dependencias y cargada la base de datos, iniciar el servidor:

```bash
# Para producción
npm start
```

```bash
# O para desarrollo (si se cuenta con nodemon)
npm run dev
```
Visita http://localhost:3000 en tu navegador.

## Despliegue

Este proyecto está configurado para desplegarse en **Render**.

* El archivo `app.js` utiliza `process.env.PORT` para la asignación dinámica de puertos en la nube.
* Las credenciales sensibles (`MONGO_URI`, `JWT_SECRET`) **no se suben al repositorio**; se configuran directamente en las variables de entorno del servicio de hosting.
