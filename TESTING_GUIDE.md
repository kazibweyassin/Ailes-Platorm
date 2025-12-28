# 🧪 Testing Guide - Sponsor MVP System

## Prerequisites

1. **Database Setup**
   - Make sure your PostgreSQL database is running
   - Check your `.env` file has `DATABASE_URL` set correctly

2. **Dependencies**
   ```bash
   npm install
   ```

## Step 1: Run Database Migration

First, update your database schema:

```bash
# Generate Prisma client
npx prisma generate

# Create and apply migration
npx prisma migrate dev --name add_scholar_and_matching
```

**Expected Output:**
- Migration files created in `prisma/migrations/`
- Database schema updated
- Prisma client regenerated

**Verify Migration:**
```bash
# Check database schema
npx prisma studio
# This opens a visual database browser - verify you see:
# - sponsors table (with new payment fields)
# - scholars table (new)
# - sponsor_scholars table (new)
```

## Step 2: Start Development Server

```bash
npm run dev
```

Server should start on `http://localhost:3000`

## Step 3: Test Scholar Application Form

### Test Path: `/scholar-apply`

1. **Navigate to:** `http://localhost:3000/scholar-apply`

2. **Fill out the form:**
   - **Step 1 - Personal Info:**
     - First Name: `Jane`
     - Last Name: `Doe`
     - Email: `jane.doe@example.com`
     - Phone: `+256 700 123 456`
     - Date of Birth: `2000-01-15`
     - Gender: `Female`
     - Nationality: `Kenyan`
     - Current Country: `Kenya`
     - City: `Nairobi`
     - Address: `123 Main St`

   - **Step 2 - Academic Background:**
     - Current Degree: `Bachelor's`
     - Field of Study: `Computer Science`
     - University: `University of Nairobi`
     - GPA: `3.8`
     - Graduation Year: `2024`
     - Current Year: `Final Year`
     - Check "I have English test scores"
     - IELTS Score: `7.5`
     - Target Degree: `Master's`
     - Target Countries: `USA, UK`
     - Target Fields: `Computer Science, Data Science`
     - Preferred Intake: `Fall 2025`

   - **Step 3 - Financial Information:**
     - Financial Need: `I come from a low-income family and need financial support to pursue my Master's degree...`
     - Current Funding Source: `Family savings`
     - Expected Funding: `$50,000`
     - Budget Range: `$50,000 - $100,000`

   - **Step 4 - Additional Information:**
     - Work Experience: `2 years as software developer`
     - Research Experience: `Undergraduate research project on AI`
     - Awards: `Dean's List, Best Student Award`
     - Languages: `English, Swahili`
     - Personal Story: `I am passionate about using technology to solve problems in my community...`

3. **Submit the form**

4. **Expected Result:**
   - Success message displayed
   - Scholar record created in database
   - You can verify in Prisma Studio or admin panel

## Step 4: Test Sponsor Submission

### Test Path: `/sponsor`

1. **Navigate to:** `http://localhost:3000/sponsor`

2. **Select a sponsorship tier:**
   - Click "Select $2,000" on "Full Journey" tier

3. **Fill out sponsor form:**
   - Name: `John Smith`
   - Email: `john.smith@example.com`
   - Phone: `+1 555 123 4567`
   - Preferred Field: `Computer Science` (optional)
   - Preferred Country: `Kenya` (optional)
   - Message: `I want to support talented African women in tech` (optional)
   - Check "Remain anonymous" if desired

4. **Submit the form**

5. **Expected Result:**
   - Success modal with transaction number
   - Download payment instructions PDF
   - Sponsor record created with status "PENDING"
   - Check console logs for email notifications (currently logged)

## Step 5: Test Admin Features

### A. Access Admin Panel

1. **Navigate to:** `http://localhost:3000/admin`

2. **Sign in:**
   - You need an admin account
   - If you don't have one, create a user first, then update role in database:
   ```sql
   UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
   ```

### B. Test Sponsor Management (`/admin/sponsors`)

1. **View Sponsors:**
   - Should see the sponsor you just created
   - Status should be "PENDING"

2. **Confirm Payment:**
   - Click "Confirm Payment" button
   - Enter payment reference: `TXN-12345`
   - Click OK
   - Status should change to "CONFIRMED"
   - Payment confirmed badge should appear

3. **Add Payment Notes:**
   - Click "Add Notes" button
   - Enter: `Payment received via bank transfer`
   - Notes should be saved

4. **Test Filtering:**
   - Use search bar to filter by name/email
   - Use status buttons to filter by status

### C. Test Scholar Management (`/admin/scholars`)

1. **Navigate to:** `http://localhost:3000/admin/scholars`

2. **View Scholars:**
   - Should see the scholar you created
   - Status should be "APPLIED"

3. **View Details:**
   - Click "View Details" to see full information
   - Check all fields are displayed correctly

