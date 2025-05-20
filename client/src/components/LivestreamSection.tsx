import React, { useEffect, useRef, useState } from "react";

interface LivestreamSectionProps {
  title: string;
  team1Name: string;
  team2Name: string;
  description: string;
  youtubeUrl: string;
  totalPool: number;
  isConnected: boolean;
}

interface ChatMessage {
  id: string;
  username: string;
  avatar: string;
  message: string;
  timestamp: string;
}

const LivestreamSection: React.FC<LivestreamSectionProps> = ({
  title,
  team1Name,
  team2Name,
  description,
  youtubeUrl,
  totalPool,
  isConnected,
}) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [youtubePlayer, setYoutubePlayer] = useState<any>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Initialize YouTube player
  useEffect(() => {
    // Load the YouTube IFrame API if it's not already loaded
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = loadPlayer;
    } else {
      loadPlayer();
    }

    function loadPlayer() {
      if (youtubeUrl) {
        // Extract video ID from the URL
        const videoId = extractYouTubeVideoId(youtubeUrl);
        if (videoId) {
          new window.YT.Player("youtube-player", {
            videoId: videoId,
            playerVars: {
              autoplay: 1,
              modestbranding: 1,
              rel: 0,
              fs: 1,
            },
            events: {
              onReady: (event: any) => {
                setYoutubePlayer(event.target);
              },
            },
          });
        }
      }
    }

    // Clean up
    return () => {
      if (youtubePlayer) {
        youtubePlayer.destroy();
      }
    };
  }, [youtubeUrl]);

  // Extract YouTube video ID from a URL
  const extractYouTubeVideoId = (url: string): string | null => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : null;
  };

  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Simulate chat messages (in a real implementation, this would use WebSockets)
  useEffect(() => {
    const initialChatMessages: ChatMessage[] = [
      {
        id: '1',
        username: 'JohnD',
        avatar: 'JD',
        message: `${team1Name} is looking strong today!`,
        timestamp: '2:34 PM',
      },
      {
        id: '2',
        username: 'CryptoTrader',
        avatar: 'CT',
        message: `I just placed 0.5 ETH on ${team2Name} 🚀`,
        timestamp: '2:35 PM',
      },
      {
        id: '3',
        username: 'BetWinner',
        avatar: 'BW',
        message: `The odds are shifting toward ${team1Name} now`,
        timestamp: '2:36 PM',
      },
    ];
    setChatMessages(initialChatMessages);
  }, [team1Name, team2Name]);

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim() === "") return;

    // Add user message to chat
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      username: 'You',
      avatar: 'YO',
      message: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages([...chatMessages, newMessage]);
    setChatInput("");
  };

  const getRandomColor = (username: string) => {
    // Generate a deterministic color based on the username
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colors = [
      'bg-purple-light',
      'bg-green-500',
      'bg-red-500',
      'bg-blue-500',
      'bg-yellow-500',
      'bg-pink-500',
      'bg-orange-500',
    ];
    
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-purple-dark text-white py-3 px-4 flex justify-between items-center">
        <h2 className="font-montserrat font-bold text-lg">{title}</h2>
        <div className="flex items-center">
          <span className="inline-block h-2 w-2 rounded-full bg-red-500 mr-1 animate-pulse"></span>
          <span className="text-xs font-medium">LIVE</span>
        </div>
      </div>
      
      {/* YouTube video embed */}
      <div className="aspect-w-16 aspect-h-9 bg-black relative">
        {youtubeUrl ? (
          <div id="youtube-player" className="w-full h-full"></div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-white opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-white mt-4">YouTube livestream will appear here</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Match information */}
      <div className="p-4 bg-gray-100 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-montserrat font-bold text-gray-800">{team1Name} vs {team2Name}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Total Pool</div>
            <div className="font-oswald font-bold text-xl text-purple">{totalPool.toFixed(2)} ETH</div>
          </div>
        </div>
      </div>
      
      {/* Chat section */}
      <div className="h-64 md:h-80 flex flex-col">
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4">
          {chatMessages.map((message) => (
            <div key={message.id} className="mb-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-2">
                  <div className={`h-8 w-8 rounded-full ${getRandomColor(message.username)} flex items-center justify-center text-white font-bold text-sm`}>
                    {message.avatar}
                  </div>
                </div>
                <div>
                  <div className="flex items-baseline">
                    <span className="font-bold text-gray-800 mr-2">{message.username}</span>
                    <span className="text-xs text-gray-500">{message.timestamp}</span>
                  </div>
                  <p className="text-gray-700">{message.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Chat input */}
        <div className="p-3 border-t border-gray-200">
          <form onSubmit={handleChatSubmit} className="flex">
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-grow px-3 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent" 
              placeholder="Type a message..."
              disabled={!isConnected}
            />
            <button 
              type="submit" 
              className="bg-purple text-white px-4 py-2 rounded-r hover:bg-purple-light disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!isConnected}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>
          {!isConnected && (
            <div className="text-center mt-2 text-xs text-gray-500">
              Connect wallet to join the conversation
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LivestreamSection;
