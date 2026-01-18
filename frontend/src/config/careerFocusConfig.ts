/**
 * Career Focus Configuration
 * 
 * Education-aware career paths that match real student psychology.
 * Uses relatedCourseTags for matching against course.tags, course.title, and course.learningOutcomes.
 * 
 * This is a content-based filtering approach (NOT ML).
 */

export type EducationLevel = 'SECONDARY' | 'HIGHER_SECONDARY' | 'DIPLOMA' | 'UNDERGRADUATE' | 'POSTGRADUATE';

export interface CareerFocus {
    id: string;
    title: string;
    tagline: string;
    icon: string;
    overview: string;
    whyItMatters: string;
    responsibilities: string[];
    requiredSkills: string[];
    educationPath: string;
    industrySectors: string[];
    salaryRange: { min: number; max: number; currency: string };
    futureScope: string;
    relatedCourseTags: string[]; // Matches against course.tags, title, learningOutcomes
    domain: 'AGRICULTURE' | 'HEALTHCARE' | 'URBAN' | 'TECH';
}

export interface EducationCareerMap {
    educationLevel: EducationLevel;
    careerFocuses: CareerFocus[];
    pageTitle: string;
    pageDescription: string;
    selectionLabel: string; // "Choose Career" vs "Choose Direction"
}

// ============================================================================
// UI TERMINOLOGY (Task 2)
// For 10th & 12th: "Future Path" / "Choose Direction"
// For Diploma+: "Career Focus" / "Choose Career"
// ============================================================================

const getUITerminology = (level: EducationLevel) => {
    if (level === 'SECONDARY' || level === 'HIGHER_SECONDARY') {
        return {
            pageTitle: 'Choose Your Future Path',
            pageDescription: 'Select a direction that interests you. This helps us recommend the right courses for your journey.',
            selectionLabel: 'Choose Direction',
        };
    }
    return {
        pageTitle: 'Choose Your Career Focus',
        pageDescription: 'Select a career path that matches your goals. This helps us personalize your learning experience.',
        selectionLabel: 'Choose Career',
    };
};

