"""
Tests for utility functions
"""
import pytest
from unittest.mock import Mock, patch, MagicMock
from application.utils.auth_utils import verify_admin_credentials, requires_auth
from application.utils.email_utils import send_contact_notification


class TestAuthUtils:
    """Tests for authentication utilities"""

    def test_verify_credentials_with_plain_password(self, monkeypatch):
        """Test credential verification with plain password (dev mode)"""
        monkeypatch.setenv('ADMIN_USERNAME', 'testadmin')
        monkeypatch.setenv('ADMIN_PASSWORD', 'testpass123')
        monkeypatch.delenv('ADMIN_PASSWORD_HASH', raising=False)

        assert verify_admin_credentials('testadmin', 'testpass123') is True
        assert verify_admin_credentials('testadmin', 'wrongpass') is False
        assert verify_admin_credentials('wronguser', 'testpass123') is False

    def test_verify_credentials_with_password_hash(self, monkeypatch):
        """Test credential verification with password hash"""
        from werkzeug.security import generate_password_hash

        password_hash = generate_password_hash('securepass123')
        monkeypatch.setenv('ADMIN_USERNAME', 'admin')
        monkeypatch.setenv('ADMIN_PASSWORD_HASH', password_hash)

        assert verify_admin_credentials('admin', 'securepass123') is True
        assert verify_admin_credentials('admin', 'wrongpass') is False

    @patch('app.utils.auth_utils.session')
    def test_requires_auth_with_session(self, mock_session):
        """Test requires_auth decorator with authenticated session"""
        mock_session.get.return_value = True

        @requires_auth
        def protected_route():
            return "Success"

        result = protected_route()
        assert result == "Success"

    def test_requires_auth_without_auth(self, app):
        """Test requires_auth decorator without authentication"""
        with app.test_request_context():
            @requires_auth
            def protected_route():
                return "Success"

            result, status = protected_route()
            assert status == 401


class TestEmailUtils:
    """Tests for email utilities"""

    def test_send_notification_without_sendgrid(self, app):
        """Test email sending when SendGrid is not available"""
        with patch('app.utils.email_utils.SENDGRID_AVAILABLE', False):
            result = send_contact_notification(
                app, "Test User", "test@example.com",
                "Test Subject", "Test message"
            )
            assert result is False

    def test_send_notification_without_api_key(self, app):
        """Test email sending without API key configured"""
        app.config['SENDGRID_API_KEY'] = None

        with patch('app.utils.email_utils.SENDGRID_AVAILABLE', True):
            result = send_contact_notification(
                app, "Test User", "test@example.com",
                "Test Subject", "Test message"
            )
            assert result is False

    @patch('app.utils.email_utils.SendGridAPIClient')
    @patch('app.utils.email_utils.SENDGRID_AVAILABLE', True)
    def test_send_notification_success(self, mock_sg, app):
        """Test successful email notification sending"""
        app.config['SENDGRID_API_KEY'] = 'test-key'
        app.config['NOTIFICATION_EMAIL'] = 'notify@example.com'

        mock_client = Mock()
        mock_response = Mock()
        mock_response.status_code = 202
        mock_client.send.return_value = mock_response
        mock_sg.return_value = mock_client

        result = send_contact_notification(
            app, "Test User", "test@example.com",
            "Test Subject", "Test message"
        )

        assert result is True
        assert mock_client.send.called

    @patch('app.utils.email_utils.SendGridAPIClient')
    @patch('app.utils.email_utils.SENDGRID_AVAILABLE', True)
    def test_send_notification_failure(self, mock_sg, app):
        """Test email notification failure handling"""
        app.config['SENDGRID_API_KEY'] = 'test-key'

        mock_sg.side_effect = Exception("SendGrid error")

        result = send_contact_notification(
            app, "Test User", "test@example.com",
            "Test Subject", "Test message"
        )

        assert result is False
