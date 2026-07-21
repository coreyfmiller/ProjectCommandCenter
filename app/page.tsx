import { Rocket, Target, Archive, CalendarRange, Zap, Skull, Users, DollarSign, ExternalLink } from 'lucide-react'
import { StatsBar } from '@/components/stats-bar'
import { FocusCard } from '@/components/focus-card'
import { ParkedCard } from '@/components/parked-card'
import { ExecutionTimeline } from '@/components/execution-timeline'
import { KilledSection } from '@/components/killed-section'
import { ClientPipeline } from '@/components/client-pipeline'
import { RevenueTracker } from '@/components/revenue-tracker'
import { focusProjects, parkedProjects, killedProjects, clientProjects } from '@/lib/portfolio-data'

function SectionHeading({
  icon: Icon,
  eyebrow,
  title,
  description,
}: {
  icon: typeof Target
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
        <Icon className="size-4.5" aria-hidden="true" />
      </span>
      <div>
        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</span>
        <h2 className="text-xl font-semibold text-foreground text-balance">{title}</h2>
        <p className="mt-0.5 text-sm text-muted-foreground text-pretty">{description}</p>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <main className="mx-auto min-h-svh w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      {/* Header */}
      <header className="flex flex-col gap-4 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <Zap className="size-4" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em]">Command Center</span>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl">
            Founder Portfolio
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground text-pretty">
            One operator, thirteen projects. This board keeps the focus on the three that can make money — and the
            90-day plan to get there.
          </p>
        </div>
      </header>

      {/* Stats */}
      <section className="mt-8">
        <StatsBar />
      </section>

      {/* Focus projects */}
      <section className="mt-12" aria-labelledby="focus-heading">
        <SectionHeading
          icon={Target}
          eyebrow="Priority"
          title="Focus Projects"
          description="Ship, sell, invoice. Everything else waits."
        />
        <div className="mt-6 grid gap-4 lg:grid-cols-4" id="focus-heading">
          {focusProjects.map((project) => (
            <FocusCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* Revenue + Quick Actions */}
      <section className="mt-12" aria-labelledby="revenue-heading">
        <SectionHeading
          icon={DollarSign}
          eyebrow="Revenue"
          title="Track & Act"
          description="Log revenue as it comes in. Quick-launch your tools."
        />
        <div className="mt-6 grid gap-4 lg:grid-cols-2" id="revenue-heading">
          <RevenueTracker />

          {/* Quick Actions */}
          <div className="rounded-xl border border-border bg-card/60 p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <ExternalLink className="size-4 text-primary" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Open Duelly', url: 'https://duelly.ai', color: 'border-green-500/30 hover:bg-green-500/5' },
                { label: 'Open MarketMojo', url: 'https://marketmojo.vercel.app', color: 'border-yellow-500/30 hover:bg-yellow-500/5' },
                { label: 'Open FundyLaunch', url: 'https://fundylaunch.com', color: 'border-blue-500/30 hover:bg-blue-500/5' },
                { label: 'Open FundyLogic', url: 'https://fundylogic.vercel.app', color: 'border-purple-500/30 hover:bg-purple-500/5' },
                { label: 'Prospect (MarketMojo)', url: 'https://marketmojo.vercel.app/search', color: 'border-orange-500/30 hover:bg-orange-500/5' },
                { label: 'Demo Builder', url: 'https://auto-agency-three.vercel.app/demobuilder', color: 'border-pink-500/30 hover:bg-pink-500/5' },
                { label: 'Vercel Dashboard', url: 'https://vercel.com/dashboard', color: 'border-border hover:bg-muted/50' },
                { label: 'Stripe Dashboard', url: 'https://dashboard.stripe.com', color: 'border-border hover:bg-muted/50' },
              ].map((action) => (
                <a
                  key={action.label}
                  href={action.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-medium text-foreground transition-colors ${action.color}`}
                >
                  <ExternalLink className="size-3 text-muted-foreground" />
                  {action.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Parked projects */}
      <section className="mt-12" aria-labelledby="parked-heading">
        <SectionHeading
          icon={Archive}
          eyebrow="On Hold"
          title="Parked Projects"
          description="Built, but blocked. Revisit only when the focus three are paying."
        />
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" id="parked-heading">
          {parkedProjects.map((project) => (
            <ParkedCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="mt-12" aria-labelledby="timeline-heading">
        <SectionHeading
          icon={CalendarRange}
          eyebrow="Roadmap"
          title="90-Day Execution Timeline"
          description="From wiring payments to compounding what works."
        />
        <div className="mt-8" id="timeline-heading">
          <ExecutionTimeline />
        </div>
      </section>

      {/* Client Pipeline */}
      <section className="mt-12" aria-labelledby="clients-heading">
        <SectionHeading
          icon={Users}
          eyebrow="Revenue"
          title="Client Pipeline"
          description="Active clients and warm prospects from the FundyLaunch service business."
        />
        <div className="mt-6" id="clients-heading">
          <ClientPipeline projects={clientProjects} />
        </div>
      </section>

      {/* Killed */}
      <section className="mt-12" aria-labelledby="killed-heading">
        <SectionHeading
          icon={Skull}
          eyebrow="Archived"
          title="Killed & Merged"
          description="Dropped for good reason. Don't resurrect these."
        />
        <div className="mt-6" id="killed-heading">
          <KilledSection projects={killedProjects} />
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-14 overflow-hidden rounded-2xl border border-primary/25 bg-primary/10 px-6 py-8 text-center">
        <Rocket className="mx-auto size-5 text-primary" aria-hidden="true" />
        <p className="mt-3 text-2xl font-bold tracking-tight text-foreground text-balance sm:text-3xl">
          Stop building. Start selling.
        </p>
      </footer>
    </main>
  )
}
