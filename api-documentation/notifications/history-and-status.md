## Notification API – History & Status

*Generated on: 2025-05-02*

---

### `GET /notifications/history`

**Summary:**  
Retrieves a paginated list of sent notifications with optional filtering by channel, status, or time range.

**Endpoint:**
```
https://api.lms.example.com/v1/notifications/history
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

**Query Parameters:**
- `page`: [integer] – Page number (default: 1).  
- `limit`: [integer] – Items per page (default: 20).  
- `channel`: [string] – Filter by delivery channel (`email`, `in-app`).  
- `status`: [string] – Filter by delivery status (`sent`, `scheduled`, `delivered`, `failed`).  
- `startDate`: [string] – ISO 8601 start of sent-time window.  
- `endDate`: [string] – ISO 8601 end of sent-time window.

**Responses:**

- **`200 OK`**  
  - **Description:** A paginated list of notifications with status details.  
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
                "description": "UUID of the notification.",
                "example": "n1a2b3c4-d5e6-7f8g-9h0i-1j2k3l4m5n6o"
              },
              "message": {
                "type": "string",
                "example": "Hello user, your assignment is due tomorrow."
              },
              "channels": {
                "type": "array",
                "items": { "type": "string", "enum": ["email","in-app"] },
                "example": ["email"]
              },
              "status": {
                "type": "string",
                "description": "Overall delivery status.",
                "example": "delivered"
              },
              "sentAt": {
                "type": "string",
                "format": "date-time",
                "description": "Timestamp when notification was sent.",
                "example": "2025-05-01T12:00:00Z"
              }
            }
          }
        },
        "meta": {
          "type": "object",
          "properties": {
            "page": { "type": "integer", "example": 1 },
            "limit": { "type": "integer", "example": 20 },
            "totalItems": { "type": "integer", "example": 125 },
            "totalPages": { "type": "integer", "example": 7 }
          }
        }
      }
    }
    ```
    **Field Descriptions:**
    - `notificationId`: Unique identifier for the notification.  
    - `message`: The content sent.  
    - `channels`: Delivery channels used.  
    - `status`: Aggregated status across channels.  
    - `sentAt`: When the notification was dispatched.  

- **`400 Bad Request`**  
  - **Description:** Invalid query parameters.  
- **`401 Unauthorized`**  
  - **Description:** Missing or invalid authentication token.  
- **`403 Forbidden`**  
  - **Description:** Insufficient permissions.  
- **`500 Internal Server Error`**  
  - **Description:** Unexpected server error.

**Examples:**

```javascript
const url = new URL('https://api.lms.example.com/v1/notifications/history');
url.searchParams.set('page', '2');
url.searchParams.set('limit', '10');
url.searchParams.set('status', 'delivered');
url.searchParams.set('startDate', '2025-04-01T00:00:00Z');
const response = await fetch(url.toString(), {
  headers: { 'Authorization': 'Bearer <YOUR_AUTH_TOKEN>' }
});
const { data, meta } = await response.json();
console.log('Notifications:', data, 'Pagination:', meta);
```

---

### `GET /notifications/{notificationId}`

**Summary:**  
Retrieves detailed information and delivery status for a specific notification.

**Endpoint:**
```
https://api.lms.example.com/v1/notifications/{notificationId}
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

**Path Parameters:**
- `notificationId`: [string] – UUID of the notification.

**Responses:**

- **`200 OK`**  
  - **Description:** Detailed notification record with per-channel status.  
  - **Response Body:**
    ```json
    {
      "type": "object",
      "properties": {
        "notificationId": {
          "type": "string",
          "example": "n1a2b3c4-d5e6-7f8g-9h0i-1j2k3l4m5n6o"
        },
        "audience": {
          "type": "object",
          "description": "Original target audience specification."
        },
        "message": {
          "type": "string",
          "example": "Hello user, your assignment is due tomorrow."
        },
        "channels": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "type": { "type": "string", "example": "email" },
              "status": { "type": "string", "example": "delivered" },
              "sentAt": {
                "type": "string",
                "format": "date-time",
                "example": "2025-05-01T12:00:00Z"
              },
              "deliveredAt": {
                "type": "string",
                "format": "date-time",
                "example": "2025-05-01T12:00:05Z"
              },
              "error": {
                "type": "object",
                "description": "Error details for failed deliveries (if any).",
                "properties": {
                  "code": { "type": "string", "example": "SMTP_ERROR" },
                  "message": { "type": "string", "example": "Mailbox not found." }
                }
              }
            }
          }
        }
      }
    }
    ```
    **Field Descriptions:**
    - `audience`: Original targeting rules (all, courseId, or userIds).  
    - `channels`: Array of per-channel delivery records.  
    - `status`: Delivery outcome per channel.  
    - `error`: Populated when a channel delivery fails.  

- **`400 Bad Request`**  
  - **Description:** Invalid `notificationId` format.  
- **`401 Unauthorized`**  
  - **Description:** Missing or invalid authentication token.  
- **`403 Forbidden`**  
  - **Description:** Insufficient permissions.  
- **`404 Not Found`**  
  - **Description:** Notification not found.  
- **`500 Internal Server Error`**  
  - **Description:** Unexpected server error.

**Examples:**

```javascript
const notificationId = 'n1a2b3c4-d5e6-7f8g-9h0i-1j2k3l4m5n6o';
const response = await fetch(
  `https://api.lms.example.com/v1/notifications/${notificationId}`,
  { headers: { 'Authorization': 'Bearer <YOUR_AUTH_TOKEN>' } }
);
const details = await response.json();
console.log('Notification Details:', details);
```

---