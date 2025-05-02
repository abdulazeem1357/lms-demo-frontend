## Course Content Management API – Course Structure Management

*Generated on: 2025-05-02*

---

### `GET /courses/{courseId}/modules`

**Summary:**  
Retrieves the list of modules (with nested chapters) for a specific course.

**Endpoint:**
```
https://api.lms.example.com/v1/courses/{courseId}/modules
```

**Method:**
```
GET
```

**Authentication:**
- Required: Yes  
- Type: Bearer Token (JWT)

**Permissions:**
- Instructor of the course, Admin

**Headers:**
```json
{
  "Authorization": "Bearer <YOUR_AUTH_TOKEN>"
}
```

**Path Parameters:**
- `courseId`: [string] – UUID of the course.

**Responses:**

- **`200 OK`**  
  - **Description:** Successfully retrieved modules with their chapters.  
  - **Response Body:**
    ```json
    {
      "type": "object",
      "properties": {
        "data": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "id": {
                "type": "string",
                "description": "UUID of the module.",
                "example": "m1a2b3c4-d5e6-7f8g-9h0i-1j2k3l4m5n6o"
              },
              "title": {
                "type": "string",
                "description": "Title of the module.",
                "example": "Module 1: Introduction"
              },
              "order": {
                "type": "integer",
                "description": "Display order of the module within the course.",
                "example": 1
              },
              "chapters": {
                "type": "array",
                "description": "List of chapters within this module.",
                "items": {
                  "type": "object",
                  "properties": {
                    "id": {
                      "type": "string",
                      "description": "UUID of the chapter.",
                      "example": "c1d2e3f4-g5h6-7i8j-9k0l-1m2n3o4p5q6r"
                    },
                    "title": {
                      "type": "string",
                      "description": "Chapter title.",
                      "example": "Chapter 1: Getting Started"
                    },
                    "order": {
                      "type": "integer",
                      "description": "Display order of the chapter within the module.",
                      "example": 1
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    ```
    **Field Descriptions:**
    - `data`: Array of module objects.
    - `id`: Unique identifier for the module.
    - `title`: Name of the module.
    - `order`: Defines module sequence.
    - `chapters`: Ordered list of chapters; each has `id`, `title`, and `order`.

- **`400 Bad Request`**  
  - **Description:** Invalid `courseId` format.  
- **`401 Unauthorized`**  
  - **Description:** Missing or invalid authentication token.  
- **`403 Forbidden`**  
  - **Description:** Insufficient permissions.  
- **`404 Not Found`**  
  - **Description:** Course not found.  
- **`500 Internal Server Error`**  
  - **Description:** Unexpected server error.  

**Example (Fetch):**
```javascript
const courseId = 'f1a2b3c4-d5e6-7f8g-9h0i-1j2k3l4m5n6o';
const url = `https://api.lms.example.com/v1/courses/${courseId}/modules`;
const response = await fetch(url, {
  headers: { 'Authorization': 'Bearer <YOUR_AUTH_TOKEN>' }
});
const { data } = await response.json();
console.log('Modules:', data);
```

---

### `POST /courses/{courseId}/modules`

**Summary:**  
Creates a new module (optionally with chapters) within a course.

**Endpoint:**
```
https://api.lms.example.com/v1/courses/{courseId}/modules
```

**Method:**
```
POST
```

**Authentication:**
- Required: Yes  
- Type: Bearer Token (JWT)

**Permissions:**
- Instructor of the course, Admin

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <YOUR_AUTH_TOKEN>"
}
```

**Path Parameters:**
- `courseId`: [string] – UUID of the course.

**Request Body:**
```json
{
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Title of the module.",
      "example": "Module 2: Advanced Topics"
    },
    "order": {
      "type": "integer",
      "description": "Display order of the module within the course.",
      "example": 2
    },
    "chapters": {
      "type": "array",
      "description": "Optional initial list of chapters.",
      "items": {
        "type": "object",
        "properties": {
          "title": {
            "type": "string",
            "description": "Chapter title.",
            "example": "Chapter 1: Deep Dive"
          },
          "order": {
            "type": "integer",
            "description": "Display order within the module.",
            "example": 1
          }
        }
      }
    }
  },
  "required": ["title", "order"]
}
```

