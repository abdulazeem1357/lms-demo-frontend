## Course Content Management API – Assignment Content Management

*Generated on: 2025-05-02*

---

### `GET /modules/{moduleId}/assignments`

**Summary:**  
Retrieves the list of assignments for a specific module.

**Endpoint:**
```
https://api.lms.example.com/v1/modules/{moduleId}/assignments
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
- `moduleId`: [string] – UUID of the module.

**Responses:**

- **`200 OK`**  
  - **Description:** Successfully retrieved list of assignments.  
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
              "id": { "type": "string", "description": "UUID of the assignment.", "example": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d" },
              "moduleId": { "type": "string", "description": "UUID of the parent module.", "example": "m1a2b3c4-d5e6-7f8g-9h0i-1j2k3l4m5n6o" },
              "title": { "type": "string", "description": "Assignment title.", "example": "Essay on React Hooks" },
              "description": { "type": "string", "description": "Detailed description of the assignment.", "example": "Write a 1500‑word essay on the benefits of using React Hooks." },
              "dueDate": { "type": "string", "format": "date-time", "description": "Assignment due date and time.", "example": "2025-05-15T23:59:00Z" },
              "createdAt": { "type": "string", "format": "date-time", "description": "Timestamp when the assignment was created.", "example": "2025-05-02T12:00:00Z" },
              "updatedAt": { "type": "string", "format": "date-time", "description": "Timestamp when the assignment was last updated.", "example": "2025-05-02T12:00:00Z" }
            }
          }
        }
      }
    }
    ```
    **Field Descriptions:**
    - `id`: Unique assignment identifier.  
    - `moduleId`: Parent module identifier.  
    - `title`: Name of the assignment.  
    - `description`: Detailed instructions.  
    - `dueDate`: ISO 8601 due date/time.  
    - `createdAt`/`updatedAt`: Record timestamps.

- **`400 Bad Request`**  
  - Invalid `moduleId` format.

- **`401 Unauthorized`**  
  - Missing or invalid auth token.

- **`403 Forbidden`**  
  - Insufficient permissions.

- **`404 Not Found`**  
  - Module not found.

- **`500 Internal Server Error`**  
  - Unexpected server error.

**Example (Fetch):**
```javascript
const moduleId = 'm1a2b3c4-d5e6-7f8g-9h0i-1j2k3l4m5n6o';
const url = `https://api.lms.example.com/v1/modules/${moduleId}/assignments`;
const response = await fetch(url, {
  headers: { 'Authorization': 'Bearer <YOUR_AUTH_TOKEN>' }
});
const { data } = await response.json();
console.log('Assignments:', data);
```

---

### `POST /modules/{moduleId}/assignments`

**Summary:**  
Creates a new assignment within a specific module.

**Endpoint:**
```
https://api.lms.example.com/v1/modules/{moduleId}/assignments
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
- `moduleId`: [string] – UUID of the module.

**Request Body:**
```json
{
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Assignment title.",
      "example": "Essay on React Hooks"
    },
    "description": {
      "type": "string",
      "description": "Detailed assignment instructions.",
      "example": "Write a 1500‑word essay on the benefits of using React Hooks."
    },
    "dueDate": {
      "type": "string",
      "format": "date-time",
      "description": "Due date and time in ISO 8601 format.",
      "example": "2025-05-15T23:59:00Z"
    }
  },
  "required": ["title", "dueDate"]
}
```

**Field Descriptions:**
- `title`: Name of the assignment.  
- `description`: Instructions or prompt.  
- `dueDate`: ISO 8601 timestamp when submissions close.

**Responses:**

- **`201 Created`**  
  - **Description:** Assignment successfully created.  
  - **Response Body:**
    ```json
    {
      "type": "object",
      "properties": {
        "data": {
          "type": "object",
          "properties": {
            "id": { "type": "string", "example": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d" },
            "moduleId": { "type": "string", "example": "m1a2b3c4-d5e6-7f8g-9h0i-1j2k3l4m5n6o" },
            "title": { "type": "string", "example": "Essay on React Hooks" },
            "description": { "type": "string", "example": "Write a 1500‑word essay on the benefits of using React Hooks." },
            "dueDate": { "type": "string", "format": "date-time", "example": "2025-05-15T23:59:00Z" },
            "createdAt": { "type": "string", "format": "date-time", "example": "2025-05-02T12:05:00Z" },
            "updatedAt": { "type": "string", "format": "date-time", "example": "2025-05-02T12:05:00Z" }
          }
        }
      }
    }
    ```

- **`400 Bad Request`**  
  - Missing required fields or invalid data.

- **`401 Unauthorized`**  
  - Missing or invalid auth token.

- **`403 Forbidden`**  
  - Insufficient permissions.

- **`404 Not Found`**  
  - Module not found.

- **`500 Internal Server Error`**  
  - Unexpected server error.

