"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, RotateCcw } from "lucide-react"

interface NumberGuessingGameProps {
  onGameEnd: (gameType: string, score: number, result: string) => void
}

export function NumberGuessingGame({ onGameEnd }: NumberGuessingGameProps) {
  const [targetNumber, setTargetNumber] = useState(0)
  const [guess, setGuess] = useState("")
  const [attempts, setAttempts] = useState(0)
  const [message, setMessage] = useState("")
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  const startNewGame = () => {
    const newNumber = Math.floor(Math.random() * 100) + 1
    setTargetNumber(newNumber)
    setGuess("")
    setAttempts(0)
    setMessage("I'm thinking of a number between 1 and 100. Can you guess it?")
    setGameOver(false)
    setGameStarted(true)
  }

  useEffect(() => {
    startNewGame()
  }, [])

  const handleGuess = () => {
    if (!guess || isNaN(Number(guess))) {
      setMessage("Please enter a valid number!")
      return
    }

    const guessNumber = Number.parseInt(guess)
    const newAttempts = attempts + 1
    setAttempts(newAttempts)

    if (guessNumber === targetNumber) {
      setMessage(`🎉 Congratulations! You guessed it in ${newAttempts} attempts!`)
      setGameOver(true)
      onGameEnd("number-guessing", newAttempts, "win")
    } else if (guessNumber < targetNumber) {
      setMessage(`Too low! Try a higher number. (Attempt ${newAttempts})`)
    } else {
      setMessage(`Too high! Try a lower number. (Attempt ${newAttempts})`)
    }

    setGuess("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !gameOver) {
      handleGuess()
    }
  }

  return (
    <div className="max-w-2xl mx-auto animate-slide-up">
      <Card className="bg-white/90 backdrop-blur-sm border-olive-200">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-olive-400 to-olive-600 flex items-center justify-center mb-4">
            <Target className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-olive-800">Number Guessing Game</CardTitle>
          <CardDescription>Guess the secret number between 1 and 100</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-lg text-olive-700 mb-4">{message}</p>
            <p className="text-olive-600">Attempts: {attempts}</p>
          </div>

          {!gameOver && (
            <div className="flex space-x-2">
              <Input
                type="number"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your guess (1-100)"
                min="1"
                max="100"
                className="border-olive-300 focus:border-olive-500"
              />
              <Button onClick={handleGuess} className="bg-olive-600 hover:bg-olive-700 text-white">
                Guess
              </Button>
            </div>
          )}

          {gameOver && (
            <div className="text-center space-y-4">
              <div className="text-6xl">🎯</div>
              <p className="text-lg text-olive-700">
                The number was <span className="font-bold text-olive-800">{targetNumber}</span>
              </p>
              <Button onClick={startNewGame} className="bg-olive-600 hover:bg-olive-700 text-white">
                <RotateCcw className="h-4 w-4 mr-2" />
                Play Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