**Field Descriptions:**
- `title`: Name of the new module.  
- `order`: Position in sequence.  
- `chapters`: Optional array to seed chapters; each needs `title` and `order`.

**Responses:**

- **`201 Created`**  
  - **Description:** Module successfully created.  
  - **Response Body:**
    ```json
    {
      "data": {
        "id": "m7n8o9p0-q1r2-3s4t-5u6v-7w8x9y0z1a2b",
        "title": "Module 2: Advanced Topics",
        "order": 2,
        "chapters": []
      }
    }
    ```

- **`400 Bad Request`**  
  - **Description:** Validation error or missing required fields.  
- **`401 Unauthorized`**, **`403 Forbidden`**, **`404 Not Found`**, **`500 Internal Server Error`**  

**Example (Fetch):**
```javascript
const courseId = 'f1a2b3c4-d5e6-7f8g-9h0i-1j2k3l4m5n6o';
const url = `https://api.lms.example.com/v1/courses/${courseId}/modules`;
const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <YOUR_AUTH_TOKEN>'
  },
  body: JSON.stringify({
    title: 'Module 2: Advanced Topics',
    order: 2
  })
};
const response = await fetch(url, options);
const { data } = await response.json();
console.log('Created module:', data);
```

---

### `PUT /courses/{courseId}/modules/{moduleId}`

**Summary:**  
Updates an existing module’s metadata (title, order, chapters).

**Endpoint:**
```
https://api.lms.example.com/v1/courses/{courseId}/modules/{moduleId}
```

**Method:**
```
PUT
```

**Authentication:**
- Required: Yes  
- Type: Bearer Token (JWT)

**Permissions:**
- Instructor of the course, Admin

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <YOUR_AUTH_TOKEN>"
}
```

**Path Parameters:**
- `courseId`: [string] – UUID of the course.  
- `moduleId`: [string] – UUID of the module to update.

**Request Body:**
```json
{
  "type": "object",
  "properties": {
    "title": { "type": "string", "example": "Updated Module Title" },
    "order": { "type": "integer", "example": 3 },
    "chapters": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "string", "description": "Existing chapter UUID." },
          "title": { "type": "string", "example": "Renamed Chapter" },
          "order": { "type": "integer", "example": 2 }
        }
      }
    }
  }
}
```

**Responses:**

- **`200 OK`**  
  - **Description:** Module updated successfully.  
  - **Response Body:** Same schema as `GET` item for this module.

- **`400 Bad Request`**, **`401 Unauthorized`**, **`403 Forbidden`**, **`404 Not Found`**, **`500 Internal Server Error`**

**Example (Fetch):**
```javascript
const url = 'https://api.lms.example.com/v1/courses/f1e2d3c4/modules/m7n8o9p0';
const options = {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <YOUR_AUTH_TOKEN>'
  },
  body: JSON.stringify({ order: 3 })
};
const response = await fetch(url, options);
const { data } = await response.json();
console.log('Updated module:', data);
```

---

### `DELETE /courses/{courseId}/modules/{moduleId}`

**Summary:**  
Deletes a module (and its chapters) from a course.

**Endpoint:**
```
https://api.lms.example.com/v1/courses/{courseId}/modules/{moduleId}
```

**Method:**
```
DELETE
```

**Authentication:**
- Required: Yes  
- Type: Bearer Token (JWT)

**Permissions:**
- Instructor of the course, Admin

**Headers:**
```json
{
  "Authorization": "Bearer <YOUR_AUTH_TOKEN>"
}
```

**Path Parameters:**
- `courseId`: [string] – UUID of the course.  
- `moduleId`: [string] – UUID of the module to remove.

**Responses:**

- **`204 No Content`**  
  - **Description:** Module and its chapters deleted; no content returned.

- **`400 Bad Request`**, **`401 Unauthorized`**, **`403 Forbidden`**, **`404 Not Found`**, **`500 Internal Server Error`**

**Example (Fetch):**
```javascript
await fetch(
  'https://api.lms.example.com/v1/courses/f1e2d3c4/modules/m7n8o9p0',
  { method: 'DELETE', headers: { 'Authorization': 'Bearer <YOUR_AUTH_TOKEN>' } }
);
console.log('Module deleted');
```

---