# main.py - Entry point for Vercel deployment
import sys
import os

# Add the backend folder to the Python path
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_path)

# Change working directory to backend so relative imports work
original_cwd = os.getcwd()
os.chdir(backend_path)

try:
    # Import the FastAPI app from backend/main.py
    from main import app

    # Restore original working directory if needed
    os.chdir(original_cwd)

except ImportError as e:
    print(f"❌ Import error from backend/main.py: {e}")
    print(f"📁 Current directory: {os.getcwd()}")
    print(f"📁 Contents of backend folder: {os.listdir(backend_path) if os.path.exists(backend_path) else 'Folder not found'}")
    raise

# The app is now available for Vercel/uvicorn
# Vercel will automatically detect the 'app' variable
