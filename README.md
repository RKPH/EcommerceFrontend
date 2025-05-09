# React Frontend Application

Welcome to the React Frontend Application! This project is a Dockerized React application built with Vite, designed to serve as the frontend for a web application. It connects to a backend API and runs in a containerized environment using Docker and Docker Compose. This README provides instructions for setting up, configuring, and running the application.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Clone the Repository](#clone-the-repository)
  - [Configure Environment Variables](#configure-environment-variables)
  - [Build and Run with Docker](#build-and-run-with-docker)
  - [Running Locally (Without Docker)](#running-locally-without-docker)
- [Project Structure](#project-structure)
- [Networking](#networking)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Ensure you have the following installed:

- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/) for containerization
- [Node.js](https://nodejs.org/) (version 18 LTS) for local development
- [npm](https://www.npmjs.com/) (included with Node.js)

## Getting Started

### Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/RKPH/EcommerceFrontend.git
cd EcommerceFrontend
```

### Configure Environment Variables

The application requires a `.env` file to configure the connection to the backend API. Follow these steps:

1. **Create a `.env` file** in the project root.
2. **Add the required variable** using the template below. Replace the placeholder with the actual backend API URL.
3. **Secure the file** by adding `.env` to `.gitignore` to prevent it from being committed.

**`.env` Template**:

```env
# Backend API URL
REACT_APP_API_URL=Your backend API URL (e.g., http://localhost:3000)
```

### Build and Run with Docker

The application is containerized using Docker and managed with Docker Compose. Follow these steps:

1. **Ensure the shared network exists**:
   The application uses an external Docker network named `shared-network`. Create it if it doesn't exist:

   ```bash
   docker network create shared-network
   ```

2. **Build and run the application**:
   Use Docker Compose to build and start the container:

   ```bash
   docker-compose up --build
   ```

   This command:
   - Builds the Docker image using the `Dockerfile`.
   - Starts the container, mapping port `5173` on the host to port `5173` in the container.
   - Loads environment variables from the `.env` file.
   - Mounts the project directory for live updates.

3. **Access the application**:
   Once running, the application will be available at `http://localhost:5173`.

4. **Stop the application**:
   To stop the container, press `Ctrl+C` or run:

   ```bash
   docker-compose down
   ```

### Running Locally (Without Docker)

To run the application locally without Docker:

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Ensure the `.env` file is configured** as described above.

3. **Start the Vite development server**:

   ```bash
   npm run dev
   ```

4. **Access the application** at `http://localhost:5173`.

## Project Structure

- `Dockerfile`: Defines the Docker image for the React application.
- `docker-compose.yml`: Configures the Docker Compose service for the frontend.
- `.env`: Environment variables (create as described above).
- `package.json`: Project dependencies and scripts.
- `src/`: React application source code.

## Networking

The application uses an external Docker network (`shared-network`) to communicate with other services (e.g., a backend API). Ensure the network is created and that any backend services are also connected to `shared-network`.

To verify the network:

```bash
docker network ls
```

To connect other services to the network, include `shared-network` in their Docker Compose configuration.

## Troubleshooting

- **Port conflicts**: If port `5173` is in use, modify the `ports` mapping in `docker-compose.yml` (e.g., `"8080:5173"`).
- **Environment variables**: Ensure `REACT_APP_API_URL` is set correctly in the `.env` file.
- **Network issues**: Verify that the `shared-network` exists and that backend services are accessible.
- **Docker issues**: Check container logs with `docker logs frontend` or `docker-compose logs`.

## Contributing

1. Fork the repository.
2. Create a branch (`git checkout -b feature/your-feature`).
3. Commit changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

Happy coding! For issues or questions, open an issue in the repository.
