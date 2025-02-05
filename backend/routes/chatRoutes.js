import express from 'express';
import Anthropic from '@anthropic-ai/sdk';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({
        error: 'ANTHROPIC_API_KEY is not set in environment variables'
      });
    }

    const anthropic = new Anthropic({
      apiKey: apiKey
    });

    const { messages } = req.body;

    if (!messages || messages.length === 0) {
      return res.status(400).json({
        error: 'No messages were provided.'
      });
    }

    const response = await anthropic.messages.create({
      model: "claude-3-5-haiku-20241022", // Use a specific model name
      max_tokens: 1024,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      system: "You are a helpful shopping assistant for our e-commerce website. Help users find products, make purchase decisions, and answer questions about our services."
    });

    // Modify how you extract the response
    const responseText = response.content[0]?.text || 
      (response.content && response.content.length > 0 ? response.content[0] : 'No response');

    res.json({ 
      response: responseText 
    });

  } catch (error) {
    console.error('Full error details:', error);

    // More comprehensive error response
    res.status(500).json({
      error: 'Failed to get response from Claude',
      message: error.message,
      details: error.toString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

export default router;