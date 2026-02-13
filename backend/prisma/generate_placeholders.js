const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../../frontend/public/course-images');

const TITLES = {
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

function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '_')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '_');
}

function getColors(domain) {
    switch (domain) {
        case 'AGRICULTURE': return { bg: '#2e7d32', text: '#ffffff', accent: '#a5d6a7' }; // Green
        case 'HEALTHCARE': return { bg: '#0277bd', text: '#ffffff', accent: '#81d4fa' }; // Blue
        case 'URBAN': return { bg: '#4527a0', text: '#ffffff', accent: '#b39ddb' }; // Purple
        default: return { bg: '#424242', text: '#ffffff', accent: '#bdbdbd' };
    }
}

function generateSVG(title, domain, level) {
    const { bg, text, accent } = getColors(domain);
    // Determine font size based on title length
    const fontSize = title.length > 30 ? 48 : 64;
    
    return `<svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${bg};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#000000;stop-opacity:0.6" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad)" />
  <rect width="100%" height="100%" fill="${bg}" fill-opacity="0.8" />
  
  <!-- Content -->
  <text x="50%" y="40%" font-family="Arial, sans-serif" font-weight="bold" font-size="${fontSize}" fill="${text}" text-anchor="middle" dominant-baseline="middle">
    ${title}
  </text>
  
  <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="32" fill="${accent}" text-anchor="middle" dominant-baseline="middle">
    ${domain} | ${level.replace(/_/g, ' ')}
  </text>
  
  <!-- Decorative Element -->
  <rect x="0" y="0" width="100%" height="15" fill="${accent}" />
  <rect x="0" y="705" width="100%" height="15" fill="${accent}" />
</svg>`;
}

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

let count = 0;
for (const domain in TITLES) {
    for (const level in TITLES[domain]) {
        TITLES[domain][level].forEach(title => {
            const slug = slugify(title);
            // Note: courseGenerator.ts uses .jpg extension for thumbnails.
            // But we are generating SVGs. The frontend/backend should handle this?
            // Wait, the courseGenerator hardcodes .jpg: `thumbnail: /course-images/${domain.toLowerCase()}_${slug}.jpg`
            // So I should save these as .jpg? No, I can't generate JPGs easily without external deps.
            // I will save as .svg but I might need to update the generator or just use .svg extension if the browser supports it (it does).
            // BUT, if the courseGenerator codes the URL as .jpg, the frontend will request .jpg.
            // If I save as .svg, the link will be broken unless I change the code.
            // Strategy: I will generate SVGs but I MUST update courseGenerator.ts to point to .svg OR I need to convert them.
            // Updating courseGenerator.ts is safer.
            
            const filename = `${domain.toLowerCase()}_${slug}.svg`;
            const filepath = path.join(OUTPUT_DIR, filename);
            const svgContent = generateSVG(title, domain, level);
            
            fs.writeFileSync(filepath, svgContent);
            console.log(`Generated: ${filename}`);
            count++;
        });
    }
}

console.log(`\nSuccessfully generated ${count} placeholder images.`);
