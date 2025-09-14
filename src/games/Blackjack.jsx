import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, Play, Pause } from 'lucide-react'

const Blackjack = ({ balance, setBalance }) => {
  const [deck, setDeck] = useState([])
  const [playerHand, setPlayerHand] = useState([])
  const [dealerHand, setDealerHand] = useState([])
  const [gameState, setGameState] = useState('betting') // betting, playing, dealer, finished
  const [bet, setBet] = useState(0)
  const [message, setMessage] = useState('Place your bet!')
  const [playerScore, setPlayerScore] = useState(0)
  const [dealerScore, setDealerScore] = useState(0)

  // Create a fresh deck
  const createDeck = () => {
    const suits = ['♠', '♥', '♦', '♣']
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
    const newDeck = []
    
    for (let suit of suits) {
      for (let value of values) {
        newDeck.push({ suit, value, id: `${suit}-${value}` })
      }
    }
    
    return shuffleDeck(newDeck)
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

  // Calculate hand value
  const calculateHandValue = (hand) => {
    let value = 0
    let aces = 0
    
    for (let card of hand) {
      if (card.value === 'A') {
        aces++
        value += 11
      } else if (['J', 'Q', 'K'].includes(card.value)) {
        value += 10
      } else {
        value += parseInt(card.value)
      }
    }
    
    // Adjust for aces
    while (value > 21 && aces > 0) {
      value -= 10
      aces--
    }
    
    return value
  }

  // Deal initial cards
  const dealInitialCards = () => {
    const newDeck = createDeck()
    const player = [newDeck.pop(), newDeck.pop()]
    const dealer = [newDeck.pop(), newDeck.pop()]
    
    setDeck(newDeck)
    setPlayerHand(player)
    setDealerHand(dealer)
    setGameState('playing')
    setMessage('Hit or Stand?')
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

  // Hit
  const hit = () => {
    if (gameState !== 'playing') return
    
    const newCard = deck.pop()
    const newPlayerHand = [...playerHand, newCard]
    setPlayerHand(newPlayerHand)
    setDeck([...deck])
    
    const newScore = calculateHandValue(newPlayerHand)
    setPlayerScore(newScore)
    
    if (newScore > 21) {
      setGameState('finished')
      setMessage('Bust! You lose!')
    } else if (newScore === 21) {
      setGameState('finished')
      setMessage('Blackjack! You win!')
      setBalance(balance + bet * 2.5)
    }
  }

  // Stand
  const stand = () => {
    if (gameState !== 'playing') return
    
    setGameState('dealer')
    setMessage('Dealer playing...')
    
    // Dealer plays
    setTimeout(() => {
      let newDealerHand = [...dealerHand]
      let dealerValue = calculateHandValue(newDealerHand)
      
      while (dealerValue < 17) {
        const newCard = deck.pop()
        newDealerHand.push(newCard)
        dealerValue = calculateHandValue(newDealerHand)
      }
      
      setDealerHand(newDealerHand)
      setDealerScore(dealerValue)
      
      // Determine winner
      const playerValue = calculateHandValue(playerHand)
      
      if (dealerValue > 21) {
        setMessage('Dealer busts! You win!')
        setBalance(balance + bet * 2)
      } else if (dealerValue > playerValue) {
        setMessage('Dealer wins!')
      } else if (dealerValue < playerValue) {
        setMessage('You win!')
        setBalance(balance + bet * 2)
      } else {
        setMessage('Push! It\'s a tie!')
        setBalance(balance + bet)
      }
      
      setGameState('finished')
    }, 1000)
  }

  // Reset game
  const resetGame = () => {
    setPlayerHand([])
    setDealerHand([])
    setGameState('betting')
    setBet(0)
    setMessage('Place your bet!')
    setPlayerScore(0)
    setDealerScore(0)
  }

  // Update scores when hands change
  useEffect(() => {
    if (playerHand.length > 0) {
      setPlayerScore(calculateHandValue(playerHand))
    }
    if (dealerHand.length > 0) {
      setDealerScore(calculateHandValue(dealerHand))
    }
  }, [playerHand, dealerHand])

  return (
    <div className="blackjack-game">
      <div className="game-header">
        <h2>Blackjack</h2>
        <div className="game-info">
          <span>Balance: ${balance.toLocaleString()}</span>
          <span>Bet: ${bet}</span>
        </div>
      </div>

      <div className="game-area">
        {/* Dealer Area */}
        <div className="dealer-area">
          <h3>Dealer {dealerScore > 0 && `(${dealerScore})`}</h3>
          <div className="hand">
            {dealerHand.map((card, index) => (
              <motion.div
                key={`${card.id}-${index}`}
                className={`card ${index === 1 && gameState === 'playing' ? 'hidden' : ''}`}
                initial={{ rotateY: 180 }}
                animate={{ rotateY: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                {index === 1 && gameState === 'playing' ? '?' : `${card.value}${card.suit}`}
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
          <h3>Player ({playerScore})</h3>
          <div className="hand">
            {playerHand.map((card, index) => (
              <motion.div
                key={`${card.id}-${index}`}
                className="card"
                initial={{ rotateY: 180 }}
                animate={{ rotateY: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                {`${card.value}${card.suit}`}
              </motion.div>
            ))}
          </div>
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
            <button onClick={hit} className="hit-button">
              Hit
            </button>
            <button onClick={stand} className="stand-button">
              Stand
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

export default Blackjack
