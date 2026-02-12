const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '../../frontend/public/course-images');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const courses = [
    { title: 'Introduction to Smart Farming', domain: 'AGRICULTURE', filename: 'agri_intro_smart_farming.svg' },
    { title: 'Digital Health Basics', domain: 'HEALTHCARE', filename: 'health_digital_basics.svg' },
    { title: 'Smart Cities 101', domain: 'URBAN', filename: 'urban_smart_cities_101.svg' },
    { title: 'Organic Farming Awareness', domain: 'AGRICULTURE', filename: 'agri_organic_awareness.svg' },
    { title: 'First Aid & Emergency Apps', domain: 'HEALTHCARE', filename: 'health_first_aid_apps.svg' },
    { title: 'Agricultural Drones: Mapping & Crop Analysis', domain: 'AGRICULTURE', filename: 'agri_drones_mapping.svg' },
    { title: 'Pharmacy Management Fundamentals', domain: 'HEALTHCARE', filename: 'health_pharmacy_mgmt.svg' },
    { title: 'Smart Waste Management & Recycling', domain: 'URBAN', filename: 'urban_waste_mgmt.svg' },
    { title: 'Soil Health & Digital Testing', domain: 'AGRICULTURE', filename: 'agri_soil_digital.svg' },
    { title: 'Smart Parking Systems', domain: 'URBAN', filename: 'urban_smart_parking.svg' },
    { title: 'Livestock Monitoring & Smart Dairy Technology', domain: 'AGRICULTURE', filename: 'agri_livestock_iot.svg' },
    { title: 'Medical Equipment Maintenance', domain: 'HEALTHCARE', filename: 'health_equipment_maint.svg' },
    { title: 'Traffic Sensor Installation & Maintenance', domain: 'URBAN', filename: 'urban_traffic_sensors.svg' },
    { title: 'Greenhouse Climate Control Systems', domain: 'AGRICULTURE', filename: 'agri_greenhouse_climate.svg' },
    { title: 'Water Quality Monitoring Technician', domain: 'URBAN', filename: 'urban_water_quality.svg' },
    { title: 'Precision Agriculture with IoT Sensors', domain: 'AGRICULTURE', filename: 'agri_precision_iot.svg' },
    { title: 'Electronic Health Records (EHR) Management', domain: 'HEALTHCARE', filename: 'health_ehr_mgmt.svg' },
    { title: 'Smart Traffic Management Systems', domain: 'URBAN', filename: 'urban_traffic_mgmt.svg' },
    { title: 'Healthcare Data Analytics & Visualization', domain: 'HEALTHCARE', filename: 'health_data_analytics.svg' },
    { title: 'Urban Air Quality Monitoring', domain: 'URBAN', filename: 'urban_air_quality.svg' },
    { title: 'Agricultural Supply Chain & Blockchain Traceability', domain: 'AGRICULTURE', filename: 'agri_blockchain_supply.svg' },
    { title: 'AI-Powered Medical Image Analysis', domain: 'HEALTHCARE', filename: 'health_ai_imaging.svg' },
    { title: 'Smart City Platform Architecture', domain: 'URBAN', filename: 'urban_smart_platform.svg' },
    { title: 'Remote Sensing for Agricultural Policy', domain: 'AGRICULTURE', filename: 'agri_remote_sensing.svg' },
    { title: 'Hospital Information Systems Architecture', domain: 'HEALTHCARE', filename: 'health_his_architecture.svg' },
    { title: 'Discover Your Career Path', domain: null, filename: 'career_discover_path.svg' },
    { title: 'Science vs Commerce vs Arts', domain: null, filename: 'career_streams.svg' },
    { title: 'Diploma or Degree?', domain: null, filename: 'career_degree_diploma.svg' },
    { title: 'Aptitude Discovery', domain: null, filename: 'career_aptitude.svg' },
    { title: 'Emerging Fields', domain: null, filename: 'career_emerging.svg' },
    { title: 'Study Skills for Success', domain: null, filename: 'career_study_skills.svg' }
];

const colors = {
    AGRICULTURE: { bg: '#2e7d32', text: '#ffffff', icon: '🌱' },
    HEALTHCARE: { bg: '#0288d1', text: '#ffffff', icon: '⚕️' },
    URBAN: { bg: '#455a64', text: '#ffffff', icon: '🏙️' },
    DEFAULT: { bg: '#673ab7', text: '#ffffff', icon: '🚀' }
};

courses.forEach(course => {
    const theme = colors[course.domain] || colors.DEFAULT;
    const svgContent = `
<svg width="640" height="360" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${theme.bg}"/>
    <text x="50%" y="40%" font-family="Arial, sans-serif" font-size="80" text-anchor="middle" fill="${theme.text}" dy=".3em">${theme.icon}</text>
    <text x="50%" y="65%" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="${theme.text}" font-weight="bold">
        ${course.title.split(':').map((line, i) => `<tspan x="50%" dy="${i === 0 ? 0 : '1.2em'}">${line}</tspan>`).join('')}
    </text>
</svg>`;

    fs.writeFileSync(path.join(outputDir, course.filename), svgContent.trim());
    console.log(`Generated: ${course.filename}`);
});
