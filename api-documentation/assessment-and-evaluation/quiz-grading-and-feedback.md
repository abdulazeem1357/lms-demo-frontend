## Assessment & Evaluation API – Quiz Grading & Feedback

*Generated on: 2025-05-02*

---

### `GET /quizzes/{quizId}/submissions`

**Summary:**  
Retrieves a list of submissions for a specific quiz, including grading status and scores.

**Endpoint:**
```
https://api.lms.example.com/v1/quizzes/{quizId}/submissions
```

**Method:**
```
GET
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
- `quizId`: [string] – UUID of the quiz.

**Responses:**

- **`200 OK`**
  - **Description:** List of submissions retrieved successfully.
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
              "submissionId": {
                "type": "string",
                "description": "UUID of the submission.",
                "example": "s1a2b3c4-d5e6-7f8g-9h0i-1j2k3l4m5n6"
              },
              "userId": {
                "type": "string",
                "description": "UUID of the student who submitted.",
                "example": "u1a2b3c4-5d6e-7f8g-9h0i-1j2k3l4m5n6"
              },
              "submittedAt": {
                "type": "string",
                "format": "date-time",
                "description": "Timestamp when the submission was made.",
                "example": "2025-05-01T15:30:00Z"
              },
              "status": {
                "type": "string",
                "enum": ["pending","graded"],
                "description": "Grading status of the submission.",
                "example": "pending"
              },
              "score": {
                "type": "number",
                "description": "Total score if graded; null if pending.",
                "example": 85
              }
            }
          }
        }
      }
    }
    ```
    **Field Descriptions:**
    - `submissionId`: Unique identifier for the submission.
    - `userId`: Student’s UUID.
    - `submittedAt`: When the student submitted.
    - `status`: “pending” if not yet graded; “graded” otherwise.
    - `score`: Numeric total score.

- **`400 Bad Request`**  
  - **Description:** Invalid `quizId` format.

- **`401 Unauthorized`**  
  - **Description:** Missing or invalid token.

- **`403 Forbidden`**  
  - **Description:** Insufficient permissions.

- **`404 Not Found`**  
  - **Description:** Quiz not found.

- **`500 Internal Server Error`**  
  - **Description:** Unexpected server error.

**Example (Fetch):**
```javascript
const quizId = 's1a2b3c4-d5e6-7f8g-9h0i-1j2k3l4m5n6';
const url = `https://api.lms.example.com/v1/quizzes/${quizId}/submissions`;
const response = await fetch(url, {
  headers: { 'Authorization': 'Bearer <YOUR_AUTH_TOKEN>' }
});
const { data } = await response.json();
console.log('Submissions:', data);
```

---

### `GET /submissions/quiz/{submissionId}`

**Summary:**  
Retrieves detailed information for a specific quiz submission, including each answer, auto‑grading results, and instructor feedback.

**Endpoint:**
```
https://api.lms.example.com/v1/submissions/quiz/{submissionId}
```

**Method:**
```
GET
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
- `submissionId`: [string] – UUID of the submission.

**Responses:**

- **`200 OK`**
  - **Description:** Submission details retrieved successfully.
  - **Response Body:**
    ```json
    {
      "type": "object",
      "properties": {
        "data": {
          "type": "object",
          "properties": {
            "submissionId": { "type": "string" },
            "quizId": { "type": "string" },
            "userId": { "type": "string" },
            "submittedAt": { "type": "string", "format": "date-time" },
            "status": { "type": "string", "enum": ["pending","graded"] },
            "autoGraded": {
              "type": "boolean",
              "description": "Whether MCQs were auto‑graded.",
              "example": true
            },
            "answers": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "questionId": { "type": "string" },
                  "type": {
                    "type": "string",
                    "enum": ["single_choice","multiple_choice","true_false","short_answer"]
                  },
                  "answer": {
                    "type": ["string","array"],
                    "description": "User’s answer format varies by question type.",
                    "example": "optionA"
                  },
                  "isCorrect": {
                    "type": "boolean",
                    "description": "Auto‑grading result for MCQs; null for subjective.",
                    "example": true
                  },
                  "score": {
                    "type": "number",
                    "description": "Score awarded for this question.",
                    "example": 5
                  },
                  "feedback": {
                    "type": "string",
                    "description": "Instructor’s feedback for this question.",
                    "example": "Good reasoning."
                  }
                }
              }
            },
            "overallFeedback": {
              "type": "string",
              "description": "General feedback for the entire submission.",
              "example": "Well done overall."
            },
            "totalScore": {
              "type": "number",
              "description": "Sum of all question scores.",
              "example": 90
            }
          }
        }
      }
    }
    ```
    **Field Descriptions:**
    - `autoGraded`: Indicates if MCQ questions were auto‑evaluated.
    - `answers`: List of answers with auto‑grading flags and instructor comments.
    - `overallFeedback`: Aggregate feedback.