// ============================================================================
// SECONDARY (After 10th) - Stream/Direction Focus
// Student Thinking: "Should I pick Science or Commerce?"
// ============================================================================
const secondaryCareerFocuses: CareerFocus[] = [
    {
        id: 'sec-science-tech',
        title: 'Science & Technology Path',
        tagline: 'Explore engineering, IT, and innovation',
        icon: '🔬',
        overview: 'The Science & Technology path prepares you for careers in engineering, computer science, research, and innovation. This stream opens doors to technical degrees and high-growth industries.',
        whyItMatters: 'Technology is reshaping every industry. Starting with a science foundation gives you access to the fastest-growing career opportunities in India and globally.',
        responsibilities: ['Study PCM/PCB subjects', 'Develop logical thinking', 'Prepare for competitive exams', 'Explore technology trends'],
        requiredSkills: ['Mathematics', 'Logical Reasoning', 'Problem Solving', 'Basic Computer Skills'],
        educationPath: '10th → 11th-12th (Science) → B.Tech/B.Sc → Higher Studies/Job',
        industrySectors: ['IT & Software', 'Engineering', 'Research', 'Healthcare Tech'],
        salaryRange: { min: 300000, max: 1500000, currency: 'INR' },
        futureScope: 'Unlimited opportunities in AI, data science, robotics, and emerging technologies.',
        relatedCourseTags: ['technology', 'science', 'programming', 'iot', 'innovation'],
        domain: 'TECH',
    },
    {
        id: 'sec-commerce-business',
        title: 'Commerce & Business Path',
        tagline: 'Build skills for finance and entrepreneurship',
        icon: '📊',
        overview: 'The Commerce path leads to careers in accounting, finance, banking, and business management. It\'s ideal for those interested in money, markets, and management.',
        whyItMatters: 'Every organization needs business professionals. Commerce opens doors to stable careers in banking, CA, MBA, and entrepreneurship.',
        responsibilities: ['Study accounts and economics', 'Understand business fundamentals', 'Develop analytical skills', 'Prepare for commerce exams'],
        requiredSkills: ['Mathematics', 'Analytical Thinking', 'Communication', 'Financial Literacy'],
        educationPath: '10th → 11th-12th (Commerce) → B.Com/BBA → CA/MBA/Job',
        industrySectors: ['Banking', 'Finance', 'Accounting', 'Retail', 'E-commerce'],
        salaryRange: { min: 250000, max: 1200000, currency: 'INR' },
        futureScope: 'Growing demand for financial analysts, accountants, and business managers.',
        relatedCourseTags: ['business', 'commerce', 'finance', 'analytics', 'management'],
        domain: 'TECH',
    },
    {
        id: 'sec-diploma-skills',
        title: 'Diploma & Skill-Based Path',
        tagline: 'Get job-ready faster with practical skills',
        icon: '🛠️',
        overview: 'Diploma courses offer hands-on training and faster entry into the workforce. This path is ideal for students who want to start earning sooner.',
        whyItMatters: 'Not everyone wants a 4-year degree. Diploma programs provide practical skills and quick employment in high-demand sectors.',
        responsibilities: ['Choose a specialization', 'Gain practical experience', 'Build a portfolio', 'Connect with industry'],
        requiredSkills: ['Hands-on Learning', 'Technical Aptitude', 'Practical Problem Solving'],
        educationPath: '10th → Diploma (3 years) → Job/Lateral Entry to B.Tech',
        industrySectors: ['Manufacturing', 'Healthcare', 'IT Support', 'Agriculture Tech'],
        salaryRange: { min: 180000, max: 600000, currency: 'INR' },
        futureScope: 'Skilled technicians are in high demand across all sectors.',
        relatedCourseTags: ['diploma', 'technical', 'practical', 'hands-on', 'skills'],
        domain: 'TECH',
    },
    {
        id: 'sec-explore-awareness',
        title: 'Career Exploration',
        tagline: 'Discover options before deciding',
        icon: '🧭',
        overview: 'Not sure which path to take? This option helps you explore different career directions, understand industry trends, and make an informed decision.',
        whyItMatters: 'Making the right choice early saves years of confusion. Take time to understand your interests and strengths.',
        responsibilities: ['Explore different fields', 'Take aptitude assessments', 'Understand industry trends', 'Talk to professionals'],
        requiredSkills: ['Curiosity', 'Research Skills', 'Self-Awareness'],
        educationPath: '10th → Exploration → Choose stream based on interest',
        industrySectors: ['All sectors'],
        salaryRange: { min: 0, max: 0, currency: 'INR' },
        futureScope: 'A well-informed decision leads to a fulfilling career.',
        relatedCourseTags: ['introduction', 'basics', 'foundation', 'overview', 'awareness'],
        domain: 'TECH',
    },
];

