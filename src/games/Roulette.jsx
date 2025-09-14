import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, Play, Target } from 'lucide-react'

const Roulette = ({ balance, setBalance }) => {
  const [gameState, setGameState] = useState('betting') // betting, spinning, finished
  const [bets, setBets] = useState({})
  const [winningNumber, setWinningNumber] = useState(null)
  const [message, setMessage] = useState('Place your bets!')
  const [totalBet, setTotalBet] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)

  // Roulette numbers (0-36)
  const numbers = [
    { num: 0, color: 'green' },
    { num: 1, color: 'red' }, { num: 2, color: 'black' }, { num: 3, color: 'red' },
    { num: 4, color: 'black' }, { num: 5, color: 'red' }, { num: 6, color: 'black' },
    { num: 7, color: 'red' }, { num: 8, color: 'black' }, { num: 9, color: 'red' },
    { num: 10, color: 'black' }, { num: 11, color: 'black' }, { num: 12, color: 'red' },
    { num: 13, color: 'black' }, { num: 14, color: 'red' }, { num: 15, color: 'black' },
    { num: 16, color: 'red' }, { num: 17, color: 'black' }, { num: 18, color: 'red' },
    { num: 19, color: 'red' }, { num: 20, color: 'black' }, { num: 21, color: 'red' },
    { num: 22, color: 'black' }, { num: 23, color: 'red' }, { num: 24, color: 'black' },
    { num: 25, color: 'red' }, { num: 26, color: 'black' }, { num: 27, color: 'red' },
    { num: 28, color: 'black' }, { num: 29, color: 'black' }, { num: 30, color: 'red' },
    { num: 31, color: 'black' }, { num: 32, color: 'red' }, { num: 33, color: 'black' },
    { num: 34, color: 'red' }, { num: 35, color: 'black' }, { num: 36, color: 'red' }
  ]

  // Bet types and their payouts
  const betTypes = {
    'straight': { payout: 35, description: 'Single Number' },
    'red': { payout: 1, description: 'Red' },
    'black': { payout: 1, description: 'Black' },
    'even': { payout: 1, description: 'Even' },
    'odd': { payout: 1, description: 'Odd' },
    'low': { payout: 1, description: '1-18' },
    'high': { payout: 1, description: '19-36' },
    'dozen1': { payout: 2, description: '1st 12' },
    'dozen2': { payout: 2, description: '2nd 12' },
    'dozen3': { payout: 2, description: '3rd 12' },
    'column1': { payout: 2, description: '1st Column' },
    'column2': { payout: 2, description: '2nd Column' },
    'column3': { payout: 2, description: '3rd Column' }
  }

  // Place bet
  const placeBet = (betType, amount) => {
    if (gameState !== 'betting') return
    if (amount <= 0) return
    if (totalBet + amount > balance) {
      setMessage('Insufficient balance!')
      return
    }

    setBets(prev => ({
      ...prev,
      [betType]: (prev[betType] || 0) + amount
    }))
    setTotalBet(prev => prev + amount)
    setMessage(`Bet placed: ${betTypes[betType].description} - $${amount}`)
  }

  // Spin the wheel
  const spinWheel = () => {
    if (totalBet === 0) {
      setMessage('Place at least one bet!')
      return
    }

    setGameState('spinning')
    setIsSpinning(true)
    setMessage('Spinning...')
    
    // Simulate spinning delay
    setTimeout(() => {
      const randomNumber = Math.floor(Math.random() * 37)
      setWinningNumber(randomNumber)
      setGameState('finished')
      setIsSpinning(false)
      
      // Calculate winnings
      calculateWinnings(randomNumber)
    }, 3000)
  }

  // Calculate winnings
  const calculateWinnings = (winNum) => {
    const winningNumberData = numbers.find(n => n.num === winNum)
    let totalWinnings = 0
    let winDetails = []

    Object.entries(bets).forEach(([betType, amount]) => {
      let won = false
      
      switch (betType) {
        case 'straight':
          // This would need a specific number selection - simplified for demo
          break
        case 'red':
          won = winningNumberData.color === 'red'
          break
        case 'black':
          won = winningNumberData.color === 'black'
          break
        case 'even':
          won = winNum !== 0 && winNum % 2 === 0
          break
        case 'odd':
          won = winNum % 2 === 1
          break
        case 'low':
          won = winNum >= 1 && winNum <= 18
          break
        case 'high':
          won = winNum >= 19 && winNum <= 36
          break
        case 'dozen1':
          won = winNum >= 1 && winNum <= 12
          break
        case 'dozen2':
          won = winNum >= 13 && winNum <= 24
          break
        case 'dozen3':
          won = winNum >= 25 && winNum <= 36
          break
        case 'column1':
          won = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34].includes(winNum)
          break
        case 'column2':
          won = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35].includes(winNum)
          break
        case 'column3':
          won = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36].includes(winNum)
          break
      }

      if (won) {
        const winnings = amount * (betTypes[betType].payout + 1)
        totalWinnings += winnings
        winDetails.push(`${betTypes[betType].description}: +$${winnings}`)
      }
    })

    const netResult = totalWinnings - totalBet
    setBalance(balance + netResult)
    
    if (totalWinnings > 0) {
      setMessage(`Winning number: ${winNum} (${winningNumberData.color})! You won $${totalWinnings}!`)
    } else {
      setMessage(`Winning number: ${winNum} (${winningNumberData.color}). Better luck next time!`)
    }
  }

  // Reset game
  const resetGame = () => {
    setBets({})
    setTotalBet(0)
    setWinningNumber(null)
    setGameState('betting')
    setMessage('Place your bets!')
    setIsSpinning(false)
  }

  // Clear all bets
  const clearBets = () => {
    setBets({})
    setTotalBet(0)
    setMessage('Bets cleared!')
  }

  return (
    <div className="roulette-game">
      <div className="game-header">
        <h2>Roulette</h2>
        <div className="game-info">
          <span>Balance: ${balance.toLocaleString()}</span>
          <span>Total Bet: ${totalBet}</span>
        </div>
      </div>

      <div className="game-area">
        {/* Roulette Wheel */}
        <div className="roulette-wheel">
          <motion.div 
            className={`wheel ${isSpinning ? 'spinning' : ''}`}
            animate={{ rotate: isSpinning ? 3600 : 0 }}
            transition={{ duration: 3, ease: "easeOut" }}
          >
            <div className="wheel-center">
              {winningNumber !== null && (
                <div className="winning-number">
                  {winningNumber}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Game Message */}
        <div className="game-message">
          <h3>{message}</h3>
        </div>

        {/* Betting Area */}
        <div className="betting-area">
          <div className="betting-grid">
            {/* Color bets */}
            <div className="bet-section">
              <h4>Colors</h4>
              <div className="bet-row">
                <button 
                  className="bet-button red"
                  onClick={() => placeBet('red', 10)}
                  disabled={gameState !== 'betting'}
                >
                  Red
                </button>
                <button 
                  className="bet-button black"
                  onClick={() => placeBet('black', 10)}
                  disabled={gameState !== 'betting'}
                >
                  Black
                </button>
              </div>
            </div>

            {/* Even/Odd bets */}
            <div className="bet-section">
              <h4>Even/Odd</h4>
              <div className="bet-row">
                <button 
                  className="bet-button"
                  onClick={() => placeBet('even', 10)}
                  disabled={gameState !== 'betting'}
                >
                  Even
                </button>
                <button 
                  className="bet-button"
                  onClick={() => placeBet('odd', 10)}
                  disabled={gameState !== 'betting'}
                >
                  Odd
                </button>
              </div>
            </div>

            {/* High/Low bets */}
            <div className="bet-section">
              <h4>High/Low</h4>
              <div className="bet-row">
                <button 
                  className="bet-button"
                  onClick={() => placeBet('low', 10)}
                  disabled={gameState !== 'betting'}
                >
                  1-18
                </button>
                <button 
                  className="bet-button"
                  onClick={() => placeBet('high', 10)}
                  disabled={gameState !== 'betting'}
                >
                  19-36
                </button>
              </div>
            </div>

            {/* Dozen bets */}
            <div className="bet-section">
              <h4>Dozens</h4>
              <div className="bet-row">
                <button 
                  className="bet-button"
                  onClick={() => placeBet('dozen1', 10)}
                  disabled={gameState !== 'betting'}
                >
                  1st 12
                </button>
                <button 
                  className="bet-button"
                  onClick={() => placeBet('dozen2', 10)}
                  disabled={gameState !== 'betting'}
                >
                  2nd 12
                </button>
                <button 
                  className="bet-button"
                  onClick={() => placeBet('dozen3', 10)}
                  disabled={gameState !== 'betting'}
                >
                  3rd 12
                </button>
              </div>
            </div>
          </div>

          {/* Current Bets */}
          <div className="current-bets">
            <h4>Current Bets</h4>
            {Object.keys(bets).length === 0 ? (
              <p>No bets placed</p>
            ) : (
              <div className="bets-list">
                {Object.entries(bets).map(([betType, amount]) => (
                  <div key={betType} className="bet-item">
                    <span>{betTypes[betType].description}: ${amount}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="game-controls">
        {gameState === 'betting' && (
          <div className="betting-controls">
            <button onClick={clearBets} className="clear-button">
              Clear Bets
            </button>
            <button onClick={spinWheel} className="spin-button">
              <Target size={20} />
              Spin Wheel
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

export default Roulette
