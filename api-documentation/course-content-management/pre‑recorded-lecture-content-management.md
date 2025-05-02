## Course Content Management API – Pre‑recorded Lecture Content Management

*Generated on: 2025-05-02*

---

### `GET /modules/{moduleId}/lectures`

**Summary:**  
Retrieves the list of pre‑recorded lectures for a specific module.

**Endpoint:**
```
https://api.lms.example.com/v1/modules/{moduleId}/lectures
```

**Method:**
```
GET
```

**Authentication:**
- Required: Yes  
- Type: Bearer Token (JWT)

**Permissions:**
- Student (enrolled in the course), Instructor of the course, or Admin

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
  - **Description:** List of lecture records.  
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
                "description": "UUID of the lecture.",
                "example": "e3f1a2b4-c5d6-7e8f-9a0b-1c2d3e4f5g6h"
              },
              "moduleId": {
                "type": "string",
                "description": "UUID of the parent module.",
                "example": "m1a2b3c4-d5e6-7f8g-9h0i-1j2k3l4m5n6o"
              },
              "bunnyVideoId": {
                "type": "string",
                "description": "Identifier of the video in Bunny.net.",
                "example": "vid_12345"
              },
              "title": {
                "type": "string",
                "description": "Lecture title.",
                "example": "Introduction to React"
              },
              "description": {
                "type": "string",
                "description": "Lecture description or summary.",
                "example": "Overview of React hooks and components."
              },
              "duration": {
                "type": "integer",
                "description": "Duration of the lecture in seconds.",
                "example": 3600
              },
              "createdAt": {
                "type": "string",
                "format": "date-time",
                "description": "Timestamp when the lecture record was created.",
                "example": "2025-05-02T12:00:00Z"
              }
            }
          }
        }
      }
    }
    ```
    **Field Descriptions:**
    - `data`: Array of lecture objects.
    - `id`: Unique lecture identifier.
    - `moduleId`: Parent module identifier.
    - `bunnyVideoId`: References a video stored via the Video Streaming API.
    - `title`, `description`, `duration`: Lecture metadata.
    - `createdAt`: Record creation time.

- **`400 Bad Request`**, **`401 Unauthorized`**, **`403 Forbidden`**, **`404 Not Found`**, **`500 Internal Server Error`**  
  *(As defined in the standard error responses.)*

**Example (Fetch):**
```javascript
const moduleId = 'm1a2b3c4-d5e6-7f8g-9h0i-1j2k3l4m5n6o';
const url = `https://api.lms.example.com/v1/modules/${moduleId}/lectures`;
const response = await fetch(url, {
  headers: { 'Authorization': 'Bearer <YOUR_AUTH_TOKEN>' }
});
const { data } = await response.json();
console.log('Lectures:', data);
```

---

### `POST /modules/{moduleId}/lectures`

**Summary:**  
Creates a new pre‑recorded lecture record for a module and associates it with a Bunny.net video.

**Endpoint:**
```
https://api.lms.example.com/v1/modules/{moduleId}/lectures
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
- `moduleId`: [string] – UUID of the module.

**Request Body:**
```json
{
  "type": "object",
  "properties": {
    "bunnyVideoId": {
      "type": "string",
      "description": "Identifier of the video in Bunny.net.",
      "example": "vid_12345"
    },
    "title": {
      "type": "string",
      "description": "Lecture title.",
      "example": "Introduction to React"
    },
    "description": {
      "type": "string",
      "description": "Lecture description or summary.",
      "example": "Overview of React hooks and components."
    },
    "duration": {
      "type": "integer",
      "description": "Duration of the lecture in seconds.",
      "example": 3600
    }
  },
  "required": ["bunnyVideoId", "title", "duration"]
}
```
**Field Descriptions:**
- `bunnyVideoId`: Must reference a valid video uploaded via the Video Streaming API.
- `title`, `duration`: Required metadata.
- `description`: Optional summary.

**Responses:**

- **`201 Created`**  
  - **Description:** Lecture record successfully created.  
  - **Response Body:**
    ```json
    {
      "type": "object",
      "properties": {
        "data": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "description": "UUID of the new lecture.",
              "example": "e3f1a2b4-c5d6-7e8f-9a0b-1c2d3e4f5g6h"
            },
            "moduleId": {
              "type": "string",
              "example": "m1a2b3c4-d5e6-7f8g-9h0i-1j2k3l4m5n6o"
            },
            "bunnyVideoId": {
              "type": "string",
              "example": "vid_12345"
            },
            "title": {
              "type": "string",
              "example": "Introduction to React"
            },
            "description": {
              "type": "string",
              "example": "Overview of React hooks and components."
            },
            "duration": {
              "type": "integer",
              "example": 3600
            },
            "createdAt": {
              "type": "string",
              "format": "date-time",
              "example": "2025-05-02T12:00:00Z"
            }
          }
        }
      }
    }
    ```

- **`400 Bad Request`**, **`401 Unauthorized`**, **`403 Forbidden`**, **`404 Not Found`**, **`500 Internal Server Error`**

