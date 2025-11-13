from flask import Flask, request, jsonify, render_template, flash, redirect, url_for
from flask_wtf import FlaskForm
from flask_sqlalchemy import SQLAlchemy
from wtforms import StringField, TextAreaField, SubmitField
from wtforms.validators import DataRequired, Email, Length
import os
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///josefinhao.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
db = SQLAlchemy(app)

# ============================================
# DATABASE MODELS
# ============================================

class ContactMessage(db.Model):
    """Model for storing contact form submissions"""
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    subject = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<ContactMessage {self.id}: {self.subject}>'

class InboundEmail(db.Model):
    """Model for storing emails received via SendGrid webhook"""
    id = db.Column(db.Integer, primary_key=True)
    from_email = db.Column(db.String(200), nullable=False)
    to_email = db.Column(db.String(200), nullable=False)
    subject = db.Column(db.String(500), nullable=False)
    text_content = db.Column(db.Text)
    html_content = db.Column(db.Text)
    received_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<InboundEmail {self.id}: {self.subject}>'

# ============================================
# FORMS
# ============================================

class ContactForm(FlaskForm):
    """Contact form for website visitors"""
    name = StringField('Name', validators=[
        DataRequired(message='Please enter your name'),
        Length(min=2, max=100, message='Name must be between 2 and 100 characters')
    ])
    email = StringField('Email', validators=[
        DataRequired(message='Please enter your email'),
        Email(message='Please enter a valid email address')
    ])
    subject = StringField('Subject', validators=[
        DataRequired(message='Please enter a subject'),
        Length(min=3, max=200, message='Subject must be between 3 and 200 characters')
    ])
    message = TextAreaField('Message', validators=[
        DataRequired(message='Please enter a message'),
        Length(min=10, message='Message must be at least 10 characters')
    ])
    submit = SubmitField('Send Message')

# ============================================
# MAIN WEBSITE ROUTES
# ============================================

@app.route('/')
def home():
    """Main homepage"""
    return render_template('index.html')

@app.route('/about')
def about():
    """About page"""
    return render_template('about.html')

@app.route('/projects')
def projects():
    """Projects page"""
    return render_template('projects.html')

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    """Contact page with form"""
    form = ContactForm()

    if form.validate_on_submit():
        # Save the contact message to database
        message = ContactMessage(
            name=form.name.data,
            email=form.email.data,
            subject=form.subject.data,
            message=form.message.data
        )
        db.session.add(message)
        db.session.commit()

        logger.info(f"New contact message from {form.email.data}: {form.subject.data}")

        flash('Thank you for your message! I\'ll get back to you soon.', 'success')
        return redirect(url_for('contact'))

    return render_template('contact.html', form=form)

# ============================================
# ADMIN DASHBOARD
# ============================================

@app.route('/admin/dashboard')
def admin_dashboard():
    """Admin dashboard to view received emails and contact messages"""
    # Get all inbound emails, ordered by most recent first
    inbound_emails = InboundEmail.query.order_by(InboundEmail.received_at.desc()).all()

    # Get all contact messages, ordered by most recent first
    contact_messages = ContactMessage.query.order_by(ContactMessage.created_at.desc()).all()

    return render_template('admin_dashboard.html',
                          inbound_emails=inbound_emails,
                          contact_messages=contact_messages)

# ============================================
# SENDGRID WEBHOOK ENDPOINT
# ============================================

@app.route('/webhook/sendgrid', methods=['POST'])
def handle_sendgrid_webhook():
    """
    Receives incoming emails from SendGrid Inbound Parse
    This is for the reply.josefinhao.com subdomain
    """
    try:
        # Get the email data from SendGrid
        email_data = request.form.to_dict()

        # Extract key information
        from_email = email_data.get('from', 'Unknown')
        to_email = email_data.get('to', 'Unknown')
        subject = email_data.get('subject', 'No Subject')
        text_content = email_data.get('text', '')
        html_content = email_data.get('html', '')

        # Save email to database
        inbound_email = InboundEmail(
            from_email=from_email,
            to_email=to_email,
            subject=subject,
            text_content=text_content,
            html_content=html_content
        )
        db.session.add(inbound_email)
        db.session.commit()

        # Log the received email
        logger.info("="*60)
        logger.info("📧 NEW EMAIL RECEIVED")
        logger.info("="*60)
        logger.info(f"From: {from_email}")
        logger.info(f"To: {to_email}")
        logger.info(f"Subject: {subject}")
        logger.info(f"Preview: {text_content[:200]}..." if text_content else "No text content")
        logger.info(f"Saved to database with ID: {inbound_email.id}")
        logger.info("="*60)

        # Send success response to SendGrid
        return jsonify({
            "status": "success",
            "message": "Email received and saved",
            "email_id": inbound_email.id,
            "from": from_email,
            "subject": subject
        }), 200

    except Exception as e:
        logger.error(f"❌ Error processing email: {str(e)}", exc_info=True)
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

# ============================================
# HEALTH CHECK & API ENDPOINTS
# ============================================

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }), 200

@app.route('/api/status', methods=['GET'])
def api_status():
    """API status endpoint"""
    return jsonify({
        "website": "josefinhao.com",
        "status": "operational",
        "sendgrid_webhook": "active",
        "database": "connected"
    }), 200

# ============================================
# DATABASE INITIALIZATION
# ============================================

def init_db():
    """Initialize the database"""
    with app.app_context():
        db.create_all()
        logger.info("Database initialized successfully")

if __name__ == '__main__':
    # Initialize database
    init_db()

    # Run the app
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port, debug=False)
