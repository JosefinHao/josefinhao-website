"""
Tests for configuration
"""
import pytest
from app.config import Config, DevelopmentConfig, ProductionConfig, TestingConfig


class TestConfig:
    """Tests for base configuration"""

    def test_base_config_has_secret_key(self):
        """Test base config generates secret key"""
        assert Config.SECRET_KEY is not None
        assert len(Config.SECRET_KEY) > 10

    def test_base_config_has_database_settings(self):
        """Test base config has database settings"""
        assert hasattr(Config, 'SQLALCHEMY_TRACK_MODIFICATIONS')
        assert Config.SQLALCHEMY_TRACK_MODIFICATIONS is False

    def test_base_config_has_email_settings(self):
        """Test base config has email settings"""
        assert hasattr(Config, 'NOTIFICATION_EMAIL')
        assert '@' in Config.NOTIFICATION_EMAIL


class TestDevelopmentConfig:
    """Tests for development configuration"""

    def test_development_debug_enabled(self):
        """Test development config has debug enabled"""
        assert DevelopmentConfig.DEBUG is True
        assert DevelopmentConfig.TESTING is False

    def test_development_database_uri(self):
        """Test development database URI"""
        assert 'josefinhao-dev.db' in DevelopmentConfig.SQLALCHEMY_DATABASE_URI

    def test_development_sql_echo(self):
        """Test development config has SQL echo enabled"""
        assert DevelopmentConfig.SQLALCHEMY_ECHO is True


class TestProductionConfig:
    """Tests for production configuration"""

    def test_production_debug_disabled(self):
        """Test production config has debug disabled"""
        assert ProductionConfig.DEBUG is False
        assert ProductionConfig.TESTING is False

    def test_production_database_uri(self):
        """Test production database URI"""
        assert 'josefinhao.db' in ProductionConfig.SQLALCHEMY_DATABASE_URI

    def test_production_sql_echo(self):
        """Test production config has SQL echo disabled"""
        assert ProductionConfig.SQLALCHEMY_ECHO is False


class TestTestingConfig:
    """Tests for testing configuration"""

    def test_testing_enabled(self):
        """Test testing config has testing enabled"""
        assert TestingConfig.TESTING is True
        assert TestingConfig.DEBUG is True

    def test_testing_in_memory_database(self):
        """Test testing config uses in-memory database"""
        assert TestingConfig.SQLALCHEMY_DATABASE_URI == 'sqlite:///:memory:'

    def test_testing_csrf_disabled(self):
        """Test testing config has CSRF disabled"""
        assert TestingConfig.WTF_CSRF_ENABLED is False
