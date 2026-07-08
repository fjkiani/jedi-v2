// Reusable child-process spawner that broadcasts stdout+stderr to a set of SSE subscribers
// and also persists to a rolling log file on disk. Only ONE run per key at a time.

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const running = new Map(); // key -> { proc, subs:Set, log:string[] }

function broadcast(entry, evt) {
  for (const res of entry.subs) {
    try { res.write(`data: ${JSON.stringify(evt)}\n\n`); } catch { /* ignore closed */ }
  }
  entry.log.push(evt);
  if (entry.log.length > 4000) entry.log.splice(0, entry.log.length - 4000);
  if (entry.logFile) {
    try { fs.appendFileSync(entry.logFile, JSON.stringify(evt) + '\n'); } catch {}
  }
}

export function startProcess(key, { cmd, args, cwd, env, logFile }) {
  const existing = running.get(key);
  if (existing && existing.exitCode === null) {
    return { ok: false, error: `already running: ${key}` };
  }
  // If a prior run finished and is still in the replay buffer, evict it so
  // this new run gets a clean log slate.
  if (existing) running.delete(key);
  const proc = spawn(cmd, args, {
    cwd,
    env: { ...process.env, ...(env || {}), FORCE_COLOR: '0', NO_COLOR: '1' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  const entry = {
    proc,
    key,
    startedAt: new Date().toISOString(),
    endedAt: null,
    exitCode: null,
    subs: new Set(),
    log: [],
    logFile: logFile || null,
    cmd, args, cwd,
  };
  running.set(key, entry);

  const emit = (stream, line) => {
    if (!line.trim()) return;
    const evt = { ts: new Date().toISOString(), stream, line: line.slice(0, 4000) };
    broadcast(entry, evt);
  };

  const attach = (stream, name) => {
    let buf = '';
    stream.setEncoding('utf-8');
    stream.on('data', (chunk) => {
      buf += chunk;
      const lines = buf.split('\n');
      buf = lines.pop() || '';
      for (const l of lines) emit(name, l);
    });
    stream.on('end', () => { if (buf.length) emit(name, buf); });
  };
  attach(proc.stdout, 'stdout');
  attach(proc.stderr, 'stderr');

  proc.on('exit', (code, signal) => {
    entry.endedAt = new Date().toISOString();
    entry.exitCode = code == null ? -1 : code;
    const evt = { ts: entry.endedAt, stream: 'system', line: `[exit] code=${entry.exitCode} signal=${signal || 'none'}` };
    broadcast(entry, evt);
    // Keep entry around so late subscribers can replay
    setTimeout(() => { if (running.get(key) === entry) running.delete(key); }, 5 * 60_000);
  });

  return { ok: true, entry };
}

// Returns the entry regardless of exit state (for log replay). Use isActive()
// to test whether the process is still alive.
export function getRunning(key) {
  return running.get(key) || null;
}

export function isActive(key) {
  const e = running.get(key);
  return !!(e && e.exitCode === null);
}

export function subscribe(key, res) {
  const entry = running.get(key);
  if (!entry) return { ok: false, error: 'no run in progress for that key' };
  // Replay backlog
  for (const evt of entry.log) {
    try { res.write(`data: ${JSON.stringify(evt)}\n\n`); } catch { break; }
  }
  entry.subs.add(res);
  const cleanup = () => entry.subs.delete(res);
  res.on('close', cleanup);
  res.on('finish', cleanup);
  return { ok: true, entry };
}

export function killRun(key) {
  const entry = running.get(key);
  if (!entry) return { ok: false, error: 'not running' };
  try { entry.proc.kill('SIGTERM'); } catch {}
  return { ok: true };
}

export function listActive() {
  const out = [];
  for (const [key, entry] of running.entries()) {
    out.push({
      key,
      cmd: entry.cmd,
      args: entry.args,
      startedAt: entry.startedAt,
      endedAt: entry.endedAt,
      exitCode: entry.exitCode,
      running: entry.exitCode == null,
      lineCount: entry.log.length,
    });
  }
  return out;
}
