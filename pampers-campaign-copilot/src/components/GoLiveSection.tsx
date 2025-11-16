import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getFriendlyCampaignName } from "@/lib/campaignNames";
import type { ChatResponse } from "@/lib/api";

interface GoLiveSectionProps {
  onGoLive: () => void;
  loading: boolean;
  disabled?: boolean;
  spec?: ChatResponse["spec"] | null;
  qa?: ChatResponse["qa"] | null;
}

export const GoLiveSection = ({ onGoLive, loading, disabled, spec, qa }: GoLiveSectionProps) => {
  const { toast } = useToast();

  const handleLaunch = async () => {
    if (disabled || loading) return;
    
    try {
      await onGoLive();
      toast({
        title: "Campaign Launched Successfully! 🚀",
        description: "Your campaign is now live and running across all markets.",
        className: "bg-success text-white",
      });
    } catch (err) {
      toast({
        title: "Launch Failed",
        description: err instanceof Error ? err.message : "Failed to launch campaign",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Launch Campaign</h2>
        <p className="text-sm text-muted-foreground">
          Review the final details and launch your campaign to all markets.
        </p>
      </div>

      {spec && (
        <div className="bg-background p-5 rounded-xl mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Campaign Name</p>
              <p className="text-sm font-medium text-foreground">{getFriendlyCampaignName(spec.campaign_name)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Markets</p>
              <p className="text-sm font-medium text-foreground">{spec.markets.join(", ")}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Duration</p>
              <p className="text-sm font-medium text-foreground">{spec.duration}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Channels</p>
              <p className="text-sm font-medium text-foreground">{spec.channels.join(", ")}</p>
            </div>
          </div>
        </div>
      )}

      {qa && !qa.passed && qa.issues.length > 0 && (
        <div className="bg-warning/10 border border-warning/20 rounded-xl p-4 mb-6">
          <p className="text-sm font-semibold text-warning mb-1">⚠️ QA Issues Detected</p>
          <p className="text-xs text-muted-foreground">
            There are {qa.issues.length} error(s) that must be fixed before launching.
          </p>
        </div>
      )}

      <Button
        onClick={handleLaunch}
        disabled={disabled || loading}
        size="lg"
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
        title={qa && !qa.passed && qa.issues.length > 0 ? "Fix QA errors before launching" : "Launch campaign"}
      >
        <Rocket className="w-5 h-5 mr-2" />
        {loading ? "Launching..." : "🚀 Launch Campaign"}
      </Button>
    </div>
  );
};
