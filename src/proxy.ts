import { NextRequest, NextResponse } from "next/server"
import { redis } from "./lib/redis"
import { nanoid } from "nanoid"

export const proxy = async (req: NextRequest) => {
  if (req.nextUrl.searchParams.has("_rsc")) return NextResponse.next()

  const ua = req.headers.get("user-agent") ?? ""
  const isBot = /whatsapp|telegram|twitterbot|facebookexternalhit|linkedinbot|slackbot|discordbot|preview|crawler|bot/i.test(ua)
  if (isBot) return NextResponse.next()
    console.log("UA:", req.headers.get("user-agent"))

  const pathname = req.nextUrl.pathname

  const roomMatch = pathname.match(/^\/room\/([^/]+)$/)
  if (!roomMatch) return NextResponse.redirect(new URL("/", req.url))

  const roomId = roomMatch[1]

  const meta = await redis.hgetall<{ connected: string[]; createdAt: number }>(
    `meta:${roomId}`
  )

  if (!meta) {
    return NextResponse.redirect(new URL("/?error=room-not-found", req.url))
  }

  const existingToken = req.cookies.get("x-auth-token")?.value

  if (existingToken && meta.connected.includes(existingToken)) {
    return NextResponse.next()
  }

  if (meta.connected.length >= 2) {
    return NextResponse.redirect(new URL("/?error=room-full", req.url))
  }

  const response = NextResponse.next()
  const token = nanoid()

  response.cookies.set("x-auth-token", token, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  })

  await redis.hset(`meta:${roomId}`, {
    connected: [...meta.connected, token],
  })

  return response
}

export const config = {
  matcher: "/room/:path*",
}