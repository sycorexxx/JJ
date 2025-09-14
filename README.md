# 🎰 Lucky Casino - React Casino Game

A comprehensive casino game built with React, featuring 6 classic casino games with modern UI and smooth animations.

## 🎮 Games Included

### 1. **Blackjack** 🃏

- Classic 21-card game
- Hit, Stand, and Double Down options
- Real-time score calculation
- Dealer AI with proper rules

### 2. **5-Card Draw Poker** 🂡

- Traditional poker with draw mechanics
- Select cards to discard and draw new ones
- Hand ranking system (Royal Flush, Straight, etc.)
- Player vs Dealer gameplay

### 3. **Roulette** 🎰

- European-style roulette wheel
- Multiple bet types (Red/Black, Even/Odd, Dozens, etc.)
- Animated spinning wheel
- Real-time bet tracking

### 4. **Slot Machine** 🎰

- 3-reel slot machine with 9 symbols
- Multiple pay lines and combinations
- Animated spinning reels
- Progressive jackpot system

### 5. **Baccarat** 🃏

- Traditional baccarat rules
- Player, Banker, and Tie betting options
- Automatic third card rules
- Commission handling

### 6. **Craps** 🎲

- Full craps table experience
- Pass/Don't Pass line betting
- Field bets and proposition bets
- Point system implementation

## ✨ Features

- **Modern UI/UX**: Beautiful casino-themed design with smooth animations
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Real-time Balance**: Track your winnings and losses
- **Game State Management**: Proper game flow and state handling
- **Interactive Elements**: Click, hover, and tap interactions
- **Sound Effects Ready**: Structure in place for audio feedback
- **Settings Panel**: Adjustable starting balance

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd casino-game
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🎯 How to Play

1. **Start with $1000**: Each game session begins with a $1000 balance
2. **Choose Your Game**: Click on any game card from the main lobby
3. **Place Your Bets**: Each game has different betting mechanics
4. **Play and Win**: Follow the game rules to win money
5. **Manage Your Balance**: Keep track of your winnings and losses

## 🛠️ Technical Stack

- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **Framer Motion**: Smooth animations and transitions
- **Lucide React**: Beautiful icons
- **CSS3**: Modern styling with gradients and animations

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── games/              # Individual game components
│   ├── Blackjack.jsx
│   ├── Poker.jsx
│   ├── Roulette.jsx
│   ├── SlotMachine.jsx
│   ├── Baccarat.jsx
│   ├── Craps.jsx
│   └── games.css       # Game-specific styles
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── assets/             # Images, sounds, etc.
├── App.jsx             # Main application component
├── App.css             # Main application styles
└── main.jsx            # Application entry point
```

## 🎨 Customization

### Adding New Games

1. Create a new component in `src/games/`
2. Follow the existing game structure
3. Add the game to the `GAMES` array in `App.jsx`
4. Style the game using the existing CSS patterns

### Modifying Styling

- Main styles: `src/App.css`
- Game-specific styles: `src/games/games.css`
- Uses CSS custom properties for easy theming

### Adding Sound Effects

- Place audio files in `src/assets/sounds/`
- Import and use in game components
- Structure is ready for audio integration

## 🎲 Game Rules

### Blackjack

- Get as close to 21 as possible without going over
- Face cards are worth 10, Aces are 1 or 11
- Beat the dealer's hand to win

### Poker

- Make the best 5-card hand possible
- Select cards to discard and draw new ones
- Higher hand ranks beat lower ones

### Roulette

- Bet on numbers, colors, or groups
- Ball lands on a number 0-36
- Different payouts for different bet types

### Slot Machine

- Match 3 symbols on pay lines
- Different symbols have different values
- Multiple ways to win

### Baccarat

- Bet on Player, Banker, or Tie
- Closest to 9 wins
- Special third card rules apply

### Craps

- Roll two dice and bet on outcomes
- Pass line bets win on 7 or 11
- Point system for continued betting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🎉 Enjoy Playing!

Have fun and good luck at the Lucky Casino! Remember to play responsibly and within your means.

---

Built with ❤️ using React and modern web technologies.
