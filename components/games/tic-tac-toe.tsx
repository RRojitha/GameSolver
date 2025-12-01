"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Grid3X3, RotateCcw } from "lucide-react"

interface TicTacToeProps {
  onGameEnd: (gameType: string, score: number, result: string) => void
}

type Player = "X" | "O" | null
type Board = Player[]

export function TicTacToe({ onGameEnd }: TicTacToeProps) {
  const [board, setBoard] = useState<Board>(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X")
  const [winner, setWinner] = useState<Player | "tie" | null>(null)
  const [score, setScore] = useState({ X: 0, O: 0, ties: 0 })

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // columns
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ]

  const checkWinner = (board: Board): Player | "tie" | null => {
    // Check for winner
    for (const combination of winningCombinations) {
      const [a, b, c] = combination
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]
      }
    }

    // Check for tie
    if (board.every((cell) => cell !== null)) {
      return "tie"
    }

    return null
  }

  const handleCellClick = (index: number) => {
    if (board[index] || winner) return

    const newBoard = [...board]
    newBoard[index] = currentPlayer
    setBoard(newBoard)

    const gameResult = checkWinner(newBoard)
    if (gameResult) {
      setWinner(gameResult)
      const newScore = { ...score }

      if (gameResult === "tie") {
        newScore.ties += 1
        onGameEnd("tic-tac-toe", 0, "tie")
      } else {
        newScore[gameResult] += 1
        onGameEnd("tic-tac-toe", gameResult === "X" ? 1 : 0, gameResult === "X" ? "win" : "loss")
      }

      setScore(newScore)
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X")
    }
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setCurrentPlayer("X")
    setWinner(null)
  }

  const resetScore = () => {
    setScore({ X: 0, O: 0, ties: 0 })
    resetGame()
  }

  const getCellContent = (cell: Player) => {
    if (cell === "X") return "❌"
    if (cell === "O") return "⭕"
    return ""
  }

  const getStatusMessage = () => {
    if (winner === "tie") return "It's a tie! 🤝"
    if (winner) return `Player ${winner} wins! 🎉`
    return `Player ${currentPlayer}'s turn`
  }

  return (
    <div className="max-w-2xl mx-auto animate-slide-up">
      <Card className="bg-white/90 backdrop-blur-sm border-olive-200">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-olive-400 to-olive-600 flex items-center justify-center mb-4">
            <Grid3X3 className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-olive-800">Tic-Tac-Toe</CardTitle>
          <CardDescription>Strategic two-player game - get three in a row!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-olive-800 mb-2">Score</h3>
            <div className="flex justify-center space-x-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-olive-600">{score.X}</p>
                <p className="text-olive-700">Player X</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-olive-600">{score.ties}</p>
                <p className="text-olive-700">Ties</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-olive-600">{score.O}</p>
                <p className="text-olive-700">Player O</p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="text-center">
            <p className="text-lg font-semibold text-olive-800">{getStatusMessage()}</p>
          </div>

          {/* Game Board */}
          <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
            {board.map((cell, index) => (
              <Button
                key={index}
                onClick={() => handleCellClick(index)}
                className="h-20 w-20 text-3xl bg-olive-100 hover:bg-olive-200 text-olive-800 border-2 border-olive-300 hover:border-olive-400 disabled:opacity-50"
                variant="outline"
                disabled={!!cell || !!winner}
              >
                {getCellContent(cell)}
              </Button>
            ))}
          </div>

          {/* Game Controls */}
          <div className="flex justify-center space-x-4">
            <Button onClick={resetGame} className="bg-olive-600 hover:bg-olive-700 text-white">
              <RotateCcw className="h-4 w-4 mr-2" />
              New Game
            </Button>
            <Button
              onClick={resetScore}
              variant="outline"
              className="border-olive-600 text-olive-600 hover:bg-olive-50 bg-transparent"
            >
              Reset Score
            </Button>
          </div>

          {/* Winner Animation */}
          {winner && (
            <div className="text-center animate-pulse">
              <div className="text-6xl mb-2">{winner === "tie" ? "🤝" : "🏆"}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
