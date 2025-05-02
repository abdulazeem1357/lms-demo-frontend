## Course Management API – Course Core CRUD Operations

*Generated on: 2025-05-02*

---

### `POST /courses`

**Summary:**  
Creates a new course in the system.

**Endpoint:**
```
https://api.lms.example.com/v1/courses
```

**Method:**
```
POST
```

**Authentication:**
- Required: Yes  
- Type: Bearer Token (JWT)

**Permissions:**
- Admin, Instructor

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <YOUR_AUTH_TOKEN>"
}
```

**Request Body:**
```json
{
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Title of the course.",
      "example": "Introduction to React",
      "required": true
    },
    "description": {
      "type": "string",
      "description": "Detailed description of the course.",
      "example": "A beginner-friendly course on React fundamentals.",
      "required": true
    },
    "category": {
      "type": "string",
      "description": "Category under which the course is listed.",
      "example": "Web Development",
      "required": true
    },
    "difficulty": {
      "type": "string",
      "description": "Difficulty level of the course.",
      "example": "beginner",
      "enum": ["beginner", "intermediate", "advanced"],
      "required": true
    }
  },
  "required": ["title", "description", "category", "difficulty"]
}
```

**Responses:**

- **`201 Created`**  
  - **Description:** Course successfully created.  
  - **Response Body:**
    ```json
    {
      "type": "object",
      "properties": {
        "data": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "description": "UUID of the new course.",
              "example": "f1e2d3c4-b5a6-7f8e-9d0c-1b2a3c4d5e6f"
            },
            "title": { "type": "string", "example": "Introduction to React" },
            "description": { "type": "string", "example": "A beginner-friendly course on React fundamentals." },
            "category": { "type": "string", "example": "Web Development" },
            "difficulty": { "type": "string", "example": "beginner" },
            "createdAt": {
              "type": "string",
              "format": "date-time",
              "example": "2025-05-02T14:23:00Z"
            },
            "updatedAt": {
              "type": "string",
              "format": "date-time",
              "example": "2025-05-02T14:23:00Z"
            }
          }
        }
      }
    }
    ```
    **Field Descriptions:**
    - `id`: Unique course identifier.  
    - `createdAt`/`updatedAt`: Timestamps for creation and last update.

- **`400 Bad Request`**  
  - **Description:** Validation errors or missing required fields.  
- **`401 Unauthorized`**  
  - **Description:** Authentication token missing or invalid.  
- **`403 Forbidden`**  
  - **Description:** Insufficient permissions.  
- **`500 Internal Server Error`**  
  - **Description:** Unexpected server error.  

**Example (Fetch):**
```javascript
const url = 'https://api.lms.example.com/v1/courses';
const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <YOUR_AUTH_TOKEN>'
  },
  body: JSON.stringify({
    title: 'Introduction to React',
    description: 'A beginner-friendly course on React fundamentals.',
    category: 'Web Development',
    difficulty: 'beginner'
  })
};

const response = await fetch(url, options);
const { data } = await response.json();
console.log('Created course:', data);
```

---

### `GET /courses`

**Summary:**  
Retrieves a paginated list of courses, with optional filtering and search.

**Endpoint:**
```
https://api.lms.example.com/v1/courses
```

**Method:**
```
GET
```

**Authentication:**
- Required: Yes  
- Type: Bearer Token (JWT)

**Permissions:**
- Student, Instructor, Admin

**Headers:**
```json
{
  "Authorization": "Bearer <YOUR_AUTH_TOKEN>"
}
```

**Query Parameters:**
- `page`: [integer] – Page number (default: 1).  
- `limit`: [integer] – Items per page (default: 20).  
- `search`: [string] – Keyword search on title or description.  
- `category`: [string] – Filter by category.  
- `difficulty`: [string] – Filter by difficulty (`beginner|intermediate|advanced`).

**Responses:**

- **`200 OK`**  
  - **Description:** List of courses with pagination metadata.  
  - **Response Body:**
    ```json
    {
      "type": "object",
      "properties": {
        "data": {
          "type": "array",
          "items": {
            "$ref": "#/properties/data/properties/0"
          }
        },
        "meta": {
          "type": "object",
          "properties": {
            "page": { "type": "integer", "example": 1 },
            "limit": { "type": "integer", "example": 20 },
            "totalItems": { "type": "integer", "example": 100 },
            "totalPages": { "type": "integer", "example": 5 }
          }
        }
      }
    }
    ```
    **Field Descriptions:**
    - `data`: Array of `ICourse` objects.  
    - `meta`: Pagination details.

- **`400`, `401`, `403`, `500`**  
  *(As defined above.)*  

**Example (Fetch):**
```javascript
const url = new URL('https://api.lms.example.com/v1/courses');
url.searchParams.set('page', '1');
url.searchParams.set('limit', '20');
url.searchParams.set('search', 'React');

