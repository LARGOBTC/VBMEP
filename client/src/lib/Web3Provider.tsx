import React, { createContext, useEffect } from "react";
import { ethers } from "ethers";

// Create a Web3 context
export const Web3Context = createContext<{
  provider: ethers.providers.Web3Provider | null;
}>({
  provider: null,
});

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Ensure the app has window.ethereum defined for TypeScript
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.ethereum = window.ethereum || {};
    }
  }, []);

  return (
    <Web3Context.Provider value={{ provider: null }}>
      {children}
    </Web3Context.Provider>
  );
};
