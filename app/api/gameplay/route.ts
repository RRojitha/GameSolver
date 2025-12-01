import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/mongodb"
import { GamePlay } from "@/lib/models"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }

    const { gameType, score, result, timestamp } = await request.json()

    await connectDB()

    const gamePlay = await GamePlay.create({
      userId: decoded.userId,
      gameType,
      score,
      result,
      timestamp: new Date(timestamp),
    })

    return NextResponse.json({ gamePlay }, { status: 201 })
  } catch (error) {
    console.error("Gameplay save error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }

    await connectDB()

    const gamePlays = await GamePlay.find({ userId: decoded.userId }).sort({ timestamp: -1 }).limit(50)

    return NextResponse.json({ gamePlays })
  } catch (error) {
    console.error("Gameplay fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
