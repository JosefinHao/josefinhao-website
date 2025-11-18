"""
Tests for Career Agent
"""
import pytest
from career_agent import CareerAgent, init_career_agent, get_career_agent


class TestCareerAgent:
    """Tests for CareerAgent class"""

    def test_init_without_api_key(self):
        """Test initialization without API key uses fallback"""
        agent = CareerAgent(api_key=None)
        assert agent.client is None
        assert agent.model == "gpt-4o-mini"

    def test_fallback_response_projects(self):
        """Test fallback response for project questions"""
        agent = CareerAgent(api_key=None)
        response = agent._fallback_response("What projects have you built?")

        assert "agent" in response.lower()
        assert "OpenAI" in response or "CrewAI" in response

    def test_fallback_response_experience(self):
        """Test fallback response for experience questions"""
        agent = CareerAgent(api_key=None)
        response = agent._fallback_response("What is your experience?")

        assert "OKX" in response or "Master" in response
        assert "Uppsala" in response or "Financial Mathematics" in response

    def test_fallback_response_skills(self):
        """Test fallback response for skills questions"""
        agent = CareerAgent(api_key=None)
        response = agent._fallback_response("What skills do you have?")

        assert "Python" in response
        assert "SQL" in response or "machine learning" in response.lower()

    def test_fallback_response_contact(self):
        """Test fallback response for contact questions"""
        agent = CareerAgent(api_key=None)
        response = agent._fallback_response("How can I contact you?")

        assert "josefin.rui.hao@gmail.com" in response
        assert "contact form" in response.lower()

    def test_fallback_response_default(self):
        """Test fallback response for unknown questions"""
        agent = CareerAgent(api_key=None)
        response = agent._fallback_response("What is the weather?")

        assert "background" in response.lower() or "project" in response.lower()

    def test_reset_conversation(self):
        """Test conversation history reset"""
        agent = CareerAgent(api_key=None)
        agent.conversation_history = [{"role": "user", "content": "test"}]

        agent.reset_conversation()
        assert len(agent.conversation_history) == 0

    def test_system_prompt_includes_key_info(self):
        """Test system prompt contains essential information"""
        agent = CareerAgent(api_key=None)
        prompt = agent.system_prompt

        # Check key information is included
        assert "OKX" in prompt
        assert "Uppsala University" in prompt
        assert "Financial Mathematics" in prompt
        assert "Python" in prompt
        assert "first person" in prompt.lower()


class TestCareerAgentModule:
    """Tests for module-level functions"""

    def test_init_career_agent(self):
        """Test global agent initialization"""
        agent = init_career_agent(api_key=None)
        assert isinstance(agent, CareerAgent)

    def test_get_career_agent(self):
        """Test getting global agent"""
        init_career_agent(api_key=None)
        agent = get_career_agent()
        assert isinstance(agent, CareerAgent)

    def test_get_career_agent_without_init_raises_error(self):
        """Test getting agent without initialization raises error"""
        import career_agent
        career_agent.career_agent = None

        with pytest.raises(RuntimeError, match="not initialized"):
            get_career_agent()

        # Cleanup
        init_career_agent(api_key=None)
