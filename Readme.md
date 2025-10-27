# **Smart Recipe Planner API**

![API Status](https://img-shields.io/website?down_color=lightgrey&down_message=offline&style=for-the-badge&up_color=green&up_message=online&url=https%3A%2F%2Fsmart-recipe-planner-api.onrender.com%2Fapi%2Fv1)
![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js)
![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express)
![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-336791?style=for-the-badge&logo=postgresql)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens)

API RESTful robusta y escalable para una aplicación de planificación de recetas inteligentes. Diseñada con principios de **seguridad por diseño** y una **arquitectura de capas profesional**, esta API proporciona la base para gestionar usuarios, recetas, inventarios y la generación de menús semanales.

## 🌐 **API en Vivo**

La API está desplegada en Render y es accesible públicamente.

**URL Base:** `https://smart-recipe-planner-api.onrender.com/api/v1`

---

## ✨ **Características Destacadas**

* **Arquitectura Profesional:** Implementación estricta del patrón **Controlador-Servicio-Repositorio** para una máxima mantenibilidad y separación de responsabilidades.
* **Autorización a Nivel de Base de Datos:** Lógica de permisos robusta que previene **IDOR (Insecure Direct Object Reference)** al incluir el `user_id` en la cláusula `WHERE` de todas las consultas sensibles.
* **Transacciones Atómicas:** Las operaciones complejas, como la creación de una receta con sus ingredientes y multimedia, se ejecutan dentro de una **transacción de base de datos** (`$transaction`), garantizando la integridad de los datos.
* **Feed Eficiente:** El endpoint de recetas públicas utiliza **paginación por cursor compuesto** (`createdAt` + `id`) y un **índice de base de datos** para un rendimiento óptimo en *infinite scroll*.
* **Validación Rigurosa:** Todos los datos de entrada (`body`, `query`, `params`) son validados y saneados por schemas de **Zod** a través de un middleware genérico.
* **Seguridad de Contraseñas:** Las credenciales de usuario se protegen mediante hashing con **bcrypt**.

---

## 🏛️ **Arquitectura**

El proyecto sigue un diseño de capas claro que aísla la lógica de negocio del framework y del acceso a datos.



1.  **Capa de Rutas (`routes`):** Define los endpoints y encadena los middlewares.
2.  **Capa de Middlewares (`middlewares`):** Maneja preocupaciones transversales como `authentication.js`, `validateSchema.js` y un `errorHandler.js` centralizado.
3.  **Capa de Controladores (`controllers`):** Orquesta el flujo HTTP, extrayendo datos validados de `req`.
4.  **Capa de Servicios (`services`):** Contiene la lógica de negocio pura, agnóstica al protocolo HTTP.
5.  **Capa de Repositorios (`repositories`):** Es la única capa que interactúa con la base de datos a través de **Prisma**, encapsulando todas las consultas.

---

## 🛡️ **Mitigación de Amenazas (OWASP)**

La API ha sido construida con la seguridad como una prioridad, mitigando varias de las amenazas más críticas del **OWASP Top 10**:

* **A01: Broken Access Control:** Prevenido mediante la validación del `user_id` del token JWT en las cláusulas `WHERE` de las consultas a la base de datos.
* **A02: Cryptographic Failures:** Prevenido mediante el hashing de contraseñas con `bcrypt`.
* **A03: Injection:** Prevenido por el uso de **Prisma ORM** (que parametriza todas las consultas) y la validación estricta de **Zod**.
* **A05: Security Misconfiguration:** Los secretos se gestionan a través de variables de entorno (`.env`) y no se incluyen en el repositorio.
* **A08: Software and Data Integrity Failures:** Prevenido por la validación de Zod, que asegura que todos los datos que ingresan al sistema tienen la estructura y el tipo correctos.

---

## 🚀 **Cómo Empezar**

Sigue estos pasos para levantar un entorno de desarrollo local.

### **Prerrequisitos**

* Node.js (v18 o superior)
* PNPM
* PostgreSQL

### **Instalación**

1.  **Clona el repositorio:**
    ```bash
    git clone [https://github.com/LuisDavidTF/smart-recipe-planner-api.git](https://github.com/LuisDavidTF/smart-recipe-planner-api.git)
    cd smart-recipe-planner-api
    ```

2.  **Instala las dependencias:**
    ```bash
    pnpm install
    ```

3.  **Configura las variables de entorno:**
    * Crea una copia del archivo de ejemplo `.env.example` y renómbralo a `.env`.
    * Rellena las variables, especialmente `DATABASE_URL` y `JWT_SECRET`.
    ```bash
    cp .env.example .env
    ```

4.  **Aplica las migraciones a la base de datos:**
    ```bash
    pnpm prisma migrate dev
    ```

5.  **Inicia el servidor de desarrollo:**
    ```bash
    pnpm run dev
    ```
    La API estará disponible en `http://localhost:3000`.

---

## 📚 **Endpoints de la API**

| Método | Ruta                      | Descripción                                     | Autenticación |
| :----- | :------------------------ | :---------------------------------------------- | :------------ |
| `POST` | `/api/v1/users/register`   | Registra un nuevo usuario.                      | No requerida  |
| `POST` | `/api/v1/users/login`      | Inicia sesión y devuelve un JWT.                | No requerida  |
| `POST` | `/api/v1/recipes/create`         | Crea una nueva receta.                          | Requerida     |
| `GET`  | `/api/v1/recipes`         | Obtiene el feed de recetas públicas (paginado). | Opcional      |
| `GET`  | `/api/v1/recipes/:id`     | Obtiene una receta por su ID.                   | Opcional      |
| `PATCH`| `/api/v1/recipes/:id`     | Actualiza una receta existente.                 | Requerida     |
| `DELETE`| `/api/v1/recipes/:id`    | Elimina una receta.                             | Requerida     |
