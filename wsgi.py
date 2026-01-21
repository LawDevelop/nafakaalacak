# WSGI configuration for PythonAnywhere

import sys
import os

# Add your project directory to the sys.path
project_home = '/home/YOUR_USERNAME/nafaka-hesaplama'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Import Flask app
from app import app as application