- **`400 Bad Request`**, **`401 Unauthorized`**, **`403 Forbidden`**, **`404 Not Found`**, **`500 Internal Server Error`**  

**Example (Fetch):**
```javascript
const submissionId = 's1a2b3c4-d5e6-7f8g-9h0i-1j2k3l4m5n6';
const url = `https://api.lms.example.com/v1/submissions/quiz/${submissionId}`;
const response = await fetch(url, {
  headers: { 'Authorization': 'Bearer <YOUR_AUTH_TOKEN>' }
});
const { data } = await response.json();
console.log('Submission Details:', data);
```

---

### `POST /submissions/quiz/{submissionId}/grade`

**Summary:**  
Submits grading details and feedback for a quiz submission; supports automated grading of MCQs when `autoGrade` is true.

**Endpoint:**
```
https://api.lms.example.com/v1/submissions/quiz/{submissionId}/grade
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
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <YOUR_AUTH_TOKEN>"
}
```

**Path Parameters:**
- `submissionId`: [string] – UUID of the submission to grade.

**Request Body:**
```json
{
  "type": "object",
  "properties": {
    "autoGrade": {
      "type": "boolean",
      "description": "Flag to auto‑grade MCQs based on correct answers.",
      "example": true
    },
    "scores": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "questionId": { "type": "string" },
          "score": { "type": "number", "description": "Points awarded." },
          "feedback": { "type": "string", "description": "Instructor comments." }
        }
      },
      "description": "Overrides or supplements auto‑grading."
    },
    "overallFeedback": {
      "type": "string",
      "description": "General feedback for the submission.",
      "example": "Great job, pay attention to terminology next time."
    }
  },
  "required": ["scores"]
}
```
**Field Descriptions:**
- `autoGrade`: If true, MCQs are evaluated against the correct options.
- `scores`: Explicit per‑question grading (required).
- `overallFeedback`: Instructor’s holistic comments.

**Responses:**

- **`200 OK`**
  - **Description:** Grading applied successfully.
  - **Response Body:**
    ```json
    {
      "type": "object",
      "properties": {
        "submissionId": {
          "type": "string",
          "example": "s1a2b3c4-d5e6-7f8g-9h0i-1j2k3l4m5n6"
        },
        "status": {
          "type": "string",
          "enum": ["graded"],
          "example": "graded"
        },
        "autoGraded": { "type": "boolean", "example": true },
        "grade": {
          "type": "number",
          "description": "Final total score.",
          "example": 92
        },
        "gradedAt": {
          "type": "string",
          "format": "date-time",
          "example": "2025-05-02T16:00:00Z"
        }
      }
    }
    ```

- **`400 Bad Request`**  
  - **Description:** Invalid grading payload.

- **`401 Unauthorized`**, **`403 Forbidden`**, **`404 Not Found`**, **`500 Internal Server Error`**

**Example (Fetch):**
```javascript
const submissionId = 's1a2b3c4-d5e6-7f8g-9h0i-1j2k3l4m5n6';
const url = `https://api.lms.example.com/v1/submissions/quiz/${submissionId}/grade`;
const body = {
  autoGrade: true,
  scores: [
    { questionId: 'q1a2b3c4', score: 5, feedback: 'Correct.' },
    { questionId: 'q5d6e7f8', score: 4, feedback: 'Minor syntax error.' }
  ],
  overallFeedback: 'Well done overall.'
};
const response = await fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <YOUR_AUTH_TOKEN>'
  },
  body: JSON.stringify(body)
});
const result = await response.json();
console.log('Grading Result:', result);
```

---