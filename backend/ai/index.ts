import { interpretCampaignBrief } from "./campaignInterpreter";
import { buildJourneyFromSpec } from "./journeyBuilder";
import { generateMessages } from "./copyGenerator";
import { runQA } from "./qaEngine";
import {
  CampaignSpec,
  JourneyBlueprint,
  MultiLanguageMessages,
  QAReport,
  ChatResponse,
} from "./types";

// Core orchestrator
export const runCampaignAI = async (brief: string): Promise<ChatResponse> => {
  // Step 1: Interpret the campaign brief into a spec
  const spec: CampaignSpec = await interpretCampaignBrief(brief);

  // Step 2: Build the journey from the spec
  const journey: JourneyBlueprint = await buildJourneyFromSpec(spec);

  // Step 3: Generate messages for the journey
  const messages: MultiLanguageMessages = await generateMessages(spec, journey);

  // Step 4: Run QA checks
  const qa: QAReport = await runQA(spec, journey, messages);

  return {
    spec,
    journey,
    messages,
    qa,
  };
};

// Alias for the backend to call
export const handleChat = runCampaignAI;

