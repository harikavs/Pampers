import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessage, mockInitialMessages } from "@/lib/mockData";
import { getFriendlyCampaignName } from "@/lib/campaignNames";
import type { ChatResponse } from "@/lib/api";

interface ChatSectionProps {
  brief: string;
  setBrief: (brief: string) => void;
  onGenerate: () => void;
  loading: boolean;
  spec?: ChatResponse["spec"] | null;
  journey?: ChatResponse["journey"] | null;
  messages?: ChatResponse["messages"] | null;
  qa?: ChatResponse["qa"] | null;
  backendOnline?: boolean | null;
}

export const ChatSection = ({ brief, setBrief, onGenerate, loading, spec, journey, messages, qa, backendOnline }: ChatSectionProps) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockInitialMessages);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Helper function to generate natural response
  const generateNaturalResponse = (
    spec: ChatResponse["spec"],
    journey: ChatResponse["journey"],
    messages: ChatResponse["messages"],
    qa: ChatResponse["qa"]
  ): string => {
    // Get friendly campaign name with emoji
    const friendlyName = getFriendlyCampaignName(spec.campaign_name);
    
    // Extract emoji and name from friendly name
    const emojiMatch = friendlyName.match(/^(\S+)\s/);
    const emoji = emojiMatch ? emojiMatch[1] : "📢";
    const nameWithoutEmoji = friendlyName.replace(/^\S+\s/, "");

    // Count markets
    const marketCount = spec.markets.length;
    const marketText = marketCount === 1 
      ? "single-country" 
      : "multi-country";

    // Calculate journey duration from steps
    const maxDay = Math.max(...journey.steps.map(step => step.day || 0), 0);
    const durationText = maxDay <= 1 
      ? "single-step" 
      : maxDay <= 7 
      ? "7-day" 
      : maxDay <= 14 
      ? "14-day" 
      : maxDay <= 30 
      ? "30-day" 
      : `${maxDay}-day`;

    // Language text - always say "localized copy" for natural language
    const languageText = "localized copy";

    // Build natural response with emoji
    let response = `${emoji} Got it! I've generated your ${nameWithoutEmoji.toLowerCase()}`;
    
    response += ` with ${languageText}, a ${durationText} journey`;
    
    if (qa.passed) {
      response += ", and a QA report.";
    } else if (qa.warnings.length > 0 && qa.issues.length === 0) {
      response += ", and a QA report with some recommendations.";
    } else {
      response += ", and a QA report. Please review the issues before launching.";
    }

    return response;
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Update chat when API response comes in
  useEffect(() => {
    if (spec && journey && messages && qa) {
      setChatMessages(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage?.role === "copilot" && lastMessage.content === "Generating campaign...") {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            role: "copilot",
            content: generateNaturalResponse(spec, journey, messages, qa),
            timestamp: new Date(),
          };
          return newMessages;
        }
        return prev;
      });
    }
  }, [spec, journey, messages, qa]);

  const handleSend = () => {
    if (!brief.trim() || loading) return;

    const newUserMessage: ChatMessage = {
      role: "user",
      content: brief,
      timestamp: new Date(),
    };

    const copilotResponse: ChatMessage = {
      role: "copilot",
      content: "Generating campaign...",
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, newUserMessage, copilotResponse]);
    onGenerate();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Create your campaign</h2>
        <p className="text-sm text-muted-foreground">
          Describe the campaign you want. I'll design, simulate, QA and prep it for launch.
        </p>
      </div>

      <div 
        ref={chatContainerRef}
        className="h-80 overflow-y-auto mb-4 space-y-3 p-4 bg-background rounded-xl"
      >
        {chatMessages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                message.role === "user"
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={backendOnline === false ? "Backend offline - cannot generate campaign" : "Type your campaign brief..."}
          className="flex-1"
          disabled={loading || backendOnline === false}
        />
        <Button 
          onClick={handleSend} 
          size="icon" 
          className="bg-accent hover:bg-accent/90"
          disabled={loading || !brief.trim() || backendOnline === false}
          title={backendOnline === false ? "Backend server is offline" : "Send message"}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
      {loading && (
        <div className="mt-2 text-sm text-muted-foreground">Generating campaign...</div>
      )}
    </div>
  );
};
