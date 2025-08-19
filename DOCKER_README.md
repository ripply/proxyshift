# Running ProxyShift with Docker

This application has been containerized for easy deployment. The setup uses Docker Compose to run both the Node.js application and a PostgreSQL database.

## Prerequisites

- Docker and Docker Compose installed
- Make sure Docker daemon is running

## Quick Start

1. Start the application:
   ```bash
   ./run.sh
   ```

   Or manually:
   ```bash
   docker-compose up -d
   ```

2. The application will be available at: http://localhost:8080

## Database Configuration

The application is configured to use both SQLite (for development) and PostgreSQL:

- **SQLite**: Default configuration, database stored in `./data/database.db`
- **PostgreSQL**: Available for production use
  - Host: localhost:5432
  - Database: proxyshift
  - Username: proxyshift
  - Password: proxyshift123

## Environment Variables

Key environment variables you may want to customize:

- `NODE_ENV`: Set to `development` or `production`
- `PORT`: Application port (default: 8080)
- `DATABASE_URL`: Database connection string

## Useful Commands

```bash
# View application logs
docker-compose logs -f proxyshift

# View database logs
docker-compose logs -f postgres

# Stop the application
docker-compose down

# Rebuild and restart
docker-compose down && docker-compose up --build -d

# Access the application container
docker-compose exec proxyshift sh

# Access the database
docker-compose exec postgres psql -U proxyshift -d proxyshift
```

## Notes

- This is a legacy Node.js 4.2 application, so we're using Node.js 4.8 Docker image
- No package upgrades were performed to maintain compatibility
- The application includes both a web interface and mobile Ionic components
- Admin interface available at `/admin` (credentials in source code)

## Troubleshooting

If you encounter issues:

1. Check Docker is running: `docker info`
2. Check logs: `docker-compose logs`
3. Rebuild containers: `docker-compose down && docker-compose up --build`