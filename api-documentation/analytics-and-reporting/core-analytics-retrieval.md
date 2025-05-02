## Analytics & Reporting API – Core Analytics Retrieval

*Generated on: 2025-05-02*

---

### `GET /analytics/courses/{courseId}`

**Summary:**
Retrieves analytics statistics for a specific course, including completion rates, engagement metrics, and enrollment counts.

**Endpoint:**
```
https://api.lms.example.com/v1/analytics/courses/{courseId}
```

**Method:**
```
GET
```

**Authentication:**
- Required: Yes  
- Type: Bearer Token (JWT)

**Permissions:**
- Admin or Instructor of the course

**Headers:**
```json
{ "Authorization": "Bearer <YOUR_AUTH_TOKEN>" }
```

**Query Parameters:**
- `startDate`: [string] – ISO 8601 start of reporting window.
- `endDate`: [string] – ISO 8601 end of reporting window.
- `filters`: [string] – Comma‑separated filters (e.g., `cohort:2025A`).

**Responses:**

- **`200 OK`**  
  **Description:** Course analytics retrieved successfully.  
  **Response Body:**
  ```json
  {
    "type": "object",
    "properties": {
      "courseId": { "type": "string", "example": "f1e2d3c4-b5a6-7f8e-9d0c-1b2a3c4d5e6f" },
      "completionRate": { "type": "number", "description": "% of enrolled students who completed the course.", "example": 82.5 },
      "averageTimeSpent": { "type": "integer", "description": "Average time spent in seconds.", "example": 5400 },
      "activeUsers": { "type": "integer", "description": "Unique users active in period.", "example": 150 },
      "enrollments": { "type": "integer", "description": "Total enrollments during period.", "example": 200 },
      "engagementScore": { "type": "number", "description": "Composite engagement metric (0–5).", "example": 4.1 }
    }
  }
  ```

- **`400 Bad Request`**, **`401 Unauthorized`**, **`403 Forbidden`**, **`404 Not Found`**, **`500 Internal Server Error`**

**Example (Fetch):**
```javascript
const url = new URL('https://api.lms.example.com/v1/analytics/courses/' + courseId);
url.searchParams.set('startDate', '2025-04-01T00:00:00Z');
url.searchParams.set('endDate', '2025-04-30T23:59:59Z');
const resp = await fetch(url, { headers: { 'Authorization': 'Bearer <YOUR_AUTH_TOKEN>' } });
const data = await resp.json();
console.log('Course Analytics:', data);
```

---

### `GET /analytics/students/{userId}`

**Summary:**
Retrieves performance metrics for a specific student across all courses.

**Endpoint:**
```
https://api.lms.example.com/v1/analytics/students/{userId}
```

**Method:**
```
GET
```

**Authentication:**
- Required: Yes  
- Type: Bearer Token (JWT)

**Permissions:**
- Admin only

**Headers:**
```json
{ "Authorization": "Bearer <YOUR_AUTH_TOKEN>" }
```

**Query Parameters:**
- `startDate`: [string] – ISO 8601 start of reporting window.
- `endDate`: [string] – ISO 8601 end of reporting window.

**Responses:**

- **`200 OK`**  
  **Description:** Student analytics retrieved successfully.  
  **Response Body:**
  ```json
  {
    "type": "object",
    "properties": {
      "userId": { "type": "string", "example": "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d" },
      "coursesEnrolled": { "type": "integer", "description": "Total courses enrolled.", "example": 5 },
      "completionRate": { "type": "number", "description": "Overall completion % across courses.", "example": 80.0 },
      "averageScore": { "type": "number", "description": "Average quiz/exam score.", "example": 88.3 },
      "totalTimeSpent": { "type": "integer", "description": "Aggregate time spent in seconds.", "example": 14400 }
    }
  }
  ```

- **`400 Bad Request`**, **`401 Unauthorized`**, **`403 Forbidden`**, **`404 Not Found`**, **`500 Internal Server Error`**

**Example (Fetch):**
```javascript
const url = new URL('https://api.lms.example.com/v1/analytics/students/' + userId);
url.searchParams.set('startDate', '2025-04-01T00:00:00Z');
url.searchParams.set('endDate', '2025-04-30T23:59:59Z');
const resp = await fetch(url, { headers: { 'Authorization': 'Bearer <YOUR_AUTH_TOKEN>' } });
const data = await resp.json();
console.log('Student Analytics:', data);
```

---

### `GET /analytics/overview`

**Summary:**
Retrieves platform-wide summary metrics, including total users, total courses, average completion rate, and daily active users.

**Endpoint:**
```
https://api.lms.example.com/v1/analytics/overview
```

**Method:**
```
GET
```

**Authentication:**
- Required: Yes  
- Type: Bearer Token (JWT)

**Permissions:**
- Admin only

**Headers:**
```json
{ "Authorization": "Bearer <YOUR_AUTH_TOKEN>" }
```

**Query Parameters:**
- `startDate`: [string] – ISO 8601 start of reporting window.
- `endDate`: [string] – ISO 8601 end of reporting window.

**Responses:**

- **`200 OK`**  
  **Description:** Overview metrics retrieved successfully.  
  **Response Body:**
  ```json
  {
    "type": "object",
    "properties": {
      "totalUsers": { "type": "integer", "example": 1500 },
      "totalCourses": { "type": "integer", "example": 120 },
      "averageCompletionRate": { "type": "number", "example": 78.4 },
      "dailyActiveUsers": { "type": "integer", "description": "Unique active users per day.", "example": 300 },
      "averageTimePerSession": { "type": "integer", "description": "Seconds per user session.", "example": 1800 }
    }
  }
  ```

- **`400 Bad Request`**, **`401 Unauthorized`**, **`403 Forbidden`**, **`500 Internal Server Error`**

**Example (Fetch):**
```javascript
const url = new URL('https://api.lms.example.com/v1/analytics/overview');
url.searchParams.set('startDate', '2025-04-01T00:00:00Z');
url.searchParams.set('endDate', '2025-04-30T23:59:59Z');
const resp = await fetch(url, { headers: { 'Authorization': 'Bearer <YOUR_AUTH_TOKEN>' } });
const data = await resp.json();
console.log('Platform Overview:', data);
```
---