/**
 * Smart Scholarship Matching Engine
 * 
 * Calculates compatibility scores between users and scholarships
 * based on multiple factors (GPA, test scores, field of study, etc.)
 */

interface UserProfile {
  currentGPA?: number;
  ieltsScore?: number;
  toeflScore?: number;
  greScore?: number;
  gmatScore?: number;
  fieldOfStudy?: string;
  degreeLevel?: string;
  country?: string;
  interestedCountries?: string[];
  dateOfBirth?: Date;
  gender?: string;
}

interface ScholarshipData {
  id: string;
  name: string;
  country?: string;
  minGPA?: number;
  degreeLevel?: string[];
  fieldOfStudy?: string[];
  forWomen?: boolean;
  forAfrican?: boolean;
  requiresIELTS?: boolean;
  minIELTS?: number;
  requiresTOEFL?: boolean;
  minTOEFL?: number;
  requiresGRE?: boolean;
  requiresGMAT?: boolean;
  deadline?: Date;
  amount?: number;
  views?: number;
  featured?: boolean;
}

interface MatchScore {
  scholarshipId: string;
  overallScore: number; // 0-100
  scoreBreakdown: {
    gpaMatch: number;
    testScoreMatch: number;
    fieldMatch: number;
    degreeMatch: number;
    locationMatch: number;
    demographicMatch: number;
    deadline: number; // How urgent (inverse - closer deadline = higher score)
  };
  reasoning: string[];
  isGoodMatch: boolean; // > 60 is good match
}

/**
 * Calculate match score between user and scholarship
 */
