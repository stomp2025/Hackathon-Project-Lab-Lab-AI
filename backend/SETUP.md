# Backend Setup Guide

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```bash
# JWT Configuration (REQUIRED)
JWT_SECRET_KEY=your-super-secret-jwt-key-here-change-this-in-production

# Database Configuration
DATABASE_URL=sqlite:///./stomp.db
# For PostgreSQL: DATABASE_URL=postgresql://username:password@localhost/stomp_db
# For MySQL: DATABASE_URL=mysql://username:password@localhost/stomp_db

# API Configuration
DEBUG=True
```

## Important Security Notes

1. **JWT_SECRET_KEY**: This is REQUIRED and must be set. The application will fail to start without it.
   - Generate a secure random key: `openssl rand -hex 32`
   - Never use the example key in production
   - Keep this secret and never commit it to version control

2. **Database**: The default SQLite database is suitable for development. For production, use PostgreSQL or MySQL.

## Installation

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create your `.env` file with the variables above

4. Run the application:
   ```bash
   uvicorn app.main:app --reload
   ```

The database tables will be created automatically on first run. 