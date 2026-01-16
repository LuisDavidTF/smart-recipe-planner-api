# 📚 Documentación de la API (v1 - Legacy Reference)

Esta documentación describe los endpoints disponibles en la versión v1 de la API (Node.js/Express). Aunque el entorno de producción público ha sido desactivado, estos endpoints son funcionales si ejecutas el proyecto localmente.

### 🌐 URL Base
* **Local:** `http://localhost:3000/api/v1`
* **Producción:** *Desactivado (Ver README)*

### **Autenticación**

#### `POST /api/v1/auth/register`

Registra un nuevo usuario en el sistema.

*   **Request Body:**

    ```json
    {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "password": "password123"
    }
    ```

*   **Success Response (201 Created):**

    ```json
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com"
    }
    ```

*   **Error Response (400 Bad Request):**

    ```json
    {
      "errors": [
        "El nombre debe tener al menos 5 caracteres.",
        "La contraseña debe tener al menos 8 caracteres."
      ]
    }
    ```

#### `POST /api/v1/auth/login`

Autentica a un usuario y devuelve un token JWT para usar en rutas protegidas.

*   **Request Body:**

    ```json
    {
      "email": "john.doe@example.com",
      "password": "password123"
    }
    ```

*   **Success Response (200 OK):**

    ```json
    {
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john.doe@example.com"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```

*   **Error Response (401 Unauthorized):**

    ```json
    {
      "message": "Credenciales inválidas"
    }
    ```

---

### **Generación de Recetas con IA**

#### `POST /api/v1/ai/generate-magic`

Genera una nueva receta utilizando inteligencia artificial. Requiere autenticación.

*   **Autenticación:** `Bearer Token`

*   **Request Body:**

    ```json
    {
      "prompt": "Una receta fácil de salmón al horno con verduras."
    }
    ```

*   **Success Response (200 OK):**

    ```json
    {
        "name": "Salmón al Horno con Verduras",
        "description": "Una receta fácil y saludable de salmón al horno con una colorida mezcla de verduras.",
        "preparationTime": 30,
        "ingredients": [
            { "name": "filete de salmón", "quantity": "2", "unit_of_measure": "piezas" },
            { "name": "brócoli", "quantity": "1", "unit_of_measure": "taza" },
            { "name": "aceite de oliva", "quantity": "2", "unit_of_measure": "cucharadas" }
        ],
        "instructions": [
            "Precalienta el horno a 200°C.",
            "Coloca el salmón y las verduras en una bandeja para hornear.",
            "Hornea durante 15-20 minutos."
        ],
        "type": "dinner"
    }
    ```

*   **Error Response (429 Too Many Requests):**

    ```json
    {
      "message": "Has alcanzado el límite de 3 generaciones de recetas por día."
    }
    ```

---

### **Gestión de Recetas (Manual)**

#### `POST /api/v1/recipes`

Crea una nueva receta manualmente. Requiere autenticación.

*   **Autenticación:** `Bearer Token`

*   **Request Body:**

    ```json
    {
      "name": "Tostadas de Aguacate",
      "description": "Un desayuno rápido, saludable y delicioso para empezar el día con energía.",
      "image_url": "https://example.com/images/avocado-toast.jpg",
      "preparation_time_minutes": 10,
      "type": "breakfast",
      "visibility": "public",
      "instructions": {
        "Paso 1": "Tostar las rebanadas de pan.",
        "Paso 2": "Mientras tanto, machacar el aguacate en un tazón.",
        "Paso 3": "Untar el aguacate sobre las tostadas y sazonar con sal y pimienta."
      },
      "ingredients": [
        {
          "name": "Pan integral",
          "quantity": 2,
          "unit_of_measure": "rebanadas"
        },
        {
          "name": "Aguacate",
          "quantity": 1,
          "unit_of_measure": "unidad"
        },
        {
          "name": "Sal",
          "unit_of_measure": "al gusto"
        }
      ],
      "media": [
        {
          "url": "https://example.com/videos/avocado-toast-making.mp4",
          "media_type": "video",
          "display_order": 1
        }
      ]
    }
    ```

*   **Success Response (201 Created):**

    ```json
    {
      "message": "Receta creada exitosamente",
      "recipe": {
        "id": 101,
        "author_id": 1,
        "name": "Tostadas de Aguacate",
        "description": "Un desayuno rápido, saludable y delicioso para empezar el día con energía.",
        "image_url": "https://example.com/images/avocado-toast.jpg",
        "preparation_time_minutes": 10,
        "type": "breakfast",
        "visibility": "public",
        "createdAt": "2025-11-05T12:00:00.000Z",
        "updatedAt": "2025-11-05T12:00:00.000Z",
        "ingredients": [
          { "id": 201, "name": "Pan integral", "quantity": 2, "unit_of_measure": "rebanadas" },
          { "id": 202, "name": "Aguacate", "quantity": 1, "unit_of_measure": "unidad" },
          { "id": 203, "name": "Sal", "quantity": null, "unit_of_measure": "al gusto" }
        ],
        "instructions": [
          { "id": 301, "step_number": 1, "description": "Tostar las rebanadas de pan." },
          { "id": 302, "step_number": 2, "description": "Mientras tanto, machacar el aguacate en un tazón." }
        ],
        "media": [
          { "id": 401, "url": "https://example.com/videos/avocado-toast-making.mp4", "media_type": "video", "display_order": 1 }
        ]
      }
    }
    ```

| Método | Ruta | Descripción | Autenticación |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/recipes` | Obtiene el feed de recetas públicas (paginado). | Opcional |
| `GET` | `/api/v1/recipes/:id` | Obtiene una receta por su ID. | Opcional |
| `PATCH` | `/api/v1/recipes/:id` | Actualiza una receta existente. | Requerida |
| `DELETE` | `/api/v1/recipes/:id` | Elimina una receta. | Requerida |
