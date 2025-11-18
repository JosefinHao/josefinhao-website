"""
Tests for database models
"""
import pytest
from datetime import datetime
from app.models import ContactMessage, InboundEmail


class TestContactMessage:
    """Tests for ContactMessage model"""

    def test_contact_message_creation(self, db):
        """Test creating a contact message"""
        message = ContactMessage(
            name="Test User",
            email="test@example.com",
            subject="Test Subject",
            message="Test message content"
        )

        assert message.name == "Test User"
        assert message.email == "test@example.com"
        assert message.subject == "Test Subject"
        assert message.message == "Test message content"
        assert message.created_at is None  # Not saved yet

    def test_contact_message_repr(self, db):
        """Test string representation"""
        message = ContactMessage(
            name="Test",
            email="test@example.com",
            subject="Test Subject",
            message="Test"
        )
        db.session.add(message)
        db.session.commit()

        assert str(message) == f'<ContactMessage {message.id}: Test Subject>'

    def test_contact_message_to_dict(self, db):
        """Test conversion to dictionary"""
        message = ContactMessage(
            name="Test User",
            email="test@example.com",
            subject="Test Subject",
            message="Test message"
        )
        db.session.add(message)
        db.session.commit()

        data = message.to_dict()
        assert data['name'] == "Test User"
        assert data['email'] == "test@example.com"
        assert data['subject'] == "Test Subject"
        assert data['message'] == "Test message"
        assert 'created_at' in data


class TestInboundEmail:
    """Tests for InboundEmail model"""

    def test_inbound_email_creation(self, db):
        """Test creating an inbound email"""
        email = InboundEmail(
            from_email="sender@example.com",
            to_email="recipient@example.com",
            subject="Test Email",
            text_content="Test content",
            html_content="<p>Test content</p>"
        )

        assert email.from_email == "sender@example.com"
        assert email.to_email == "recipient@example.com"
        assert email.subject == "Test Email"
        assert email.text_content == "Test content"
        assert email.html_content == "<p>Test content</p>"

    def test_inbound_email_repr(self, db):
        """Test string representation"""
        email = InboundEmail(
            from_email="sender@example.com",
            to_email="recipient@example.com",
            subject="Test Email",
            text_content="Test"
        )
        db.session.add(email)
        db.session.commit()

        assert str(email) == f'<InboundEmail {email.id}: Test Email>'

    def test_inbound_email_to_dict(self, db):
        """Test conversion to dictionary with text preview"""
        long_text = "A" * 250
        email = InboundEmail(
            from_email="sender@example.com",
            to_email="recipient@example.com",
            subject="Test Email",
            text_content=long_text
        )
        db.session.add(email)
        db.session.commit()

        data = email.to_dict()
        assert len(data['text_content']) == 200  # Should be truncated to preview
        assert data['subject'] == "Test Email"
