# josefinhao.com

Personal portfolio website for Josefin Hao - Data Scientist specializing in Agentic AI and Multi-Agent Systems.

## Overview

A modern, interactive portfolio website built with Flask, featuring an AI-powered chat widget, interactive games, a virtual Cat Cafe experience, SendGrid email integration, and a single-page application (SPA) routing system for smooth navigation.

## Features

### Pages
- **Home**: Featured projects carousel showcasing AI/ML projects including Multi-Agent Data Analytics, Financial Advisor, Autonomous AI Assistant, and more
- **About**: Professional background, skills, and experience
- **Projects**: Detailed portfolio of AI, machine learning, and software engineering projects
- **Games**: Interactive mini-games for developers and CS enthusiasts
- **Cat Cafe**: Virtual cat cafe with interactive games to play with and feed a virtual cat
- **Contact**: Contact form with database persistence and email notifications

### Games Page
Five interactive developer-focused mini-games:
- **⚡ Typing Speed Challenge**: Type code snippets as fast and accurately as possible
- **🔮 Guess the Output**: Predict the output of Python or SQL code with configurable difficulty
- **⏳ Big O Challenge**: Identify time and space complexity of algorithms
- **🧠 Neural Network Playground**: Train a neural network with configurable hyperparameters and visualize decision boundaries
- **⛏️ Blockchain Mining Simulator**: Experience proof-of-work mining with visual blockchain display

### Cat Cafe Page
An interactive virtual cat cafe experience with three mini-games:
- **🐾 Cat Wand Game**: Click the wand before it disappears to earn points
- **🧶 Yarn Ball Bounce**: Click falling yarn balls to bat them away and keep them from reaching the bottom
- **🎵 Meow Melody**: Memory game where you watch and repeat patterns

Feed the virtual cat with earned points and watch it grow!

### Interactive Features
- **AI Chat Widget**: Powered by OpenAI Career Agent - intelligent conversational interface to learn about Josefin's background, skills, and projects with streaming responses
- **SPA Router**: Smooth client-side navigation without full page reloads
- **Theme Switcher**: Dark/light mode toggle with CSS variables
- **Particle Network**: Interactive animated background effects
- **Floating Formulas**: Math and code animations for visual appeal

### Backend Features
- **Contact Form**:
  - Form validation with Flask-WTF
  - SQLite database persistence
  - Email notifications via SendGrid
- **SendGrid Webhook Integration**:
  - Inbound email parsing for reply.josefinhao.com
  - Email storage in database
- **Admin Dashboard**: View all contact messages and inbound emails
- **Health Check Endpoints**: API status monitoring
- **Debug Endpoints**: Database status inspection
- **User IP Endpoint**: Returns user IP for client-side storage separation

## Tech Stack

### Backend
- **Flask 3.0.0**: Python web framework
- **SQLAlchemy**: ORM and database management
- **Gunicorn 21.2.0**: Production WSGI server
- **Flask-WTF 1.2.1**: Form handling and validation
- **OpenAI API 1.54.3**: Powers the AI chat widget with streaming support
- **SendGrid 6.11.0**: Email delivery and inbound parsing
- **Werkzeug 3.0.1**: WSGI utility library

### Frontend
- **Vanilla JavaScript**: SPA router, games, interactive features
- **Jinja2**: Server-side templating
- **CSS3**: Modern styling with animations, gradients, and glassmorphism effects
- **KaTeX**: Beautiful mathematical formula rendering

### Database
- **SQLite**: Lightweight database for development and production
  - `ContactMessage`: Stores contact form submissions
  - `InboundEmail`: Stores emails received via SendGrid webhook

### Testing
- **pytest 7.4.3**: Testing framework
- **pytest-flask 1.3.0**: Flask-specific testing utilities

## Project Structure

```
josefinhao-website/
├── app.py                      # Main Flask application
├── career_agent.py             # OpenAI-powered career agent
├── requirements.txt            # Python dependencies
├── templates/                  # Jinja2 templates
│   ├── base.html              # Base template with navigation
│   ├── index.html             # Homepage
│   ├── about.html             # About page
│   ├── projects.html          # Projects page
│   ├── games.html             # Games page with 5 mini-games
│   ├── cat-cafe.html          # Cat Cafe interactive experience
│   ├── contact.html           # Contact form
│   ├── admin_dashboard.html   # Admin dashboard
│   ├── _spa_wrapper.html      # SPA wrapper template
│   └── _content_only.html     # Content-only template for SPA
├── static/
│   ├── css/
│   │   └── style.css          # Main stylesheet
│   ├── js/
│   │   ├── spa-router.js      # Client-side routing
│   │   ├── chat-widget.js     # AI chat interface
│   │   ├── carousel.js        # Project carousel
│   │   ├── theme-switcher.js  # Dark/light mode
│   │   ├── particle-network.js
│   │   ├── floating-formulas.js
│   │   ├── game-modals.js     # Game modal management
│   │   ├── utils.js           # Shared utilities
│   │   ├── typing-game.js
│   │   ├── guess-output-game.js
│   │   ├── bigo-game.js
│   │   ├── neural-network-game.js
│   │   ├── blockchain-game.js
│   │   └── cat-cafe-game.js   # Cat Cafe game logic
│   └── images/                # Game assets and images
│       ├── cat.png
│       ├── cat_cafe.png
│       ├── cat_no_background.png
│       ├── cat_paw_no_background.png
│       ├── cat_teaser_wand.svg
│       ├── music.png
│       ├── profile_photo.PNG
│       └── yarn_ball_*.png    # Various colored yarn balls
└── josefinhao.db              # SQLite database (auto-created)
```

