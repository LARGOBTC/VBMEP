# Vegas Bets - Jiu-Jitsu & MMA Betting Platform

A modern, decentralized betting platform built specifically for jiu-jitsu and MMA matches on the PulseChain blockchain. Features real-time betting, YouTube livestream integration, and smart contract-based fund management.

## 🥋 Features

- **Wallet Integration**: Connect with MetaMask or Coinbase Wallet
- **PulseChain Blockchain**: Built on PulseChain for fast, low-cost transactions
- **Live Betting**: Real-time betting on active jiu-jitsu and MMA matches
- **YouTube Integration**: Watch live matches directly in the platform
- **Smart Contracts**: Automated bet placement and winnings distribution
- **Admin Panel**: Event management and winner declaration
- **Real-time Updates**: Live betting statistics and recent bet feeds
- **Responsive Design**: Mobile-optimized purple and gold themed UI

## 🏗️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Radix UI** components with shadcn/ui
- **TanStack Query** for server state management
- **Wouter** for lightweight routing
- **Ethers.js** for blockchain interactions

### Backend
- **Node.js** with Express.js
- **TypeScript** with ESM modules
- **PostgreSQL** with Drizzle ORM
- **Neon Database** (serverless PostgreSQL)
- **Session management** with PostgreSQL storage

### Blockchain
- **PulseChain** network
- **Smart contracts** for bet management
- **Wallet providers**: MetaMask, Coinbase Wallet

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- MetaMask or Coinbase Wallet browser extension

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/vegas-bets.git
   cd vegas-bets
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   NODE_ENV=development
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

## 📁 Project Structure

```
vegas-bets/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route pages
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions and configs
│   │   └── ...
├── server/                 # Express backend
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database operations
│   └── db.ts              # Database connection
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema
└── ...
```

## 🎯 Core Functionality

### User Flow
1. **Connect Wallet**: Users connect their crypto wallet (MetaMask/Coinbase)
2. **View Events**: Browse active jiu-jitsu and MMA betting events
3. **Place Bets**: Select team and amount, confirm transaction
4. **Watch Live**: Stream matches via integrated YouTube player
5. **Win Payouts**: Automatic distribution when admin declares winner

### Admin Features
- Create new betting events
- Declare match winners
- Manage active events
- View betting statistics

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio

## 🌐 API Endpoints

### Events
- `GET /api/events` - Get all events
- `GET /api/events/active` - Get active event
- `GET /api/events/:id/stats` - Get event statistics
- `POST /api/events/declare-winner` - Declare winner (admin only)

### Bets
- `POST /api/bets` - Place a bet
- `GET /api/bets/user/:walletAddress` - Get user's bets

### Users
- `GET /api/users/admin-check` - Check admin status

## 🎨 Design Theme

The platform features a modern purple and gold color scheme:
- **Primary Purple**: `#6B46C1` for main UI elements
- **Dark Purple**: `#1E1033` for headers and footers
- **Gold Accent**: `#FFD700` for highlights and actions
- **Clean Typography**: Montserrat font for headings

## 🔒 Security Features

- Wallet-based authentication
- Smart contract validation
- Input sanitization
- CORS protection
- Session management
- Admin role verification

## 📱 Mobile Responsive

Fully responsive design optimized for:
- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
Set these in your production environment:
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV=production`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

This platform is for entertainment purposes. Gambling involves risk. Please gamble responsibly and within your means. Users must comply with local laws and regulations regarding online betting.

## 🆘 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

Built with ❤️ for the jiu-jitsu and MMA community