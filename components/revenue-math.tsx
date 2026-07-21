import { Calculator, TrendingUp } from 'lucide-react'
import { revenueMath, costContext } from '@/lib/portfolio-data'

export function RevenueMath() {
  const items = [
    {
      name: 'Duelly',
      formula: revenueMath.duelly.product,
      total: revenueMath.duelly.total,
      note: revenueMath.duelly.note,
      color: 'text-success',
    },
    {
      name: 'MarketMojo',
      formula: revenueMath.marketmojo.product,
      total: revenueMath.marketmojo.total,
      note: revenueMath.marketmojo.note,
      color: 'text-warning',
    },
    {
      name: 'FundyLaunch',
      formula: revenueMath.fundylaunch.product,
      total: revenueMath.fundylaunch.total,
      note: revenueMath.fundylaunch.note,
      color: 'text-info',
    },
  ]

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Revenue breakdown */}
      <div className="rounded-xl border border-border bg-card/60 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="size-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">90-Day Revenue Target</h3>
        </div>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.name} className="flex items-center justify-between rounded-lg border border-border/50 bg-background/40 p-3">
              <div>
                <p className="text-sm font-medium text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.formula}</p>
                <p className="text-[0.65rem] text-muted-foreground/70 italic">{item.note}</p>
              </div>
              <span className={`font-mono text-lg font-bold ${item.color}`}>
                ${item.total.toLocaleString()}
              </span>
            </div>
          ))}
          <div className="flex items-center justify-between border-t border-border pt-3 mt-3">
            <div>
              <p className="text-sm font-bold text-foreground">Total (conservative)</p>
              <p className="text-[0.65rem] text-muted-foreground">{revenueMath.combined.note}</p>
            </div>
            <span className="font-mono text-xl font-black text-primary">
              ${revenueMath.combined.total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Cost context */}
      <div className="rounded-xl border border-border bg-card/60 p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="size-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Margin & Costs</h3>
        </div>
        <div className="space-y-3">
          <div className="rounded-lg border border-border/50 bg-background/40 p-3">
            <p className="text-xs font-medium text-foreground">Duelly Margin on Launch Pack</p>
            <p className="font-mono text-lg font-bold text-success">{costContext.duellyMarginOnLaunchPack}</p>
            <p className="text-[0.65rem] text-muted-foreground">
              $79.99 pack ≈ 180 queries × ${costContext.duellyApiCostPerQuery} = ~$4.09 API cost
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-border/50 bg-background/40 p-2.5">
              <p className="text-[0.65rem] text-muted-foreground">Pro Audit cost</p>
              <p className="font-mono text-sm font-semibold text-foreground">${costContext.duellyApiCostPerProAudit}</p>
            </div>
            <div className="rounded-lg border border-border/50 bg-background/40 p-2.5">
              <p className="text-[0.65rem] text-muted-foreground">Deep Scan cost</p>
              <p className="font-mono text-sm font-semibold text-foreground">${costContext.duellyApiCostPerDeepScan}</p>
            </div>
            <div className="rounded-lg border border-border/50 bg-background/40 p-2.5">
              <p className="text-[0.65rem] text-muted-foreground">Competitor cost</p>
              <p className="font-mono text-sm font-semibold text-foreground">${costContext.duellyApiCostPerCompetitor}</p>
            </div>
            <div className="rounded-lg border border-border/50 bg-background/40 p-2.5">
              <p className="text-[0.65rem] text-muted-foreground">Avg cost/query</p>
              <p className="font-mono text-sm font-semibold text-foreground">${costContext.duellyApiCostPerQuery}</p>
            </div>
          </div>
          <div className="rounded-lg border border-success/30 bg-success/5 p-3">
            <p className="text-xs text-foreground">
              <span className="font-semibold">Infrastructure:</span> Vercel free tier + Supabase free tier.
            </p>
            <p className="text-[0.65rem] text-muted-foreground mt-1">
              Only variable cost is Gemini API usage (~$0.02/query). All revenue above API costs is profit.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
