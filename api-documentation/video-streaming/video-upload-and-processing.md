## Video Streaming API – Video Upload & Processing

*Generated on: 2025-05-02*

---

**Workflow:**  
1. Client requests an upload address by calling `POST /videos/upload`.  
2. LMS backend interacts with Bunny.net’s Storage & Stream API to generate a signed upload URL and registers a new video record.  
3. Client uploads the video file directly to Bunny.net using the returned `uploadUrl`.  
4. Bunny.net processes/transcodes the video.  
5. Client or backend polls `GET /videos/{videoId}/status` (or receives a webhook notification) to obtain processing status and, when complete, the playback URL.  

---

### `POST /videos/upload`

**Summary:**  
Generates a Bunny.net signed URL for direct client upload and registers a new video record in LMS.

**Endpoint:**
```
https://api.lms.example.com/v1/videos/upload
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
    "originalFilename": {
      "type": "string",
      "description": "Client‑side filename for reference.",
      "example": "lecture1.mp4"
    },
    "contentType": {
      "type": "string",
      "description": "MIME type of the upload.",
      "example": "video/mp4"
    },
    "size": {
      "type": "integer",
      "description": "File size in bytes.",
      "example": 104857600
    }
  },
  "required": ["originalFilename","contentType","size"]
}
```

**Field Descriptions:**
- `originalFilename`: Used to tag the video in LMS; does not affect storage key.  
- `contentType`: Must match the actual upload content type.  
- `size`: Used for validation and billing estimates.

**Responses:**

- **`201 Created`**  
  - **Description:** Upload metadata registered; signed URL returned.  
  - **Response Body:**
    ```json
    {
      "type": "object",
      "properties": {
        "videoId": {
          "type": "string",
          "description": "LMS‐assigned UUID for the video resource.",
          "example": "v1a2b3c4-d5e6-7f8g-9h0i-1j2k3l4m5n6o"
        },
        "uploadUrl": {
          "type": "string",
          "description": "Time‑limited Bunny.net signed URL for direct upload.",
          "example": "https://storage.bunnycdn.com/…?access_signature=…"
        },
        "expiresIn": {
          "type": "integer",
          "description": "Seconds until the signed URL expires.",
          "example": 3600
        }
      }
    }
    ```

- **`400 Bad Request`**  
  - **Description:** Missing or invalid body fields.  
- **`401 Unauthorized`**, **`403 Forbidden`**, **`500 Internal Server Error`**

**Example (Fetch):**
```javascript
const payload = {
  originalFilename: 'lecture1.mp4',
  contentType: 'video/mp4',
  size: 104857600
};
const response = await fetch('https://api.lms.example.com/v1/videos/upload', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <YOUR_AUTH_TOKEN>'
  },
  body: JSON.stringify(payload)
});
const { videoId, uploadUrl } = await response.json();
console.log('Upload URL:', uploadUrl);
```

**Rate Limiting:**  
- 10 requests per minute per user.  

---

### `GET /videos/{videoId}/status`

**Summary:**  
Retrieves processing status and playback URL (when available) for a previously uploaded video.

**Endpoint:**
```
https://api.lms.example.com/v1/videos/{videoId}/status
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
- `videoId`: [string] – UUID of the video assigned by LMS.

**Responses:**

- **`200 OK`**  
  - **Description:** Current processing status and, if complete, playback URL.  
  - **Response Body:**
    ```json
    {
      "type": "object",
      "properties": {
        "videoId": {
          "type": "string",
          "example": "v1a2b3c4-d5e6-7f8g-9h0i-1j2k3l4m5n6o"
        },
        "status": {
          "type": "string",
          "description": "Processing state.",
          "enum": ["PENDING","PROCESSING","COMPLETED","FAILED"],
          "example": "PROCESSING"
        },
        "progress": {
          "type": "integer",
          "description": "Percentage of processing completed (0–100).",
          "example": 45
        },
        "playbackUrl": {
          "type": ["string","null"],
          "description": "Public Bunny.net playback URL when `status` = COMPLETED; otherwise null.",
          "example": "https://stream.bunnycdn.com/…/lecture1.m3u8"
        },
        "errorMessage": {
          "type": ["string","null"],
          "description": "Error details if `status` = FAILED.",
          "example": "Transcoding error: unsupported codec."
        }
      }
    }
    ```

- **`400 Bad Request`**  
  - **Description:** Invalid `videoId` format.  
- **`401 Unauthorized`**, **`403 Forbidden`**, **`404 Not Found`**, **`500 Internal Server Error`**

**Example (Fetch):**
```javascript
const response = await fetch(
  `https://api.lms.example.com/v1/videos/${videoId}/status`,
  { headers: { 'Authorization': 'Bearer <YOUR_AUTH_TOKEN>' } }
);
const statusInfo = await response.json();
console.log('Video status:', statusInfo.status);
```

**Webhook Integration:**  
- Optionally, Bunny.net can send processing completion webhooks to `/webhooks/videos/processing` on the LMS backend to push status updates instead of polling.  

---