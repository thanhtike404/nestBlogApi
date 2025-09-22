NestJS Multi-Database Blog API
A modern blog and content management system built with NestJS, Prisma, Docker, PostgreSQL, and MongoDB. This API provides a complete, containerized backend solution for managing blog posts, user authentication, rich content, categories, and tags.

Features
User Management: User registration, JWT-based authentication, and profile management.

Dual Database Architecture: Utilizes PostgreSQL for structured relational data (users, posts) and MongoDB for flexible document data (rich content, logs).

Content Management: Create, edit, and publish blog posts.

Rich Content Storage: Store complex post content (e.g., from block-style editors) in MongoDB.

Categorization: Organize content with categories and tags.

API Documentation: Auto-generated Swagger (OpenAPI) documentation.

Containerized Environment: Fully configured with Docker and Docker Compose for easy setup and consistent development.

Tech Stack
Framework: NestJS

Databases: PostgreSQL & MongoDB

ORM: Prisma (with two separate clients)

Containerization: Docker & Docker Compose

Validation: Zod with nestjs-zod

Authentication: JWT & bcrypt for password hashing

Package Manager: pnpm

Prerequisites
Docker

Docker Compose

Installation
Clone the repository

git clone <your-repository-url>
cd <your-repo-name>

Set up environment variables

Create a .env file by copying the example file.

cp .env.example .env

The default values in .env.example are already configured to work with the docker-compose.yml file. You should update the JWT_SECRET with a secure, random string.

Build and Start the Services

This single command will build the Docker images and start the NestJS API, PostgreSQL, and MongoDB containers.

docker compose up --build

The API will be available at http://localhost:3000.

Database Setup
The first time you start the application, the entrypoint.sh script will automatically run the PostgreSQL migrations. However, you may need to manage the databases manually.

All database commands must be run through the running api container.

PostgreSQL
# Run migrations (this is also done automatically on startup)
docker compose exec api pnpm run prisma:migrate:dev

# Seed the database (optional)
docker compose exec api pnpm run db:seed

MongoDB
MongoDB does not use migrations. The db push command syncs your schema with the database. You should run this manually after changing your prisma-mongo/schema.prisma file.

# Push schema changes to MongoDB
docker compose exec api pnpm run mongo:dbpush

Development
The services are configured to run in development mode with hot-reloading.

Start all services: docker compose up

Stop all services: docker compose down

Stop services and remove volumes: docker compose down -v

Testing
Run tests by executing the test command inside the api container.

# Run unit tests
docker compose exec api pnpm run test

# Run tests in watch mode
docker compose exec api pnpm run test:watch

# Run e2e tests
docker compose exec api pnpm run test:e2e

# Generate test coverage report
docker compose exec api pnpm run test:cov

API Documentation
Once the server is running, you can access the Swagger API documentation at:

http://localhost:3000/api

Environment Variables
Your .env file should contain the following variables:

# PostgreSQL connection URL for Prisma
DATABASE_URL="postgresql://user:password@postgres:5432/nest-blog"

# MongoDB connection URL for Prisma
MONGODB_URI="mongodb://mongodb:27017/nest-blog"

# Secret for signing JWTs
JWT_SECRET="your-super-secret-and-long-jwt-string"

# Port the application will listen on
PORT=3000

Contributing
Fork the repository

Create a feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request

License
This project is licensed under the MIT License.