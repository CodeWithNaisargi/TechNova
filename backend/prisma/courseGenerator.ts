import { EducationLevel } from '@prisma/client';

export type CourseDomain = 'AGRICULTURE' | 'HEALTHCARE' | 'URBAN';

export interface GeneratedCourse {
    title: string;
    description: string;
    category: string;
    domain: CourseDomain;
    difficulty: string;
    duration: string;
    price: number;
    prerequisites: string[];
    learningOutcomes: string[];
    instructorId: string;
    isPublished: boolean;
    hasProject: boolean;
    targetEducationLevel: EducationLevel;
    thumbnail: string;
    thumbnailPrompt: string;
    tags: string[];
}

export interface GeneratedReview {
    rating: number;
    comment: string;
}

export function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '_')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '_');
}

const DOMAIN_KEYWORDS: Record<CourseDomain, string[]> = {
    AGRICULTURE: ['IoT', 'Drone', 'GIS', 'Remote Sensing', 'Precision Farming', 'Soil health', 'Agri'],
    HEALTHCARE: ['EMR', 'Health IT', 'Telemedicine', 'Medical AI', 'Diagnostics', 'Clinic', 'Health'],
    URBAN: ['Smart City', 'Traffic', 'Water Management', 'GIS', 'Waste Management', 'Urban', 'Smart'],
};

const COMMON_KEYWORDS = ['AI', 'Blockchain', 'Data Analytics', 'IoT'];

const TITLES: Record<CourseDomain, Record<string, string[]>> = {
    AGRICULTURE: {
        SECONDARY: [
            'Basic Farm Tools and Robots',
            'Introduction to Garden Sensors',
            'Farming in the Digital Age',
            'Water Conservation for Kids',
            'Growing Food with Science',
            'The Future of Agriculture',
            'Agri-Tech Explorers',
            'Plants and Technology',
            'Sustainable Farming Basics',
            'Young Farmer Data Skills'
        ],
        HIGHER_SECONDARY: [
            'Drone Mapping for Beginners',
            'Soil Health Sensor Networks',
            'Smart Irrigation Fundamentals',
            'Precision Agriculture Pathways',
            'Agricultural Data Science 101',
            'IoT in the Greenhouse',
            'Sustainable Agri-Tech Systems',
            'Remote Sensing for Farmers',
            'GIS in Modern Agriculture',
            'Climate-Resilient Farming'
        ],
        DIPLOMA: [
            'Advanced Drone Operations in Farming',
            'IoT Sensor Deployment & Maintenance',
            'Precision Irrigation Engineering',
            'Greenhouse Automation Systems',
            'Livestock Monitoring Technology',
            'Agricultural Supply Chain Management',
            'Soil Diagnostics and Mapping',
            'Hydroponic Tech Specialist',
            'Smart Farm Infrastructure',
            'GIS Field Survey Techniques'
        ],
        UNDERGRADUATE: [
            'Data Analytics for Crop Yield',
            'Blockchain in Agri-Food Supply',
            'Deep Learning for Pest Detection',
            'Autonomous Farming Vehicle Design',
            'Hydrological Modeling and GIS',
            'Remote Sensing for Land Use',
            'Smart City-Farm Integration',
            'AI-Driven Irrigation Systems',
            'Precision Horticulture Management',
            'Policy and Tech in Agriculture'
        ],
        POSTGRADUATE: [
            'Research in Satellite Agri-Informatics',
            'Advanced AI Architectures for Bio-Tech',
            'Blockchain Protocols for Food Safety',
            'Genomic Data Analysis in Farming',
            'Urban Agri-Tech Ecosystem Design',
            'Robotic Vision for Agriculture',
            'Big Data in Global Food Security',
            'Advanced Remote Sensing Algorithms',
            'Nano-Tech in Precision Agriculture',
            'Strategic Agri-Tech Consulting'
        ]
    },
    HEALTHCARE: {
        SECONDARY: [
            'Helping with Health Apps',
            'Fun with Fitness Trackers',
            'What is a Digital Doctor?',
            'Your Body and Technology',
            'Safe Internet for Health',
            'Introduction to Medical Gadgets',
            'Digital First Aid Basics',
            'Health Data Explorers',
            'The Science of Medicine',
            'Wearable Tech for Beginners'
        ],
        HIGHER_SECONDARY: [
            'Basics of Health Records',
            'Intro to Medical Imaging',
            'Telemedicine Communication Skills',
            'Pharmacy Tech Fundamentals',
            'Data Entry in Hospitals',
            'Medical Device Principles',
            'Digital Health Ethics',
            'Anatomy and Tech',
            'Emergency Tech Basics',
            'Healthy Data Visualization'
        ],
        DIPLOMA: [
            'EMR System Administration',
            'Biomedical Equipment Repair',
            'Diagnostic Lab Automation',
            'Digital Pharmacy Operations',
            'Clinic Management Software',
            'Hospital Network Maintenance',
            'Health Informatics Support',
            'Wearable Calibration Tech',
            'Radiology Tech Systems',
            'Patient Data Security'
        ],
        UNDERGRADUATE: [
            'AI in Clinical Diagnostics',
            'Interoperability with HL7/FHIR',
            'Medical Internet of Things (mIoT)',
            'Healthcare Cybersecurity Defense',
            'Bio-Informatics Fundamentals',
            'Cloud Computing in Medicine',
            'Clinical Data Warehousing',
            'Precision Medicine Technology',
            'Hospital Resource Planning (ERP)',
            'Advanced Medical Imaging Analysis'
        ],
        POSTGRADUATE: [
            'Research in AI Health Diagnostics',
            'Advanced Genomics Informatics',
            'Predictive Analytics in Epidemiology',
            'Healthcare Blockchain Architectures',
            'Neurological Data Modeling',
            'Ethics of AI in Medicine',
            'Global Health IT Policy',
            'Machine Learning for Drug Discovery',
            'Advanced HIS Architecture',
            'Surgical Robotic Systems'
        ]
    },
    URBAN: {
        SECONDARY: [
            'City of the Future',
            'Smart Street Lights',
            'Saving Water in Cities',
            'How Traffic Lights Work',
            'Exploring City Sensors',
            'Clean Air for Everyone',
            'Digital Maps and You',
            'Green Cities Basics',
            'Tech for Safer Streets',
            'Waste and Recycling Fun'
        ],
        HIGHER_SECONDARY: [
            'Intro to Smart Grids',
            'Urban Mapping with GIS',
            'Traffic Flow Fundamentals',
            'Smart Waste Management',
            'Urban Connectivity Basics',
            'Renewable Energy in Hubs',
            'Public Transport Tech',
            'Citizen Engagement Apps',
            'Air Quality Sensors',
            'City Planning Models'
        ],
        DIPLOMA: [
            'GIS Analyst for Municipalities',
            'Traffic Signal System Tech',
            'Waste Energy Plant Ops',
            'Smart Lighting Maintenance',
            'Public WiFi Infrastructure',
            'CCTV & Security Networks',
            'Water Grid Management',
            'Urban Data Collection Tech',
            'Building Automation Systems',
            'Transit Card System Support'
        ],
        UNDERGRADUATE: [
            'AI for Smart Traffic Optimization',
            'Big Data Urban Analytics',
            'Blockchain for Smart Contracts',
            'IoT Hub Architecture for Cities',
            'Sustainable Urban Development',
            'Smart Grid Integration',
            'Autonomous Transit Systems',
            'Urban Resilience Modeling',
            'Open Data Portals Design',
            'Smart Building Engineering'
        ],
        POSTGRADUATE: [
            'Integrated Smart City Platforms',
            'Quantum Computing for City Logistics',
            'Urban AI Policy and Ethics',
            'Digital Twin City Architectures',
            'Smart Water Reclamation Policy',
            'Advanced Geospatial Algorithms',
            'Circular Economy Tech Policy',
            'Zero-Emission Urban Systems',
            'Smart Infrastructure Strategy',
            'Global Urban Innovation Research'
        ]
    }
};

