/**
 * PricingPage — dedicated /pricing route.
 * Lifted out of homepage <Pricing /> block so the nav stays uncluttered but
 * the pricing story has room to breathe: three tiers + engagement model + FAQ.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { pricing } from '@/constants';
import { FiCheck, FiArrowRight, FiHexagon, FiShield, FiPackage, FiCpu, FiZap, FiMessageSquare } from 'react-icons/fi';
import SEO from '@/components/SEO';

const TierCard = ({ item, featured, isDarkMode }) => {
  const Icon = item.title.includes('Enterprise') || item.title.includes('Partner') ? FiShield : item.title.includes('Production') ? FiCpu : FiPackage;
  return (
    <div
      className={`relative rounded-2xl border p-8 transition-all duration-300
        ${featured
          ? 'border-yellow-400/60 bg-gradient-to-b from-yellow-400/5 to-transparent shadow-[0_0_40px_-15px_rgba(250,204,21,0.35)]'
          : (isDarkMode ? 'border-white/10 bg-white/3 hover:border-white/25' : 'border-n-3 bg-white shadow-sm hover:shadow-md')
        }`}
    >
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-yellow-400 text-black text-[10px] font-bold uppercase tracking-wider font-mono">
          Most Common
        </div>
      )}

      <div className="flex items-center justify-between mb-5">
        <span className={`text-[10px] font-mono uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-n-6'}`}>
          Tier {item.id}
        </span>
        <div className={`p-2 rounded border ${isDarkMode ? 'border-white/15 bg-white/5' : 'border-n-3 bg-n-2'}`}>
          <Icon size={18} />
        </div>
      </div>

      <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-n-8'}`}>
        {item.title}
      </h3>
      <p className={`text-sm mb-6 min-h-[3rem] ${isDarkMode ? 'text-white/55' : 'text-n-6'}`}>
        {item.description}
      </p>

      {/* Price */}
      <div className={`flex items-baseline mb-8 pb-6 border-b border-dashed ${isDarkMode ? 'border-white/10' : 'border-n-3'}`}>
        {item.price && item.price !== 'Custom' ? (
          <>
            <span className={`text-lg font-mono ${isDarkMode ? 'text-white/40' : 'text-n-5'}`}>$</span>
            <span className={`text-4xl font-bold font-mono ${featured ? 'text-yellow-400' : (isDarkMode ? 'text-white' : 'text-n-8')}`}>
              {item.price}
            </span>
          </>
        ) : (
          <span className={`text-2xl font-bold font-mono uppercase ${featured ? 'text-yellow-400' : (isDarkMode ? 'text-white' : 'text-n-8')}`}>
            Custom Quote
          </span>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8">
        {item.features.map((f, i) => (
          <li key={i} className={`flex items-start gap-2 text-sm ${isDarkMode ? 'text-white/70' : 'text-n-7'}`}>
            <FiCheck className="shrink-0 mt-0.5 text-yellow-400" size={14} />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        to={`/contact?inquiry=pricing&tier=${encodeURIComponent(item.title)}`}
        className={`w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-mono uppercase text-xs font-bold tracking-widest transition-colors
          ${featured
            ? 'bg-yellow-400 text-black hover:bg-yellow-300'
            : (isDarkMode ? 'border border-white/20 text-white/80 hover:border-yellow-400/60 hover:text-yellow-400' : 'border border-n-8 text-n-8 hover:bg-n-8 hover:text-n-1')
          }`}
      >
        {item.price && item.price !== 'Custom' ? 'Talk to Engineering' : 'Design a Partnership'}
        <FiArrowRight size={14} />
      </Link>
    </div>
  );
};

const EngagementRow = ({ step, title, blurb, isDarkMode }) => (
  <div className="flex items-start gap-5">
    <div className={`shrink-0 w-10 h-10 rounded-lg border flex items-center justify-center text-sm font-mono font-bold
      ${isDarkMode ? 'border-yellow-400/40 text-yellow-400 bg-yellow-400/5' : 'border-n-8 text-n-8 bg-white'}`}>
      {step}
    </div>
    <div>
      <h4 className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-n-8'}`}>{title}</h4>
      <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-white/60' : 'text-n-6'}`}>{blurb}</p>
    </div>
  </div>
);

const FaqRow = ({ q, a, isDarkMode }) => (
  <div className={`py-6 border-t ${isDarkMode ? 'border-white/10' : 'border-n-3'}`}>
    <h4 className={`text-base font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-n-8'}`}>{q}</h4>
    <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-white/60' : 'text-n-6'}`}>{a}</p>
  </div>
);

const PricingPage = () => {
  const { isDarkMode } = useTheme();

  return (
    <>
      <SEO
        title="Pricing — Phylo AI Systems"
        description="Three engagement tiers for production AI systems: Pilot ($15–25K), Production ($50K+), and Partner (custom). Real numbers, real work — no per-seat SaaS pricing."
      />

      <section className={`relative py-24 lg:py-32 overflow-hidden ${isDarkMode ? 'bg-n-8' : 'bg-white'}`}>
        {/* Subtle grid backdrop */}
        <div
          className={`absolute inset-0 pointer-events-none ${isDarkMode ? 'opacity-[0.04]' : 'opacity-[0.06]'}`}
          style={{
            backgroundImage: `linear-gradient(${isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'} 1px, transparent 1px), linear-gradient(90deg, ${isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'} 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />

        <div className="container relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest mb-6
              ${isDarkMode ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20' : 'bg-n-2 text-n-8 border border-n-3'}`}>
              <FiZap size={12} /> Engagement Model
            </div>
            <h1 className={`text-5xl sm:text-6xl font-bold tracking-tight leading-tight mb-6 ${isDarkMode ? 'text-white' : 'text-n-8'}`}>
              Flexible Enterprise Pricing
            </h1>
            <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-white/60' : 'text-n-6'}`}>
              We build production AI systems, not seats. Three tiers cover proof-of-value, live deployment, and long-term partnership. Every engagement starts with a real problem, real data, and a scoped SOW — no per-seat, no auto-renew.
            </p>
          </motion.div>

          {/* 3 tier cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24 max-w-6xl mx-auto">
            {pricing.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <TierCard item={item} featured={i === 1} isDarkMode={isDarkMode} />
              </motion.div>
            ))}
          </div>

          {/* How engagement works */}
          <div className="max-w-4xl mx-auto mb-24">
            <h2 className={`text-3xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-n-8'}`}>How the engagement works</h2>
            <p className={`text-sm mb-10 ${isDarkMode ? 'text-white/50' : 'text-n-6'}`}>
              Four stages, one goal — a production system with reproducible curves, honest evaluation, and a runbook the team can operate.
            </p>
            <div className="space-y-8">
              <EngagementRow
                step="01"
                title="Discovery — 1 week"
                blurb="We sit with your team, look at the data, and map the problem to a testable AI approach. Deliverable: a written scope with success criteria."
                isDarkMode={isDarkMode}
              />
              <EngagementRow
                step="02"
                title="Pilot — 4–8 weeks"
                blurb="A working system on a controlled slice of your data. Real evaluation curves, per-class F1, benchmark against your current baseline. If it doesn't work, we stop and refund the remainder."
                isDarkMode={isDarkMode}
              />
              <EngagementRow
                step="03"
                title="Production — 8–16 weeks"
                blurb="Full integration, SLA-backed inference, observability, retraining pipelines. Ships behind a feature flag on your infra. Your engineers own it after handoff."
                isDarkMode={isDarkMode}
              />
              <EngagementRow
                step="04"
                title="Partnership — ongoing"
                blurb="Dedicated engineering pod, custom model work, on-prem/VPC deployment, quarterly roadmap sync. Right-sized to your throughput, not vendor headcount."
                isDarkMode={isDarkMode}
              />
            </div>
          </div>

          {/* FAQ */}
          <div className="max-w-4xl mx-auto">
            <h2 className={`text-3xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-n-8'}`}>Common questions</h2>
            <div>
              <FaqRow
                q="Why not per-seat SaaS?"
                a="Because it doesn't map to the work. Production AI systems are integration + training + evaluation + on-call — none of that scales linearly with seats. We price on the actual scope."
                isDarkMode={isDarkMode}
              />
              <FaqRow
                q="What if the pilot fails?"
                a="If we can't hit the success criteria we agreed on in Discovery, we stop, hand back what we've built, and refund the remainder of the pilot fee. We'd rather have that be public than pretend the model worked."
                isDarkMode={isDarkMode}
              />
              <FaqRow
                q="Do you sign BAAs / SOC 2 / DPAs?"
                a="Yes. Healthcare, finance, and education engagements ship with BAAs, DPAs, and hardened deployment (on-prem or your VPC). Ask during Discovery."
                isDarkMode={isDarkMode}
              />
              <FaqRow
                q="Do you use OpenAI/Anthropic under the hood?"
                a="Sometimes — when the problem is best solved by a frontier model behind a private endpoint. We also train custom models when the domain rewards it (medical imaging, geospatial segmentation, ESC-50 audio, video scenes — all live on Hugging Face). We pick per project, not per vendor."
                isDarkMode={isDarkMode}
              />
              <FaqRow
                q="Who owns the code and models?"
                a="You do. Every engagement ships to your repos, your registries, your infra. We hand off runbooks and stay on call as long as you want us to."
                isDarkMode={isDarkMode}
              />
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-24 text-center">
            <Link
              to="/contact?inquiry=pricing"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition-colors"
            >
              <FiMessageSquare size={16} /> Start a Discovery Call
            </Link>
            <p className={`mt-4 text-xs font-mono uppercase tracking-widest ${isDarkMode ? 'text-white/40' : 'text-n-5'}`}>
              Or email <a href="mailto:contact@jedilabs.org" className="underline hover:text-yellow-400 transition-colors">contact@jedilabs.org</a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default PricingPage;
