## Authentication API – Password Management Flow

### `POST /auth/password/request-reset`

**Summary:** Initiates a password reset by sending a reset email to the user.

**Endpoint:**
```
https://api.lms.example.com/v1/auth/password/request-reset
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
{
  "type": "object",
  "properties": {
    "email": {
      "type": "string",
      "description": "Registered user email address.",
      "example": "user@example.com"
    }
  },
  "required": ["email"]
}
```

Field Descriptions:
- `email`: Email address associated with the user account.

**Responses:**

- **`200 OK`**
  - **Description:** If the email exists, a password reset link has been sent.
  - **Response Body:**
    ```json
    {
      "message": "Password reset email sent."
    }
    ```
    **Field Descriptions:**
    - `message`: Confirmation that the reset email was dispatched.

- **`400 Bad Request`**
  - **Description:** Invalid request payload (e.g., malformed email).
  - **Response Body:**
    ```json
    {
      "error": {
        "code": "VALIDATION_ERROR",
        "message": "Invalid email format.",
        "details": [{ "field": "email", "issue": "Must be a valid email address." }]
      }
    }
    ```

- **`404 Not Found`**
  - **Description:** No user found for the provided email.
  - **Response Body:**
    ```json
    {
      "error": {
        "code": "USER_NOT_FOUND",
        "message": "No account associated with this email."
      }
    }
    ```

- **`429 Too Many Requests`**
  - **Description:** Rate limit exceeded for password reset requests.
  - **Response Body:**
    ```json
    {
      "error": {
        "code": "RATE_LIMIT_EXCEEDED",
        "message": "Too many reset attempts. Please try again later."
      }
    }
    ```
  - **Headers:**  
    - `Retry-After`: Number of seconds until the next allowed request.

- **`500 Internal Server Error`**
  - **Description:** Unexpected server error.
  - **Response Body:**
    ```json
    {
      "error": {
        "code": "INTERNAL_ERROR",
        "message": "An internal server error occurred."
      }
    }
    ```

**Examples:**

- **JavaScript (Fetch):**
  ```javascript
  const url = 'https://api.lms.example.com/v1/auth/password/request-reset';
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'user@example.com' })
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Fetch error:', error);
  }
  ```

**Rate Limiting:**
- Max 5 requests per hour per email/IP.

---

### `POST /auth/password/reset`

**Summary:** Completes the password reset by validating the token and setting a new password.

**Endpoint:**
```
https://api.lms.example.com/v1/auth/password/reset
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
{
  "type": "object",
  "properties": {
    "token": {
      "type": "string",
      "description": "Password reset token received via email.",
      "example": "d9f7a1b2-3c4d-5e6f-7a8b-9c0d1e2f3a4b"
    },
    "newPassword": {
      "type": "string",
      "description": "The user's new password (min. 8 characters).",
      "example": "Str0ngP@ssw0rd!"
    }
  },
  "required": ["token", "newPassword"]
}
```

Field Descriptions:
- `token`: Unique reset token issued by the system.
- `newPassword`: New password meeting security requirements.

**Responses:**

- **`200 OK`**
  - **Description:** Password has been successfully reset.
  - **Response Body:**
    ```json
    {
      "message": "Password has been reset successfully."
    }
    ```
    **Field Descriptions:**
    - `message`: Confirmation of successful password reset.

- **`400 Bad Request`**
  - **Description:** Invalid or missing fields, or token issues.
  - **Response Body Examples:**
    - Missing fields:
      ```json
      {
        "error": {
          "code": "VALIDATION_ERROR",
          "message": "Missing required fields.",
          "details": [{ "field": "token", "issue": "Token is required." }]
        }
      }
      ```
    - Invalid or expired token:
      ```json
      {
        "error": {
          "code": "INVALID_OR_EXPIRED_TOKEN",
          "message": "Reset token is invalid or has expired."
        }
      }
      ```

- **`500 Internal Server Error`**
  - **Description:** Unexpected server error.
  - **Response Body:**
    ```json
    {
      "error": {
        "code": "INTERNAL_ERROR",
        "message": "An internal server error occurred."
      }
    }
    ```

**Examples:**

- **JavaScript (Fetch):**
  ```javascript
  const url = 'https://api.lms.example.com/v1/auth/password/reset';
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token: 'd9f7a1b2-3c4d-5e6f-7a8b-9c0d1e2f3a4b',
      newPassword: 'Str0ngP@ssw0rd!'
    })
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Fetch error:', error);
  }
  ```

**Token Validity:**
- Reset tokens expire 1 hour after issuance.
- Tokens are single-use and invalidated upon successful reset or expiration.

---