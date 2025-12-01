"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { Gamepad2, LogOut, Target, Scissors, Grid3X3, Timer } from "lucide-react"
import { NumberGuessingGame } from "@/components/games/number-guessing"
import { RockPaperScissors } from "@/components/games/rock-paper-scissors"
import { TicTacToe } from "@/components/games/tic-tac-toe"
import { ReactionTime } from "@/components/games/reaction-time"

type GameType = "number-guessing" | "rock-paper-scissors" | "tic-tac-toe" | "reaction-time" | null

export default function HomePage() {
  const { user, logout } = useAuth()
  const [currentGame, setCurrentGame] = useState<GameType>(null)

  const games = [
    {
      id: "number-guessing" as const,
      title: "Number Guessing Game",
      description: "Guess the secret number between 1-100",
      icon: Target,
      color: "from-olive-400 to-olive-600",
    },
    {
      id: "rock-paper-scissors" as const,
      title: "Rock Paper Scissors",
      description: "Classic game against the computer",
      icon: Scissors,
      color: "from-olive-500 to-olive-700",
    },
    {
      id: "tic-tac-toe" as const,
      title: "Tic-Tac-Toe",
      description: "Strategic two-player game",
      icon: Grid3X3,
      color: "from-olive-400 to-olive-600",
    },
    {
      id: "reaction-time" as const,
      title: "Reaction Time Tester",
      description: "Test your reflexes and speed",
      icon: Timer,
      color: "from-olive-500 to-olive-700",
    },
  ]

  const saveGameResult = async (gameType: string, score: number, result: string) => {
    try {
      const token = localStorage.getItem("token")
      await fetch("/api/gameplay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          gameType,
          score,
          result,
          timestamp: new Date().toISOString(),
        }),
      })
    } catch (error) {
      console.error("Failed to save game result:", error)
    }
  }

  if (currentGame) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-olive-50 via-olive-100 to-olive-200">
        <header className="flex justify-between items-center p-6 bg-white/50 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <Gamepad2 className="h-8 w-8 text-olive-600" />
            <h1 className="text-2xl font-bold text-olive-800">GameSolver</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setCurrentGame(null)}
              variant="outline"
              className="border-olive-600 text-olive-600 hover:bg-olive-50"
            >
              Back to Games
            </Button>
            <span className="text-olive-700">Welcome, {user?.name}!</span>
            <Button onClick={logout} variant="outline" size="sm">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          {currentGame === "number-guessing" && <NumberGuessingGame onGameEnd={saveGameResult} />}
          {currentGame === "rock-paper-scissors" && <RockPaperScissors onGameEnd={saveGameResult} />}
          {currentGame === "tic-tac-toe" && <TicTacToe onGameEnd={saveGameResult} />}
          {currentGame === "reaction-time" && <ReactionTime onGameEnd={saveGameResult} />}
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-olive-50 via-olive-100 to-olive-200">
      <header className="flex justify-between items-center p-6 bg-white/50 backdrop-blur-sm animate-fade-in">
        <div className="flex items-center space-x-2">
          <Gamepad2 className="h-8 w-8 text-olive-600" />
          <h1 className="text-2xl font-bold text-olive-800">GameSolver</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-olive-700">Welcome, {user?.name}!</span>
          <Button onClick={logout} variant="outline" size="sm">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-4xl font-bold text-olive-800 mb-4">Choose Your Game</h2>
          <p className="text-xl text-olive-600">Select a game to start playing and track your progress</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {games.map((game, index) => {
            const Icon = game.icon
            return (
              <Card
                key={game.id}
                className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white/80 backdrop-blur-sm border-olive-200 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setCurrentGame(game.id)}
              >
                <CardHeader className="text-center">
                  <div
                    className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${game.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-olive-800 group-hover:text-olive-900 transition-colors">
                    {game.title}
                  </CardTitle>
                  <CardDescription className="text-olive-600">{game.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button
                    className="w-full bg-olive-600 hover:bg-olive-700 text-white group-hover:bg-olive-700 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      setCurrentGame(game.id)
                    }}
                  >
                    Play Now
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-olive-200 rounded-full opacity-30 animate-float"></div>
          <div
            className="absolute top-40 right-20 w-16 h-16 bg-olive-300 rounded-full opacity-20 animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute bottom-40 left-20 w-24 h-24 bg-olive-200 rounded-full opacity-25 animate-float"
            style={{ animationDelay: "4s" }}
          ></div>
          <div
            className="absolute bottom-20 right-10 w-18 h-18 bg-olive-300 rounded-full opacity-30 animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>
      </main>
    </div>
  )
}
