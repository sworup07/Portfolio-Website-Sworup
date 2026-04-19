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
      title: 'RFID Attendance System',
      desc: 'Hardware + software solution for automating school attendance using RFID cards, Arduino, and a Python dashboard.',
      tech: ['Python', 'Arduino', 'RFID', 'CSV'],
      demo: '#',
      github: '#',
      detail: 'Built a full RFID-based attendance system combining Arduino hardware with a Python backend that logs attendance, generates reports, and displays real-time dashboards. Deployed in a school environment.',
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