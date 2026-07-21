export type FocusStatus = 'live' | 'almost' | 'shipped'
export type Completeness = 'Shipped' | 'MVP' | 'Prototype' | 'Idea'
export type MonetizationStatus = 'Live' | 'Ready' | 'Potential' | 'None'

export type FocusProject = {
  id: string
  name: string
  description: string
  status: FocusStatus
  statusLabel: string
  completeness: Completeness
  monetizationStatus: MonetizationStatus
  monetization: string
  buyer: string
  techStack: string[]
  nextAction: string
  revenueTarget: string
  revenueValue: number
  effortToFirstDollar: string
  deployed: boolean
  url?: string
  features?: string[]
  pricing?: { name: string; price: string; note?: string }[]
}

export type ParkedProject = {
  id: string
  name: string
  description: string
  status: string
  completeness: Completeness
  monetizationStatus: MonetizationStatus
  buyer: string
  techStack: string[]
  block: string
  effortToFirstDollar: string
  isNote?: boolean
  features?: string[]
}

export type KilledProject = {
  id: string
  name: string
  reason: string
  action: 'kill' | 'merge'
}

export type ClientProject = {
  id: string
  name: string
  description: string
  status: 'active' | 'delivered' | 'prospect'
  value?: string
}

export type TimelinePhase = {
  id: string
  range: string
  label: string
  detail: string
  tasks: string[]
}

// ─── FOCUS PROJECTS ─────────────────────────────────────────────────────────

