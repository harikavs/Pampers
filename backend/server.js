const express = require("express");
const cors = require("cors");

// Enable importing TypeScript files at runtime
require("ts-node").register({ transpileOnly: true });

// Import Girl 1's AI orchestrator
const { handleChat } = require("./ai/index"); // from ai/index.ts

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Chat endpoint – now uses real AI
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "message is required" });
    }

    // Call Girl 1's TypeScript AI function
    const result = await handleChat(message);
    // result should be: { spec, journey, messages, qa }
    res.json(result);
  } catch (err) {
    console.error("Error in /api/chat:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/go-live", (req, res) => {
  // Expect the same shape the frontend gets from /api/chat
  const { spec, journey, messages, qa } = req.body;

  console.log("Go-live called with:");
  console.log("spec:", spec);
  console.log("journey:", journey);
  console.log("messages:", messages);
  console.log("qa:", qa);

  // Here you could call Braze API if you want.
  res.json({
    status: "ok",
    brazeCampaignId: "mock_campaign_001",
    message: "Campaign created (mock).",
  });
});

app.get("/api/hypercare/:campaignId", (req, res) => {
  const { campaignId } = req.params;

  const stats = {
    sends: 4200,
    opens: 1450,
    clicks: 350,
    referrals: 78,
    optOuts: 5,
  };

  const aiInsights = [
    "Variant B is performing ~22% better on clicks than Variant A.",
    "DE audience is smaller; consider broadening eligibility.",
    "Day 30 email underperforms; try a shorter, more urgent version.",
  ];

  res.json({
    campaignId,
    stats,
    aiInsights,
  });
});

// Start server only if this file is run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

// Export app for testing
module.exports = app;
