import { useState, useCallback } from "react";
import { useWallet } from "./useWallet";
import { placeBet as placeBetContract } from "@/lib/betting";
import { ethers } from "ethers";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface BetData {
  walletAddress: string;
  amount: number;
  timestamp: string;
}

interface EventData {
  team1Total: number;
  team2Total: number;
  team1Bettors: number;
  team2Bettors: number;
  team1Percentage: number;
  team2Percentage: number;
  totalPool: number;
  team1Odds: number;
  team2Odds: number;
  team1RecentBets: BetData[];
  team2RecentBets: BetData[];
}

export function useBetting() {
  const { provider, signer, address } = useWallet();
  const queryClient = useQueryClient();
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [currentEventId, setCurrentEventId] = useState<number | null>(null);

  // Fetch event betting data
  const fetchEventData = useCallback(async (eventId: number) => {
    if (!eventId) return null;
    
    try {
      // In a real implementation, this would get data from the smart contract
      // For now, we'll make an API request
      const response = await fetch(`/api/events/${eventId}/stats`);
      if (!response.ok) {
        throw new Error("Failed to fetch event data");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching event data:", error);
      return null;
    }
  }, []);

  // Use query to keep event data updated
  const { data, refetch } = useQuery({
    queryKey: ['/api/events/stats', currentEventId],
    queryFn: () => fetchEventData(currentEventId!),
    enabled: currentEventId !== null,
  });

  // Load event data
  const loadEventData = useCallback((eventId: number) => {
    setCurrentEventId(eventId);
    refetch();
  }, [refetch]);

  // Update local state when data changes
  useState(() => {
    if (data) {
      setEventData(data);
    }
  }, [data]);

  // Place bet mutation
  const placeBetMutation = useMutation({
    mutationFn: async ({ eventId, team, amount }: { eventId: number, team: string, amount: number }) => {
      if (!signer || !address) {
        throw new Error("Wallet not connected");
      }

      // 1. First do the blockchain transaction
      const tx = await placeBetContract(signer, eventId, team, amount);
      await tx.wait();

      // 2. Then record the bet in our backend
      return apiRequest("POST", "/api/bets", {
        walletAddress: address,
        eventId,
        team,
        amount: amount.toString(),
      });
    },
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/events/stats', currentEventId] });
      if (address) {
        queryClient.invalidateQueries({ queryKey: [`/api/bets/user/${address}`] });
      }
    },
  });

  // Place bet function
  const placeBet = useCallback(async (eventId: number, team: "team1" | "team2", amount: number) => {
    if (!signer || !provider) {
      throw new Error("Wallet not connected");
    }

    if (amount <= 0) {
      throw new Error("Bet amount must be greater than 0");
    }

    await placeBetMutation.mutateAsync({ eventId, team, amount });
  }, [placeBetMutation, provider, signer]);

  return {
    eventData,
    loadEventData,
    placeBet,
    isPlacingBet: placeBetMutation.isPending,
    placeBetError: placeBetMutation.error,
  };
}