**Example (Fetch):**
```javascript
const moduleId = 'm1a2b3c4-d5e6-7f8g-9h0i-1j2k3l4m5n6o';
const url = `https://api.lms.example.com/v1/modules/${moduleId}/assignments`;
const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <YOUR_AUTH_TOKEN>'
  },
  body: JSON.stringify({
    title: 'Essay on React Hooks',
    description: 'Write a 1500‑word essay on the benefits of using React Hooks.',
    dueDate: '2025-05-15T23:59:00Z'
  })
};
const response = await fetch(url, options);
const { data } = await response.json();
console.log('Created assignment:', data);
```

---

### `GET /assignments/{assignmentId}`

**Summary:**  
Retrieves detailed information for a single assignment.

**Endpoint:**
```
https://api.lms.example.com/v1/assignments/{assignmentId}
```

**Method:**
```
GET
```

**Authentication:**
- Required: Yes  
- Type: Bearer Token (JWT)

**Permissions:**
- Student (if enrolled in parent course), Instructor of the course, Admin

**Headers:**
```json
{
  "Authorization": "Bearer <YOUR_AUTH_TOKEN>"
}
```

**Path Parameters:**
- `assignmentId`: [string] – UUID of the assignment.

**Responses:**

- **`200 OK`**  
  - **Description:** Assignment details retrieved.  
  - **Response Body:**
    ```json
    {
      "type": "object",
      "properties": {
        "data": {
          "type": "object",
          "properties": {
            "id": { "type": "string" },
            "moduleId": { "type": "string" },
            "title": { "type": "string" },
            "description": { "type": "string" },
            "dueDate": { "type": "string", "format": "date-time" },
            "createdAt": { "type": "string", "format": "date-time" },
            "updatedAt": { "type": "string", "format": "date-time" }
          }
        }
      }
    }
    ```
    **Field Descriptions:** As defined in `IAssignment`.

- **`400 Bad Request`**, **`401 Unauthorized`**, **`403 Forbidden`**, **`404 Not Found`**, **`500 Internal Server Error`**  

**Example (Fetch):**
```javascript
const assignmentId = 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';
const url = `https://api.lms.example.com/v1/assignments/${assignmentId}`;
const response = await fetch(url, {
  headers: { 'Authorization': 'Bearer <YOUR_AUTH_TOKEN>' }
});
const { data } = await response.json();
console.log('Assignment details:', data);
```

---

### `PUT /assignments/{assignmentId}`

**Summary:**  
Updates the details of an existing assignment (title, description, due date).

**Endpoint:**
```
https://api.lms.example.com/v1/assignments/{assignmentId}
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
- `assignmentId`: [string] – UUID of the assignment.

**Request Body:**
```json
{
  "type": "object",
  "properties": {
    "title": { "type": "string", "example": "Revised Essay on React Hooks" },
    "description": { "type": "string", "example": "Updated instructions and grading rubric." },
    "dueDate": { "type": "string", "format": "date-time", "example": "2025-05-20T23:59:00Z" }
  }
}
```

**Responses:**

- **`200 OK`**  
  - **Description:** Assignment updated successfully.  
  - **Response Body:** Same schema as `GET /assignments/{assignmentId}`.

- **`400 Bad Request`**, **`401 Unauthorized`**, **`403 Forbidden`**, **`404 Not Found`**, **`500 Internal Server Error`**  

**Example (Fetch):**
```javascript
const assignmentId = 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';
const url = `https://api.lms.example.com/v1/assignments/${assignmentId}`;
const options = {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <YOUR_AUTH_TOKEN>'
  },
  body: JSON.stringify({
    title: 'Revised Essay on React Hooks',
    dueDate: '2025-05-20T23:59:00Z'
  })
};
const response = await fetch(url, options);
const { data } = await response.json();
console.log('Updated assignment:', data);
```

---

### `DELETE /assignments/{assignmentId}`

**Summary:**  
Deletes an assignment from the system.

**Endpoint:**
```
https://api.lms.example.com/v1/assignments/{assignmentId}
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
- `assignmentId`: [string] – UUID of the assignment.

**Responses:**

- **`204 No Content`**  
  - **Description:** Assignment successfully deleted; no content returned.

- **`400 Bad Request`**  
  - Invalid `assignmentId` format.

- **`401 Unauthorized`**  
  - Missing or invalid auth token.

- **`403 Forbidden`**  
  - Insufficient permissions.

- **`404 Not Found`**  
  - Assignment not found.

- **`500 Internal Server Error`**  
  - Unexpected server error.

**Example (Fetch):**
```javascript
const assignmentId = 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';
await fetch(`https://api.lms.example.com/v1/assignments/${assignmentId}`, {
  method: 'DELETE',
  headers: { 'Authorization': 'Bearer <YOUR_AUTH_TOKEN>' }
});
console.log('Assignment deleted');
```

---