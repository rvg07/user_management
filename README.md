# User and Group Management API Service

A RESTful API service built with Node.js, Express.js, and MySQL for managing users and groups. 
This implementation uses raw SQL queries via the `mysql2` library (without ORM) and includes features like input validation using `Joi` for request bodies, query parameters and pagination for listing users (`GET /api/v1/users`) and groups (`GET /api/v1/groups`), and integration tests of API endpoints using `jest` and `axios`.

## Getting Started
### Installation

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/rvg07/user_management.git
    ```
2.  **Enter to the Project Directory:**
    ```bash
    cd user_management
    ```
3.  **Configure Environment Variables:**
    *   Copy the example environment file `.env.example` in the root project:
        ```bash
        cp .env.example .env
        ```
    *   In the `.env` file please pay close attention to:
        *   `APP_PORT`: the port where our service will be accessible on our host machine.
        *   `DB_HOST=db`: for Docker Compose networking. **Important:** you must keep this as `db`.
        *   `DB_HOST_PORT`: the port used to connect directly to the MySQL db container.
        *   `DB_NAME`: the name of the database schema that the MySQL db container.
        *   `DB_USER`: the username that the MySQL db container will create and grant privileges to.
        *   `DB_PASSWORD`: the password for the `DB_USER`. 
        *   `DB_ROOT_PASSWORD`: the root privilege password for our MySQL db container.

3.  **Build and Run with Docker Compose:**
    ```bash
    docker-compose up --build -d
    ```
    *   We use `-d` to run in detached mode.

4.  **Access the API:**
    *   The API should be running at `http://localhost:<APP_PORT>/api/v1`.
    *   You can check the root endpoint: e.g. `curl http://localhost:3000/api/v1`.
    
### Integration Tests

6.  In a separate terminal run:
    ```bash
    npm test
    ```
    *   `jest` finds and executes the `*.test.js` files.
    *   Tests inside these files use `axios` to send HTTP requests.

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