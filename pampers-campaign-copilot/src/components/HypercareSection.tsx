import { mockHypercare } from "@/lib/mockData";
import { RefreshCw, TrendingUp, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { HypercareResponse } from "@/lib/api";

interface HypercareSectionProps {
  onHypercare: () => void;
  loading: boolean;
  disabled?: boolean;
  hypercare?: HypercareResponse | null;
}

export const HypercareSection = ({ onHypercare, loading, disabled, hypercare }: HypercareSectionProps) => {
  const handleRefresh = async () => {
    if (disabled || loading) return;
    await onHypercare();
  };

  // Use real data if available, otherwise fall back to mock
  const displayData = hypercare || {
    stats: {
      sends: 0,
      opens: 0,
      clicks: 0,
      referrals: 0,
      optOuts: 0,
    },
    aiInsights: [],
  };

  // Transform stats to metrics format with proper rate calculations
  const openRate = displayData.stats.sends > 0
    ? Math.round((displayData.stats.opens / displayData.stats.sends) * 100)
    : 0;
  
  const clickRate = displayData.stats.opens > 0
    ? Math.round((displayData.stats.clicks / displayData.stats.opens) * 100)
    : null; // null means N/A (no opens to calculate from)
  
  const referralRate = displayData.stats.clicks > 0
    ? Math.round((displayData.stats.referrals / displayData.stats.clicks) * 100)
    : null;
  
  const optOutRate = displayData.stats.sends > 0
    ? ((displayData.stats.optOuts / displayData.stats.sends) * 100).toFixed(2)
    : "0.00";

  const metrics = [
    {
      label: "Sends",
      value: displayData.stats.sends.toLocaleString(),
      rate: null,
      description: "Total messages sent",
    },
    {
      label: "Opens",
      value: displayData.stats.opens.toLocaleString(),
      rate: openRate,
      description: `${openRate}% open rate`,
    },
    {
      label: "Clicks",
      value: displayData.stats.clicks.toLocaleString(),
      rate: clickRate,
      description: clickRate !== null ? `${clickRate}% click-through rate` : "No opens yet",
    },
    {
      label: "Referrals",
      value: displayData.stats.referrals.toLocaleString(),
      rate: referralRate,
      description: referralRate !== null ? `${referralRate}% conversion rate` : "No clicks yet",
    },
    {
      label: "Opt-outs",
      value: displayData.stats.optOuts.toLocaleString(),
      rate: parseFloat(optOutRate),
      description: `${optOutRate}% opt-out rate`,
    },
  ];

  const insights = displayData.aiInsights.length > 0 
    ? displayData.aiInsights 
    : mockHypercare.insights;

  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Hypercare & Performance</h2>
          <p className="text-sm text-muted-foreground">
            Real-time metrics and AI-powered insights for your live campaign.
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={disabled || loading}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Loading..." : "Hypercare"}
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {metrics.slice(0, 3).map((metric, index) => (
          <div key={index} className="bg-background p-5 rounded-xl border border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">{metric.label}</p>
              {metric.rate !== null && metric.rate > 0 && (
                <TrendingUp className="w-4 h-4 text-success" />
              )}
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">{metric.value}</p>
            <p className={`text-xs ${metric.rate !== null ? "text-muted-foreground" : "text-muted-foreground/60"}`}>
              {metric.description}
            </p>
          </div>
        ))}
      </div>

      {/* Additional Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {metrics.slice(3).map((metric, index) => (
          <div key={index} className="bg-background p-5 rounded-xl border border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground">{metric.label}</p>
              {metric.rate !== null && metric.rate > 0 && (
                <TrendingUp className="w-4 h-4 text-success" />
              )}
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">{metric.value}</p>
            <p className={`text-xs ${metric.rate !== null ? "text-muted-foreground" : "text-muted-foreground/60"}`}>
              {metric.description}
            </p>
          </div>
        ))}
      </div>

      {/* AI Insights */}
      {insights.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-pampers-yellow" />
            AI Insights
          </h3>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div key={index} className="bg-pampers-yellow/10 p-4 rounded-xl border border-pampers-yellow/20">
                <p className="text-sm text-foreground">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
