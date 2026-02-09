# Category Schema Enhancements

## Summary

The Category model in Hygraph has been enhanced with story-driven and display fields to support compelling category pages (e.g. Decision Algorithms, AI Agents).

## New Fields Added

### Story & Content

| Field | Type | Description |
|-------|------|-------------|
| `tagline` | String | Short punchy tagline |
| `problemStatement` | Rich Text | What problem does this category solve |
| `valueProposition` | Rich Text | Why this category matters - key benefits |
| `typicalUseCases` | Rich Text | Common applications and scenarios |
| `technologyNarrative` | Rich Text | Why these technologies fit |
| `keyOutcomes` | Rich Text | Typical results solutions deliver |

### Media & Display

| Field | Type | Description |
|-------|------|-------------|
| `heroImage` | Asset | Cover/hero image |
| `displayOrder` | Int | Order for display (lower = first) |
| `featured` | Boolean | Highlight on landing pages |

## Existing Fields (unchanged)

- name, slug, description
- posts, projects, useCase, technologies, technologySubcategory (relations)

## Tab Mapping (for Category detail pages)

| Tab | Fields |
|-----|--------|
| **Overview** | description, tagline, heroImage, valueProposition |
| **Problem** | problemStatement |
| **Use Cases** | typicalUseCases, useCase relation |
| **Technologies** | technologies relation, technologyNarrative |
| **Outcomes** | keyOutcomes |
