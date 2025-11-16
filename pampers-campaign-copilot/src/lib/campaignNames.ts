/**
 * Converts technical campaign names to user-friendly display names with emojis
 */

export const getFriendlyCampaignName = (campaignName: string): string => {
  // Extract theme and markets from campaign name
  const parts = campaignName.split("_");
  const theme = parts[0];
  const markets = parts.slice(1);

  // Map themes to friendly names and emojis
  const themeMap: { [key: string]: { name: string; emoji: string } } = {
    XMAS: { name: "Christmas", emoji: "🎄" },
    NEW_YEAR: { name: "New Year's", emoji: "🎉" },
    RAF: { name: "Refer-a-Friend", emoji: "👥" },
    WELCOME: { name: "Welcome", emoji: "👋" },
    BIRTHDAY: { name: "Birthday", emoji: "🎂" },
    EASTER: { name: "Easter", emoji: "🐰" },
    VALENTINE: { name: "Valentine's Day", emoji: "💝" },
    SUMMER: { name: "Summer", emoji: "☀️" },
    WINTER: { name: "Winter", emoji: "❄️" },
    Generic: { name: "Campaign", emoji: "📢" },
  };

  // Get theme info or default
  const themeInfo = themeMap[theme] || { name: theme, emoji: "📢" };

  // Format markets
  const marketNames: { [key: string]: string } = {
    US: "United States",
    DE: "Germany",
    ES: "Spain",
    FR: "France",
    UK: "United Kingdom",
  };

  const friendlyMarkets = markets
    .map((m) => marketNames[m] || m)
    .join(", ");

  // Build friendly name
  if (markets.length > 0) {
    return `${themeInfo.emoji} ${themeInfo.name} - ${friendlyMarkets}`;
  }
  return `${themeInfo.emoji} ${themeInfo.name} Campaign`;
};

/**
 * Gets a friendly description for the campaign type
 */
export const getFriendlyCampaignType = (
  campaignType: "promotional" | "non-promotional"
): string => {
  return campaignType === "promotional" ? "Promotional" : "Informational";
};

/**
 * Gets a friendly description for the campaign duration
 */
export const getFriendlyDuration = (duration: string): string => {
  const durationMap: { [key: string]: string } = {
    always_on: "Always On",
    limited: "Limited Time",
    one_time: "One-Time",
  };
  return durationMap[duration] || duration;
};

