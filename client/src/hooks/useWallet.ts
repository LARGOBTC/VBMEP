import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";

interface WalletState {
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  address: string | undefined;
  balance: number | undefined;
  isConnected: boolean;
  chainId: number | undefined;
}

export function useWallet() {
  const [walletState, setWalletState] = useState<WalletState>({
    provider: null,
    signer: null,
    address: undefined,
    balance: undefined,
    isConnected: false,
    chainId: undefined,
  });

  const updateWalletState = useCallback(async (provider: ethers.providers.Web3Provider) => {
    try {
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const balanceWei = await provider.getBalance(address);
      const balance = parseFloat(ethers.utils.formatEther(balanceWei));
      const network = await provider.getNetwork();
      const chainId = network.chainId;

      setWalletState({
        provider,
        signer,
        address,
        balance,
        isConnected: true,
        chainId,
      });
    } catch (error) {
      console.error("Error updating wallet state:", error);
      disconnect();
    }
  }, []);

  const connect = useCallback(async (providerName: string) => {
    try {
      if (!window.ethereum) {
        throw new Error("No crypto wallet found. Please install MetaMask or another provider.");
      }

      if (providerName === "MetaMask" && !window.ethereum.isMetaMask) {
        throw new Error("MetaMask is not installed!");
      }

      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" });
      
      // Create provider and update state
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await updateWalletState(provider);

      // Listen for account changes
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          // User has disconnected all accounts
          disconnect();
        } else {
          // Account changed, update state
          updateWalletState(provider);
        }
      });

      // Listen for chain changes
      window.ethereum.on("chainChanged", () => {
        // Reload the page when the chain changes
        window.location.reload();
      });

      return true;
    } catch (error) {
      console.error("Error connecting wallet:", error);
      throw error;
    }
  }, [updateWalletState]);

  const disconnect = useCallback(() => {
    setWalletState({
      provider: null,
      signer: null,
      address: undefined,
      balance: undefined,
      isConnected: false,
      chainId: undefined,
    });
  }, []);

  // Check if wallet is already connected on initial load
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          if (accounts.length > 0) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await updateWalletState(provider);
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
    };

    checkConnection();
  }, [updateWalletState]);

  return {
    ...walletState,
    connect,
    disconnect,
  };
}
