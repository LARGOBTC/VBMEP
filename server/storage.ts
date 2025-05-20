import { 
  users, type User, type InsertUser, 
  events, type Event, type InsertEvent,
  bets, type Bet, type InsertBet
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUserByWalletAddress(walletAddress: string): Promise<User | undefined>;
  isAdmin(walletAddress: string): Promise<boolean>;
  
  getAllEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  getActiveEvent(): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  declareWinner(eventId: number, winner: string): Promise<Event>;
  
  placeBet(bet: InsertBet): Promise<Bet>;
  getUserBets(walletAddress: string): Promise<any[]>;
  getEventBets(eventId: number): Promise<Bet[]>;
  getEventStats(eventId: number): Promise<any>;
}

interface BetData {
  walletAddress: string;
  amount: number;
  timestamp: string;
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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private events: Map<number, Event>;
  private bets: Map<number, Bet>;
  private userIdCounter: number;
  private eventIdCounter: number;
  private betIdCounter: number;

  constructor() {
    this.users = new Map();
    this.events = new Map();
    this.bets = new Map();
    this.userIdCounter = 1;
    this.eventIdCounter = 1;
    this.betIdCounter = 1;

    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Create admin user
    this.createUser({
      username: "admin",
      password: "password", // In a real app, this would be hashed
      walletAddress: "0x1234567890123456789012345678901234567890",
      isAdmin: true,
    });

    // Create an active event
    this.createEvent({
      title: "Gordon Ryan vs Andre Galvao",
      description: "ADCC Superfight Championship",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      team1Name: "Ryan",
      team2Name: "Galvao",
      isActive: true,
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByWalletAddress(walletAddress: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.walletAddress === walletAddress,
    );
  }

  async isAdmin(walletAddress: string): Promise<boolean> {
    const user = await this.getUserByWalletAddress(walletAddress);
    return !!user && user.isAdmin === true;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Event methods
  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async getActiveEvent(): Promise<Event | undefined> {
    return Array.from(this.events.values()).find(
      (event) => event.isActive === true,
    );
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.eventIdCounter++;
    const event: Event = { 
      ...insertEvent, 
      id, 
      createdAt: new Date(),
      winner: null,
    };
    this.events.set(id, event);
    return event;
  }

  async declareWinner(eventId: number, winner: string): Promise<Event> {
    const event = await this.getEvent(eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    // Update event with winner
    const updatedEvent: Event = {
      ...event,
      winner,
      isActive: false,
    };
    this.events.set(eventId, updatedEvent);

    // Process all bets for this event (simulate distributing winnings)
    const eventBets = await this.getEventBets(eventId);
    for (const bet of eventBets) {
      if (bet.team === winner) {
        // Calculate winnings based on odds (simplified)
        const winnings = bet.amount * 2; // In a real implementation, this would use actual odds
        
        // Update bet with winnings
        const updatedBet: Bet = {
          ...bet,
          processed: true,
          winnings,
        };
        this.bets.set(bet.id, updatedBet);
      } else {
        // Mark losing bets as processed
        const updatedBet: Bet = {
          ...bet,
          processed: true,
          winnings: 0,
        };
        this.bets.set(bet.id, updatedBet);
      }
    }

    return updatedEvent;
  }

  // Bet methods
  async placeBet(insertBet: InsertBet): Promise<Bet> {
    const id = this.betIdCounter++;
    const bet: Bet = {
      ...insertBet,
      id,
      processed: false,
      winnings: null,
      createdAt: new Date(),
    };
    this.bets.set(id, bet);
    return bet;
  }

  async getUserBets(walletAddress: string): Promise<UserBet[]> {
    const userBets = Array.from(this.bets.values()).filter(
      (bet) => bet.walletAddress === walletAddress,
    );

    // Enrich bets with event data and calculate potential winnings
    const enrichedBets = await Promise.all(userBets.map(async (bet) => {
      const event = await this.getEvent(bet.eventId);
      if (!event) {
        throw new Error("Event not found");
      }

      // Determine team name
      const teamName = bet.team === "team1" ? event.team1Name : event.team2Name;
      
      // Calculate potential winnings (simplified)
      const odds = bet.team === "team1" ? 1.95 : 1.92; // Sample odds
      const potentialWin = parseFloat(bet.amount.toString()) * odds;

      // Determine bet status
      let status: "in_progress" | "won" | "lost" = "in_progress";
      if (event.winner) {
        status = event.winner === bet.team ? "won" : "lost";
      }

      return {
        id: bet.id,
        eventTitle: event.title,
        eventDescription: event.description,
        team: bet.team,
        teamName,
        amount: parseFloat(bet.amount.toString()),
        potentialWin,
        status,
      };
    }));

    return enrichedBets;
  }

  async getEventBets(eventId: number): Promise<Bet[]> {
    return Array.from(this.bets.values()).filter(
      (bet) => bet.eventId === eventId,
    );
  }

  async getEventStats(eventId: number): Promise<any> {
    const eventBets = await this.getEventBets(eventId);
    const event = await this.getEvent(eventId);

    if (!event) {
      throw new Error("Event not found");
    }

    // Calculate statistics
    const team1Bets = eventBets.filter((bet) => bet.team === "team1");
    const team2Bets = eventBets.filter((bet) => bet.team === "team2");

    const team1Total = team1Bets.reduce((sum, bet) => sum + parseFloat(bet.amount.toString()), 0);
    const team2Total = team2Bets.reduce((sum, bet) => sum + parseFloat(bet.amount.toString()), 0);
    const totalPool = team1Total + team2Total;

    // Calculate percentages
    const team1Percentage = totalPool === 0 ? 50 : Math.round((team1Total / totalPool) * 100);
    const team2Percentage = totalPool === 0 ? 50 : 100 - team1Percentage;

    // Calculate odds (simplified)
    const team1Odds = team2Total === 0 ? 1.95 : (totalPool / team1Total) * 0.95;
    const team2Odds = team1Total === 0 ? 1.92 : (totalPool / team2Total) * 0.95;

    // Format recent bets
    const formatRecentBets = (bets: Bet[]): BetData[] => {
      return bets
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 5)
        .map((bet) => ({
          walletAddress: bet.walletAddress,
          amount: parseFloat(bet.amount.toString()),
          timestamp: bet.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));
    };

    return {
      team1Total,
      team2Total,
      team1Bettors: team1Bets.length,
      team2Bettors: team2Bets.length,
      team1Percentage,
      team2Percentage,
      totalPool,
      team1Odds: parseFloat(team1Odds.toFixed(2)),
      team2Odds: parseFloat(team2Odds.toFixed(2)),
      team1RecentBets: formatRecentBets(team1Bets),
      team2RecentBets: formatRecentBets(team2Bets),
    };
  }
}

export const storage = new MemStorage();
