import fs from 'node:fs';
import path from 'node:path';

export function readJsonSafe(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf-8'));
  } catch {
    return null;
  }
}

export function readJsonlSafe(p) {
  try {
    if (!fs.existsSync(p)) return [];
    const raw = fs.readFileSync(p, 'utf-8');
    return raw.split('\n').filter(Boolean).map((line) => {
      try { return JSON.parse(line); } catch { return { _parseError: line }; }
    });
  } catch {
    return [];
  }
}

export function readText(p, max = 200_000) {
  try {
    const stat = fs.statSync(p);
    if (stat.size > max) {
      const buf = Buffer.alloc(max);
      const fd = fs.openSync(p, 'r');
      fs.readSync(fd, buf, 0, max, Math.max(0, stat.size - max));
      fs.closeSync(fd);
      return `... [truncated to last ${max} bytes] ...\n` + buf.toString('utf-8');
    }
    return fs.readFileSync(p, 'utf-8');
  } catch {
    return null;
  }
}

export function listRunDirs(runsDir) {
  try {
    if (!fs.existsSync(runsDir)) return [];
    return fs.readdirSync(runsDir)
      .filter((n) => n.startsWith('round4-') || n.startsWith('round') || n.startsWith('cms-'))
      .map((name) => {
        const full = path.join(runsDir, name);
        const manifest = readJsonSafe(path.join(full, 'manifest.json'));
        const auditDiff = readJsonSafe(path.join(full, 'audit-diff.json'));
        return {
          run_id: name,
          path: full,
          started_at: manifest?.started_at || null,
          ended_at: manifest?.ended_at || null,
          agent_branch: manifest?.agent_branch || null,
          commit_sha: manifest?.commit_sha || null,
          seed_count: manifest?.seed_count || null,
          multi_h1_delta: auditDiff?.multi_h1_offenders
            ? [auditDiff.multi_h1_offenders.before_count, auditDiff.multi_h1_offenders.after_count]
            : null,
        };
      })
      .sort((a, b) => (b.run_id || '').localeCompare(a.run_id || ''));
  } catch {
    return [];
  }
}
