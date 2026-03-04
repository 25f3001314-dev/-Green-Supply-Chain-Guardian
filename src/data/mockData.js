// ============================================
// GREEN SUPPLY CHAIN GUARDIAN — MOCK DATA
// ============================================

export const user = {
    name: 'Sarah Chen',
    role: 'Sustainability Director',
    company: 'EcoVentures Global',
    avatar: 'SC',
    email: 'sarah.chen@ecoventures.com',
    plan: 'Enterprise',
};

export const kpis = [
    {
        id: 'emissions',
        label: 'Total Emissions',
        value: '12,847',
        unit: 'tCO₂e',
        change: -12.3,
        icon: '🏭',
        color: '#059669',
        bgColor: '#ecfdf5',
    },
    {
        id: 'reduction',
        label: 'Reduction Target',
        value: '67%',
        unit: 'achieved',
        change: 8.5,
        icon: '🎯',
        color: '#0d9488',
        bgColor: '#f0fdfa',
    },
    {
        id: 'score',
        label: 'Green Score',
        value: '94.2',
        unit: '/ 100',
        change: 3.1,
        icon: '🌿',
        color: '#059669',
        bgColor: '#ecfdf5',
    },
    {
        id: 'compliance',
        label: 'Supplier Compliance',
        value: '91%',
        unit: 'compliant',
        change: 5.7,
        icon: '✅',
        color: '#2563eb',
        bgColor: '#eff6ff',
    },
];

export const monthlyEmissions = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    scope1: [420, 390, 410, 380, 360, 340, 330, 310, 290, 280, 260, 245],
    scope2: [680, 650, 630, 610, 590, 560, 540, 520, 510, 490, 470, 450],
    scope3: [1200, 1150, 1120, 1080, 1050, 1020, 980, 950, 920, 890, 860, 830],
    target: [1100, 1060, 1020, 980, 940, 900, 860, 820, 780, 740, 700, 660],
};

