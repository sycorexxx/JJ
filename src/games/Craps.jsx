import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, Play, Dice6 } from 'lucide-react'

const Craps = ({ balance, setBalance }) => {
  const [gameState, setGameState] = useState('betting') // betting, rolling, finished
  const [bets, setBets] = useState({ pass: 0, dontPass: 0, come: 0, dontCome: 0, field: 0, any7: 0, any11: 0, any12: 0 })
  const [dice, setDice] = useState([1, 1])
  const [message, setMessage] = useState('Place your bets!')
  const [point, setPoint] = useState(null)
  const [comeOutRoll, setComeOutRoll] = useState(true)
  const [lastRoll, setLastRoll] = useState(null)

  // Bet types and their payouts
  const betTypes = {
    'pass': { payout: 1, description: 'Pass Line' },
    'dontPass': { payout: 1, description: "Don't Pass" },
    'come': { payout: 1, description: 'Come' },
    'dontCome': { payout: 1, description: "Don't Come" },
    'field': { payout: 1, description: 'Field' },
    'any7': { payout: 4, description: 'Any 7' },
    'any11': { payout: 15, description: 'Any 11' },
    'any12': { payout: 30, description: 'Any 12' }
  }

  // Roll the dice
  const rollDice = () => {
    const die1 = Math.floor(Math.random() * 6) + 1
    const die2 = Math.floor(Math.random() * 6) + 1
    const total = die1 + die2
    
    setDice([die1, die2])
    setLastRoll(total)
    
    return total
  }

  // Place bet
  const placeBet = (betType, amount) => {
    if (gameState !== 'betting') return
    if (amount <= 0) return
    if (Object.values(bets).reduce((sum, bet) => sum + bet, 0) + amount > balance) {
      setMessage('Insufficient balance!')
      return
    }

    setBets(prev => ({
      ...prev,
      [betType]: prev[betType] + amount
    }))
    setMessage(`Bet placed: ${betTypes[betType].description} - $${amount}`)
  }

  // Start new game
  const startNewGame = () => {
    const totalBet = Object.values(bets).reduce((sum, bet) => sum + bet, 0)
    if (totalBet <= 0) {
      setMessage('Please place at least one bet!')
      return
    }
    if (totalBet > balance) {
      setMessage('Insufficient balance!')
      return
    }
    
    setBalance(balance - totalBet)
    setGameState('rolling')
    setMessage('Rolling dice...')
    
    // Roll dice after a short delay
    setTimeout(() => {
      const total = rollDice()
      handleRollResult(total)
    }, 1000)
  }

  // Handle roll result
  const handleRollResult = (total) => {
    let winnings = 0
    let winMessage = ''
    let newPoint = point
    let newComeOutRoll = comeOutRoll

    // Come out roll
    if (comeOutRoll) {
      if (total === 7 || total === 11) {
        // Pass line wins
        if (bets.pass > 0) {
          winnings += bets.pass * 2
          winMessage += `Pass line wins! +$${bets.pass * 2} `
        }
        // Don't pass loses
        if (bets.dontPass > 0) {
          winMessage += `Don't pass loses. `
        }
        setMessage(`🎉 ${winMessage}Roll: ${total} (${dice[0]}, ${dice[1]})`)
        setGameState('finished')
      } else if (total === 2 || total === 3 || total === 12) {
        // Pass line loses
        if (bets.pass > 0) {
          winMessage += `Pass line loses. `
        }
        // Don't pass wins (except on 12)
        if (bets.dontPass > 0 && total !== 12) {
          winnings += bets.dontPass * 2
          winMessage += `Don't pass wins! +$${bets.dontPass * 2} `
        } else if (bets.dontPass > 0 && total === 12) {
          winMessage += `Don't pass pushes on 12. `
        }
        setMessage(`${winMessage}Roll: ${total} (${dice[0]}, ${dice[1]})`)
        setGameState('finished')
      } else {
        // Point is established
        newPoint = total
        newComeOutRoll = false
        setPoint(total)
        setComeOutRoll(false)
        setMessage(`Point is ${total}! Roll again.`)
        setGameState('rolling')
        
        // Roll again after delay
        setTimeout(() => {
          const newTotal = rollDice()
          handlePointRoll(newTotal)
        }, 2000)
      }
    } else {
      // Point roll
      handlePointRoll(total)
    }

    // Handle other bets
    handleOtherBets(total, winnings, winMessage)
  }

  // Handle point roll
  const handlePointRoll = (total) => {
    let winnings = 0
    let winMessage = ''

    if (total === point) {
      // Pass line wins
      if (bets.pass > 0) {
        winnings += bets.pass * 2
        winMessage += `Pass line wins! +$${bets.pass * 2} `
      }
      // Don't pass loses
      if (bets.dontPass > 0) {
        winMessage += `Don't pass loses. `
      }
      setMessage(`🎉 ${winMessage}Point made! Roll: ${total} (${dice[0]}, ${dice[1]})`)
      setGameState('finished')
    } else if (total === 7) {
      // Pass line loses, don't pass wins
      if (bets.pass > 0) {
        winMessage += `Pass line loses. `
      }
      if (bets.dontPass > 0) {
        winnings += bets.dontPass * 2
        winMessage += `Don't pass wins! +$${bets.dontPass * 2} `
      }
      setMessage(`${winMessage}Seven out! Roll: ${total} (${dice[0]}, ${dice[1]})`)
      setGameState('finished')
    } else {
      // Continue rolling
      setMessage(`Roll: ${total} (${dice[0]}, ${dice[1]}). Still need ${point}.`)
      setGameState('rolling')
      
      // Roll again after delay
      setTimeout(() => {
        const newTotal = rollDice()
        handlePointRoll(newTotal)
      }, 2000)
    }

    if (winnings > 0) {
      setBalance(balance + winnings)
    }
  }

  // Handle other bets (field, any 7, etc.)
  const handleOtherBets = (total, winnings, winMessage) => {
    let additionalWinnings = 0
    let additionalMessage = ''

    // Field bet (2, 3, 4, 9, 10, 11, 12)
    if (bets.field > 0) {
      const fieldNumbers = [2, 3, 4, 9, 10, 11, 12]
      if (fieldNumbers.includes(total)) {
        const multiplier = [2, 12].includes(total) ? 2 : 1
        additionalWinnings += bets.field * (multiplier + 1)
        additionalMessage += `Field wins! +$${bets.field * (multiplier + 1)} `
      }
    }

    // Any 7
    if (bets.any7 > 0 && total === 7) {
      additionalWinnings += bets.any7 * 5
      additionalMessage += `Any 7 wins! +$${bets.any7 * 5} `
    }

    // Any 11
    if (bets.any11 > 0 && total === 11) {
      additionalWinnings += bets.any11 * 16
      additionalMessage += `Any 11 wins! +$${bets.any11 * 16} `
    }

    // Any 12
    if (bets.any12 > 0 && total === 12) {
      additionalWinnings += bets.any12 * 31
      additionalMessage += `Any 12 wins! +$${bets.any12 * 31} `
    }

    if (additionalWinnings > 0) {
      setBalance(balance + additionalWinnings)
      setMessage(prev => prev + additionalMessage)
    }
  }

  // Reset game
  const resetGame = () => {
    setGameState('betting')
    setBets({ pass: 0, dontPass: 0, come: 0, dontCome: 0, field: 0, any7: 0, any11: 0, any12: 0 })
    setMessage('Place your bets!')
    setPoint(null)
    setComeOutRoll(true)
    setLastRoll(null)
    setDice([1, 1])
  }

  const totalBet = Object.values(bets).reduce((sum, bet) => sum + bet, 0)

  return (
    <div className="craps-game">
      <div className="game-header">
        <h2>Craps</h2>
        <div className="game-info">
          <span>Balance: ${balance.toLocaleString()}</span>
          <span>Total Bet: ${totalBet}</span>
          {point && <span>Point: {point}</span>}
        </div>
      </div>

      <div className="game-area">
        {/* Dice Display */}
        <div className="dice-area">
          <h3>Dice Roll</h3>
          <div className="dice-container">
            <motion.div 
              className="die"
              animate={{ rotate: [0, 360, 0] }}
              transition={{ duration: 0.5 }}
            >
              {dice[0]}
            </motion.div>
            <motion.div 
              className="die"
              animate={{ rotate: [0, 360, 0] }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {dice[1]}
            </motion.div>
          </div>
          {lastRoll && (
            <div className="roll-total">
              Total: {lastRoll}
            </div>
          )}
        </div>

        {/* Game Message */}
        <div className="game-message">
          <h3>{message}</h3>
        </div>

        {/* Betting Area */}
        <div className="betting-area">
          <div className="betting-grid">
            {/* Main bets */}
            <div className="bet-section">
              <h4>Main Bets</h4>
              <div className="bet-row">
                <div className="bet-option">
                  <span>Pass Line</span>
                  <div className="bet-controls">
                    <button onClick={() => placeBet('pass', 10)} disabled={gameState !== 'betting'}>
                      +$10
                    </button>
                    <span>${bets.pass}</span>
                  </div>
                </div>
                <div className="bet-option">
                  <span>Don't Pass</span>
                  <div className="bet-controls">
                    <button onClick={() => placeBet('dontPass', 10)} disabled={gameState !== 'betting'}>
                      +$10
                    </button>
                    <span>${bets.dontPass}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Field bets */}
            <div className="bet-section">
              <h4>Field Bets</h4>
              <div className="bet-row">
                <div className="bet-option">
                  <span>Field (2,3,4,9,10,11,12)</span>
                  <div className="bet-controls">
                    <button onClick={() => placeBet('field', 10)} disabled={gameState !== 'betting'}>
                      +$10
                    </button>
                    <span>${bets.field}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Proposition bets */}
            <div className="bet-section">
              <h4>Proposition Bets</h4>
              <div className="bet-row">
                <div className="bet-option">
                  <span>Any 7 (4:1)</span>
                  <div className="bet-controls">
                    <button onClick={() => placeBet('any7', 5)} disabled={gameState !== 'betting'}>
                      +$5
                    </button>
                    <span>${bets.any7}</span>
                  </div>
                </div>
                <div className="bet-option">
                  <span>Any 11 (15:1)</span>
                  <div className="bet-controls">
                    <button onClick={() => placeBet('any11', 5)} disabled={gameState !== 'betting'}>
                      +$5
                    </button>
                    <span>${bets.any11}</span>
                  </div>
                </div>
                <div className="bet-option">
                  <span>Any 12 (30:1)</span>
                  <div className="bet-controls">
                    <button onClick={() => placeBet('any12', 5)} disabled={gameState !== 'betting'}>
                      +$5
                    </button>
                    <span>${bets.any12}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="game-controls">
        {gameState === 'betting' && (
          <button onClick={startNewGame} className="roll-button">
            <Dice6 size={20} />
            Roll Dice
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

export default Craps
