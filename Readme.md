# **Smart Recipe Planner API**

![API Status](https://img-shields.io/website?down_color=lightgrey&down_message=offline&style=for-the-badge&up_color=green&up_message=online&url=https%3A%2F%2Fsmart-recipe-planner-api.onrender.com%2Fapi%2Fv1)
![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js)
![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express)
![Prisma](https://img.shields.io/badge/Prisma-5.x-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-336791?style=for-the-badge&logo=postgresql)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens)

API RESTful robusta y escalable para una aplicación de planificación de recetas inteligentes. Diseñada con principios de **seguridad por diseño** y una **arquitectura de capas profesional**, esta API proporciona la base para gestionar usuarios, recetas y la generación de nuevas recetas mediante inteligencia artificial.

## 📝 Tabla de Contenidos

- [🌐 API en Vivo](#-api-en-vivo)
- [✨ Características Destacadas](#-características-destacadas)
- [🧠 Funcionalidad de IA](#-funcionalidad-de-ia)
- [📚 Documentación de la API](#-documentación-de-la-api)
- [🏛️ Arquitectura](#-arquitectura)
- [🛡️ Mitigación de Amenazas (OWASP)](#-mitigación-de-amenazas-owasp)
- [🚀 Cómo Empezar](#-cómo-empezar)
- [⚙️ Variables de Entorno](#-variables-de-entorno)
- [🤝 Contribución](#-contribución)
- [👤 Autor](#-autor)

---

## 🌐 **API en Vivo**

La API está desplegada en Render y es accesible públicamente.

**URL Base:** `https://smart-recipe-planner-api.onrender.com/api/v1`

---

## ✨ **Características Destacadas**

*   **Arquitectura Profesional:** Implementación estricta del patrón **Controlador-Servicio-Repositorio** para una máxima mantenibilidad.
*   **Generación de Recetas con IA:** Crea recetas completas a partir de una simple descripción de texto.
*   **Seguridad Robusta:** Autorización a nivel de base de datos (previene IDOR), hashing de contraseñas con **bcrypt** y validación de esquemas con **Zod**.
*   **Transacciones Atómicas:** Las operaciones complejas se ejecutan dentro de transacciones de base de datos para garantizar la integridad de los datos.
*   **Feed Eficiente:** Paginación por cursor compuesto para un rendimiento óptimo en *infinite scroll*.

---

## 🧠 **Funcionalidad de IA**

### **Generación Mágica de Recetas**

La API integra un modelo de IA (Gemini Flash) para generar recetas completas a partir de una simple solicitud de texto del usuario. Esta funcionalidad, denominada "Generación Mágica", interpreta el texto y devuelve una receta estructurada.

*   **Entrada:** Una cadena de texto simple, como "pasta con pollo para una cena rápida" o "un desayuno saludable con avena y frutas".
*   **Salida:** Un objeto JSON que contiene:
    *   `name`: Nombre de la receta.
    *   `description`: Descripción breve.
    *   `preparationTime`: Tiempo de preparación en minutos.
    *   `ingredients`: Una lista de ingredientes con nombre, cantidad y unidad de medida.
    *   `instructions`: Pasos de la preparación.
    *   `type`: Tipo de comida (ej. "breakfast", "lunch", "dinner").
*   **Límite de Uso:** Para controlar los costos, cada usuario puede realizar un máximo de **3 generaciones de recetas por día**.

---

## 📚 **Documentación de la API**

La documentación detallada de los endpoints, incluyendo ejemplos de solicitudes y respuestas, se encuentra en el archivo [**API_DOCS.md**](./API_DOCS.md).

---

## 🏛️ **Arquitectura**

El proyecto sigue un diseño de capas claro que aísla la lógica de negocio del framework y del acceso a datos.

1.  **Capa de Rutas (`routes`):** Define los endpoints y encadena los middlewares.
2.  **Capa de Middlewares (`middlewares`):** Maneja `authentication`, `validateSchema` y `errorHandler`.
3.  **Capa de Controladores (`controllers`):** Orquesta el flujo HTTP.
4.  **Capa de Servicios (`services`):** Contiene la lógica de negocio pura.
5.  **Capa de Repositorios (`repositories`):** Encapsula todas las consultas a la base de datos con Prisma.

---

## 🛡️ **Mitigación de Amenazas (OWASP)**

La API ha sido construida con la seguridad como una prioridad:

*   **A01: Broken Access Control:** Prevenido mediante la validación del `user_id` del token JWT en las cláusulas `WHERE`.
*   **A02: Cryptographic Failures:** Prevenido mediante el hashing de contraseñas con `bcrypt`.
*   **A03: Injection:** Prevenido por el uso de **Prisma ORM** y la validación estricta de **Zod**.
*   **A05: Security Misconfiguration:** Los secretos se gestionan a través de variables de entorno.

---

## 🚀 **Cómo Empezar**

Sigue estos pasos para levantar un entorno de desarrollo local.

### **Prerrequisitos**

*   Node.js (v18 o superior)
*   PNPM
*   PostgreSQL

### **Instalación**

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/LuisDavidTF/smart-recipe-planner-api.git
    cd smart-recipe-planner-api
    ```

2.  **Instala las dependencias:**
    ```bash
    pnpm install
    ```

3.  **Configura las variables de entorno:**
    *   Crea una copia del archivo `.env.example` y renómbralo a `.env`.
    *   Rellena las variables, especialmente `DATABASE_URL` y `JWT_SECRET`.
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

## ⚙️ **Variables de Entorno**

Para ejecutar esta aplicación, necesitarás configurar las siguientes variables de entorno en un archivo `.env`:

*   `DATABASE_URL`: URL de conexión a la base de datos PostgreSQL.
*   `JWT_SECRET`: Clave secreta para firmar los tokens JWT.
*   `PORT`: Puerto en el que la API escuchará (por defecto: `3000`).
*   `GEMINI_API_KEY`: Clave de API para el servicio de Google Gemini.

---

## 🤝 **Contribución**

¡Las contribuciones son bienvenidas! Si deseas mejorar este proyecto, por favor, abre un Pull Request para discutir los cambios propuestos.

---

## 👤 **Autor**

**Luis David Tovar** - [GitHub](https://github.com/LuisDavidTF)