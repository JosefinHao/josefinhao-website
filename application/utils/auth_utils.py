"""
Authentication utility functions
"""
import os
import logging
from functools import wraps
from flask import request, jsonify, session
from werkzeug.security import check_password_hash

logger = logging.getLogger(__name__)

# Simple authentication decorator for admin routes
def requires_auth(f):
    """
    Decorator to require authentication for admin routes
    Uses basic auth or session-based auth
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Check if user is authenticated via session
        if session.get('authenticated'):
            return f(*args, **kwargs)

        # Check Basic Auth header
        auth = request.authorization
        if not auth:
            return jsonify({'error': 'Authentication required'}), 401

        if verify_admin_credentials(auth.username, auth.password):
            session['authenticated'] = True
            return f(*args, **kwargs)

        logger.warning(f"Failed authentication attempt for user: {auth.username}")
        return jsonify({'error': 'Invalid credentials'}), 401

    return decorated_function


def verify_admin_credentials(username, password):
    """
    Verify admin credentials

    Args:
        username: Admin username
        password: Admin password (plain text)

    Returns:
        bool: True if credentials are valid
    """
    admin_username = os.environ.get('ADMIN_USERNAME', 'admin')
    admin_password_hash = os.environ.get('ADMIN_PASSWORD_HASH')

    # For development only - simple password check
    # In production, ADMIN_PASSWORD_HASH must be set
    if not admin_password_hash:
        # Development fallback (NOT FOR PRODUCTION)
        admin_password = os.environ.get('ADMIN_PASSWORD', 'changeme123')
        logger.warning("Using plain text password comparison (development only)")
        return username == admin_username and password == admin_password

    # Production - use password hash
    try:
        return username == admin_username and check_password_hash(admin_password_hash, password)
    except Exception as e:
        logger.error(f"Error verifying credentials: {e}")
        return False
