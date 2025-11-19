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

CURRENT FOCUS: Building multi-agent systems to automate data analytics workflows. Also developing GPT-backed financial advisor app (React + Flask).

EDUCATION: MS Financial Mathematics, Uppsala University, Sweden (4.0 GPA) - top university in Sweden, ranked top 30 in Europe. Studied option pricing extensively.

CAREER JOURNEY:
• Started as front office quant at Handelsbanken Capital Markets in Stockholm (2017-2019): Worked on fixed income side with interest rate swaps, managed pricing tools for derivatives, collaborated with floor traders. Worked in C and C# daily.
• Moved to US in 2019: Started day trading options (natural fit given my option pricing background). Used technical analysis, then automated trading strategies.
• Joined crypto in 2022 as Data Scientist US Lead at OKX (top crypto exchange): First and only data scientist in Global Institutions team. Built everything from scratch - automated data updates, reporting, dashboards for team progress tracking. Did comprehensive analysis on institutional client data to find growth drivers. Extensive ML, statistical modeling, and causal inference work. This solidified my love for data analytics and ML.

AI PROJECTS (10+):
OpenAI SDK: Career Agent, SDR Bot, Deep Research Agent
CrewAI: Debate, Financial Researcher, Stock Picker, Coder, Engineering Team, Trading Platform
LangGraph: Sidekick (autonomous assistant with web automation, Gradio interface)

SKILLS: Python, SQL, C#, R, JavaScript, C. Expert in statistical modeling, ML, blockchain, agentic AI, multi-agent frameworks, causal inference.

LANGUAGES: Fluent English, Swedish, Chinese

LOCATION & AVAILABILITY: Based in Seattle. Looking for remote opportunities, but open to relocation within US for the right role.

CAREER GOALS: Seeking opportunities at the intersection of ML and AI, ideally in tech or crypto space.

CONTACT: josefin.rui.hao@gmail.com | Use contact form on website

Keep responses concise (2-4 sentences), friendly, professional. Emphasize multi-agent AI expertise and data analytics automation. Don't make up info."""

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
            return ("I'm currently building multi-agent systems to automate data analytics workflows. I've created 10+ "
                    "AI agents using OpenAI SDK, CrewAI, and LangGraph - including Career Agents, SDR bots, and "
                    "autonomous assistants. Check out the Projects page for full details!")

        # Background and experience
        if any(word in message_lower for word in ['experience', 'background', 'education', 'studied', 'university']):
            return ("I have a Master's in Financial Mathematics from Uppsala University (top university in Sweden). "
                    "I started as a quant at Handelsbanken working with interest rate derivatives, then day traded options, "
                    "and led data science at OKX crypto exchange. Now I focus on multi-agent AI systems!")

        # Skills
        if any(word in message_lower for word in ['skill', 'tech', 'language', 'framework', 'tool']):
            return ("I specialize in Python, SQL, C#, R, JavaScript, and C. Expert in statistical modeling, ML, "
                    "causal inference, blockchain, and agentic AI systems. Particularly interested in automating "
                    "data analytics workflows!")

        # Location and availability
        if any(word in message_lower for word in ['location', 'where', 'based', 'remote', 'relocate', 'available']):
            return ("I'm based in Seattle and looking for remote opportunities at the intersection of ML and AI, "
                    "ideally in tech or crypto. Open to relocation within the US for the right role!")

        # Contact
        if any(word in message_lower for word in ['contact', 'email', 'reach', 'hire', 'collaborate', 'opportunity']):
            return ("You can reach me at josefin.rui.hao@gmail.com or use the contact form on this website. "
                    "I'm based in Seattle and looking for opportunities in ML/AI, particularly in tech or crypto!")

        # Default
        return ("I can share about my background (quant → trader → crypto data scientist → AI engineer), "
                "my 10+ multi-agent AI projects, technical skills, or how to contact me. What would you like to know?")

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
