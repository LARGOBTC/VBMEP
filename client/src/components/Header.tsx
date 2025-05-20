import React from "react";
import WalletConnection from "./WalletConnection";

interface HeaderProps {
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
  isConnected: boolean;
  walletAddress?: string;
}

const Header: React.FC<HeaderProps> = ({
  onConnectWallet,
  onDisconnectWallet,
  isConnected,
  walletAddress,
}) => {
  return (
    <header className="bg-purple-dark text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center">
            <div className="vegas-sign text-3xl md:text-4xl font-montserrat font-bold mr-2">
              <span className="text-gold">Vegas</span>
              <span className="text-white">Bets</span>
            </div>
            <span className="hidden md:inline-block bg-purple-light text-white text-xs px-2 py-1 rounded ml-2">
              JIU-JITSU & MMA
            </span>
            <span className="hidden md:inline-block bg-purple-light text-white text-xs px-2 py-1 rounded ml-2">
              LIVE
            </span>
          </div>

          <WalletConnection
            onConnectWallet={onConnectWallet}
            onDisconnectWallet={onDisconnectWallet}
            isConnected={isConnected}
            walletAddress={walletAddress}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