**Example (Fetch):**
```javascript
const moduleId = 'm1a2b3c4-d5e6-7f8g-9h0i-1j2k3l4m5n6o';
const url = `https://api.lms.example.com/v1/modules/${moduleId}/lectures`;
const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <YOUR_AUTH_TOKEN>'
  },
  body: JSON.stringify({
    bunnyVideoId: 'vid_12345',
    title: 'Introduction to React',
    description: 'Overview of React hooks and components.',
    duration: 3600
  })
};
const response = await fetch(url, options);
const { data } = await response.json();
console.log('Created lecture:', data);
```

---

### `GET /lectures/{lectureId}`

**Summary:**  
Retrieves details of a single pre‑recorded lecture.

**Endpoint:**
```
https://api.lms.example.com/v1/lectures/{lectureId}
```

**Method:**
```
GET
```

**Authentication:**
- Required: Yes  
- Type: Bearer Token (JWT)

**Permissions:**
- Student (enrolled in the parent course), Instructor of the course, or Admin

**Headers:**
```json
{
  "Authorization": "Bearer <YOUR_AUTH_TOKEN>"
}
```

**Path Parameters:**
- `lectureId`: [string] – UUID of the lecture.

**Responses:**

- **`200 OK`**  
  - **Description:** Lecture details.  
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
            "bunnyVideoId": { "type": "string" },
            "title": { "type": "string" },
            "description": { "type": "string" },
            "duration": { "type": "integer" },
            "createdAt": { "type": "string", "format": "date-time" }
          }
        }
      }
    }
    ```

- **`400 Bad Request`**, **`401 Unauthorized`**, **`403 Forbidden`**, **`404 Not Found`**, **`500 Internal Server Error`**

**Example (Fetch):**
```javascript
const lectureId = 'e3f1a2b4-c5d6-7e8f-9a0b-1c2d3e4f5g6h';
const url = `https://api.lms.example.com/v1/lectures/${lectureId}`;
const response = await fetch(url, {
  headers: { 'Authorization': 'Bearer <YOUR_AUTH_TOKEN>' }
});
const { data } = await response.json();
console.log('Lecture details:', data);
```

---

### `PUT /lectures/{lectureId}`

**Summary:**  
Updates metadata for an existing pre‑recorded lecture.

**Endpoint:**
```
https://api.lms.example.com/v1/lectures/{lectureId}
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
- `lectureId`: [string] – UUID of the lecture.

**Request Body:**
```json
{
  "type": "object",
  "properties": {
    "title": {
      "type": "string",
      "description": "Updated lecture title.",
      "example": "Advanced React Patterns"
    },
    "description": {
      "type": "string",
      "description": "Updated lecture description.",
      "example": "In-depth exploration of hooks and context."
    },
    "duration": {
      "type": "integer",
      "description": "Updated duration in seconds.",
      "example": 4200
    }
  }
}
```

**Responses:**

- **`200 OK`**  
  - **Description:** Lecture metadata updated successfully.  
  - **Response Body:** Same schema as `GET /lectures/{lectureId}`

- **`400 Bad Request`**, **`401 Unauthorized`**, **`403 Forbidden`**, **`404 Not Found`**, **`500 Internal Server Error`**

**Example (Fetch):**
```javascript
const lectureId = 'e3f1a2b4-c5d6-7e8f-9a0b-1c2d3e4f5g6h';
const url = `https://api.lms.example.com/v1/lectures/${lectureId}`;
const options = {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <YOUR_AUTH_TOKEN>'
  },
  body: JSON.stringify({ title: 'Advanced React Patterns', duration: 4200 })
};
const response = await fetch(url, options);
const { data } = await response.json();
console.log('Updated lecture:', data);
```

---

### `DELETE /lectures/{lectureId}`

**Summary:**  
Deletes a pre‑recorded lecture record.

**Endpoint:**
```
https://api.lms.example.com/v1/lectures/{lectureId}
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
- `lectureId`: [string] – UUID of the lecture.

**Responses:**

- **`204 No Content`**  
  - **Description:** Lecture successfully deleted; no content returned.

- **`400 Bad Request`**, **`401 Unauthorized`**, **`403 Forbidden`**, **`404 Not Found`**, **`500 Internal Server Error`**

**Example (Fetch):**
```javascript
const lectureId = 'e3f1a2b4-c5d6-7e8f-9a0b-1c2d3e4f5g6h';
await fetch(`https://api.lms.example.com/v1/lectures/${lectureId}`, {
  method: 'DELETE',
  headers: { 'Authorization': 'Bearer <YOUR_AUTH_TOKEN>' }
});
console.log('Lecture deleted');
```

---

**Relationship with Video Streaming API:**  
Lecture records reference a `bunnyVideoId`, which corresponds to a video asset managed by the Video Streaming API (see Section 4.5). Use the Video Streaming API to upload video files and obtain playback URLs; store the returned video ID in `bunnyVideoId` when creating or updating a lecture record.

---