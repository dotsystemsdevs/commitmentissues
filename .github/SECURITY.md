# Security Policy

If you find a security issue, please **do not open a public issue or PR**. Reports are read and acted on quickly.

## Reporting

Use one of the following:

- [GitHub security advisories](https://github.com/dotsystemsdevs/commitmentissues/security/advisories/new) — preferred.
- Email: `dot.systems@proton.me`

Include:

- A clear description of the issue.
- Steps to reproduce, or a proof-of-concept.
- Affected version or commit SHA.
- Potential impact, and a suggested fix if you have one.

## What we treat as in scope

- Server-side bugs in any route under `src/app/api/`.
- Input handling on the public surface — repo URLs, usernames, badge / certificate parameters.
- CSP / header regressions in [`next.config.mjs`](../next.config.mjs).
- Anything that could leak server-side environment variables, exfiltrate stored data, or impersonate the service.

## Out of scope

- Vulnerabilities in upstream dependencies that don't affect our usage.
- Social-engineering or physical-access attacks.
- Anything requiring already-compromised end-user devices.

## Response

We aim to acknowledge reports within 72 hours and to ship a fix or mitigation as soon as practical.
Coordinated disclosure is appreciated.
