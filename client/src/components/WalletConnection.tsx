import React from "react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";

interface WalletConnectionProps {
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
  isConnected: boolean;
  walletAddress?: string;
}

const WalletConnection: React.FC<WalletConnectionProps> = ({
  onConnectWallet,
  onDisconnectWallet,
  isConnected,
  walletAddress,
}) => {
  const { balance } = useWallet();

  // Format wallet address for display
  const formatWalletAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="wallet-connection flex items-center mt-2 sm:mt-0">
      {!isConnected ? (
        <div className="wallet-disconnected">
          <Button
            onClick={onConnectWallet}
            className="bg-gold hover:bg-yellow-500 text-purple-dark font-bold py-2 px-4 rounded-full flex items-center transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
            <span>Connect Wallet</span>
          </Button>
        </div>
      ) : (
        <div className="wallet-connected">
          <div className="flex items-center bg-white bg-opacity-10 rounded-full py-1 px-3">
            <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
            <div className="text-sm font-medium mr-2 truncate max-w-[100px] md:max-w-[150px]">
              {walletAddress ? formatWalletAddress(walletAddress) : ""}
            </div>
            <span className="bg-purple px-2 py-1 rounded text-xs font-bold">
              <span>{balance !== undefined ? balance.toFixed(2) : "0.00"}</span> PLS
            </span>
            <button 
              onClick={onDisconnectWallet}
              className="ml-2 text-xs text-red-300 hover:text-red-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnection;
