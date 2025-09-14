import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, Play, Zap } from 'lucide-react'

const SlotMachine = ({ balance, setBalance }) => {
  const [reels, setReels] = useState([['🍒', '🍒', '🍒'], ['🍒', '🍒', '🍒'], ['🍒', '🍒', '🍒']])
  const [gameState, setGameState] = useState('betting') // betting, spinning, finished
  const [bet, setBet] = useState(0)
  const [message, setMessage] = useState('Place your bet!')
  const [isSpinning, setIsSpinning] = useState(false)
  const [lastWin, setLastWin] = useState(0)

  // Slot symbols with their values
  const symbols = [
    { symbol: '🍒', value: 1, name: 'Cherry' },
    { symbol: '🍋', value: 2, name: 'Lemon' },
    { symbol: '🍊', value: 3, name: 'Orange' },
    { symbol: '🍇', value: 4, name: 'Grape' },
    { symbol: '🍓', value: 5, name: 'Strawberry' },
    { symbol: '🍎', value: 6, name: 'Apple' },
    { symbol: '💎', value: 10, name: 'Diamond' },
    { symbol: '7️⃣', value: 20, name: 'Seven' },
    { symbol: '⭐', value: 50, name: 'Star' }
  ]

  // Get random symbol
  const getRandomSymbol = () => {
    return symbols[Math.floor(Math.random() * symbols.length)]
  }

  // Spin the reels
  const spinReels = () => {
    if (bet <= 0) {
      setMessage('Please place a bet first!')
      return
    }
    if (bet > balance) {
      setMessage('Insufficient balance!')
      return
    }

    setGameState('spinning')
    setIsSpinning(true)
    setMessage('Spinning...')
    setBalance(balance - bet)

    // Animate spinning
    const spinInterval = setInterval(() => {
      setReels([
        [getRandomSymbol().symbol, getRandomSymbol().symbol, getRandomSymbol().symbol],
        [getRandomSymbol().symbol, getRandomSymbol().symbol, getRandomSymbol().symbol],
        [getRandomSymbol().symbol, getRandomSymbol().symbol, getRandomSymbol().symbol]
      ])
    }, 100)

    // Stop spinning after 2 seconds
    setTimeout(() => {
      clearInterval(spinInterval)
      
      // Set final reels
      const finalReels = [
        [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
        [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()],
        [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]
      ]
      
      setReels(finalReels.map(reel => reel.map(symbol => symbol.symbol)))
      setIsSpinning(false)
      setGameState('finished')
      
      // Check for wins
      checkWins(finalReels)
    }, 2000)
  }

  // Check for winning combinations
  const checkWins = (finalReels) => {
    let totalWin = 0
    let winMessage = ''

    // Check horizontal lines
    for (let i = 0; i < 3; i++) {
      const line = finalReels[i]
      if (line[0].symbol === line[1].symbol && line[1].symbol === line[2].symbol) {
        const symbolValue = line[0].value
        const winAmount = symbolValue * bet * 10
        totalWin += winAmount
        winMessage += `${line[0].name} line win: $${winAmount}! `
      }
    }

    // Check vertical lines
    for (let i = 0; i < 3; i++) {
      if (finalReels[0][i].symbol === finalReels[1][i].symbol && finalReels[1][i].symbol === finalReels[2][i].symbol) {
        const symbolValue = finalReels[0][i].value
        const winAmount = symbolValue * bet * 10
        totalWin += winAmount
        winMessage += `${finalReels[0][i].name} column win: $${winAmount}! `
      }
    }

    // Check diagonal lines
    if (finalReels[0][0].symbol === finalReels[1][1].symbol && finalReels[1][1].symbol === finalReels[2][2].symbol) {
      const symbolValue = finalReels[0][0].value
      const winAmount = symbolValue * bet * 10
      totalWin += winAmount
      winMessage += `${finalReels[0][0].name} diagonal win: $${winAmount}! `
    }

    if (finalReels[0][2].symbol === finalReels[1][1].symbol && finalReels[1][1].symbol === finalReels[2][0].symbol) {
      const symbolValue = finalReels[0][2].value
      const winAmount = symbolValue * bet * 10
      totalWin += winAmount
      winMessage += `${finalReels[0][2].name} diagonal win: $${winAmount}! `
    }

    // Check for any matching symbols (scatter)
    const allSymbols = finalReels.flat()
    const symbolCounts = {}
    allSymbols.forEach(symbol => {
      symbolCounts[symbol.symbol] = (symbolCounts[symbol.symbol] || 0) + 1
    })

    Object.entries(symbolCounts).forEach(([symbol, count]) => {
      if (count >= 3) {
        const symbolData = symbols.find(s => s.symbol === symbol)
        const winAmount = symbolData.value * bet * count
        totalWin += winAmount
        winMessage += `${count} ${symbolData.name}s: $${winAmount}! `
      }
    })

    if (totalWin > 0) {
      setBalance(balance + totalWin)
      setLastWin(totalWin)
      setMessage(`🎉 ${winMessage}Total win: $${totalWin}!`)
    } else {
      setLastWin(0)
      setMessage('No win this time. Try again!')
    }
  }

  // Reset game
  const resetGame = () => {
    setReels([['🍒', '🍒', '🍒'], ['🍒', '🍒', '🍒'], ['🍒', '🍒', '🍒']])
    setGameState('betting')
    setBet(0)
    setMessage('Place your bet!')
    setIsSpinning(false)
    setLastWin(0)
  }

  // Quick bet buttons
  const quickBets = [5, 10, 25, 50, 100]

  return (
    <div className="slot-machine-game">
      <div className="game-header">
        <h2>Slot Machine</h2>
        <div className="game-info">
          <span>Balance: ${balance.toLocaleString()}</span>
          <span>Bet: ${bet}</span>
          {lastWin > 0 && <span className="last-win">Last Win: ${lastWin}</span>}
        </div>
      </div>

      <div className="game-area">
        {/* Slot Machine Display */}
        <div className="slot-machine">
          <div className="machine-frame">
            <div className="reels-container">
              {reels.map((reel, reelIndex) => (
                <div key={reelIndex} className="reel">
                  {reel.map((symbol, symbolIndex) => (
                    <motion.div
                      key={`${reelIndex}-${symbolIndex}`}
                      className="symbol"
                      animate={isSpinning ? { y: [0, -20, 0] } : {}}
                      transition={{ duration: 0.2, repeat: isSpinning ? Infinity : 0 }}
                    >
                      {symbol}
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Game Message */}
        <div className="game-message">
          <h3>{message}</h3>
        </div>

        {/* Pay Table */}
        <div className="pay-table">
          <h4>Pay Table</h4>
          <div className="pay-rows">
            {symbols.map(symbol => (
              <div key={symbol.symbol} className="pay-row">
                <span className="symbol">{symbol.symbol}</span>
                <span className="payout">3x = {symbol.value * 10}x bet</span>
              </div>
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
            <div className="quick-bets">
              {quickBets.map(amount => (
                <button
                  key={amount}
                  className="quick-bet-button"
                  onClick={() => setBet(amount)}
                  disabled={amount > balance}
                >
                  ${amount}
                </button>
              ))}
            </div>
            <button onClick={spinReels} className="spin-button">
              <Zap size={20} />
              Spin!
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

export default SlotMachine