const response = await fetch(url, {
  headers: { 'Authorization': 'Bearer <YOUR_AUTH_TOKEN>' }
});
const { data, meta } = await response.json();
console.log('Courses:', data, 'Pages:', meta);
```

---

### `GET /courses/{courseId}`

**Summary:**  
Retrieves detailed information for a single course.

**Endpoint:**
```
https://api.lms.example.com/v1/courses/{courseId}
```

**Method:**
```
GET
```

**Authentication:**
- Required: Yes  
- Type: Bearer Token (JWT)

**Permissions:**
- Student, Instructor, Admin

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
  - **Description:** Course details.  
  - **Response Body:**
    ```json
    {
      "type": "object",
      "properties": {
        "data": {
          "$ref": "#/properties/data/properties/0"
        }
      }
    }
    ```
    **Field Descriptions:** Same as `ICourse` schema.

- **`400`, `401`, `403`, `404`, `500`**  
  - `404 Not Found` if course does not exist.  

**Example (Fetch):**
```javascript
const courseId = 'f1e2d3c4-b5a6-7f8e-9d0c-1b2a3c4d5e6f';
const url = `https://api.lms.example.com/v1/courses/${courseId}`;
const response = await fetch(url, {
  headers: { 'Authorization': 'Bearer <YOUR_AUTH_TOKEN>' }
});
const { data } = await response.json();
console.log('Course details:', data);
```

---

### `PUT /courses/{courseId}`

**Summary:**  
Updates an existing course's details.

**Endpoint:**
```
https://api.lms.example.com/v1/courses/{courseId}
```

**Method:**
```
PUT
```

**Authentication:**
- Required: Yes  
- Type: Bearer Token (JWT)

**Permissions:**
- Admin, Instructor

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
    "title": { "type": "string", "example": "Advanced React Patterns" },
    "description": { "type": "string", "example": "In-depth look at hooks and context." },
    "category": { "type": "string", "example": "Web Development" },
    "difficulty": {
      "type": "string",
      "enum": ["beginner","intermediate","advanced"],
      "example": "advanced"
    }
  }
}
```

**Responses:**

- **`200 OK`**  
  - **Description:** Updated course object.  
  - **Response Body:** Same schema as `GET /courses/{courseId}`.

- **`400`, `401`, `403`, `404`, `500`**  
  *(As defined above.)*  

**Example (Fetch):**
```javascript
const courseId = 'f1e2d3c4-b5a6-7f8e-9d0c-1b2a3c4d5e6f';
const url = `https://api.lms.example.com/v1/courses/${courseId}`;
const options = {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <YOUR_AUTH_TOKEN>'
  },
  body: JSON.stringify({ difficulty: 'advanced' })
};
const response = await fetch(url, options);
const { data } = await response.json();
console.log('Updated course:', data);
```

---

### `DELETE /courses/{courseId}`

**Summary:**  
Deletes a course from the system.

**Endpoint:**
```
https://api.lms.example.com/v1/courses/{courseId}
```

**Method:**
```
DELETE
```

**Authentication:**
- Required: Yes  
- Type: Bearer Token (JWT)

**Permissions:**
- Admin, Instructor

**Headers:**
```json
{
  "Authorization": "Bearer <YOUR_AUTH_TOKEN>"
}
```

**Path Parameters:**
- `courseId`: [string] – UUID of the course.

**Responses:**

- **`204 No Content`**  
  - **Description:** Course successfully deleted; no body returned.

- **`400 Bad Request`**  
  - **Description:** Invalid courseId format.  
- **`401 Unauthorized`**  
  - **Description:** Authentication required.  
- **`403 Forbidden`**  
  - **Description:** Insufficient permissions.  
- **`404 Not Found`**  
  - **Description:** Course not found.  
- **`500 Internal Server Error`**  
  - **Description:** Unexpected server error.

**Example (Fetch):**
```javascript
const courseId = 'f1e2d3c4-b5a6-7f8e-9d0c-1b2a3c4d5e6f';
await fetch(`https://api.lms.example.com/v1/courses/${courseId}`, {
  method: 'DELETE',
  headers: { 'Authorization': 'Bearer <YOUR_AUTH_TOKEN>' }
});
console.log('Course deleted');
```

---