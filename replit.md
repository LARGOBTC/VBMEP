# VegasBets - Jiu-Jitsu & MMA Betting Platform

## Overview

VegasBets is a modern betting platform specifically designed for jiu-jitsu and MMA matches, built on the PulseChain blockchain. The application features a React-based frontend with a TypeScript Express backend, integrated with smart contracts for secure betting operations.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and bundling
- **UI Library**: Radix UI components with shadcn/ui styling
- **Styling**: Tailwind CSS with custom theme variables
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Web3 Integration**: Ethers.js for blockchain interactions

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: PostgreSQL-based session storage
- **API Design**: RESTful API with JSON responses

### Smart Contract Integration
- **Blockchain**: PulseChain (Ethereum fork)
- **Library**: Ethers.js for contract interactions
- **Wallet Support**: MetaMask and Coinbase Wallet
- **Contract Features**: Bet placement, winner declaration, winnings withdrawal

## Key Components

### Database Schema
- **Users**: Stores user accounts with wallet addresses and admin flags
- **Events**: Manages betting events with team information and status
- **Bets**: Records individual bets with amounts and team selections
- **Validation**: Zod schemas for type-safe data validation

### Authentication & Authorization
- **Wallet-based Authentication**: Users connect via crypto wallets
- **Admin System**: Role-based access control for event management
- **Session Management**: Secure session storage with PostgreSQL

### Betting System
- **Live Events**: Real-time betting on active matches
- **Odds Calculation**: Dynamic odds based on betting pool distribution
- **Payout System**: Automated winnings calculation and distribution
- **Recent Bets**: Live feed of recent betting activity

### Video Integration
- **YouTube Integration**: Embedded livestreams for events
- **Chat System**: Real-time chat functionality for viewer engagement
- **Responsive Design**: Mobile-optimized video player

## Data Flow

1. **User Authentication**: Users connect their crypto wallets (MetaMask/Coinbase)
2. **Event Loading**: Active events are fetched from the backend API
3. **Betting Process**: 
   - User selects team and amount
   - Transaction is sent to smart contract
   - Backend updates database after confirmation
4. **Real-time Updates**: Event statistics and recent bets are updated dynamically
5. **Winner Declaration**: Admin declares winner, triggering payout calculations
6. **Winnings Distribution**: Users can withdraw winnings via smart contract

## External Dependencies

### Blockchain Infrastructure
- **PulseChain Network**: Primary blockchain for smart contracts
- **Neon Database**: Serverless PostgreSQL hosting
- **Wallet Providers**: MetaMask, Coinbase Wallet integration

### UI/UX Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide Icons**: Icon library
- **Embla Carousel**: Carousel component

### Development Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Type safety across the entire stack
- **Drizzle Kit**: Database migrations and schema management
- **ESBuild**: Fast JavaScript bundler for production

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot module replacement
- **Database**: Local PostgreSQL or Neon Database connection
- **Environment Variables**: `.env` file for sensitive configuration

### Production Build
- **Frontend**: Vite builds static assets to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Database**: Drizzle migrations applied via `db:push` command
- **Deployment**: Single server deployment with Express serving static files

### Environment Configuration
- **Database URL**: PostgreSQL connection string
- **Node Environment**: Development/production mode switching
- **Build Process**: Concurrent frontend and backend building

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- July 07, 2025. Initial setup