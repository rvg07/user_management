## API Documentation

#### Users (`/api/v1/users`)

<details>
  <summary><code>POST</code> <code><b>/api/v1/users</b></code></summary>

Requires a JSON body with user details to create a new user.

##### Request Body Parameters

| Name        | Type     | Data Type             | Description                                     |
|-------------|----------|-----------------------|-------------------------------------------------|
| `name`      | Required | string                | User's first name                               |
| `surname`   | Required | string                | User's last name                                |
| `birth_date`| Required | string (`YYYY-MM-DD`) | User's date of birth                             |
| `sex`       | Required | string (`'male'` &#124; `'female'` &#124; `'other'`) | User's sex (allowed values: 'male', 'female', 'other') |

##### Responses

| HTTP Code | Content-Type     | Response                                                                 |
|-----------|------------------|--------------------------------------------------------------------------|
| `201`     | `application/json` | `{"message": "User created successfully", "userId": 123}`                 |
| `400`     | `application/json` | `{"status": "error", "code": "INVALID_USER_PARAMS", "message": "..."}` |
| `409`     | `application/json` | `{"status": "error", "code": "ER_DUP_ENTRY", "message": "... already exists."}` |
| `500`     | `application/json` | `{"status": "error", "code": "INTERNAL_SERVER_ERROR", "message": "..."}` |

##### Example cURL Request

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"nameTest","surname":"surnameTest","birth_date":"1988-02-15","sex":"male"}' \
  http://localhost:3000/api/v1/users
```
  *  **`POST /api/v1/associations`:**
        *   Description: Creates a new user. Requires `name`, `surname`, `birth_date (YYYY-MM-DD)`, `sex ('male'|'female'|'other')`. <br> Checks for uniqueness based on this combination.
        *   You can check the root endpoint: e.g. `curl http://localhost:3000/api/v1`.