export const focusProjects: FocusProject[] = [
  {
    id: 'duelly',
    name: 'Duelly',
    description: 'AI search visibility platform — tells businesses if ChatGPT, Gemini, and Perplexity recommend them. Scores SEO/AEO/GEO and gives platform-specific fix instructions.',
    status: 'live',
    statusLabel: 'Live',
    completeness: 'MVP',
    monetizationStatus: 'Live',
    monetization: 'SaaS credits (one-time packs)',
    buyer: 'Small business owners, SEO-curious entrepreneurs, digital agencies',
    techStack: ['Next.js 16', 'Supabase', 'Stripe', 'Gemini 2.5 Flash', 'Vercel', 'Playwright', 'Lighthouse', 'Moz API', 'Resend'],
    nextAction: 'Market it — content + cold outreach to agencies',
    revenueTarget: '$800 from 10 Launch Packs',
    revenueValue: 800,
    effortToFirstDollar: '0 — already accepting payments',
    deployed: true,
    features: [
      'AI Visibility Check (free — queries Google, ChatGPT, Gemini, Perplexity)',
      'Pro Audit (10 credits — deep single-page AI analysis with fix instructions)',
      'Deep Scan (30 credits — 5-page crawl with sitewide intelligence)',
      'Competitor Duel (10 credits — head-to-head comparison with backlink data)',
      'Keyword Arena (10 credits — score all top-ranking sites for a keyword)',
      'Platform detection (WordPress, Shopify, Wix, Squarespace, etc.)',
      'Downloadable PDF reports',
      'Auto-generated schema markup',
      'Supabase auth with credit tracking',
      'Stripe checkout + webhook + credit system',
      'Referral bonus system',
      'Daily data retention cron (Vercel)',
      'Blog with SEO content',
    ],
    pricing: [
      { name: 'AI Launch Pack', price: '$79.99', note: '180 credits — most popular' },
      { name: 'Visibility Growth Bundle', price: '$149.99', note: '550 credits — best value' },
      { name: 'Authority Agency Suite', price: '$299.99', note: '1,450 credits — for agencies' },
    ],
  },
  {
    id: 'marketmojo',
    name: 'MarketMojo',
    description: 'Lead generation / prospecting tool for web agencies — search any area, find local businesses, audit their sites with AI, generate branded PDF reports, draft outreach emails.',
    status: 'live',
    statusLabel: 'Live',
    completeness: 'MVP',
    monetizationStatus: 'Live',
    monetization: 'Subscription ($30/$95/$225/mo)',
    buyer: 'Web design agencies, SEO freelancers, digital marketing consultants',
    techStack: ['Next.js 16', 'Supabase', 'Stripe', 'Google Generative AI', 'Google Places API', 'Cheerio', 'React PDF', 'Moz API', 'Vercel'],
    nextAction: 'Test checkout end-to-end, then market to agencies',
    revenueTarget: '$475/mo from 5 Pro subscribers',
    revenueValue: 475,
    effortToFirstDollar: 'Days — Stripe just wired, needs testing',
    deployed: true,
    features: [
      'Local business search by city + category (Google Places)',
      'AI-powered site analysis (SEO score, AI visibility, design quality)',
      'Google Business Profile audit (completeness, missing fields, reviews)',
      'Email finder (auto-discovers business owner emails)',
      'AI email drafting (personalized cold outreach)',
      'Branded PDF report generation (white-labeled with your logo)',
      'Batch scanning (analyze 20+ businesses in one click)',
      'Pipeline tracking (tag, dismiss, add notes)',
      'Chain filtering (hides franchises, shows local businesses)',
      'Priority lead marking',
      'Supabase auth with credit system',
      'Stripe subscriptions (Starter/Pro/Agency)',
    ],
    pricing: [
      { name: 'Starter', price: '$30/mo', note: '30 scans — $1/scan' },
      { name: 'Pro', price: '$95/mo', note: '100 scans + AI emails + batch scanning' },
      { name: 'Agency', price: '$225/mo', note: '250 scans + white-label + priority support' },
    ],
  },
  {
    id: 'fundylaunch',
    name: 'FundyLaunch',
    description: 'Local web agency marketing site — sells websites, SEO, and AI search optimization packages to contractors and local businesses across Atlantic Canada.',
    status: 'shipped',
    statusLabel: 'Shipped',
    completeness: 'Shipped',
    monetizationStatus: 'Ready',
    monetization: 'Service invoicing ($3.5K–$5.5K per project)',
    buyer: 'Local contractors, plumbers, roofers, small businesses in Atlantic Canada',
    techStack: ['Next.js 16', 'AI SDK', 'Resend', 'Vercel'],
    nextAction: 'Prospect 10 warm leads using MarketMojo',
    revenueTarget: '$3,500 from 1 client',
    revenueValue: 3500,
    effortToFirstDollar: 'Days — site is ready, needs outbound sales',
    deployed: true,
    features: [
      'Full marketing site (services, packages, portfolio, testimonials)',
      'AI-powered chatbot for visitor questions',
      'Contact form with email via Resend',
      'Blog for SEO content marketing',
      'Nonprofit discount section',
      'SEO: robots.txt, sitemap.xml, schema markup',
      'Mobile-responsive design',
    ],
    pricing: [
      { name: 'Website Launch', price: '$3,500', note: 'one-time — custom 5-page site + SEO setup' },
      { name: 'Growth Starter', price: '$5,500', note: 'one-time — website + aggressive local SEO' },
      { name: 'Full Growth Partner', price: '$1,500/mo', note: '3-month minimum — complete acquisition system' },
      { name: 'Blog Content Engine', price: '$600/mo', note: 'add-on — 4 SEO posts/month, auto-published' },
    ],
  },
  {
    id: 'fundylogic',
    name: 'FundyLogic',
    description: 'AI studio — builds custom AI chat agents, lead qualifiers, follow-up automation, internal knowledge bots, and full AI-powered SaaS products.',
    status: 'shipped',
    statusLabel: 'Shipped',
    completeness: 'Shipped',
    monetizationStatus: 'Ready',
    monetization: 'Agent: $1.5K-$2.5K setup + $197-$347/mo | SaaS: $10K-$50K projects',
    buyer: 'Small businesses wanting AI agents, founders wanting SaaS built',
    techStack: ['Next.js 16', 'Gemini AI', 'AI SDK', 'Resend', 'Vercel'],
    nextAction: 'Brother runs sales — close first AI agent client',
    revenueTarget: '$1,500 setup + $197/mo from 1 agent client',
    revenueValue: 1697,
    effortToFirstDollar: 'Days — site is live, need first client',
    deployed: true,
    features: [
      'AI Chat Agent offering (customer-facing website widget)',
      'AI Lead Qualifier (intent scoring, hot/warm/cold)',
      'AI Follow-Up Sequences (automated email nurture)',
      'Internal Knowledge Bot (team-facing SOPs/FAQ)',
      'Custom SaaS/product development services',
      'AI integrations & workflow automation',
      'Live demo agent (LOGIC) on the site',
      'Contact form with Resend',
      'Full schema markup + SEO',
    ],
    pricing: [
      { name: 'Starter Agent', price: '$1,500 + $197/mo', note: '1 chat agent, lead capture, monthly tuning' },
      { name: 'Growth Agent', price: '$2,500 + $347/mo', note: 'chat + scoring + emails + internal bot' },
      { name: 'AI MVP', price: '$10K–$25K', note: 'full SaaS product build' },
      { name: 'Full Platform', price: '$25K–$50K', note: 'multi-feature AI product' },
    ],
  },
]

