## User Role Management API

*Generated on 2025-05-02*

---

### `GET /users/{userId}/roles`

**Summary:**  
Retrieves the list of roles assigned to a specific user.

**Endpoint:**
```
https://api.lms.example.com/v1/users/{userId}/roles
```

**Method:**
```
GET
```

**Authentication:**
- Required: Yes  
- Type: Bearer Token (JWT)

**Permissions:**
- Admin only

**Headers:**
```json
{
  "Authorization": "Bearer <YOUR_AUTH_TOKEN>"
}
```

**Path Parameters:**
- `userId`: [string] - UUID of the user whose roles are being fetched.

**Responses:**

- **`200 OK`**
  - **Description:** Successfully retrieved user roles.
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
                "description": "UUID of the role.",
                "example": "d290f1ee-6c54-4b01-90e6-d701748f0851"
              },
              "name": {
                "type": "string",
                "description": "Role name. One of 'Admin', 'Instructor', 'Student'.",
                "example": "Instructor"
              }
            }
          }
        }
      }
    }
    ```
    **Field Descriptions:**
    - `data`: Array of role objects.
    - `id`: Unique identifier for the role.
    - `name`: Designation of the role.

- **`400 Bad Request`**
  - **Description:** Invalid `userId` format.
- **`401 Unauthorized`**
  - **Description:** Missing or invalid authentication token.
- **`403 Forbidden`**
  - **Description:** Admin permissions required.
- **`404 Not Found`**
  - **Description:** User with the specified `userId` does not exist.
- **`500 Internal Server Error`**
  - **Description:** Unexpected server error.

**Example (Fetch):**
```javascript
const userId = 'd290f1ee-6c54-4b01-90e6-d701748f0851';
const url = `https://api.lms.example.com/v1/users/${userId}/roles`;
const response = await fetch(url, {
  headers: { 'Authorization': 'Bearer <YOUR_AUTH_TOKEN>' }
});
const { data } = await response.json();
console.log('Roles:', data);
```

---

### `POST /users/{userId}/roles`

**Summary:**  
Assigns a new role to the specified user.

**Endpoint:**
```
https://api.lms.example.com/v1/users/{userId}/roles
```

**Method:**
```
POST
```

**Authentication:**
- Required: Yes  
- Type: Bearer Token (JWT)

**Permissions:**
- Admin only

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <YOUR_AUTH_TOKEN>"
}
```

**Path Parameters:**
- `userId`: [string] - UUID of the user to assign the role to.

**Request Body:**
```json
{
  "type": "object",
  "properties": {
    "roleId": {
      "type": "string",
      "description": "UUID of the role to assign.",
      "example": "550e8400-e29b-41d4-a716-446655440000"
    }
  },
  "required": ["roleId"]
}
```

**Responses:**

- **`201 Created`**
  - **Description:** Role successfully assigned.
  - **Response Body:**
    ```json
    {
      "message": "Role assigned successfully.",
      "data": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Student"
      }
    }
    ```
    **Field Descriptions:**
    - `message`: Confirmation text.
    - `data.id`: UUID of the newly assigned role.
    - `data.name`: Name of the assigned role.

- **`400 Bad Request`**
  - **Description:** Missing or invalid `roleId`.
- **`401 Unauthorized`**
  - **Description:** Authentication token missing or invalid.
- **`403 Forbidden`**
  - **Description:** Admin permissions required.
- **`404 Not Found`**
  - **Description:** User or role not found.
- **`409 Conflict`**
  - **Description:** Role already assigned to user.
- **`500 Internal Server Error`**
  - **Description:** Unexpected server error.

**Example (Fetch):**
```javascript
const userId = 'd290f1ee-6c54-4b01-90e6-d701748f0851';
const url = `https://api.lms.example.com/v1/users/${userId}/roles`;
const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <YOUR_AUTH_TOKEN>'
  },
  body: JSON.stringify({ roleId: '550e8400-e29b-41d4-a716-446655440000' })
};
const response = await fetch(url, options);
const result = await response.json();
console.log(result.message, result.data);
```

---

### `DELETE /users/{userId}/roles/{roleId}`

**Summary:**  
Removes an assigned role from the specified user.

**Endpoint:**
```
https://api.lms.example.com/v1/users/{userId}/roles/{roleId}
```

**Method:**
```
DELETE
```

**Authentication:**
- Required: Yes  
- Type: Bearer Token (JWT)

**Permissions:**
- Admin only

**Headers:**
```json
{
  "Authorization": "Bearer <YOUR_AUTH_TOKEN>"
}
```

**Path Parameters:**
- `userId`: [string] - UUID of the user.
- `roleId`: [string] - UUID of the role to remove.

**Responses:**

- **`204 No Content`**
  - **Description:** Role successfully removed; no content returned.

- **`400 Bad Request`**
  - **Description:** Invalid path parameters.
- **`401 Unauthorized`**
  - **Description:** Missing or invalid authentication token.
- **`403 Forbidden`**
  - **Description:** Admin permissions required.
- **`404 Not Found`**
  - **Description:** User or role assignment not found.
- **`500 Internal Server Error`**
  - **Description:** Unexpected server error.

**Example (Fetch):**
```javascript
const userId = 'd290f1ee-6c54-4b01-90e6-d701748f0851';
const roleId = '550e8400-e29b-41d4-a716-446655440000';
const url = `https://api.lms.example.com/v1/users/${userId}/roles/${roleId}`;
await fetch(url, {
  method: 'DELETE',
  headers: { 'Authorization': 'Bearer <YOUR_AUTH_TOKEN>' }
});
console.log('Role removed');
```

---