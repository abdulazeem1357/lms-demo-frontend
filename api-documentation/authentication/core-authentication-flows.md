## Authentication API

*Generated on: 2025-05-02*

---

### `POST /auth/login`

**Summary:**  
Authenticates a user with email and password and issues JWT access and refresh tokens.

**Endpoint:**
```
https://api.lms.example.com/v1/auth/login
```

**Method:**
```
POST
```

**Authentication:**
- Required: No

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
// JSON Schema for the request payload
{
  "type": "object",
  "properties": {
    "email": {
      "type": "string",
      "description": "User's registered email address.",
      "example": "student@example.com",
      "format": "email"
    },
    "password": {
      "type": "string",
      "description": "User's account password.",
      "example": "P@ssw0rd!",
      "minLength": 8
    }
  },
  "required": ["email", "password"]
}
```
**Field Descriptions:**
- `email`: Must be a valid, registered email.
- `password`: Minimum 8 characters, including letters and numbers.

**Responses:**

- **`200 OK`**  
  **Description:** Credentials valid; tokens issued.  
  **Response Body:**
  ```json
  {
    "type": "object",
    "properties": {
      "accessToken": {
        "type": "string",
        "description": "Short-lived JWT for authorization.",
        "example": "eyJhbGciOiJIUzI1..."
      },
      "refreshToken": {
        "type": "string",
        "description": "Long-lived token to obtain new access tokens.",
        "example": "dGhpcy1pc..."
      },
      "expiresIn": {
        "type": "integer",
        "description": "Access token lifetime in seconds.",
        "example": 3600
      }
    }
  }
  ```
  **Field Descriptions:**
  - `accessToken`: Use in `Authorization: Bearer <token>` header.
  - `refreshToken`: Store securely to refresh access tokens.
  - `expiresIn`: Time until `accessToken` expiry.

- **`400 Bad Request`**  
  **Description:** Missing or invalid fields.  
  **Response Body:**
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Email and password are required."
    }
  }
  ```

- **`401 Unauthorized`**  
  **Description:** Invalid credentials.  
  **Response Body:**
  ```json
  {
    "error": {
      "code": "INVALID_CREDENTIALS",
      "message": "Email or password is incorrect."
    }
  }
  ```

- **`500 Internal Server Error`**  
  **Description:** Unexpected server error.  
  **Response Body:**
  ```json
  {
    "error": {
      "code": "INTERNAL_ERROR",
      "message": "An internal server error occurred."
    }
  }
  ```

**Examples:**

```javascript
// JavaScript (Fetch)
const url = 'https://api.lms.example.com/v1/auth/login';
const options = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'student@example.com', password: 'P@ssw0rd!' })
};

try {
  const response = await fetch(url, options);
  const data = await response.json();
  console.log(data.accessToken, data.refreshToken);
} catch (error) {
  console.error('Login error:', error);
}
```

**Specific Error Handling Notes:**
- Returns `INVALID_CREDENTIALS` for any authentication failure.

---

### `POST /auth/logout`

**Summary:**  
Invalidates the supplied refresh token, effectively logging out the user.

**Endpoint:**
```
https://api.lms.example.com/v1/auth/logout
```

**Method:**
```
POST
```

**Authentication:**
- Required: Yes  
- Type: Bearer Token (JWT)

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <YOUR_ACCESS_TOKEN>"
}
```

**Request Body:**
```json
// JSON Schema for the request payload
{
  "type": "object",
  "properties": {
    "refreshToken": {
      "type": "string",
      "description": "The refresh token to be invalidated.",
      "example": "dGhpcy1pc..."
    }
  },
  "required": ["refreshToken"]
}
```

**Responses:**

- **`204 No Content`**  
  **Description:** Refresh token invalidated successfully. No body returned.

- **`400 Bad Request`**  
  **Description:** Missing `refreshToken` parameter.  
  **Response Body:**
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "refreshToken is required."
    }
  }
  ```

