from flask import Flask, request, jsonify, render_template
import os
from datetime import datetime

app = Flask(__name__)

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

@app.route('/contact')
def contact():
    """Contact page"""
    return render_template('contact.html')

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
        
        # Log the received email
        print("\n" + "="*60)
        print("📧 NEW EMAIL RECEIVED")
        print("="*60)
        print(f"From: {from_email}")
        print(f"To: {to_email}")
        print(f"Subject: {subject}")
        print(f"Preview: {text_content[:200]}..." if text_content else "No text content")
        print("="*60 + "\n")
        
        # TODO: Add your AI SDR processing logic here later
        # For now, we just log it
        
        # Send success response to SendGrid
        return jsonify({
            "status": "success",
            "message": "Email received and logged",
            "from": from_email,
            "subject": subject
        }), 200
        
    except Exception as e:
        print(f"❌ Error processing email: {str(e)}")
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
        "sendgrid_webhook": "active"
    }), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port, debug=False)