// Commitment Issues — tombstone badge for GitHub repo pages.
//
// Injects a small "Declared Dead" badge near the repo title when the
// commitmentissues.dev API reports deathIndex >= 6. Skips silently on any
// error so it never blocks the page.

(() => {
  'use strict';

  const API_BASE = 'https://commitmentissues.dev';
  const SITE_BASE = 'https://commitmentissues.dev';
  const DEATH_THRESHOLD = 6;
  const FETCH_TIMEOUT_MS = 4000;
  const BADGE_ID = 'commitmentissues-tombstone-badge';

  /**
   * Parse `owner/repo` from `/owner/repo` or `/owner/repo/<rest>`. Returns
   * null for non-repo paths like `/`, `/owner` (user/org page),
   * `/orgs/...`, `/settings`, `/explore`, etc.
   */
  function parseRepoFromPath(pathname) {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length < 2) return null;
    // GitHub reserves a small set of top-level paths that are NOT user/org
    // namespaces. Anything matching one is not a repo URL.
    const reservedTopLevel = new Set([
      'orgs', 'settings', 'explore', 'topics', 'trending', 'collections',
      'events', 'sponsors', 'marketplace', 'pricing', 'enterprise', 'features',
      'security', 'contact', 'about', 'login', 'logout', 'join', 'signup',
      'new', 'notifications', 'pulls', 'issues', 'stars', 'codespaces',
      'gist', 'apps', 'github-copilot', 'copilot', 'organizations',
    ]);
    if (reservedTopLevel.has(parts[0].toLowerCase())) return null;
    // The repo segment can't be a known per-user reserved subpath either.
    const reservedSecond = new Set(['followers', 'following', 'tabs', 'projects']);
    if (reservedSecond.has(parts[1].toLowerCase())) return null;
    return { owner: parts[0], name: parts[1] };
  }

  function findRepoTitleAnchor() {
    // GitHub's repo header anchors the repo name with this strong+a structure.
    // Try a few known-stable selectors before giving up.
    const candidates = [
      'strong[itemprop="name"] a',
      'h1 strong[itemprop="name"] a',
      'h1 a[data-pjax="#repo-content-pjax-container"]',
    ];
    for (const sel of candidates) {
      const el = document.querySelector(sel);
      if (el) return el;
    }
    return null;
  }

  function makeBadge(owner, name) {
    const fullName = `${owner}/${name}`;
    const a = document.createElement('a');
    a.id = BADGE_ID;
    a.href = `${SITE_BASE}/?repo=${encodeURIComponent(fullName)}`;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.title = 'Declared dead by commitmentissues.dev — view certificate';
    a.textContent = '🪦 Declared Dead — View Certificate →';
    Object.assign(a.style, {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      marginLeft: '8px',
      padding: '2px 8px',
      borderRadius: '12px',
      background: '#1e1e1e',
      color: '#e6e6e6',
      fontSize: '11px',
      fontWeight: '500',
      lineHeight: '18px',
      textDecoration: 'none',
      verticalAlign: 'middle',
      whiteSpace: 'nowrap',
    });
    return a;
  }

  async function fetchDeathIndex(owner, name) {
    const repoUrl = `https://github.com/${owner}/${name}`;
    const apiUrl = `${API_BASE}/api/repo?url=${encodeURIComponent(repoUrl)}`;
    let signal;
    try {
      signal = AbortSignal.timeout(FETCH_TIMEOUT_MS);
    } catch {
      const ctrl = new AbortController();
      setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
      signal = ctrl.signal;
    }
    const res = await fetch(apiUrl, { signal });
    if (!res.ok) return null;
    const body = await res.json();
    const idx = typeof body?.deathIndex === 'number' ? body.deathIndex : null;
    return idx;
  }

  let lastInjectedFor = null;

  async function tryInject() {
    const existing = document.getElementById(BADGE_ID);
    if (existing) existing.remove();

    const repo = parseRepoFromPath(location.pathname);
    if (!repo) {
      lastInjectedFor = null;
      return;
    }

    const fullName = `${repo.owner}/${repo.name}`;
    if (lastInjectedFor === fullName) return;

    const anchor = findRepoTitleAnchor();
    if (!anchor) return;

    let deathIndex = null;
    try {
      deathIndex = await fetchDeathIndex(repo.owner, repo.name);
    } catch {
      return;
    }
    if (deathIndex === null || deathIndex < DEATH_THRESHOLD) {
      lastInjectedFor = fullName;
      return;
    }

    const stillSamePage = parseRepoFromPath(location.pathname);
    if (!stillSamePage || `${stillSamePage.owner}/${stillSamePage.name}` !== fullName) {
      return;
    }

    const titleStrong = anchor.parentElement;
    const insertAfter = titleStrong?.parentElement === document.querySelector('h1')
      ? titleStrong
      : anchor;
    insertAfter.parentNode.insertBefore(makeBadge(repo.owner, repo.name), insertAfter.nextSibling);
    lastInjectedFor = fullName;
  }

  let lastUrl = location.href;
  function observeNavigation() {
    const fire = () => {
      if (location.href === lastUrl) return;
      lastUrl = location.href;
      tryInject();
    };
    window.addEventListener('popstate', fire);
    document.addEventListener('pjax:end', fire);
    document.addEventListener('turbo:load', fire);
    document.addEventListener('turbo:render', fire);
    const mo = new MutationObserver(() => {
      if (location.href !== lastUrl) fire();
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }

  tryInject();
  observeNavigation();
})();
