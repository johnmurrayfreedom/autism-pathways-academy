#!/usr/bin/env python
import os
import sys

# Add the current directory to the path so we can import app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db.init_db import main

if __name__ == "__main__":
    main() 