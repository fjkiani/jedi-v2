# Blog UI/UX Improvement Ideas

Based on [jedilabs.org/blog/post/jedilabs](https://jedilabs.org/blog/post/jedilabs): the post is a single-column text dump with minimal visual hierarchy. Below are concrete improvements.

## Implemented (this pass)

1. **Readable line length** – Prose constrained to ~65ch so long lines don’t hurt readability.
2. **Hero and meta** – Clear hero with category pill, reading time, and stronger title/author/date.
3. **Section breaks** – H2s get visual separation (border/background) so sections scan better.
4. **End CTA** – After the body, a short CTA (e.g. "Explore JEDI solutions" / "Talk to us").
5. **Theme-aware** – Use theme context so body and headings work in light and dark.
6. **Related reads** – Explicit "Related reads" heading above adjacent posts.

## Recommended next

7. **Sticky table of contents** – Sidebar or collapsible TOC from H2/H3 for long posts.
8. **Pull quotes / key takeaway** – One highlighted sentence or "Key takeaway" block (from excerpt or first bold).
9. **Sidebar on desktop** – Categories + "Recent posts" or PostWidget in a right column.
10. **Reading progress** – Thin top bar that fills as you scroll.
11. **Share bar** – Fixed or inline Twitter/LinkedIn/Copy link.
12. **Author card** – Dedicated author bio + link to more posts.
13. **Featured image treatment** – Gradient overlay, or title-over-image hero.
14. **Loading state** – Skeleton (image + lines) instead of "Loading...".

## Files to change

- `src/components/hyGraph/PostDetail.jsx` – Hero, prose width, section styles, CTA, theme.
- `src/blog/BlogPage.tsx` – Layout (optional sidebar), "Related reads", loading skeleton.
