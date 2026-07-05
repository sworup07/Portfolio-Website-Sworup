/* ============================================================
   data.js — All static content for Sworup's portfolio
   Projects, blog posts, skills. Edit here to update content.
   ============================================================ */

const PORTFOLIO_DATA = {

  skills: [
    { name: 'HTML & CSS',    pct: 90 },
    { name: 'JavaScript',    pct: 78 },
    { name: 'Python',        pct: 72 },
    { name: 'UI/UX Design',  pct: 68 },
    { name: 'React',         pct: 55 },
    { name: 'Git & GitHub',  pct: 75 },
  ],

  /* ── Expertise cards (dedicated "My Expertise" section) ─── */
  expertise: [
    { icon: '🧱', name: 'HTML',                pct: 92, group: 'Development', desc: 'Semantic, accessible markup built for performance and SEO.' },
    { icon: '🎨', name: 'CSS',                 pct: 88, group: 'Development', desc: 'Modern layout systems — Flexbox, Grid, animations, responsive design.' },
    { icon: '⚙️', name: 'JavaScript',          pct: 78, group: 'Development', desc: 'Vanilla JS architecture, DOM interactivity, API integration.' },
    { icon: '📱', name: 'Responsive Design',   pct: 85, group: 'Development', desc: 'Mobile-first builds that adapt cleanly across every device.' },
    { icon: '🖌️', name: 'Graphic Design',       pct: 82, group: 'Design',      desc: 'Logos, posters, brochures, banners and brand collateral.' },
    { icon: '🎬', name: 'Motion Advertisement', pct: 70, group: 'Creative',    desc: 'Short-form product and brand videos with AI-assisted motion.' },
    { icon: '🤖', name: 'AI Prompt Engineering', pct: 80, group: 'Creative',   desc: 'Directing AI image & video tools to produce commercial-grade output.' },
    { icon: '🧠', name: 'Creative Strategy',    pct: 75, group: 'Creative',    desc: 'Turning a brand idea into a clear, scroll-stopping concept.' },
    { icon: '📣', name: 'Commercial Advertising', pct: 74, group: 'Creative',  desc: 'Spec advertisement concepts built with storytelling and structure.' },
    { icon: '🏷️', name: 'Branding',             pct: 76, group: 'Design',      desc: 'Consistent visual identity — color, type, tone, and voice.' },
  ],

  /* ── Services offered ────────────────────────────────────── */
  services: [
    {
      icon: '💻', title: 'Website Development',
      desc: 'Fast, responsive, SEO-friendly websites — from portfolios to full business sites — built with clean, maintainable code.',
      items: ['Landing Pages', 'Portfolio Websites', 'Business Websites'],
    },
    {
      icon: '🖼️', title: 'Graphic Design',
      desc: 'Visual assets that make a brand instantly recognizable, across print and digital.',
      items: ['Poster Design', 'Brochure Design', 'Business Card Design', 'Banner & Roll-up Design', 'Restaurant Menus', 'Packaging Design'],
    },
    {
      icon: '📲', title: 'Social Media Creatives',
      desc: 'Scroll-stopping posts and ad creatives tailored for Meta platforms and organic growth.',
      items: ['Social Media Post Design', 'Facebook Ads', 'Instagram Ads', 'YouTube Thumbnails'],
    },
    {
      icon: '🎥', title: 'AI Commercial Advertisements',
      desc: 'Premium, cinematic-style product and brand advertisements produced with AI-assisted video and image generation.',
      items: ['Short-form Product Ads', 'AI Cinematic Commercials', 'Product Promotion Videos', 'Luxury Advertisement Concepts'],
    },
    {
      icon: '🧭', title: 'Creative Consultation',
      desc: 'Strategic direction for a brand\'s visual identity and advertising approach, from concept to execution.',
      items: ['Creative Direction', 'Brand Visual Campaigns', 'Product Launch Creatives', 'Advertising Concepts'],
    },
    {
      icon: '🏢', title: 'Brand Identity',
      desc: 'Cohesive brand systems that carry a consistent look and voice across every touchpoint.',
      items: ['Logo Design', 'Brand Identity Concepts', 'Marketing Visual Design'],
    },
  ],

  /* ── Independent commercial ad / spec showcase ──────────── */
  adConcepts: [
    {
      icon: '🥤', title: 'Refresh — Beverage Launch Concept', label: 'Independent Creative Concept',
      desc: 'A cinematic, high-energy spec commercial exploring how a beverage brand could position a summer product launch. Built entirely with AI-assisted visuals and motion for concept demonstration.',
      tags: ['AI Video', 'Product Launch', 'Storytelling'],
    },
    {
      icon: '👟', title: 'Stride — Footwear Ad Concept', label: 'Spec Advertisement',
      desc: 'A short-form vertical ad concept designed for Meta placements, focused on movement, texture, and rhythm to demonstrate a high-converting creative structure.',
      tags: ['Meta Ads', 'Motion Graphics', 'Vertical Format'],
    },
    {
      icon: '⌚', title: 'Aurum — Luxury Watch Concept', label: 'Independent Creative Concept',
      desc: 'A slow, premium-feeling cinematic concept exploring luxury advertisement pacing, lighting, and typography — built as a personal exercise in high-end commercial direction.',
      tags: ['Luxury', 'Cinematic', 'AI Commercial'],
    },
    {
      icon: '📱', title: 'Nimbus — Tech Product Reveal', label: 'Spec Advertisement',
      desc: 'A clean, Apple-inspired product reveal concept demonstrating minimal motion design and confident brand pacing for a fictional tech product.',
      tags: ['Product Reveal', 'Minimal', 'Brand Campaign'],
    },
  ],

  /* ── Why work with me ───────────────────────────────────── */
  whyWorkWithMe: [
    { icon: '⚡', title: 'Fast & Reliable',       desc: 'Clear communication, realistic timelines, and dependable delivery on every project.' },
    { icon: '🎯', title: 'Detail-Oriented',       desc: 'Every pixel, prompt, and line of copy is considered — nothing is left to chance.' },
    { icon: '🧩', title: 'Full-Stack Creative',   desc: 'Development, design, and advertising under one roof — no need to juggle multiple freelancers.' },
    { icon: '🚀', title: 'Future-Focused',        desc: 'Constantly learning the newest AI and web tools to keep client work ahead of the curve.' },
    { icon: '💬', title: 'Honest Collaboration',  desc: 'Transparent about scope, cost, and what\'s realistically achievable — no overselling.' },
    { icon: '🌱', title: 'Growth Mindset',        desc: 'Early in a software engineering journey, but building real, usable, production-quality work today.' },
  ],

  /* ── Creative process ───────────────────────────────────── */
  process: [
    { step: '01', title: 'Discover',   desc: 'Understand the brand, audience, and goal behind the project before touching a single pixel.' },
    { step: '02', title: 'Concept',    desc: 'Sketch ideas, moodboards, and creative directions — narrowing down to the strongest angle.' },
    { step: '03', title: 'Design & Build', desc: 'Execute the chosen direction — whether that\'s code, design, or an AI-assisted advertisement.' },
    { step: '04', title: 'Refine',     desc: 'Iterate based on feedback, polish details, and stress-test across devices and formats.' },
    { step: '05', title: 'Deliver',    desc: 'Hand off production-ready files, source assets, and clear documentation.' },
  ],

  /* ── Creative tools ──────────────────────────────────────── */
  tools: [
    { name: 'VS Code' }, { name: 'Figma' }, { name: 'Photoshop' }, { name: 'Illustrator' },
    { name: 'Premiere Pro' }, { name: 'CapCut' }, { name: 'Canva' },
    { name: 'Midjourney' }, { name: 'Runway' }, { name: 'ChatGPT' }, { name: 'Claude' },
    { name: 'Git & GitHub' }, { name: 'Netlify' }, { name: 'Google Workspace' },
  ],

  /* ── Future vision ───────────────────────────────────────── */
  futureVision: [
    { icon: '🎓', title: 'Software Engineering Degree', desc: 'Pursuing a Bachelor\'s in Software Engineering to deepen technical foundations in systems, algorithms, and scalable architecture.' },
    { icon: '🤝', title: 'Agency-Level Creative Work',   desc: 'Growing this practice into a small creative studio blending web development with commercial advertising.' },
    { icon: '🌍', title: 'Global Client Base',           desc: 'Expanding beyond Nepal to collaborate with international brands and businesses.' },
    { icon: '🧪', title: 'AI-Native Production',         desc: 'Going deeper into AI video, prompt engineering, and automated creative pipelines.' },
  ],

  /* ── FAQ ─────────────────────────────────────────────────── */
  faq: [
    { q: 'What services do you offer?', a: 'Website development (landing pages, portfolios, business sites), graphic design (posters, brochures, banners, business cards), social media creatives, and AI-assisted commercial advertisements and product videos.' },
    { q: 'Are the advertisement concepts on this site real client work?', a: 'No — the commercial advertisement showcase features independently created spec concepts built to demonstrate advertising ideas and storytelling skills. They are not affiliated with, endorsed by, or created for the brands referenced, and no official partnership is implied.' },
    { q: 'Do you work with international clients?', a: 'Yes. Work is delivered remotely, and communication happens over email or your preferred messaging platform regardless of location.' },
    { q: 'What is your typical turnaround time?', a: 'It depends on project scope — a simple graphic can take about 3-4 hours , while a full website or ad campaign concept may take one to three days. Timelines are always agreed on before starting.' },
    { q: 'Can you help with both design and development?', a: 'Yes — that is the core strength of this practice: handling design, development, and creative advertising direction together instead of splitting the work across multiple people.' },
    { q: 'How do we get started?', a: 'Reach out through the contact form or email with a short brief of what you need. A response typically comes within 24 hours.' },
  ],

  /* ── Social proof placeholders (ready for real testimonials) ── */
  testimonialsPlaceholder: true,

  projects: [
    {
      icon: '🎓',
      title: 'EduNepal Platform',
      desc: 'SEO-optimised educational website for Nepali students (XI/XII) with CDC-aligned chapter navigation, dark mode, and passive income strategy.',
      tech: ['HTML', 'CSS', 'JavaScript', 'SEO'],
      demo: '#',
      github: '#',
      detail: 'A mobile-first educational platform targeting Nepali students. Features include subject → grade → chapter navigation based on Nepal CDC curriculum, dark mode toggle, and SEO-optimized structure to generate organic traffic and passive income.',
    },
    {
      icon: '🪪',
      title: 'LEXIS AI',
      desc: 'An AI-powered student helper that understands the Nepal curriculum and provides interactive learning and practice tools.',
      tech: ['HTML', 'CSS', 'JavaScript', 'API', 'Database'],
      demo: 'https://lexis-np.netlify.app/',
      github: '#',
      detail: 'Developed a complete student helper AI to understand the curriculum of Nepal and provide students with a platform to learn and practice their skills.',
    },
    {
      icon: '🎨',
      title: 'Brand Identity Projects',
      desc: 'Logo design, social media graphics, and UI mockups for local businesses and personal brands in Nepal.',
      tech: ['Figma', 'Photoshop', 'Illustrator'],
      demo: '#',
      github: '#',
      detail: 'Designed cohesive brand identities for multiple clients — including logos, color systems, social media templates, and print assets. Focused on clean modern aesthetics tailored to Nepali market expectations.',
    },
    {
      icon: '🤖',
      title: 'Python Automation Scripts',
      desc: 'Collection of productivity scripts: file organiser, web scraper, PDF merger, and scheduled task runner.',
      tech: ['Python', 'BeautifulSoup', 'PyPDF2'],
      demo: '#',
      github: '#',
      detail: 'A personal toolkit of Python scripts for everyday automation — bulk file renaming, structured web scraping, PDF merging and splitting, and cron-based task scheduling. Saved hours of manual work weekly.',
    },
    {
      icon: '🌐',
      title: 'Personal Portfolio v3',
      desc: 'This very site — built from scratch with vanilla JS, modular CSS, dark mode, search, and Firebase-ready login.',
      tech: ['HTML', 'CSS', 'JS', 'Firebase'],
      demo: 'https://sworupdev.netlify.app',
      github: '#',
      detail: 'Designed and built entirely from scratch without frameworks. Features include a particle canvas hero, dark mode, Ctrl+K search, gallery with photo controls, blog modal, Formspree contact form, and a Firebase-ready Google login architecture.',
    },
  ],

  blog: [
    {
      cat:     'Coding',
      catColor:'rgba(59,130,246,.1)',
      catText: '#3b82f6',
      read:    '4 min read',
      title:   'Why Every Student Should Learn to Code (Even if They\'re Not in CS)',
      snippet: 'Coding isn\'t just for computer science students. It\'s a universal problem-solving toolkit that makes you more valuable in any field.',
      date:    'April 2026',
      body: [
        'When I started programming in Grade 10, I wasn\'t sure it was "my thing". I was studying PCM, not CS. But the moment I wrote my first script that automated a tedious task, I understood — coding is just logical thinking expressed in a language computers understand.',
        'Whether you\'re in biology, commerce, or arts — the ability to automate, analyse, and build gives you a massive edge. A biology student who can write Python to analyse data is worth twice as much as one who can\'t.',
        'Start with Python. It reads almost like English. Solve small real-world problems. The skill compounds faster than almost anything else you can learn in your teens.',
      ],
      tags: ['Python', 'Students', 'Learning', 'Nepal'],
    },
    {
      cat:     'Design',
      catColor:'rgba(139,92,246,.1)',
      catText: '#8b5cf6',
      read:    '3 min read',
      title:   'The 3 Design Principles That Changed How I Build Websites',
      snippet: 'Good design isn\'t decoration — it\'s clarity. These three principles transformed my approach from "looks nice" to "actually works".',
      date:    'March 2026',
      body: [
        'I used to think design was about making things look pretty. Then I started studying real products and noticed something: the best designs are barely noticed. They just work.',
        'Principle 1: Hierarchy. Every screen has one most important thing. Everything else supports it. Stop competing with yourself.',
        'Principle 2: Whitespace is content. Empty space isn\'t wasted — it\'s breathing room that makes the important things pop.',
        'Principle 3: Consistency builds trust. When your buttons, fonts, and spacing follow a system, users feel safe. Inconsistency creates cognitive friction — even when users can\'t explain why something feels off.',
      ],
      tags: ['Design', 'UI/UX', 'CSS', 'Web'],
    },
    {
      cat:     'Life',
      catColor:'rgba(34,197,94,.1)',
      catText: '#16a34a',
      read:    '5 min read',
      title:   'Building Passive Income as a Student: What I\'ve Learned So Far',
      snippet: 'You don\'t need to wait until you\'re employed to start building income streams. Here\'s my honest experience as a 16-year-old in Nepal.',
      date:    'February 2026',
      body: [
        'I\'ll be honest — when I first heard "passive income", I thought it was a scam. But then I realised: a well-built website that ranks on Google earns money while you sleep. That\'s just math.',
        'My approach: build things that have compounding value. An educational website, a YouTube channel, a small design portfolio. None of them pay instantly, but each one grows.',
        'The hardest part isn\'t the technical work — it\'s staying consistent when results don\'t come immediately. In Nepal, where opportunities feel limited, building digital assets is one of the most accessible paths to financial independence.',
        'Start before you\'re ready. Ship something small. The perfect plan never executed is worth nothing.',
      ],
      tags: ['Nepal', 'Income', 'Student', 'Mindset'],
    },
    {
      cat:     'Tech',
      catColor:'rgba(251,146,60,.1)',
      catText: '#ea580c',
      read:    '3 min read',
      title:   'RFID + Arduino: What I Built and What I Learned',
      snippet: 'How I combined hardware and software to solve a real school problem — and the unexpected lessons it taught me about engineering.',
      date:    'January 2026',
      body: [
        'School attendance in Nepal is still tracked with paper registers. I thought: this is exactly the kind of problem technology should solve.',
        'Using an RFID reader, Arduino Uno, and a Python backend, I built a system that logs attendance automatically when a student taps their card. The data feeds into a CSV, and a simple dashboard shows who\'s present.',
        'The technical lessons were great — serial communication, event loops, data persistence. But the real lesson was simpler: the best projects solve a problem you actually care about.',
      ],
      tags: ['Arduino', 'Python', 'RFID', 'Hardware'],
    },
  ],

};