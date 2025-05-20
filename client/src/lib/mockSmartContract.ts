import { ethers } from "ethers";

// This is a simplified ABI for a betting contract
// In a real implementation, this would be the actual ABI from the compiled smart contract
export const BETTING_CONTRACT_ABI = [
  "function placeBet(uint256 eventId, string team) public payable",
  "function declareWinner(uint256 eventId, string winner) public onlyOwner",
  "function withdrawWinnings(uint256 eventId) public",
  "function getEventStats(uint256 eventId) public view returns (uint256 team1Total, uint256 team2Total, uint256 team1Bettors, uint256 team2Bettors, uint256 totalPool)",
  "event BetPlaced(address indexed bettor, uint256 indexed eventId, string team, uint256 amount, uint256 timestamp)",
  "event WinnerDeclared(uint256 indexed eventId, string winner, uint256 timestamp)",
  "event WinningsClaimed(address indexed bettor, uint256 indexed eventId, uint256 amount, uint256 timestamp)",
];

// Mock contract address - in a real app, this would be the deployed contract address
export const BETTING_CONTRACT_ADDRESS = "0x123456789abcdef123456789abcdef123456789a";

// Get contract instance
export const getBettingContract = (
  signerOrProvider: ethers.Signer | ethers.providers.Provider
) => {
  return new ethers.Contract(
    BETTING_CONTRACT_ADDRESS,
    BETTING_CONTRACT_ABI,
    signerOrProvider
  );
};
