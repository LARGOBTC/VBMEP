import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { placeBetSchema, declareWinnerSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Middleware to check if user is admin
  const isAdmin = async (req: Request, res: Response, next: Function) => {
    const walletAddress = req.body.walletAddress || req.query.walletAddress;
    if (!walletAddress) {
      return res.status(401).json({ message: "Unauthorized: Missing wallet address" });
    }

    try {
      const isAdmin = await storage.isAdmin(walletAddress);
      if (!isAdmin) {
        return res.status(403).json({ message: "Forbidden: Admin access required" });
      }
      next();
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // Check if a wallet address is admin
  app.get("/api/users/admin-check", async (req: Request, res: Response) => {
    const walletAddress = req.query.walletAddress as string;
    if (!walletAddress) {
      return res.status(400).json({ message: "Wallet address is required" });
    }

    try {
      const isAdmin = await storage.isAdmin(walletAddress);
      return res.json(isAdmin);
    } catch (error) {
      return res.status(500).json({ message: "Failed to check admin status" });
    }
  });

  // Get all events
  app.get("/api/events", async (req: Request, res: Response) => {
    try {
      const events = await storage.getAllEvents();
      return res.json(events);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  // Get active event
  app.get("/api/events/active", async (req: Request, res: Response) => {
    try {
      const event = await storage.getActiveEvent();
      if (!event) {
        return res.status(404).json({ message: "No active event found" });
      }
      return res.json(event);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch active event" });
    }
  });

  // Get event statistics
  app.get("/api/events/:eventId/stats", async (req: Request, res: Response) => {
    try {
      const eventId = parseInt(req.params.eventId);
      if (isNaN(eventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }

      const stats = await storage.getEventStats(eventId);
      return res.json(stats);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch event statistics" });
    }
  });

  // Place a bet
  app.post("/api/bets", async (req: Request, res: Response) => {
    try {
      const validatedData = placeBetSchema.parse(req.body);
      const result = await storage.placeBet(validatedData);
      return res.status(201).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      return res.status(500).json({ message: "Failed to place bet" });
    }
  });

  // Get user's bets
  app.get("/api/bets/user/:walletAddress", async (req: Request, res: Response) => {
    try {
      const walletAddress = req.params.walletAddress;
      const bets = await storage.getUserBets(walletAddress);
      return res.json(bets);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch user bets" });
    }
  });

  // Declare a winner (admin only)
  app.post("/api/events/declare-winner", isAdmin, async (req: Request, res: Response) => {
    try {
      const validatedData = declareWinnerSchema.parse(req.body);
      const result = await storage.declareWinner(validatedData.eventId, validatedData.winner);
      return res.json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      return res.status(500).json({ message: "Failed to declare winner" });
    }
  });

  return httpServer;
}
