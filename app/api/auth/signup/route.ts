import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { Prisma } from "@prisma/client"

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").trim(),
  email: z.string().email("Invalid email address").trim().toLowerCase(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional().transform(val => val?.trim() || undefined),
  country: z.string().optional().transform(val => val?.trim() || undefined),
})

export async function POST(req: Request) {
  try {
    // Handle JSON parse errors
    let body;
    try {
      body = await req.json()
    } catch (jsonError) {
      console.error('JSON parse error:', jsonError)
      return NextResponse.json(
        { error: "Invalid request format. Please ensure the request body is valid JSON." },
        { status: 400 }
      )
    }
    
    console.log('Signup request received:', { ...body, password: '***' })
    
    // Validate input
    let validatedData;
    try {
      validatedData = signUpSchema.parse(body)
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        console.error('Validation error:', validationError.errors)
        return NextResponse.json(
          { error: "Invalid input", details: validationError.errors },
          { status: 400 }
        )
      }
      throw validationError
    }

    // Check if user already exists
    let existingUser;
    try {
      existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });
    } catch (dbError) {
      console.error('Database error checking existing user:', dbError)
      return NextResponse.json(
        { error: "Database connection error. Please try again later." },
        { status: 503 }
      )
    }

    if (existingUser) {
      console.log('User already exists:', validatedData.email);
      return NextResponse.json(
        { error: 'An account with this email already exists. Please sign in or use a different email.' },
        { status: 400 }
      );
    }

    // Hash password
    let hashedPassword;
    try {
      hashedPassword = await hash(validatedData.password, 12)
    } catch (hashError) {
      console.error('Password hashing error:', hashError)
      return NextResponse.json(
        { error: "Failed to process password. Please try again." },
        { status: 500 }
      )
    }

    // Create user
    let user;
    try {
      user = await prisma.user.create({
        data: {
          name: validatedData.name,
          email: validatedData.email,
          password: hashedPassword,
          phone: validatedData.phone,
          country: validatedData.country,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        }
      })
    } catch (dbError: any) {
      console.error('Database error creating user:', dbError)
      
      // Handle Prisma-specific errors
      if (dbError instanceof Prisma.PrismaClientKnownRequestError) {
        // Unique constraint violation (shouldn't happen due to check above, but handle anyway)
        if (dbError.code === 'P2002') {
          return NextResponse.json(
            { error: 'An account with this email already exists. Please sign in or use a different email.' },
            { status: 400 }
          )
        }
        // Other Prisma errors
        return NextResponse.json(
          { error: "Database error. Please try again later." },
          { status: 500 }
        )
      }
      
      // Connection/timeout errors
      if (dbError instanceof Prisma.PrismaClientInitializationError || 
          dbError instanceof Prisma.PrismaClientRustPanicError) {
        return NextResponse.json(
          { error: "Database connection error. Please try again later." },
          { status: 503 }
        )
      }
      
      // Generic database error
      return NextResponse.json(
        { error: "Failed to create account. Please try again later." },
        { status: 500 }
      )
    }

    console.log('User created successfully:', user.id)

    return NextResponse.json(
      { 
        message: "User created successfully",
        user 
      },
      { status: 201 }
    )
  } catch (error) {
    // This catch block should only handle unexpected errors
    // All expected errors should be handled above
    console.error("Unexpected signup error:", error)
    
    // Don't expose internal error details in production
    const isDevelopment = process.env.NODE_ENV === 'development'
    
    return NextResponse.json(
      { 
        error: "An unexpected error occurred. Please try again later.",
        ...(isDevelopment && { details: error instanceof Error ? error.message : 'Unknown error' })
      },
      { status: 500 }
    )
  }
}
