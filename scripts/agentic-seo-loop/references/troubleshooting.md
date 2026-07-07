# Troubleshooting

## Symptoms → causes

### `SEMRUSH_API_KEY missing` or `GEMMA_API_KEY missing`

Environment variables not set. Set both before invoking the orchestrator:

```bash
export SEMRUSH_API_KEY='...'
export GEMMA_API_KEY='...'
```

### `Cannot find package 'cheerio'`

The workers need `cheerio` in the target repo's `node_modules`. From the repo:

```bash
npm install --no-save cheerio
# or add to devDependencies permanently:
npm install --save-dev cheerio
```

### `gemma http 400: Thinking budget is not supported for this model`

Some Google models reject `generationConfig.thinkingConfig`. The client handles
this transparently — it caches the fact and retries the same model without
`thinkingConfig`. If you see this in logs it's noise; if you see the model
still fail after that, the model may be genuinely unhealthy — try
`--model=gemini-2.5-flash`.

### `gemma http 500: Internal error encountered` (repeated)

Google-side outage on the specific model. Options:
- Wait — outages typically clear in minutes-to-hours.
- Try a different model on the same key: `--model=gemini-2.5-flash`.
- Check available models: `curl -s -X GET "https://generativelanguage.googleapis.com/v1beta/models" -H "x-goog-api-key: $GEMMA_API_KEY"`.

### All Gemini proposals have `finishReason: MAX_TOKENS` and empty content

The model is burning all output tokens on thinking. Two paths:
1. Raise `maxOutputTokens` in `gemma.mjs`'s `DEFAULT_GENERATION` (currently 1500). Try 2500.
2. Switch to a model that honours `thinkingBudget=0`, e.g. Gemini 2.5 Flash (its default).

### `[analyst] semrush stats {throttled: N}`

The RapidAPI free tier's rate limit is unpublished; the client defaults to
1 req/sec and backs off 30s on 429. If throttling is heavy, raise `sleepMs`
in the `SemrushClient` construction.

### `[orch] audit failed`

Something in the LLM proposals or perf-fixer patches broke the site build or
regressed an audit. The branch is left dirty. To debug:

```bash
cd /path/to/repo
git status
git log --stat -1
# inspect the diff, edit or revert as needed, retry:
npm run build:prerender
npm run audit:all
```

Once the audit passes, commit + push manually. Or reset the branch and
re-run the orchestrator after fixing the underlying issue.

### `[orch] push failed: could not read Username`

Missing credentials for `origin`. Two options:
1. Configure a credential helper: `git config --global credential.helper store`
2. Rewrite the remote to include a token:
   ```
   git remote set-url origin https://<user>:<token>@github.com/<owner>/<repo>.git
   ```
   Or bake it into the branch config only:
   ```
   git config branch.<branch-name>.remote 'https://<user>:<token>@github.com/<owner>/<repo>.git'
   ```

### `[injector] no matching block` for a route

The content-injector only rewrites `<SEO title="..." description="...">` where
both are string literals. If the page uses `<SEO title={dynamicVar}>`, the
proposal is logged in `other-skipped` and no write happens. Options:
- Convert the SEO block to string literals if the value should be static.
- Add a manual override to `edits-applied.jsonl` after hand-editing.

### `dist/` missing

Run a build first:

```bash
cd /path/to/repo
npm run build:prerender
```

Then re-invoke the orchestrator.

## Emergency rollback

```bash
cd /path/to/repo

# Discard uncommitted work
git checkout .

# Return to base
git checkout round3-jedi-seo

# Delete local round-4 branch
git branch -D agent/round4-<timestamp>

# If already pushed to origin
git push origin --delete agent/round4-<timestamp>
```