// ============================================================================
// HIGHER SECONDARY (After 12th) - Degree/Career Direction Focus
// Student Thinking: "Which degree or career should I pursue?"
// ============================================================================
const higherSecondaryCareerFocuses: CareerFocus[] = [
    {
        id: 'hs-engineering',
        title: 'Engineering & Technology',
        tagline: 'Build the future with technical expertise',
        icon: '⚙️',
        overview: 'Engineering offers diverse specializations from software to civil. B.Tech/BE opens doors to excellent career opportunities in tech-driven industries.',
        whyItMatters: 'Engineers are problem solvers who build everything from apps to bridges. India\'s tech boom offers exceptional opportunities for engineers.',
        responsibilities: ['Master core engineering concepts', 'Build projects', 'Prepare for placements', 'Learn modern tools'],
        requiredSkills: ['Advanced Mathematics', 'Physics', 'Programming Basics', 'Analytical Skills'],
        educationPath: '12th (Science) → B.Tech/BE (4 years) → Job/M.Tech',
        industrySectors: ['IT', 'Manufacturing', 'Construction', 'Automotive', 'Aerospace'],
        salaryRange: { min: 400000, max: 2000000, currency: 'INR' },
        futureScope: 'AI, IoT, and emerging tech creating massive demand for engineers.',
        relatedCourseTags: ['engineering', 'technology', 'programming', 'development', 'iot', 'smart'],
        domain: 'TECH',
    },
    {
        id: 'hs-healthcare',
        title: 'Healthcare & Medical Technology',
        tagline: 'Serve humanity through health sciences',
        icon: '🏥',
        overview: 'Healthcare careers range from clinical roles to health IT. This path includes medicine, pharmacy, nursing, and health technology.',
        whyItMatters: 'Healthcare is recession-proof and deeply fulfilling. Technology is transforming how we diagnose and treat patients.',
        responsibilities: ['Study health sciences', 'Understand patient care', 'Learn medical technology', 'Prepare for medical exams'],
        requiredSkills: ['Biology', 'Chemistry', 'Empathy', 'Attention to Detail'],
        educationPath: '12th (Science) → MBBS/BPharm/Nursing/Health IT',
        industrySectors: ['Hospitals', 'Pharmaceuticals', 'Health Tech', 'Research Labs'],
        salaryRange: { min: 350000, max: 2500000, currency: 'INR' },
        futureScope: 'Telemedicine and health AI creating new career opportunities.',
        relatedCourseTags: ['healthcare', 'medical', 'hospital', 'health', 'telemedicine', 'ehr'],
        domain: 'HEALTHCARE',
    },
    {
        id: 'hs-data-analytics',
        title: 'Data & Analytics',
        tagline: 'Turn data into insights and decisions',
        icon: '📈',
        overview: 'Data analytics is one of the fastest-growing fields. Learn to extract insights from data to drive business decisions.',
        whyItMatters: 'Every company needs data professionals. This skill is in demand across all industries.',
        responsibilities: ['Learn statistics and probability', 'Master data tools', 'Understand visualization', 'Solve business problems'],
        requiredSkills: ['Mathematics', 'Excel', 'Basic Programming', 'Critical Thinking'],
        educationPath: '12th → BSc Statistics/BCA/B.Tech → Data Analyst',
        industrySectors: ['IT', 'Finance', 'E-commerce', 'Healthcare', 'Marketing'],
        salaryRange: { min: 400000, max: 1500000, currency: 'INR' },
        futureScope: 'Data-driven decision making is becoming standard across industries.',
        relatedCourseTags: ['data', 'analytics', 'visualization', 'statistics', 'sql'],
        domain: 'TECH',
    },
    {
        id: 'hs-government',
        title: 'Government & Public Service',
        tagline: 'Serve the nation through civil services',
        icon: '🏛️',
        overview: 'Government jobs offer stability, respect, and the opportunity to serve the nation. Competitive exams open doors to prestigious positions.',
        whyItMatters: 'India\'s governance needs talented youth. Government roles offer job security and meaningful impact.',
        responsibilities: ['Prepare for competitive exams', 'Study current affairs', 'Develop administrative skills', 'Understand governance'],
        requiredSkills: ['General Knowledge', 'Analytical Skills', 'Communication', 'Discipline'],
        educationPath: '12th → Any Degree → UPSC/SSC/State Exams',
        industrySectors: ['Central Government', 'State Government', 'PSUs', 'Defense'],
        salaryRange: { min: 500000, max: 2500000, currency: 'INR' },
        futureScope: 'Digital governance creating new opportunities in e-governance.',
        relatedCourseTags: ['governance', 'policy', 'public', 'administration', 'urban'],
        domain: 'URBAN',
    },
];

