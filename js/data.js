/* ============================================================
   data.js — ALL DATA
   Projects, Skills, Constants, and Blog Posts.

   HOW TO ADD A NEW BLOG POST IN THE FUTURE:
   1. Copy the DRAFT TEMPLATE at the bottom of blogPosts
   2. Paste it at the TOP of the blogPosts array (newest first)
   3. Fill in every field — especially slug, tags, and content
   4. Set published: true when ready — false keeps it hidden
   5. Done — it automatically appears on your site

   SEO TIPS FOR EACH POST:
   - slug:            use lowercase-words-with-hyphens (becomes the URL)
   - title:           include your main keyword naturally
   - metaDescription: 150-160 characters shown in Google previews
   - tags:            3-6 specific keywords Google can index
   - content:         write at least 300 words for Google to rank it
   ============================================================ */


/* ========================= CONSTANTS ========================= */
const CARD_WIDTH    = 320;  // matches .project-card width in CSS
const AUTO_SLIDE_MS = 4000; // blog carousel auto-scroll interval in ms


/* ========================= BLOG CATEGORIES ========================= */

const blogCategories = [
  { id: "career",       label: "Career",       color: "#3b82f6" },
  { id: "project",      label: "Project",      color: "#8b5cf6" },
  { id: "tutorial",     label: "Tutorial",     color: "#22c55e" },
  { id: "productivity", label: "Productivity", color: "#f59e0b" },
  { id: "insights",     label: "Insights",     color: "#ef4444" },
  { id: "technology",   label: "Technology",   color: "#06b6d4" },
];


/* ========================= BLOG POSTS ========================= */

