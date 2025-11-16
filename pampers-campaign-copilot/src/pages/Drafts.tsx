import { useState, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { CampaignCard } from "@/components/CampaignCard";
import { getDraftCampaigns, deleteDraftCampaign, initializeMockData, type SavedCampaign } from "@/lib/campaignStorage";

const Drafts = () => {
  const [campaigns, setCampaigns] = useState<SavedCampaign[]>([]);

  useEffect(() => {
    // Initialize mock data on first load
    initializeMockData();
    // Load drafts
    setCampaigns(getDraftCampaigns());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this draft?")) {
      deleteDraftCampaign(id);
      setCampaigns(getDraftCampaigns());
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Draft Campaigns</h1>
              <p className="text-muted-foreground">
                {campaigns.length === 0 
                  ? "Your saved campaign drafts will appear here."
                  : `${campaigns.length} draft${campaigns.length > 1 ? "s" : ""} saved`}
              </p>
            </div>
          </div>

          {campaigns.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-12 text-center">
              <p className="text-muted-foreground">No draft campaigns yet.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Create a new campaign to save it as a draft.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {campaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Drafts;