4. **Test Filtering:**
   - Search by name, email, or field of study
   - Filter by status

### D. Test Matching Interface (`/admin/sponsors/match`)

1. **Navigate to:** `http://localhost:3000/admin/sponsors/match`

2. **Select a Sponsor:**
   - Click on a "CONFIRMED" sponsor from left panel
   - Sponsor should highlight

3. **View Matching Scholars:**
   - Right panel should show available scholars
   - Scholars should be sorted by match score
   - Match scores displayed (0-100%)

4. **Create a Match:**
   - Click "Match" button on a scholar
   - Confirm the match
   - Scholar should disappear from list
   - Sponsor status should change to "ACTIVE"
   - Scholar status should change to "MATCHED"

5. **Verify Match:**
   - Go back to `/admin/sponsors`
   - Sponsor should show "ACTIVE" status
   - Go to `/admin/scholars`
   - Scholar should show "MATCHED" status
   - Scholar card should show matched sponsor info

### E. Test Reports Dashboard (`/admin/reports`)

1. **Navigate to:** `http://localhost:3000/admin/reports`

2. **Check Metrics:**
   - Total Revenue: Should show confirmed payments
   - Total Sponsors: Count of all sponsors
   - Total Scholars: Count of all scholars
   - Active Matches: Count of matched pairs

3. **Check Performance Stats:**
   - Average Sponsorship Amount
   - Match Rate
   - Sponsor Conversion Rate

## Step 6: Test Edge Cases

### Test 1: Duplicate Sponsor Email
- Try submitting sponsor form with same email twice
- Should handle gracefully (check database constraints)

### Test 2: Matching Already Matched Scholar
- Try matching a scholar that's already matched
- Should show error message

### Test 3: Matching Unconfirmed Sponsor
- Try to match a sponsor with status "PENDING"
- Should only show "CONFIRMED" or "ACTIVE" sponsors

### Test 4: Empty States
- Test with no sponsors
- Test with no scholars
- Test with no matches
- UI should show appropriate empty states

## Step 7: Verify Database Records

### Using Prisma Studio:
```bash
npx prisma studio
```

Check:
1. **sponsors table:**
   - New sponsor records
   - Payment fields populated
   - Status updated correctly

2. **scholars table:**
   - New scholar records
   - All fields populated
   - Status updated correctly

3. **sponsor_scholars table:**
   - Match records created
   - Links between sponsors and scholars
   - Match status

### Using SQL:
```sql
-- Check sponsors
SELECT id, name, email, status, amount, payment_confirmed 
FROM sponsors;

-- Check scholars
SELECT id, first_name, last_name, email, status, field_of_study 
FROM scholars;

-- Check matches
SELECT * FROM sponsor_scholars;
```

## Step 8: Test UI/UX

1. **Responsive Design:**
   - Test on mobile (resize browser)
   - Test on tablet
   - Test on desktop

2. **Navigation:**
   - Test all navigation links
   - Test back buttons
   - Test breadcrumbs

3. **Forms:**
   - Test validation (try submitting empty forms)
   - Test multi-step navigation
   - Test form persistence

4. **Modals:**
   - Test success modals
   - Test confirmation dialogs
   - Test close buttons

## Common Issues & Solutions

### Issue: Migration fails
**Solution:**
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or manually fix migration
npx prisma migrate dev
```

### Issue: Can't access admin
**Solution:**
- Check user role in database
- Sign out and sign back in
- Verify session is working

### Issue: Matches not showing
**Solution:**
- Ensure sponsor status is CONFIRMED or ACTIVE
- Check scholar doesn't have assignedSponsorId
- Verify API endpoints return data

### Issue: Payment confirmation not working
**Solution:**
- Check browser console for errors
- Verify API endpoint is accessible
- Check database connection

## Quick Test Checklist

- [ ] Database migration runs successfully
- [ ] Scholar application form submits
- [ ] Sponsor form submits
- [ ] Payment confirmation works
- [ ] Matching interface loads
- [ ] Match creation works
- [ ] Reports dashboard shows data
- [ ] All admin pages accessible
- [ ] Email notifications logged (check console)
- [ ] PDF generation works (payment instructions)

## Performance Testing

1. **Load Testing:**
   - Create 10+ sponsors
   - Create 20+ scholars
   - Test matching performance
   - Test filtering/search performance

2. **Data Validation:**
   - Test with very long text inputs
   - Test with special characters
   - Test with invalid email formats
   - Test with future dates

## Next Steps After Testing

1. **Fix any bugs found**
2. **Add real email service** (currently just logs)
3. **Customize pricing tiers** if needed
4. **Add more validation** if needed
5. **Set up production database**
6. **Deploy to staging environment**

---

**Happy Testing! 🚀**

If you encounter any issues, check:
- Browser console for errors
- Server logs for API errors
- Database connection
- Prisma schema matches database

