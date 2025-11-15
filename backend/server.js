const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Chat endpoint
app.post("/api/chat", (req, res) => {
  const { message } = req.body;

  // Dummy response
  res.json({
    spec: { name: "example_campaign" },
    journey: { steps: [] },
    copy: { en: "dummy copy" },
    qa: { status: "ok" },
  });
});

app.post("/api/go-live", (req, res) => {
  const { spec, journey, copy } = req.body;

  console.log("Go-live called with:");
  console.log("spec:", spec);
  console.log("journey:", journey);
  console.log("copy:", copy);

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
