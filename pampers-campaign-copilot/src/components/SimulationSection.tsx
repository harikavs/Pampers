import { Calendar, Globe, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getFriendlyCampaignName } from "@/lib/campaignNames";
import type { ChatResponse } from "@/lib/api";

interface SimulationSectionProps {
  spec: ChatResponse["spec"];
  journey: ChatResponse["journey"];
  messages: ChatResponse["messages"];
}

const getFriendlyChannelName = (channel: string): string => {
  const channelMap: { [key: string]: string } = {
    push: "Push Notification",
    email: "Email",
    inbox: "In-App Inbox",
    slide_up: "Slide Up",
  };
  return channelMap[channel] || channel;
};

export const SimulationSection = ({ spec, journey, messages }: SimulationSectionProps) => {
  // Safety checks
  if (!spec || !journey || !messages) {
    return null;
  }

  // Transform journey steps for display
  const journeySteps = (journey.steps || []).map(step => ({
    day: step.day,
    channels: [step.channel],
    description: `${step.channel} message: ${step.message_key}`,
  }));

  // Group steps by day
  const stepsByDay = journeySteps.reduce((acc, step) => {
    if (!acc[step.day]) {
      acc[step.day] = [];
    }
    acc[step.day].push(step);
    return acc;
  }, {} as Record<number, typeof journeySteps>);

  // Transform messages for display
  const localizedMessages: Array<{
    market: string;
    language: string;
    pushCopy: string;
    emailSubject: string;
  }> = [];

  try {
    Object.entries(messages || {}).forEach(([lang, langMessages]) => {
      if (!langMessages) return;
      
      // Find a market for this language (simplified mapping)
      const market = (spec.markets || []).find(m => 
        (m === "US" && lang === "en") || 
        (m === "DE" && lang === "de") || 
        (m === "ES" && lang === "es")
      ) || (spec.markets || [])[0] || "US";

      // Get first push and email message
      const firstPush = Object.values(langMessages).find(m => m?.title);
      const firstEmail = Object.values(langMessages).find(m => m?.subject);

      if (firstPush || firstEmail) {
        localizedMessages.push({
          market,
          language: lang.toUpperCase(),
          pushCopy: firstPush?.title || firstPush?.body || "N/A",
          emailSubject: firstEmail?.subject || "N/A",
        });
      }
    });
  } catch (err) {
    console.error("Error processing messages:", err);
  }

  // Get Braze AI features
  const brazeAIFeatures = Object.entries(spec.use_braze_ai)
    .filter(([_, enabled]) => enabled)
    .map(([key]) => {
      // Format key nicely
      return key
        .split("_")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    });

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Simulation</h2>
        <p className="text-sm text-muted-foreground">
          Preview the journey, localized messages, and AI optimizations before going live.
        </p>
      </div>

      {/* Campaign Summary */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">Campaign Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-background p-4 rounded-xl">
            <p className="text-xs text-muted-foreground mb-1">Type</p>
            <p className="text-sm font-medium text-foreground">{spec.campaign_type === "promotional" ? "Promotional" : "Non-Promotional"}</p>
          </div>
          <div className="bg-background p-4 rounded-xl">
            <p className="text-xs text-muted-foreground mb-1">Objective</p>
            <p className="text-sm font-medium text-foreground">{spec.promo ? `${spec.promo.currency} Rewards` : "Engagement"}</p>
          </div>
          <div className="bg-background p-4 rounded-xl">
            <p className="text-xs text-muted-foreground mb-1">Markets</p>
            <p className="text-sm font-medium text-foreground">{spec.markets.join(", ")}</p>
          </div>
          <div className="bg-background p-4 rounded-xl">
            <p className="text-xs text-muted-foreground mb-1">Duration</p>
            <p className="text-sm font-medium text-foreground">{spec.duration}</p>
          </div>
          <div className="bg-background p-4 rounded-xl">
            <p className="text-xs text-muted-foreground mb-1">Channels</p>
            <p className="text-sm font-medium text-foreground">{spec.channels.map(getFriendlyChannelName).join(", ")}</p>
          </div>
          <div className="bg-background p-4 rounded-xl">
            <p className="text-xs text-muted-foreground mb-1">Campaign Name</p>
            <p className="text-sm font-medium text-foreground">{getFriendlyCampaignName(spec.campaign_name)}</p>
          </div>
        </div>
      </div>

      {/* Journey Timeline */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">Journey Timeline</h3>
        <div className="space-y-4">
          {Object.entries(stepsByDay)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([day, steps], dayIndex, dayArray) => (
              <div key={day} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary-foreground" />
                  </div>
                  {dayIndex < dayArray.length - 1 && (
                    <div className="w-0.5 h-12 bg-border mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <p className="text-sm font-semibold text-foreground mb-1">
                    Day {day} – {steps.map(s => s.channels[0]).join(" + ")}
                  </p>
                  <p className="text-sm text-muted-foreground">{steps[0].description}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Localized Messages */}
      {localizedMessages.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">Localized Message Previews</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {localizedMessages.map((message, index) => (
              <div key={index} className="bg-background p-4 rounded-xl border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Globe className="w-4 h-4 text-primary" />
                  <p className="text-xs font-semibold text-foreground">
                    {message.market} – {message.language}
                  </p>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Push</p>
                    <p className="text-sm text-foreground">{message.pushCopy}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Email Subject</p>
                    <p className="text-sm text-foreground">{message.emailSubject}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Braze AI Features */}
      {brazeAIFeatures.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Braze AI Features</h3>
          <div className="flex flex-wrap gap-2">
            {brazeAIFeatures.map((feature, index) => (
              <Badge
                key={index}
                className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20"
              >
                <Zap className="w-3 h-3 mr-1" />
                {feature}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