export const suppliers = [
    { id: 1, name: 'GreenTech Materials', location: 'Munich, Germany', category: 'Raw Materials', esg: 96, risk: 'Low', certifications: ['ISO 14001', 'FSC', 'B Corp'], status: 'Active', carbonIntensity: 12.3, lastAudit: '2025-12-15' },
    { id: 2, name: 'EcoPackage Solutions', location: 'Amsterdam, Netherlands', category: 'Packaging', esg: 91, risk: 'Low', certifications: ['ISO 14001', 'Cradle2Cradle'], status: 'Active', carbonIntensity: 18.7, lastAudit: '2025-11-20' },
    { id: 3, name: 'SolarFreight Logistics', location: 'Copenhagen, Denmark', category: 'Logistics', esg: 88, risk: 'Low', certifications: ['SmartWay', 'GLEC'], status: 'Active', carbonIntensity: 34.2, lastAudit: '2025-10-05' },
    { id: 4, name: 'BioFiber Textiles', location: 'Porto, Portugal', category: 'Textiles', esg: 85, risk: 'Medium', certifications: ['GOTS', 'OEKO-TEX'], status: 'Active', carbonIntensity: 22.1, lastAudit: '2025-09-30' },
    { id: 5, name: 'CleanSteel Corp', location: 'Osaka, Japan', category: 'Metals', esg: 82, risk: 'Medium', certifications: ['ISO 14001', 'ResponsibleSteel'], status: 'Active', carbonIntensity: 45.6, lastAudit: '2025-08-12' },
    { id: 6, name: 'TerraChemicals', location: 'São Paulo, Brazil', category: 'Chemicals', esg: 74, risk: 'High', certifications: ['ISO 14001'], status: 'Under Review', carbonIntensity: 67.3, lastAudit: '2025-07-22' },
    { id: 7, name: 'NordWood Forestry', location: 'Helsinki, Finland', category: 'Raw Materials', esg: 93, risk: 'Low', certifications: ['FSC', 'PEFC', 'ISO 14001'], status: 'Active', carbonIntensity: 8.9, lastAudit: '2025-12-01' },
    { id: 8, name: 'VoltTransit Electric', location: 'Oslo, Norway', category: 'Logistics', esg: 94, risk: 'Low', certifications: ['SmartWay', 'EV100'], status: 'Active', carbonIntensity: 5.2, lastAudit: '2025-11-10' },
    { id: 9, name: 'AquaPure Industries', location: 'Singapore', category: 'Chemicals', esg: 79, risk: 'Medium', certifications: ['ISO 14001', 'REACH'], status: 'Active', carbonIntensity: 38.4, lastAudit: '2025-10-28' },
    { id: 10, name: 'RecycleMax Partners', location: 'Toronto, Canada', category: 'Waste Management', esg: 90, risk: 'Low', certifications: ['Zero Waste', 'B Corp'], status: 'Active', carbonIntensity: 11.7, lastAudit: '2025-11-15' },
    { id: 11, name: 'FairTrade Cotton Co.', location: 'Nairobi, Kenya', category: 'Textiles', esg: 87, risk: 'Medium', certifications: ['Fairtrade', 'GOTS'], status: 'Active', carbonIntensity: 19.8, lastAudit: '2025-09-15' },
    { id: 12, name: 'PetroChem Legacy', location: 'Houston, USA', category: 'Chemicals', esg: 58, risk: 'Critical', certifications: ['ISO 14001'], status: 'Flagged', carbonIntensity: 89.2, lastAudit: '2025-06-01' },
    { id: 13, name: 'AlpineCircuit Tech', location: 'Zurich, Switzerland', category: 'Electronics', esg: 89, risk: 'Low', certifications: ['ISO 14001', 'RoHS', 'EPEAT'], status: 'Active', carbonIntensity: 23.4, lastAudit: '2025-11-28' },
    { id: 14, name: 'SunHarvest Agri', location: 'Valencia, Spain', category: 'Agriculture', esg: 92, risk: 'Low', certifications: ['Rainforest Alliance', 'Fairtrade', 'Organic'], status: 'Active', carbonIntensity: 9.6, lastAudit: '2025-12-10' },
    { id: 15, name: 'BlueOcean Shipping', location: 'Rotterdam, Netherlands', category: 'Logistics', esg: 76, risk: 'Medium', certifications: ['ISO 14001', 'MARPOL'], status: 'Active', carbonIntensity: 41.8, lastAudit: '2025-10-18' },
    { id: 16, name: 'TerraForm Plastics', location: 'Seoul, South Korea', category: 'Packaging', esg: 71, risk: 'High', certifications: ['ISO 14001'], status: 'Under Review', carbonIntensity: 58.9, lastAudit: '2025-08-05' },
    { id: 17, name: 'WindPower Components', location: 'Aarhus, Denmark', category: 'Energy', esg: 97, risk: 'Low', certifications: ['ISO 14001', 'WindEurope', 'B Corp'], status: 'Active', carbonIntensity: 4.1, lastAudit: '2025-12-20' },
    { id: 18, name: 'GreenMine Cobalt', location: 'Lusaka, Zambia', category: 'Metals', esg: 68, risk: 'High', certifications: ['RMI', 'ISO 14001'], status: 'Under Review', carbonIntensity: 72.3, lastAudit: '2025-07-14' },
    { id: 19, name: 'BioPlastic Innovate', location: 'Utrecht, Netherlands', category: 'Packaging', esg: 95, risk: 'Low', certifications: ['Cradle2Cradle', 'TUV OK Biobased', 'ISO 14001'], status: 'Active', carbonIntensity: 7.8, lastAudit: '2025-12-05' },
    { id: 20, name: 'SilkRoute Textiles', location: 'Dhaka, Bangladesh', category: 'Textiles', esg: 63, risk: 'High', certifications: ['OEKO-TEX'], status: 'Under Review', carbonIntensity: 55.2, lastAudit: '2025-09-01' },
    { id: 21, name: 'EastAsia Electronics', location: 'Shenzhen, China', category: 'Electronics', esg: 72, risk: 'Medium', certifications: ['ISO 14001', 'RoHS'], status: 'Active', carbonIntensity: 47.3, lastAudit: '2025-10-12' },
    { id: 22, name: 'IberWood Sustainable', location: 'Lisbon, Portugal', category: 'Raw Materials', esg: 90, risk: 'Low', certifications: ['FSC', 'PEFC'], status: 'Active', carbonIntensity: 10.2, lastAudit: '2025-11-22' },
    { id: 23, name: 'CarbonZero Cement', location: 'Düsseldorf, Germany', category: 'Construction', esg: 81, risk: 'Medium', certifications: ['ISO 14001', 'EPD', 'EC3'], status: 'Active', carbonIntensity: 52.7, lastAudit: '2025-09-20' },
    { id: 24, name: 'ArcticFreight Rail', location: 'Stockholm, Sweden', category: 'Logistics', esg: 91, risk: 'Low', certifications: ['SmartWay', 'ISO 50001'], status: 'Active', carbonIntensity: 6.3, lastAudit: '2025-12-08' },
    { id: 25, name: 'PacificGrow Foods', location: 'Auckland, New Zealand', category: 'Agriculture', esg: 88, risk: 'Low', certifications: ['Organic', 'Rainforest Alliance', 'B Corp'], status: 'Active', carbonIntensity: 14.7, lastAudit: '2025-11-05' },
];