// ============================================================================
// DIPLOMA - Job-Ready Technical Roles
// Student Thinking: "I want a job or lateral entry."
// ============================================================================
const diplomaCareerFocuses: CareerFocus[] = [
    {
        id: 'dip-urban-tech',
        title: 'Urban Technician',
        tagline: 'Maintain smart city infrastructure',
        icon: '🏙️',
        overview: 'Urban Technicians install, maintain, and troubleshoot smart city systems including traffic management, IoT sensors, and public utilities.',
        whyItMatters: 'Smart cities need skilled technicians to keep systems running. This is a growing field with stable employment.',
        responsibilities: ['Install IoT devices', 'Maintain sensor networks', 'Troubleshoot systems', 'Document technical work'],
        requiredSkills: ['Electronics Basics', 'Networking', 'Problem Solving', 'Field Work'],
        educationPath: 'Diploma in ECE/EEE → Urban Technician → Senior Technician',
        industrySectors: ['Smart Cities', 'Municipal Corporations', 'IT Companies'],
        salaryRange: { min: 200000, max: 500000, currency: 'INR' },
        futureScope: 'Smart city projects expanding across India.',
        relatedCourseTags: ['urban', 'iot', 'smart', 'traffic', 'infrastructure', 'sensor'],
        domain: 'URBAN',
    },
    {
        id: 'dip-gis-operator',
        title: 'GIS Operator',
        tagline: 'Map the world with geospatial technology',
        icon: '🗺️',
        overview: 'GIS Operators work with mapping software to create, analyze, and manage spatial data used in planning, agriculture, and urban development.',
        whyItMatters: 'Every planning decision needs accurate maps. GIS skills are essential for agriculture, urban planning, and disaster management.',
        responsibilities: ['Create digital maps', 'Analyze spatial data', 'Maintain GIS databases', 'Generate reports'],
        requiredSkills: ['GIS Software', 'Data Entry', 'Attention to Detail', 'Basic Geography'],
        educationPath: 'Diploma in Geomatics/IT → GIS Operator → GIS Analyst',
        industrySectors: ['Government', 'Agriculture', 'Real Estate', 'Utilities'],
        salaryRange: { min: 180000, max: 450000, currency: 'INR' },
        futureScope: 'Drone mapping and satellite imagery expanding GIS applications.',
        relatedCourseTags: ['gis', 'mapping', 'remote sensing', 'geospatial', 'agriculture'],
        domain: 'AGRICULTURE',
    },
    {
        id: 'dip-health-it',
        title: 'Healthcare IT Assistant',
        tagline: 'Support hospitals with technology',
        icon: '💻',
        overview: 'Healthcare IT Assistants help hospitals manage electronic health records, patient data, and medical information systems.',
        whyItMatters: 'Hospitals are going digital. IT skills combined with healthcare knowledge are valuable.',
        responsibilities: ['Manage patient records', 'Support EHR systems', 'Train staff on software', 'Ensure data security'],
        requiredSkills: ['Computer Skills', 'Data Entry', 'Healthcare Basics', 'Communication'],
        educationPath: 'Diploma in IT/Computer Science → Healthcare IT Assistant',
        industrySectors: ['Hospitals', 'Clinics', 'Health Tech Companies', 'Insurance'],
        salaryRange: { min: 180000, max: 400000, currency: 'INR' },
        futureScope: 'Digital health adoption creating more IT roles in healthcare.',
        relatedCourseTags: ['healthcare', 'hospital', 'ehr', 'health it', 'medical', 'records'],
        domain: 'HEALTHCARE',
    },
    {
        id: 'dip-agritech',
        title: 'Agri-Tech Technician',
        tagline: 'Modernize farming with technology',
        icon: '🌾',
        overview: 'Agri-Tech Technicians install and maintain precision agriculture equipment including sensors, drones, and irrigation systems.',
        whyItMatters: 'Indian agriculture needs modernization. Technology can double farm productivity.',
        responsibilities: ['Install farm sensors', 'Operate agricultural drones', 'Maintain irrigation systems', 'Train farmers'],
        requiredSkills: ['Electronics', 'Agriculture Basics', 'Drone Operation', 'Field Work'],
        educationPath: 'Diploma in Agriculture/Electronics → Agri-Tech Technician',
        industrySectors: ['Agriculture', 'Agri-Tech Startups', 'Government Programs'],
        salaryRange: { min: 180000, max: 450000, currency: 'INR' },
        futureScope: 'Precision agriculture adoption growing rapidly in India.',
        relatedCourseTags: ['agriculture', 'farming', 'iot', 'drone', 'irrigation', 'soil'],
        domain: 'AGRICULTURE',
    },
];

