import { Calendar, Globe, Zap, CheckCircle2, AlertTriangle, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getFriendlyCampaignName, getFriendlyCampaignType } from "@/lib/campaignNames";
import type { SavedCampaign } from "@/lib/campaignStorage";

interface CampaignCardProps {
  campaign: SavedCampaign;
  onDelete?: (id: string) => void;
}

export const CampaignCard = ({ campaign, onDelete }: CampaignCardProps) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusBadge = () => {
    if (campaign.status === "active") {
      return (
        <Badge className="bg-success/10 text-success border-success/20">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Active
        </Badge>
      );
    }
    return (
      <Badge className="bg-muted text-muted-foreground">
        <FileText className="w-3 h-3 mr-1" />
        Draft
      </Badge>
    );
  };

  const getQABadge = () => {
    if (campaign.qa.passed && campaign.qa.warnings.length === 0) {
      return (
        <Badge className="bg-success/10 text-success border-success/20">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          QA Passed
        </Badge>
      );
    } else if (campaign.qa.issues.length > 0) {
      return (
        <Badge className="bg-destructive/10 text-destructive border-destructive/20">
          <AlertTriangle className="w-3 h-3 mr-1" />
          {campaign.qa.issues.length} Issue{campaign.qa.issues.length > 1 ? "s" : ""}
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-warning/10 text-warning border-warning/20">
          <AlertTriangle className="w-3 h-3 mr-1" />
          {campaign.qa.warnings.length} Warning{campaign.qa.warnings.length > 1 ? "s" : ""}
        </Badge>
      );
    }
  };

  const getFriendlyChannelName = (channel: string): string => {
    const channelMap: { [key: string]: string } = {
      push: "Push Notification",
      email: "Email",
      inbox: "In-App Inbox",
      slide_up: "Slide Up",
    };
    return channelMap[channel] || channel;
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3 className="text-lg font-semibold text-foreground">
              {getFriendlyCampaignName(campaign.spec.campaign_name)}
            </h3>
            {getStatusBadge()}
            {getQABadge()}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {campaign.brief}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Globe className="w-4 h-4" />
          <span>{campaign.spec.markets.length} market{campaign.spec.markets.length > 1 ? "s" : ""}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Zap className="w-4 h-4" />
          <span>{campaign.journey.steps.length} step{campaign.journey.steps.length > 1 ? "s" : ""}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(campaign.createdAt)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium">{getFriendlyCampaignType(campaign.spec.campaign_type)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="flex flex-wrap gap-1">
          {campaign.spec.channels.map((channel) => (
            <Badge key={channel} variant="outline" className="text-xs">
              {getFriendlyChannelName(channel)}
            </Badge>
          ))}
        </div>
      </div>

      {campaign.status === "active" && campaign.goLiveResult && (
        <div className="mb-4 p-3 bg-success/5 border border-success/20 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Braze Campaign ID</p>
          <p className="text-sm font-mono text-foreground">{campaign.goLiveResult.brazeCampaignId}</p>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/", { state: { campaignId: campaign.id } })}
          className="flex-1"
        >
          View Details
        </Button>
        {campaign.status === "draft" && onDelete && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(campaign.id)}
            className="text-destructive hover:text-destructive"
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};

