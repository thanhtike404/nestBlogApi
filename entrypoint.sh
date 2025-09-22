#!/bin/sh

# This script is the entrypoint for the 'api' service.
# It ensures that database migrations are applied before the main application starts.

# Exit immediately if any command fails, to prevent the app from starting in a broken state.
set -e

# A simple check to wait for the database container to be ready.
# In a real production setup, you might use a more robust tool like 'wait-for-it.sh'.
echo "Waiting for PostgreSQL to be ready..."
sleep 5

# Run the specific migration command for your PostgreSQL database using the script from package.json.
# This command will connect to the 'postgres' service and apply any pending migrations.
echo "Running PostgreSQL migrations..."
pnpm run prisma:migrate:dev

# This is the final and most important step.
# 'exec "$@"' takes the command specified in the 'command' section of docker-compose.yml
# (in this case, "pnpm run start:dev") and runs it.
# The 'exec' command replaces the shell process with the application process,
# which is a Docker best practice.
echo "Starting the NestJS application..."
exec "$@"
```

# ### How to Use This

# 1.  **Save the File:** Create a file named `entrypoint.sh` in the **root directory** of your project (the same location as your `Dockerfile` and `docker-compose.yml`).
# 2.  **Make it Executable:** This is a crucial step. On your local machine (macOS or Linux), run the following command in your terminal to give the script permission to be executed:
#     ```bash
#     chmod +x entrypoint.sh
#     ```
# 3.  **Rebuild and Run:** Now, you can build and start your services.
#     ```bash
#     docker compose up --build
    

