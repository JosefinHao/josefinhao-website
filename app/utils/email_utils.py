"""
Email utility functions
"""
import logging

logger = logging.getLogger(__name__)

# Optional SendGrid import
try:
    from sendgrid import SendGridAPIClient
    from sendgrid.helpers.mail import Mail, Email as SGEmail, To, Content
    SENDGRID_AVAILABLE = True
except ImportError:
    logger.warning("SendGrid module not installed. Email notifications will be disabled.")
    SENDGRID_AVAILABLE = False


def send_contact_notification(app, name, email, subject, message):
    """
    Send email notification when someone submits the contact form

    Args:
        app: Flask application instance (for config access)
        name: Name of the person who sent the message
        email: Email of the person who sent the message
        subject: Subject of the message
        message: The message content

    Returns:
        bool: True if email was sent successfully, False otherwise
    """
    if not SENDGRID_AVAILABLE:
        logger.warning("SendGrid module not available. Skipping email notification.")
        return False

    if not app.config.get('SENDGRID_API_KEY'):
        logger.warning("SendGrid API key not configured. Skipping email notification.")
        return False

    try:
        email_body = _build_notification_email(name, email, subject, message)

        mail = Mail(
            from_email=SGEmail('notifications@josefinhao.com', 'Josefin Hao Website'),
            to_emails=To(app.config['NOTIFICATION_EMAIL']),
            subject=f'New Contact Form Message: {subject}',
            html_content=Content('text/html', email_body)
        )

        sg = SendGridAPIClient(app.config['SENDGRID_API_KEY'])
        response = sg.send(mail)

        logger.info(f"Contact notification email sent successfully. Status code: {response.status_code}")
        return True

    except Exception as e:
        logger.error(f"Failed to send contact notification email: {str(e)}", exc_info=True)
        return False


def _build_notification_email(name, email, subject, message):
    """Build HTML email body for contact notification"""
    return f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #5e35b1; border-bottom: 2px solid #f48fb1; padding-bottom: 10px;">
                    New Contact Form Submission
                </h2>

                <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p style="margin: 10px 0;"><strong>From:</strong> {name}</p>
                    <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:{email}">{email}</a></p>
                    <p style="margin: 10px 0;"><strong>Subject:</strong> {subject}</p>
                </div>

                <div style="background: white; padding: 20px; border-left: 4px solid #f48fb1; margin: 20px 0;">
                    <h3 style="color: #5e35b1; margin-top: 0;">Message:</h3>
                    <p style="white-space: pre-wrap;">{message}</p>
                </div>

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #666; font-size: 0.9em;">
                    <p>This notification was sent from your website contact form at josefinhao.com</p>
                </div>
            </div>
        </body>
    </html>
    """
