"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Timer, RotateCcw } from "lucide-react"

interface ReactionTimeProps {
  onGameEnd: (gameType: string, score: number, result: string) => void
}

type GameState = "waiting" | "ready" | "go" | "clicked" | "too-early"

export function ReactionTime({ onGameEnd }: ReactionTimeProps) {
  const [gameState, setGameState] = useState<GameState>("waiting")
  const [reactionTime, setReactionTime] = useState<number | null>(null)
  const [bestTime, setBestTime] = useState<number | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [recentTimes, setRecentTimes] = useState<number[]>([])

  const startTimeRef = useRef<number>(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const startGame = () => {
    setGameState("ready")
    setReactionTime(null)

    // Random delay between 2-5 seconds
    const delay = Math.random() * 3000 + 2000

    timeoutRef.current = setTimeout(() => {
      setGameState("go")
      startTimeRef.current = Date.now()
    }, delay)
  }

  const handleClick = () => {
    if (gameState === "ready") {
      // Clicked too early
      setGameState("too-early")
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      return
    }

    if (gameState === "go") {
      const endTime = Date.now()
      const reaction = endTime - startTimeRef.current

      setReactionTime(reaction)
      setGameState("clicked")
      setAttempts((prev) => prev + 1)

      // Update best time
      if (!bestTime || reaction < bestTime) {
        setBestTime(reaction)
      }

      // Update recent times
      setRecentTimes((prev) => [...prev.slice(-4), reaction])

      // Save game result
      onGameEnd("reaction-time", reaction, "completed")
    }
  }

  const resetGame = () => {
    setGameState("waiting")
    setReactionTime(null)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  const resetStats = () => {
    setBestTime(null)
    setAttempts(0)
    setRecentTimes([])
    resetGame()
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const getBackgroundColor = () => {
    switch (gameState) {
      case "ready":
        return "bg-red-500"
      case "go":
        return "bg-green-500"
      case "too-early":
        return "bg-yellow-500"
      default:
        return "bg-olive-100"
    }
  }

  const getInstruction = () => {
    switch (gameState) {
      case "waiting":
        return "Click 'Start' to begin the test"
      case "ready":
        return "Wait for green..."
      case "go":
        return "CLICK NOW!"
      case "clicked":
        return `Your reaction time: ${reactionTime}ms`
      case "too-early":
        return "Too early! Wait for green."
      default:
        return ""
    }
  }

  const getAverageTime = () => {
    if (recentTimes.length === 0) return null
    return Math.round(recentTimes.reduce((a, b) => a + b, 0) / recentTimes.length)
  }

  return (
    <div className="max-w-2xl mx-auto animate-slide-up">
      <Card className="bg-white/90 backdrop-blur-sm border-olive-200">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-olive-500 to-olive-700 flex items-center justify-center mb-4">
            <Timer className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-olive-800">Reaction Time Tester</CardTitle>
          <CardDescription>Test your reflexes - click when the screen turns green!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-olive-600">{attempts}</p>
              <p className="text-olive-700">Attempts</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-olive-600">{bestTime ? `${bestTime}ms` : "-"}</p>
              <p className="text-olive-700">Best Time</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-olive-600">{getAverageTime() ? `${getAverageTime()}ms` : "-"}</p>
              <p className="text-olive-700">Average</p>
            </div>
          </div>

          {/* Game Area */}
          <div
            className={`h-64 rounded-lg flex items-center justify-center cursor-pointer transition-colors duration-200 ${getBackgroundColor()}`}
            onClick={handleClick}
          >
            <div className="text-center">
              <p className="text-2xl font-bold text-white mb-4">{getInstruction()}</p>
              {gameState === "waiting" && (
                <Button onClick={startGame} className="bg-white text-olive-800 hover:bg-olive-50">
                  Start Test
                </Button>
              )}
              {(gameState === "clicked" || gameState === "too-early") && (
                <Button onClick={resetGame} className="bg-white text-olive-800 hover:bg-olive-50">
                  Try Again
                </Button>
              )}
            </div>
          </div>

          {/* Recent Times */}
          {recentTimes.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-olive-800">Recent Times:</h4>
              <div className="flex flex-wrap gap-2">
                {recentTimes.map((time, index) => (
                  <span key={index} className="px-3 py-1 bg-olive-100 text-olive-800 rounded-full text-sm">
                    {time}ms
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="text-center">
            <Button
              onClick={resetStats}
              variant="outline"
              className="border-olive-600 text-olive-600 hover:bg-olive-50 bg-transparent"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Stats
            </Button>
          </div>

          {/* Instructions */}
          <div className="text-sm text-olive-600 bg-olive-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">How to play:</h4>
            <ul className="space-y-1">
              <li>• Click "Start Test" to begin</li>
              <li>• Wait for the screen to turn green</li>
              <li>• Click as fast as you can when it turns green</li>
              <li>• Don't click too early or you'll have to restart!</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
