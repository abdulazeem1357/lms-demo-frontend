## Video Streaming API – Video Stream URL & DRM Retrieval

*Generated on: 2025-05-02*

---

### `GET /videos/{videoId}/stream-url`

**Summary:**
Retrieves a secure HLS or DASH streaming URL for a video asset, optionally token-protected via a signed access token.

**Endpoint:**
```
https://api.lms.example.com/v1/videos/{videoId}/stream-url
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
- `videoId`: [string] – UUID of the video resource.

**Query Parameters:**
- `type`: [string] – Manifest type: `HLS` or `DASH`. Default: `HLS`.
- `tokenExpiresIn`: [integer] – Time in seconds before the signed access token expires. Default: 3600.

**Responses:**

- **`200 OK`**
  - **Description:** Secure streaming URL returned.
  - **Response Body:**
    ```json
    {
      "type": "object",
      "properties": {
        "streamUrl": {
          "type": "string",
          "description": "Time-limited URL to the HLS or DASH manifest.",
          "example": "https://stream.bunnycdn.com/abc123/lecture1.m3u8"
        },
        "expiresAt": {
          "type": "string",
          "format": "date-time",
          "description": "UTC timestamp when the stream URL expires.",
          "example": "2025-05-02T15:30:00Z"
        },
        "token": {
          "type": ["string","null"],
          "description": "Signed JWT for DRM-protected streams or null if not applicable.",
          "example": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        }
      }
    }
    ```

- **`400 Bad Request`**, **`401 Unauthorized`**, **`403 Forbidden`**, **`404 Not Found`**, **`500 Internal Server Error`**

**Example (Fetch):**
```javascript
const url = `https://api.lms.example.com/v1/videos/${videoId}/stream-url?type=HLS&tokenExpiresIn=3600`;
const resp = await fetch(url, {
  headers: { 'Authorization': 'Bearer <YOUR_AUTH_TOKEN>' }
});
const { streamUrl, token } = await resp.json();
console.log('Stream URL:', streamUrl);
```

**Token Generation Mechanism:**
- The LMS backend generates a signed JWT using HS256, embedding `{ "videoId": "<videoId>", "exp": <current_timestamp> + tokenExpiresIn }`.
- The signature uses the server’s secret key to ensure authenticity and prevent tampering.
- Clients include this token via the `token` response field or as a query parameter when requesting protected manifests.

**CDN Best Practices:**
- Set `Cache-Control: max-age=60, public` headers on manifest responses.
- Use HTTPS for all streaming traffic.
- Leverage Bunny.net geo-fallback and edge caching for low latency.

---

### `POST /videos/{videoId}/drm`

**Summary:**
Configures or updates DRM settings for a video asset and retrieves license acquisition information.

**Endpoint:**
```
https://api.lms.example.com/v1/videos/{videoId}/drm
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

**Path Parameters:**
- `videoId`: [string] – UUID of the video resource.

**Request Body:**
```json
{
  "type": "object",
  "properties": {
    "drmProvider": {
      "type": "string",
      "description": "DRM provider (e.g., WIDEVINE, PLAYREADY, FAIRPLAY).",
      "example": "WIDEVINE"
    },
    "licenseServerUrl": {
      "type": "string",
      "description": "URL of the DRM license server.",
      "example": "https://license.bunnycdn.com/v1/licenses/widevine"
    }
  },
  "required": ["drmProvider","licenseServerUrl"]
}
```

**Field Descriptions:**
- `drmProvider`: Specifies the DRM system to configure.
- `licenseServerUrl`: Endpoint clients will use to acquire playback licenses.

**Responses:**

- **`200 OK`**
  - **Description:** DRM configuration saved; license acquisition details returned.
  - **Response Body:**
    ```json
    {
      "type": "object",
      "properties": {
        "drmId": {
          "type": "string",
          "description": "LMS-assigned DRM configuration ID.",
          "example": "drm1234abcd"
        },
        "drmProvider": {
          "type": "string",
          "example": "WIDEVINE"
        },
        "licenseServerUrl": {
          "type": "string",
          "example": "https://license.bunnycdn.com/v1/licenses/widevine"
        },
        "policy": {
          "type": "object",
          "description": "Optional DRM policy details (e.g., usage rules, expiration).",
          "example": { "allowedTrackTypes": ["SD","HD"], "rentalDuration": 3600 }
        }
      }
    }
    ```

- **`400 Bad Request`**
  - **Description:** Invalid or missing DRM configuration parameters.
- **`401 Unauthorized`**, **`403 Forbidden`**
- **`404 Not Found`**
- **`424 Failed Dependency`**
  - **Description:** DRM key generation or provider handshake failed.
- **`502 Bad Gateway`**, **`503 Service Unavailable`**
  - **Description:** Error communicating with DRM provider or service unavailable.

**Example (Fetch):**
```javascript
const payload = { drmProvider: 'WIDEVINE', licenseServerUrl: 'https://license.bunnycdn.com/v1/licenses/widevine' };
const resp = await fetch(`https://api.lms.example.com/v1/videos/${videoId}/drm`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <YOUR_AUTH_TOKEN>'
  },
  body: JSON.stringify(payload)
});
const config = await resp.json();
console.log('DRM Config:', config);
```
---