export const shipments = [
    { id: 'SHP-2847', origin: 'Munich, DE', destination: 'Rotterdam, NL', mode: 'Rail', status: 'In Transit', progress: 72, carbon: 1.8, eta: '2026-02-27', supplier: 'GreenTech Materials' },
    { id: 'SHP-2848', origin: 'Amsterdam, NL', destination: 'London, UK', mode: 'Electric Truck', status: 'In Transit', progress: 45, carbon: 0.9, eta: '2026-02-28', supplier: 'EcoPackage Solutions' },
    { id: 'SHP-2849', origin: 'Osaka, JP', destination: 'Shanghai, CN', mode: 'Sea', status: 'In Transit', progress: 38, carbon: 12.4, eta: '2026-03-05', supplier: 'CleanSteel Corp' },
    { id: 'SHP-2850', origin: 'São Paulo, BR', destination: 'Miami, US', mode: 'Sea', status: 'Delayed', progress: 62, carbon: 24.1, eta: '2026-03-02', supplier: 'TerraChemicals' },
    { id: 'SHP-2851', origin: 'Helsinki, FI', destination: 'Stockholm, SE', mode: 'Electric Truck', status: 'Delivered', progress: 100, carbon: 0.4, eta: '2026-02-25', supplier: 'NordWood Forestry' },
    { id: 'SHP-2852', origin: 'Copenhagen, DK', destination: 'Hamburg, DE', mode: 'Rail', status: 'In Transit', progress: 88, carbon: 1.2, eta: '2026-02-26', supplier: 'SolarFreight Logistics' },
    { id: 'SHP-2853', origin: 'Oslo, NO', destination: 'Gothenburg, SE', mode: 'Electric Truck', status: 'Loading', progress: 10, carbon: 0.3, eta: '2026-03-01', supplier: 'VoltTransit Electric' },
    { id: 'SHP-2854', origin: 'Singapore, SG', destination: 'Sydney, AU', mode: 'Sea', status: 'In Transit', progress: 55, carbon: 18.7, eta: '2026-03-08', supplier: 'AquaPure Industries' },
    { id: 'SHP-2855', origin: 'Toronto, CA', destination: 'Chicago, US', mode: 'Rail', status: 'Delivered', progress: 100, carbon: 2.1, eta: '2026-02-24', supplier: 'RecycleMax Partners' },
    { id: 'SHP-2856', origin: 'Nairobi, KE', destination: 'Mumbai, IN', mode: 'Air', status: 'In Transit', progress: 68, carbon: 42.3, eta: '2026-02-27', supplier: 'FairTrade Cotton Co.' },
];

export const emissionsScopeBreakdown = {
    scope1: { value: 2940, percentage: 19, label: 'Direct Emissions', description: 'Company vehicles, on-site fuel combustion' },
    scope2: { value: 5640, percentage: 37, label: 'Energy Indirect', description: 'Purchased electricity, steam, heating' },
    scope3: { value: 6720, percentage: 44, label: 'Value Chain', description: 'Supply chain, logistics, waste disposal' },
};

export const hotspots = [
    { source: 'Ocean Freight (Asia-EU)', emissions: 3240, severity: 'High', trend: 'decreasing', reduction: '15% via route optimization' },
    { source: 'Raw Material Processing', emissions: 2180, severity: 'High', trend: 'stable', reduction: 'Switch to green hydrogen planned' },
    { source: 'Warehouse Energy (US)', emissions: 1450, severity: 'Medium', trend: 'decreasing', reduction: 'Solar panels installed Q3 2025' },
    { source: 'Air Freight (Emergency)', emissions: 1120, severity: 'High', trend: 'increasing', reduction: 'Buffer stock strategy in progress' },
    { source: 'Packaging Materials', emissions: 870, severity: 'Medium', trend: 'decreasing', reduction: '80% recycled content achieved' },
    { source: 'Last Mile Delivery', emissions: 640, severity: 'Low', trend: 'decreasing', reduction: 'EV fleet 90% deployed' },
];

export const complianceFrameworks = [
    { name: 'GHG Protocol', status: 'Compliant', score: 98, nextAudit: '2026-06-15', icon: '📊' },
    { name: 'CSRD (EU)', status: 'Compliant', score: 94, nextAudit: '2026-04-01', icon: '🇪🇺' },
    { name: 'ISO 14064', status: 'Compliant', score: 96, nextAudit: '2026-05-20', icon: '🏅' },
    { name: 'SBTi Targets', status: 'On Track', score: 87, nextAudit: '2026-08-10', icon: '🎯' },
    { name: 'CDP Disclosure', status: 'Submitted', score: 91, nextAudit: '2026-07-01', icon: '📋' },
    { name: 'TCFD Reporting', status: 'Compliant', score: 89, nextAudit: '2026-09-15', icon: '🌡️' },
];

