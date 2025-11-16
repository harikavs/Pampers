import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { CampaignCard } from "@/components/CampaignCard";
import { getActiveCampaigns, initializeMockData, type SavedCampaign } from "@/lib/campaignStorage";

const ActiveCampaigns = () => {
  const [campaigns, setCampaigns] = useState<SavedCampaign[]>([]);

  useEffect(() => {
    // Initialize mock data on first load
    initializeMockData();
    // Load active campaigns
    setCampaigns(getActiveCampaigns());
    
    // Refresh every 5 seconds to catch new activations
    const interval = setInterval(() => {
      setCampaigns(getActiveCampaigns());
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Active Campaigns</h1>
              <p className="text-muted-foreground">
                {campaigns.length === 0 
                  ? "Your live campaigns will appear here."
                  : `${campaigns.length} active campaign${campaigns.length > 1 ? "s" : ""} running`}
              </p>
            </div>
          </div>

          {campaigns.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-12 text-center">
              <p className="text-muted-foreground">No active campaigns yet.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Launch a campaign from the "New Campaign" page to see it here.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {campaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ActiveCampaigns;
