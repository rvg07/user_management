# User and Group Management API Service

A RESTful API service built with Node.js, Express.js, and MySQL for managing users and groups. 
This implementation uses raw SQL queries via the `mysql2` library (without ORM) and includes features like input validation using Joi for request bodies, query parameters and pagination for listing users (`GET /api/v1/users`) and groups (`GET /api/v1/groups`), and integration tests of API endpoints using `jest` and `axios`.

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
    *   Copy the example environment file for development in the root project:
        ```bash
        cp .env.example .env
        ```
    *   In the `.env` file pay close attention to:
        *   `APP_PORT`: the port where our service will be accessible on our host machine (e.g., `3000`).
        *   `DB_HOST=db`: for Docker Compose networking. **Important:** keep this as `db`.
        *   `DB_HOST_PORT`: the port used to connect directly to the MYSQL db container.
        *   `DB_NAME`: the name of the database schema that the MySQL db container.
        *   `DB_USER`: the username that the MySQL db container will create and grant privileges to.
        *   `DB_PASSWORD`: the password for the `DB_USER`. 
        *   `DB_ROOT_PASSWORD`: the root privilege password for our MySQL db container.

3.  **Build and Run with Docker Compose:**
    ```bash
    docker-compose up --build
    ```
    *   Use `docker-compose up -d` to run in detached mode (background).

4.  **Access the API:**
    *   The API should be running at `http://localhost:<APP_PORT>/api/v1` (e.g., `http://localhost:3000/api/v1`).
    *   You can check the root endpoint: e.g `curl http://localhost:3000/api/v1`.