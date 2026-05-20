import React, { useState, useRef } from 'react';
import { Upload, LogOut, Menu, X, Download, Eye, EyeOff, CheckCircle, AlertCircle, Lock, Users, Briefcase, LogIn, HomeIcon, FileText, Building2, GraduationCap, Shield, Clock, TrendingUp, MapPin, Mail, Phone } from 'lucide-react';

// DATABASE & LOGGING SYSTEM
class DatabaseLogger {
  constructor() {
    this.students = [];
    this.employers = [];
    this.applications = [];
    this.internshipOffers = [];
  }

  addStudent(data) {
    const student = {
      id: `STU-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
      status: 'verified'
    };
    this.students.push(student);
    return student;
  }

  addEmployer(data) {
    const employer = {
      id: `EMP-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
      status: 'pending_verification'
    };
    this.employers.push(employer);
    return employer;
  }

  addApplication(data) {
    const application = {
      id: `APP-${Date.now()}`,
      ...data,
      timestamp: new Date().toISOString()
    };
    this.applications.push(application);
    return application;
  }

  addInternshipOffer(data) {
    const offer = {
      id: `INT-${Date.now()}`,
      ...data,
      timestamp: new Date().toISOString()
    };
    this.internshipOffers.push(offer);
    return offer;
  }

  exportToJSON() {
    const data = {
      exportDate: new Date().toISOString(),
      students: this.students,
      employers: this.employers,
      applications: this.applications,
      internshipOffers: this.internshipOffers,
      summary: {
        totalStudents: this.students.length,
        totalEmployers: this.employers.length,
        totalApplications: this.applications.length,
        totalInternships: this.internshipOffers.length
      }
    };
    return JSON.stringify(data, null, 2);
  }

