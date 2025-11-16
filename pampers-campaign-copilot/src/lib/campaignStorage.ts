import type { ChatResponse, GoLiveResponse } from "./api";

export interface SavedCampaign {
  id: string;
  brief: string;
  spec: ChatResponse["spec"];
  journey: ChatResponse["journey"];
  messages: ChatResponse["messages"];
  qa: ChatResponse["qa"];
  createdAt: string;
  status: "draft" | "active";
  goLiveResult?: GoLiveResponse;
}

const STORAGE_KEYS = {
  DRAFTS: "pampers_campaign_drafts",
  ACTIVE: "pampers_campaign_active",
};

// Get all draft campaigns
export const getDraftCampaigns = (): SavedCampaign[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.DRAFTS);
  return data ? JSON.parse(data) : [];
};

// Get all active campaigns
export const getActiveCampaigns = (): SavedCampaign[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.ACTIVE);
  return data ? JSON.parse(data) : [];
};

// Save a draft campaign
export const saveDraftCampaign = (
  brief: string,
  response: ChatResponse
): SavedCampaign => {
  const campaigns = getDraftCampaigns();
  const newCampaign: SavedCampaign = {
    id: `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    brief,
    spec: response.spec,
    journey: response.journey,
    messages: response.messages,
    qa: response.qa,
    createdAt: new Date().toISOString(),
    status: "draft",
  };
  
  campaigns.push(newCampaign);
  localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(campaigns));
  return newCampaign;
};

// Move campaign from draft to active
export const activateCampaign = (
  campaignId: string,
  goLiveResult: GoLiveResponse
): SavedCampaign | null => {
  const drafts = getDraftCampaigns();
  const campaignIndex = drafts.findIndex((c) => c.id === campaignId);
  
  if (campaignIndex === -1) return null;
  
  const campaign = drafts[campaignIndex];
  campaign.status = "active";
  campaign.goLiveResult = goLiveResult;
  
  // Remove from drafts
  drafts.splice(campaignIndex, 1);
  localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(drafts));
  
  // Add to active
  const active = getActiveCampaigns();
  active.push(campaign);
  localStorage.setItem(STORAGE_KEYS.ACTIVE, JSON.stringify(active));
  
  return campaign;
};

// Delete a draft campaign
export const deleteDraftCampaign = (campaignId: string): boolean => {
  const drafts = getDraftCampaigns();
  const filtered = drafts.filter((c) => c.id !== campaignId);
  localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(filtered));
  return filtered.length < drafts.length;
};

// Initialize with mock data if storage is empty
export const initializeMockData = () => {
  if (typeof window === "undefined") return;
  
  const drafts = getDraftCampaigns();
  const active = getActiveCampaigns();
  
  // Only initialize if both are empty
  if (drafts.length === 0 && active.length === 0) {
    const mockDrafts: SavedCampaign[] = [
      {
        id: "draft_mock_1",
        brief: "Create a welcome campaign for US with push notifications",
        spec: {
          campaign_name: "WELCOME_US",
          campaign_type: "non-promotional",
          markets: ["US"],
          languages: ["en"],
          duration: "one_time",
          targeting: {},
          channels: ["push"],
          reentry_criteria_days: 0,
          exit_criteria: ["one_message_sent"],
          use_braze_ai: { intelligent_timing: true },
        },
        journey: {
          name: "WELCOME_US_journey",
          steps: [
            {
              id: "day1_push",
              day: 1,
              channel: "push",
              conditions: [],
              message_key: "generic_day1_push",
            },
          ],
        },
        messages: {
          en: {
            generic_day1_push: {
              title: "Welcome to Pampers Club",
              body: "Thanks for joining! Stay tuned for updates and special offers.",
            },
          },
        },
        qa: {
          passed: true,
          issues: [],
          warnings: [],
        },
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: "draft",
      },
      {
        id: "draft_mock_2",
        brief: "Create a summer promotional campaign for DE and ES with Push + Email",
        spec: {
          campaign_name: "SUMMER_DE_ES",
          campaign_type: "promotional",
          markets: ["DE", "ES"],
          languages: ["de", "es"],
          duration: "limited",
          targeting: {
            days_since_app_opened: ">0",
          },
          promo: {
            reward_per_referral: 1,
            max_reward: 10,
            currency: "Pampers Cash",
          },
          channels: ["push", "email"],
          reentry_criteria_days: 0,
          exit_criteria: ["one_message_sent"],
          use_braze_ai: {
            intelligent_timing: true,
            channel_optimization: true,
            variant_optimization: true,
          },
        },
        journey: {
          name: "SUMMER_DE_ES_journey",
          steps: [
            {
              id: "day1_push",
              day: 1,
              channel: "push",
              conditions: [],
              message_key: "generic_day1_push",
            },
          ],
        },
        messages: {
          de: {
            generic_day1_push: {
              title: "Pampers Club",
              body: "Willkommen bei Pampers Club!",
            },
          },
          es: {
            generic_day1_push: {
              title: "Pampers Club",
              body: "¡Bienvenido a Pampers Club!",
            },
          },
        },
        qa: {
          passed: true,
          issues: [],
          warnings: [],
        },
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: "draft",
      },
    ];
    
    const mockActive: SavedCampaign[] = [
      {
        id: "active_mock_1",
        brief: "Create a Refer-a-Friend campaign for US and DE with Push + Email + Inbox",
        spec: {
          campaign_name: "RAF_US_DE",
          campaign_type: "promotional",
          markets: ["US", "DE"],
          languages: ["en", "de"],
          duration: "always_on",
          targeting: {
            days_since_app_opened: ">30",
            referrals_count: "<5",
          },
          promo: {
            reward_per_referral: 2,
            max_reward: 10,
            currency: "Pampers Cash",
          },
          channels: ["push", "inbox", "slide_up", "email"],
          reentry_criteria_days: 90,
          exit_criteria: ["5_referrals", "30_days_inactive"],
          use_braze_ai: {
            intelligent_timing: true,
            channel_optimization: true,
            variant_optimization: true,
          },
        },
        journey: {
          name: "RAF_US_DE_journey",
          steps: [
            {
              id: "day1_push",
              day: 1,
              channel: "push",
              conditions: ["referrals < 5", "push_opt_in"],
              expiry_days: 15,
              message_key: "raf_day1_push",
            },
            {
              id: "day1_inbox",
              day: 1,
              channel: "inbox",
              conditions: ["referrals < 5", "push_opt_out"],
              expiry_days: 15,
              message_key: "raf_day1_inbox",
            },
          ],
        },
        messages: {
          en: {
            raf_day1_push: {
              title: "Invite a friend, earn Pampers Cash",
              body: "Share your love for Pampers Club. When a friend joins and scans their first pack, you both earn rewards.",
            },
            raf_day1_inbox: {
              title: "Start earning with referrals",
              body: "Invite friends to join Pampers Club and earn Pampers Cash together. Every referral counts!",
            },
          },
          de: {
            raf_day1_push: {
              title: "Freund:in einladen, Pampers Cash sichern",
              body: "Empfiehl Pampers Club. Wenn eine Freund:in beitritt und zum ersten Mal scannt, erhaltet ihr beide eine Belohnung.",
            },
            raf_day1_inbox: {
              title: "Mit Empfehlungen verdienen",
              body: "Lade Freund:innen ein, Pampers Club beizutreten und verdiene gemeinsam Pampers Cash. Jede Empfehlung zählt!",
            },
          },
        },
        qa: {
          passed: true,
          issues: [],
          warnings: [],
        },
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: "active",
        goLiveResult: {
          brazeCampaignId: "braze_raf_001",
          brazeRaw: {},
          message: "Campaign launched successfully",
        },
      },
      {
        id: "active_mock_2",
        brief: "Create a Christmas campaign for US, DE, ES, FR with Push + Email and festive rewards",
        spec: {
          campaign_name: "XMAS_US_DE_ES_FR",
          campaign_type: "promotional",
          markets: ["US", "DE", "ES", "FR"],
          languages: ["en", "de", "es", "fr"],
          duration: "limited",
          targeting: {
            days_since_app_opened: ">0",
          },
          promo: {
            reward_per_referral: 2,
            max_reward: 10,
            currency: "Pampers Cash",
          },
          channels: ["push", "email"],
          reentry_criteria_days: 0,
          exit_criteria: ["one_message_sent"],
          use_braze_ai: {
            intelligent_timing: true,
            channel_optimization: true,
            variant_optimization: true,
          },
        },
        journey: {
          name: "XMAS_US_DE_ES_FR_journey",
          steps: [
            {
              id: "day1_push",
              day: 1,
              channel: "push",
              conditions: [],
              message_key: "generic_day1_push",
            },
          ],
        },
        messages: {
          en: {
            generic_day1_push: {
              title: "Merry Christmas with Pampers Cash",
              body: "Celebrate Christmas with rewards from Pampers Club!",
            },
          },
          de: {
            generic_day1_push: {
              title: "Frohe Weihnachten mit Pampers Cash",
              body: "Feiere Weihnachten mit Belohnungen von Pampers Club!",
            },
          },
          es: {
            generic_day1_push: {
              title: "¡Feliz Navidad con Pampers Cash!",
              body: "¡Celebra Navidad con recompensas de Pampers Club!",
            },
          },
          fr: {
            generic_day1_push: {
              title: "Joyeux Noël avec Pampers Cash",
              body: "Célébrez Noël avec des récompenses de Pampers Club !",
            },
          },
        },
        qa: {
          passed: true,
          issues: [],
          warnings: [],
        },
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        status: "active",
        goLiveResult: {
          brazeCampaignId: "braze_xmas_001",
          brazeRaw: {},
          message: "Campaign launched successfully",
        },
      },
    ];
    
    localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(mockDrafts));
    localStorage.setItem(STORAGE_KEYS.ACTIVE, JSON.stringify(mockActive));
  }
};

