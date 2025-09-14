import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, Play, Target } from 'lucide-react'

const Baccarat = ({ balance, setBalance }) => {
  const [deck, setDeck] = useState([])
  const [playerHand, setPlayerHand] = useState([])
  const [bankerHand, setBankerHand] = useState([])
  const [gameState, setGameState] = useState('betting') // betting, dealing, finished
  const [bets, setBets] = useState({ player: 0, banker: 0, tie: 0 })
  const [message, setMessage] = useState('Place your bets!')
  const [playerScore, setPlayerScore] = useState(0)
  const [bankerScore, setBankerScore] = useState(0)
  const [winner, setWinner] = useState('')

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
          baccaratValue: getBaccaratValue(value)
        })
      }
    }
    
    return shuffleDeck(newDeck)
  }

  // Get baccarat value (A=1, 2-9=face value, 10/J/Q/K=0)
  const getBaccaratValue = (value) => {
    if (value === 'A') return 1
    if (['J', 'Q', 'K'].includes(value)) return 0
    if (value === '10') return 0
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

  // Calculate baccarat hand value
  const calculateBaccaratValue = (hand) => {
    const total = hand.reduce((sum, card) => sum + card.baccaratValue, 0)
    return total % 10
  }

  // Deal initial cards
  const dealInitialCards = () => {
    const newDeck = createDeck()
    const player = [newDeck.pop(), newDeck.pop()]
    const banker = [newDeck.pop(), newDeck.pop()]
    
    setDeck(newDeck)
    setPlayerHand(player)
    setBankerHand(banker)
    setGameState('dealing')
    setMessage('Cards dealt!')
  }

  // Start new game
  const startNewGame = () => {
    const totalBet = bets.player + bets.banker + bets.tie
    if (totalBet <= 0) {
      setMessage('Please place at least one bet!')
      return
    }
    if (totalBet > balance) {
      setMessage('Insufficient balance!')
      return
    }
    
    setBalance(balance - totalBet)
    dealInitialCards()
  }

  // Determine if third card should be drawn
  const shouldDrawThirdCard = (hand, isPlayer) => {
    const value = calculateBaccaratValue(hand)
    
    if (isPlayer) {
      return value <= 5
    } else {
      // Banker's third card rules are more complex
      const playerValue = calculateBaccaratValue(playerHand)
      const playerThirdCard = playerHand.length > 2 ? playerHand[2].baccaratValue : null
      
      if (value <= 2) return true
      if (value === 3 && playerThirdCard !== 8) return true
      if (value === 4 && [2, 3, 4, 5, 6, 7].includes(playerThirdCard)) return true
      if (value === 5 && [4, 5, 6, 7].includes(playerThirdCard)) return true
      if (value === 6 && [6, 7].includes(playerThirdCard)) return true
      return false
    }
  }

  // Complete the game
  const completeGame = () => {
    let newPlayerHand = [...playerHand]
    let newBankerHand = [...bankerHand]
    let newDeck = [...deck]

    // Player draws third card if needed
    if (shouldDrawThirdCard(newPlayerHand, true)) {
      newPlayerHand.push(newDeck.pop())
    }

    // Banker draws third card if needed
    if (shouldDrawThirdCard(newBankerHand, false)) {
      newBankerHand.push(newDeck.pop())
    }

    setPlayerHand(newPlayerHand)
    setBankerHand(newBankerHand)
    setDeck(newDeck)

    // Calculate final scores
    const finalPlayerScore = calculateBaccaratValue(newPlayerHand)
    const finalBankerScore = calculateBaccaratValue(newBankerHand)

    setPlayerScore(finalPlayerScore)
    setBankerScore(finalBankerScore)

    // Determine winner
    let gameWinner = ''
    if (finalPlayerScore > finalBankerScore) {
      gameWinner = 'player'
    } else if (finalBankerScore > finalPlayerScore) {
      gameWinner = 'banker'
    } else {
      gameWinner = 'tie'
    }

    setWinner(gameWinner)
    setGameState('finished')

    // Calculate winnings
    calculateWinnings(gameWinner, finalPlayerScore, finalBankerScore)
  }

  // Calculate winnings
  const calculateWinnings = (gameWinner, playerScore, bankerScore) => {
    let totalWinnings = 0
    let winMessage = ''

    if (gameWinner === 'player' && bets.player > 0) {
      const winnings = bets.player * 2
      totalWinnings += winnings
      winMessage += `Player wins! You won $${winnings} on player bet. `
    }

    if (gameWinner === 'banker' && bets.banker > 0) {
      const winnings = Math.floor(bets.banker * 1.95) // 5% commission
      totalWinnings += winnings
      winMessage += `Banker wins! You won $${winnings} on banker bet. `
    }

    if (gameWinner === 'tie' && bets.tie > 0) {
      const winnings = bets.tie * 9
      totalWinnings += winnings
      winMessage += `Tie! You won $${winnings} on tie bet. `
    }

    if (totalWinnings > 0) {
      setBalance(balance + totalWinnings)
      setMessage(`🎉 ${winMessage}Final scores: Player ${playerScore}, Banker ${bankerScore}`)
    } else {
      setMessage(`No win. Final scores: Player ${playerScore}, Banker ${bankerScore}`)
    }
  }

  // Place bet
  const placeBet = (betType, amount) => {
    if (gameState !== 'betting') return
    if (amount <= 0) return
    if (bets.player + bets.banker + bets.tie + amount > balance) {
      setMessage('Insufficient balance!')
      return
    }

    setBets(prev => ({
      ...prev,
      [betType]: prev[betType] + amount
    }))
    setMessage(`Bet placed: ${betType} - $${amount}`)
  }

  // Reset game
  const resetGame = () => {
    setPlayerHand([])
    setBankerHand([])
    setGameState('betting')
    setBets({ player: 0, banker: 0, tie: 0 })
    setMessage('Place your bets!')
    setPlayerScore(0)
    setBankerScore(0)
    setWinner('')
  }

  // Update scores when hands change
  useEffect(() => {
    if (playerHand.length > 0) {
      setPlayerScore(calculateBaccaratValue(playerHand))
    }
    if (bankerHand.length > 0) {
      setBankerScore(calculateBaccaratValue(bankerHand))
    }
  }, [playerHand, bankerHand])

  const totalBet = bets.player + bets.banker + bets.tie

  return (
    <div className="baccarat-game">
      <div className="game-header">
        <h2>Baccarat</h2>
        <div className="game-info">
          <span>Balance: ${balance.toLocaleString()}</span>
          <span>Total Bet: ${totalBet}</span>
        </div>
      </div>

      <div className="game-area">
        {/* Banker Area */}
        <div className="banker-area">
          <h3>Banker {bankerScore > 0 && `(${bankerScore})`}</h3>
          <div className="hand">
            {bankerHand.map((card, index) => (
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

        {/* Game Message */}
        <div className="game-message">
          <h3>{message}</h3>
          {winner && (
            <div className={`winner-announcement ${winner}`}>
              {winner.toUpperCase()} WINS!
            </div>
          )}
        </div>

        {/* Player Area */}
        <div className="player-area">
          <h3>Player {playerScore > 0 && `(${playerScore})`}</h3>
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

      {/* Betting Area */}
      <div className="betting-area">
        <div className="betting-options">
          <div className="bet-section">
            <h4>Player Bet</h4>
            <div className="bet-controls">
              <button onClick={() => placeBet('player', 10)} disabled={gameState !== 'betting'}>
                +$10
              </button>
              <button onClick={() => placeBet('player', 25)} disabled={gameState !== 'betting'}>
                +$25
              </button>
              <button onClick={() => placeBet('player', 50)} disabled={gameState !== 'betting'}>
                +$50
              </button>
              <span className="bet-amount">${bets.player}</span>
            </div>
          </div>

          <div className="bet-section">
            <h4>Banker Bet</h4>
            <div className="bet-controls">
              <button onClick={() => placeBet('banker', 10)} disabled={gameState !== 'betting'}>
                +$10
              </button>
              <button onClick={() => placeBet('banker', 25)} disabled={gameState !== 'betting'}>
                +$25
              </button>
              <button onClick={() => placeBet('banker', 50)} disabled={gameState !== 'betting'}>
                +$50
              </button>
              <span className="bet-amount">${bets.banker}</span>
            </div>
          </div>

          <div className="bet-section">
            <h4>Tie Bet</h4>
            <div className="bet-controls">
              <button onClick={() => placeBet('tie', 10)} disabled={gameState !== 'betting'}>
                +$10
              </button>
              <button onClick={() => placeBet('tie', 25)} disabled={gameState !== 'betting'}>
                +$25
              </button>
              <button onClick={() => placeBet('tie', 50)} disabled={gameState !== 'betting'}>
                +$50
              </button>
              <span className="bet-amount">${bets.tie}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="game-controls">
        {gameState === 'betting' && (
          <button onClick={startNewGame} className="deal-button">
            <Play size={20} />
            Deal Cards
          </button>
        )}

        {gameState === 'dealing' && (
          <button onClick={completeGame} className="complete-button">
            <Target size={20} />
            Complete Game
          </button>
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

export default Baccarat
