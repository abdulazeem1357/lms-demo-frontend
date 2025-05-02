## Course Management API – Live Lecture Scheduling

*Generated on: 2025-05-02*

---

### `GET /courses/{courseId}/live-lectures`

**Summary:**  
Retrieves a list of scheduled live lectures for a specific course (distinct from pre-recorded content).

**Endpoint:**
```
https://api.lms.example.com/v1/courses/{courseId}/live-lectures
```

**Method:**
```
GET
```

**Authentication:**
- Required: Yes  
- Type: Bearer Token (JWT)

**Permissions:**
- Instructor of the course, Admin, or enrolled Student

**Headers:**
```json
{
  "Authorization": "Bearer <YOUR_AUTH_TOKEN>"
}
```

**Path Parameters:**
- `courseId`: [string] – UUID of the course.

**Responses:**

- **`200 OK`**
  - **Description:** Successfully retrieved live lecture schedules.
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
                "description": "UUID of the live lecture.",
                "example": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d"
              },
              "topic": {
                "type": "string",
                "description": "Topic or title of the live lecture.",
                "example": "Introduction to React Hooks"
              },
              "meetingUrl": {
                "type": "string",
                "description": "URL to join the live session.",
                "example": "https://meet.example.com/session/abc123"
              },
              "startTime": {
                "type": "string",
                "format": "date-time",
                "description": "Scheduled start time in ISO 8601.",
                "example": "2025-05-10T14:00:00Z"
              },
              "endTime": {
                "type": "string",
                "format": "date-time",
                "description": "Scheduled end time in ISO 8601.",
                "example": "2025-05-10T15:00:00Z"
              }
            }
          }
        }
      }
    }
    ```
    **Field Descriptions:**
    - `id`: Unique identifier for the live lecture session.
    - `topic`: Brief title or agenda of the lecture.
    - `meetingUrl`: Secure link to join the live session.
    - `startTime` / `endTime`: Scheduled times for the session.

- **`400 Bad Request`**
  - **Description:** Invalid `courseId` format.
- **`401 Unauthorized`**
  - **Description:** Missing or invalid authentication token.
- **`403 Forbidden`**
  - **Description:** Insufficient permissions.
- **`404 Not Found`**
  - **Description:** Course not found.
- **`500 Internal Server Error`**
  - **Description:** Unexpected server error.

**Examples:**

```javascript
const courseId = 'f1e2d3c4-b5a6-7f8e-9d0c-1b2a3c4d5e6f';
const url = `https://api.lms.example.com/v1/courses/${courseId}/live-lectures`;
const response = await fetch(url, {
  headers: { 'Authorization': 'Bearer <YOUR_AUTH_TOKEN>' }
});
const { data } = await response.json();
console.log('Live lectures:', data);
```

---

### `POST /courses/{courseId}/live-lectures`

**Summary:**  
Schedules a new live lecture for a specific course.

**Endpoint:**
```
https://api.lms.example.com/v1/courses/{courseId}/live-lectures
```

**Method:**
```
POST
```

**Authentication:**
- Required: Yes  
- Type: Bearer Token (JWT)

**Permissions:**
- Instructor of the course or Admin

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <YOUR_AUTH_TOKEN>"
}
```

**Path Parameters:**
- `courseId`: [string] – UUID of the course.

**Request Body:**
```json
{
  "type": "object",
  "properties": {
    "topic": {
      "type": "string",
      "description": "Topic or title of the live lecture.",
      "example": "Advanced State Management"
    },
    "meetingUrl": {
      "type": "string",
      "description": "URL to join the live session.",
      "example": "https://meet.example.com/session/xyz789"
    },
    "startTime": {
      "type": "string",
      "format": "date-time",
      "description": "Scheduled start time in ISO 8601.",
      "example": "2025-05-15T10:00:00Z"
    },
    "endTime": {
      "type": "string",
      "format": "date-time",
      "description": "Scheduled end time in ISO 8601.",
      "example": "2025-05-15T11:00:00Z"
    }
  },
  "required": ["topic", "meetingUrl", "startTime", "endTime"]
}
```

**Field Descriptions:**
- `topic`: Title or agenda for the live session.
- `meetingUrl`: Secure link for participants to join.
- `startTime` / `endTime`: ISO 8601 timestamps for session window.

**Responses:**

