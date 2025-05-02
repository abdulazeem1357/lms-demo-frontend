## Course Materials Management API

*Generated on: 2025-05-02*

---

### `GET /courses/{courseId}/materials`

**Summary:**  
Retrieves the list of supplementary materials (files or links) for a specific course.

**Endpoint:**
```
https://api.lms.example.com/v1/courses/{courseId}/materials
```

**Method:**
```
GET
```

**Authentication:**
- Required: Yes  
- Type: Bearer Token (JWT)

**Permissions:**
- Student (enrolled), Instructor, Admin

**Headers:**
```json
{
  "Authorization": "Bearer <YOUR_AUTH_TOKEN>"
}
```

**Path Parameters:**
- `courseId`: [string] - UUID of the course.

**Responses:**

- **`200 OK`**
  - **Description:** Successfully retrieved list of materials.
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
              "id": { "type": "string", "description": "UUID of the material.", "example": "a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d" },
              "title": { "type": "string", "description": "Title of the material.", "example": "Lecture Slides" },
              "description": { "type": "string", "description": "Optional description.", "example": "Slides for week 1." },
              "type": { "type": "string", "description": "Type of material.", "enum": ["file","link"], "example": "file" },
              "url": { "type": "string", "description": "Access URL for file or link.", "example": "https://cdn.lms.example.com/files/f1e2d3..." },
              "createdAt": { "type": "string", "format": "date-time", "description": "When material was added.", "example": "2025-05-02T12:00:00Z" }
            }
          }
        }
      }
    }
    ```
- **`400 Bad Request`**, **`401 Unauthorized`**, **`403 Forbidden`**, **`404 Not Found`**, **`500 Internal Server Error`**  
  *(As defined above.)*

**Example (Fetch):**
```javascript
const courseId = 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d';
const url = `https://api.lms.example.com/v1/courses/${courseId}/materials`;
const response = await fetch(url, {
  headers: { 'Authorization': 'Bearer <YOUR_AUTH_TOKEN>' }
});
const { data } = await response.json();
console.log('Materials:', data);
```

---

### `POST /courses/{courseId}/materials`

**Summary:**  
Uploads a new supplementary material (file or external link) for the specified course.

**Endpoint:**
```
https://api.lms.example.com/v1/courses/{courseId}/materials
```

**Method:**
```
POST
```

**Authentication:**
- Required: Yes  
- Type: Bearer Token (JWT)

**Permissions:**
- Instructor, Admin

**Headers:**
- For file upload (multipart/form-data):
```http
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...
Authorization: Bearer <YOUR_AUTH_TOKEN>
```
- For link (application/json):
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <YOUR_AUTH_TOKEN>"
}
```

**Path Parameters:**
- `courseId`: [string] - UUID of the course.

**Request Body:**
- **File Upload (multipart/form-data):**
  - `file`: [binary] - The material file to upload.
  - `title`: [string] - Title of the material.
  - `description`: [string] (optional) - Description of the material.
- **Link (application/json):**
  ```json
  {
    "type": "object",
    "properties": {
      "title": { "type": "string", "description": "Title of the material.", "example": "Course Website" },
      "description": { "type": "string", "description": "Optional description.", "example": "Official course site." },
      "linkUrl": { "type": "string", "description": "External URL.", "example": "https://example.com/course" }
    },
    "required": ["title","linkUrl"]
  }
  ```

**Responses:**

- **`201 Created`**
  - **Description:** Material successfully created.
  - **Response Body:**
    ```json
    {
      "id": "a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
      "title": "Lecture Notes",
      "description": "Notes PDF.",
      "type": "file",
      "url": "https://cdn.lms.example.com/files/abc123.pdf",
      "createdAt": "2025-05-02T12:00:00Z"
    }
    ```

- **`400 Bad Request`**, **`401 Unauthorized`**, **`403 Forbidden`**, **`404 Not Found`**, **`415 Unsupported Media Type`**, **`500 Internal Server Error`**

**Example (Upload via fetch):**
```javascript
const courseId = '...';
const form = new FormData();
form.append('file', fileInput.files[0]);
form.append('title', 'Lecture Slides');
const response = await fetch(
  `https://api.lms.example.com/v1/courses/${courseId}/materials`,
  { method: 'POST', headers: { 'Authorization': 'Bearer <TOKEN>' }, body: form }
);
const material = await response.json();
console.log(material);
```

---

### `PUT /courses/{courseId}/materials/{materialId}`

**Summary:**  
Updates metadata (title, description, link) of an existing course material.

**Endpoint:**
```
https://api.lms.example.com/v1/courses/{courseId}/materials/{materialId}
```

**Method:**
```
PUT
```

**Authentication:**
- Required: Yes  
- Type: Bearer Token (JWT)

**Permissions:**
- Instructor, Admin

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <YOUR_AUTH_TOKEN>"
}
```

**Path Parameters:**
- `courseId`: [string] - UUID of the course.
- `materialId`: [string] - UUID of the material.

**Request Body:**
```json
{
  "type": "object",
  "properties": {
    "title": { "type": "string", "example": "Updated Title" },
    "description": { "type": "string", "example": "Updated description." },
    "linkUrl": { "type": "string", "description": "New external URL.", "example": "https://example.com" }
  }
}
```

**Responses:**

- **`200 OK`**
  - **Description:** Material metadata updated.
  - **Response Body:** Same schema as `GET` response item.

- **`400 Bad Request`**, **`401 Unauthorized`**, **`403 Forbidden`**, **`404 Not Found`**, **`500 Internal Server Error`**

**Example (Fetch):**
```javascript
const response = await fetch(
  `https://api.lms.example.com/v1/courses/${courseId}/materials/${materialId}`,
  {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer <TOKEN>' },
    body: JSON.stringify({ title: 'New Title', linkUrl: 'https://updated.link' })
  }
);
const updated = await response.json();
console.log(updated);
```

---

### `DELETE /courses/{courseId}/materials/{materialId}`

**Summary:**  
Deletes a supplementary material from the course.

**Endpoint:**
```
https://api.lms.example.com/v1/courses/{courseId}/materials/{materialId}
```

**Method:**
```
DELETE
```

**Authentication:**
- Required: Yes  
- Type: Bearer Token (JWT)

**Permissions:**
- Instructor, Admin

**Headers:**
```json
{
  "Authorization": "Bearer <YOUR_AUTH_TOKEN>"
}
```

**Path Parameters:**
- `courseId`: [string] - UUID of the course.
- `materialId`: [string] - UUID of the material.

**Responses:**

- **`204 No Content`**  
  - **Description:** Material successfully deleted; no content returned.

- **`400 Bad Request`**, **`401 Unauthorized`**, **`403 Forbidden`**, **`404 Not Found`**, **`500 Internal Server Error`**

**Example (Fetch):**
```javascript
await fetch(
  `https://api.lms.example.com/v1/courses/${courseId}/materials/${materialId}`,
  { method: 'DELETE', headers: { 'Authorization': 'Bearer <YOUR_AUTH_TOKEN>' } }
);
console.log('Material deleted');
```

---