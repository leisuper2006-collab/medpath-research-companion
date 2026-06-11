# Rapid Publish Mode

Purpose: publish the current website quickly so collaborators and GPT can inspect the real public URL before the next visual/content iteration.

## What changed

- GitHub Pages workflow now builds and deploys the static site without running strict design/readiness audits as hard gates.
- CI still runs API tests and static build.
- Strict release/readiness checks are kept as non-blocking checks so they can guide the next revision without preventing public access.

## Why

The project currently needs a public URL for external review. Some older checks are intentionally strict and still flag visual-design issues such as responsive font sizing or large rounded interactive widgets. Those should become improvement tasks, not deployment blockers.

## Boundary

This does not mean the design is final. It only means the current prototype is public and can be reviewed. Medical AI outputs remain for teaching and research training only and do not replace clinical diagnosis.