export function generateCoursesForLevelAndDomain(
    level: EducationLevel,
    domain: CourseDomain,
    instructorIds: string[]
): GeneratedCourse[] {
    const titles = TITLES[domain][level] || [];
    const keywords = [...DOMAIN_KEYWORDS[domain], ...COMMON_KEYWORDS];

    return titles.map((title, index) => {
        const difficulty =
            level === 'SECONDARY' ? 'Beginner' :
                level === 'HIGHER_SECONDARY' ? index % 2 === 0 ? 'Beginner' : 'Intermediate' :
                    level === 'DIPLOMA' ? 'Intermediate' :
                        level === 'UNDERGRADUATE' ? index % 2 === 0 ? 'Intermediate' : 'Advanced' :
                            'Advanced';

        const priceBase =
            level === 'SECONDARY' ? 499 :
                level === 'HIGHER_SECONDARY' ? 1499 :
                    level === 'DIPLOMA' ? 3999 :
                        level === 'UNDERGRADUATE' ? 6999 :
                            9999;

        const price = priceBase + (index * 200);

        const instructorId = instructorIds[index % instructorIds.length];
        const slug = slugify(title);

        // Ensure keywords are present in description or tags for skill mapping
        const description = `This professional course on ${title} covers essential aspects of ${domain.toLowerCase()} technology. Designed for ${level.toLowerCase()} students, it focuses on practical applications of ${keywords.slice(0, 3).join(', ')} and ${keywords.slice(3, 6).join(', ')} to solve real-world problems. Participants will gain hands-on experience and develop industry-relevant skills.`;

        return {
            title,
            description,
            category: domain === 'AGRICULTURE' ? 'AgriTech' : domain === 'HEALTHCARE' ? 'HealthTech' : 'UrbanTech',
            domain,
            difficulty,
            duration: `${4 + (index % 8)} weeks`,
            price,
            prerequisites: ['Basic computer knowledge', `Interest in ${domain.toLowerCase()} technology`],
            learningOutcomes: [
                `Master fundamentals of ${title}`,
                `Apply ${keywords[index % keywords.length]} in practice`,
                'Analyze industry-specific case studies',
                'Develop problem-solving skills for modern challenges',
                'Collaborate on technology-driven projects',
                'Understand Future trends in the field'
            ].slice(0, 4 + (index % 3)),
            instructorId,
            isPublished: true,
            hasProject: level !== 'SECONDARY',
            targetEducationLevel: level,
            thumbnail: `/course-images/${domain.toLowerCase()}_${slug}.svg`,
            thumbnailPrompt: `Create a professional 16:9 e-learning course banner for:
Course Title: '${title}'
Domain: ${domain}
Education Level: ${level}

Style:
- Modern edtech banner
- Clean typography
- Industry-relevant visuals
- Subtle gradient overlay
- Professional corporate design
- 1280x720 resolution`,
            tags: [domain.toLowerCase(), level.toLowerCase(), ...keywords.slice(0, 2).map(k => k.toLowerCase())]
        };
    });
}

