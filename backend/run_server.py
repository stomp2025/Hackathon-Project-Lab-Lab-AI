#!/usr/bin/env python3
"""
Simple script to run the FastAPI server with proper environment setup.
This ensures the .env file is loaded before importing any modules.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
env_path = Path(__file__).parent / ".env"
load_dotenv(env_path)

# Verify required environment variables
if not os.environ.get("JWT_SECRET_KEY"):
    print("ERROR: JWT_SECRET_KEY environment variable is required!")
    print("Please create a .env file with JWT_SECRET_KEY=your-secret-key")
    exit(1)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True) 