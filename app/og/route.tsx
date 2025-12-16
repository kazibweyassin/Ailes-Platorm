import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title') || 'Ailes Global'
    const description = searchParams.get('description') || 'Premium Study Abroad & Scholarship Consulting for African Students'
    const type = searchParams.get('type') || 'default'

    // Customize based on type
    let bgColor = '#1e40af' // Primary blue
    let accentColor = '#f59e0b' // Gold
    
    if (type === 'scholarship') {
      bgColor = '#059669' // Green
      accentColor = '#fbbf24'
    } else if (type === 'university') {
      bgColor = '#7c3aed' // Purple
      accentColor = '#a78bfa'
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: bgColor,
            backgroundImage: 'linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.2) 100%)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {/* Logo/Brand */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#ffffff',
                letterSpacing: '-0.02em',
              }}
            >
              AILES GLOBAL
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              display: 'flex',
              fontSize: title.length > 50 ? '48px' : '64px',
              fontWeight: 'bold',
              color: '#ffffff',
              textAlign: 'center',
              maxWidth: '1000px',
              lineHeight: '1.1',
              marginBottom: '30px',
              padding: '0 60px',
            }}
          >
            {title}
          </div>

          {/* Description */}
          <div
            style={{
              display: 'flex',
              fontSize: '28px',
              color: '#e5e7eb',
              textAlign: 'center',
              maxWidth: '900px',
              lineHeight: '1.4',
              padding: '0 60px',
            }}
          >
            {description}
          </div>

          {/* Accent line */}
          <div
            style={{
              width: '200px',
              height: '6px',
              backgroundColor: accentColor,
              marginTop: '40px',
              borderRadius: '3px',
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    console.error('OG image generation error:', error)
    return new Response('Failed to generate OG image', { status: 500 })
  }
}




