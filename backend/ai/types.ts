export interface CampaignSpec {
  campaign_name: string;
  campaign_type: 'promotional' | 'non-promotional';
  markets: string[];
  languages: string[];
  duration: string;
  targeting: {
    days_since_app_opened?: string;
    referrals_count?: string;
  };
  promo?: {
    reward_per_referral: number;
    max_reward: number;
    currency: string;
  };
  channels: string[];
  reentry_criteria_days: number;
  exit_criteria: string[];
  use_braze_ai: {
    [key: string]: boolean;
  };
}

export interface ChannelMessage {
    title?: string;         // for push/inbox/slide_up
    body: string;           // main text
    subject?: string;       // for email subject
    link_target?: string;   // e.g. "RAF_LANDING_PAGE"
  }
  
  export interface JourneyStep {
    id: string;             // e.g. "day1_push"
    day: number;            // 1, 14, 30
    channel: 'push' | 'inbox' | 'slide_up' | 'email';
    conditions?: string[];  // e.g. ["referrals < 5", "push_opt_in"]
    expiry_days?: number;   // e.g. 15
    message_key: string;    // e.g. "raf_day1_push"
  }
  
  export interface JourneyBlueprint {
    name: string;           // e.g. "RAF_US_DE_journey"
    steps: JourneyStep[];
  }
  
  export interface MultiLanguageMessages {
    // lang → message_key → ChannelMessage
    [lang: string]: {
      [messageKey: string]: ChannelMessage;
    };
  }
  
  export interface QAItem {
    type: 'error' | 'warning';
    message: string;
  }
  
  export interface QAReport {
    passed: boolean;
    issues: QAItem[];
    warnings: QAItem[];
  }

  export interface ChatResponse {
    spec: CampaignSpec;
    journey: JourneyBlueprint;
    messages: MultiLanguageMessages;
    qa: QAReport;
  }
  
  
