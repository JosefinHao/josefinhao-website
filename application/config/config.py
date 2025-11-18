"""
Application Configuration Classes
Separates development, production, and testing configurations
"""
import os
import secrets


class Config:
    """Base configuration"""
    # Security
    SECRET_KEY = os.environ.get('SECRET_KEY') or secrets.token_hex(32)

    # Database
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # API Keys
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
    SENDGRID_API_KEY = os.environ.get('SENDGRID_API_KEY')

    # Email settings
    NOTIFICATION_EMAIL = os.environ.get('NOTIFICATION_EMAIL', 'josefin.rui.hao@gmail.com')

    # Admin settings
    ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', 'admin')
    ADMIN_PASSWORD_HASH = os.environ.get('ADMIN_PASSWORD_HASH')  # Should be set in production

    # Rate limiting
    RATELIMIT_STORAGE_URL = os.environ.get('REDIS_URL', 'memory://')

    # Application settings
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max request size


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    TESTING = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///josefinhao-dev.db'
    SQLALCHEMY_ECHO = True  # Log SQL queries in development


class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    TESTING = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///josefinhao.db'
    SQLALCHEMY_ECHO = False

    # Production must have secure secret key
    @staticmethod
    def init_app(app):
        if app.config['SECRET_KEY'] == 'dev-secret-key-change-in-production':
            raise ValueError('SECRET_KEY must be set in production environment')


class TestingConfig(Config):
    """Testing configuration"""
    DEBUG = True
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'  # In-memory database for tests
    WTF_CSRF_ENABLED = False  # Disable CSRF for testing


# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
