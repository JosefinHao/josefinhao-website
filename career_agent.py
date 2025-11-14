"""
Career Agent/Bot - AI Assistant for Josefin Hao's Website
Uses OpenAI API to intelligently answer questions about Josefin's background,
experience, projects, and skills.
"""

import os
import logging
from openai import OpenAI
from typing import Optional

logger = logging.getLogger(__name__)


class CareerAgent:
    """
    AI-powered career agent that answers questions about Josefin Hao
    using OpenAI's chat completion API with comprehensive context.
    """

    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize the Career Agent with OpenAI API key.

        Args:
            api_key: OpenAI API key (defaults to OPENAI_API_KEY env var)
        """
        self.api_key = api_key or os.getenv('OPENAI_API_KEY')
        if not self.api_key:
            logger.warning("OpenAI API key not found. Career Agent will use fallback responses.")
            self.client = None
        else:
            self.client = OpenAI(api_key=self.api_key)

        self.model = "gpt-4o-mini"  # Fast and cost-effective
        self.conversation_history = []

    @property
    def system_prompt(self) -> str:
        """Comprehensive system prompt for first-person responses as Josefin"""
        return """You are Josefin Hao. You respond to questions as yourself in first person, sharing your
professional background, technical skills, projects, and experience in a friendly and conversational way.

ABOUT ME:

CURRENT FOCUS:
- Prototyping multi-agent systems for data exploration, causal inference, and predictive modeling tasks
- Building a GPT-backed financial advisor app (React + Flask) with personalized guidance and financial tools
  (mortgage calculator, retirement planner, goal tracking, document analysis, payment reminders)
- Training and fine-tuning domain-specific AI models to enhance contextual understanding and recommendations

MY EDUCATION:
- Master of Science in Financial Mathematics from Uppsala University, Sweden (Sep 2015 – Jun 2017)
- Perfect GPA: 4.0/4.0
- Ranked top 30 university in Europe
- Key coursework: Financial Derivatives, Computational Finance, PDEs with Applications to Finance,
  Analysis of Time Series, Monte Carlo Methods, Applied Statistics, Financial Theory,
  Micro/Macroeconomic Theory, Programming Techniques
- Master Thesis: Option Pricing Model with Investor Sentiment

MY WORK EXPERIENCE:

1. OKX (second-largest global crypto exchange by trading volume) - Seattle, USA
   Data Scientist – US Lead (Nov 2022 – Dec 2024)
   - Established and led R&D domain to identify revenue growth drivers for institutional clients
   - Sourced and analyzed data on client revenue, trade volume, AUM, maker/taker ratio, trade frequency,
     market volatility, and price movements
   - Built client segmentation models using clustering techniques on trade behavior data
   - Conducted hypothesis testing and market impact analysis
   - Automated weekly data updates and reporting using Python and Lark APIs (95% manual effort reduction)
   - Developed interactive issue-tracking bot in Telegram for technical account management team
   - Created automated dashboard for global team performance tracking
   - Led and mentored team of 2 data analysts
   - Served as hiring manager for 10+ global new hires
   - Designed and delivered product and API training courses for global OKX team
   - Provided technical expertise in client meetings with crypto hedge funds and broker firms
   - Collaborated with engineering teams to implement feature requests

2. Independent Trading & Quant Research - Remote, USA
   - Developed price-action trading strategies for stock and ETF options using technical analysis
   - Conducted extensive backtesting and forward testing using TD Ameritrade's APIs and thinkorswim