export const recentReports = [
    { name: 'Q4 2025 Sustainability Report', date: '2026-01-15', type: 'Quarterly', size: '4.2 MB', status: 'Published' },
    { name: 'Annual Carbon Disclosure 2025', date: '2026-01-30', type: 'Annual', size: '12.8 MB', status: 'Published' },
    { name: 'Supplier ESG Assessment Dec-25', date: '2025-12-20', type: 'Assessment', size: '3.1 MB', status: 'Published' },
    { name: 'CSRD Compliance Report 2025', date: '2026-02-01', type: 'Compliance', size: '8.5 MB', status: 'Under Review' },
    { name: 'GHG Scope 3 Analysis', date: '2026-02-10', type: 'Analysis', size: '5.7 MB', status: 'Draft' },
];

export const activityFeed = [
    { id: 1, type: 'alert', message: 'TerraChemicals ESG score dropped below threshold (74)', time: '2 hours ago', icon: '⚠️' },
    { id: 2, type: 'success', message: 'SHP-2851 delivered with 15% lower carbon than estimated', time: '4 hours ago', icon: '✅' },
    { id: 3, type: 'info', message: 'New supplier NordWood Forestry onboarded successfully', time: '6 hours ago', icon: 'ℹ️' },
    { id: 4, type: 'success', message: 'Monthly emissions report generated automatically', time: '8 hours ago', icon: '📊' },
    { id: 5, type: 'warning', message: 'PetroChem Legacy flagged for critical ESG concerns', time: '12 hours ago', icon: '🚨' },
    { id: 6, type: 'info', message: 'Route optimization saved 2.3 tCO₂e on EU corridor', time: '1 day ago', icon: '🛤️' },
    { id: 7, type: 'success', message: 'ISO 14064 recertification confirmed', time: '1 day ago', icon: '🏅' },
    { id: 8, type: 'info', message: 'Q4 carbon offset credits verified and retired', time: '2 days ago', icon: '🌱' },
];

export const transportModes = [
    { mode: 'Sea Freight', percentage: 42, color: '#0d9488' },
    { mode: 'Rail', percentage: 28, color: '#059669' },
    { mode: 'Electric Truck', percentage: 18, color: '#10b981' },
    { mode: 'Air Freight', percentage: 8, color: '#f59e0b' },
    { mode: 'Traditional Truck', percentage: 4, color: '#ef4444' },
];

export const reductionMilestones = [
    { year: '2023', target: '10%', achieved: '12%', status: 'completed', description: 'Baseline measurement & quick wins' },
    { year: '2024', target: '20%', achieved: '23%', status: 'completed', description: 'Supplier engagement & logistics optimization' },
    { year: '2025', target: '35%', achieved: '38%', status: 'completed', description: 'Renewable energy transition & EV fleet' },
    { year: '2026', target: '50%', achieved: '—', status: 'in-progress', description: 'Green hydrogen & circular economy integration' },
    { year: '2028', target: '70%', achieved: '—', status: 'planned', description: 'Full Scope 3 decarbonization' },
    { year: '2030', target: '90%', achieved: '—', status: 'planned', description: 'Net-zero operations target' },
];

export const landingStats = [
    { value: 500, suffix: '+', label: 'Enterprise Clients' },
    { value: 12000, suffix: '+', label: 'Suppliers Tracked' },
    { value: 32, suffix: '%', label: 'Avg. Emission Reduction' },
    { value: 99.9, suffix: '%', label: 'Platform Uptime' },
];

export const features = [
    { icon: '📉', title: 'Carbon Tracking', description: 'Real-time Scope 1, 2 & 3 emissions monitoring with AI-powered anomaly detection and automated reporting.' },
    { icon: '🏆', title: 'Supplier ESG Scoring', description: 'Comprehensive ESG assessment engine scoring suppliers across 50+ environmental, social and governance criteria.' },
    { icon: '🛤️', title: 'Route Optimization', description: 'AI-driven logistics optimization reducing carbon footprint by selecting the greenest transport corridors.' },
    { icon: '📋', title: 'Compliance Engine', description: 'Automated compliance with GHG Protocol, CSRD, ISO 14064, SBTi and 20+ regulatory frameworks.' },
    { icon: '🔔', title: 'Real-time Alerts', description: 'Instant notifications for ESG violations, emission spikes, compliance deadlines and supply chain risks.' },
    { icon: '🤖', title: 'AI Insights', description: 'Machine learning models predict emission hotspots and recommend optimization strategies for your supply chain.' },
];

