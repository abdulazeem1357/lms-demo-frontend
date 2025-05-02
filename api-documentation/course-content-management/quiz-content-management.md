## Course Content Management API – Quiz Content Management

*Generated on: 2025-05-02*

---

### `GET /modules/{moduleId}/quizzes`

**Summary:**  
Retrieves the list of quizzes defined for a specific module.

**Endpoint:**
```
https://api.lms.example.com/v1/modules/{moduleId}/quizzes
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
  - **Description:** Successfully retrieved list of quizzes.
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
              "id": { "type": "string", "description": "UUID of the quiz.", "example": "q1a2b3c4-d5e6-7f8g-9h0i-1j2k3l4m5n6" },
              "moduleId": { "type": "string", "example": "m1a2b3c4-d5e6-7f8g-9h0i-1j2k3l4m5n6" },
              "title": { "type": "string", "description": "Title of the quiz.", "example": "Quiz 1: Introduction" },
              "description": { "type": "string", "description": "Optional quiz description.", "example": "Covers module basics." },
              "createdAt": { "type": "string", "format": "date-time", "example": "2025-05-02T12:00:00Z" },
              "updatedAt": { "type": "string", "format": "date-time", "example": "2025-05-02T12:00:00Z" }
            }
          }
        }
      }
    }
    ```
    **Field Descriptions:**
    - `id`: Unique quiz identifier.  
    - `moduleId`: Parent module identifier.  
    - `title`: Quiz title.  
    - `description`: Quiz description.  
    - `createdAt` / `updatedAt`: Timestamps.

- **`400 Bad Request`**, **`401 Unauthorized`**, **`403 Forbidden`**, **`404 Not Found`**, **`500 Internal Server Error`**  
  *(As defined above.)*

**Example (Fetch):**
```javascript
const moduleId = 'm1a2b3c4-d5e6-7f8g-9h0i-1j2k3l4m5n6';
const url = `https://api.lms.example.com/v1/modules/${moduleId}/quizzes`;
const response = await fetch(url, {
  headers: { 'Authorization': 'Bearer <YOUR_AUTH_TOKEN>' }
});
const { data } = await response.json();
console.log('Quizzes:', data);
```

---

### `POST /modules/{moduleId}/quizzes`

**Summary:**  
Creates a new quiz record for a specific module.

**Endpoint:**
```
https://api.lms.example.com/v1/modules/{moduleId}/quizzes
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
      "description": "Title of the quiz.",
      "example": "Quiz 1: Introduction"
    },
    "description": {
      "type": "string",
      "description": "Optional quiz description.",
      "example": "Covers module basics."
    }
  },
  "required": ["title"]
}
```
**Field Descriptions:**
- `title`: Quiz title.  
- `description`: Quiz description.

**Responses:**

- **`201 Created`**
  - **Description:** Quiz successfully created.
  - **Response Body:**
    ```json
    {
      "type": "object",
      "properties": {
        "data": {
          "type": "object",
          "properties": {
            "id": { "type": "string", "description": "UUID of the new quiz.", "example": "q1a2b3c4-d5e6-7f8g-9h0i-1j2k3l4m5n6" },
            "moduleId": { "type": "string", "example": "m1a2b3c4-d5e6-7f8g-9h0i-1j2k3l4m5n6" },
            "title": { "type": "string", "example": "Quiz 1: Introduction" },
            "description": { "type": "string", "example": "Covers module basics." },
            "createdAt": { "type": "string", "format": "date-time", "example": "2025-05-02T12:00:00Z" },
            "updatedAt": { "type": "string", "format": "date-time", "example": "2025-05-02T12:00:00Z" }
          }
        }
      }
    }
    ```

- **`400 Bad Request`**, **`401 Unauthorized`**, **`403 Forbidden`**, **`404 Not Found`**, **`500 Internal Server Error`**

**Example (Fetch):**
```javascript
const moduleId = 'm1a2b3c4-d5e6-7f8g-9h0i-1j2k3l4m5n6';
const url = `https://api.lms.example.com/v1/modules/${moduleId}/quizzes`;
const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <YOUR_AUTH_TOKEN>'
  },
  body: JSON.stringify({ title: 'Quiz 1: Introduction', description: 'Covers module basics.' })
};
const response = await fetch(url, options);
const { data } = await response.json();
console.log('Created quiz:', data);
```

---

### `GET /quizzes/{quizId}`

**Summary:**  
Retrieves detailed information for a single quiz, including its questions.

**Endpoint:**
```
https://api.lms.example.com/v1/quizzes/{quizId}
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
- `quizId`: [string] – UUID of the quiz.

**Responses:**