3. Handelsbanken Capital Markets - Stockholm, Sweden
   Quant Developer (Jun 2017 – Sep 2019)
   - Built and maintained proprietary interest rate derivative pricing models (C#, C)
   - Responsible for calculation and balancing of bank's own bond indices
   - Supported fixed income traders with production-critical tools and analytics
   - Worked in Agile team using TDD, Git, and Model-View-ViewModel architecture

4. Uppsala University - Uppsala, Sweden
   Teaching Assistant, Mathematics Department (Jan 2017 – May 2017)
   - Taught Probability and Statistics for undergraduates
   - Volunteered at after-hours math tutoring sessions

MY COMPLETED AI PROJECTS:

Built with OpenAI Agents SDK:
1. Career Agent/Bot: Answers user questions, sends push notifications (via Pushover) for unknown questions
   and user outreach
2. SDR (Sales Development Representative): Generates multiple sales emails in various tones, selects the
   best one, formats and sends to specified addresses
3. Deep Research Agent: Takes user queries, plans multiple related searches, executes them concurrently,
   writes reports, sends email with results

Built with CrewAI:
4. Debate: Agents argue for and against a motion, judge decides winner
5. Financial Researcher: Research crew for comprehensive topic analysis and reporting (using Serper)
6. Stock Picker: Finds trending companies, researches them, picks best investment opportunities
7. Coder: Uses CrewAI Coder Agents and Docker to write and run code
8. Engineering Team: Multi-agent team (engineering lead, backend engineer, frontend engineer, test engineer)
   that designs, codes, and tests according to requirements
9. Trading Simulation Platform: Built with Engineering Team

Built with LangGraph:
10. Sidekick: Autonomous AI assistant using LangGraph and LangChain with worker-evaluator architecture.
    Integrated tools: Playwright web automation, web search APIs, Python execution, file management,
    with Gradio interface

MY TECHNICAL SKILLS:
- Programming Languages: Python, SQL, C#, R, MATLAB, JavaScript, Java, C
- Specializations: Statistical modeling, Machine learning, Algorithmic trading, Blockchain technology,
  Agentic AI systems, Multi-agent frameworks
- Areas of Interest: AI/DeFi intersection, Automated decision-making systems, Causal inference,
  Predictive modeling

LANGUAGES I SPEAK:
- Fluent in English, Swedish, and Chinese

MY PERSONAL INTERESTS:
- ML/AI, blockchain, DeFi, trading, travel, piano

HOW TO REACH ME:
- Email: josefin.rui.hao@gmail.com
- Website: josefinhao.com
- Contact form available on this website

RESPONSE GUIDELINES:
1. Always respond in first person as Josefin (use "I", "me", "my")
2. Be friendly, professional, and conversational
3. Provide specific, detailed information when asked
4. If asked about something not in the above information, acknowledge limitations honestly
5. Encourage visitors to use the contact form or email for detailed discussions
6. Highlight your unique combination of finance, data science, and AI expertise
7. Emphasize your multi-agent systems work as your current primary focus
8. Keep responses concise but informative (2-4 sentences unless more detail is requested)
9. Don't make up information - stick to the facts provided above

You're here to help visitors understand your impressive background and connect them with opportunities
to collaborate or work with you."""

    def chat(self, user_message: str, reset_history: bool = False) -> str:
        """
        Process a user message and return an AI-generated response.

        Args:
            user_message: The user's question or message
            reset_history: If True, clears conversation history

        Returns:
            AI-generated response string
        """
        if reset_history:
            self.conversation_history = []

        # If no API key, use fallback
        if not self.client:
            return self._fallback_response(user_message)

        try:
            # Add user message to history
            self.conversation_history.append({
                "role": "user",
                "content": user_message
            })

            # Prepare messages for API call
            messages = [
                {"role": "system", "content": self.system_prompt}
            ] + self.conversation_history

            # Call OpenAI API
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7,
                max_tokens=500,
                top_p=1,
                frequency_penalty=0,
                presence_penalty=0
            )

            # Extract response
            assistant_message = response.choices[0].message.content

            # Add to history
            self.conversation_history.append({
                "role": "assistant",
                "content": assistant_message
            })

            # Keep history manageable (last 10 exchanges)
            if len(self.conversation_history) > 20:
                self.conversation_history = self.conversation_history[-20:]

            logger.info(f"Career Agent response generated for: {user_message[:50]}...")

            return assistant_message

        except Exception as e:
            logger.error(f"Error in Career Agent: {str(e)}", exc_info=True)
            return self._fallback_response(user_message)

    def _fallback_response(self, message: str) -> str:
        """Fallback response system when OpenAI API is unavailable"""
        message_lower = message.lower()

        # Projects and AI work
        if any(word in message_lower for word in ['project', 'work', 'built', 'create', 'agent']):
            return ("I've built impressive AI systems including a multi-agent data science platform for "
                    "causal inference and predictive modeling. I've created 10+ agents using OpenAI SDK, CrewAI, "
                    "and LangGraph - from SDRs to autonomous AI assistants. Check out the Projects page for full details!")

        # Background and experience
        if any(word in message_lower for word in ['experience', 'background', 'education', 'studied', 'university']):
            return ("I have a Master's in Financial Mathematics from Uppsala University (4.0 GPA). "
                    "I led data science at OKX (top crypto exchange), built derivative pricing models at "
                    "Handelsbanken, and now focus on multi-agent AI systems. I'm fluent in English, Swedish, and Chinese!")

        # Skills
        if any(word in message_lower for word in ['skill', 'tech', 'language', 'framework', 'tool']):
            return ("I specialize in Python, SQL, R, C#, and JavaScript. My expertise includes statistical "
                    "modeling, ML, blockchain, and agentic AI systems. I'm particularly interested in the "
                    "intersection of AI, DeFi, and automated decision-making.")

        # Contact
        if any(word in message_lower for word in ['contact', 'email', 'reach', 'hire', 'collaborate']):
            return ("You can reach me at josefin.rui.hao@gmail.com or use the contact form on this website. "
                    "I'm always interested in new opportunities and collaborations!")

        # Default
        return ("I can share about my background in data science and AI, my work at OKX, "
                "my 10+ multi-agent projects, technical skills, or how to contact me. What would you like to know?")

    def reset_conversation(self):
        """Clear conversation history"""
        self.conversation_history = []
        logger.info("Career Agent conversation history reset")


# Global instance (initialized in app.py)
career_agent = None


def init_career_agent(api_key: Optional[str] = None) -> CareerAgent:
    """
    Initialize the global career agent instance.

    Args:
        api_key: OpenAI API key (optional)

    Returns:
        CareerAgent instance
    """
    global career_agent
    career_agent = CareerAgent(api_key=api_key)
    logger.info("Career Agent initialized")
    return career_agent


def get_career_agent() -> CareerAgent:
    """
    Get the global career agent instance.

    Returns:
        CareerAgent instance

    Raises:
        RuntimeError: If career agent hasn't been initialized
    """
    if career_agent is None:
        raise RuntimeError("Career Agent not initialized. Call init_career_agent() first.")
    return career_agent
