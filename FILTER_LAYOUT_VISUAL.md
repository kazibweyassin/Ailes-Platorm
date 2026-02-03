# Filter Layout - Visual Guide

## Desktop View (lg breakpoint)

```
┌─────────────────────────────────────────────────────────────────┐
│  Search Bar Across Full Width                                   │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┬─────────────────────────────────────────────┐
│                  │ Results (800+ found)                         │
│  FILTERS SIDEBAR │ Sort by: [Deadline ▼]                      │
│  (Sticky)        │                                              │
│  ┌────────────┐  │ ┌───────────┬───────────┐                   │
│  │ Country    │  │ │ Scholarship Card 1    │ Scholarship Card │
│  │ ▼          │  │ │ (with Save/View btns) │ Card 2           │
│  └────────────┘  │ └───────────┴───────────┘ ┴────────────────┘
│                  │                                              │
│  ┌────────────┐  │ ┌───────────┬───────────┐                   │
│  │ Type       │  │ │ Scholarship Card 3    │ Scholarship Card │
│  │ ▼          │  │ │ (with Save/View btns) │ Card 4           │
│  └────────────┘  │ └───────────┴───────────┘ ┴────────────────┘
│                  │                                              │
│  ┌────────────┐  │ ┌───────────┬───────────┐                   │
│  │ Degree     │  │ │ Scholarship Card 5    │ Scholarship Card │
│  │ Level ▼    │  │ │ (with Save/View btns) │ Card 6           │
│  └────────────┘  │ └───────────┴───────────┘ ┴────────────────┘
│                  │                                              │
│  ┌────────────┐  │ Pagination: « 1 2 3 4 5 » Next »            │
│  │ Field ▼    │  │                                              │
│  └────────────┘  │                                              │
│                  │                                              │
│  ┌────────────┐  └─────────────────────────────────────────────┘
│  │ Deadline   │
│  │ ▼          │
│  └────────────┘
│
│  ┌────────────┐
│  │ Amount Min/Max
│  └────────────┘
│
│  ┌──────────────────────────────────┐
│  │ ☑ For Women Only                  │
│  │ ☑ For Africans Only               │
│  └──────────────────────────────────┘
│
│  ┌──────────────────────────────────┐
│  │ ☑ Covers Tuition                  │
│  │ ☑ Covers Living Expenses          │
│  └──────────────────────────────────┘
│
│  ┌──────────────────────────────────┐
│  │ ☑ No IELTS/TOEFL/GRE              │
│  └──────────────────────────────────┘
│
│  ✓ Filters Applied
│
│  [Reset All Filters]
│
└──────────────────┘
```

## Features

### Left Sidebar
- ✅ **Sticky** - Stays visible when scrolling down
- ✅ **Organized** - Grouped by filter type
- ✅ **Compact** - Doesn't waste space
- ✅ **Scrollable** - Max-height with overflow:auto
- ✅ **Responsive** - Collapsible on mobile

### Filter Groups
1. **Basic Filters** (Dropdowns)
   - Country
   - Type (Full/Partial)
   - Degree Level
   - Field of Study
   - Deadline
   - Amount Range

2. **Special Filters** (Checkboxes)
   - Target Audience
   - Coverage Benefits
   - Test Requirements

### Right Content
- 📊 Results counter
- 🔀 Sort dropdown
- 📥 Export CSV
- 🔗 Share results
- 🤖 AI Match button
- 📋 2-column scholarship grid
- ⏳ Pagination controls

## Mobile View (sm/md breakpoints)

```
┌──────────────────────────┐
│  Search Bar              │
└──────────────────────────┘

┌──────────────────────────┐
│  FILTERS (Sidebar)       │
│  [Collapse ▲]            │
│                          │
│  Country: [Select ▼]     │
│  Type: [Select ▼]        │
│  Degree: [Select ▼]      │
│  ...                     │
│  [Reset All]             │
└──────────────────────────┘

┌──────────────────────────┐
│  Results (800+ found)    │
│  Sort: [Deadline ▼]      │
│                          │
│  ┌────────────────────┐  │
│  │ Scholarship Card 1 │  │
│  │ [Save]     [View]  │  │
│  └────────────────────┘  │
│                          │
│  ┌────────────────────┐  │
│  │ Scholarship Card 2 │  │
│  │ [Save]     [View]  │  │
│  └────────────────────┘  │
│                          │
│  Pagination: [1] [2] [3] │
│                          │
└──────────────────────────┘
```

## Interaction Flow

### 1. User Arrives
- Sees search bar at top
- Sees sidebar with all filters
- Sees first page of scholarships (12 per page)

### 2. User Applies Filters
- Clicks any filter dropdown/checkbox
- Results update instantly
- Active filter indicator appears
- Pagination resets to page 1

### 3. User Refines Search
- Can combine multiple filters
- "✓ Filters Applied" shows when active
- "Reset All" button available

### 4. User Exports/Shares
- Click "Export" → Downloads CSV
- Click "Share" → Copies URL with filters
- Others can access same filtered results

### 5. User Navigates
- Browse 2 columns of scholarships
- Click pagination to load more
- Sidebar stays sticky while scrolling

## Filter Example Combinations

### "Women in Engineering"
- Gender: Women Only ✓
- Field: Engineering ✓
- Result: Shows engineering scholarships for women

### "Fully Funded Scholarships"
- Type: Full Scholarship ✓
- Covers Tuition: ✓
- Covers Living: ✓
- Result: Shows comprehensive funding options

### "High Value African Scholarships"
- For Africans Only: ✓
- Amount: Min $50,000 ✓
- Result: Premium African scholarships

### "No Language Tests Required"
- Degree: Master's ✓
- No IELTS/TOEFL/GRE: ✓
- Result: Master's programs without language barriers

## Color Coding

- **Primary Color** (Blue) - General filters, main CTA
- **Green** - Coverage benefits (tuition, living)
- **Pink** - Women-specific filters
- **Orange** - Urgent/Deadline-related
- **Gray** - Disabled/inactive states