const blogPosts = [

  /* ── POST 1 : Beware the Hype Chasers────────────────────────────────────────────── */
  {
    id:              1,
    slug:            "beware-the-hype-chasers",
    category:        "career",
    title:           "Beware the Hype Chasers",
    metaDescription: "Why chasing every tech trend is a trap — and how to find real, lasting opportunities in software engineering as a student.",
    snippet:         "Every week there's a new 'must-learn' technology. But chasing hype is a trap. Here's how to think clearly about where the real opportunities are.",
    content: `
      Every few months, the tech world gets excited about something new.
      One week it's a new JavaScript framework. The next it's a new AI tool,
      a new blockchain project, or a new language that promises to replace everything.

      And if you are a student, this noise is dangerous. When you are still
      building your foundation, jumping from trend to trend means you never
      go deep on anything. You end up knowing a little about many things,
      but mastering nothing.

      The hype chasers are everywhere. You see them on social media posting
      about every new tool, every new library, every new game changer.
      They look productive. But most of them are not building anything real.
      They are just consuming content about building things.

      The real opportunities are always in the fundamentals. Companies
      desperately need people who understand data structures, who can write
      clean readable code, who can debug methodically, who can communicate
      technical ideas clearly. These skills never go out of style.

      My advice: pick one path and go deep. If you are learning web development,
      master HTML, CSS, and JavaScript before touching any framework. If you
      are learning Python, build real projects before jumping to machine learning.
      Depth always beats breadth at the beginning.

      The filter I use when I see a new trend: will this still matter in five years?
      If yes, it is worth learning. If maybe, wait. If no, ignore it completely.

      Build your foundation. Stay curious but stay focused.
      The opportunities will come to you — you do not need to chase them.
    `,
    tags:      ["career advice", "student developer", "learning", "focus", "software engineering"],
    date:      "January 5, 2025",
    readTime:  "5 min read",
    featured:  false,
    published: true,
  },

  /* ── POST 2 : How I Prepare for Coding Competitions──────────────────────────────────────────── */
  {
    id:              2,
    slug:            "how-i-prepare-for-coding-competitions",
    category:        "career",
    title:           "How I Prepare for Coding Competitions",
    metaDescription: "My personal preparation strategy for coding competitions — from problem-solving patterns to time management during contests.",
    snippet:         "Coding competitions taught me more about problem-solving than any course. Here is my full preparation approach — from daily practice to contest-day strategy.",
    content: `
      Hey there! I'm Sworup. I started taking coding competitions seriously about a year ago.
      Before that, I would solve a few random problems and wonder why I never
      improved. The missing ingredient was structure.

      Here is exactly how I prepare now.

      First, I focus on patterns, not problems. There are a limited number of
      problem-solving patterns in competitive programming — two pointers,
      sliding window, binary search, dynamic programming, graph traversal.
      Once you recognize the pattern, the solution becomes much clearer.
      I spend one week on each pattern, solving five to ten problems of
      increasing difficulty.

      Second, I practice under time pressure. Solving a problem in three hours
      at home is very different from solving it in thirty minutes during a contest.
      I set a timer every time I practice. If I cannot solve a problem within
      forty-five minutes, I stop, read the editorial, understand the solution
      completely, and then implement it from scratch without looking.

      Third, I review my mistakes immediately. After every contest, I go through
      every problem I could not solve. I do not move on until I fully understand
      why my approach was wrong.

      Fourth, I keep a personal error log. I write down every type of mistake I
      make — off-by-one errors, forgetting edge cases, wrong data types — and
      review this log before every contest.

      If you are just starting, begin with easy problems on LeetCode or Codeforces.
      Consistency over two months will beat cramming every time.
    `,
    tags:      ["coding competition", "problem solving", "algorithms", "leetcode", "student"],
    date:      "April 7, 2026",
    readTime:  "5 min read",
    featured:  true,
    published: true,
  },

  /* ── POST 3 : Building My Portfolio Website from Scratch─────────────────────────────────────────── */
  {
    id:              3,
    slug:            "building-my-portfolio-website-from-scratch",
    category:        "project",
    title:           "Sworup's Building HIS Portfolio Website from Scratch",
    metaDescription: "A complete walkthrough of how I built my responsive, SEO-friendly portfolio website using only HTML, CSS, and JavaScript — no frameworks.",
    snippet:         "No frameworks, no templates. I built my portfolio from scratch to understand every line of code. Here is what I learned along the way.",
    content: `
      Hey there! I'm Sworup. When I decided to build my portfolio website, I had a choice.
      I could use a template, a website builder, or a framework that would
      get me a working site in an hour. Instead, I chose to start from a
      blank HTML file. That decision taught me more than any course I have taken.

      The first challenge was structure. I needed to think about what a visitor
      actually cares about. They want to know who I am, what I can build, and
      how to reach me. So I designed the sections in that order:
      Home, About, Portfolio, Blog, Contact.

      The second challenge was CSS. Writing it from scratch forces you to
      understand every property you use. I learned about CSS variables, which
      let me build a full dark mode system with just a few lines. I learned
      about flexbox and grid properly, not just copying code I did not understand.

      The third challenge was JavaScript. I needed a carousel, a gallery with
      a lightbox, form validation, smooth scrolling, and particle animations.
      Building each feature from scratch was slow, but I now understand
      exactly how each one works.

      The most valuable lesson was about performance. I learned to load fonts
      asynchronously, write efficient CSS, and avoid unnecessary JavaScript.

      If you are a student considering building your own portfolio:
      do not use a template. The struggle of building it yourself is the learning.
      And when someone asks how it works in an interview, you will have a real answer.
    `,
    tags:      ["portfolio", "html css javascript", "web development", "responsive design", "beginner project"],
    date:      "March 25, 2026",
    readTime:  "6 min read",
    featured:  true,
    published: true,
  },

  /* ── POST 4 : Top 5 Python Tricks for Beginners────────────────────────────────────────────── */
  {
    id:              4,
    slug:            "top-5-python-tricks-for-beginners",
    category:        "tutorial",
    title:           "Top 5 Python Tricks for Beginners",
    metaDescription: "Five practical Python techniques every beginner should know — from list comprehensions to f-strings — with real code examples.",
    snippet:         "These five Python techniques changed how I write code. They are simple, practical, and once you know them you will use them every single day.",
    content: `
      Hey there! I'm Sworup. When I started learning Python, I wrote code the long way.
      Loops that could be one line. String formatting that was messy.
      Code that worked but felt clumsy. These five tricks changed that.

      Trick 1 — List Comprehensions.
      Instead of a for loop to build a list, write it in one line.
      Example: squares = [x**2 for x in range(10)]
      This is faster to write, faster to read, and actually runs faster too.

      Trick 2 — F-strings for String Formatting.
      Instead of "Hello " + name + ", you are " + str(age) + " years old"
      write: f"Hello {name}, you are {age} years old"
      F-strings are cleaner, safer, and support expressions directly.

      Trick 3 — Enumerate Instead of Range.
      When you need both the index and the value in a loop, use enumerate.
      Example: for index, value in enumerate(my_list)
      Cleaner than manually tracking a counter variable.

      Trick 4 — The Ternary Operator.
      Instead of a full if-else block for a simple condition, write:
      result = "even" if number % 2 == 0 else "odd"

      Trick 5 — Zip for Parallel Loops.
      When looping through two lists at the same time:
      for name, score in zip(names, scores)
      No index tracking needed.

      These tricks will not make you an expert overnight, but they will
      make your code cleaner and more Pythonic. And clean code is a habit
      worth building early.
    `,
    tags:      ["python", "beginner", "programming tips", "code tricks", "tutorial"],
    date:      "April 1, 2026",
    readTime:  "4 min read",
    featured:  false,
    published: true,
  },

  /* ── POST 5 : Managing Studies and Coding as a Student────────────────────────────────────────────── */
  {
    id:              5,
    slug:            "managing-studies-and-coding-as-a-student",
    category:        "productivity",
    title:           "Managing Studies and Coding as a Student",
    metaDescription: "How I balance Grade 12 PCM and Computer Science with coding projects, self-learning, and building a portfolio — without burning out.",
    snippet:         "Balancing school, coding, and self-learning is hard. Here is the exact workflow I use to stay consistent without burning out.",
    content: `
     Hey there! I'm Sworup. Being a Grade 12 PCM and Computer Science student while also trying to
      build real projects, maintain a portfolio, and keep up with self-learning
      is a genuine challenge. I have failed at this balance many times.

      Here is what finally worked for me.

      The first thing I did was stop trying to do everything every day.
      I organized my week by type of work. Mondays and Tuesdays are for
      school subjects — focused study, solving past papers, reviewing notes.
      Wednesdays and Thursdays are for coding — working on projects, building
      features, fixing bugs. Fridays are flexible — used for whatever needs
      the most attention that week.

      The second thing that helped was time-boxing. I set a timer for ninety
      minutes and work on only one thing during that time. No switching tabs,
      no checking notifications. When the timer ends, I take a fifteen minute break.
      This dramatically increased how much I get done.

      The third thing was accepting that progress is not always visible.
      Some weeks I write a lot of code. Other weeks I barely touch a project
      because exams are coming. That is okay. Consistency over months matters
      more than intensity in a single week.

      The most important mindset shift: I stopped treating school and coding
      as competing priorities. My PCM studies make me a better programmer —
      physics improves my logical thinking, mathematics improves my algorithm
      intuition. Everything is connected.

      Start with one small commitment: thirty minutes of coding per day,
      five days a week. Build the habit before you build the hours.
    `,
    tags:      ["productivity", "student life", "time management", "study tips", "coding habits"],
    date:      "March 30, 2026",
    readTime:  "3 min read",
    featured:  false,
    published: true,
  },

  /* ── POST 6 : Why Web Development Skills Are in High Demand───────────────────────────────────────── */
  {
    id:              6,
    slug:            "why-web-development-skills-are-in-high-demand",
    category:        "insights",
    title:           "Why Web Development Skills Are in High Demand",
    metaDescription: "An honest look at why web development remains one of the most in-demand skills globally — and what it means for students in Nepal and Asia.",
    snippet:         "Web development is not just a trend — it is infrastructure. Here is why these skills will remain valuable for the next decade, especially for students in Nepal.",
    content: `
      Hey there! I'm Sworup. Every business, every organization, every individual with something to
      share eventually needs a presence on the web. This is not going to change.
      If anything, it is accelerating.

      Web development skills sit at the intersection of creativity and logic.
      You build things that real people use. You can see the result of your
      work immediately. You can deploy something today and have someone in
      another country using it tomorrow. Very few skills offer that feedback loop.

      For students in Nepal specifically, web development opens doors that
      other technical skills do not. You can work remotely for international
      clients. You can build products for the local market that solve real problems.
      You can freelance while still studying. The geographic barrier that exists
      in many industries almost disappears with web skills.

      The demand is also remarkably consistent. While some technical roles
      fluctuate with industry trends, web developers are needed everywhere —
      in startups, corporations, government, NGOs, and schools.

      What makes web development particularly powerful now is the combination
      with other skills. A developer who understands design is more valuable.
      One who understands SEO is more valuable. One who works with APIs and
      databases is significantly more valuable.

      The barrier to entry is lower than almost any other technical field.
      You need a laptop, an internet connection, and consistency.
      The learning resources are free. The tools are free.
      The only real investment is time.

      If you are a student wondering whether to pursue web development seriously:
      start with the fundamentals, build real things, and share your work publicly.
      Opportunities will follow.
    `,
    tags:      ["web development", "career", "nepal tech", "freelancing", "student opportunities"],
    date:      "April 3, 2026",
    readTime:  "5 min read",
    featured:  false,
    published: true,
  },


];


