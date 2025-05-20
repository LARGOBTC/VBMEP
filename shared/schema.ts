import { pgTable, text, serial, integer, boolean, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  walletAddress: text("wallet_address").unique(),
  isAdmin: boolean("is_admin").default(false),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  youtubeUrl: text("youtube_url").notNull(),
  team1Name: text("team1_name").notNull(),
  team2Name: text("team2_name").notNull(),
  isActive: boolean("is_active").default(true),
  winner: text("winner"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bets = pgTable("bets", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull(),
  eventId: integer("event_id").notNull(),
  team: text("team").notNull(), // 'team1' or 'team2'
  amount: numeric("amount").notNull(),
  processed: boolean("processed").default(false),
  winnings: numeric("winnings"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  walletAddress: true,
  isAdmin: true,
});

export const insertEventSchema = createInsertSchema(events).pick({
  title: true,
  description: true,
  youtubeUrl: true,
  team1Name: true,
  team2Name: true,
  isActive: true,
});

export const insertBetSchema = createInsertSchema(bets).pick({
  walletAddress: true,
  eventId: true,
  team: true,
  amount: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

export type InsertBet = z.infer<typeof insertBetSchema>;
export type Bet = typeof bets.$inferSelect;

// Custom schemas for frontend/backend validation
export const placeBetSchema = z.object({
  walletAddress: z.string().min(1, "Wallet address is required"),
  eventId: z.number(),
  team: z.enum(["team1", "team2"]),
  amount: z.string().or(z.number()).transform((val) => 
    typeof val === "string" ? parseFloat(val) : val
  ).refine((val) => val > 0, "Amount must be greater than 0"),
});

export const declareWinnerSchema = z.object({
  eventId: z.number(),
  winner: z.enum(["team1", "team2"]),
});
