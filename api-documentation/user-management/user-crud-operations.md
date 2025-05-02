## User Management API (User CRUD Operations)

*Generated on 2025-05-02*

---

### `POST /users`

**Summary:** Creates a new user in the system.

**Endpoint:**
```
https://api.lms.example.com/v1/users
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

**Request Body:**
```json
{
  "type": "object",
  "properties": {
    "username": {
      "type": "string",
      "description": "Unique username for the user.",
      "example": "jdoe",
      "required": true
    },
    "email": {
      "type": "string",
      "description": "User's email address.",
      "example": "jdoe@example.com",
      "required": true
    },
    "firstName": {
      "type": "string",
      "description": "User's first name.",
      "example": "John",
      "required": true
    },
    "lastName": {
      "type": "string",
      "description": "User's last name.",
      "example": "Doe",
      "required": true
    },
    "role": {
      "type": "string",
      "description": "Role assigned to the user (e.g., admin, instructor, student).",
      "example": "student",
      "required": true
    },
    "password": {
      "type": "string",
      "description": "Initial password for the user account.",
      "example": "P@ssw0rd!",
      "required": true
    }
  },
  "required": ["username", "email", "firstName", "lastName", "role", "password"]
}
```

**Responses:**

- **`201 Created`**
  - **Description:** User successfully created.
  - **Response Body:**
    ```json
    {
      "type": "object",
      "properties": {
        "data": {
          "type": "object",
          "properties": {
            "id": { "type": "string", "description": "UUID of the new user.", "example": "550e8400-e29b-41d4-a716-446655440000" },
            "username": { "type": "string", "example": "jdoe" },
            "email": { "type": "string", "example": "jdoe@example.com" },
            "firstName": { "type": "string", "example": "John" },
            "lastName": { "type": "string", "example": "Doe" },
            "role": { "type": "string", "example": "student" },
            "isActive": { "type": "boolean", "example": true },
            "createdAt": { "type": "string", "format": "date-time", "example": "2025-05-02T14:23:00Z" },
            "updatedAt": { "type": "string", "format": "date-time", "example": "2025-05-02T14:23:00Z" }
          }
        }
      }
    }
    ```
  - **Field Descriptions:**
    - `id`: Unique identifier for the user (UUID).  
    - `isActive`: Indicates whether the user account is active.  
    - `createdAt` / `updatedAt`: Timestamps.

- **`400 Bad Request`**
  - **Description:** Validation error or missing required fields.
  - **Response Body:**
    ```json
    {
      "error": {
        "code": "VALIDATION_ERROR",
        "message": "Validation failed.",
        "details": [
          { "field": "email", "issue": "Must be a valid email address." }
        ]
      }
    }
    ```

- **`401 Unauthorized`**
  ```json
  { "error": { "code": "UNAUTHORIZED", "message": "Authentication required." } }
  ```

- **`403 Forbidden`**
  ```json
  { "error": { "code": "FORBIDDEN", "message": "Admin permissions required." } }
  ```

- **`500 Internal Server Error`**
  ```json
  { "error": { "code": "INTERNAL_ERROR", "message": "An internal server error occurred." } }
  ```

**Examples:**

- **JavaScript (Fetch):**
  ```javascript
  const url = 'https://api.lms.example.com/v1/users';
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer <YOUR_AUTH_TOKEN>'
    },
    body: JSON.stringify({
      username: 'jdoe',
      email: 'jdoe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'student',
      password: 'P@ssw0rd!'
    })
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log('Created user:', data);
  } catch (error) {
    console.error('Error creating user:', error);
  }
  ```

---

### `GET /users`

**Summary:** Retrieves a paginated list of users, with optional filtering.

**Endpoint:**
```
https://api.lms.example.com/v1/users
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

**Query Parameters:**
- `page`: [integer] - Page number (default: 1).  
- `limit`: [integer] - Items per page (default: 20).  
- `role`: [string] - Filter by role (e.g., admin, student).  
- `isActive`: [boolean] - Filter by active status.

**Responses:**