export function calculateMatchScore(
  user: UserProfile,
  scholarship: ScholarshipData
): MatchScore {
  const scoreBreakdown = {
    gpaMatch: 0,
    testScoreMatch: 0,
    fieldMatch: 0,
    degreeMatch: 0,
    locationMatch: 0,
    demographicMatch: 0,
    deadline: 0,
  };

  const reasoning: string[] = [];
  let totalWeight = 0;

  // 1. GPA Matching (15% weight)
  if (user.currentGPA && scholarship.minGPA) {
    const gpaScore = Math.min(100, (user.currentGPA / scholarship.minGPA) * 100);
    scoreBreakdown.gpaMatch = Math.max(0, gpaScore);
    totalWeight += 15;
    if (gpaScore < 50) {
      reasoning.push("⚠️ GPA may be below minimum requirement");
    } else if (gpaScore > 100) {
      reasoning.push("✅ GPA exceeds requirement");
    }
  } else if (scholarship.minGPA) {
    totalWeight += 15;
    reasoning.push("📝 No GPA provided in profile");
  } else {
    totalWeight += 15;
    scoreBreakdown.gpaMatch = 100;
  }

  // 2. Test Score Matching (20% weight)
  let testScores = 0;
  let testsMatched = 0;

  if (scholarship.requiresIELTS && user.ieltsScore) {
    const ieltsMatch = user.ieltsScore >= (scholarship.minIELTS || 6.0) ? 100 : 60;
    testScores += ieltsMatch;
    testsMatched++;
    if (ieltsMatch < 100) reasoning.push("⚠️ IELTS score may be below requirement");
  } else if (scholarship.requiresIELTS) {
    reasoning.push("📝 IELTS required but not provided");
    testScores += 50;
    testsMatched++;
  }

  if (scholarship.requiresTOEFL && user.toeflScore) {
    const toeflMatch = user.toeflScore >= (scholarship.minTOEFL || 80) ? 100 : 60;
    testScores += toeflMatch;
    testsMatched++;
    if (toeflMatch < 100) reasoning.push("⚠️ TOEFL score may be below requirement");
  } else if (scholarship.requiresTOEFL) {
    reasoning.push("📝 TOEFL required but not provided");
    testScores += 50;
    testsMatched++;
  }

  if (scholarship.requiresGRE && user.greScore) {
    const greMatch = user.greScore >= 300 ? 100 : 60;
    testScores += greMatch;
    testsMatched++;
  } else if (scholarship.requiresGRE) {
    reasoning.push("📝 GRE required but not provided");
    testScores += 50;
    testsMatched++;
  }

  if (scholarship.requiresGMAT && user.gmatScore) {
    const gmatMatch = user.gmatScore >= 500 ? 100 : 60;
    testScores += gmatMatch;
    testsMatched++;
  } else if (scholarship.requiresGMAT) {
    reasoning.push("📝 GMAT required but not provided");
    testScores += 50;
    testsMatched++;
  }

  if (testsMatched > 0) {
    scoreBreakdown.testScoreMatch = testScores / testsMatched;
    totalWeight += 20;
  } else {
    scoreBreakdown.testScoreMatch = 100; // No tests required
    totalWeight += 20;
  }

  // 3. Field of Study Matching (20% weight)
  if (user.fieldOfStudy && scholarship.fieldOfStudy && scholarship.fieldOfStudy.length > 0) {
    const userField = user.fieldOfStudy.toLowerCase();
    const matchedField = scholarship.fieldOfStudy.some(
      (field) =>
        field.toLowerCase().includes(userField) ||
        userField.includes(field.toLowerCase()) ||
        field.toLowerCase() === "all fields"
    );

    scoreBreakdown.fieldMatch = matchedField ? 100 : 30;
    totalWeight += 20;

    if (!matchedField && scholarship.fieldOfStudy.length > 0) {
      reasoning.push(
        `📚 Field mismatch: ${scholarship.fieldOfStudy.join(", ")} vs ${user.fieldOfStudy}`
      );
    } else if (matchedField) {
      reasoning.push("✅ Field of study matches");
    }
  } else {
    scoreBreakdown.fieldMatch = 100; // No restriction
    totalWeight += 20;
  }

  // 4. Degree Level Matching (15% weight)
  if (user.degreeLevel && scholarship.degreeLevel && scholarship.degreeLevel.length > 0) {
    const degreeMatch = scholarship.degreeLevel.includes(user.degreeLevel);
    scoreBreakdown.degreeMatch = degreeMatch ? 100 : 0;
    totalWeight += 15;

    if (!degreeMatch) {
      reasoning.push(
        `🎓 Degree level mismatch: ${scholarship.degreeLevel.join(", ")} vs ${user.degreeLevel}`
      );
    } else {
      reasoning.push("✅ Degree level matches");
    }
  } else {
    scoreBreakdown.degreeMatch = 100; // No restriction
    totalWeight += 15;
  }

  // 5. Location Matching (10% weight)
  if (user.interestedCountries && user.interestedCountries.length > 0 && scholarship.country) {
    const locationMatch = user.interestedCountries.some(
      (country) => country.toLowerCase() === scholarship.country?.toLowerCase()
    );
    scoreBreakdown.locationMatch = locationMatch ? 100 : 50;
    totalWeight += 10;

    if (locationMatch) {
      reasoning.push(`✅ ${scholarship.country} is in your interested countries`);
    } else {
      reasoning.push(`📍 ${scholarship.country} not in your top choices, but still available`);
    }
  } else {
    scoreBreakdown.locationMatch = 100;
    totalWeight += 10;
  }

  // 6. Demographic Matching (10% weight)
  let demographicScore = 100;

  if (scholarship.forWomen && user.gender?.toLowerCase() === "female") {
    demographicScore = 100;
    reasoning.push("👩 Scholarship for women - you qualify!");
  } else if (scholarship.forWomen && user.gender?.toLowerCase() !== "female") {
    demographicScore = 0;
    reasoning.push("❌ Scholarship is for women only");
  }

  if (scholarship.forAfrican && user.country) {
    const africanCountries = [
      "Nigeria", "Kenya", "Ghana", "Tanzania", "Uganda", "Ethiopia", "South Africa", "Egypt",
      "Senegal", "Cameroon", "Morocco", "Tunisia", "Algeria", "Ivory Coast", "Rwanda", "Zambia",
      "Zimbabwe", "Botswana", "Namibia", "Malawi", "Mozambique", "Madagascar", "Mali", "Burkina Faso"
    ];
    const isAfrican = africanCountries.some(
      (country) => country.toLowerCase() === user.country?.toLowerCase()
    );
    if (isAfrican) {
      demographicScore = 100;
      reasoning.push("🌍 You qualify as an African student");
    } else {
      demographicScore = 0;
      reasoning.push("❌ Scholarship restricted to African students");
    }
  }

  scoreBreakdown.demographicMatch = demographicScore;
  totalWeight += 10;

  // 7. Deadline Urgency (weighted bonus, not part of strict score)
  if (scholarship.deadline) {
    const daysUntilDeadline =
      (new Date(scholarship.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24);

    if (daysUntilDeadline < 7) {
      scoreBreakdown.deadline = 100; // Urgent
      reasoning.push("🚨 Deadline is within 7 days - act fast!");
    } else if (daysUntilDeadline < 30) {
      scoreBreakdown.deadline = 80;
      reasoning.push("⏰ Deadline is in less than 30 days");
    } else if (daysUntilDeadline < 60) {
      scoreBreakdown.deadline = 60;
      reasoning.push("📅 Deadline is in about a month");
    } else {
      scoreBreakdown.deadline = 40;
    }
  } else {
    scoreBreakdown.deadline = 30; // No deadline info
  }

  // Calculate weighted score
  const overallScore =
    (scoreBreakdown.gpaMatch * 15 +
      scoreBreakdown.testScoreMatch * 20 +
      scoreBreakdown.fieldMatch * 20 +
      scoreBreakdown.degreeMatch * 15 +
      scoreBreakdown.locationMatch * 10 +
      scoreBreakdown.demographicMatch * 10) /
    100;

  const isGoodMatch = overallScore >= 60;

  // Add verdict
  if (isGoodMatch) {
    if (overallScore >= 85) {
      reasoning.unshift("🎯 EXCELLENT MATCH - You should definitely apply!");
    } else if (overallScore >= 75) {
      reasoning.unshift("✅ STRONG MATCH - This is a great opportunity!");
    } else {
      reasoning.unshift("📌 GOOD MATCH - Worth considering!");
    }
  } else {
    if (overallScore >= 50) {
      reasoning.unshift("⚠️ PARTIAL MATCH - Check eligibility carefully before applying");
    } else {
      reasoning.unshift("❌ NOT A GOOD MATCH - You may not meet requirements");
    }
  }

  return {
    scholarshipId: scholarship.id,
    overallScore: Math.round(overallScore),
    scoreBreakdown,
    reasoning,
    isGoodMatch,
  };
}

/**
 * Rank scholarships by match score
 */
export function rankScholarships(
  user: UserProfile,
  scholarships: ScholarshipData[]
): MatchScore[] {
  const scores = scholarships.map((scholarship) => calculateMatchScore(user, scholarship));

  // Sort by overall score descending, then by deadline urgency
  return scores.sort((a, b) => {
    if (b.overallScore !== a.overallScore) {
      return b.overallScore - a.overallScore;
    }
    return b.scoreBreakdown.deadline - a.scoreBreakdown.deadline;
  });
}

/**
 * Get top N matches for a user
 */
export function getTopMatches(
  user: UserProfile,
  scholarships: ScholarshipData[],
  limit: number = 5
): MatchScore[] {
  return rankScholarships(user, scholarships).slice(0, limit);
}

/**
 * Find "hidden gem" scholarships - good matches with low views
 */
export function findHiddenGems(
  user: UserProfile,
  scholarships: ScholarshipData[],
  minScore: number = 70,
  maxViews: number = 100
): MatchScore[] {
  const scores = scholarships
    .filter((s) => (s.views || 0) <= maxViews)
    .map((scholarship) => calculateMatchScore(user, scholarship))
    .filter((score) => score.overallScore >= minScore);

  return scores.sort((a, b) => b.overallScore - a.overallScore);
}
