import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, Play, DollarSign } from 'lucide-react'

const Poker = ({ balance, setBalance }) => {
  const [deck, setDeck] = useState([])
  const [playerHand, setPlayerHand] = useState([])
  const [dealerHand, setDealerHand] = useState([])
  const [gameState, setGameState] = useState('betting') // betting, playing, finished
  const [bet, setBet] = useState(0)
  const [message, setMessage] = useState('Place your bet!')
  const [playerHandRank, setPlayerHandRank] = useState('')
  const [dealerHandRank, setDealerHandRank] = useState('')
  const [selectedCards, setSelectedCards] = useState([])

  // Create a fresh deck
  const createDeck = () => {
    const suits = ['♠', '♥', '♦', '♣']
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
    const newDeck = []
    
    for (let suit of suits) {
      for (let value of values) {
        newDeck.push({ 
          suit, 
          value, 
          id: `${suit}-${value}`,
          numericValue: getNumericValue(value)
        })
      }
    }
    
    return shuffleDeck(newDeck)
  }

  // Get numeric value for comparison
  const getNumericValue = (value) => {
    if (value === 'A') return 14
    if (value === 'K') return 13
    if (value === 'Q') return 12
    if (value === 'J') return 11
    return parseInt(value)
  }

  // Shuffle deck
  const shuffleDeck = (deck) => {
    const shuffled = [...deck]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Evaluate hand rank
  const evaluateHand = (hand) => {
    const values = hand.map(card => card.numericValue).sort((a, b) => b - a)
    const suits = hand.map(card => card.suit)
    const isFlush = suits.every(suit => suit === suits[0])
    const isStraight = values.every((val, i) => i === 0 || val === values[i-1] - 1)
    
    // Count occurrences of each value
    const counts = {}
    values.forEach(val => counts[val] = (counts[val] || 0) + 1)
    const countValues = Object.values(counts).sort((a, b) => b - a)
    
    if (isFlush && isStraight) {
      return values[0] === 14 ? 'Royal Flush' : 'Straight Flush'
    }
    if (countValues[0] === 4) return 'Four of a Kind'
    if (countValues[0] === 3 && countValues[1] === 2) return 'Full House'
    if (isFlush) return 'Flush'
    if (isStraight) return 'Straight'
    if (countValues[0] === 3) return 'Three of a Kind'
    if (countValues[0] === 2 && countValues[1] === 2) return 'Two Pair'
    if (countValues[0] === 2) return 'One Pair'
    return 'High Card'
  }

  // Get hand rank value for comparison
  const getHandRankValue = (rank) => {
    const ranks = {
      'High Card': 1,
      'One Pair': 2,
      'Two Pair': 3,
      'Three of a Kind': 4,
      'Straight': 5,
      'Flush': 6,
      'Full House': 7,
      'Four of a Kind': 8,
      'Straight Flush': 9,
      'Royal Flush': 10
    }
    return ranks[rank] || 0
  }

  // Deal initial cards
  const dealInitialCards = () => {
    const newDeck = createDeck()
    const player = [newDeck.pop(), newDeck.pop(), newDeck.pop(), newDeck.pop(), newDeck.pop()]
    const dealer = [newDeck.pop(), newDeck.pop(), newDeck.pop(), newDeck.pop(), newDeck.pop()]
    
    setDeck(newDeck)
    setPlayerHand(player)
    setDealerHand(dealer)
    setGameState('playing')
    setMessage('Select cards to discard, then draw new ones!')
    setSelectedCards([])
  }

  // Start new game
  const startNewGame = () => {
    if (bet <= 0) {
      setMessage('Please place a bet first!')
      return
    }
    if (bet > balance) {
      setMessage('Insufficient balance!')
      return
    }
    
    setBalance(balance - bet)
    dealInitialCards()
  }

  // Toggle card selection
  const toggleCardSelection = (index) => {
    if (gameState !== 'playing') return
    
    setSelectedCards(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  // Draw new cards
  const drawNewCards = () => {
    if (selectedCards.length === 0) {
      setMessage('Select cards to discard first!')
      return
    }
    
    const newPlayerHand = [...playerHand]
    const newDeck = [...deck]
    
    // Replace selected cards
    selectedCards.forEach((index, i) => {
      newPlayerHand[index] = newDeck.pop()
    })
    
    setPlayerHand(newPlayerHand)
    setDeck(newDeck)
    setGameState('finished')
    setMessage('Final hand!')
    
    // Evaluate hands
    const playerRank = evaluateHand(newPlayerHand)
    const dealerRank = evaluateHand(dealerHand)
    
    setPlayerHandRank(playerRank)
    setDealerHandRank(dealerRank)
    
    // Determine winner
    const playerValue = getHandRankValue(playerRank)
    const dealerValue = getHandRankValue(dealerRank)
    
    if (playerValue > dealerValue) {
      setMessage(`You win! ${playerRank} beats ${dealerRank}`)
      setBalance(balance + bet * 2)
    } else if (playerValue < dealerValue) {
      setMessage(`Dealer wins! ${dealerRank} beats ${playerRank}`)
    } else {
      setMessage(`Push! Both have ${playerRank}`)
      setBalance(balance + bet)
    }
  }

  // Reset game
  const resetGame = () => {
    setPlayerHand([])
    setDealerHand([])
    setGameState('betting')
    setBet(0)
    setMessage('Place your bet!')
    setPlayerHandRank('')
    setDealerHandRank('')
    setSelectedCards([])
  }

  return (
    <div className="poker-game">
      <div className="game-header">
        <h2>5-Card Draw Poker</h2>
        <div className="game-info">
          <span>Balance: ${balance.toLocaleString()}</span>
          <span>Bet: ${bet}</span>
        </div>
      </div>

      <div className="game-area">
        {/* Dealer Area */}
        <div className="dealer-area">
          <h3>Dealer {dealerHandRank && `(${dealerHandRank})`}</h3>
          <div className="hand">
            {dealerHand.map((card, index) => (
              <motion.div
                key={`${card.id}-${index}`}
                className="card"
                initial={{ rotateY: 180 }}
                animate={{ rotateY: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {`${card.value}${card.suit}`}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Game Message */}
        <div className="game-message">
          <h3>{message}</h3>
        </div>

        {/* Player Area */}
        <div className="player-area">
          <h3>Player {playerHandRank && `(${playerHandRank})`}</h3>
          <div className="hand">
            {playerHand.map((card, index) => (
              <motion.div
                key={`${card.id}-${index}`}
                className={`card ${selectedCards.includes(index) ? 'selected' : ''}`}
                initial={{ rotateY: 180 }}
                animate={{ rotateY: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => toggleCardSelection(index)}
              >
                {`${card.value}${card.suit}`}
              </motion.div>
            ))}
          </div>
          {gameState === 'playing' && (
            <p className="instruction">Click cards to select for discarding</p>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="game-controls">
        {gameState === 'betting' && (
          <div className="betting-controls">
            <div className="bet-input">
              <label>Bet Amount:</label>
              <input
                type="number"
                value={bet}
                onChange={(e) => setBet(Number(e.target.value))}
                min="1"
                max={balance}
                step="1"
              />
            </div>
            <button onClick={startNewGame} className="deal-button">
              <Play size={20} />
              Deal Cards
            </button>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="playing-controls">
            <button 
              onClick={drawNewCards} 
              className="draw-button"
              disabled={selectedCards.length === 0}
            >
              <DollarSign size={20} />
              Draw New Cards
            </button>
          </div>
        )}

        {gameState === 'finished' && (
          <button onClick={resetGame} className="new-game-button">
            <RotateCcw size={20} />
            New Game
          </button>
        )}
      </div>
    </div>
  )
}

export default Poker
