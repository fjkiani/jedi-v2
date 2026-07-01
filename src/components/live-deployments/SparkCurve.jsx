/**
 * SparkCurve — inline SVG dual-axis chart for HF Space training curves.
 *
 * Fetches `metrics.json` from the fjkiani/ai-training GitHub raw endpoint and
 * renders the real per-epoch history as two overlaid mini-lines:
 *   • train_val_acc  → train_loss (left axis, red-ish) + val_acc (right axis, green)
 *   • train_val_iou  → train_loss (left) + val_iou (right)
 *   • per_class_f1   → sorted per-class F1 bars (no epoch history in metrics.json for audio RF)
 *   • zero_shot      → static badge (video CLIP has no training curve)
 *
 * Design goals:
 *   • Zero bundle cost (no chart library — hand-rolled path).
 *   • Data-honest — every point is from the real committed metrics.json.
 *   • Fails gracefully — network failure or malformed JSON → renders nothing.
 */

import React, { useEffect, useState } from 'react';
import { FiZap } from 'react-icons/fi';

const CURVE_H = 44;
const CURVE_W = 260;
const PAD = 4;

// ─── Path builder ─────────────────────────────────────────────────────────────
const buildPath = (values, minY, maxY, w, h) => {
  if (!values || values.length === 0) return '';
  const range = maxY - minY || 1;
  const step = w / Math.max(values.length - 1, 1);
  return values
    .map((v, i) => {
      const x = i * step;
      const y = h - ((v - minY) / range) * h;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');
};

// ─── Curve type: train_loss + val metric ──────────────────────────────────────
const TrainValCurve = ({ history, valKey, valLabel, valFormat }) => {
  if (!history || history.length < 2) return null;
  const losses = history.map((h) => h.train_loss);
  const vals = history.map((h) => h[valKey]);

  const minLoss = 0;
  const maxLoss = Math.max(...losses);
  const minVal = Math.min(...vals);
  const maxVal = Math.max(...vals);

  const innerW = CURVE_W - PAD * 2;
  const innerH = CURVE_H - PAD * 2;

  const lossPath = buildPath(losses, minLoss, maxLoss, innerW, innerH);
  const valPath = buildPath(vals, minVal, maxVal, innerW, innerH);

  const finalVal = vals[vals.length - 1];
  const bestVal = valKey === 'train_loss' ? Math.min(...vals) : Math.max(...vals);
  const finalLoss = losses[losses.length - 1];

  return (
    <div className="mt-4 rounded-lg bg-white/3 border border-white/5 px-3 py-2.5">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[9px] font-mono uppercase tracking-wider text-white/40">
          Training history · {history.length} epochs
        </span>
        <div className="flex items-center gap-3 text-[10px] font-mono">
          <span className="text-red-400/80">
            loss <span className="text-white/70 tabular-nums">{finalLoss.toFixed(3)}</span>
          </span>
          <span className="text-green-400/80">
            {valLabel} <span className="text-white/70 tabular-nums">{valFormat(bestVal)}</span>
          </span>
        </div>
      </div>
      <svg
        width="100%"
        height={CURVE_H}
        viewBox={`0 0 ${CURVE_W} ${CURVE_H}`}
        preserveAspectRatio="none"
        className="block"
      >
        <g transform={`translate(${PAD} ${PAD})`}>
          {/* baseline */}
          <line x1="0" y1={CURVE_H - PAD * 2} x2={CURVE_W - PAD * 2} y2={CURVE_H - PAD * 2} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          {/* train_loss */}
          <path d={lossPath} stroke="rgba(248,113,113,0.7)" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
          {/* val metric */}
          <path d={valPath} stroke="rgba(74,222,128,0.9)" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
          {/* final val dot */}
          {vals.length > 0 && (() => {
            const range = (maxVal - minVal) || 1;
            const cx = (vals.length - 1) * ((CURVE_W - PAD * 2) / Math.max(vals.length - 1, 1));
            const cy = (CURVE_H - PAD * 2) - ((finalVal - minVal) / range) * (CURVE_H - PAD * 2);
            return <circle cx={cx} cy={cy} r="2.2" fill="rgba(74,222,128,1)" />;
          })()}
        </g>
      </svg>
    </div>
  );
};

// ─── Curve type: per-class F1 (sorted) ────────────────────────────────────────
const PerClassF1Bars = ({ report, classNames }) => {
  if (!report || !classNames) return null;

  // Build (class, f1) tuples, sort by f1 desc, keep top ~50 (all)
  const entries = classNames
    .map((name, idx) => {
      const key = String(idx);
      const row = report[key];
      return row ? { name, f1: row['f1-score'] || 0 } : null;
    })
    .filter(Boolean);

  if (entries.length === 0) return null;
  const sorted = [...entries].sort((a, b) => b.f1 - a.f1);
  const bars = sorted.slice(0, 50);
  const barW = (CURVE_W - PAD * 2) / bars.length;
  const meanF1 = entries.reduce((s, e) => s + e.f1, 0) / entries.length;
  const topF1 = sorted[0].f1;

  return (
    <div className="mt-4 rounded-lg bg-white/3 border border-white/5 px-3 py-2.5">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[9px] font-mono uppercase tracking-wider text-white/40">
          Per-class F1 · {entries.length} classes
        </span>
        <div className="flex items-center gap-3 text-[10px] font-mono">
          <span className="text-yellow-400/80">
            top <span className="text-white/70 tabular-nums">{topF1.toFixed(2)}</span>
          </span>
          <span className="text-green-400/80">
            mean <span className="text-white/70 tabular-nums">{meanF1.toFixed(2)}</span>
          </span>
        </div>
      </div>
      <svg
        width="100%"
        height={CURVE_H}
        viewBox={`0 0 ${CURVE_W} ${CURVE_H}`}
        preserveAspectRatio="none"
        className="block"
      >
        <g transform={`translate(${PAD} ${PAD})`}>
          {bars.map((b, i) => {
            const h = b.f1 * (CURVE_H - PAD * 2);
            const x = i * barW;
            const y = (CURVE_H - PAD * 2) - h;
            return (
              <rect
                key={i}
                x={x + 0.3}
                y={y}
                width={Math.max(barW - 0.6, 0.5)}
                height={h}
                fill={b.f1 >= 0.6 ? 'rgba(74,222,128,0.85)' : b.f1 >= 0.4 ? 'rgba(250,204,21,0.75)' : 'rgba(248,113,113,0.65)'}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
};

// ─── Zero-shot badge (video card) ────────────────────────────────────────────
const ZeroShotBadge = () => (
  <div className="mt-4 rounded-lg bg-white/3 border border-white/5 px-3 py-2.5">
    <div className="flex items-center justify-between">
      <span className="text-[9px] font-mono uppercase tracking-wider text-white/40">
        Inference mode
      </span>
      <span className="flex items-center gap-1.5 text-[10px] font-mono text-yellow-400">
        <FiZap size={10} /> Zero-shot · no fine-tuning
      </span>
    </div>
    <div className="mt-2 flex items-center gap-1 h-[28px]">
      {/* Fake spectrum-like probability bars — but honest: they're decorative for CLIP */}
      {[0.42, 0.28, 0.15, 0.08, 0.04, 0.02, 0.01].map((p, i) => (
        <div
          key={i}
          className="rounded-t"
          style={{
            width: `${100 / 7}%`,
            height: `${p * 100}%`,
            background: `rgba(74,222,128,${0.35 + p})`,
          }}
        />
      ))}
    </div>
    <div className="mt-1 text-[9px] font-mono text-white/30">
      Illustrative CLIP top-K distribution
    </div>
  </div>
);

// ─── Main component ──────────────────────────────────────────────────────────
const SparkCurve = ({ implementation }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  const impl = implementation || {};
  const curveType = impl.curve_type;
  const metricsUrl = impl.metrics_url;

  useEffect(() => {
    if (!metricsUrl || curveType === 'zero_shot') return;
    let cancelled = false;
    fetch(metricsUrl, { cache: 'force-cache' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((j) => { if (!cancelled) setData(j); })
      .catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; };
  }, [metricsUrl, curveType]);

  if (curveType === 'zero_shot') return <ZeroShotBadge />;
  if (error || !data) return null;

  switch (curveType) {
    case 'train_val_acc':
      return (
        <TrainValCurve
          history={data.history}
          valKey="val_acc"
          valLabel="best val_acc"
          valFormat={(v) => v.toFixed(3)}
        />
      );
    case 'train_val_iou':
      return (
        <TrainValCurve
          history={data.history}
          valKey="val_iou"
          valLabel="best val_iou"
          valFormat={(v) => v.toFixed(4)}
        />
      );
    case 'per_class_f1':
      return <PerClassF1Bars report={data.report} classNames={data.class_names} />;
    default:
      return null;
  }
};

export default SparkCurve;
