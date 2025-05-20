import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

interface UserBetsProps {
  isConnected: boolean;
  walletAddress?: string;
  onConnectWallet: () => void;
}

interface UserBet {
  id: number;
  eventTitle: string;
  eventDescription: string;
  team: string;
  teamName: string;
  amount: number;
  potentialWin: number;
  status: "in_progress" | "won" | "lost";
}

const UserBets: React.FC<UserBetsProps> = ({
  isConnected,
  walletAddress,
  onConnectWallet,
}) => {
  // Fetch user's bets if wallet is connected
  const { data: userBets, isLoading } = useQuery<UserBet[]>({
    queryKey: [`/api/bets/user/${walletAddress}`],
    enabled: isConnected && !!walletAddress,
  });

  // Get status badge styles based on bet status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "won":
        return "bg-green-100 text-green-800";
      case "lost":
        return "bg-red-100 text-red-800";
      case "in_progress":
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  // Get status text based on bet status
  const getStatusText = (status: string) => {
    switch (status) {
      case "won":
        return "Won";
      case "lost":
        return "Lost";
      case "in_progress":
      default:
        return "In Progress";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-purple-dark text-white py-3 px-4">
        <h2 className="font-montserrat font-bold text-lg">YOUR ACTIVE BETS</h2>
      </div>
      
      {!isConnected ? (
        // Not connected state
        <div className="py-12 text-center">
          <div className="mb-4">
            <img 
              src="https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&h=200" 
              alt="Cryptocurrency wallet" 
              className="inline-block h-32 w-auto object-contain"
            />
          </div>
          <h3 className="font-montserrat font-bold text-xl text-gray-800 mb-2">No Active Bets</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            Connect your MetaMask wallet to place bets and view your betting history.
          </p>
          <Button 
            className="bg-purple hover:bg-purple-light text-white font-bold py-3 px-6 rounded-full shadow-md hover:shadow-lg"
            onClick={onConnectWallet}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
            Connect Wallet
          </Button>
        </div>
      ) : (
        // Connected state with bets
        <div>
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your bets...</p>
            </div>
          ) : userBets && userBets.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Team
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Potential Win
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userBets.map((bet) => (
                    <tr key={bet.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{bet.eventTitle}</div>
                        <div className="text-sm text-gray-500">{bet.eventDescription}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple text-white">
                          {bet.teamName}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{bet.amount.toFixed(2)} ETH</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-600">{bet.potentialWin.toFixed(2)} ETH</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(bet.status)}`}>
                          {getStatusText(bet.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            // No bets yet
            <div className="py-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="font-montserrat font-bold text-xl text-gray-800 mt-4 mb-2">No Bets Placed Yet</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                You haven't placed any bets yet. Place a bet on one of the teams above to see it here.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserBets;
