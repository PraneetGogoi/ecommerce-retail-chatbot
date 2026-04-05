import { useState } from "react";
import { Database, Brain, BarChart3, AlertTriangle, MessageSquare, Sparkles } from "lucide-react";
import { CATEGORY_DATA, TOP_INTENTS, TAG_DATA, TAG_BY_CATEGORY, CHART_COLORS } from "@/data/chatbotData";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter, ZAxis, Legend, AreaChart, Area, FunnelChart, Funnel, LabelList,
} from "recharts";

const KPI_CARDS = [
  { label: "Total Samples", value: "44,884", icon: Database, accent: false },
  { label: "Unique Intents", value: "47", icon: Brain, accent: false },
  { label: "Categories", value: "13", icon: BarChart3, accent: false },
  { label: "Profanity Rate", value: "9.8%", icon: AlertTriangle, accent: true },
  { label: "Avg Words", value: "11.4", icon: MessageSquare, accent: false },
  { label: "Accuracy", value: "96.2%", icon: Sparkles, accent: false },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg p-2.5 border border-border bg-card shadow-lg text-xs">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: <span className="font-mono font-bold">{typeof p.value === "number" ? p.value.toLocaleString() : p.value}</span>
        </p>
      ))}
    </div>
  );
};

const pieData = CATEGORY_DATA.map((c, i) => ({ ...c, fill: CHART_COLORS[i % CHART_COLORS.length] }));

const radarData = CATEGORY_DATA.slice(0, 8).map((c) => ({
  category: c.name,
  avgInstWords: c.avgInstWords,
  avgRespWords: c.avgRespWords,
  profanityPct: c.profanityPct,
}));

const scatterData = CATEGORY_DATA.map((c, i) => ({
  x: c.avgInstWords, y: c.avgRespWords, z: c.count, name: c.name,
  fill: CHART_COLORS[i % CHART_COLORS.length],
}));

const funnelData = CATEGORY_DATA.sort((a, b) => b.count - a.count).map((c, i) => ({
  value: c.count, name: c.name, fill: CHART_COLORS[i % CHART_COLORS.length],
}));