// ============================================================================
// UNDERGRADUATE - Professional Job Roles
// Student Thinking: "How do I become job-ready?"
// ============================================================================
const undergraduateCareerFocuses: CareerFocus[] = [
    {
        id: 'ug-smart-city-planner',
        title: 'Smart City Planner',
        tagline: 'Design cities of the future',
        icon: '🏙️',
        overview: 'Smart City Planners design integrated urban solutions using technology, data, and sustainable practices to improve city life.',
        whyItMatters: '68% of world population will live in cities by 2050. Smart planning is essential for sustainable urbanization.',
        responsibilities: ['Analyze urban data', 'Design infrastructure solutions', 'Coordinate with stakeholders', 'Implement smart systems'],
        requiredSkills: ['Urban Planning', 'GIS', 'Data Analysis', 'Project Management', 'IoT Basics'],
        educationPath: 'B.Tech/B.Plan → Smart City Projects → Senior Planner',
        industrySectors: ['Smart Cities', 'Consulting', 'Government', 'IT Companies'],
        salaryRange: { min: 600000, max: 1500000, currency: 'INR' },
        futureScope: '₹2 lakh crore Smart Cities Mission creating massive demand.',
        relatedCourseTags: ['smart city', 'urban', 'traffic', 'iot', 'infrastructure', 'planning'],
        domain: 'URBAN',
    },
    {
        id: 'ug-healthcare-analyst',
        title: 'Healthcare Data Analyst',
        tagline: 'Improve patient outcomes with data',
        icon: '📊',
        overview: 'Healthcare Data Analysts use data to improve hospital operations, patient care, and public health outcomes.',
        whyItMatters: 'Data-driven healthcare saves lives. Analysts help hospitals make better decisions.',
        responsibilities: ['Analyze patient data', 'Create health reports', 'Identify trends', 'Support clinical decisions'],
        requiredSkills: ['SQL', 'Python', 'Healthcare Domain', 'Data Visualization', 'Statistics'],
        educationPath: 'B.Tech/BCA + Healthcare Specialization → Analyst',
        industrySectors: ['Hospitals', 'Health Tech', 'Insurance', 'Pharma'],
        salaryRange: { min: 500000, max: 1200000, currency: 'INR' },
        futureScope: 'AI in healthcare creating advanced analytics roles.',
        relatedCourseTags: ['healthcare', 'data', 'analytics', 'hospital', 'visualization'],
        domain: 'HEALTHCARE',
    },
    {
        id: 'ug-urban-data-analyst',
        title: 'Urban Data Analyst',
        tagline: 'Turn city data into actionable insights',
        icon: '📈',
        overview: 'Urban Data Analysts work with city data to improve traffic, utilities, safety, and citizen services.',
        whyItMatters: 'Cities generate massive data. Analysts help governments make smarter decisions.',
        responsibilities: ['Collect urban data', 'Build dashboards', 'Analyze patterns', 'Present recommendations'],
        requiredSkills: ['SQL', 'Python', 'GIS', 'Data Visualization', 'Urban Domain'],
        educationPath: 'B.Tech/BCA → Urban Analytics → Senior Analyst',
        industrySectors: ['Government', 'Smart Cities', 'Consulting', 'Research'],
        salaryRange: { min: 500000, max: 1200000, currency: 'INR' },
        futureScope: 'Digital governance increasing demand for urban analysts.',
        relatedCourseTags: ['urban', 'data', 'analytics', 'traffic', 'smart', 'city'],
        domain: 'URBAN',
    },
    {
        id: 'ug-agri-systems',
        title: 'Agriculture Systems Engineer',
        tagline: 'Build technology for modern farming',
        icon: '🌾',
        overview: 'Agriculture Systems Engineers design and implement technology solutions for precision farming, supply chain, and farm management.',
        whyItMatters: 'India\'s agriculture sector is modernizing. Engineers bridge the gap between technology and farming.',
        responsibilities: ['Design farm management systems', 'Implement IoT solutions', 'Build supply chain apps', 'Train stakeholders'],
        requiredSkills: ['Programming', 'IoT', 'Agriculture Domain', 'System Design'],
        educationPath: 'B.Tech (CS/Agri) → Agri-Tech Company → Systems Lead',
        industrySectors: ['Agri-Tech', 'Government', 'Cooperatives', 'Startups'],
        salaryRange: { min: 500000, max: 1400000, currency: 'INR' },
        futureScope: 'Agri-tech startups growing rapidly with strong funding.',
        relatedCourseTags: ['agriculture', 'farming', 'supply chain', 'iot', 'farm management'],
        domain: 'AGRICULTURE',
    },
];

