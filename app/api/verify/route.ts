import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/mongodb"
import { User } from "@/lib/models"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    // If no token → just return guest user
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ user: null })
    }

    const token = authHeader.substring(7)

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string }

      await connectDB()
      const user = await User.findById(decoded.userId).select("-password")

      if (!user) {
        return NextResponse.json({ user: null })
      }

      return NextResponse.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      })
      
    } catch (jwtError) {
      // Invalid token → allow guest access
      return NextResponse.json({ user: null })
    }

  } catch (error) {
    console.error("Verify error:", error)
    return NextResponse.json({ user: null })
  }
}
