import { execSync } from 'node:child_process';

function sh(cmd, cwd) {
  try {
    return execSync(cmd, { cwd, encoding: 'utf-8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  } catch (e) {
    return `ERROR: ${e.message}`;
  }
}

export function gitStatus(cwd) {
  return {
    branch: sh('git branch --show-current', cwd),
    head_sha: sh('git rev-parse HEAD', cwd),
    head_message: sh('git log -1 --pretty=%s', cwd),
    head_author: sh('git log -1 --pretty=%an', cwd),
    head_date: sh('git log -1 --pretty=%ai', cwd),
    dirty_files: sh('git status --porcelain', cwd).split('\n').filter(Boolean),
    recent_log: sh('git log --oneline -10', cwd).split('\n').filter(Boolean),
    remote_url: sh('git config --get remote.origin.url', cwd),
  };
}

export function gitBranches(cwd) {
  return {
    local: sh('git branch --format="%(refname:short)"', cwd).split('\n').filter(Boolean),
    remote_agent: sh('git branch -r --format="%(refname:short)"', cwd).split('\n').filter((b) => b.includes('agent/')),
  };
}