// ============================================================================
// POSTGRADUATE - Leadership & Research Roles
// Student Thinking: "Leadership, policy, or research?"
// ============================================================================
const postgraduateCareerFocuses: CareerFocus[] = [
    {
        id: 'pg-smart-city-architect',
        title: 'Smart City Architect',
        tagline: 'Lead large-scale urban transformation',
        icon: '🏛️',
        overview: 'Smart City Architects lead the design of integrated city platforms, coordinating multiple systems and stakeholders for urban transformation.',
        whyItMatters: 'Complex smart city projects need experienced architects who understand technology, policy, and implementation.',
        responsibilities: ['Design city-wide systems', 'Lead technical teams', 'Coordinate with government', 'Ensure scalability'],
        requiredSkills: ['System Architecture', 'Leadership', 'Urban Planning', 'Policy Understanding'],
        educationPath: 'M.Tech/MBA + 5 years experience → Smart City Architect',
        industrySectors: ['Smart Cities', 'Consulting', 'Government', 'International Agencies'],
        salaryRange: { min: 1500000, max: 4000000, currency: 'INR' },
        futureScope: 'Global smart city market expected to reach $2 trillion by 2030.',
        relatedCourseTags: ['smart city', 'architecture', 'platform', 'urban', 'infrastructure'],
        domain: 'URBAN',
    },
    {
        id: 'pg-policy-consultant',
        title: 'Urban Policy Consultant',
        tagline: 'Shape policy for sustainable cities',
        icon: '📋',
        overview: 'Urban Policy Consultants advise governments on urban development policies, regulations, and strategies for sustainable growth.',
        whyItMatters: 'Good policy enables good cities. Consultants bridge the gap between vision and implementation.',
        responsibilities: ['Research urban issues', 'Draft policy recommendations', 'Advise government bodies', 'Evaluate program impact'],
        requiredSkills: ['Policy Analysis', 'Research', 'Communication', 'Urban Economics'],
        educationPath: 'MA/MPP/M.Plan → Policy Research → Senior Consultant',
        industrySectors: ['Think Tanks', 'Government', 'World Bank', 'UN Agencies'],
        salaryRange: { min: 1200000, max: 3500000, currency: 'INR' },
        futureScope: 'Climate change adaptation creating demand for urban policy experts.',
        relatedCourseTags: ['policy', 'governance', 'urban', 'sustainability', 'planning'],
        domain: 'URBAN',
    },
    {
        id: 'pg-healthcare-strategist',
        title: 'Healthcare Systems Strategist',
        tagline: 'Transform healthcare delivery at scale',
        icon: '🏥',
        overview: 'Healthcare Systems Strategists design and implement large-scale health programs, digital health initiatives, and hospital networks.',
        whyItMatters: 'India\'s healthcare system needs transformation. Strategists lead national and state-level initiatives.',
        responsibilities: ['Design health programs', 'Lead digital health projects', 'Advise health ministries', 'Evaluate health outcomes'],
        requiredSkills: ['Healthcare Domain', 'Strategy', 'Program Management', 'Digital Health'],
        educationPath: 'MD/MBA(Healthcare)/MPH → Health Programs → Strategist',
        industrySectors: ['Government', 'WHO/UNICEF', 'Hospital Chains', 'Health Tech'],
        salaryRange: { min: 1500000, max: 5000000, currency: 'INR' },
        futureScope: 'National Digital Health Mission creating strategic roles.',
        relatedCourseTags: ['healthcare', 'systems', 'hospital', 'strategy', 'public health'],
        domain: 'HEALTHCARE',
    },
    {
        id: 'pg-research',
        title: 'Research & Academic Focus',
        tagline: 'Advance knowledge through research',
        icon: '🔬',
        overview: 'Research careers focus on advancing knowledge in agriculture, healthcare, or urban technology through academic or industry research.',
        whyItMatters: 'Innovation comes from research. PhD holders lead R&D in companies and universities.',
        responsibilities: ['Conduct original research', 'Publish papers', 'Guide students', 'Secure research grants'],
        requiredSkills: ['Research Methods', 'Academic Writing', 'Domain Expertise', 'Teaching'],
        educationPath: 'M.Tech/MSc → PhD → Professor/Research Scientist',
        industrySectors: ['Universities', 'Research Labs', 'Corporate R&D', 'Government Research'],
        salaryRange: { min: 800000, max: 2500000, currency: 'INR' },
        futureScope: 'AI and deep tech creating demand for PhD researchers.',
        relatedCourseTags: ['research', 'advanced', 'ai', 'simulation', 'systems'],
        domain: 'TECH',
    },
];