// ─── PARKED PROJECTS ────────────────────────────────────────────────────────

export const parkedProjects: ParkedProject[] = [
  {
    id: 'mindfulmama',
    name: 'MindfulMama',
    description: 'Mental wellness toolkit for overwhelmed mothers — 5-minute assessment maps stress across 5 dimensions, provides matched coping strategies and AI coaching.',
    status: 'MVP',
    completeness: 'MVP',
    monetizationStatus: 'None',
    buyer: 'Overwhelmed mothers (direct-to-consumer)',
    techStack: ['Next.js 16', 'Supabase (planned)', 'localStorage (current)', 'Vercel'],
    block: 'No monetization path — needs premium tier (AI coaching), user accounts, Stripe. Wellness app market is brutal.',
    effortToFirstDollar: 'Weeks',
    features: [
      '15-question assessment with pattern mapping',
      '5-dimension overwhelm visualization',
      'Overwhelm type classification',
      'Matched strategy recommendations',
      'Daily toolkit with morning actions + evening recaps',
      'AI coach (context-aware)',
      'All data in localStorage (no sign-up required)',
    ],
  },
  {
    id: 'routinepro',
    name: 'RoutinePro (DailyHabits)',
    description: 'AI-powered daily routine builder — describe your life, get structured schedules with nutrition tracking, workouts, fasting, hydration, and habit streaks. PWA.',
    status: 'MVP',
    completeness: 'MVP',
    monetizationStatus: 'None',
    buyer: 'Health-conscious individuals, productivity enthusiasts',
    techStack: ['Next.js 16', 'AI SDK', 'PWA', 'localStorage'],
    block: '"Free forever" positioning, crowded market (Habitica, Notion, Apple Health), no auth, no payment infrastructure.',
    effortToFirstDollar: 'Weeks',
    features: [
      'AI schedule builder from natural language',
      'Nutrition logging with AI',
      'Custom workout programs via AI conversation',
      'Intermittent fasting support (16:8, 18:6, 20:4, custom)',
      'Water & supplement tracking',
      'Streaks, heatmaps, progress rings',
      'Works offline as PWA',
      '10+ pro workout templates, 70+ exercises',
    ],
  },
  {
    id: 'refreshfactory',
    name: 'RefreshFactory',
    description: 'Automated website redesign tool — paste a URL, it scrapes the old site, audits it, generates a modern redesign, and provides an editor workspace.',
    status: 'Prototype',
    completeness: 'Prototype',
    monetizationStatus: 'Potential',
    buyer: 'Web developers, agencies wanting quick pitch mockups',
    techStack: ['Next.js 16', 'Google Generative AI', 'Cheerio', 'Vercel Blob', 'Framer Motion', 'Zustand', 'v0 SDK'],
    block: 'Output quality not sellable yet — the generated sites need to actually be useful. Could become a MarketMojo feature (generate mockup for prospects).',
    effortToFirstDollar: 'Weeks',
    features: [
      'URL input → automated scraping pipeline',
      'AI audit of existing site',
      'Modern site generation',
      'In-browser editor workspace',
      'Pipeline visualization (scrape → analyze → generate → deploy)',
    ],
  },
]

