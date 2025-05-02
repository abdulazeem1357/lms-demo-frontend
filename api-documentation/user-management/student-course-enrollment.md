## Student Course Enrollment API

*Generated on: 2025-05-02*

---

### `GET /users/{userId}/enrollments`

**Summary:**  
Retrieves the list of courses a student is enrolled in.

**Endpoint:**
```
https://api.lms.example.com/v1/users/{userId}/enrollments
```

**Method:**
```
GET
```

**Authentication:**
- Required: Yes  
- Type: Bearer Token (JWT)

**Permissions:**
- Student (self) or Admin

**Headers:**
```json
{
  "Authorization": "Bearer <YOUR_AUTH_TOKEN>"
}
```

**Path Parameters:**
- `userId`: [string] - UUID of the student.

**Responses:**

- **`200 OK`**
  - **Description:** Successful retrieval of enrollments.
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
              "enrollmentId": {
                "type": "string",
                "description": "UUID of the enrollment record.",
                "example": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d"
              },
              "course": {
                "type": "object",
                "properties": {
                  "id": { "type": "string", "description": "UUID of the course.", "example": "f1e2d3c4-b5a6-7f8e-9d0c-1b2a3c4d5e6f" },
                  "title": { "type": "string", "description": "Course title.", "example": "Introduction to React" },
                  "description": { "type": "string", "description": "Brief course description.", "example": "A beginner-friendly React course." }
                }
              },
              "enrolledAt": {
                "type": "string",
                "format": "date-time",
                "description": "Timestamp of enrollment.",
                "example": "2025-04-15T10:20:30Z"
              }
            }
          }
        }
      }
    }
    ```
    **Field Descriptions:**
    - `enrollmentId`: Identifier for the enrollment.
    - `course.id` / `course.title` / `course.description`: Basic course info.
    - `enrolledAt`: When the enrollment occurred.

- **`400 Bad Request`**  
  Invalid `userId` format.

- **`401 Unauthorized`**  
  Missing or invalid auth token.

- **`403 Forbidden`**  
  Accessing another user’s enrollments without admin rights.

- **`404 Not Found`**  
  User not found.

- **`500 Internal Server Error`**  
  Unexpected server error.

**Example (Fetch):**
```javascript
const userId = 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';
const url = `https://api.lms.example.com/v1/users/${userId}/enrollments`;
const response = await fetch(url, {
  headers: { 'Authorization': 'Bearer <YOUR_AUTH_TOKEN>' }
});
const { data } = await response.json();
console.log('Enrollments:', data);
```

---

### `POST /users/{userId}/enrollments`

**Summary:**  
Enrolls a student in a course.

**Endpoint:**
```
https://api.lms.example.com/v1/users/{userId}/enrollments
```

**Method:**
```
POST
```

**Authentication:**
- Required: Yes  
- Type: Bearer Token (JWT)

**Permissions:**
- Admin

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <YOUR_AUTH_TOKEN>"
}
```

**Path Parameters:**
- `userId`: [string] - UUID of the student.

**Request Body:**
```json
{
  "type": "object",
  "properties": {
    "courseId": {
      "type": "string",
      "description": "UUID of the course to enroll in.",
      "example": "f1e2d3c4-b5a6-7f8e-9d0c-1b2a3c4d5e6f"
    }
  },
  "required": ["courseId"]
}
```

**Field Descriptions:**
- `courseId`: Identifier of the course.

**Responses:**

- **`201 Created`**
  - **Description:** Enrollment successful.
  - **Response Body:**
    ```json
    {
      "type": "object",
      "properties": {
        "enrollmentId": {
          "type": "string",
          "description": "UUID of the new enrollment record.",
          "example": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d"
        },
        "userId": { "type": "string", "example": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d" },
        "courseId": { "type": "string", "example": "f1e2d3c4-b5a6-7f8e-9d0c-1b2a3c4d5e6f" },
        "enrolledAt": { "type": "string", "format": "date-time", "example": "2025-05-02T12:00:00Z" }
      }
    }
    ```
    **Field Descriptions:**
    - `enrollmentId`: New enrollment identifier.
    - `userId` / `courseId`: Echoed IDs.
    - `enrolledAt`: Timestamp created.

