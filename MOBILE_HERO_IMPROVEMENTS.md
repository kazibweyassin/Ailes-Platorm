# 📱 Mobile Hero Section - Improvement Recommendations

## Current Issues

1. **3 CTAs in Hero** - Too many choices, decision paralysis
2. **Weak Visual Hierarchy** - All buttons look equally important
3. **Copilot Section in Hero** - Distracts from main conversion goal
4. **Small Text** - `text-xl` might be too small for mobile
5. **Tight Spacing** - Needs more breathing room

## Recommended Changes

### Option A: Simplified Hero (Recommended)
- **Primary CTA**: "Find My Scholarships (AI)" - Large, prominent
- **Secondary CTA**: "Browse Scholarships" - Smaller, below primary
- **Move Copilot**: Below hero section or in a separate section
- **Larger Heading**: `text-2xl` or `text-3xl` on mobile
- **Better Spacing**: More padding between elements

### Option B: Two-Column Mobile Layout
- Left: Heading + Primary CTA
- Right: Stats or quick info
- Copilot section below

### Option C: Progressive Disclosure
- Show primary CTA first
- "Learn more" expands to show other options
- Less overwhelming

## Implementation Priority

1. **High**: Reduce to 2 CTAs max
2. **High**: Move Copilot section out of hero
3. **Medium**: Increase heading size on mobile
4. **Medium**: Improve spacing
5. **Low**: Add subtle animations

