"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Gamepad2, Sparkles, Trophy, Users } from "lucide-react"

export default function LandingPage() {
  const { user } = useAuth()
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-olive-50 via-olive-100 to-olive-200">
      {/* Header */}
      <header className="flex justify-between items-center p-6 animate-fade-in">
        <div className="flex items-center space-x-2">
          <Gamepad2 className="h-8 w-8 text-olive-600" />
          <h1 className="text-2xl font-bold text-olive-800">GameSolver</h1>
        </div>
        <div className="space-x-4">
          {user ? (
            <Button onClick={() => router.push("/home")} className="bg-olive-600 hover:bg-olive-700 text-white">
              Dashboard
            </Button>
          ) : (
            <Button onClick={() => router.push("/login")} className="bg-olive-600 hover:bg-olive-700 text-white">
              Login
            </Button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <div className="text-center animate-slide-up">
          <h2 className="text-5xl font-bold text-olive-800 mb-6">Master Your Gaming Skills</h2>
          <p className="text-xl text-olive-600 mb-8 max-w-2xl mx-auto">
            Challenge yourself with classic games, track your progress, and become the ultimate GameSolver champion.
          </p>

          {!user && (
            <div className="space-x-4">
              <Button
                onClick={() => router.push("/signup")}
                size="lg"
                className="bg-olive-600 hover:bg-olive-700 text-white px-8 py-3"
              >
                Get Started
              </Button>
              <Button
                onClick={() => router.push("/login")}
                variant="outline"
                size="lg"
                className="border-olive-600 text-olive-600 hover:bg-olive-50 px-8 py-3"
              >
                Sign In
              </Button>
            </div>
          )}
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-olive-200 rounded-full opacity-50 animate-float"></div>
          <div
            className="absolute top-40 right-20 w-16 h-16 bg-olive-300 rounded-full opacity-40 animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute bottom-40 left-20 w-24 h-24 bg-olive-200 rounded-full opacity-30 animate-float"
            style={{ animationDelay: "4s" }}
          ></div>
          <div
            className="absolute bottom-20 right-10 w-18 h-18 bg-olive-300 rounded-full opacity-50 animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 animate-fade-in">
          <div className="text-center p-6 bg-white/50 rounded-lg backdrop-blur-sm">
            <Trophy className="h-12 w-12 text-olive-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-olive-800 mb-2">Track Progress</h3>
            <p className="text-olive-600">Monitor your gaming performance and see your improvement over time.</p>
          </div>
          <div className="text-center p-6 bg-white/50 rounded-lg backdrop-blur-sm">
            <Sparkles className="h-12 w-12 text-olive-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-olive-800 mb-2">Multiple Games</h3>
            <p className="text-olive-600">Enjoy classic games like Tic-Tac-Toe, Rock-Paper-Scissors, and more.</p>
          </div>
          <div className="text-center p-6 bg-white/50 rounded-lg backdrop-blur-sm">
            <Users className="h-12 w-12 text-olive-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-olive-800 mb-2">Compete</h3>
            <p className="text-olive-600">Challenge yourself and compete with friends in various game modes.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