- **`401 Unauthorized`**  
  **Description:** Access token missing or invalid.  
  **Response Body:**
  ```json
  {
    "error": {
      "code": "UNAUTHORIZED",
      "message": "Authentication required."
    }
  }
  ```

- **`403 Forbidden`**  
  **Description:** Refresh token does not belong to the authenticated user.  
  **Response Body:**
  ```json
  {
    "error": {
      "code": "FORBIDDEN",
      "message": "Cannot invalidate token for another user."
    }
  }
  ```

- **`500 Internal Server Error`**  
  **Description:** Unexpected server error.  
  **Response Body:**
  ```json
  {
    "error": {
      "code": "INTERNAL_ERROR",
      "message": "An internal server error occurred."
    }
  }
  ```

**Examples:**

```javascript
// JavaScript (Fetch)
const url = 'https://api.lms.example.com/v1/auth/logout';
const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <ACCESS_TOKEN>'
  },
  body: JSON.stringify({ refreshToken: '<REFRESH_TOKEN>' })
};

await fetch(url, options);
console.log('Logged out');
```

---

### `POST /auth/refresh`

**Summary:**  
Exchanges a valid refresh token for a new access token (and optionally a new refresh token).

**Endpoint:**
```
https://api.lms.example.com/v1/auth/refresh
```

**Method:**
```
POST
```

**Authentication:**
- Required: No (token provided in body)

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
// JSON Schema for the request payload
{
  "type": "object",
  "properties": {
    "refreshToken": {
      "type": "string",
      "description": "Valid refresh token issued earlier.",
      "example": "dGhpcy1pc..."
    }
  },
  "required": ["refreshToken"]
}
```

**Responses:**

- **`200 OK`**  
  **Description:** New tokens issued.  
  **Response Body:**
  ```json
  {
    "type": "object",
    "properties": {
      "accessToken": {
        "type": "string",
        "description": "New JWT access token.",
        "example": "eyJhbGciOiJIUzI1..."
      },
      "refreshToken": {
        "type": "string",
        "description": "New or rotated refresh token.",
        "example": "bmV3LXJlZnJlc2g..."
      },
      "expiresIn": {
        "type": "integer",
        "description": "Lifetime of the new access token in seconds.",
        "example": 3600
      }
    }
  }
  ```

- **`400 Bad Request`**  
  **Description:** Missing or malformed `refreshToken`.  
  **Response Body:**
  ```json
  {
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "refreshToken is required."
    }
  }
  ```

- **`401 Unauthorized`**  
  **Description:** Refresh token invalid or expired.  
  **Response Body:**
  ```json
  {
    "error": {
      "code": "TOKEN_EXPIRED",
      "message": "Refresh token is expired or invalid."
    }
  }
  ```

- **`500 Internal Server Error`**  
  **Description:** Unexpected server error.  
  **Response Body:**
  ```json
  {
    "error": {
      "code": "INTERNAL_ERROR",
      "message": "An internal server error occurred."
    }
  }
  ```

**Examples:**

```javascript
// JavaScript (Fetch)
const url = 'https://api.lms.example.com/v1/auth/refresh';
const options = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ refreshToken: '<REFRESH_TOKEN>' })
};

const response = await fetch(url, options);
const data = await response.json();
console.log(data.accessToken, data.refreshToken);
```

---

## Security Notes

- **Token Storage:**  
  - Store **refresh tokens** in secure, HttpOnly cookies to mitigate XSS risks.  
  - Keep **access tokens** in memory or short‑lived cookies; avoid `localStorage` for long‑lived tokens.

- **Token Expiration Handling:**  
  - Track `expiresIn` on the client and proactively refresh access tokens (e.g., 1–2 minutes before expiry).  
  - Handle `TOKEN_EXPIRED` errors by redirecting to login or attempting a new refresh.  

- **Best Practices:**  
  - Use secure (HTTPS) transport for all authentication requests.  
  - Implement CSRF protection when using cookies.  
  - Enforce strong password policies and account lockout after repeated failures.

---