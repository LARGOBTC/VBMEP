import React, { useState, useEffect } from "react";
import { useWallet } from "@/hooks/useWallet";

interface RecentBet {
  walletAddress: string;
  amount: number;
  timestamp: string;
}

interface TeamBettingCardProps {
  team: "team1" | "team2";
  teamName: string;
  odds: number;
  totalWagered: number;
  bettorsCount: number;
  recentBets: RecentBet[];
  onBetSubmit: (amount: number) => void;
}

const TeamBettingCard: React.FC<TeamBettingCardProps> = ({
  team,
  teamName,
  odds,
  totalWagered,
  bettorsCount,
  recentBets,
  onBetSubmit,
}) => {
  const [betAmount, setBetAmount] = useState<string>("0.1");
  const [sliderValue, setSliderValue] = useState<number>(0.1);
  const { isConnected, balance } = useWallet();

  // Image URLs for backgrounds - jiu-jitsu fighters
  const bgImageUrl = team === "team1" 
    ? "https://images.unsplash.com/photo-1591117207239-788bf8de6c3b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80"
    : "https://images.unsplash.com/photo-1595878715977-f1a9ea7609ce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80";

  // Handle input change for manual bet amount input
  const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d{0,4}$/.test(value)) {
      setBetAmount(value);
      if (value !== "" && parseFloat(value) >= 0.01 && parseFloat(value) <= 1) {
        setSliderValue(parseFloat(value));
      }
    }
  };

  // Handle slider value change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setSliderValue(value);
    setBetAmount(value.toFixed(2));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (betAmount && parseFloat(betAmount) > 0) {
      onBetSubmit(parseFloat(betAmount));
    }
  };

  // Format wallet address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className={`bet-card gradient-border bg-white rounded-lg shadow-lg overflow-hidden`} data-team={team}>
      <div className={`${team === "team1" ? "bg-purple-dark" : "bg-purple-light"} text-white py-3 px-4`}>
        <div className="flex justify-between items-center">
          <h3 className="font-montserrat font-bold text-lg">TEAM {teamName}</h3>
          <span className="font-oswald text-xl">{odds.toFixed(2)}x</span>
        </div>
      </div>
      
      {/* Team image */}
      <div className="relative overflow-hidden h-48">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <img 
          src={bgImageUrl}
          alt={`Team ${teamName}`} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`${team === "team1" ? "bg-purple" : "bg-purple-light"} bg-opacity-90 text-white text-2xl font-oswald font-bold px-4 py-2 rounded shadow-lg`}>
            {teamName}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600 font-medium">Total Wagered</span>
            <span className={`font-oswald text-lg font-bold ${team === "team1" ? "text-purple" : "text-purple-light"}`}>
              {totalWagered.toFixed(2)} PLS
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Bettors</span>
            <span className="font-bold">{bettorsCount}</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="bet-form">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`betAmount-${team}`}>
              Your Bet Amount
            </label>
            <div className="flex items-center">
              <input 
                type="text" 
                id={`betAmount-${team}`}
                value={betAmount}
                onChange={handleBetAmountChange}
                className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full" 
                placeholder="0.00"
              />
              <span className="ml-2 text-gray-700 font-medium">PLS</span>
            </div>
            {isConnected && balance !== undefined && parseFloat(betAmount) > balance && (
              <p className="text-red-500 text-xs mt-1">Insufficient balance</p>
            )}
          </div>
          
          <div className="mb-4">
            <input 
              type="range" 
              min="0.01" 
              max="1" 
              step="0.01" 
              value={sliderValue}
              onChange={handleSliderChange}
              className="w-full" 
            />
          </div>
          
          <div className="flex justify-between text-sm text-gray-600 mb-4">
            <span>0.01 PLS</span>
            <span>0.5 PLS</span>
            <span>1 PLS</span>
          </div>
          
          <div className="flex justify-center">
            <button 
              type="submit" 
              className={`${team === "team1" ? "bg-purple hover:bg-purple-light" : "bg-purple-light hover:bg-purple"} text-white font-bold py-3 px-6 rounded-full shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1`}
              disabled={!isConnected || betAmount === "" || parseFloat(betAmount) <= 0 || (balance !== undefined && parseFloat(betAmount) > balance)}
            >
              Place Bet on {teamName}
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-gray-100 p-4 border-t border-gray-200">
        <h4 className="font-bold text-gray-700 mb-2">Recent Bets</h4>
        <div className="max-h-40 overflow-y-auto">
          {recentBets.length > 0 ? (
            recentBets.map((bet, index) => (
              <div key={index} className="py-2 border-b border-gray-200 last:border-0">
                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    <span className="font-medium text-gray-800 truncate block w-24">
                      {formatAddress(bet.walletAddress)}
                    </span>
                    <span className="text-gray-500 text-xs">{bet.timestamp}</span>
                  </div>
                  <span className={`font-oswald font-bold ${team === "team1" ? "text-purple" : "text-purple-light"}`}>
                    {bet.amount.toFixed(2)} PLS
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm py-2">No bets placed yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamBettingCard;
