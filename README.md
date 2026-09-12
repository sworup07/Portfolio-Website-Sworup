# Sworup Pokhrel — Portfolio

**Web Developer · Creative Designer · AI Commercial Creator**

A modern, responsive personal portfolio showcasing my projects, skills, and journey as a Computer Science student — built with a focus on clean UI, performance, and user experience.

🔗 Live site: [sworupdev.netlify.app](https://sworupdev.netlify.app)

---

## What's inside

- **Hero, About & Journey timeline** — background, skills, and milestones
- **Services & Expertise** — what I offer
- **Gallery** — photo showcase with like/comment interactions
- **Portfolio** — selected projects
- **Commercial Advertising** — AI-assisted spec ad concepts
- **Blog** — written posts/insights
- **Testimonials** — Google-verified feedback wall
- **FAQ & Contact** — with a working contact form

## Tech stack

| Layer | Technology |
|---|---|
| Structure | Static HTML |
| Styling | Vanilla CSS (`style.css`) |
| Interactivity | Vanilla JavaScript (modular, see `js/`) |
| Auth | Supabase (Google sign-in) |
| Contact form | Formspree |
| Hosting | Netlify |

## Project structure

```
index.html          # Single-page site — all sections
style.css            # All styling
js/
  utils.js           # Shared helpers
  data.js             # Content data (projects, blog posts, services, etc.)
  render.js           # Renders data-driven sections into the DOM
  carousel.js          # Carousel/scroll behavior for grids
  search.js             # Site-wide Ctrl+K search
  ui.js                  # General UI interactions (modals, menus, toasts)
  auth.js                 # Supabase Google sign-in
  script.js                # Entry point — wires everything together
images/              # Photos, avatars, OG image
sitemap.xml           # SEO sitemap
```

Keep `index.html`, `style.css`, `js/`, and `images/` in the same directory — the HTML references them as relative paths.

## Running locally

No build step required — it's a static site.

```bash
git clone https://github.com/sworup07/Portfolio-Website-Sworup.git
cd Portfolio-Website-Sworup
```

Then just open `index.html` in a browser, or serve it locally:

```bash
npx serve .
```

## Notes on the integrations

- **Contact form** posts to Formspree — the form ID in `index.html` is a public endpoint identifier, not a secret.
- **Supabase auth** uses the public `anon` key by design (never the `service_role` key). Any data the signed-in features touch (likes, comments, testimonials) should be protected by Supabase Row Level Security policies on the backend, not by keeping the key secret.

## License

MIT — see [LICENSE](./LICENSE).