/* ========================= SKILLS ========================= */
const skills = [
  { name: "⌨️ Programming (Python, Java, C++)", level: 90 },
  { name: "🌐 Web Development",                 level: 87 },
  { name: "🔌 IoT & Automation / Electronics",  level: 77 },
  { name: "🎨 Graphic Design / Web Design",     level: 74 },
  { name: "🎤 Public Speaking",                 level: 69 },
  { name: "🤖 AI / ML Basics",                  level: 65 },
  { name: "📊 Data Analysis",                   level: 60 },
];


/* ========================= PROJECTS ========================= */
const projects = [
  { id: 1, icon: "💻", title: "Portfolio Website",        desc: "A modern personal portfolio website.",    details: "Built using HTML, CSS, JS with responsive design.",                        tech: ["HTML", "CSS", "JavaScript"],       demo: "#", github: "#" },
  { id: 2, icon: "📱", title: "News App Design",        desc: "UI/UX for a productivity mobile app.",    details: "Designed clean UI for a mobile task manager app.",                        tech: ["Figma", "Adobe XD"],               demo: "#", github: "#" },
  { id: 3, icon: "🛒", title: "E-Commerce Platform",      desc: "Frontend for an online store.",           details: "Implemented responsive e-commerce website with cart functionality.",       tech: ["HTML", "CSS", "JS", "React"],      demo: "#", github: "#" },
  { id: 4, icon: "🎨", title: "Graphic Design Portfolio", desc: "Collection of graphic works.",            details: "Showcased branding, poster, and illustration work.",                      tech: ["Photoshop", "Illustrator"],        demo: "#", github: "#" },
  { id: 5, icon: "🌐", title: "Web App Dashboard",        desc: "Admin dashboard UI for analytics.",       details: "Built interactive charts and widgets for admin panel.",                   tech: ["HTML", "CSS", "JS", "Chart.js"],   demo: "#", github: "#" },
  { id: 6, icon: "🤖", title: "AI Chatbot",               desc: "Web AI chatbot interface.",               details: "Created a chatbot interface integrated with AI responses.",               tech: ["HTML", "CSS", "JS", "OpenAI API"], demo: "#", github: "#" },
];