// ─── KILLED PROJECTS ────────────────────────────────────────────────────────

export const killedProjects: KilledProject[] = [
  {
    id: 'fundyadvantage',
    name: 'FundyAdvantage',
    reason: 'Exact duplicate positioning of FundyLaunch — same hero ("Get Found. Get More Calls. Grow Your Business."), same market (Atlantic Canada contractors), same services. Pick one brand.',
    action: 'kill',
  },
  {
    id: 'kvlaunch',
    name: 'KVLaunch',
    reason: 'Same web agency service as FundyLaunch with hyper-local KV/Saint John branding. FundyLaunch already targets "Atlantic Canada" which includes KV. Merge any good content.',
    action: 'merge',
  },
  {
    id: 'ideagen',
    name: 'IdeaGen',
    reason: 'Frontend-only demo with fake data — "generation" is random template selection, no real AI calls. No buyer would pay for this vs using ChatGPT directly.',
    action: 'kill',
  },
  {
    id: 'medcompare',
    name: 'MedCompare',
    reason: 'Medication comparison tool labeled "proof of concept for educational purposes." Medical liability issues, no revenue path, hard to monetize without health platform partnerships.',
    action: 'kill',
  },
  {
    id: 'refresh-factory-dupe',
    name: 'Refresh Factory (duplicate folder)',
    reason: 'Exact duplicate project folder (name has a space). Same code as RefreshFactory. Delete the folder.',
    action: 'kill',
  },
]

// ─── CLIENT PIPELINE ────────────────────────────────────────────────────────

export const clientProjects: ClientProject[] = [
  { id: 'donovan', name: 'Donovan Home Solutions', description: 'Home solutions website (Next.js)', status: 'active', value: '$3,500+' },
  { id: 'kvadventure', name: 'KV Adventure', description: 'Adventure/tourism site', status: 'active', value: '$3,500+' },
  { id: 'rpmiller', name: 'RP Miller', description: 'Client website with proposed spending plan', status: 'active', value: 'See proposal' },
  { id: 'sunrise', name: 'Sunrise Seedlings', description: 'Nursery/gardening website', status: 'active', value: '$3,500+' },
  { id: 'barrett', name: 'Barrett Builders', description: 'Construction company — needs website', status: 'prospect', value: '$3,500–$5,500' },
  { id: 'cleancutcrew', name: 'CleanCutCrew', description: 'Cleaning service — needs website', status: 'prospect', value: '$3,500–$5,500' },
  { id: 'coldspot', name: 'ColdSpot', description: 'Cold storage / ice cream shop', status: 'prospect', value: '$3,500–$5,500' },
  { id: 'fundyhockey', name: 'Fundy Hockey', description: 'Hockey league/club', status: 'prospect', value: '$3,500–$5,500' },
  { id: 'rescue-decks', name: 'Rescue Decks', description: 'Deck building/repair company', status: 'prospect', value: '$3,500–$5,500' },
  { id: 'sprague', name: 'Sprague', description: 'Local business', status: 'prospect', value: '$3,500–$5,500' },
  { id: 'pizzatwice', name: 'Pizza Twice', description: 'Pizza restaurant', status: 'prospect', value: '$3,500–$5,500' },
  { id: 'meatlocker', name: 'Meat Locker', description: 'Butcher/meat shop', status: 'prospect', value: '$3,500–$5,500' },
  { id: 'lawn-mowing', name: 'Lawn Mowing', description: 'Lawn care service', status: 'prospect', value: '$3,500–$5,500' },
]

// ─── TIMELINE ───────────────────────────────────────────────────────────────