  downloadDatabase() {
    const jsonData = this.exportToJSON();
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonData));
    element.setAttribute('download', `CHSSERJOBS-Database-${Date.now()}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
}

const db = new DatabaseLogger();

// MAIN APP COMPONENT
export default function CHSSERJobs() {
  const [currentPage, setCurrentPage] = useState('home');
  const [userRole, setUserRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [showAdminPasswordInput, setShowAdminPasswordInput] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Student form states
  const [studentForm, setStudentForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    university: '',
    degreeField: '',
    graduationYear: '',
    universityResults: null,
    nationalId: null,
    passport: null
  });

  const [studentFaceAnalysis, setStudentFaceAnalysis] = useState(null);
  const [studentVerified, setStudentVerified] = useState(false);
  const [registeredStudents, setRegisteredStudents] = useState([]);

  // Employer form states
  const [employerForm, setEmployerForm] = useState({
    companyName: '',
    businessEmail: '',
    contactPerson: '',
    phone: '',
    businessAddress: '',
    city: '',
    country: '',
    industry: '',
    companySize: '',
    registrationNumber: ''
  });

  const [employerVerified, setEmployerVerified] = useState(false);
  const [registeredEmployers, setRegisteredEmployers] = useState([]);

  // Job posting states
  const [jobPosting, setJobPosting] = useState({
    position: '',
    description: '',
    requirements: '',
    location: '',
    jobType: 'full-time',
    deadline: ''
  });

  const [postedJobs, setPostedJobs] = useState([]);

  // Internship offering states
  const [internshipOffer, setInternshipOffer] = useState({
    position: '',
    description: '',
    requirements: '',
    duration: '',
    location: '',
    startDate: '',
    stipend: ''
  });

  const [postedInternships, setPostedInternships] = useState([]);

  // Applications
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Admin password setup
  const handleSetAdminPassword = () => {
    if (adminPassword.trim().length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    setAdminLoggedIn(true);
    alert('Admin password set successfully!');
  };

  const handleAdminLogin = () => {
    if (adminPasswordInput === adminPassword) {
      setAdminLoggedIn(true);
      setCurrentPage('admin');
      setShowAdminPasswordInput(false);
    } else {
      alert('Incorrect password');
    }
  };

  // Student verification simulation (AI face analysis + document verification)
  const simulateStudentVerification = async () => {
    if (!studentForm.firstName || !studentForm.email || !studentForm.university || 
        !studentForm.universityResults || !studentForm.nationalId || !studentForm.passport) {
      alert('Please fill all fields and upload all required documents');
      return;
    }

    // Simulate AI face analysis
    setStudentFaceAnalysis({
      faceDetected: true,
      confidence: (85 + Math.random() * 10).toFixed(1),
      ageEstimate: '18-25',
      timestamp: new Date().toLocaleString()
    });

    // Simulate document verification
    const verified = Math.random() > 0.1; // 90% verification success rate

    if (verified) {
      const newStudent = {
        id: `STU-${Date.now()}`,
        ...studentForm,
        faceAnalysis: studentFaceAnalysis,
        verifiedAt: new Date().toLocaleString()
      };

      db.addStudent(newStudent);
      setRegisteredStudents([...registeredStudents, newStudent]);
      setStudentVerified(true);
      setIsLoggedIn(true);
      setUserRole('student');
      setCurrentPage('student-dashboard');

      alert('✓ Verification successful! Welcome to CHSSERJOBS');
      setStudentForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        university: '',
        degreeField: '',
        graduationYear: '',
        universityResults: null,
        nationalId: null,
        passport: null
      });
    } else {
      alert('✗ Verification failed. Please ensure all documents are clear and valid.');
    }
  };

  // Employer verification
  const simulateEmployerVerification = async () => {
    if (!employerForm.companyName || !employerForm.businessEmail || !employerForm.businessAddress) {
      alert('Please fill all required fields');
      return;
    }

    // Simulate business address verification and registration check
    const verified = Math.random() > 0.15; // 85% verification success rate

    if (verified) {
      const newEmployer = {
        id: `EMP-${Date.now()}`,
        ...employerForm,
        verifiedAt: new Date().toLocaleString(),
        status: 'verified'
      };

      db.addEmployer(newEmployer);
      setRegisteredEmployers([...registeredEmployers, newEmployer]);
      setEmployerVerified(true);
      setIsLoggedIn(true);
      setUserRole('employer');
      setCurrentPage('employer-dashboard');

      alert('✓ Employer verification successful! Welcome to CHSSERJOBS');
      setEmployerForm({
        companyName: '',
        businessEmail: '',
        contactPerson: '',
        phone: '',
        businessAddress: '',
        city: '',
        country: '',
        industry: '',
        companySize: '',
        registrationNumber: ''
      });
    } else {
      alert('✗ Verification failed. Please ensure all business details are accurate.');
    }
  };

  // Job and internship posting
  const handlePostJob = () => {
    if (!jobPosting.position || !jobPosting.description || !jobPosting.requirements) {
      alert('Please fill all required fields');
      return;
    }

    const newJob = {
      id: `JOB-${Date.now()}`,
      employerId: registeredEmployers[0]?.id,
      employerName: registeredEmployers[0]?.companyName,
      ...jobPosting,
      postedAt: new Date().toLocaleString(),
      applications: 0
    };

    db.addEmployer({ ...registeredEmployers[0], jobsPosted: (registeredEmployers[0]?.jobsPosted || 0) + 1 });
    setPostedJobs([...postedJobs, newJob]);
    alert('✓ Job posted successfully!');
    setJobPosting({
      position: '',
      description: '',
      requirements: '',
      location: '',
      jobType: 'full-time',
      deadline: ''
    });
  };

  const handlePostInternship = () => {
    if (!internshipOffer.position || !internshipOffer.description) {
      alert('Please fill all required fields');
      return;
    }

    const newInternship = {
      id: `INT-${Date.now()}`,
      employerId: registeredEmployers[0]?.id,
      employerName: registeredEmployers[0]?.companyName,
      ...internshipOffer,
      postedAt: new Date().toLocaleString()
    };

    db.addInternshipOffer(newInternship);
    setPostedInternships([...postedInternships, newInternship]);
    alert('✓ Internship offer posted successfully!');
    setInternshipOffer({
      position: '',
      description: '',
      requirements: '',
      duration: '',
      location: '',
      startDate: '',
      stipend: ''
    });
  };

  const handleApplyToJob = (jobId) => {
    if (!isLoggedIn || userRole !== 'student') {
      alert('Please log in as a student to apply');
      return;
    }

    const application = {
      id: `APP-${Date.now()}`,
      jobId,
      studentId: registeredStudents[0]?.id,
      studentName: `${registeredStudents[0]?.firstName} ${registeredStudents[0]?.lastName}`,
      studentEmail: registeredStudents[0]?.email,
      appliedAt: new Date().toLocaleString(),
      status: 'pending'
    };

    db.addApplication(application);
    setApplications([...applications, application]);
    alert('✓ Application submitted successfully!');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setStudentVerified(false);
    setEmployerVerified(false);
    setCurrentPage('home');
  };

  const downloadDatabase = () => {
    db.downloadDatabase();
    alert('✓ Database exported successfully!');
  };

  // RENDER COMPONENTS
  const renderHeader = () => (
    <header className="sticky top-0 z-50 backdrop-blur-md border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); }}>
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center font-bold text-slate-900 text-lg shadow-lg">
              CS
            </div>
            <span className="font-bold text-white text-lg hidden sm:block">CHSSERJOBS</span>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex gap-8 items-center">
            <button onClick={() => setCurrentPage('home')} className="text-slate-300 hover:text-white transition">Home</button>
            {!isLoggedIn && (
              <>
                <button onClick={() => setCurrentPage('student-signup')} className="text-slate-300 hover:text-white transition">Students</button>
                <button onClick={() => setCurrentPage('employer-signup')} className="text-slate-300 hover:text-white transition">Employers</button>
              </>
            )}
            {adminPassword && (
              <button 
                onClick={() => setShowAdminPasswordInput(true)}
                className="text-slate-300 hover:text-white transition flex items-center gap-2"
              >
                <Lock size={18} /> Admin
              </button>
            )}
            {isLoggedIn && (
              <>
                <button onClick={handleLogout} className="text-slate-300 hover:text-white transition flex items-center gap-2">
                  <LogOut size={18} /> Logout
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-3">
            <button onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); }} className="text-slate-300 hover:text-white transition text-left">Home</button>
            {!isLoggedIn && (
              <>
                <button onClick={() => { setCurrentPage('student-signup'); setMobileMenuOpen(false); }} className="text-slate-300 hover:text-white transition text-left">Students</button>
                <button onClick={() => { setCurrentPage('employer-signup'); setMobileMenuOpen(false); }} className="text-slate-300 hover:text-white transition text-left">Employers</button>
              </>
            )}
            {isLoggedIn && (
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-slate-300 hover:text-white transition text-left flex items-center gap-2">
                <LogOut size={18} /> Logout
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );

  const renderHome = () => (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {renderHeader()}

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-700/25 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center space-y-8 relative z-10">
            <h1 className="text-5xl sm:text-7xl font-black text-white leading-tight">
              Your Career <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Starts Here</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Connect African talent with leading employers. Find internships, job placements, and career growth opportunities at top firms across your country.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <button onClick={() => setCurrentPage('student-signup')} className="px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-bold rounded-lg hover:shadow-lg hover:shadow-amber-500/50 transition">
                I'm a Student
              </button>
              <button onClick={() => setCurrentPage('employer-signup')} className="px-8 py-4 border-2 border-slate-400 text-white font-bold rounded-lg hover:border-amber-400 transition">
                I'm an Employer
              </button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {[
            { icon: GraduationCap, title: 'Verified Students', desc: 'AI-powered verification ensures quality candidates with real credentials' },
            { icon: Building2, title: 'Trusted Employers', desc: 'Partner with verified companies across diverse industries' },
            { icon: TrendingUp, title: 'Career Growth', desc: 'From internships to full-time roles, build your African career' }
          ].map((feature, i) => (
            <div key={i} className="p-8 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-amber-400/50 transition backdrop-blur">
              <feature.icon className="text-amber-400 mb-4" size={32} />
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderStudentSignup = () => (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {renderHeader()}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 backdrop-blur">
          <h2 className="text-3xl font-bold text-white mb-2">Student Registration</h2>
          <p className="text-slate-400 mb-8">Complete verification to access job opportunities</p>

          <div className="space-y-6">
            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-amber-400">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  value={studentForm.firstName}
                  onChange={(e) => setStudentForm({...studentForm, firstName: e.target.value})}
                  className="bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-amber-400 outline-none"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={studentForm.lastName}
                  onChange={(e) => setStudentForm({...studentForm, lastName: e.target.value})}
                  className="bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-amber-400 outline-none"
                />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                value={studentForm.email}
                onChange={(e) => setStudentForm({...studentForm, email: e.target.value})}
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-amber-400 outline-none"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={studentForm.phone}
                onChange={(e) => setStudentForm({...studentForm, phone: e.target.value})}
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-amber-400 outline-none"
              />
            </div>

            {/* Education Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-amber-400">Education Details</h3>
              <input
                type="text"
                placeholder="University Name"
                value={studentForm.university}
                onChange={(e) => setStudentForm({...studentForm, university: e.target.value})}
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-amber-400 outline-none"
              />
              <input
                type="text"
                placeholder="Degree Field (e.g., Computer Science)"
                value={studentForm.degreeField}
                onChange={(e) => setStudentForm({...studentForm, degreeField: e.target.value})}
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-amber-400 outline-none"
              />
              <input
                type="number"
                placeholder="Graduation Year"
                value={studentForm.graduationYear}
                onChange={(e) => setStudentForm({...studentForm, graduationYear: e.target.value})}
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-amber-400 outline-none"
              />
            </div>

            {/* Document Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-amber-400">Document Verification</h3>
              <div className="space-y-3">
                {[
                  { label: 'University Results', key: 'universityResults' },
                  { label: 'National ID', key: 'nationalId' },
                  { label: 'Passport', key: 'passport' }
                ].map((doc) => (
                  <label key={doc.key} className="flex items-center gap-3 p-4 bg-slate-700 rounded-lg border border-slate-600 cursor-pointer hover:border-amber-400">
                    <Upload size={20} className="text-amber-400" />
                    <span className="text-white flex-1">{doc.label}</span>
                    <input
                      type="file"
                      onChange={(e) => setStudentForm({...studentForm, [doc.key]: e.target.files[0]?.name || 'uploaded'})}
                      className="hidden"
                    />
                    {studentForm[doc.key] && <CheckCircle size={20} className="text-green-400" />}
                  </label>
                ))}
              </div>
            </div>

            {/* Face Analysis */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-amber-400">Face Verification</h3>
              <p className="text-sm text-slate-400">Our AI will analyze your face to confirm adult status and match it with your documents</p>
              <button
                onClick={() => setStudentFaceAnalysis({
                  faceDetected: true,
                  confidence: (85 + Math.random() * 10).toFixed(1),
                  ageEstimate: '18-25',
                  timestamp: new Date().toLocaleString()
                })}
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 hover:border-amber-400 transition"
              >
                📷 Capture Face
              </button>
              {studentFaceAnalysis && (
                <div className="bg-green-900/20 border border-green-600 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle size={20} /> Face Detected
                  </div>
                  <p className="text-sm text-slate-300">Confidence: {studentFaceAnalysis.confidence}%</p>
                  <p className="text-sm text-slate-300">Age Estimate: {studentFaceAnalysis.ageEstimate}</p>
                </div>
              )}
            </div>

            <button
              onClick={simulateStudentVerification}
              className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-amber-500/50 transition"
            >
              Complete Verification
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmployerSignup = () => (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {renderHeader()}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 backdrop-blur">
          <h2 className="text-3xl font-bold text-white mb-2">Employer Registration</h2>
          <p className="text-slate-400 mb-8">Register your company to access top talent and post opportunities</p>

          <div className="space-y-6">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-amber-400">Company Information</h3>
              <input
                type="text"
                placeholder="Company Name"
                value={employerForm.companyName}
                onChange={(e) => setEmployerForm({...employerForm, companyName: e.target.value})}
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-amber-400 outline-none"
              />
              <input
                type="email"
                placeholder="Business Email"
                value={employerForm.businessEmail}
                onChange={(e) => setEmployerForm({...employerForm, businessEmail: e.target.value})}
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-amber-400 outline-none"
              />
              <input
                type="text"
                placeholder="Contact Person Name"
                value={employerForm.contactPerson}
                onChange={(e) => setEmployerForm({...employerForm, contactPerson: e.target.value})}
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-amber-400 outline-none"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={employerForm.phone}
                onChange={(e) => setEmployerForm({...employerForm, phone: e.target.value})}
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-amber-400 outline-none"
              />
            </div>

            {/* Location & Business */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-amber-400">Location & Business Details</h3>
              <input
                type="text"
                placeholder="Physical Business Address"
                value={employerForm.businessAddress}
                onChange={(e) => setEmployerForm({...employerForm, businessAddress: e.target.value})}
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-amber-400 outline-none"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  value={employerForm.city}
                  onChange={(e) => setEmployerForm({...employerForm, city: e.target.value})}
                  className="bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-amber-400 outline-none"
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={employerForm.country}
                  onChange={(e) => setEmployerForm({...employerForm, country: e.target.value})}
                  className="bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-amber-400 outline-none"
                />
              </div>
              <input
                type="text"
                placeholder="Industry (e.g., Technology, Finance)"
                value={employerForm.industry}
                onChange={(e) => setEmployerForm({...employerForm, industry: e.target.value})}
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-amber-400 outline-none"
              />
              <select
                value={employerForm.companySize}
                onChange={(e) => setEmployerForm({...employerForm, companySize: e.target.value})}
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-amber-400 outline-none"
              >
                <option value="">Select Company Size</option>
                <option value="1-10">1-10 Employees</option>
                <option value="11-50">11-50 Employees</option>
                <option value="51-200">51-200 Employees</option>
                <option value="200+">200+ Employees</option>
              </select>
              <input
                type="text"
                placeholder="Business Registration Number"
                value={employerForm.registrationNumber}
                onChange={(e) => setEmployerForm({...employerForm, registrationNumber: e.target.value})}
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-amber-400 outline-none"
              />
            </div>

            <button
              onClick={simulateEmployerVerification}
              className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-amber-500/50 transition"
            >
              Verify & Register Company
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStudentDashboard = () => (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {renderHeader()}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Jobs Available', value: postedJobs.length, icon: Briefcase },
            { label: 'Internships', value: postedInternships.length, icon: GraduationCap },
            { label: 'Applications', value: applications.length, icon: FileText },
            { label: 'Profile', value: 'Complete', icon: Shield }
          ].map((stat, i) => (
            <div key={i} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <stat.icon className="text-amber-400 mb-2" size={24} />
              <p className="text-slate-400 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Jobs Section */}
            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Briefcase className="text-amber-400" /> Available Jobs
              </h3>
              {postedJobs.length > 0 ? (
                <div className="space-y-4">
                  {postedJobs.map((job) => (
                    <div key={job.id} className="bg-slate-700/50 rounded-xl p-6 border border-slate-600 hover:border-amber-400/50 transition">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-lg font-bold text-white">{job.position}</h4>
                          <p className="text-amber-400 text-sm">{job.employerName}</p>
                        </div>
                        <span className="px-3 py-1 bg-amber-400/20 text-amber-400 rounded-full text-sm font-semibold">{job.jobType}</span>
                      </div>
                      <p className="text-slate-300 text-sm mb-4">{job.description}</p>
                      <div className="flex gap-2 mb-4 flex-wrap">
                        {job.requirements.split(',').slice(0, 3).map((req, i) => (
                          <span key={i} className="text-xs bg-slate-600 text-slate-200 px-2 py-1 rounded">
                            {req.trim()}
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-4 text-sm text-slate-400">
                          <span className="flex items-center gap-1"><MapPin size={16} /> {job.location}</span>
                          <span className="flex items-center gap-1"><Clock size={16} /> {job.deadline}</span>
                        </div>
                        <button
                          onClick={() => handleApplyToJob(job.id)}
                          className="px-6 py-2 bg-amber-400 text-slate-900 font-semibold rounded-lg hover:shadow-lg hover:shadow-amber-500/50 transition"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400">No jobs posted yet. Check back soon!</p>
              )}
            </div>

            {/* Internships Section */}
            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <GraduationCap className="text-amber-400" /> Internship Opportunities
              </h3>
              {postedInternships.length > 0 ? (
                <div className="space-y-4">
                  {postedInternships.map((internship) => (
                    <div key={internship.id} className="bg-slate-700/50 rounded-xl p-6 border border-slate-600 hover:border-amber-400/50 transition">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-lg font-bold text-white">{internship.position}</h4>
                          <p className="text-amber-400 text-sm">{internship.employerName}</p>
                        </div>
                        <span className="px-3 py-1 bg-green-400/20 text-green-400 rounded-full text-sm font-semibold">Internship</span>
                      </div>
                      <p className="text-slate-300 text-sm mb-4">{internship.description}</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-sm text-slate-300">
                        <div><span className="text-slate-400">Duration:</span> {internship.duration}</div>
                        <div><span className="text-slate-400">Start:</span> {internship.startDate}</div>
                        <div><span className="text-slate-400">Location:</span> {internship.location}</div>
                        <div><span className="text-slate-400">Stipend:</span> {internship.stipend}</div>
                      </div>
                      <button
                        onClick={() => handleApplyToJob(internship.id)}
                        className="w-full px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                      >
                        Apply for Internship
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400">No internships posted yet. Check back soon!</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
              <h4 className="font-bold text-white mb-4">Profile Summary</h4>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-slate-400">Name</p>
                  <p className="text-white font-semibold">{registeredStudents[0]?.firstName} {registeredStudents[0]?.lastName}</p>
                </div>
                <div>
                  <p className="text-slate-400">University</p>
                  <p className="text-white font-semibold">{registeredStudents[0]?.university}</p>
                </div>
                <div>
                  <p className="text-slate-400">Field of Study</p>
                  <p className="text-white font-semibold">{registeredStudents[0]?.degreeField}</p>
                </div>
                <div className="pt-4 border-t border-slate-700 flex items-center gap-2 text-green-400">
                  <CheckCircle size={16} /> Verified Student
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmployerDashboard = () => (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {renderHeader()}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Jobs Posted', value: postedJobs.length, icon: Briefcase },
            { label: 'Internships', value: postedInternships.length, icon: GraduationCap },
            { label: 'Applications', value: applications.length, icon: FileText },
            { label: 'Status', value: 'Verified', icon: Shield }
          ].map((stat, i) => (
            <div key={i} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <stat.icon className="text-amber-400 mb-2" size={24} />
              <p className="text-slate-400 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Post Job Section */}
            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Briefcase className="text-amber-400" /> Post a Job
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Job Position (e.g., Software Engineer)"
                  value={jobPosting.position}
                  onChange={(e) => setJobPosting({...jobPosting, position: e.target.value})}
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-amber-400 outline-none"
                />
                <textarea
                  placeholder="Job Description"
                  value={jobPosting.description}
                  onChange={(e) => setJobPosting({...jobPosting, description: e.target.value})}
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-amber-400 outline-none h-24"
                />
                <textarea
                  placeholder="Requirements (comma-separated)"
                  value={jobPosting.requirements}
                  onChange={(e) => setJobPosting({...jobPosting, requirements: e.target.value})}
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-amber-400 outline-none h-20"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Location"
                    value={jobPosting.location}
                    onChange={(e) => setJobPosting({...jobPosting, location: e.target.value})}
                    className="bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-amber-400 outline-none"
                  />
                  <select
                    value={jobPosting.jobType}
                    onChange={(e) => setJobPosting({...jobPosting, jobType: e.target.value})}
                    className="bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-amber-400 outline-none"
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>
                <input
                  type="date"
                  placeholder="Application Deadline"
                  value={jobPosting.deadline}
                  onChange={(e) => setJobPosting({...jobPosting, deadline: e.target.value})}
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-amber-400 outline-none"
                />
                <button
                  onClick={handlePostJob}
                  className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-amber-500/50 transition"
                >
                  Post Job
                </button>
              </div>
            </div>

            {/* Post Internship Section */}
            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <GraduationCap className="text-green-400" /> Offer Internship
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Internship Position"
                  value={internshipOffer.position}
                  onChange={(e) => setInternshipOffer({...internshipOffer, position: e.target.value})}
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-amber-400 outline-none"
                />
                <textarea
                  placeholder="Internship Description"
                  value={internshipOffer.description}
                  onChange={(e) => setInternshipOffer({...internshipOffer, description: e.target.value})}
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-amber-400 outline-none h-24"
                />
                <textarea
                  placeholder="Requirements"
                  value={internshipOffer.requirements}
                  onChange={(e) => setInternshipOffer({...internshipOffer, requirements: e.target.value})}
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-amber-400 outline-none h-20"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Duration (e.g., 3 months)"
                    value={internshipOffer.duration}
                    onChange={(e) => setInternshipOffer({...internshipOffer, duration: e.target.value})}
                    className="bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-amber-400 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={internshipOffer.location}
                    onChange={(e) => setInternshipOffer({...internshipOffer, location: e.target.value})}
                    className="bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-amber-400 outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    placeholder="Start Date"
                    value={internshipOffer.startDate}
                    onChange={(e) => setInternshipOffer({...internshipOffer, startDate: e.target.value})}
                    className="bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-amber-400 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Stipend/Salary"
                    value={internshipOffer.stipend}
                    onChange={(e) => setInternshipOffer({...internshipOffer, stipend: e.target.value})}
                    className="bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-amber-400 outline-none"
                  />
                </div>
                <button
                  onClick={handlePostInternship}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition"
                >
                  Post Internship
                </button>
              </div>
            </div>

            {/* Posted Jobs */}
            {postedJobs.length > 0 && (
              <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Posted Jobs</h3>
                <div className="space-y-4">
                  {postedJobs.map((job) => (
                    <div key={job.id} className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-bold text-white">{job.position}</h4>
                          <p className="text-slate-400 text-sm">Posted {job.postedAt}</p>
                        </div>
                        <span className="px-3 py-1 bg-blue-400/20 text-blue-400 rounded-full text-sm">{job.jobType}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
              <h4 className="font-bold text-white mb-4">Company Profile</h4>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-slate-400">Company</p>
                  <p className="text-white font-semibold">{registeredEmployers[0]?.companyName}</p>
                </div>
                <div>
                  <p className="text-slate-400">Industry</p>
                  <p className="text-white font-semibold">{registeredEmployers[0]?.industry}</p>
                </div>
                <div>
                  <p className="text-slate-400">Location</p>
                  <p className="text-white font-semibold">{registeredEmployers[0]?.city}, {registeredEmployers[0]?.country}</p>
                </div>
                <div className="pt-4 border-t border-slate-700 flex items-center gap-2 text-green-400">
                  <CheckCircle size={16} /> Verified Company
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
              <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                <Users size={18} /> Quick Stats
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Jobs Posted</span>
                  <span className="text-white font-semibold">{postedJobs.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Internships</span>
                  <span className="text-white font-semibold">{postedInternships.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Applications</span>
                  <span className="text-white font-semibold">{applications.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdminPanel = () => (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {renderHeader()}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!adminLoggedIn ? (
          <div className="max-w-md mx-auto">
            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8">
              <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                <Lock className="text-amber-400" /> Admin Panel
              </h2>
              <p className="text-slate-400 mb-6">Enter your admin password</p>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type={showAdminPasswordInput ? 'text' : 'password'}
                    value={adminPasswordInput}
                    onChange={(e) => setAdminPasswordInput(e.target.value)}
                    placeholder="Enter password"
                    className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-amber-400 outline-none"
                  />
                  <button
                    onClick={() => setShowAdminPasswordInput(!showAdminPasswordInput)}
                    className="absolute right-3 top-3 text-slate-400"
                  >
                    {showAdminPasswordInput ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <button
                  onClick={handleAdminLogin}
                  className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-amber-500/50 transition"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-white">Admin Dashboard</h2>
              <button
                onClick={downloadDatabase}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
              >
                <Download size={20} /> Download Database
              </button>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Students', value: registeredStudents.length, icon: Users, color: 'blue' },
                { label: 'Total Employers', value: registeredEmployers.length, icon: Building2, color: 'purple' },
                { label: 'Jobs Posted', value: postedJobs.length, icon: Briefcase, color: 'amber' },
                { label: 'Applications', value: applications.length, icon: FileText, color: 'green' }
              ].map((stat, i) => (
                <div key={i} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <stat.icon className={`text-${stat.color}-400 mb-2`} size={24} />
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Registered Students */}
              <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Users className="text-blue-400" /> Registered Students ({registeredStudents.length})
                </h3>
                {registeredStudents.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {registeredStudents.map((student) => (
                      <div key={student.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-white">{student.firstName} {student.lastName}</p>
                            <p className="text-sm text-slate-400">{student.email}</p>
                            <p className="text-xs text-slate-500 mt-1">{student.university} - {student.degreeField}</p>
                          </div>
                          <span className="flex items-center gap-1 text-green-400 text-xs font-semibold">
                            <CheckCircle size={14} /> Verified
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">ID: {student.id}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400">No registered students yet</p>
                )}
              </div>

              {/* Registered Employers */}
              <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Building2 className="text-purple-400" /> Registered Employers ({registeredEmployers.length})
                </h3>
                {registeredEmployers.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {registeredEmployers.map((employer) => (
                      <div key={employer.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-white">{employer.companyName}</p>
                            <p className="text-sm text-slate-400">{employer.businessEmail}</p>
                            <p className="text-xs text-slate-500 mt-1">{employer.city}, {employer.country} | {employer.industry}</p>
                          </div>
                          <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded ${
                            employer.status === 'verified' ? 'bg-green-400/20 text-green-400' : 'bg-yellow-400/20 text-yellow-400'
                          }`}>
                            {employer.status === 'verified' ? <CheckCircle size={14} /> : <Clock size={14} />}
                            {employer.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">ID: {employer.id}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400">No registered employers yet</p>
                )}
              </div>

              {/* All Applications */}
              <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 lg:col-span-2">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <FileText className="text-amber-400" /> All Applications ({applications.length})
                </h3>
                {applications.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {applications.map((app) => (
                      <div key={app.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-white">{app.studentName}</p>
                            <p className="text-sm text-slate-400">{app.studentEmail}</p>
                            <p className="text-xs text-slate-500 mt-1">Applied {app.appliedAt}</p>
                          </div>
                          <span className="px-3 py-1 bg-blue-400/20 text-blue-400 rounded-full text-xs font-semibold">
                            {app.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400">No applications yet</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // MAIN RENDER
  return (
    <div className="bg-slate-900 font-sans">
      {/* Admin Password Setup Modal */}
      {!adminPassword && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-white mb-2">Set Admin Password</h2>
            <p className="text-slate-400 mb-6">This is for your security. Choose a password to access the admin panel.</p>
            <div className="space-y-4">
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-amber-400 outline-none"
              />
              <button
                onClick={handleSetAdminPassword}
                className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-amber-500/50 transition"
              >
                Set Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Password Input Modal */}
      {showAdminPasswordInput && !adminLoggedIn && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Lock className="text-amber-400" /> Admin Access
            </h2>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type={showAdminPasswordInput ? 'text' : 'password'}
                  value={adminPasswordInput}
                  onChange={(e) => setAdminPasswordInput(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-amber-400 outline-none"
                />
                <button
                  onClick={() => setShowAdminPasswordInput(!showAdminPasswordInput)}
                  className="absolute right-3 top-3 text-slate-400"
                >
                  {showAdminPasswordInput ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <button
                onClick={handleAdminLogin}
                className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-amber-500/50 transition"
              >
                Login
              </button>
              <button
                onClick={() => setShowAdminPasswordInput(false)}
                className="w-full text-slate-400 hover:text-white transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {currentPage === 'home' && renderHome()}
      {currentPage === 'student-signup' && renderStudentSignup()}
      {currentPage === 'employer-signup' && renderEmployerSignup()}
      {currentPage === 'student-dashboard' && renderStudentDashboard()}
      {currentPage === 'employer-dashboard' && renderEmployerDashboard()}
      {currentPage === 'admin' && renderAdminPanel()}

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400">
          <p>© 2024 CHSSERJOBS - Connecting African Talent with Opportunity</p>
          <p className="text-sm mt-2">Domain: chsserjobs.com | Email: info@chsserjobs.com</p>
        </div>
      </footer>
    </div>
  );
}

