"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Scissors, RotateCcw } from "lucide-react"

interface RockPaperScissorsProps {
  onGameEnd: (gameType: string, score: number, result: string) => void
}

type Choice = "rock" | "paper" | "scissors"

export function RockPaperScissors({ onGameEnd }: RockPaperScissorsProps) {
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null)
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null)
  const [result, setResult] = useState("")
  const [score, setScore] = useState({ player: 0, computer: 0 })
  const [gameHistory, setGameHistory] = useState<string[]>([])

  const choices: Choice[] = ["rock", "paper", "scissors"]

  const getEmoji = (choice: Choice) => {
    switch (choice) {
      case "rock":
        return "🪨"
      case "paper":
        return "📄"
      case "scissors":
        return "✂️"
    }
  }

  const getWinner = (player: Choice, computer: Choice): "player" | "computer" | "tie" => {
    if (player === computer) return "tie"

    if (
      (player === "rock" && computer === "scissors") ||
      (player === "paper" && computer === "rock") ||
      (player === "scissors" && computer === "paper")
    ) {
      return "player"
    }

    return "computer"
  }

  const playRound = (playerChoice: Choice) => {
    const computerChoice = choices[Math.floor(Math.random() * choices.length)]
    const winner = getWinner(playerChoice, computerChoice)

    setPlayerChoice(playerChoice)
    setComputerChoice(computerChoice)

    let resultMessage = ""
    const newScore = { ...score }

    if (winner === "player") {
      resultMessage = "You win this round!"
      newScore.player += 1
    } else if (winner === "computer") {
      resultMessage = "Computer wins this round!"
      newScore.computer += 1
    } else {
      resultMessage = "It's a tie!"
    }

    setResult(resultMessage)
    setScore(newScore)
    setGameHistory((prev) => [...prev, `${getEmoji(playerChoice)} vs ${getEmoji(computerChoice)} - ${resultMessage}`])

    // Save game result
    onGameEnd(
      "rock-paper-scissors",
      newScore.player,
      winner === "player" ? "win" : winner === "computer" ? "loss" : "tie",
    )
  }

  const resetGame = () => {
    setPlayerChoice(null)
    setComputerChoice(null)
    setResult("")
    setScore({ player: 0, computer: 0 })
    setGameHistory([])
  }

  return (
    <div className="max-w-2xl mx-auto animate-slide-up">
      <Card className="bg-white/90 backdrop-blur-sm border-olive-200">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-olive-500 to-olive-700 flex items-center justify-center mb-4">
            <Scissors className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-olive-800">Rock Paper Scissors</CardTitle>
          <CardDescription>Choose your weapon and battle the computer!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-olive-800 mb-2">Score</h3>
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-olive-600">{score.player}</p>
                <p className="text-olive-700">You</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-olive-600">{score.computer}</p>
                <p className="text-olive-700">Computer</p>
              </div>
            </div>
          </div>

          {/* Game Area */}
          {playerChoice && computerChoice && (
            <div className="text-center space-y-4">
              <div className="flex justify-center items-center space-x-8">
                <div className="text-center">
                  <div className="text-6xl mb-2">{getEmoji(playerChoice)}</div>
                  <p className="text-olive-700">You</p>
                </div>
                <div className="text-2xl text-olive-600">VS</div>
                <div className="text-center">
                  <div className="text-6xl mb-2">{getEmoji(computerChoice)}</div>
                  <p className="text-olive-700">Computer</p>
                </div>
              </div>
              <p className="text-lg font-semibold text-olive-800">{result}</p>
            </div>
          )}

          {/* Choice Buttons */}
          <div className="grid grid-cols-3 gap-4">
            {choices.map((choice) => (
              <Button
                key={choice}
                onClick={() => playRound(choice)}
                className="h-20 text-4xl bg-olive-100 hover:bg-olive-200 text-olive-800 border-2 border-olive-300 hover:border-olive-400"
                variant="outline"
              >
                {getEmoji(choice)}
              </Button>
            ))}
          </div>

          {/* Game History */}
          {gameHistory.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-olive-800">Recent Rounds:</h4>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {gameHistory.slice(-5).map((round, index) => (
                  <p key={index} className="text-sm text-olive-600 bg-olive-50 p-2 rounded">
                    {round}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Reset Button */}
          <div className="text-center">
            <Button
              onClick={resetGame}
              variant="outline"
              className="border-olive-600 text-olive-600 hover:bg-olive-50 bg-transparent"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Game
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
