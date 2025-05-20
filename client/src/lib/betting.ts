import { ethers } from "ethers";
import { getBettingContract } from "./mockSmartContract";

// Place a bet
export const placeBet = async (
  signer: ethers.Signer,
  eventId: number,
  team: string,
  amount: number
): Promise<ethers.ContractTransaction> => {
  try {
    const contract = getBettingContract(signer);
    const amountWei = ethers.utils.parseEther(amount.toString());
    
    // Call the contract's placeBet function with the provided parameters
    const tx = await contract.placeBet(eventId, team, {
      value: amountWei,
      gasLimit: 300000, // Adjust gas limit as needed
    });
    
    return tx;
  } catch (error) {
    console.error("Error placing bet:", error);
    throw error;
  }
};

// Declare a winner (admin only)
export const declareWinner = async (
  signer: ethers.Signer,
  eventId: number,
  winner: string
): Promise<ethers.ContractTransaction> => {
  try {
    const contract = getBettingContract(signer);
    
    // Call the contract's declareWinner function
    const tx = await contract.declareWinner(eventId, winner, {
      gasLimit: 200000, // Adjust gas limit as needed
    });
    
    return tx;
  } catch (error) {
    console.error("Error declaring winner:", error);
    throw error;
  }
};

// Withdraw winnings
export const withdrawWinnings = async (
  signer: ethers.Signer,
  eventId: number
): Promise<ethers.ContractTransaction> => {
  try {
    const contract = getBettingContract(signer);
    
    // Call the contract's withdrawWinnings function
    const tx = await contract.withdrawWinnings(eventId, {
      gasLimit: 200000, // Adjust gas limit as needed
    });
    
    return tx;
  } catch (error) {
    console.error("Error withdrawing winnings:", error);
    throw error;
  }
};

// Get event statistics
export const getEventStats = async (
  provider: ethers.providers.Provider,
  eventId: number
): Promise<{
  team1Total: ethers.BigNumber;
  team2Total: ethers.BigNumber;
  team1Bettors: ethers.BigNumber;
  team2Bettors: ethers.BigNumber;
  totalPool: ethers.BigNumber;
}> => {
  try {
    const contract = getBettingContract(provider);
    
    // Call the contract's getEventStats function
    const stats = await contract.getEventStats(eventId);
    
    return {
      team1Total: stats[0],
      team2Total: stats[1],
      team1Bettors: stats[2],
      team2Bettors: stats[3],
      totalPool: stats[4],
    };
  } catch (error) {
    console.error("Error getting event stats:", error);
    throw error;
  }
};
