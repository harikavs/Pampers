
import { CampaignSpec } from './types';

export const interpretCampaignBrief = async (brief: string): Promise<CampaignSpec> => {
  const lowerBrief = brief.toLowerCase();
  
  // Extract markets from brief - handle formats like "US, DE and ES" or "US and ES"
  const marketKeywords: { [key: string]: string[] } = {
    'US': ['us', 'united states', 'usa', 'u.s.', 'u.s.a.'],
    'DE': ['de', 'germany', 'german'],
    'ES': ['es', 'spain', 'spanish'],
    'FR': ['fr', 'france', 'french'],
    'UK': ['uk', 'united kingdom', 'britain', 'british'],
  };
  
  const markets: string[] = [];
  const languages: string[] = [];
  
  // First, try to find market codes directly (US, DE, ES, etc.)
  const marketCodes = Object.keys(marketKeywords);
  for (const code of marketCodes) {
    // Match standalone codes (with word boundaries) or in lists like "US, DE"
    const regex = new RegExp(`\\b${code}\\b`, 'i');
    if (regex.test(brief)) {
      if (!markets.includes(code)) {
        markets.push(code);
        // Map markets to languages
        if (code === 'US' || code === 'UK') languages.push('en');
        if (code === 'DE') languages.push('de');
        if (code === 'ES') languages.push('es');
        if (code === 'FR') languages.push('fr');
      }
    }
  }
  
  // If no codes found, try keyword matching
  if (markets.length === 0) {
    Object.entries(marketKeywords).forEach(([market, keywords]) => {
      if (keywords.some(keyword => lowerBrief.includes(keyword))) {
        if (!markets.includes(market)) {
          markets.push(market);
          // Map markets to languages
          if (market === 'US' || market === 'UK') languages.push('en');
          if (market === 'DE') languages.push('de');
          if (market === 'ES') languages.push('es');
          if (market === 'FR') languages.push('fr');
        }
      }
    });
  }
  
  // Default to US if no markets found
  if (markets.length === 0) {
    markets.push('US');
    languages.push('en');
  }
  
  // Extract channels - handle variations like "Push + Email" or "push and email"
  const channels: string[] = [];
  if (lowerBrief.includes('push') || lowerBrief.includes('notification')) {
    if (!channels.includes('push')) channels.push('push');
  }
  if (lowerBrief.includes('email') || lowerBrief.includes('e-mail')) {
    if (!channels.includes('email')) channels.push('email');
  }
  if (lowerBrief.includes('inbox') || lowerBrief.includes('in-app')) {
    if (!channels.includes('inbox')) channels.push('inbox');
  }
  if (lowerBrief.includes('slide') || lowerBrief.includes('slideup') || lowerBrief.includes('slide-up')) {
    if (!channels.includes('slide_up')) channels.push('slide_up');
  }
  
  // Default to push if no channels specified
  if (channels.length === 0) {
    channels.push('push');
  }
  
  // Check if promotional (has rewards, cash, promo, etc.)
  const isPromotional = lowerBrief.includes('refer') || 
                       lowerBrief.includes('reward') || 
                       lowerBrief.includes('cash') || 
                       lowerBrief.includes('promo') ||
                       lowerBrief.includes('festive');
  
  // Extract campaign theme/name - handle variations
  let campaignName = 'Generic';
  if (lowerBrief.includes('christmas') || lowerBrief.includes('xmas') || lowerBrief.includes('holiday')) {
    campaignName = 'XMAS';
  } else if (lowerBrief.includes('new year') || lowerBrief.includes('newyear') || lowerBrief.includes('new year\'s')) {
    campaignName = 'NEW_YEAR';
  } else if (lowerBrief.includes('refer') || lowerBrief.includes('referral') || lowerBrief.includes('refer-a-friend')) {
    campaignName = 'RAF';
  } else if (lowerBrief.includes('welcome') || lowerBrief.includes('onboarding')) {
    campaignName = 'WELCOME';
  } else if (lowerBrief.includes('birthday') || lowerBrief.includes('birth day')) {
    campaignName = 'BIRTHDAY';
  } else if (lowerBrief.includes('easter')) {
    campaignName = 'EASTER';
  } else if (lowerBrief.includes('valentine') || lowerBrief.includes('valentines')) {
    campaignName = 'VALENTINE';
  } else if (lowerBrief.includes('summer')) {
    campaignName = 'SUMMER';
  } else if (lowerBrief.includes('winter')) {
    campaignName = 'WINTER';
  }
  
  // Build campaign name
  const campaignNameFull = `${campaignName}_${markets.join('_')}`;
  
  // Check if brief includes 'refer' (case-insensitive) - RAF campaign
  if (lowerBrief.includes('refer')) {
    // Return RAF always-on campaign spec
    return {
      campaign_name: 'RAF_US_DE',
      campaign_type: 'promotional',
      markets: ['US', 'DE'],
      languages: ['en', 'de'],
      duration: 'always_on',
      targeting: {
        days_since_app_opened: '>30',
        referrals_count: '<5',
      },
      promo: {
        reward_per_referral: 2,
        max_reward: 10,
        currency: 'Pampers Cash',
      },
      channels: ['push', 'inbox', 'slide_up', 'email'],
      reentry_criteria_days: 90,
      exit_criteria: ['5_referrals', '30_days_inactive'],
      use_braze_ai: {
        intelligent_timing: true,
        channel_optimization: true,
        variant_optimization: true,
      },
    };
  }
  
  // Promotional campaign with rewards
  if (isPromotional) {
    return {
      campaign_name: campaignNameFull,
      campaign_type: 'promotional',
      markets: markets,
      languages: languages,
      duration: lowerBrief.includes('always') || lowerBrief.includes('ongoing') ? 'always_on' : 'limited',
      targeting: {
        days_since_app_opened: lowerBrief.includes('inactive') ? '>30' : '>0',
      },
      promo: {
        reward_per_referral: lowerBrief.includes('cash') ? 2 : 1,
        max_reward: 10,
        currency: 'Pampers Cash',
      },
      channels: channels,
      reentry_criteria_days: 0,
      exit_criteria: ['one_message_sent'],
      use_braze_ai: {
        intelligent_timing: true,
        channel_optimization: channels.length > 1,
        variant_optimization: true,
      },
    };
  }

  // Default simple non-promotional campaign
  return {
    campaign_name: campaignNameFull,
    campaign_type: 'non-promotional',
    markets: markets,
    languages: languages,
    duration: 'one_time',
    targeting: {},
    channels: channels,
    reentry_criteria_days: 0,
    exit_criteria: ['one_message_sent'],
    use_braze_ai: {
      intelligent_timing: true,
    },
  };
};

