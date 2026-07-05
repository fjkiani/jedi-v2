#!/usr/bin/env python3
"""Generate OG images for Jedi Labs SEO framework.

All images are 1200x630 (Facebook/Twitter standard), Liberation Sans, on-brand palette.

Palette (from crispro.ai / Phylo brand):
  bg_dark    #000000
  bg_grid    #ECE9E2  (subtle grid)
  accent_1   #E9ED4C  (chartreuse — hero)
  accent_2   #FF9400  (orange — CTA)
  accent_3   #75A025  (green — success)
  accent_4   #0279EE  (blue — technical)
  fg_white   #FAF9F3
"""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

OUT_DIR = Path("/workspace/jedi-v2/public/og")
OUT_DIR.mkdir(parents=True, exist_ok=True)
DEFAULT_ROOT = Path("/workspace/jedi-v2/public")

W, H = 1200, 630
BG = (0, 0, 0)
GRID = (30, 30, 30)
FG = (250, 249, 243)
MUTED = (150, 150, 145)
ACCENT_1 = (233, 237, 76)     # chartreuse
ACCENT_2 = (255, 148, 0)      # orange
ACCENT_3 = (117, 160, 37)     # green
ACCENT_4 = (2, 121, 238)      # blue

FONT_BOLD = "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf"
FONT_REG = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
FONT_MONO = "/usr/share/fonts/truetype/liberation2/LiberationMono-Bold.ttf"

def font(size, mono=False, regular=False):
    if mono:
        return ImageFont.truetype(FONT_MONO, size)
    if regular:
        return ImageFont.truetype(FONT_REG, size)
    return ImageFont.truetype(FONT_BOLD, size)

def draw_grid(d):
    """Subtle grid background."""
    for x in range(0, W, 60):
        d.line([(x, 0), (x, H)], fill=GRID, width=1)
    for y in range(0, H, 60):
        d.line([(0, y), (W, y)], fill=GRID, width=1)

def draw_logo(d, x=60, y=60):
    """Draw 'JEDI LABS' wordmark."""
    d.text((x, y), "JEDI LABS", fill=ACCENT_1, font=font(28, mono=True))
    d.line([(x, y + 42), (x + 220, y + 42)], fill=ACCENT_1, width=2)

def draw_footer(d, tagline="jedilabs.org  ·  Production AI"):
    d.text((60, H - 60), tagline, fill=MUTED, font=font(20, mono=True))
    # right side badge
    d.rectangle([(W - 200, H - 70), (W - 60, H - 40)], outline=ACCENT_1, width=2)
    d.text((W - 190, H - 65), "CC BY 4.0", fill=ACCENT_1, font=font(18, mono=True))

def wrap_text(text, max_width, f, d):
    """Word-wrap text to fit within max_width."""
    words = text.split()
    lines = []
    current = []
    for w in words:
        test = " ".join(current + [w])
        bbox = d.textbbox((0, 0), test, font=f)
        if bbox[2] - bbox[0] <= max_width:
            current.append(w)
        else:
            if current:
                lines.append(" ".join(current))
            current = [w]
    if current:
        lines.append(" ".join(current))
    return lines

def make_og(filename, headline, subheadline=None, accent=ACCENT_1, badge=None, metrics=None, extra_footer=None):
    """Generate a single OG image."""
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)
    draw_grid(d)
    draw_logo(d)

    # Accent bar on left
    d.rectangle([(0, 200), (12, 460)], fill=accent)

    # Optional category badge
    y = 200
    if badge:
        badge_w = d.textbbox((0, 0), badge, font=font(20, mono=True))[2] + 40
        d.rectangle([(60, y), (60 + badge_w, y + 40)], outline=accent, width=2)
        d.text((80, y + 8), badge, fill=accent, font=font(20, mono=True))
        y += 60

    # Headline (auto-wrap)
    head_font = font(64)
    lines = wrap_text(headline, W - 140, head_font, d)
    for line in lines[:3]:
        d.text((60, y), line, fill=FG, font=head_font)
        y += 78

    y += 20

    # Sub-headline
    if subheadline:
        sub_font = font(28, regular=True)
        sub_lines = wrap_text(subheadline, W - 140, sub_font, d)
        for line in sub_lines[:2]:
            d.text((60, y), line, fill=MUTED, font=sub_font)
            y += 40

    # Metrics row (up to 3)
    if metrics:
        y = H - 180
        col_w = (W - 120) // len(metrics)
        for i, (value, label) in enumerate(metrics):
            cx = 60 + i * col_w
            d.text((cx, y), value, fill=accent, font=font(48, mono=True))
            d.text((cx, y + 60), label, fill=MUTED, font=font(18, mono=True))

    draw_footer(d, extra_footer or "jedilabs.org  ·  Production AI")
    img.save(OUT_DIR / filename, "PNG", optimize=True)
    print(f"  wrote {filename}  ({img.size[0]}x{img.size[1]})")

