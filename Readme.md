# **Smart Recipe Planner API**

![API Status](https://img-shields.io/website?down_color=lightgrey&down_message=offline&style=for-the-badge&up_color=green&up_message=online&url=https%3A%2F%2Fsmart-recipe-planner-api.onrender.com%2Fapi%2Fv1)
![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js)
![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express)
![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-336791?style=for-the-badge&logo=postgresql)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens)

# Smart Recipe Planner API

> ⚠️ **ESTADO DEL PROYECTO: VERSIÓN DE REFERENCIA (v1)**
>
> Este repositorio representa la implementación inicial en **Node.js/Express**.
> Actualmente, el proyecto ha evolucionado a una arquitectura empresarial privada (v2.0) desarrollada con **Java & Spring Boot** y desplegada en **Koyeb** para producción.
>
> Este código se mantiene público con fines demostrativos de arquitectura, patrones de diseño y manejo de seguridad en entornos JavaScript. **La instancia pública en Render ha sido desactivada por motivos de seguridad.**

API RESTful robusta y escalable para una aplicación de planificación de recetas inteligentes. Diseñada con principios de **seguridad por diseño** y una **arquitectura de capas profesional**, esta API proporciona la base para gestionar usuarios, recetas y la generación de nuevas recetas mediante inteligencia artificial.

## 📝 Tabla de Contenidos

- [✨ Características Destacadas](#-características-destacadas)
- [🧠 Funcionalidad de IA](#-funcionalidad-de-ia)
- [📚 Documentación](#-documentación-de-la-api)
- [🏛️ Arquitectura](#️-arquitectura)
- [🛡️ Mitigación de Amenazas (OWASP)](#️-mitigación-de-amenazas-owasp)
- [🚀 Cómo Empezar (Local)](#-cómo-empezar)
- [⚙️ Variables de Entorno](#️-variables-de-entorno)
- [👤 Autor](#-autor)

---

## ✨ Características Destacadas

* **Arquitectura Profesional:** Implementación estricta del patrón **Controlador-Servicio-Repositorio** para una máxima mantenibilidad y separación de responsabilidades.
* **Generación de Recetas con IA:** Crea recetas completas a partir de una simple descripción de texto.
* **Seguridad Robusta:** Autorización a nivel de base de datos (previene IDOR), hashing de contraseñas con **bcrypt** y validación de esquemas estricta con **Zod**.
* **Transacciones Atómicas:** Las operaciones complejas se ejecutan dentro de transacciones de base de datos para garantizar la integridad de los datos (ACID).
* **Feed Eficiente:** Paginación por cursor compuesto para un rendimiento óptimo en *infinite scroll*.

## 🧠 Funcionalidad de IA

### Generación Mágica de Recetas

La API integra un modelo de IA (Gemini Flash) para generar recetas completas a partir de una simple solicitud de texto del usuario.

* **Entrada:** Una cadena de texto simple, como *"pasta con pollo para una cena rápida"* o *"un desayuno saludable con avena y frutas"*.
* **Salida:** Un objeto JSON estructurado que contiene:
    * `name`: Nombre de la receta.
    * `description`: Descripción breve.
    * `preparationTime`: Tiempo de preparación en minutos.
    * `ingredients`: Lista de ingredientes con nombre, cantidad y unidad.
    * `instructions`: Pasos de la preparación.
    * `type`: Tipo de comida (ej. "breakfast", "lunch", "dinner").
* **Límite de Uso:** Implementación de Rate Limiting lógico (ej. máximo 3 generaciones por día por usuario) para control de costos.

## 📚 Documentación de la API

La documentación detallada de los endpoints, incluyendo ejemplos de solicitudes y respuestas, se encuentra en el archivo `API_DOCS.md` dentro de este repositorio.

## 🏛️ Arquitectura

El proyecto sigue un diseño de capas claro que aísla la lógica de negocio del framework y del acceso a datos.

1.  **Capa de Rutas (`routes`):** Define los endpoints y encadena los middlewares.
2.  **Capa de Middlewares (`middlewares`):** Maneja `authentication`, `validateSchema` y `errorHandler`.
3.  **Capa de Controladores (`controllers`):** Orquesta el flujo HTTP (Request/Response).
4.  **Capa de Servicios (`services`):** Contiene la lógica de negocio pura y reglas de validación.
5.  **Capa de Repositorios (`repositories`):** Encapsula todas las consultas a la base de datos con Prisma ORM.

## 🛡️ Mitigación de Amenazas (OWASP)

La API ha sido construida con la seguridad como una prioridad:

* **A01: Broken Access Control:** Prevenido mediante la validación del `user_id` del token JWT en las cláusulas `WHERE` de las consultas.
* **A02: Cryptographic Failures:** Prevenido mediante el hashing de contraseñas con `bcrypt`.
* **A03: Injection:** Prevenido por el uso de **Prisma ORM** (que escapa parámetros automáticamente) y la validación de entrada con **Zod**.
* **A05: Security Misconfiguration:** Los secretos y credenciales se gestionan estrictamente a través de variables de entorno, nunca en el código fuente.

## 🚀 Cómo Empezar

Dado que el entorno de producción es privado, sigue estos pasos para levantar un entorno de desarrollo local y probar la lógica.

### Prerrequisitos
* Node.js (v18 o superior)
* PNPM
* PostgreSQL

### Instalación

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
    Crea una copia del archivo `.env.example` y renómbralo a `.env`.
    ```bash
    cp .env.example .env
    ```

4.  **Base de Datos:**
    Asegúrate de tener una instancia de PostgreSQL corriendo y aplica las migraciones:
    ```bash
    pnpm prisma migrate dev
    ```

5.  **Inicia el servidor de desarrollo:**
    ```bash
    pnpm run dev
    ```
    La API estará disponible en `http://localhost:3000`.

## ⚙️ Variables de Entorno

Para ejecutar esta aplicación localmente, necesitarás configurar las siguientes variables en tu archivo `.env`:

* `DATABASE_URL`: URL de conexión a tu base de datos PostgreSQL local.
* `JWT_SECRET`: Clave secreta para firmar los tokens JWT.
* `PORT`: Puerto del servidor (por defecto: `3000`).
* `GEMINI_API_KEY`: Clave de API para el servicio de Google Gemini (necesaria para probar la IA).

## 🤝 Contribución

Este repositorio está en modo de mantenimiento (Legacy). Sin embargo, las sugerencias sobre la arquitectura o patrones de diseño son bienvenidas a través de Issues.

## 👤 Autor

**Luis David Trejo** - [GitHub Profile](https://github.com/LuisDavidTF)

Desarrollador Backend enfocado en arquitecturas escalables y seguridad.
