## Report Generation & Export API

*Generated on: 2025-05-02*

---

### `POST /reports`

**Summary:**  
Requests generation of a report of a specified type with given parameters and export format.

**Endpoint:**  
```
https://api.lms.example.com/v1/reports
```

**Method:**  
```
POST
```

**Authentication:**  
- Required: Yes  
- Type: Bearer Token (JWT)

**Permissions:**  
- Admin or Instructor

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
    "reportType": {
      "type": "string",
      "description": "Type of report to generate.",
      "enum": ["student_grades", "course_completion"],
      "example": "course_completion"
    },
    "parameters": {
      "type": "object",
      "description": "Parameters specific to the chosen report type.",
      "properties": {
        "courseId": {
          "type": "string",
          "description": "UUID of the course for course_completion reports.",
          "example": "f1e2d3c4-b5a6-7f8e-9d0c-1b2a3c4d5e6f"
        },
        "userId": {
          "type": "string",
          "description": "UUID of the student for student_grades reports.",
          "example": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d"
        },
        "startDate": {
          "type": "string",
          "description": "ISO 8601 start date for the reporting window.",
          "example": "2025-04-01T00:00:00Z"
        },
        "endDate": {
          "type": "string",
          "description": "ISO 8601 end date for the reporting window.",
          "example": "2025-04-30T23:59:59Z"
        }
      },
      "required": ["startDate", "endDate"]
    },
    "exportFormat": {
      "type": "string",
      "description": "Desired format of the generated report.",
      "enum": ["csv", "pdf"],
      "example": "pdf"
    }
  },
  "required": ["reportType", "parameters", "exportFormat"]
}
```

**Field Descriptions:**
- `reportType`: One of the supported report types (`student_grades`, `course_completion`).
- `parameters`:  
  - `courseId`: Required for `course_completion`.  
  - `userId`: Required for `student_grades`.  
  - `startDate` & `endDate`: Define the time window.
- `exportFormat`: Format of the output file (`csv` or `pdf`).

**Responses:**

- **`202 Accepted`**  
  - **Description:** Report generation request accepted; processing started.  
  - **Response Body:**
    ```json
    {
      "type": "object",
      "properties": {
        "reportId": {
          "type": "string",
          "description": "Unique identifier for the report request.",
          "example": "r1e2p3o4-r5e6-p7o8-r9t0"
        },
        "status": {
          "type": "string",
          "description": "Initial status of the report generation.",
          "example": "pending"
        }
      }
    }
    ```
- **`400 Bad Request`**, **`401 Unauthorized`**, **`403 Forbidden`**, **`500 Internal Server Error`**

**Example (Fetch):**
```javascript
const resp = await fetch('https://api.lms.example.com/v1/reports', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <YOUR_AUTH_TOKEN>'
  },
  body: JSON.stringify({
    reportType: 'course_completion',
    parameters: {
      courseId: 'f1e2d3c4-b5a6-7f8e-9d0c-1b2a3c4d5e6f',
      startDate: '2025-04-01T00:00:00Z',
      endDate: '2025-04-30T23:59:59Z'
    },
    exportFormat: 'csv'
  })
});
const data = await resp.json();
console.log('Requested Report:', data);
```

---

### `GET /reports/{reportId}/status`

**Summary:**  
Retrieves the current generation status and progress of a previously requested report.

**Endpoint:**  
```
https://api.lms.example.com/v1/reports/{reportId}/status
```

**Method:**  
```
GET
```

**Authentication:**  
- Required: Yes  
- Type: Bearer Token (JWT)

**Permissions:**  
- Admin or Instructor

**Path Parameters:**
- `reportId`: [string] – UUID of the report request.

**Headers:**  
```json
{
  "Authorization": "Bearer <YOUR_AUTH_TOKEN>"
}
```

**Responses:**

- **`200 OK`**  
  **Description:** Returns current status and progress.  
  **Response Body:**
  ```json
  {
    "type": "object",
    "properties": {
      "reportId": {
        "type": "string",
        "example": "r1e2p3o4-r5e6-p7o8-r9t0"
      },
      "status": {
        "type": "string",
        "enum": ["pending", "in_progress", "completed", "failed"],
        "description": "Current generation status.",
        "example": "in_progress"
      },
      "progress": {
        "type": "integer",
        "description": "Percentage complete (0–100).",
        "example": 45
      },
      "errorMessage": {
        "type": "string",
        "description": "Error details if status is `failed`.",
        "example": "Data source unavailable."
      }
    }
  }
  ```
- **`400 Bad Request`**, **`401 Unauthorized`**, **`403 Forbidden`**, **`404 Not Found`**, **`500 Internal Server Error`**

**Example (Fetch):**
```javascript
const resp = await fetch(
  'https://api.lms.example.com/v1/reports/' + reportId + '/status',
  { headers: { 'Authorization': 'Bearer <YOUR_AUTH_TOKEN>' } }
);
const statusInfo = await resp.json();
console.log('Report Status:', statusInfo);
```

---

### `GET /reports/{reportId}/download`

**Summary:**  
Downloads the completed report in the requested format.

**Endpoint:**  
```
https://api.lms.example.com/v1/reports/{reportId}/download
```

**Method:**  
```
GET
```

**Authentication:**  
- Required: Yes  
- Type: Bearer Token (JWT)

**Permissions:**  
- Admin or Instructor

**Path Parameters:**
- `reportId`: [string] – UUID of the report request.

**Query Parameters (optional):**
- `format`: [string] – `csv` or `pdf` (overrides `Accept` header).

**Headers:**  
```http
Accept: application/pdf     # or text/csv
Authorization: Bearer <YOUR_AUTH_TOKEN>
```

**Responses:**

- **`200 OK`**  
  **Description:** Returns the report file in the requested format.  
  - **Headers:**
    - `Content-Type`: `application/pdf` or `text/csv`
    - `Content-Disposition`: `attachment; filename="report_<reportId>.<ext>"`
  - **Body:** Binary stream of the file.

- **`400 Bad Request`**, **`401 Unauthorized`**, **`403 Forbidden`**, **`404 Not Found`**, **`500 Internal Server Error`**

**Example (Fetch):**
```javascript
const resp = await fetch(
  `https://api.lms.example.com/v1/reports/${reportId}/download?format=pdf`,
  {
    headers: {
      'Authorization': 'Bearer <YOUR_AUTH_TOKEN>',
      'Accept': 'application/pdf'
    }
  }
);
if (resp.ok) {
  const blob = await resp.blob();
  const url = URL.createObjectURL(blob);
  window.open(url);
}
```

---