export function generateReviews(courseId: string, level: EducationLevel): GeneratedReview[] {
    const reviewCount = 5 + Math.floor(Math.random() * 4); // 5-8 reviews
    const reviews: GeneratedReview[] = [];

    const sentiment =
        level === 'SECONDARY' ? 'exciting' :
            level === 'DIPLOMA' ? 'practical' :
                level === 'UNDERGRADUATE' ? 'career' :
                    'technical';

    const comments: Record<string, string[]> = {
        exciting: [
            "This was so much fun! Learned a lot about robots in cities.",
            "Wow, I didn't know farms could be so high-tech. Amazing!",
            "Great course for school students. Loved the videos!",
            "Best introduction to technology I've ever had.",
            "Super exciting topics! My friends will love this too.",
            "The teacher made everything so easy to understand.",
            "I want to become a smart city engineer now!",
            "Cool projects and very interesting examples."
        ],
        practical: [
            "Very hands-on approach. The lab exercises were top-notch.",
            "Finally, a course that teaches how to actually fix the sensors.",
            "Excellent practical training. Good for vocational skills.",
            "Clear instructions for physical installation and maintenance.",
            "The troubleshooting modules were incredibly helpful for my job.",
            "Detailed practical guide. Highly recommend for technicians.",
            "Learned how to use the specific tools used in the industry.",
            "The most useful diploma course I've taken so far."
        ],
        career: [
            "This course gave me a huge boost in my internship search.",
            "Great focus on career-relevant skills like IoT and Data Analytics.",
            "The networking opportunities and career advice were excellent.",
            "I feel much more prepared for the industry after this.",
            "Invaluable insights into the professional landscape of the domain.",
            "The project work is a great addition to my portfolio.",
            "Highly relevant for anyone looking to enter the tech sector.",
            "Professional content that matches current job market demands."
        ],
        technical: [
            "Deeply researched content. The technical depth is impressive.",
            "Advanced algorithms and research-based case studies were great.",
            "Excellent for researchers looking at cutting-edge city tech.",
            "Very high technical standards. The data modeling was superb.",
            "Comprehensive review of current research and future possibilities.",
            "Challenging and rewarding. Advanced technical concepts explained well.",
            "The focus on policy and large-scale architecture was vital.",
            "A must-read for postgraduate students in this specialization."
        ]
    };

    const targetComments = comments[sentiment];
    const distribution = [5, 5, 4, 4, 4, 4, 4, 4.5, 4.5, 3.5]; // 20% 5, 50% 4, 20% 4.5, 10% 3.5

    for (let i = 0; i < reviewCount; i++) {
        reviews.push({
            rating: distribution[i % distribution.length],
            comment: targetComments[i % targetComments.length]
        });
    }

    return reviews;
}

export function generateAssignments(courseId: string, title: string) {
    const count = 8 + Math.floor(Math.random() * 3); // 8-10
    const types = ['Quiz', 'Assignment', 'Project', 'Case Study', 'Lab Exercise'];
    const assignments = [];

    for (let i = 1; i <= count; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        assignments.push({
            title: `${type} ${i}: ${title.split(':')[0]} - Module ${Math.ceil(i / 2)}`,
            description: `Complete this ${type.toLowerCase()} to demonstrate your understanding of the concepts covered in this module.`,
            dueDate: new Date(Date.now() + (7 * i * 24 * 60 * 60 * 1000)),
            maxScore: type === 'Project' ? 100 : type === 'Quiz' ? 25 : 50,
            courseId,
            order: i,
        });
    }

    return assignments;
}
