import React, { useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { declareWinner } from "@/lib/betting";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation, useRoute } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WalletModal from "@/components/WalletModal";

const AdminPanel: React.FC = () => {
  const { address, isConnected, signer, connect, disconnect } = useWallet();
  const [winner, setWinner] = useState<string>("");
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, params] = useRoute("/admin");
  const [, navigate] = useLocation();

  // Fetch active events
  const { data: events, isLoading: isLoadingEvents } = useQuery({
    queryKey: ['/api/events'],
    enabled: isConnected && !!address,
  });

  // Fetch admin status
  const { data: isAdmin, isLoading: isLoadingAdmin } = useQuery({
    queryKey: ['/api/users/admin-check', address],
    enabled: isConnected && !!address,
  });

  // Declare winner mutation
  const declareWinnerMutation = useMutation({
    mutationFn: async ({ eventId, winner }: { eventId: number, winner: string }) => {
      if (!signer || !address) {
        throw new Error("Wallet not connected");
      }

      // 1. Execute the blockchain transaction
      const tx = await declareWinner(signer, eventId, winner);
      await tx.wait();

      // 2. Update the backend
      return apiRequest("POST", "/api/events/declare-winner", {
        eventId,
        winner,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      toast({
        title: "Winner Declared",
        description: "The winner has been declared and winnings are being distributed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to declare winner",
        variant: "destructive",
      });
    },
  });

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

  const handleDeclareWinner = async (eventId: number) => {
    if (!winner) {
      toast({
        title: "Error",
        description: "Please select a winner",
        variant: "destructive",
      });
      return;
    }

    try {
      await declareWinnerMutation.mutateAsync({ eventId, winner });
    } catch (error) {
      // Error is handled in the mutation's onError callback
    }
  };

  // Check if user is authorized to access admin panel
  if (isConnected && !isLoadingAdmin && !isAdmin) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header 
          onConnectWallet={handleConnectWallet} 
          onDisconnectWallet={handleDisconnectWallet}
          isConnected={isConnected}
          walletAddress={address}
        />
        <main className="flex-grow flex items-center justify-center">
          <div className="max-w-md w-full mx-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-red-600">Access Denied</CardTitle>
                <CardDescription>
                  You do not have permission to access the admin panel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  This area is restricted to administrators only. If you believe you should have access, please contact support.
                </p>
              </CardContent>
              <CardFooter>
                <Button onClick={() => navigate("/")} className="bg-purple hover:bg-purple-light w-full">
                  Return to Home
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
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
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-montserrat font-bold mb-8 text-purple-dark">Admin Panel</h1>
            
            {!isConnected ? (
              <Card>
                <CardHeader>
                  <CardTitle>Authentication Required</CardTitle>
                  <CardDescription>
                    Please connect your wallet to access the admin panel
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button 
                    onClick={handleConnectWallet}
                    className="bg-purple hover:bg-purple-light"
                  >
                    Connect Wallet
                  </Button>
                </CardContent>
              </Card>
            ) : isLoadingAdmin || isLoadingEvents ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading admin panel...</p>
              </div>
            ) : (
              <>
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Manage Events</CardTitle>
                    <CardDescription>
                      Declare winners and distribute winnings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {events && events.length > 0 ? (
                      <div className="space-y-6">
                        {events.map((event: any) => (
                          <div key={event.id} className="p-4 border rounded-lg">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                              <div>
                                <h3 className="text-lg font-bold">{event.title}</h3>
                                <p className="text-sm text-gray-600">{event.description}</p>
                                <div className="flex items-center mt-2">
                                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${event.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                                    {event.isActive ? "Active" : "Ended"}
                                  </span>
                                  {event.winner && (
                                    <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                                      Winner: {event.winner === "team1" ? event.team1Name : event.team2Name}
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              <div className="mt-4 md:mt-0 text-right">
                                <div className="text-sm text-gray-600">Total Pool</div>
                                <div className="text-lg font-bold text-purple">
                                  {event.totalPool ? event.totalPool.toFixed(2) : "0.00"} ETH
                                </div>
                              </div>
                            </div>
                            
                            {event.isActive && !event.winner && (
                              <div className="mt-4 pt-4 border-t">
                                <div className="flex flex-col sm:flex-row gap-4">
                                  <div className="flex-grow">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Declare Winner
                                    </label>
                                    <Select onValueChange={(value) => setWinner(value)}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select winner" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="team1">{event.team1Name}</SelectItem>
                                        <SelectItem value="team2">{event.team2Name}</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="flex items-end">
                                    <Button 
                                      onClick={() => handleDeclareWinner(event.id)}
                                      className="bg-purple hover:bg-purple-light"
                                      disabled={declareWinnerMutation.isPending}
                                    >
                                      {declareWinnerMutation.isPending ? (
                                        <>
                                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                          Processing...
                                        </>
                                      ) : (
                                        "Declare & Distribute"
                                      )}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-600">No active events found</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Statistics</CardTitle>
                    <CardDescription>
                      Overview of platform activity
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-purple bg-opacity-10 p-4 rounded-lg">
                        <div className="text-sm text-gray-600">Total Events</div>
                        <div className="text-2xl font-bold text-purple-dark">{events?.length || 0}</div>
                      </div>
                      <div className="bg-purple-light bg-opacity-10 p-4 rounded-lg">
                        <div className="text-sm text-gray-600">Active Events</div>
                        <div className="text-2xl font-bold text-purple-dark">
                          {events?.filter((e: any) => e.isActive).length || 0}
                        </div>
                      </div>
                      <div className="bg-gold bg-opacity-10 p-4 rounded-lg">
                        <div className="text-sm text-gray-600">Total Bets</div>
                        <div className="text-2xl font-bold text-purple-dark">
                          {events?.reduce((acc: number, event: any) => acc + (event.betsCount || 0), 0) || 0}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
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

export default AdminPanel;
