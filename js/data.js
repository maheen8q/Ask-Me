/* ==========================================================================
   Ask-Me — central data file
   --------------------------------------------------------------------------
   This is the ONLY file the department needs to edit to update content.
   Every page (home, guides, directory, mentors, deadlines, FAQ) reads from it.

   !! Every name, room number, email, phone number and date below is a
   !! PLACEHOLDER. Replace them with confirmed information before launch, then
   !! set meta.sampleData to false to hide the "sample information" notices.

   Missing values are fine: any empty/null field is shown as
   "To be confirmed" (or similar) instead of breaking the page.
   ========================================================================== */

window.ASKME_DATA = {
  meta: {
    siteName: "Ask-Me",
    university: "NED University, Karachi",
    tagline: "A little guidance. A better university journey.",
    sampleData: true, // set to false once real information has been added
  },

  /* ---- Support teams (Support directory page) --------------------------- */
  teams: [
    {
      id: "student-affairs",
      name: "Student Affairs",
      summary: "Scholarships, financial aid and student wellbeing",
      keywords: ["scholarship", "financial aid", "fee waiver", "wellbeing", "counselling", "hostel", "housing"],
      office: "Student Affairs Office",
      room: "Room S-101",
      hours: "Mon–Fri, 9:00 am – 4:00 pm",
      email: "student.affairs@example.org",
      phone: "+92 00 0000 0001",
    },
    {
      id: "academic-section",
      name: "Academic Section",
      summary: "Semester registration, records and academic queries",
      keywords: ["registration", "transcript", "grade", "result", "course", "semester", "withdraw", "records"],
      office: "Academic Section Office",
      room: "Room A-204",
      hours: "Mon–Fri, 9:00 am – 3:30 pm",
      email: "academic.section@example.org",
      phone: "+92 00 0000 0002",
    },
    {
      id: "it-support",
      name: "IT support",
      summary: "Student accounts, university email and campus Wi-Fi",
      keywords: ["wifi", "wi fi", "password", "email", "portal", "account", "login", "internet"],
      office: "IT Help Desk",
      room: "Room IT-12",
      hours: "Mon–Fri, 9:00 am – 5:00 pm",
      email: "it.support@example.org",
      phone: "+92 00 0000 0003",
    },
    {
      id: "library",
      name: "Library help",
      summary: "Borrowing, research resources and library access",
      keywords: ["library", "book", "borrow", "journal", "research", "database", "thesis"],
      office: "Library Help Desk",
      room: "Library, Ground Floor",
      hours: "Mon–Sat, 8:30 am – 6:00 pm",
      email: "library@example.org",
      phone: "+92 00 0000 0004",
    },
    {
      id: "admissions",
      name: "Admissions",
      summary: "Programmes, application guidance and enrolment",
      keywords: ["admission", "apply", "application", "enrolment", "enrollment", "programme", "program", "entry test"],
      office: "Admissions Office",
      room: "Room AD-3",
      hours: "Mon–Fri, 9:00 am – 3:00 pm",
      email: "admissions@example.org",
      phone: "+92 00 0000 0005",
    },
    {
      id: "careers",
      name: "Careers & placements",
      summary: "Internships, career guidance and placement opportunities",
      keywords: ["internship", "career", "job", "placement", "cv", "resume", "interview"],
      office: "Careers & Placement Office",
      room: "Room C-110",
      hours: "Mon–Fri, 10:00 am – 4:00 pm",
      email: "careers@example.org",
      phone: "+92 00 0000 0006",
    },
  ],

  /* ---- Step-by-step guides ---------------------------------------------- */
  // Each guide: exactly three ordered steps + a "Who & where" contact block.
  guides: [
    {
      id: "academics",
      label: "Academics",
      summary: "Course problems, grades, exams and study support",
      steps: [
        "Talk to your course instructor first. Bring the course code and a short description of the problem.",
        "Book a meeting with your department's academic advisor to discuss options such as a grade review or extra support.",
        "If it is still unresolved, send a written request with your student ID and course details to the Academic Section.",
      ],
      contact: {
        office: "Academic Section Office",
        room: "Room A-204",
        hours: "Mon–Fri, 9:00 am – 3:30 pm",
        email: "academic.section@example.org",
        phone: "+92 00 0000 0002",
      },
    },
    {
      id: "career",
      label: "Career",
      summary: "Internships, CVs, interviews and placements",
      steps: [
        "Update your CV, then ask the Careers office for a quick review before you apply anywhere.",
        "Check the current internship and placement listings and note each application deadline.",
        "Talk to a mentor from your department about the roles you are aiming for and how to prepare.",
      ],
      contact: {
        office: "Careers & Placement Office",
        room: "Room C-110",
        hours: "Mon–Fri, 10:00 am – 4:00 pm",
        email: "careers@example.org",
        phone: "+92 00 0000 0006",
      },
    },
    {
      id: "fees",
      label: "Fees",
      summary: "Paying fees, instalments and financial support",
      steps: [
        "Check your fee statement in the student portal so you know the exact amount and due date.",
        "Pay before the deadline using an approved method, and keep the receipt or confirmation.",
        "If you cannot pay in time, apply in writing to Student Affairs for an instalment plan or financial aid before the due date.",
      ],
      contact: {
        office: "Student Affairs Office",
        room: "Room S-101",
        hours: "Mon–Fri, 9:00 am – 4:00 pm",
        email: "student.affairs@example.org",
        phone: "+92 00 0000 0001",
      },
    },
    {
      id: "mental-health",
      label: "Mental Health",
      summary: "Confidential support when things feel heavy",
      steps: [
        "Contact the counselling service to book a confidential appointment. You do not need a formal reason.",
        "Tell someone you trust, such as a friend, family member or mentor, so you are not carrying it alone.",
        "If you feel unsafe or in crisis, call your local emergency number or go to the nearest emergency department right away.",
      ],
      contact: {
        office: "Student Counselling Service",
        room: "Room S-110",
        hours: "Mon–Fri, 9:00 am – 4:00 pm",
        email: "counselling@example.org",
        phone: "+92 00 0000 0007",
      },
    },
    {
      id: "registration",
      label: "Registration",
      summary: "Semester registration, course plans and withdrawals",
      steps: [
        "Check the registration dates under Deadlines so you know when the window closes.",
        "Meet your academic advisor to confirm your course plan and any prerequisites.",
        "Complete registration through the portal or the Academic Section, and keep your confirmation.",
      ],
      contact: {
        office: "Academic Section Office",
        room: "Room A-204",
        hours: "Mon–Fri, 9:00 am – 3:30 pm",
        email: "academic.section@example.org",
        phone: "+92 00 0000 0002",
      },
    },
    {
      id: "housing",
      label: "Housing",
      summary: "Hostel applications, allocation and accommodation",
      steps: [
        "Check eligibility and the application window with the hostel office.",
        "Gather the required documents and submit your application before the closing date.",
        "Follow up for your allocation notice, and ask a mentor about off-campus options if you are not allocated a room.",
      ],
      contact: {
        office: "Hostel Office",
        room: "Room H-2",
        hours: "Mon–Fri, 9:00 am – 3:00 pm",
        email: "hostel@example.org",
        phone: "", // intentionally empty: shows how missing details are handled
      },
    },
  ],

  /* ---- Mentors ------------------------------------------------------------ */
  // Departments and topics shown in the filters are built from these entries.
  mentors: [
    {
      id: "m1", name: "Ayesha R.", department: "Computer Science", role: "Final-year student",
      topics: ["Internships", "Course selection", "Final-year project"],
      bio: "Sample profile. Can talk about choosing electives, preparing for technical interviews and planning a final-year project.",
      availability: "Tuesdays, 2:00 – 4:00 pm", email: "mentor.m1@example.org",
    },
    {
      id: "m2", name: "Hamza S.", department: "Electrical Engineering", role: "Alumnus",
      topics: ["Research", "Internships", "Exams"],
      bio: "Sample profile. Can talk about getting started in research, lab-heavy semesters and managing exam weeks.",
      availability: "Thursdays, 4:00 – 6:00 pm", email: "mentor.m2@example.org",
    },
    {
      id: "m3", name: "Fatima K.", department: "Civil Engineering", role: "Third-year student",
      topics: ["Scholarships", "Hostel life", "Exams"],
      bio: "Sample profile. Can talk about scholarship applications, settling into hostel life and revision routines.",
      availability: "Mondays, 1:00 – 3:00 pm", email: "mentor.m3@example.org",
    },
    {
      id: "m4", name: "Bilal A.", department: "Mechanical Engineering", role: "Final-year student",
      topics: ["Final-year project", "Internships", "Course selection"],
      bio: "Sample profile. Can talk about workshop courses, finding an industry internship and choosing a project supervisor.",
      availability: "Wednesdays, 3:00 – 5:00 pm", email: "mentor.m4@example.org",
    },
    {
      id: "m5", name: "Sana M.", department: "Architecture", role: "Alumna",
      topics: ["Wellbeing", "Research", "Course selection"],
      bio: "Sample profile. Can talk about studio workload, balancing deadlines with rest and continuing into postgraduate study.",
      availability: "Fridays, 11:00 am – 1:00 pm", email: "mentor.m5@example.org",
    },
    {
      id: "m6", name: "Usman T.", department: "Computer Science", role: "Second-year student",
      topics: ["Hostel life", "Exams", "Wellbeing"],
      bio: "Sample profile. Can talk about the first years of the degree, study groups and finding your routine.",
      availability: "Mondays, 4:00 – 5:30 pm", email: "mentor.m6@example.org",
    },
    {
      id: "m7", name: "Zara H.", department: "Electrical Engineering", role: "Final-year student",
      topics: ["Scholarships", "Final-year project", "Research"],
      bio: "Sample profile. Can talk about merit and need-based scholarships and writing a strong project proposal.",
      availability: "Tuesdays, 10:00 am – 12:00 pm", email: "mentor.m7@example.org",
    },
    {
      id: "m8", name: "Daniyal F.", department: "Civil Engineering", role: "Alumnus",
      topics: ["Internships", "Research", "Course selection"],
      bio: "Sample profile. Can talk about site-based internships, professional registration and choosing a specialisation.",
      availability: "Saturdays, 10:00 am – 12:00 pm", email: "mentor.m8@example.org",
    },
  ],

  /* ---- Deadlines ---------------------------------------------------------- */
  // date: YYYY-MM-DD (local time). time: optional HH:MM, defaults to 23:59.
  // guide: optional guide id to link to. All dates are placeholders.
  deadlines: [
    {
      id: "d0", title: "Mid-term feedback form closes", date: "2026-11-10",
      description: "Share feedback about your courses so far.", guide: "academics",
    },
    {
      id: "d1", title: "Course registration closes", date: "2026-12-04",
      description: "Last day to register for next semester's courses.", guide: "registration",
    },
    {
      id: "d2", title: "Fee payment due", date: "2026-12-12",
      description: "Pay your semester fees to avoid a late charge.", guide: "fees",
    },
    {
      id: "d3", title: "Scholarship applications close", date: "2026-12-20",
      description: "Submit your application and supporting documents.", guide: "fees",
    },
    {
      id: "d4", title: "Hostel applications close", date: "2027-01-10",
      description: "Apply for accommodation for the coming semester.", guide: "housing",
    },
    {
      id: "d5", title: "Summer internship applications", date: "2027-02-15",
      description: "Many internship programmes close around this time.", guide: "career",
    },
    {
      id: "d6", title: "Course withdrawal deadline", date: "2027-03-01",
      description: "Last day to withdraw from a course without a penalty.", guide: "registration",
    },
  ],

  /* ---- FAQ helper ----------------------------------------------------------
     Keyword matching only. For each entry, `keywords` are words or short
     phrases that should trigger it. Use specific words (e.g. "hostel"), not
     generic ones (e.g. "university"). `team` links to a support team.
     ------------------------------------------------------------------------ */
  faq: {
    intro:
      "Hi, I can answer common questions about registration, fees, housing and more. I match keywords against a fixed list of questions, so I am not an AI chatbot. If I cannot help, I will point you to a real office.",
    fallback:
      "I could not find a match for that. I only know a fixed list of common questions, so a person will be able to help better.",
    suggested: [
      "How do I register for courses?",
      "How can I pay my fees?",
      "How do I apply for a hostel?",
      "Where can I get counselling?",
      "How do I find an internship?",
    ],
    entries: [
      {
        id: "f-registration",
        question: "How do I register for courses?",
        keywords: ["register", "registration", "enrol", "enroll", "course plan", "add course", "prerequisite"],
        answer:
          "Check the registration deadline first, meet your academic advisor to confirm your course plan, then complete registration through the portal or the Academic Section. Keep your confirmation.",
        link: { label: "Read the registration guide", href: "#/guides/registration" },
        team: "academic-section",
      },
      {
        id: "f-fees",
        question: "How can I pay my fees?",
        keywords: ["fee", "pay", "payment", "challan", "tuition", "due date", "receipt"],
        answer:
          "Your fee statement in the student portal shows the amount and due date. Pay before the deadline and keep the receipt.",
        link: { label: "Read the fees guide", href: "#/guides/fees" },
        team: "student-affairs",
      },
      {
        id: "f-instalment",
        question: "What if I cannot pay my fees on time?",
        keywords: ["instalment", "installment", "cannot pay", "cant pay", "late fee", "financial aid", "waiver", "afford"],
        answer:
          "Apply in writing to Student Affairs before the due date to ask about an instalment plan or financial aid. Contacting them early gives you the most options.",
        link: { label: "Read the fees guide", href: "#/guides/fees" },
        team: "student-affairs",
      },
      {
        id: "f-hostel",
        question: "How do I apply for a hostel?",
        keywords: ["hostel", "housing", "accommodation", "dorm", "dormitory", "room allocation"],
        answer:
          "Check eligibility and the application window with the hostel office, submit your documents before the closing date, then follow up for your allocation notice.",
        link: { label: "Read the housing guide", href: "#/guides/housing" },
        team: "student-affairs",
      },
      {
        id: "f-counselling",
        question: "Where can I get counselling?",
        keywords: ["counselling", "counseling", "counsellor", "stress", "anxious", "anxiety", "depressed", "mental health", "overwhelmed"],
        answer:
          "The student counselling service offers confidential appointments. If you ever feel unsafe or in crisis, call your local emergency number or go to the nearest emergency department right away.",
        link: { label: "Read the mental health guide", href: "#/guides/mental-health" },
        team: "student-affairs",
      },
      {
        id: "f-internship",
        question: "How do I find an internship?",
        keywords: ["internship", "intern", "placement", "job", "cv", "resume", "interview"],
        answer:
          "Update your CV, ask the Careers office to review it, then check current internship listings and their deadlines. A mentor from your department can also help.",
        link: { label: "Read the career guide", href: "#/guides/career" },
        team: "careers",
      },
      {
        id: "f-transcript",
        question: "How do I get my transcript?",
        keywords: ["transcript", "degree certificate", "marksheet", "mark sheet", "records", "result card"],
        answer:
          "Transcripts and academic records are handled by the Academic Section. Send a written request with your student ID.",
        link: { label: "See the Academic Section", href: "#/directory" },
        team: "academic-section",
      },
      {
        id: "f-wifi",
        question: "My Wi-Fi or student email is not working",
        keywords: ["wifi", "wi fi", "internet", "password", "email", "login", "portal", "account", "locked"],
        answer:
          "Account, university email and campus Wi-Fi problems are handled by the IT help desk. Bring your student ID if you visit in person.",
        link: { label: "See IT support", href: "#/directory" },
        team: "it-support",
      },
      {
        id: "f-library",
        question: "How do I borrow books from the library?",
        keywords: ["library", "borrow", "book", "journal", "database", "library card"],
        answer:
          "The library help desk can explain borrowing rules and how to access research resources. Bring your student ID.",
        link: { label: "See Library help", href: "#/directory" },
        team: "library",
      },
      {
        id: "f-withdraw",
        question: "How do I withdraw from a course?",
        keywords: ["withdraw", "withdrawal", "drop course", "drop a course", "drop"],
        answer:
          "Check the withdrawal deadline under Deadlines, talk to your advisor, then submit the request to the Academic Section before the deadline.",
        link: { label: "See upcoming deadlines", href: "#/deadlines" },
        team: "academic-section",
      },
      {
        id: "f-mentor",
        question: "How do I find a mentor?",
        keywords: ["mentor", "mentoring", "mentorship", "advice", "senior"],
        answer:
          "Browse the mentor directory and filter by department or topic, then contact a mentor using the details on their profile.",
        link: { label: "Browse mentors", href: "#/mentors" },
        team: "student-affairs",
      },
    ],
  },
};
