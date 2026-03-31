# Scribe (FreelancerOS)

**Scribe** is a product for **freelancers** who want to write professional **outreach and follow-up emails**—clear, personal, and repeatable—instead of starting from scratch every time.

The repository is named **FreelancerOS** internally; the visible brand in the app is **Scribe**.

---

## What it is

Scribe is aimed at self-employed people who want to handle **prospecting, follow-ups, and replies** in their day-to-day work. The idea is a single workspace with a **landing page**, a **dashboard** (planned/expanding), **profile & writing style**, **contacts**, and **tools for cold outreach, follow-ups, and replies**—including a **draft history** so nothing gets lost.

There is also a **waitlist** for people who want early access or updates.

---

## How it works (concept)

1. **Landing**  
   Visitors see what the product does and can join the waitlist or try the app (depending on how far development has progressed).

2. **Account (planned / in progress)**  
   Sign-in via a hosted auth and data layer so settings and content can be used **across devices and sessions**.

3. **Dashboard**  
   Overview with key metrics and recent activity, navigation to areas like profile, writing style, contacts, and email tools.

4. **Writing & organizing**  
   Drafts for different email types (e.g. first contact, follow-up, replies) are stored and findable in a history. Contacts and preferences should keep copy **consistent and personal**.

5. **Later: intelligent assistance**  
   The long-term plan is **AI-assisted suggestions** for wording—clearly separated from what you write and save yourself.

---

## Where things stand (no technical detail)

- **UI and flows** for landing and dashboard are in place and designed (navigation, sections, local storage of drafts and settings for testing).
- **Waitlist, real database wiring, and production-ready auth** are on the roadmap—not everything is “live” yet in a finished SaaS sense.
- Development is **iterative**: solid foundations first (environment, data, accounts), then deeper features and optional AI.

---

## Plans & roadmap (direction)

**Near term**

- Capture and manage the waitlist reliably.
- Configure environment and backend so auth and storage are **actually** usable (not demo-only).
- Landing: clear paths—e.g. sign in, try the app, join the waitlist—without dead ends.

**Mid term**

- Tie the dashboard to **real user accounts** (show the right email, clean sign-out).
- Sync drafts, contacts, and profile **server-side** where it makes sense, not only in the browser.

**Long term**

- **AI support** for copy suggestions (rolled out carefully, with clear boundaries and transparency).
- Optional integrations (e.g. shop or CRM), depending on product focus—prioritized as needed.

---

## Who it’s for

- Freelancers and small service businesses doing **active outreach**.
- Anyone who wants to spend **less time wording** and **more time in conversation** with clients.
- Individuals or teams who value **repeatability** (tone, templates, history).

---

## Philosophy

- **Professional** but human—mass robotic mail is not the goal.
- **Transparency**: you know what runs automatically and what you save yourself.
- **Step by step**: a stable product first, then smarter layers on top.

---

## License & use

The project is set up as **private** (`private` in package metadata). There is **no** public open-source license; use and sharing follow your own rules.

---

## Contact & contribution

If you use or extend this repo, **issues and short descriptions** help more than huge specs—focus on **what should change for whom**.

*This README describes product vision, roadmap, and status—not implementation details.*
