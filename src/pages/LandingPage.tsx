import { MessageSquare, BarChart3, Zap, Shield, Brain, ArrowRight, Database, Sparkles, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { DATASET_STATS, CATEGORY_DATA } from "@/data/chatbotData";
import heroBg from "@/assets/hero-bg.jpg";

const stats = [
  { label: "Training Samples", value: "44,884", icon: Database },
  { label: "Unique Intents", value: "47", icon: Brain },
  { label: "Categories", value: "13", icon: BarChart3 },
  { label: "Accuracy", value: "96.2%", icon: TrendingUp },
];

const features = [
  {
    icon: MessageSquare,
    title: "Intent Classification",
    desc: "TF-IDF + Logistic Regression classifying 47 customer intents across 13 retail categories.",
  },
  {
    icon: Brain,
    title: "NLP Pipeline",
    desc: "Advanced preprocessing and multi-class classification optimized for retail e-commerce.",
  },
  {
    icon: BarChart3,
    title: "Interactive Analytics",
    desc: "Real-time dashboard with interactive charts — categories, intents, tags and more.",
  },
  {
    icon: Shield,
    title: "Content Moderation",
    desc: "Built-in profanity detection with per-category rate tracking and flagging.",
  },
  {
    icon: Zap,
    title: "Fast Retrieval",
    desc: "Cosine similarity retrieval from 44K+ samples in milliseconds.",
  },
  {
    icon: Sparkles,
    title: "Smart Fallback",
    desc: "Graceful out-of-scope handling with configurable similarity thresholds.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[92vh] flex items-center">
        <img
          src={heroBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-40 dark:opacity-50"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background" />
        
        {/* Subtle decorative elements */}
        <div className="absolute top-32 -left-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl animate-float" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 rounded-full bg-accent/5 blur-3xl animate-float" style={{ animationDelay: "4s" }} />

        <div className="relative z-10 container mx-auto px-6 py-24">
          <div className="max-w-3xl space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 animate-slide-up">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium text-primary tracking-wide">
                44,884 Training Samples
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <span className="gradient-text">RB</span>{" "}
              <span className="text-foreground">Retail</span>
              <br />
              <span className="text-foreground">Chatbot </span>
              <span className="gradient-text-accent">Analytics</span>
            </h1>

            <p className="text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed animate-slide-up" style={{ animationDelay: "0.2s" }}>
              Explore the Bitext Retail E-Commerce dataset — 47 intents, 13 categories, 
              powered by TF-IDF intent classification with interactive visualizations.
            </p>

            <div className="flex flex-wrap gap-3 animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm text-primary-foreground transition-all hover:opacity-90 hover:scale-[1.02]"
                style={{ background: "var(--gradient-primary)" }}
              >
                Open Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm border border-border hover:bg-secondary transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 -mt-20 container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="rounded-xl border border-border bg-card p-5 card-elevated animate-slide-up"
              style={{ animationDelay: `${0.05 * i}s` }}
            >
              <s.icon className="h-4 w-4 text-primary mb-3" />
              <div className="text-2xl md:text-3xl font-bold font-mono tracking-tight">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-6 py-28">
        <div className="max-w-lg mb-14">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Under the <span className="gradient-text">Hood</span>
          </h2>
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
            Built on the Bitext Retail E-Commerce LLM Chatbot Training Dataset with advanced NLP.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group p-5 rounded-xl border border-border bg-card card-elevated hover:border-primary/20 transition-all duration-300"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                <f.icon className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-semibold text-sm mb-1.5">{f.title}</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories grid */}
      <section className="container mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold tracking-tight text-center mb-10">
          <span className="gradient-text-accent">13 Categories</span> Covered
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
          {CATEGORY_DATA.sort((a, b) => b.count - a.count).map((cat) => (
            <div
              key={cat.name}
              className="p-3.5 rounded-lg border border-border bg-card hover:border-primary/20 transition-colors text-center"
            >
              <div className="font-mono text-[10px] text-primary font-semibold tracking-wider">{cat.name}</div>
              <div className="text-xl font-bold mt-0.5">{cat.count.toLocaleString()}</div>
              <div className="text-[10px] text-muted-foreground">samples</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 pb-24">
        <div className="rounded-2xl p-10 md:p-14 relative overflow-hidden" style={{ background: "var(--gradient-primary)" }}>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-background/5 -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 max-w-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
              Explore the Data
            </h2>
            <p className="text-primary-foreground/70 text-sm mb-6">
              Dive into interactive charts, intent distributions, and tag analytics.
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm bg-background text-foreground hover:opacity-90 transition-opacity"
            >
              Open Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        <p>RB — Retail E-Commerce Chatbot Analytics • Bitext Dataset</p>
      </footer>
    </div>
  );
}
