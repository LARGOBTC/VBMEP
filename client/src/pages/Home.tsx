import { useState, useEffect } from "react";
import Header from "@/components/Header";
import LivestreamSection from "@/components/LivestreamSection";
import TeamBettingCard from "@/components/TeamBettingCard";
import UserBets from "@/components/UserBets";
import Footer from "@/components/Footer";
import WalletModal from "@/components/WalletModal";
import { useWallet } from "@/hooks/useWallet";
import { useBetting } from "@/hooks/useBetting";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const Home = () => {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const { address, isConnected, connect, disconnect, provider } = useWallet();
  const { placeBet, loadEventData, eventData } = useBetting();
  const { toast } = useToast();

  // Fetch current event data
  const { data: event, isLoading } = useQuery({
    queryKey: ['/api/events/active'],
    enabled: true,
  });

  useEffect(() => {
    if (event) {
      loadEventData(event.id);
    }
  }, [event, loadEventData]);

  const handleConnectWallet = () => {
    setIsWalletModalOpen(true);
  };

  const handleDisconnectWallet = () => {
    disconnect();
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  const handleWalletConnect = async (providerName: string) => {
    try {
      await connect(providerName);
      setIsWalletModalOpen(false);
      toast({
        title: "Wallet Connected",
        description: `Successfully connected to ${providerName}`,
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  const handleBetSubmit = async (team: "team1" | "team2", amount: number) => {
    if (!isConnected || !address || !event) {
      setIsWalletModalOpen(true);
      return;
    }

    try {
      await placeBet(event.id, team, amount);
      toast({
        title: "Bet Placed",
        description: `Successfully placed ${amount} ETH on ${team === "team1" ? event.team1Name : event.team2Name}`,
      });
    } catch (error) {
      toast({
        title: "Bet Failed",
        description: error instanceof Error ? error.message : "Failed to place bet",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        onConnectWallet={handleConnectWallet} 
        onDisconnectWallet={handleDisconnectWallet}
        isConnected={isConnected}
        walletAddress={address}
      />

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
            <div className="md:col-span-2">
              <TeamBettingCard
                team="team1"
                teamName={event?.team1Name || "TEAM ALPHA"}
                odds={eventData?.team1Odds || 1.95}
                totalWagered={eventData?.team1Total || 0}
                bettorsCount={eventData?.team1Bettors || 0}
                recentBets={eventData?.team1RecentBets || []}
                onBetSubmit={(amount) => handleBetSubmit("team1", amount)}
              />
            </div>

            <div className="md:col-span-3">
              <LivestreamSection
                title={event?.title || "LIVE MATCH"}
                team1Name={event?.team1Name || "ALPHA"}
                team2Name={event?.team2Name || "OMEGA"}
                description={event?.description || "Tournament Finals"}
                youtubeUrl={event?.youtubeUrl || ""}
                totalPool={eventData?.totalPool || 0}
                isConnected={isConnected}
              />

              <div className="mt-6 bg-white rounded-lg p-4 shadow-lg">
                <h3 className="font-montserrat font-bold text-lg mb-4">Current Betting Stats</h3>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-purple text-white">
                        {event?.team1Name || "Team Alpha"}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-purple-light text-white">
                        {event?.team2Name || "Team Omega"}
                      </span>
                    </div>
                  </div>
                  <div className="flex h-6 mb-4 overflow-hidden text-xs rounded-full">
                    <div 
                      style={{ width: `${eventData?.team1Percentage || 50}%` }} 
                      className="flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple"
                    >
                      {eventData?.team1Percentage || 50}%
                    </div>
                    <div 
                      style={{ width: `${eventData?.team2Percentage || 50}%` }} 
                      className="flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-light"
                    >
                      {eventData?.team2Percentage || 50}%
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>{eventData?.team1Total || 0} ETH</span>
                    <span className="text-center">Total Pool: <span className="font-bold">{eventData?.totalPool || 0} ETH</span></span>
                    <span>{eventData?.team2Total || 0} ETH</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <TeamBettingCard
                team="team2"
                teamName={event?.team2Name || "TEAM OMEGA"}
                odds={eventData?.team2Odds || 1.92}
                totalWagered={eventData?.team2Total || 0}
                bettorsCount={eventData?.team2Bettors || 0}
                recentBets={eventData?.team2RecentBets || []}
                onBetSubmit={(amount) => handleBetSubmit("team2", amount)}
              />
            </div>
          </div>

          <div className="mt-8">
            <UserBets 
              isConnected={isConnected} 
              walletAddress={address}
              onConnectWallet={handleConnectWallet}
            />
          </div>
        </div>
      </main>

      <Footer />

      <WalletModal 
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onConnect={handleWalletConnect}
      />
    </div>
  );
};

export default Home;
