import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are the professional AI assistant of Veloria Hotel, a luxury hotel establishment. 

Your role is to help guests and potential customers with:
- Information about available rooms and their features
- Room pricing and capacity details
- Hotel services and amenities
- Booking procedures and policies
- Check-in and check-out times (Check-in: 2:00 PM, Check-out: 12:00 PM)
- Payment methods and cancellation policies
- General hotel information and facilities

Be professional, friendly, and concise in your responses. If you don't have specific information, politely suggest the guest contact the hotel directly or speak with the front desk.

Hotel Information:
- Luxury accommodation with premium rooms
- Fine dining restaurant
- Event halls for meetings and weddings
- 24/7 room service
- Spa and wellness center
- Free WiFi throughout the property
- Complimentary parking`;

export const chatWithAI = async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "AI service is not configured. Please contact support.",
      });
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...conversationHistory.slice(-10),
      { role: "user", content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 300,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0].message.content;

    res.json({
      success: true,
      response: aiResponse,
    });
  } catch (error) {
    console.error("AI chat error:", error);
    
    if (error.status === 401) {
      return res.status(500).json({
        success: false,
        message: "AI service authentication failed. Please contact support.",
      });
    }

    res.status(500).json({
      success: false,
      message: "AI service temporarily unavailable. Please try again later.",
    });
  }
};
