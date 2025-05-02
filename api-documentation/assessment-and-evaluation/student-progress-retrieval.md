## Assessment & Evaluation API – Student Progress Retrieval

*Generated on: 2025-05-02*

---

### `GET /users/{userId}/progress`

**Summary:**  
Retrieves overall progress summary for a user across all enrolled courses.

**Endpoint:**
```
https://api.lms.example.com/v1/users/{userId}/progress
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
- `userId`: [string] – UUID of the user whose progress is being fetched.

**Responses:**

- **`200 OK`**  
  - **Description:** Overall progress metrics retrieved successfully.  
  - **Response Body:**
    ```json
    {
      "type": "object",
      "properties": {
        "userId": { "type": "string", "example": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d" },
        "coursesEnrolled": { "type": "integer", "description": "Total number of courses enrolled.", "example": 8 },
        "coursesCompleted": { "type": "integer", "description": "Number of courses fully completed.", "example": 5 },
        "overallCompletionRate": { "type": "number", "description": "Percentage of completion across all courses.", "example": 62.5 },
        "averageScore": { "type": "number", "description": "Average assessment score across all graded items.", "example": 87.3 }
      }
    }
    ```
    **Field Descriptions:**
    - `coursesEnrolled`: Count of distinct courses the user is enrolled in.  
    - `coursesCompleted`: Count of courses where all required modules/quizzes/assignments are done.  
    - `overallCompletionRate`: `(coursesCompleted / coursesEnrolled) * 100`.  
    - `averageScore`: Mean score across all quizzes and assignments.

- **`400 Bad Request`**  
  - **Description:** Invalid `userId` format.  
- **`401 Unauthorized`**  
  - **Description:** Missing or invalid authentication token.  
- **`403 Forbidden`**  
  - **Description:** Accessing another user’s progress without admin rights.  
- **`404 Not Found`**  
  - **Description:** User not found.  
- **`500 Internal Server Error`**  
  - **Description:** Unexpected server error.

**Example (Fetch):**
```javascript
// Fetch overall progress for {{user_login}}
const userId = 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';
const url = `https://api.lms.example.com/v1/users/${userId}/progress`;
const response = await fetch(url, {
  headers: { 'Authorization': 'Bearer <YOUR_AUTH_TOKEN>' }
});
const data = await response.json();
console.log('Progress for {{user_login}}:', data);
```

---

### `GET /users/{userId}/progress/course/{courseId}`

**Summary:**  
Retrieves detailed progress for a user within a specific course, including grades and completion status for quizzes and assignments.

**Endpoint:**
```
https://api.lms.example.com/v1/users/{userId}/progress/course/{courseId}
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
- `userId`: [string] – UUID of the user.  
- `courseId`: [string] – UUID of the course.

**Responses:**

- **`200 OK`**  
  - **Description:** Course-specific progress details retrieved successfully.  
  - **Response Body:**
    ```json
    {
      "type": "object",
      "properties": {
        "userId": { "type": "string", "example": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d" },
        "courseId": { "type": "string", "example": "f1e2d3c4-b5a6-7f8e-9d0c-1b2a3c4d5e6f" },
        "courseTitle": { "type": "string", "example": "Advanced React Patterns" },
        "completionStatus": { "type": "string", "enum": ["in_progress","completed"], "example": "in_progress" },
        "quizzes": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "quizId": { "type": "string", "example": "q1a2b3c4-d5e6-7f8g-9h0i-1j2k3l4m5n6" },
              "title": { "type": "string", "example": "Hooks Deep Dive" },
              "score": { "type": "number", "example": 92 },
              "maxScore": { "type": "number", "example": 100 },
              "status": { "type": "string", "enum": ["pending","graded"], "example": "graded" },
              "gradedAt": { "type": "string", "format": "date-time", "example": "2025-05-01T16:00:00Z" }
            }
          }
        },
        "assignments": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "assignmentId": { "type": "string", "example": "a7b8c9d0-e1f2-3a4b-5c6d-7e8f9g0h1i2j" },
              "title": { "type": "string", "example": "State Management Essay" },
              "score": { "type": "number", "example": 85 },
              "maxScore": { "type": "number", "example": 100 },
              "status": { "type": "string", "enum": ["pending","graded"], "example": "graded" },
              "gradedAt": { "type": "string", "format": "date-time", "example": "2025-05-02T14:45:00Z" }
            }
          }
        }
      }
    }
    ```
    **Field Descriptions:**
    - `completionStatus`: Reflects whether all modules/quizzes/assignments are done.  
    - `quizzes` / `assignments`: Lists with score, maxScore, status, and timestamp.

- **`400 Bad Request`**  
  - **Description:** Invalid `userId` or `courseId` format.  
- **`401 Unauthorized`**  
  - **Description:** Missing or invalid authentication token.  
- **`403 Forbidden`**  
  - **Description:** Accessing another user’s course progress without rights.  
- **`404 Not Found`**  
  - **Description:** User or course not found.  
- **`500 Internal Server Error`**  
  - **Description:** Unexpected server error.

**Example (Fetch):**
```javascript
// Fetch course progress for {{user_login}}
const userId = 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';
const courseId = 'f1e2d3c4-b5a6-7f8e-9d0c-1b2a3c4d5e6f';
const url = `https://api.lms.example.com/v1/users/${userId}/progress/course/${courseId}`;
const response = await fetch(url, {
  headers: { 'Authorization': 'Bearer <YOUR_AUTH_TOKEN>' }
});
const data = await response.json();
console.log('Course Progress for {{user_login}}:', data);
```

---

**UI Integration Notes:**  
- The **overall progress** endpoint feeds the Student Portal dashboard, powering summary cards (total courses, completion rate, average score).  
- The **course-specific progress** endpoint populates the course detail page, driving progress bars, graded item tables, score badges, and completion indicators for each quiz and assignment.

---