- **`200 OK`**
  - **Description:** List of users.
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
            "page": { "type": "integer" },
            "limit": { "type": "integer" },
            "totalItems": { "type": "integer" },
            "totalPages": { "type": "integer" }
          }
        }
      }
    }
    ```
  - **Field Descriptions:**
    - `data`: Array of user objects (`IUser`).  
    - `meta`: Pagination details.

- **`400 Bad Request`**, **`401 Unauthorized`**, **`403 Forbidden`**, **`500 Internal Server Error`**  
  *(As defined above.)*

**Examples:**

- **JavaScript (Fetch):**
  ```javascript
  const url = new URL('https://api.lms.example.com/v1/users');
  url.searchParams.set('page', '1');
  url.searchParams.set('limit', '20');
  url.searchParams.set('role', 'student');

  const response = await fetch(url, {
    headers: { 'Authorization': 'Bearer <YOUR_AUTH_TOKEN>' }
  });
  const { data, meta } = await response.json();
  console.log('Users:', data, 'Pagination:', meta);
  ```

---

### `GET /users/{userId}`

**Summary:** Retrieves details of a single user by ID.

**Endpoint:**
```
https://api.lms.example.com/v1/users/{userId}
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

**Path Parameters:**
- `userId`: [string] - UUID of the user.

**Headers:**
```json
{
  "Authorization": "Bearer <YOUR_AUTH_TOKEN>"
}
```

**Responses:**

- **`200 OK`**
  - **Description:** User details.
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

- **`400`, `401`, `403`, `404`, `500`**  
  *(As defined above; 404 if user not found.)*

**Examples:**

- **JavaScript (Fetch):**
  ```javascript
  // Fetch details for {{user_login}}:
  const userId = '550e8400-e29b-41d4-a716-446655440000';
  const url = `https://api.lms.example.com/v1/users/${userId}`;
  const response = await fetch(url, {
    headers: { 'Authorization': 'Bearer <YOUR_AUTH_TOKEN>' }
  });
  const { data } = await response.json();
  console.log('User details for {{user_login}}:', data);
  ```

---

### `PUT /users/{userId}`

**Summary:** Updates an existing user's details.

**Endpoint:**
```
https://api.lms.example.com/v1/users/{userId}
```

**Method:**
```
PUT
```

**Authentication:**
- Required: Yes  
- Type: Bearer Token (JWT)

**Permissions:**
- Admin only

**Path Parameters:**
- `userId`: [string] - UUID of the user to update.

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
    "email": { "type": "string", "description": "New email address.", "example": "new@example.com" },
    "firstName": { "type": "string", "example": "Jane" },
    "lastName": { "type": "string", "example": "Smith" },
    "role": { "type": "string", "example": "instructor" },
    "isActive": { "type": "boolean", "example": false }
  }
}
```

**Responses:**

- **`200 OK`**
  - **Description:** Updated user object.
  - **Response Body:** Same schema as `GET /users/{userId}`.

- **`400`, `401`, `403`, `404`, `500`**  
  *(As defined above.)*

**Examples:**

- **JavaScript (Fetch):**
  ```javascript
  const userId = '550e8400-e29b-41d4-a716-446655440000';
  const url = `https://api.lms.example.com/v1/users/${userId}`;
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer <YOUR_AUTH_TOKEN>'
    },
    body: JSON.stringify({ firstName: 'Jane', isActive: false })
  };
  const response = await fetch(url, options);
  const { data } = await response.json();
  console.log('Updated user:', data);
  ```

---

### `DELETE /users/{userId}`

**Summary:** Deletes a user account.

**Endpoint:**
```
https://api.lms.example.com/v1/users/{userId}
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

**Path Parameters:**
- `userId`: [string] - UUID of the user to delete.

**Headers:**
```json
{
  "Authorization": "Bearer <YOUR_AUTH_TOKEN>"
}
```

**Responses:**

- **`204 No Content`**
  - **Description:** User successfully deleted; no body returned.

- **`400`, `401`, `403`, `404`, `500`**  
  *(As defined above.)*

**Examples:**

- **JavaScript (Fetch):**
  ```javascript
  const userId = '550e8400-e29b-41d4-a716-446655440000';
  const url = `https://api.lms.example.com/v1/users/${userId}`;
  await fetch(url, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer <YOUR_AUTH_TOKEN>' }
  });
  console.log('User deleted');
  ```

---