- **`201 Created`**
  - **Description:** Live lecture successfully scheduled.
  - **Response Body:**
    ```json
    {
      "type": "object",
      "properties": {
        "data": {
          "type": "object",
          "properties": {
            "id": { "type": "string", "description": "UUID of the new live lecture.", "example": "c7d8e9f0-1234-5678-9abc-def012345678" },
            "topic": { "type": "string", "example": "Advanced State Management" },
            "meetingUrl": { "type": "string", "example": "https://meet.example.com/session/xyz789" },
            "startTime": { "type": "string", "format": "date-time", "example": "2025-05-15T10:00:00Z" },
            "endTime": { "type": "string", "format": "date-time", "example": "2025-05-15T11:00:00Z" }
          }
        }
      }
    }
    ```

- **`400 Bad Request`**
  - **Description:** Validation error or missing required fields.
- **`401 Unauthorized`**
  - **Description:** Missing or invalid authentication token.
- **`403 Forbidden`**
  - **Description:** Insufficient permissions.
- **`404 Not Found`**
  - **Description:** Course not found.
- **`500 Internal Server Error`**
  - **Description:** Unexpected server error.

**Examples:**

```javascript
const courseId = 'f1e2d3c4-b5a6-7f8e-9d0c-1b2a3c4d5e6f';
const url = `https://api.lms.example.com/v1/courses/${courseId}/live-lectures`;
const options = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer <YOUR_AUTH_TOKEN>' },
  body: JSON.stringify({ topic: 'Advanced State Management', meetingUrl: 'https://meet.example.com/session/xyz789', startTime: '2025-05-15T10:00:00Z', endTime: '2025-05-15T11:00:00Z' })
};
const response = await fetch(url, options);
const { data } = await response.json();
console.log('Scheduled live lecture:', data);
```

---

### `PUT /courses/{courseId}/live-lectures/{liveLectureId}`

**Summary:**  
Updates the schedule or details of an existing live lecture.

**Endpoint:**
```
https://api.lms.example.com/v1/courses/{courseId}/live-lectures/{liveLectureId}
```

**Method:**
```
PUT
```

**Authentication:**
- Required: Yes  
- Type: Bearer Token (JWT)

**Permissions:**
- Instructor of the course or Admin

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <YOUR_AUTH_TOKEN>"
}
```

**Path Parameters:**
- `courseId`: [string] – UUID of the course.
- `liveLectureId`: [string] – UUID of the live lecture to update.

**Request Body:**
```json
{
  "type": "object",
  "properties": {
    "topic": { "type": "string", "example": "Updated Lecture Topic" },
    "meetingUrl": { "type": "string", "example": "https://meet.example.com/session/updated123" },
    "startTime": { "type": "string", "format": "date-time", "example": "2025-05-15T10:30:00Z" },
    "endTime": { "type": "string", "format": "date-time", "example": "2025-05-15T11:30:00Z" }
  }
}
```

**Responses:**

- **`200 OK`**
  - **Description:** Live lecture schedule updated successfully.
  - **Response Body:** Same schema as `GET` item.

- **`400 Bad Request`**, **`401 Unauthorized`**, **`403 Forbidden`**, **`404 Not Found`**, **`500 Internal Server Error`**

**Examples:**

```javascript
const courseId = 'f1e2d3c4-b5a6-7f8e-9d0c-1b2a3c4d5e6f';
const liveLectureId = 'c7d8e9f0-1234-5678-9abc-def012345678';
await fetch(`https://api.lms.example.com/v1/courses/${courseId}/live-lectures/${liveLectureId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer <YOUR_AUTH_TOKEN>' },
  body: JSON.stringify({ startTime: '2025-05-15T10:30:00Z', endTime: '2025-05-15T11:30:00Z' })
});
console.log('Live lecture updated');
```

---

### `DELETE /courses/{courseId}/live-lectures/{liveLectureId}`

**Summary:**  
Deletes a scheduled live lecture from a course.

**Endpoint:**
```
https://api.lms.example.com/v1/courses/{courseId}/live-lectures/{liveLectureId}
```

**Method:**
```
DELETE
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
- `courseId`: [string] – UUID of the course.
- `liveLectureId`: [string] – UUID of the live lecture to remove.

**Responses:**

- **`204 No Content`**
  - **Description:** Live lecture successfully deleted; no content returned.

- **`400 Bad Request`**, **`401 Unauthorized`**, **`403 Forbidden`**, **`404 Not Found`**, **`500 Internal Server Error`**

**Examples:**

```javascript
const courseId = 'f1e2d3c4-b5a6-7f8e-9d0c-1b2a3c4d5e6f';
const liveLectureId = 'c7d8e9f0-1234-5678-9abc-def012345678';
await fetch(`https://api.lms.example.com/v1/courses/${courseId}/live-lectures/${liveLectureId}`, {
  method: 'DELETE',
  headers: { 'Authorization': 'Bearer <YOUR_AUTH_TOKEN>' }
});
console.log('Live lecture deleted');
```

---