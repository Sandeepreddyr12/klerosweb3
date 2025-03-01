# RPSLS Web3 Game

A modern Rock Paper Scissors Lizard Spock game built with Web3 technologies and real-time multiplayer capabilities.

 experience [RPSSL-multi player](https://rpsslweb3.vercel.app/) Game

## Features

- **Truly Real-time Multiplayer**: Leverages Firebase Realtime Database to overcome traditional smart contract limitations, delivering instant game state updates
- **Seamless Notifications**: In-game notifications for player moves, game status, and results
- **Smart UI/UX**: 
    - Automatic tab switching based on game state
    - All game features packed in a single window design (no routing)
    - Responsive layout for all devices
    - Multiple game instances support (play different games simultaneously)
- **Detailed Game Information**: Comprehensive game details tab showing game history, moves, and state and winner

## Tech Stack

- **Smart Contract**: Solidity
- **Frontend**: 
    - Next.js with TypeScript
    - EthersJS for Web3 integration
    - Firebase Realtime Database
    - Pure CSS for styling

## Environment Setup

Required environment variable:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development

The project uses Next.js with TypeScript for type safety. All game logic is handled through smart contracts with real-time updates managed by Firebase.