## Setup

### Prerequisites
- Python 3.8+
- pip

### Installation

1. Clone the repository:
```bash
git clone https://github.com/JosefinHao/josefinhao-website.git
cd josefinhao-website
```

2. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables (create `.env` file):
```bash
SECRET_KEY=your-secret-key-here
OPENAI_API_KEY=your-openai-api-key
SENDGRID_API_KEY=your-sendgrid-api-key  # Optional
```

5. Run the application:
```bash
# Development
flask run

# Production
gunicorn app:app
```

The website will be available at `http://localhost:5000`

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SECRET_KEY` | Yes | Flask secret key for sessions and CSRF protection |
| `OPENAI_API_KEY` | Yes | OpenAI API key for AI chat widget |
| `SENDGRID_API_KEY` | No | SendGrid API key for email notifications |
| `PORT` | No | Server port (default: 10000) |

## API Endpoints

### Public Endpoints
- `GET /` - Homepage
- `GET /about` - About page
- `GET /projects` - Projects page
- `GET /games` - Games page
- `GET /cat-cafe` - Cat Cafe page
- `GET /contact` - Contact page
- `POST /contact` - Submit contact form
- `POST /api/chat` - AI chat endpoint (streaming)
- `GET /api/user-ip` - Get user IP address

### Webhook Endpoints
- `POST /webhook/sendgrid` - SendGrid inbound email webhook

### Admin Endpoints
- `GET /admin/dashboard` - View all messages and emails

### Health & Debug
- `GET /health` - Health check
- `GET /api/status` - API status
- `GET /debug/db-status` - Database status (debug)

## SendGrid Configuration

### Inbound Parse Setup
1. Configure SendGrid Inbound Parse for `reply.josefinhao.com`
2. Point webhook to: `https://josefinhao.com/webhook/sendgrid`
3. Incoming emails will be automatically stored in the database

### Contact Form Notifications
- Requires `SENDGRID_API_KEY` environment variable
- Notifications sent to `josefin.rui.hao@gmail.com`
- From address: `notifications@josefinhao.com`

## Deployment

### Render.com (Current Deployment)
The site is deployed on Render with:
- **Web Service**: Python 3.13
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn app:app`
- **Environment Variables**: Set in Render dashboard
- **Database**: SQLite (persistent disk storage)

### Other Platforms
Can be deployed to any platform supporting Python/Flask:
- Heroku
- Railway
- Google Cloud Run
- AWS Elastic Beanstalk
- DigitalOcean App Platform

## Development

### Running Tests
```bash
pytest
```

### Database Management
The database is automatically created on first run. To reset:
```bash
rm josefinhao.db
flask run  # Will recreate database
```

### Adding New Games
1. Create JavaScript file in `static/js/`
2. Add game HTML structure to `templates/games.html`
3. Include script in template's `extra_js` block
4. Add CSS styling in `static/css/style.css`

## Features in Detail

### AI Chat Widget
- Powered by OpenAI's GPT models with streaming support
- Custom career agent with knowledge of Josefin's background
- Conversational interface for visitors
- Smooth animations and typing indicators
- Server-Sent Events (SSE) for real-time streaming

### SPA Router
- Client-side navigation without page reloads
- Browser history management
- Smooth transitions between pages
- Maintains state across navigation
- Handles both standard and SPA requests

### Cat Cafe Experience
- Interactive virtual cat that grows when fed
- Three unique mini-games to earn points
- Persistent state using localStorage with user IP separation
- Beautiful animations and sound effects
- Leaderboard system for competitive play

### Developer Mini-Games
Educational and fun games demonstrating various CS concepts:
- Algorithm complexity analysis
- Neural network visualization and training
- Blockchain proof-of-work mining
- Code comprehension and typing speed
- All games include leaderboards with localStorage persistence

## License

This is a personal portfolio website. All rights reserved.

## Contact

- **Website**: [josefinhao.com](https://josefinhao.com)
- **Email**: josefin.rui.hao@gmail.com
- **GitHub**: [JosefinHao](https://github.com/JosefinHao)

---

Built with Flask, OpenAI, and creativity.
