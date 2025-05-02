## Notification API – Sending & Scheduling Notifications

*Generated on: 2025-05-02*

---

### `POST /notifications`

**Summary:**  
Sends a notification immediately or schedules it for later delivery.

**Endpoint:**
```
https://api.lms.example.com/v1/notifications
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
  "Authorization": "Bearer <YOUR_AUTH_TOKEN>"
}
```

**Request Body:**
```json
{
  "type": "object",
  "properties": {
    "audience": {
      "type": "object",
      "description": "Target audience for the notification.",
      "properties": {
        "all": { "type": "boolean", "description": "Send to all users when true.", "example": false },
        "courseId": { "type": "string", "description": "UUID of a course to target.", "example": "f1e2d3c4-b5a6-7f8e-9d0c-1b2a3c4d5e6f" },
        "userIds": { "type": "array", "items": { "type": "string" }, "description": "List of user UUIDs to target.", "example": ["u1a2b3c4-5d6e-7f8g-9h0i-1j2k3l4m5n6"] }
      },
      "oneOf": [
        { "required": ["all"] },
        { "required": ["courseId"] },
        { "required": ["userIds"] }
      ]
    },
    "message": {
      "type": "string",
      "description": "Notification content. Supports placeholders like {{user_name}}.",
      "example": "Hello {{user_name}}, your assignment is due tomorrow."
    },
    "channels": {
      "type": "array",
      "description": "Delivery channels.",
      "items": { "type": "string", "enum": ["email", "in-app"] },
      "example": ["email","in-app"]
    },
    "scheduleTime": {
      "type": "string",
      "format": "date-time",
      "description": "Optional ISO 8601 timestamp to schedule delivery. Omit to send immediately.",
      "example": "2025-05-10T09:00:00Z"
    }
  },
  "required": ["audience","message","channels"]
}
```

**Field Descriptions:**
- `audience`: Defines who receives the notification. Exactly one of:
  - `all`: send to every user.
  - `courseId`: send to all students in a course.
  - `userIds`: send to specific users.
- `message`: The content of the notification; supports personalization.
- `channels`: Array of delivery methods (`email`, `in-app`).
- `scheduleTime`: When to deliver; if absent, delivery is immediate.

**Responses:**

- **`202 Accepted`**  
  - **Description:** Notification dispatch or scheduling accepted.  
  - **Response Body:**
    ```json
    {
      "type": "object",
      "properties": {
        "notificationId": {
          "type": "string",
          "description": "UUID of the notification request.",
          "example": "n1a2b3c4-d5e6-7f8g-9h0i-1j2k3l4m5n6o"
        },
        "status": {
          "type": "string",
          "description": "Notification status: 'sent' or 'scheduled'.",
          "example": "scheduled"
        },
        "scheduledTime": {
          "type": "string",
          "format": "date-time",
          "description": "Delivery time if status is 'scheduled'.",
          "example": "2025-05-10T09:00:00Z"
        }
      }
    }
    ```

- **`400 Bad Request`**  
  - **Description:** Invalid or missing body fields.

- **`401 Unauthorized`**  
  - **Description:** Missing or invalid authentication token.

- **`403 Forbidden`**  
  - **Description:** Insufficient permissions.

- **`500 Internal Server Error`**  
  - **Description:** An unexpected error occurred.

**Example (Fetch):**
```javascript
const payload = {
  audience: { courseId: 'f1e2d3c4-b5a6-7f8e-9d0c-1b2a3c4d5e6f' },
  message: 'Hi {{user_name}}, new content is available.',
  channels: ['in-app','email'],
  scheduleTime: '2025-05-15T08:00:00Z'
};
const response = await fetch('https://api.lms.example.com/v1/notifications', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <YOUR_AUTH_TOKEN>'
  },
  body: JSON.stringify(payload)
});
const data = await response.json();
console.log(data.notificationId, data.status);
```

---

### `GET /notifications/scheduled`

**Summary:**  
Lists all notifications that are scheduled for future delivery.

**Endpoint:**
```
https://api.lms.example.com/v1/notifications/scheduled
```

**Method:**
```
GET
```

**Authentication:**
- Required: Yes  
- Type: Bearer Token (JWT)

**Headers:**
```json
{
  "Authorization": "Bearer <YOUR_AUTH_TOKEN>"
}
```

**Responses:**

- **`200 OK`**  
  - **Description:** Array of scheduled notifications.  
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
              "notificationId": {
                "type": "string",
                "description": "UUID of the scheduled notification.",
                "example": "n1a2b3c4-d5e6-7f8g-9h0i-1j2k3l4m5n6o"
              },
              "audience": {
                "type": "object",
                "description": "Target audience specification."
              },
              "message": {
                "type": "string",
                "description": "Notification content with placeholders."
              },
              "channels": {
                "type": "array",
                "items": { "type": "string" },
                "description": "Delivery channels."
              },
              "scheduledTime": {
                "type": "string",
                "format": "date-time",
                "description": "When the notification will be delivered.",
                "example": "2025-05-15T08:00:00Z"
              },
              "createdAt": {
                "type": "string",
                "format": "date-time",
                "description": "Timestamp when the notification was scheduled.",
                "example": "2025-05-02T14:00:00Z"
              }
            }
          }
        }
      }
    }
    ```

- **`401 Unauthorized`**  
  - **Description:** Missing or invalid authentication token.

- **`403 Forbidden`**  
  - **Description:** Insufficient permissions.

- **`500 Internal Server Error`**  
  - **Description:** An unexpected error occurred.

**Example (Fetch):**
```javascript
const response = await fetch('https://api.lms.example.com/v1/notifications/scheduled', {
  headers: { 'Authorization': 'Bearer <YOUR_AUTH_TOKEN>' }
});
const { data } = await response.json();
console.log('Scheduled notifications:', data);
```

---

### `DELETE /notifications/scheduled/{notificationId}`

**Summary:**  
Cancels a previously scheduled notification before it is dispatched.

**Endpoint:**
```
https://api.lms.example.com/v1/notifications/scheduled/{notificationId}
```

**Method:**
```
DELETE
```

**Authentication:**
- Required: Yes  
- Type: Bearer Token (JWT)

**Headers:**
```json
{
  "Authorization": "Bearer <YOUR_AUTH_TOKEN>"
}
```

**Path Parameters:**
- `notificationId`: [string] – UUID of the notification to cancel.

**Responses:**

- **`204 No Content`**  
  - **Description:** Scheduled notification cancelled successfully; no content returned.

- **`400 Bad Request`**  
  - **Description:** Invalid `notificationId` format.

- **`401 Unauthorized`**  
  - **Description:** Missing or invalid authentication token.

- **`403 Forbidden`**  
  - **Description:** Insufficient permissions.

- **`404 Not Found`**  
  - **Description:** Scheduled notification not found.

- **`500 Internal Server Error`**  
  - **Description:** An unexpected error occurred.

**Example (Fetch):**
```javascript
const notificationId = 'n1a2b3c4-d5e6-7f8g-9h0i-1j2k3l4m5n6o';
await fetch(
  `https://api.lms.example.com/v1/notifications/scheduled/${notificationId}`,
  {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer <YOUR_AUTH_TOKEN>' }
  }
);
console.log('Scheduled notification cancelled');
```

---