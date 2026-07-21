export type FocusStatus = 'live' | 'almost' | 'shipped'

export type FocusProject = {
  id: string
  name: string
  description: string
  status: FocusStatus
  statusLabel: string
  monetization: string
  nextAction: string
  revenueTarget: string
  revenueValue: number
  url?: string
}

export type ParkedProject = {
  id: string
  name: string
  description: string
  status: string
  block: string
  isNote?: boolean
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

export const focusProjects: FocusProject[] = [
  {
    id: 'duelly',
    name: 'Duelly',
    description: 'AI search visibility platform — tells businesses if ChatGPT, Gemini, and Perplexity recommend them.',
    status: 'live',
    statusLabel: 'Live',
    monetization: 'SaaS credits ($79–$299 one-time)',
    nextAction: 'Market it — content + cold outreach to agencies',
    revenueTarget: '$800 from 10 packs',
    revenueValue: 800,
  },
  {
    id: 'marketmojo',
    name: 'MarketMojo',
    description: 'Lead gen tool for web agencies — search any area, audit local businesses, generate branded PDF reports.',
    status: 'almost',
    statusLabel: 'Almost Ready',
    monetization: 'Subscription ($30/$95/$225/mo)',
    nextAction: 'Wire Stripe (2-3 days)',
    revenueTarget: '$475/mo from 5 subs',
    revenueValue: 475,
  },
  {
    id: 'fundylaunch',
    name: 'FundyLaunch',
    description: 'Local web agency — websites, SEO, and AI search optimization for Atlantic Canada contractors.',
    status: 'shipped',
    statusLabel: 'Shipped',
    monetization: 'Service invoicing ($3.5K–$5.5K)',
    nextAction: 'Prospect 10 warm leads',
    revenueTarget: '$3,500 from 1 client',
    revenueValue: 3500,
  },
]

export const parkedProjects: ParkedProject[] = [
  {
    id: 'mindfulmama',
    name: 'MindfulMama',
    description: 'Wellness toolkit for overwhelmed mothers',
    status: 'MVP',
    block: 'No monetization path — needs premium tier + accounts',
  },
  {
    id: 'routinepro',
    name: 'RoutinePro',
    description: 'AI daily routine builder with nutrition & fitness',
    status: 'MVP',
    block: 'Free-forever positioning, crowded market, no auth',
  },
  {
    id: 'refreshfactory',
    name: 'RefreshFactory',
    description: 'Automated website redesign from URL',
    status: 'Prototype',
    block: 'Output quality not sellable — could be MarketMojo feature later',
  },
  {
    id: 'fundylogic',
    name: 'FundyLogic',
    description: 'Agency brand/portfolio site (fundylogic.com)',
    status: 'Live',
    block: 'Keep as portfolio — update case studies as you ship',
    isNote: true,
  },
]

export const killedProjects: KilledProject[] = [
  {
    id: 'fundyadvantage',
    name: 'FundyAdvantage',
    reason: 'Exact duplicate positioning of FundyLaunch. Same market, same copy.',
    action: 'kill',
  },
  {
    id: 'kvlaunch',
    name: 'KVLaunch',
    reason: 'Same service as FundyLaunch — just hyper-local branding. Merge content.',
    action: 'merge',
  },
  {
    id: 'ideagen',
    name: 'IdeaGen',
    reason: 'Frontend demo with fake data. No real AI. Competes with ChatGPT.',
    action: 'kill',
  },
  {
    id: 'medcompare',
    name: 'MedCompare',
    reason: 'Medical liability concerns. Labeled "proof of concept." No revenue path.',
    action: 'kill',
  },
  {
    id: 'refresh-factory-dupe',
    name: 'Refresh Factory (duplicate)',
    reason: 'Duplicate folder with space in name. Delete.',
    action: 'kill',
  },
]

export const clientProjects: ClientProject[] = [
  { id: 'donovan', name: 'Donovan Home Solutions', description: 'Home solutions website', status: 'active' },
  { id: 'kvadventure', name: 'KV Adventure', description: 'Adventure/tourism site', status: 'active' },
  { id: 'rpmiller', name: 'RP Miller', description: 'Client website + spending plan', status: 'active' },
  { id: 'sunrise', name: 'Sunrise Seedlings', description: 'Nursery/gardening website', status: 'active' },
  { id: 'barrett', name: 'Barrett Builders', description: 'Construction company', status: 'prospect' },
  { id: 'cleancutcrew', name: 'CleanCutCrew', description: 'Cleaning service', status: 'prospect' },
  { id: 'coldspot', name: 'ColdSpot', description: 'Cold storage / ice cream', status: 'prospect' },
  { id: 'fundyhockey', name: 'Fundy Hockey', description: 'Hockey league/club', status: 'prospect' },
  { id: 'rescue-decks', name: 'Rescue Decks', description: 'Deck building/repair', status: 'prospect' },
  { id: 'sprague', name: 'Sprague', description: 'Local business', status: 'prospect' },
  { id: 'pizzatwice', name: 'Pizza Twice', description: 'Pizza restaurant', status: 'prospect' },
  { id: 'meatlocker', name: 'Meat Locker', description: 'Butcher/meat shop', status: 'prospect' },
  { id: 'lawn-mowing', name: 'Lawn Mowing', description: 'Lawn care service', status: 'prospect' },
]

export const timelinePhases: TimelinePhase[] = [
  {
    id: 'p1',
    range: 'Weeks 1–2',
    label: 'Ship & Clean',
    detail: 'Wire Stripe into MarketMojo. Fix Duelly onboarding. Kill duplicates.',
    tasks: [
      'Add Stripe to MarketMojo (checkout + webhook + credit deduction)',
      'Test MarketMojo payment flow end-to-end',
      'Fix Duelly onboarding — signup to free audit in under 3 min',
      'Delete FundyAdvantage folder',
      'Merge KVLaunch content into FundyLaunch',
      'Delete IdeaGen and Refresh Factory (dupe) folders',
    ],
  },
  {
    id: 'p2',
    range: 'Weeks 3–4',
    label: 'Prospect',
    detail: 'Use MarketMojo to prospect. Book 3 discovery calls. Publish content.',
    tasks: [
      'Use MarketMojo to scan 10 prospect businesses',
      'Generate PDF reports for top 5 prospects',
      'Send personalized outreach to all 10 prospects',
      'Book 3 discovery calls from prospect list',
      'Write Duelly blog: "Is Your Business Invisible to ChatGPT?"',
      'Write Duelly blog: "SEO vs AEO — What Changed in 2026"',
    ],
  },
  {
    id: 'p3',
    range: 'Weeks 5–8',
    label: 'Market Push',
    detail: 'Marketing push — Reddit, X, agency outreach. Close 1-2 local clients.',
    tasks: [
      'Post anonymized Duelly audit results on Reddit (r/SEO, r/smallbusiness)',
      'Post MarketMojo in web design communities',
      'Reach out to 10 SEO agencies about Duelly Agency Suite',
      'Close 1-2 FundyLaunch clients from discovery calls',
      'Create Duelly demo video / screen recording for landing page',
    ],
  },
  {
    id: 'p4',
    range: 'Weeks 9–12',
    label: 'Double Down',
    detail: 'Invest in what\u2019s working. Add recurring revenue features.',
    tasks: [
      'Review which channel generated most revenue',
      'If Duelly working: add monthly monitoring subscription',
      'If MarketMojo working: add white-label agency features',
      'If client work landing: create website template system for speed',
      'Update FundyLogic case studies with new shipped projects',
    ],
  },
]

// The 90-day sprint kicks off today. Days remaining counts down.
export const SPRINT_START = new Date('2026-07-21T00:00:00')
export const SPRINT_LENGTH_DAYS = 90

export const stats = {
  totalProjects: 13,
  focus: 3,
  revenueReady: 2,
  target: 4775,
  activeClients: 4,
  warmLeads: 9,
}
