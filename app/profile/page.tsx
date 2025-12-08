"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  MapPin,
  GraduationCap,
  BookOpen,
  Target,
  Settings,
  Bell,
  Lock,
  Save,
  Edit,
  CheckCircle2,
  Camera,
  Globe,
  Calendar,
  Award,
  FileText,
  Loader2 as LoaderIcon,
  LogIn,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  // Check authentication status
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/session');
        const session = await res.json();
        if (!session || !session.user) {
          router.push('/auth/signin?callbackUrl=/profile');
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        router.push('/auth/signin?callbackUrl=/profile');
        setIsAuthenticated(false);
      }
    }
    checkAuth();
  }, [router]);

  const [profile, setProfile] = useState({
    // Personal Information
    firstName: "Sarah",
    lastName: "Mwangi",
    email: "sarah.mwangi@email.com",
    phone: "+254 712 345 678",
    dateOfBirth: "2002-05-15",
    gender: "Female",
    nationality: "Kenyan",
    currentCountry: "Kenya",
    city: "Nairobi",
    
    // Academic Background
    currentDegree: "Bachelor's",
    fieldOfStudy: "Computer Science",
    university: "University of Nairobi",
    gpa: "3.8",
    expectedGraduation: "2026-06",
    
    // Test Scores
    toeflScore: "",
    ieltsScore: "7.5",
    greScore: "",
    gmatScore: "",
    satScore: "",
    
    // Preferences
    targetDegree: ["Master's", "PhD"],
    targetCountries: ["USA", "UK", "Canada"],
    targetFields: ["Computer Science", "Data Science", "AI"],
    budgetConcern: "Full Scholarship Required",
    startDate: "Fall 2026",
    
    // Additional
    bio: "Passionate computer science student with a focus on artificial intelligence and machine learning. Active community volunteer teaching coding to young girls in underserved communities.",
    linkedIn: "linkedin.com/in/sarahmwangi",
    github: "github.com/sarahmwangi",
  });
  const [loading, setLoading] = useState(true);

  // Fetch user profile data
  useEffect(() => {
    if (isAuthenticated === false) return;
    if (isAuthenticated === null) return;

    async function fetchProfile() {
      try {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setProfile(prev => ({
              ...prev,
              firstName: data.user.name?.split(' ')[0] || prev.firstName,
              lastName: data.user.name?.split(' ').slice(1).join(' ') || prev.lastName,
              email: data.user.email || prev.email,
              phone: data.user.phone || prev.phone,
              dateOfBirth: data.user.dateOfBirth ? new Date(data.user.dateOfBirth).toISOString().split('T')[0] : prev.dateOfBirth,
              gender: data.user.gender || prev.gender,
              nationality: data.user.country || prev.nationality,
              currentCountry: data.user.country || prev.currentCountry,
              currentDegree: data.user.degreeLevel || prev.currentDegree,
              fieldOfStudy: data.user.fieldOfStudy || prev.fieldOfStudy,
              university: data.user.currentInstitution || prev.university,
              gpa: data.user.currentGPA?.toString() || prev.gpa,
              expectedGraduation: data.user.graduationYear?.toString() || prev.expectedGraduation,
              toeflScore: data.user.toeflScore?.toString() || prev.toeflScore,
              ieltsScore: data.user.ieltsScore?.toString() || prev.ieltsScore,
              greScore: data.user.greScore?.toString() || prev.greScore,
              gmatScore: data.user.gmatScore?.toString() || prev.gmatScore,
              targetCountries: data.user.interestedCountries || prev.targetCountries,
              startDate: data.user.preferredIntake || prev.startDate,
            }));
          }
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [isAuthenticated]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${profile.firstName} ${profile.lastName}`.trim(),
          phone: profile.phone,
          country: profile.currentCountry,
          dateOfBirth: profile.dateOfBirth,
          gender: profile.gender,
          fieldOfStudy: profile.fieldOfStudy,
          currentGPA: parseFloat(profile.gpa) || null,
          degreeLevel: profile.currentDegree,
          currentInstitution: profile.university,
          graduationYear: parseInt(profile.expectedGraduation) || null,
          ieltsScore: parseFloat(profile.ieltsScore) || null,
          toeflScore: parseInt(profile.toeflScore) || null,
          greScore: parseInt(profile.greScore) || null,
          gmatScore: parseInt(profile.gmatScore) || null,
          interestedCountries: profile.targetCountries,
          preferredIntake: profile.startDate,
        }),
      });
      
      if (res.ok) {
        alert("Profile updated successfully!");
        setEditing(false);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setProfile({ ...profile, [field]: value });
  };

  const completionPercentage = () => {
    const fields = Object.values(profile).filter(v => v && v.toString().trim() !== "");
    return Math.round((fields.length / Object.keys(profile).length) * 100);
  };

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoaderIcon className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (redirect will happen)
  if (isAuthenticated === false) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                My Profile
              </h1>
              <p className="text-sm text-gray-600">
                Manage your personal information and preferences
              </p>
            </div>
            {!editing ? (
              <Button onClick={() => setEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <>
                      <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                {/* Profile Picture */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                      {profile.firstName[0]}{profile.lastName[0]}
                    </div>
                    {editing && (
                      <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border-2 border-gray-100">
                        <Camera className="h-4 w-4 text-gray-600" />
                      </button>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mt-3">
                    {profile.firstName} {profile.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">{profile.email}</p>
                </div>

                {/* Profile Completion */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Profile Completion</span>
                    <span className="text-sm font-bold text-primary">{completionPercentage()}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${completionPercentage()}%` }}
                    />
                  </div>
                </div>

                {/* Navigation */}
                <div className="space-y-1">
                  <button
                    onClick={() => setActiveTab("personal")}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeTab === "personal"
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <User className="h-4 w-4" />
                    Personal Info
                  </button>
                  <button
                    onClick={() => setActiveTab("academic")}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeTab === "academic"
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <GraduationCap className="h-4 w-4" />
                    Academic
                  </button>
                  <button
                    onClick={() => setActiveTab("preferences")}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeTab === "preferences"
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Target className="h-4 w-4" />
                    Preferences
                  </button>
                  <button
                    onClick={() => setActiveTab("documents")}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeTab === "documents"
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    Documents
                  </button>
                  <button
                    onClick={() => setActiveTab("settings")}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeTab === "settings"
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Personal Information */}
            {activeTab === "personal" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Your basic personal details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          First Name
                        </label>
                        <Input
                          value={profile.firstName}
                          onChange={(e) => handleChange("firstName", e.target.value)}
                          disabled={!editing}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Last Name
                        </label>
                        <Input
                          value={profile.lastName}
                          onChange={(e) => handleChange("lastName", e.target.value)}
                          disabled={!editing}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Email Address
                        </label>
                        <Input
                          type="email"
                          value={profile.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          disabled={!editing}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Phone Number
                        </label>
                        <Input
                          value={profile.phone}
                          onChange={(e) => handleChange("phone", e.target.value)}
                          disabled={!editing}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Date of Birth
                        </label>
                        <Input
                          type="date"
                          value={profile.dateOfBirth}
                          onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                          disabled={!editing}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Gender
                        </label>
                        <select
                          className="w-full px-3 py-2 border rounded-md text-sm"
                          value={profile.gender}
                          onChange={(e) => handleChange("gender", e.target.value)}
                          disabled={!editing}
                        >
                          <option value="Female">Female</option>
                          <option value="Male">Male</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Nationality
                        </label>
                        <Input
                          value={profile.nationality}
                          onChange={(e) => handleChange("nationality", e.target.value)}
                          disabled={!editing}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Current Country
                        </label>
                        <Input
                          value={profile.currentCountry}
                          onChange={(e) => handleChange("currentCountry", e.target.value)}
                          disabled={!editing}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Bio
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border rounded-md text-sm"
                          rows={4}
                          value={profile.bio}
                          onChange={(e) => handleChange("bio", e.target.value)}
                          disabled={!editing}
                          placeholder="Tell us about yourself, your goals, and interests..."
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Academic Background */}
            {activeTab === "academic" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Academic Background</CardTitle>
                    <CardDescription>
                      Your education history and test scores
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {/* Current Education */}
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-4">
                          Current Education
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              Current Degree
                            </label>
                            <select
                              className="w-full px-3 py-2 border rounded-md text-sm"
                              value={profile.currentDegree}
                              onChange={(e) => handleChange("currentDegree", e.target.value)}
                              disabled={!editing}
                            >
                              <option>High School</option>
                              <option>Bachelor's</option>
                              <option>Master's</option>
                              <option>PhD</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              Field of Study
                            </label>
                            <Input
                              value={profile.fieldOfStudy}
                              onChange={(e) => handleChange("fieldOfStudy", e.target.value)}
                              disabled={!editing}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              University/Institution
                            </label>
                            <Input
                              value={profile.university}
                              onChange={(e) => handleChange("university", e.target.value)}
                              disabled={!editing}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              GPA (out of 4.0)
                            </label>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              max="4.0"
                              value={profile.gpa}
                              onChange={(e) => handleChange("gpa", e.target.value)}
                              disabled={!editing}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              Expected Graduation
                            </label>
                            <Input
                              type="month"
                              value={profile.expectedGraduation}
                              onChange={(e) => handleChange("expectedGraduation", e.target.value)}
                              disabled={!editing}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Test Scores */}
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-4">
                          Standardized Test Scores
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              TOEFL Score
                            </label>
                            <Input
                              type="number"
                              placeholder="0-120"
                              value={profile.toeflScore}
                              onChange={(e) => handleChange("toeflScore", e.target.value)}
                              disabled={!editing}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              IELTS Score
                            </label>
                            <Input
                              type="number"
                              step="0.5"
                              placeholder="0-9"
                              value={profile.ieltsScore}
                              onChange={(e) => handleChange("ieltsScore", e.target.value)}
                              disabled={!editing}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              GRE Score
                            </label>
                            <Input
                              type="number"
                              placeholder="260-340"
                              value={profile.greScore}
                              onChange={(e) => handleChange("greScore", e.target.value)}
                              disabled={!editing}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              GMAT Score
                            </label>
                            <Input
                              type="number"
                              placeholder="200-800"
                              value={profile.gmatScore}
                              onChange={(e) => handleChange("gmatScore", e.target.value)}
                              disabled={!editing}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Social Links */}
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-4">
                          Professional Links
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              LinkedIn Profile
                            </label>
                            <Input
                              type="url"
                              placeholder="linkedin.com/in/yourprofile"
                              value={profile.linkedIn}
                              onChange={(e) => handleChange("linkedIn", e.target.value)}
                              disabled={!editing}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              GitHub Profile
                            </label>
                            <Input
                              type="url"
                              placeholder="github.com/yourprofile"
                              value={profile.github}
                              onChange={(e) => handleChange("github", e.target.value)}
                              disabled={!editing}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Preferences */}
            {activeTab === "preferences" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Study Preferences</CardTitle>
                    <CardDescription>
                      Help us match you with the best scholarships
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Target Countries (Select all that apply)
                        </label>
                        <div className="grid md:grid-cols-3 gap-3">
                          {["USA", "UK", "Canada", "Germany", "Australia", "Netherlands", "Sweden", "France"].map((country) => (
                            <label key={country} className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                              <input
                                type="checkbox"
                                checked={profile.targetCountries.includes(country)}
                                onChange={(e) => {
                                  const updated = e.target.checked
                                    ? [...profile.targetCountries, country]
                                    : profile.targetCountries.filter(c => c !== country);
                                  handleChange("targetCountries", updated);
                                }}
                                disabled={!editing}
                                className="w-4 h-4"
                              />
                              <span className="text-sm">{country}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Target Fields (Select all that apply)
                        </label>
                        <div className="grid md:grid-cols-3 gap-3">
                          {["Computer Science", "Engineering", "Business", "Medicine", "Data Science", "AI", "Law", "Arts"].map((field) => (
                            <label key={field} className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                              <input
                                type="checkbox"
                                checked={profile.targetFields.includes(field)}
                                onChange={(e) => {
                                  const updated = e.target.checked
                                    ? [...profile.targetFields, field]
                                    : profile.targetFields.filter(f => f !== field);
                                  handleChange("targetFields", updated);
                                }}
                                disabled={!editing}
                                className="w-4 h-4"
                              />
                              <span className="text-sm">{field}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Funding Requirement
                          </label>
                          <select
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            value={profile.budgetConcern}
                            onChange={(e) => handleChange("budgetConcern", e.target.value)}
                            disabled={!editing}
                          >
                            <option>Full Scholarship Required</option>
                            <option>Partial Funding Acceptable</option>
                            <option>Can Self-Fund Partially</option>
                            <option>Flexible</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Intended Start Date
                          </label>
                          <select
                            className="w-full px-3 py-2 border rounded-md text-sm"
                            value={profile.startDate}
                            onChange={(e) => handleChange("startDate", e.target.value)}
                            disabled={!editing}
                          >
                            <option>Fall 2025</option>
                            <option>Spring 2026</option>
                            <option>Fall 2026</option>
                            <option>Spring 2027</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Documents */}
            {activeTab === "documents" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Documents</CardTitle>
                    <CardDescription>
                      Upload and manage your application documents
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: "Passport/ID", uploaded: true },
                        { name: "Academic Transcripts", uploaded: true },
                        { name: "Resume/CV", uploaded: false },
                        { name: "Personal Statement", uploaded: false },
                        { name: "Letters of Recommendation", uploaded: false },
                      ].map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                              <p className="text-xs text-gray-500">
                                {doc.uploaded ? "Uploaded" : "Not uploaded"}
                              </p>
                            </div>
                          </div>
                          {doc.uploaded ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <Button size="sm" variant="outline">
                              Upload
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Settings */}
            {activeTab === "settings" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>
                      Manage how you receive updates
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { label: "Email notifications for new scholarships", checked: true },
                        { label: "Deadline reminders", checked: true },
                        { label: "Application status updates", checked: true },
                        { label: "Weekly scholarship digest", checked: false },
                        { label: "Marketing emails", checked: false },
                      ].map((setting, index) => (
                        <label key={index} className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <span className="text-sm font-medium text-gray-900">{setting.label}</span>
                          <input
                            type="checkbox"
                            defaultChecked={setting.checked}
                            className="w-4 h-4"
                          />
                        </label>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Security</CardTitle>
                    <CardDescription>
                      Manage your password and security settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <Lock className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Bell className="h-4 w-4 mr-2" />
                      Enable Two-Factor Authentication
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                      Delete Account
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
