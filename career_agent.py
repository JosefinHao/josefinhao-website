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
        """Concise system prompt for first-person responses as Josefin"""
        return """You are Josefin Hao, responding in first person about your background.

CURRENT FOCUS: Multi-agent systems for data analytics, causal inference, and predictive modeling. Building GPT-backed financial advisor app (React + Flask).

EDUCATION: MS Financial Mathematics, Uppsala University, Sweden (4.0 GPA). Top 30 European university.

EXPERIENCE:
• OKX (top crypto exchange) - Data Scientist US Lead (2022-2024): Led R&D for institutional clients, built segmentation models, automated reporting (95% efficiency gain), mentored analysts, trained global teams
• Handelsbanken Capital Markets - Quant Developer (2017-2019): Built interest rate derivative pricing models (C#, C), supported fixed income traders
• Independent Trading & Quant Research: Options trading strategies, backtesting

AI PROJECTS (10+):
OpenAI SDK: Career Agent, SDR Bot, Deep Research Agent
CrewAI: Debate, Financial Researcher, Stock Picker, Coder, Engineering Team, Trading Platform
LangGraph: Sidekick (autonomous assistant with web automation, Gradio interface)

SKILLS: Python, SQL, C#, R, JavaScript. Expert in statistical modeling, ML, blockchain, agentic AI, multi-agent frameworks.

LANGUAGES: Fluent English, Swedish, Chinese

CONTACT: josefin.rui.hao@gmail.com | Use contact form on website

Keep responses concise (2-4 sentences), friendly, professional. Emphasize multi-agent AI expertise. Don't make up info."""

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
                max_tokens=200,  # Optimized for speed
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

            # Keep history manageable (last 5 exchanges = 10 messages)
            if len(self.conversation_history) > 10:
                self.conversation_history = self.conversation_history[-10:]

            logger.info(f"Career Agent response generated for: {user_message[:50]}...")

            return assistant_message

        except Exception as e:
            logger.error(f"Error in Career Agent: {str(e)}", exc_info=True)
            return self._fallback_response(user_message)

    def chat_stream(self, user_message: str, reset_history: bool = False):
        """
        Process a user message and stream the AI-generated response.

        Args:
            user_message: The user's question or message
            reset_history: If True, clears conversation history

        Yields:
            Chunks of the AI-generated response as they arrive
        """
        if reset_history:
            self.conversation_history = []

        # If no API key, use fallback
        if not self.client:
            yield self._fallback_response(user_message)
            return

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

            # Call OpenAI API with streaming
            stream = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7,
                max_tokens=200,
                top_p=1,
                frequency_penalty=0,
                presence_penalty=0,
                stream=True  # Enable streaming
            )

            # Collect full response while streaming
            full_response = ""
            for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    content = chunk.choices[0].delta.content
                    full_response += content
                    yield content

            # Add complete response to history
            self.conversation_history.append({
                "role": "assistant",
                "content": full_response
            })

            # Keep history manageable
            if len(self.conversation_history) > 10:
                self.conversation_history = self.conversation_history[-10:]

            logger.info(f"Career Agent streamed response for: {user_message[:50]}...")

        except Exception as e:
            logger.error(f"Error in Career Agent streaming: {str(e)}", exc_info=True)
            yield self._fallback_response(user_message)

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
