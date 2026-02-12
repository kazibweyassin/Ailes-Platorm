import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    const countries = await prisma.scholarship.findMany({
      where: {
        country: { not: null }
      },
      distinct: ["country"],
      select: { country: true },
      orderBy: { country: "asc" }
    })

    return NextResponse.json({
      countries: countries
        .map((row) => row.country)
        .filter((country): country is string => Boolean(country))
    })
  } catch (error) {
    console.error("Filters fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
