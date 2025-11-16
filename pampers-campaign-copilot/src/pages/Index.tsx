import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { chatWithCopilot, goLive, fetchHypercare, checkBackendHealth } from "@/lib/api";
import { Sidebar } from "@/components/Sidebar";
import { ChatSection } from "@/components/ChatSection";
import { SimulationSection } from "@/components/SimulationSection";
import { QASection } from "@/components/QASection";
import { GoLiveSection } from "@/components/GoLiveSection";
import { HypercareSection } from "@/components/HypercareSection";
import { saveDraftCampaign, activateCampaign } from "@/lib/campaignStorage";
import { getFriendlyCampaignName } from "@/lib/campaignNames";
import type { ChatResponse, GoLiveResponse, HypercareResponse } from "@/lib/api";

const Index = () => {
  const navigate = useNavigate();
  
  // State management
  const [brief, setBrief] = useState<string>("");
  const [spec, setSpec] = useState<ChatResponse["spec"] | null>(null);
  const [journey, setJourney] = useState<ChatResponse["journey"] | null>(null);
  const [messages, setMessages] = useState<ChatResponse["messages"] | null>(null);
  const [qa, setQa] = useState<ChatResponse["qa"] | null>(null);
  const [goLiveResult, setGoLiveResult] = useState<GoLiveResponse | null>(null);
  const [hypercare, setHypercare] = useState<HypercareResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);

  // Check backend health on mount and periodically
  useEffect(() => {
    const checkHealth = async () => {
      const isOnline = await checkBackendHealth();
      setBackendOnline(isOnline);
      if (!isOnline && !error) {
        setError("Backend server is not running. Please start it at http://localhost:4000");
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [error]);

  // Auto-clear error when user starts typing or takes action
  useEffect(() => {
    if (error && brief) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [brief, error]);

  // Auto-clear success messages
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Handler functions
  async function handleGenerate() {
    if (!brief.trim()) {
      setError("Please enter a campaign brief");
      return;
    }

    if (loading) {
      return; // Prevent duplicate submissions
    }

    if (backendOnline === false) {
      setError("Backend server is offline. Please start it first.");
      return;
    }

    setLoading(true);
    setLoadingAction("generating");
    setError(null);
    setSuccessMessage(null);
    setGoLiveResult(null);
    setHypercare(null);

    try {
      console.log("🚀 Starting campaign generation with brief:", brief);
      const result = await chatWithCopilot(brief);
      console.log("✅ Campaign generated successfully:", result);
      
      setSpec(result.spec);
      setJourney(result.journey);
      setMessages(result.messages);
      setQa(result.qa);
      
      // Save as draft
      const savedCampaign = saveDraftCampaign(brief, result);
      setCurrentDraftId(savedCampaign.id);
      
      const friendlyName = getFriendlyCampaignName(result.spec.campaign_name);
      setSuccessMessage(`${friendlyName} generated and saved as draft!`);
      console.log("✅ State updated with campaign data and saved as draft:", savedCampaign.id);
    } catch (err) {
      console.error("❌ Error generating campaign:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to generate campaign";
      setError(errorMessage);
    } finally {
      setLoading(false);
      setLoadingAction(null);
    }
  }

  async function handleGoLive() {
    if (!spec || !journey || !messages || !qa) {
      setError("Please generate a campaign first");
      return;
    }

    if (loading) {
      return; // Prevent duplicate submissions
    }

    if (!qa.passed && qa.issues.length > 0) {
      setError("Please fix all QA errors before launching the campaign");
      return;
    }

    setLoading(true);
    setLoadingAction("launching");
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await goLive({ spec, journey, messages, qa });
      setGoLiveResult(result);
      
      // Move campaign from draft to active if we have a draft ID
      if (currentDraftId) {
        activateCampaign(currentDraftId, result);
        setCurrentDraftId(null);
      }
      
      setSuccessMessage(`Campaign launched successfully! Campaign ID: ${result.brazeCampaignId}`);
      
      // Optionally navigate to active campaigns page after a short delay
      setTimeout(() => {
        if (confirm("Campaign launched! Would you like to view it in Active Campaigns?")) {
          navigate("/active-campaigns");
        }
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to launch campaign");
    } finally {
      setLoading(false);
      setLoadingAction(null);
    }
  }

  async function handleHypercare() {
    const campaignId = goLiveResult?.brazeCampaignId || "mock_raf_001";
    
    if (loading) {
      return; // Prevent duplicate submissions
    }

    setLoading(true);
    setLoadingAction("fetching");
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await fetchHypercare(campaignId);
      setHypercare(result);
      setSuccessMessage("Hypercare data refreshed successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch hypercare data");
    } finally {
      setLoading(false);
      setLoadingAction(null);
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
          <ChatSection 
            brief={brief}
            setBrief={setBrief}
            onGenerate={handleGenerate}
            loading={loading && loadingAction === "generating"}
            spec={spec}
            journey={journey}
            messages={messages}
            qa={qa}
            backendOnline={backendOnline}
          />
          {spec && journey && messages && (
            <SimulationSection 
              spec={spec}
              journey={journey}
              messages={messages}
            />
          )}
          {qa && (
            <QASection qa={qa} />
          )}
          <GoLiveSection 
            onGoLive={handleGoLive}
            loading={loading && loadingAction === "launching"}
            disabled={!spec || !journey || !messages || !qa || backendOnline === false}
            spec={spec}
            qa={qa}
          />
          <HypercareSection 
            onHypercare={handleHypercare}
            loading={loading && loadingAction === "fetching"}
            disabled={!goLiveResult || backendOnline === false}
            hypercare={hypercare}
          />

          {/* Success message */}
          {successMessage && (
            <div className="bg-success/10 border border-success/20 rounded-xl p-4">
              <p className="text-sm font-semibold text-success mb-1">Success</p>
              <p className="text-sm text-success">{successMessage}</p>
            </div>
          )}

          {/* Error display */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4">
              <p className="text-sm font-semibold text-destructive mb-1">Error</p>
              <p className="text-sm text-destructive">{error}</p>
              {error.includes("backend") && (
                <p className="text-xs text-muted-foreground mt-2">
                  Make sure the backend server is running at http://localhost:4000
                </p>
              )}
            </div>
          )}
          
          {/* Backend status */}
          {backendOnline !== null && (
            <div className={`border rounded-xl p-4 text-xs ${backendOnline ? "bg-success/10 border-success/20" : "bg-destructive/10 border-destructive/20"}`}>
              <p className="font-semibold mb-1">
                Backend Status: {backendOnline ? "✅ Online" : "❌ Offline"}
              </p>
              {!backendOnline && (
                <p className="text-muted-foreground">
                  Start the backend server: <code className="bg-background px-1 rounded">cd backend && npm start</code>
                </p>
              )}
            </div>
          )}

          {/* Debug info - remove in production */}
          {process.env.NODE_ENV === "development" && (
            <div className="bg-muted/50 border border-border rounded-xl p-4 text-xs">
              <p className="font-semibold mb-2">Debug Info:</p>
              <p>Loading: {loading ? "Yes" : "No"}</p>
              <p>Has Spec: {spec ? "Yes" : "No"}</p>
              <p>Has Journey: {journey ? "Yes" : "No"}</p>
              <p>Has Messages: {messages ? "Yes" : "No"}</p>
              <p>Has QA: {qa ? "Yes" : "No"}</p>
              <p>API Base URL: http://localhost:4000</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
