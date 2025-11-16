import { CampaignSpec, JourneyBlueprint, MultiLanguageMessages, QAReport, QAItem } from "./types";

export const runQA = async (
  spec: CampaignSpec,
  journey: JourneyBlueprint,
  messages: MultiLanguageMessages
): Promise<QAReport> => {
  const issues: QAItem[] = [];
  const warnings: QAItem[] = [];

  // Check if this is a RAF campaign (only by name, not by type)
  const isRAF = spec.campaign_name.startsWith("RAF_");

  // Promo checks (promotional campaigns only)
  if (spec.campaign_type === "promotional") {
    if (!spec.promo) {
      issues.push({
        type: "error",
        message: "Promotional campaign is missing promo details (reward_per_referral, max_reward, currency).",
      });
    } else {
      if (spec.promo.max_reward === undefined || spec.promo.max_reward <= 0) {
        issues.push({
          type: "error",
          message: "Promotional campaign must define a positive max_reward (reward cap).",
        });
      }
    }
  }

  // Targeting checks
  if (!spec.targeting.days_since_app_opened) {
    warnings.push({
      type: "warning",
      message: "Targeting is missing days_since_app_opened; campaign may be too broad.",
    });
  }

  if (isRAF && !spec.targeting.referrals_count) {
    warnings.push({
      type: "warning",
      message: "RAF campaign should include a referrals_count condition in targeting.",
    });
  }

  // Journey completeness checks
  if (journey.steps.length === 0) {
    issues.push({
      type: "error",
      message: "Journey has no steps defined.",
    });
  }

  // Check messages for each step
  for (const step of journey.steps) {
    // Check English copy (required)
    if (!messages.en || !messages.en[step.message_key]) {
      issues.push({
        type: "error",
        message: `Missing English copy for message key: ${step.message_key}.`,
      });
    }

    // Check German copy if German is in spec.languages
    if (spec.languages.includes("de")) {
      if (!messages.de || !messages.de[step.message_key]) {
        warnings.push({
          type: "warning",
          message: `Missing German copy for message key: ${step.message_key}.`,
        });
      }
    }
  }

  // Channel coverage checks
  if (spec.channels.includes("email")) {
    const hasEmailStep = journey.steps.some((step) => step.channel === "email");
    if (!hasEmailStep) {
      warnings.push({
        type: "warning",
        message: "Email is listed as a channel but not used in the journey.",
      });
    }
  }

  // Final pass flag
  const passed = issues.length === 0;

  return {
    passed,
    issues,
    warnings,
  };
};

