export const HERO_HIGHLIGHTS = [
  {
    label: "01",
    title: "Curated NGO insights",
    copy:
      "Browse verified organizations, mission statements, and impact snapshots tailored to your interests.",
  },
  {
    label: "02",
    title: "Smart search & filters",
    copy:
      "Find causes by location, SDG, or focus area, then save opportunities as you plan your support.",
  },
  {
    label: "03",
    title: "Community stories",
    copy:
      "Explore testimonials from volunteers and partners that show how collaboration drives real change.",
  },
  {
    label: "04",
    title: "Aligned with the SDGs",
    copy:
      "Stay informed on progress toward the Sustainable Development Goals and discover how to contribute.",
  },
];

export const CHAPTER_STEPS = [
  {
    id: "chapter-01",
    badge: "chapter 01",
    title: "Find an organization you believe in",
    copy:
      "Search by SDG, location, or focus area. Curated stories and transparent metrics help you discover organizations that match your purpose.",
    image: "/images/Discover.jpg",
    alt: "Find an organization you believe in",
    priority: "high",
  },
  {
    id: "chapter-02",
    badge: "chapter 02",
    title: "Join and get involved",
    copy:
      "Create an account, follow impact updates, and coordinate with teams. Cause Connect keeps every conversation and opportunity in one place.",
    image: "/images/helpOut.jpg",
    alt: "Join and get involved",
  },
  {
    id: "chapter-03",
    badge: "chapter 03",
    title: "Help out, make an impact",
    copy:
      "Volunteer, donate, or participate — see how every contribution moves the mission forward.",
    image: "/images/beAmazing.jpg",
    alt: "Help out, make an impact",
  },
];

export const STAT_BLOCKS = [
  { label: "active ngos", end: 120, suffix: "+" },
  { label: "sdgs represented", end: 25, suffix: "" },
  { label: "community actions", end: 8000, suffix: "", format: "compact" },
];

export const CREATOR_TEAM = [
  {
    name: "Alberto Cisneros",
    role: "Front-end Design & Animation",
    copy: "Crafted the UI, GSAP animations, and brought the brand to life with motion.",
  },
  {
    name: "Juan Luna",
    role: "Back-end Development & Systems",
    copy: "Built the server logic, routes, and ensured everything worked seamlessly behind the scenes.",
  },
  {
    name: "Isaac Zenteno",
    role: "Research & Content Curation",
    copy: "Gathered NGO data, verified SDG information, and gave meaning to every directory entry.",
  },
];

export const SDG_GOALS = [
  { number: 1, title: "No Poverty", copy: "Eradicate poverty in all forms everywhere." },
  { number: 2, title: "Zero Hunger", copy: "End hunger and ensure food security through sustainable agriculture." },
  { number: 3, title: "Good Health", copy: "Guarantee healthy lives and well-being for all ages." },
  { number: 4, title: "Quality Education", copy: "Provide inclusive and equitable education for everyone." },
  { number: 5, title: "Gender Equality", copy: "Achieve equality and empower all women and girls." },
  { number: 6, title: "Clean Water & Sanitation", copy: "Ensure safe water and sanitation access for all." },
  { number: 7, title: "Affordable & Clean Energy", copy: "Provide sustainable, modern, and reliable energy." },
  { number: 8, title: "Decent Work & Growth", copy: "Promote inclusive economic growth and decent jobs." },
  { number: 9, title: "Industry, Innovation & Infrastructure", copy: "Build resilient infrastructure and foster innovation." },
  { number: 10, title: "Reduced Inequalities", copy: "Decrease inequality within and among countries." },
  { number: 11, title: "Sustainable Cities", copy: "Make cities inclusive, safe, and environmentally friendly." },
  { number: 12, title: "Responsible Consumption", copy: "Ensure sustainable production and consumption patterns." },
  { number: 13, title: "Climate Action", copy: "Take urgent action to combat climate change." },
  { number: 14, title: "Life Below Water", copy: "Conserve oceans and marine resources." },
  { number: 15, title: "Life on Land", copy: "Protect forests, biodiversity, and ecosystems." },
  { number: 16, title: "Peace, Justice & Institutions", copy: "Promote peace, justice, and strong institutions." },
  { number: 17, title: "Partnerships for the Goals", copy: "Strengthen global cooperation for sustainability." },
];

export const SDG_SPOTLIGHTS = [
  {
    badge: "Goal 2",
    title: "Community Kitchens MX",
    copy: "Redesigning food rescue programs with zero waste logistics.",
    query: "Community Kitchens",
  },
  {
    badge: "Goal 6",
    title: "Blue Water Alliance",
    copy: "Deploying low-cost filtration to lakeside communities.",
    query: "Blue Water Alliance",
  },
  {
    badge: "Goal 12",
    title: "Circular Craft Labs",
    copy: "Women-led cooperatives transforming textile offcuts into training.",
    query: "Circular Craft Labs",
  },
  {
    badge: "Goal 15",
    title: "Bosque Vivo",
    copy: "Monitoring biodiversity recoveries with local youth scientists.",
    query: "Bosque Vivo",
  },
];

export const CONTACT_VALIDATORS = {
  name(value) {
    if (!value.trim()) return "please add your name";
    return "";
  },
  email(value) {
    if (!value.trim()) return "please use a valid email";
    const simplePattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!simplePattern.test(value.trim())) return "please use a valid email";
    return "";
  },
  message(value) {
    if (!value.trim()) return "let us know how we can help";
    if (value.trim().length < 10) return "share a little more detail";
    return "";
  },
};
