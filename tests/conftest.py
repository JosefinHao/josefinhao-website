"""
Pytest configuration and fixtures
"""
import pytest
import os
import sys

# Add parent directory to path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from flask import Flask
from flask_sqlalchemy import SQLAlchemy


@pytest.fixture
def app():
    """Create and configure a test Flask application"""
    from application.config import TestingConfig

    test_app = Flask(__name__)
    test_app.config.from_object(TestingConfig)
    test_app.config['TESTING'] = True
    test_app.config['WTF_CSRF_ENABLED'] = False

    return test_app


@pytest.fixture
def client(app):
    """Create a test client"""
    return app.test_client()


@pytest.fixture
def db(app):
    """Create test database"""
    database = SQLAlchemy(app)

    with app.app_context():
        database.create_all()
        yield database
        database.session.remove()
        database.drop_all()


@pytest.fixture
def runner(app):
    """Create a test CLI runner"""
    return app.test_cli_runner()
