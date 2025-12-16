import StudentIntakeForm from '@/components/student-intake-form';

export default function StudentIntakePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Student Intake Form
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complete this comprehensive form to help us understand your educational background and study abroad goals. 
            This information will enable us to provide personalized guidance and match you with the best scholarship opportunities.
          </p>
        </div>

        {/* Form */}
        <StudentIntakeForm />

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            All information provided will be kept confidential and used solely for educational consultation purposes.
          </p>
        </div>
      </div>
    </div>
  );
}