- **`400 Bad Request`**  
  Missing or invalid `courseId`.

- **`401 Unauthorized`**  
  Invalid auth token.

- **`403 Forbidden`**  
  Permission denied.

- **`404 Not Found`**  
  User or course not found.

- **`409 Conflict`**  
  Already enrolled.

- **`500 Internal Server Error`**  
  Unexpected error.

**Example (Fetch):**
```javascript
const userId = 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';
const url = `https://api.lms.example.com/v1/users/${userId}/enrollments`;
const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <YOUR_AUTH_TOKEN>'
  },
  body: JSON.stringify({ courseId: 'f1e2d3c4-b5a6-7f8e-9d0c-1b2a3c4d5e6f' })
};
const result = await fetch(url, options).then(r => r.json());
console.log('Enrolled:', result);
```

---

### `DELETE /users/{userId}/enrollments/{enrollmentId}`

**Summary:**  
Unenrolls a student from a course.

**Endpoint:**
```
https://api.lms.example.com/v1/users/{userId}/enrollments/{enrollmentId}
```

**Method:**
```
DELETE
```

**Authentication:**
- Required: Yes  
- Type: Bearer Token (JWT)

**Permissions:**
- Admin

**Headers:**
```json
{
  "Authorization": "Bearer <YOUR_AUTH_TOKEN>"
}
```

**Path Parameters:**
- `userId`: [string] - UUID of the student.  
- `enrollmentId`: [string] - UUID of the enrollment record.

**Responses:**

- **`204 No Content`**  
  Enrollment removed successfully; no body.

- **`400 Bad Request`**  
  Invalid parameters.

- **`401 Unauthorized`**  
  Invalid auth token.

- **`403 Forbidden`**  
  Permission denied.

- **`404 Not Found`**  
  Enrollment not found.

- **`500 Internal Server Error`**  
  Unexpected error.

**Example (Fetch):**
```javascript
const userId = 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';
const enrollmentId = 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';
await fetch(`https://api.lms.example.com/v1/users/${userId}/enrollments/${enrollmentId}`, {
  method: 'DELETE',
  headers: { 'Authorization': 'Bearer <YOUR_AUTH_TOKEN>' }
});
console.log('Unenrolled');
```

---

### `GET /courses/{courseId}/enrollments`

**Summary:**  
Retrieves the list of students enrolled in a specific course.

**Endpoint:**
```
https://api.lms.example.com/v1/courses/{courseId}/enrollments
```

**Method:**
```
GET
```

**Authentication:**
- Required: Yes  
- Type: Bearer Token (JWT)

**Permissions:**
- Instructor of the course or Admin

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
  - **Description:** List of enrolled students.
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
              "enrollmentId": {
                "type": "string",
                "example": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d"
              },
              "student": {
                "type": "object",
                "properties": {
                  "id": { "type": "string", "example": "u1v2w3x4-y5z6-7a8b-9c0d-1e2f3a4b5c6d" },
                  "username": { "type": "string", "example": "jdoe" },
                  "firstName": { "type": "string", "example": "John" },
                  "lastName": { "type": "string", "example": "Doe" }
                }
              },
              "enrolledAt": { "type": "string", "format": "date-time", "example": "2025-04-15T10:20:30Z" }
            }
          }
        }
      }
    }
    ```
    **Field Descriptions:**
    - `student.id`, `student.username`, `student.firstName`, `student.lastName`: Student info.
    - `enrolledAt`: Enrollment timestamp.

- **`400 Bad Request`**, **`401 Unauthorized`**, **`403 Forbidden`**, **`404 Not Found`**, **`500 Internal Server Error`**  
  *(As defined above.)*

**Example (Fetch):**
```javascript
const courseId = 'f1e2d3c4-b5a6-7f8e-9d0c-1b2a3c4d5e6f';
const url = `https://api.lms.example.com/v1/courses/${courseId}/enrollments`;
const response = await fetch(url, {
  headers: { 'Authorization': 'Bearer <YOUR_AUTH_TOKEN>' }
});
const { data } = await response.json();
console.log('Enrolled students:', data);
```

---