type Tab = "overview" | "intents" | "tags" | "advanced";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "intents", label: "Intents" },
    { key: "tags", label: "Tags" },
    { key: "advanced", label: "Advanced" },
  ];

  return (
    <div className="p-5 md:p-8 space-y-6 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="gradient-text">RB</span> Dashboard
        </h1>
        <p className="text-muted-foreground text-xs mt-0.5">Retail E-Commerce Chatbot Dataset</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {KPI_CARDS.map((kpi) => (
          <div key={kpi.label} className="rounded-xl border border-border bg-card p-4 card-elevated hover:border-primary/20 transition-colors">
            <kpi.icon className={`h-4 w-4 mb-2 ${kpi.accent ? "text-accent" : "text-primary"}`} />
            <div className="text-xl font-bold font-mono">{kpi.value}</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-0.5 p-1 rounded-lg bg-secondary/60 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === tab.key
                ? "bg-card text-foreground shadow-sm card-elevated"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && <OverviewTab />}
      {activeTab === "intents" && <IntentsTab />}
      {activeTab === "tags" && <TagsTab />}
      {activeTab === "advanced" && <AdvancedTab />}
    </div>
  );
}

function ChartCard({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-border bg-card p-4 md:p-5 card-elevated ${className}`}>
      <h3 className="text-xs font-medium mb-4 text-muted-foreground tracking-wide">{title}</h3>
      {children}
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <ChartCard title="SAMPLE COUNT PER CATEGORY">
        <ResponsiveContainer width="100%" height={380}>
          <BarChart data={CATEGORY_DATA.sort((a, b) => b.count - a.count)} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <YAxis dataKey="name" type="category" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} width={90} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {CATEGORY_DATA.sort((a, b) => b.count - a.count).map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="CATEGORY SHARE">
        <ResponsiveContainer width="100%" height={380}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={130} paddingAngle={2} dataKey="count" nameKey="name"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={{ stroke: "hsl(var(--muted-foreground))" }}>
              {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="CATEGORY VOLUME FUNNEL" className="lg:col-span-2">
        <ResponsiveContainer width="100%" height={360}>
          <FunnelChart>
            <Tooltip content={<CustomTooltip />} />
            <Funnel dataKey="value" data={funnelData} isAnimationActive>
              {funnelData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              <LabelList position="center" fill="hsl(var(--foreground))" fontSize={10} formatter={(v: number) => v.toLocaleString()} />
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function IntentsTab() {
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <ChartCard title="TOP 15 INTENTS" className="lg:col-span-2">
        <ResponsiveContainer width="100%" height={380}>
          <BarChart data={TOP_INTENTS}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }} angle={-35} textAnchor="end" height={80} />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {TOP_INTENTS.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="AVG INSTRUCTION VS RESPONSE WORDS">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={CATEGORY_DATA.slice(0, 8)}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }} angle={-25} textAnchor="end" height={55} />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="avgInstWords" name="Instruction" fill="hsl(var(--chart-1))" radius={[3, 3, 0, 0]} />
            <Bar dataKey="avgRespWords" name="Response" fill="hsl(var(--chart-2))" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="CATEGORY RADAR">
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis dataKey="category" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }} />
            <PolarRadiusAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }} />
            <Radar name="Inst Words" dataKey="avgInstWords" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.2} />
            <Radar name="Profanity %" dataKey="profanityPct" stroke="hsl(var(--chart-3))" fill="hsl(var(--chart-3))" fillOpacity={0.2} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function TagsTab() {
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <ChartCard title="TAG TYPE FREQUENCY">
        <ResponsiveContainer width="100%" height={380}>
          <BarChart data={TAG_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }} angle={-30} textAnchor="end" height={65} />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {TAG_DATA.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="TAG DISTRIBUTION">
        <ResponsiveContainer width="100%" height={380}>
          <PieChart>
            <Pie data={TAG_DATA} cx="50%" cy="50%" outerRadius={130} dataKey="count" nameKey="name"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={{ stroke: "hsl(var(--muted-foreground))" }}>
              {TAG_DATA.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="PROFANITY RATE PER CATEGORY" className="lg:col-span-2">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={CATEGORY_DATA.sort((a, b) => b.profanityPct - a.profanityPct)}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }} angle={-25} textAnchor="end" height={55} />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} unit="%" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="profanityPct" name="Profanity %" radius={[4, 4, 0, 0]}>
              {CATEGORY_DATA.sort((a, b) => b.profanityPct - a.profanityPct).map((c, i) => (
                <Cell key={i} fill={c.profanityPct > 10 ? "hsl(var(--destructive))" : "hsl(var(--chart-1))"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function AdvancedTab() {
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <ChartCard title="INSTRUCTION VS RESPONSE SCATTER">
        <ResponsiveContainer width="100%" height={380}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" dataKey="x" name="Instruction Words" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <YAxis type="number" dataKey="y" name="Response Words" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <ZAxis type="number" dataKey="z" range={[100, 800]} name="Count" />
            <Tooltip content={<CustomTooltip />} />
            <Scatter data={scatterData} name="Categories">
              {scatterData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="SAMPLE COUNT AREA">
        <ResponsiveContainer width="100%" height={380}>
          <AreaChart data={CATEGORY_DATA.sort((a, b) => a.count - b.count)}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }} angle={-25} textAnchor="end" height={55} />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="count" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.15} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="INTENT–CATEGORY BREAKDOWN" className="lg:col-span-2">
        <div className="overflow-x-auto max-h-80 overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-card">
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Intent</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Category</th>
                <th className="text-right py-2 px-3 text-muted-foreground font-medium">Count</th>
                <th className="text-left py-2 px-3 text-muted-foreground font-medium w-40">Bar</th>
              </tr>
            </thead>
            <tbody>
              {TOP_INTENTS.map((intent) => (
                <tr key={intent.name} className="border-b border-border/40 hover:bg-secondary/40 transition-colors">
                  <td className="py-1.5 px-3 font-mono">{intent.name}</td>
                  <td className="py-1.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-medium">{intent.category}</span>
                  </td>
                  <td className="py-1.5 px-3 text-right font-mono font-bold">{intent.count.toLocaleString()}</td>
                  <td className="py-1.5 px-3">
                    <div className="w-full bg-secondary rounded-full h-1.5">
                      <div className="h-1.5 rounded-full bg-primary transition-all" style={{ width: `${(intent.count / 1344) * 100}%` }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
}