- **`200 OK`**
  - **Description:** Quiz details with questions.
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
            "questions": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "id": { "type": "string", "description": "UUID of the question." },
                  "quizId": { "type": "string" },
                  "type": {
                    "type": "string",
                    "enum": ["single_choice", "multiple_choice", "true_false", "short_answer"]
                  },
                  "text": { "type": "string", "description": "Question text." },
                  "options": {
                    "type": "array",
                    "description": "Answer options for choice questions.",
                    "items": {
                      "type": "object",
                      "properties": {
                        "id": { "type": "string" },
                        "text": { "type": "string" }
                      }
                    }
                  },
                  "correctAnswer": {
                    "description": "Correct answer format varies by question type."
                  },
                  "order": { "type": "integer", "description": "Display order of the question." }
                }
              }
            },
            "createdAt": { "type": "string", "format": "date-time" },
            "updatedAt": { "type": "string", "format": "date-time" }
          }
        }
      }
    }
    ```
    **Field Descriptions:**
    - `IQuiz`:
      - `id`, `moduleId`, `title`, `description`, `createdAt`, `updatedAt` as above.
      - `questions`: Array of `IQuestion`.
    - `IQuestion`:
      - `id`: Unique question identifier.
      - `quizId`: Parent quiz identifier.
      - `type`: Question type.
      - `text`: Question prompt.
      - `options`: For choice questions.
      - `correctAnswer`: Single value or array for correct choices; boolean for true/false; string for short answer.
      - `order`: Sequence.

- **`400 Bad Request`**, **`401 Unauthorized`**, **`403 Forbidden`**, **`404 Not Found`**, **`500 Internal Server Error`**

**Example (Fetch):**
```javascript
const quizId = 'q1a2b3c4-d5e6-7f8g-9h0i-1j2k3l4m5n6';
const url = `https://api.lms.example.com/v1/quizzes/${quizId}`;
const response = await fetch(url, {
  headers: { 'Authorization': 'Bearer <YOUR_AUTH_TOKEN>' }
});
const { data } = await response.json();
console.log('Quiz details:', data);
```

---

### `PUT /quizzes/{quizId}`

**Summary:**  
Updates quiz metadata and/or its questions.

**Endpoint:**
```
https://api.lms.example.com/v1/quizzes/{quizId}
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
- `quizId`: [string] – UUID of the quiz.

**Request Body:**
```json
{
  "type": "object",
  "properties": {
    "title": { "type": "string", "description": "Updated title.", "example": "Quiz 1: Updated" },
    "description": { "type": "string", "example": "Revised description." },
    "questions": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": { "type": "string", "description": "Existing question UUID; omit for new questions." },
          "type": { "type": "string", "enum": ["single_choice","multiple_choice","true_false","short_answer"] },
          "text": { "type": "string" },
          "options": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": { "id": { "type": "string" }, "text": { "type": "string" } }
            }
          },
          "correctAnswer": {},
          "order": { "type": "integer" }
        }
      }
    }
  }
}
```

**Responses:**

- **`200 OK`**
  - **Description:** Quiz updated successfully.
  - **Response Body:** Same schema as `GET /quizzes/{quizId}`.

- **`400 Bad Request`**, **`401 Unauthorized`**, **`403 Forbidden`**, **`404 Not Found`**, **`500 Internal Server Error`**

**Example (Fetch):**
```javascript
const quizId = 'q1a2b3c4-d5e6-7f8g-9h0i-1j2k3l4m5n6';
const url = `https://api.lms.example.com/v1/quizzes/${quizId}`;
const options = {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <YOUR_AUTH_TOKEN>'
  },
  body: JSON.stringify({
    title: 'Quiz 1: Updated',
    questions: [
      { type: 'true_false', text: 'Is React a library?', correctAnswer: true, order: 1 }
    ]
  })
};
const response = await fetch(url, options);
const { data } = await response.json();
console.log('Updated quiz:', data);
```

---

### `DELETE /quizzes/{quizId}`

**Summary:**  
Deletes a quiz and all its associated questions.

**Endpoint:**
```
https://api.lms.example.com/v1/quizzes/{quizId}
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
- `quizId`: [string] – UUID of the quiz.

**Responses:**

- **`204 No Content`**
  - **Description:** Quiz deleted successfully; no content returned.

- **`400 Bad Request`**, **`401 Unauthorized`**, **`403 Forbidden`**, **`404 Not Found`**, **`500 Internal Server Error`**

**Example (Fetch):**
```javascript
const quizId = 'q1a2b3c4-d5e6-7f8g-9h0i-1j2k3l4m5n6';
await fetch(`https://api.lms.example.com/v1/quizzes/${quizId}`, {
  method: 'DELETE',
  headers: { 'Authorization': 'Bearer <YOUR_AUTH_TOKEN>' }
});
console.log('Quiz deleted');
```

---