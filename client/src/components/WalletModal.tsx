import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (providerName: string) => void;
}

const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  onConnect,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-montserrat font-bold text-gray-800">Connect Wallet</DialogTitle>
          <DialogDescription className="text-gray-600">
            Connect with one of our available wallet providers to continue.
          </DialogDescription>
        </DialogHeader>
        
        <div className="text-center py-4">
          <img 
            src="https://images.unsplash.com/photo-1555597673-b21d5c935865?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200" 
            alt="Jiu-jitsu match" 
            className="mx-auto h-32 w-auto object-contain mb-4"
          />
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={() => onConnect("MetaMask")} 
            variant="outline"
            className="w-full flex items-center justify-between p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <span className="font-medium text-gray-800">MetaMask</span>
            <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="h-6 w-auto" />
          </Button>
          
          <Button 
            onClick={() => onConnect("Coinbase")} 
            variant="outline"
            className="w-full flex items-center justify-between p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <span className="font-medium text-gray-800">Coinbase Wallet</span>
            <img src="https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/v1475451032/ajbusirxgkmkqfaodesz.png" alt="Coinbase Wallet" className="h-6 w-auto" />
          </Button>
          
          <Button 
            onClick={() => onConnect("WalletConnect")} 
            variant="outline"
            className="w-full flex items-center justify-between p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <span className="font-medium text-gray-800">WalletConnect</span>
            <img src="https://seeklogo.com/images/W/walletconnect-logo-EE83B50C97-seeklogo.com.png" alt="WalletConnect" className="h-6 w-auto" />
          </Button>
        </div>
        
        <div className="mt-6 text-xs text-gray-500 text-center">
          By connecting your wallet, you agree to our <a href="#" className="text-purple">Terms of Service</a> and <a href="#" className="text-purple">Privacy Policy</a>.
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletModal;