export const timelinePhases: TimelinePhase[] = [
  {
    id: 'p1',
    range: 'Weeks 1–2',
    label: 'Ship & Clean',
    detail: 'Wire Stripe into MarketMojo. Fix Duelly onboarding. Kill duplicates.',
    tasks: [
      'Add Stripe to MarketMojo (checkout + webhook + credit deduction)',
      'Copy Duelly\'s Stripe pattern: lib/stripe.ts, api/stripe/checkout, api/stripe/webhook',
      'Test MarketMojo payment flow end-to-end',
      'Fix Duelly onboarding — signup to free audit in under 3 min',
      'Delete FundyAdvantage folder',
      'Merge KVLaunch content into FundyLaunch',
      'Delete IdeaGen and Refresh Factory (dupe) folders',
      'Deploy MarketMojo to Vercel',
    ],
  },
  {
    id: 'p2',
    range: 'Weeks 3–4',
    label: 'Prospect & Content',
    detail: 'Use MarketMojo to prospect for FundyLaunch clients. Publish Duelly content.',
    tasks: [
      'Use MarketMojo to scan all 9 prospect businesses',
      'Generate branded PDF reports for top 5 prospects',
      'Send personalized outreach emails to all 9 prospects',
      'Book 3 discovery calls from prospect list',
      'Write Duelly blog: "Is Your Business Invisible to ChatGPT?"',
      'Write Duelly blog: "SEO vs AEO — What Changed in 2026"',
      'Post Duelly on Product Hunt or similar',
    ],
  },
  {
    id: 'p3',
    range: 'Weeks 5–8',
    label: 'Marketing Push',
    detail: 'Marketing push — Reddit, X, agency outreach. Close 1-2 local clients.',
    tasks: [
      'Post anonymized Duelly audit results on r/SEO, r/smallbusiness, r/Entrepreneur',
      'Post MarketMojo in r/webdev, r/freelance, agency Slack/Discord groups',
      'Reach out to 10 SEO agencies about Duelly Authority Agency Suite ($299)',
      'Close 1-2 FundyLaunch clients from discovery calls',
      'Create Duelly demo video / screen recording for landing page',
      'Run a limited Reddit ad campaign for Duelly if organic is working',
    ],
  },
  {
    id: 'p4',
    range: 'Weeks 9–12',
    label: 'Double Down',
    detail: 'Invest in what\u2019s working. Add recurring revenue features.',
    tasks: [
      'Review which channel generated most revenue — double spend there',
      'If Duelly working: add monthly monitoring subscription (recurring revenue)',
      'If MarketMojo working: add white-label agency features (higher tier)',
      'If client work landing: create website template system for < 1 week turnaround',
      'Update FundyLogic case studies with new shipped projects',
      'Consider merging RefreshFactory as a feature inside MarketMojo',
    ],
  },
]

// ─── SPRINT CONFIG ──────────────────────────────────────────────────────────

// The 90-day sprint kicks off today (July 21, 2026).
export const SPRINT_START = new Date('2026-07-21T00:00:00')
export const SPRINT_LENGTH_DAYS = 90

export const stats = {
  totalProjects: 13,
  focus: 4,
  revenueReady: 4,
  target: 4775,
  activeClients: 4,
  warmLeads: 9,
}

// ─── REVENUE MATH ───────────────────────────────────────────────────────────

export const revenueMath = {
  duelly: {
    product: '10 Launch Packs × $79.99',
    total: 800,
    note: 'Pure profit after ~$0.02/scan API cost',
  },
  marketmojo: {
    product: '5 Pro subscribers × $95/mo',
    total: 475,
    note: 'Recurring monthly revenue',
  },
  fundylaunch: {
    product: '1 Website Launch client',
    total: 3500,
    note: 'Service revenue — could close from existing 9 warm leads',
  },
  combined: {
    total: 4775,
    note: 'Conservative 90-day target. No new features required.',
  },
}

// ─── COST CONTEXT (from Duelly COST_TRACKING.md) ────────────────────────────

export const costContext = {
  duellyApiCostPerQuery: 0.0227,
  duellyApiCostPerProAudit: 0.021,
  duellyApiCostPerDeepScan: 0.091,
  duellyApiCostPerCompetitor: 0.024,
  duellyMarginOnLaunchPack: '99.5%', // $79.99 pack, ~180 queries × $0.02 = $3.60 cost
  vercelHosting: 'Free tier (static + serverless)',
  supabase: 'Free tier',
  domains: 'Porkbun (multiple domains — see receipts)',
}