# ---- Generate all OG images referenced across the site ----

# Home / default
make_og(
    "og-home.png",
    "We solve what AI fails.",
    subheadline="Production AI systems across medical imaging, geospatial segmentation, audio classification, and video understanding.",
    accent=ACCENT_1,
    metrics=[
        ("0.9933", "Val accuracy"),
        ("0.9999", "Val IoU"),
        ("~5s", "Cold-start"),
    ],
)

# About / team
make_og(
    "og-about.png",
    "About Jedi Labs",
    subheadline="Team, vision, and production AI mission — shipping real numbers backed by reproducible code.",
    accent=ACCENT_2,
    badge="ABOUT",
)

make_og(
    "og-team.png",
    "The team behind Jedi Labs",
    subheadline="Engineers and researchers building production AI across imaging, geospatial, audio, and video.",
    accent=ACCENT_2,
    badge="TEAM",
)

# Benchmarks — headliner
make_og(
    "og-benchmarks.png",
    "Reproducible AI benchmarks",
    subheadline="Every number is on held-out validation, reproducible from GitHub, and live-inferrable on Hugging Face.",
    accent=ACCENT_1,
    badge="BENCHMARKS",
    metrics=[
        ("0.9933", "Chest X-ray val acc"),
        ("0.9999", "Coastline val IoU"),
        ("0.5666", "ESC-50 macro F1"),
    ],
)

# Glossary
make_og(
    "og-glossary.png",
    "Production AI Glossary",
    subheadline="Val IoU, macro F1, epoch collapse, cold-start inference, zero-shot — defined precisely.",
    accent=ACCENT_4,
    badge="REFERENCE",
)

# Explore
make_og(
    "og-explore.png",
    "Explore the Stack",
    subheadline="Browse technologies and use cases across the Jedi Labs production AI portfolio.",
    accent=ACCENT_4,
    badge="EXPLORE",
)

# Solutions (plural — index)
make_og(
    "og-solutions.png",
    "AI Solutions by Jedi Labs",
    subheadline="ML, NLP, AI agents, automation, data engineering — production-grade solutions.",
    accent=ACCENT_3,
    badge="SOLUTIONS",
)

# Solution (singular — detail)
make_og(
    "og-solution.png",
    "AI Solution — Jedi Labs",
    subheadline="Production AI capability with real metrics, deployed architecture, and reproducible code.",
    accent=ACCENT_3,
    badge="SOLUTION",
)

# Technology
make_og(
    "og-technology.png",
    "Technology Stack",
    subheadline="PyTorch, CLIP, Hugging Face Spaces, FastAPI, LangChain — the tools we ship on.",
    accent=ACCENT_4,
    badge="TECHNOLOGY",
)

# Default site-wide OG image (used by DEFAULT_META.ogImage → /og-image.jpg)
make_og(
    "og-default.png",
    "Jedi Labs — Production AI",
    subheadline="Model deployment, training, evaluation, and benchmarking for frontier-model teams and enterprises.",
    accent=ACCENT_1,
    metrics=[
        ("4", "Shipped demos"),
        ("100%", "Reproducible"),
        ("CC BY 4.0", "License"),
    ],
)

# Also save the default at /og-image.jpg (the path in DEFAULT_META)
img = Image.open(OUT_DIR / "og-default.png").convert("RGB")
img.save(DEFAULT_ROOT / "og-image.jpg", "JPEG", quality=88, optimize=True)
print(f"  wrote og-image.jpg at public/ root")

# Twitter image (same as default, but distinct filename for future tuning)
img.save(DEFAULT_ROOT / "twitter-image.jpg", "JPEG", quality=88, optimize=True)
print(f"  wrote twitter-image.jpg at public/ root")

print(f"\nDone. Files in {OUT_DIR}:")
for f in sorted(OUT_DIR.glob("*.png")):
    print(f"  {f.name} ({f.stat().st_size // 1024} KB)")
