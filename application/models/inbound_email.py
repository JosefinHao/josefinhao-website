"""
Inbound Email Model
"""
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

# Database instance will be injected
db = None


def init_db(database):
    """Initialize database instance"""
    global db
    db = database


class InboundEmail(db.Model):
    """Model for storing emails received via SendGrid webhook"""
    __tablename__ = 'inbound_email'

    id = db.Column(db.Integer, primary_key=True)
    from_email = db.Column(db.String(200), nullable=False)
    to_email = db.Column(db.String(200), nullable=False)
    subject = db.Column(db.String(500), nullable=False)
    text_content = db.Column(db.Text)
    html_content = db.Column(db.Text)
    received_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f'<InboundEmail {self.id}: {self.subject}>'

    def to_dict(self):
        """Convert model to dictionary"""
        return {
            'id': self.id,
            'from_email': self.from_email,
            'to_email': self.to_email,
            'subject': self.subject,
            'text_content': self.text_content[:200] if self.text_content else None,  # Preview only
            'received_at': self.received_at.isoformat() if self.received_at else None
        }