// ============================================================================
// EDUCATION CAREER MAPS
// ============================================================================
export const educationCareerMaps: EducationCareerMap[] = [
    {
        educationLevel: 'SECONDARY',
        ...getUITerminology('SECONDARY'),
        careerFocuses: secondaryCareerFocuses,
    },
    {
        educationLevel: 'HIGHER_SECONDARY',
        ...getUITerminology('HIGHER_SECONDARY'),
        careerFocuses: higherSecondaryCareerFocuses,
    },
    {
        educationLevel: 'DIPLOMA',
        ...getUITerminology('DIPLOMA'),
        careerFocuses: diplomaCareerFocuses,
    },
    {
        educationLevel: 'UNDERGRADUATE',
        ...getUITerminology('UNDERGRADUATE'),
        careerFocuses: undergraduateCareerFocuses,
    },
    {
        educationLevel: 'POSTGRADUATE',
        ...getUITerminology('POSTGRADUATE'),
        careerFocuses: postgraduateCareerFocuses,
    },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get career focuses for a specific education level
 */
export function getCareerFocusesForEducation(level: EducationLevel): EducationCareerMap | undefined {
    return educationCareerMaps.find(map => map.educationLevel === level);
}

/**
 * Get a specific career focus by ID
 */
export function getCareerFocusById(id: string): CareerFocus | undefined {
    for (const map of educationCareerMaps) {
        const found = map.careerFocuses.find(cf => cf.id === id);
        if (found) return found;
    }
    return undefined;
}

/**
 * Check if a course matches a career focus based on relatedCourseTags
 * Matches against: course.tags, course.title, course.learningOutcomes
 */
export function courseMatchesCareerFocus(
    course: { tags?: string[]; title: string; learningOutcomes?: string[] },
    careerFocus: CareerFocus
): boolean {
    const searchTexts = [
        ...(course.tags || []),
        course.title.toLowerCase(),
        ...(course.learningOutcomes || []).map(lo => lo.toLowerCase()),
    ];

    return careerFocus.relatedCourseTags.some(tag =>
        searchTexts.some(text => text.toLowerCase().includes(tag.toLowerCase()))
    );
}
