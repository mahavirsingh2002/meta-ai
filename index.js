const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const VERIFY_TOKEN = "veer123";
const PAGE_ACCESS_TOKEN = "EAASgsRSTstMBRAZCtqAjeJZBfAEvBXtRo3qRVchSFZBgaBGW0vdgFkXXU7S79b052nhuF95RRydBdKARbZCRa4YmFZCPjgjxRhtktkWP2PPSgplic3CCysdzXPBZBfaAiZBQdZADSPyUQoMdylRipUiScIHXyfWYddbZCowwY9P0AwyKHaW1uGmxj78exGnUzhjJpe4qUKQZDZD";
const GROQ_API_KEY = "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";

// ✅ Webhook verify
app.get("/webhook", (req, res) => {
  if (
    req.query["hub.mode"] === "subscribe" &&
    req.query["hub.verify_token"] === VERIFY_TOKEN
  ) {
    return res.send(req.query["hub.challenge"]);
  }
  res.sendStatus(403);
});

// 🤖 AI function (Groq)
async function getAIReply(message) {
  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "Tum ek smart sales assistant ho. Simple Hindi me baat karo, user ko guide karo aur convert karne ki koshish karo."
        },
        {
          role: "user",
          content: message
        }
      ]
    },
    {
      headers: {
  Authorization: `Bearer ${GROQ_API_KEY}`,
  "Content-Type": "application/json"
}
    }
  );

  return response.data.choices[0].message.content;
}

// 📩 Send message to user
async function sendMessage(senderId, text) {
  await axios.post(
    https://graph.facebook.com/v18.0/me/messages?access_token=${PAGE_ACCESS_TOKEN},
    {
      recipient: { id: senderId },
      message: { text }
    }
  );
}

// 📥 Receive message
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry[0];
    const event = entry.messaging?.[0];

    if (event && event.message) {
      const senderId = event.sender.id;
      const userMessage = event.message.text;

      const aiReply = await getAIReply(userMessage);
      await sendMessage(senderId, aiReply);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
