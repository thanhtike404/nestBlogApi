# Blog API

A modern blog and content management system built with NestJS, Prisma, and PostgreSQL. This API provides a complete backend solution for managing blog posts, user authentication, comments, categories, tags, and content series.

## Features

- **User Management**: User registration, authentication, and profile management
- **Content Management**: Create, edit, and publish blog posts with Markdown support
- **Series Organization**: Group related posts into tutorial series or collections
- **Categorization**: Organize content with categories and tags
- **Comments System**: Threaded comments with reply functionality
- **Image Management**: Upload and manage post images
- **Draft System**: Save posts as drafts before publishing
- **API Documentation**: Auto-generated Swagger documentation

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Zod with nestjs-zod
- **Authentication**: bcrypt for password hashing
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest for unit and e2e tests

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- pnpm package manager

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd blog-api
```

2. Install dependencies
```bash
pnpm install
```

3. Set up environment variables
```bash
cp env.example .env
```
Edit `.env` with your database connection and other configuration values.

4. Set up the database
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database (optional)
npx prisma db seed
```

## Development

```bash
# Start in development mode with hot reload
pnpm run start:dev

# Start in debug mode
pnpm run start:debug

# Build for production
pnpm run build

# Start production server
pnpm run start:prod
```

## Testing

```bash
# Run unit tests
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Run e2e tests
pnpm run test:e2e

# Generate test coverage report
pnpm run test:cov
```

## API Documentation

Once the server is running, you can access the Swagger API documentation at:
```
http://localhost:3000/api
```

## Database Schema

The application uses the following main entities:

- **Users**: Author profiles with social links and bio
- **Posts**: Blog posts with Markdown content, status tracking
- **Series**: Collections of related posts (tutorials, guides)
- **Categories**: High-level content organization
- **Tags**: Flexible content labeling
- **Comments**: Threaded discussion system
- **Images**: Post media management

## API Endpoints

### Authentication & Users
- `POST /users` - Create new user
- `GET /users/:id` - Get user profile
- `PUT /users/:id` - Update user profile

### Posts
- `GET /posts` - List published posts (with pagination)
- `POST /posts` - Create new post
- `GET /posts/:slug` - Get post by slug
- `PUT /posts/:id` - Update post
- `DELETE /posts/:id` - Delete post

### Series
- `GET /series` - List all series
- `POST /series` - Create new series
- `GET /series/:slug` - Get series with posts

### Categories & Tags
- `GET /categories` - List categories
- `GET /tags` - List tags
- `POST /categories` - Create category
- `POST /tags` - Create tag

### Comments
- `GET /posts/:id/comments` - Get post comments
- `POST /posts/:id/comments` - Add comment
- `POST /comments/:id/replies` - Reply to comment

## Environment Variables

Create a `.env` file with the following variables:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/blog_db"
JWT_SECRET="your-jwt-secret"
PORT=3000
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
