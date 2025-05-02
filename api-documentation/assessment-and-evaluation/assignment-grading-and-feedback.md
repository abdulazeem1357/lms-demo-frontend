## Assessment & Evaluation API – Assignment Grading & Feedback

*Generated on: 2025-05-02*

---

### `GET /assignments/{assignmentId}/submissions`

**Summary:**  
Retrieves a list of submissions for a specific assignment, including submission timestamps and download URLs.

**Endpoint:**
```
https://api.lms.example.com/v1/assignments/{assignmentId}/submissions
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
- `assignmentId`: [string] – UUID of the assignment.

**Responses:**

- **`200 OK`**
  - **Description:** List of assignment submissions retrieved successfully.
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
              "fileUrl": {
                "type": "string",
                "description": "Secure URL to download the submitted file.",
                "example": "https://cdn.lms.example.com/uploads/assignment123/student456/file.pdf"
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
    - `submittedAt`: Submission timestamp.
    - `fileUrl`: Download link for the submitted file.

- **`400 Bad Request`**
  - **Description:** Invalid `assignmentId` format.
- **`401 Unauthorized`**
  - **Description:** Missing or invalid authentication token.
- **`403 Forbidden`**
  - **Description:** Insufficient permissions.
- **`404 Not Found`**
  - **Description:** Assignment not found.
- **`500 Internal Server Error`**
  - **Description:** Unexpected server error.

**Example (Fetch):**
```javascript
const assignmentId = 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';
const url = `https://api.lms.example.com/v1/assignments/${assignmentId}/submissions`;
const response = await fetch(url, {
  headers: { 'Authorization': 'Bearer <YOUR_AUTH_TOKEN>' }
});
const { data } = await response.json();
console.log('Submissions:', data);
```

---

### `GET /submissions/assignment/{submissionId}`

**Summary:**  
Retrieves detailed information for a specific assignment submission and provides a download link for the submitted file.

**Endpoint:**
```
https://api.lms.example.com/v1/submissions/assignment/{submissionId}
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
            "submissionId": {
              "type": "string",
              "example": "s1a2b3c4-d5e6-7f8g-9h0i-1j2k3l4m5n6"
            },
            "assignmentId": {
              "type": "string",
              "example": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d"
            },
            "userId": {
              "type": "string",
              "example": "u1a2b3c4-5d6e-7f8g-9h0i-1j2k3l4m5n6"
            },
            "submittedAt": {
              "type": "string",
              "format": "date-time",
              "example": "2025-05-01T15:30:00Z"
            },
            "fileName": {
              "type": "string",
              "description": "Original name of the submitted file.",
              "example": "Essay_React_Hooks.pdf"
            },
            "fileSize": {
              "type": "integer",
              "description": "Size of the file in bytes.",
              "example": 245768
            },
            "contentType": {
              "type": "string",
              "description": "MIME type of the file.",
              "example": "application/pdf"
            },
            "fileUrl": {
              "type": "string",
              "description": "Secure URL to download the submitted file.",
              "example": "https://cdn.lms.example.com/uploads/assignment123/student456/file.pdf"
            }
          }
        }
      }
    }
    ```
    **Field Descriptions:**
    - `fileName`, `fileSize`, `contentType`: Metadata for the submission file.
    - `fileUrl`: Download link.

- **`400 Bad Request`**
- **`401 Unauthorized`**
- **`403 Forbidden`**
- **`404 Not Found`**
- **`500 Internal Server Error`**

**Example (Fetch):**
```javascript
const submissionId = 's1a2b3c4-d5e6-7f8g-9h0i-1j2k3l4m5n6';
const url = `https://api.lms.example.com/v1/submissions/assignment/${submissionId}`;
const response = await fetch(url, {
  headers: { 'Authorization': 'Bearer <YOUR_AUTH_TOKEN>' }
});
const { data } = await response.json();
console.log('Submission Details:', data);
```

---

### `POST /submissions/assignment/{submissionId}/grade`

**Summary:**  
Submits a grade along with textual and/or annotated feedback for an assignment submission.

**Endpoint:**
```
https://api.lms.example.com/v1/submissions/assignment/{submissionId}/grade
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
    "score": {
      "type": "number",
      "description": "Points awarded for the submission.",
      "example": 88
    },
    "feedback": {
      "type": "string",
      "description": "General textual feedback.",
      "example": "Well-structured essay, but provide more examples."
    },
    "annotatedFileUrl": {
      "type": "string",
      "description": "URL to the file with instructor annotations (optional).",
      "example": "https://cdn.lms.example.com/annotations/submission123/annotated.pdf"
    }
  },
  "required": ["score"]
}
```

**Field Descriptions:**
- `score`: Final numeric grade.
- `feedback`: Instructor’s general comments.
- `annotatedFileUrl`: Link to annotated version of the student’s submission.

**Responses:**

- **`200 OK`**
  - **Description:** Grading and feedback submitted successfully.
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
        "score": {
          "type": "number",
          "example": 88
        },
        "feedback": {
          "type": "string",
          "example": "Well-structured essay, but provide more examples."
        },
        "annotatedFileUrl": {
          "type": "string",
          "example": "https://cdn.lms.example.com/annotations/submission123/annotated.pdf"
        },
        "gradedAt": {
          "type": "string",
          "format": "date-time",
          "example": "2025-05-02T16:45:00Z"
        }
      }
    }
    ```

- **`400 Bad Request`**
  - **Description:** Invalid grading payload (e.g., missing `score`).
- **`401 Unauthorized`**
- **`403 Forbidden`**
- **`404 Not Found`**
- **`500 Internal Server Error`**

**Example (Fetch):**
```javascript
const submissionId = 's1a2b3c4-d5e6-7f8g-9h0i-1j2k3l4m5n6';
const url = `https://api.lms.example.com/v1/submissions/assignment/${submissionId}/grade`;
const body = {
  score: 88,
  feedback: 'Well-structured essay, but provide more examples.',
  annotatedFileUrl: 'https://cdn.lms.example.com/annotations/submission123/annotated.pdf'
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
console.log('Grading Response:', result);
```

---