export const testimonials = [
    { quote: "Green Supply Chain Guardian helped us reduce our Scope 3 emissions by 34% in just 18 months. The supplier scoring system is a game-changer.", author: 'Marcus Weber', role: 'VP Supply Chain, AutoMotive EU', avatar: 'MW' },
    { quote: "The compliance automation alone saved our team 200+ hours per quarter. We went from struggling with CSRD to being fully compliant.", author: 'Priya Sharma', role: 'Chief Sustainability Officer, TechNova', avatar: 'PS' },
    { quote: "Finally, a platform that makes supply chain sustainability actionable, not just measurable. The ROI was evident within 3 months.", author: 'James O\'Brien', role: 'Director of Operations, GreenRetail Co.', avatar: 'JO' },
];

// ── Historical Data (2 years monthly) ──
export const historicalEmissions = {
    labels: ['Jan 24', 'Feb 24', 'Mar 24', 'Apr 24', 'May 24', 'Jun 24', 'Jul 24', 'Aug 24', 'Sep 24', 'Oct 24', 'Nov 24', 'Dec 24',
             'Jan 25', 'Feb 25', 'Mar 25', 'Apr 25', 'May 25', 'Jun 25', 'Jul 25', 'Aug 25', 'Sep 25', 'Oct 25', 'Nov 25', 'Dec 25'],
    scope1: [510, 495, 480, 460, 440, 420, 410, 395, 380, 365, 350, 335,
             420, 390, 410, 380, 360, 340, 330, 310, 290, 280, 260, 245],
    scope2: [820, 795, 775, 750, 720, 695, 670, 645, 625, 600, 580, 560,
             680, 650, 630, 610, 590, 560, 540, 520, 510, 490, 470, 450],
    scope3: [1450, 1400, 1360, 1310, 1270, 1230, 1190, 1150, 1110, 1070, 1035, 1000,
             1200, 1150, 1120, 1080, 1050, 1020, 980, 950, 920, 890, 860, 830],
};

// ── AI Emission Forecasts ──
export const aiForecasts = {
    labels: ['Jan 26', 'Feb 26', 'Mar 26', 'Apr 26', 'May 26', 'Jun 26'],
    optimistic: [720, 690, 655, 620, 585, 555],
    baseline: [760, 735, 705, 675, 645, 615],
    pessimistic: [800, 780, 760, 745, 730, 715],
    confidence: 87, // percent
};

// ── Weather Data ──
export const weatherData = {
    northAtlantic: { condition: 'Moderate Swells', windKnots: 22, seaState: 'Rough', delayRisk: 'Medium', affectedRoutes: ['SHP-2849', 'SHP-2854'] },
    northSea: { condition: 'Clear', windKnots: 8, seaState: 'Calm', delayRisk: 'Low', affectedRoutes: [] },
    mediterranean: { condition: 'Partly Cloudy', windKnots: 14, seaState: 'Slight', delayRisk: 'Low', affectedRoutes: [] },
    pacificAsia: { condition: 'Tropical Storm Watch', windKnots: 35, seaState: 'Very Rough', delayRisk: 'High', affectedRoutes: ['SHP-2856'] },
};

// ── Emission Factors (kg CO₂e per tonne-km) ──
export const emissionFactors = {
    'Sea Freight': 0.008,
    'Air Freight': 0.602,
    'Rail': 0.028,
    'Electric Truck': 0.050,
    'Diesel Truck': 0.150,
    'Hydrogen Truck': 0.035,
    'River Barge': 0.031,
    'Pipeline': 0.003,
};

// ── ESG Score History (last 6 months per supplier id) ──
export const supplierESGHistory = {
    1: [94, 95, 95, 96, 96, 96],
    2: [89, 90, 91, 91, 91, 91],
    3: [85, 86, 87, 88, 88, 88],
    4: [83, 84, 84, 85, 85, 85],
    5: [80, 81, 82, 82, 82, 82],
    6: [78, 76, 75, 74, 74, 74],
    7: [91, 92, 92, 93, 93, 93],
    8: [93, 93, 94, 94, 94, 94],
    9: [77, 78, 79, 79, 79, 79],
    10: [88, 89, 90, 90, 90, 90],
    11: [85, 86, 87, 87, 87, 87],
    12: [62, 60, 59, 58, 58, 58],
};
