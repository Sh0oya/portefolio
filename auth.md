# auth.md

> Agent authentication & registration guide for **mathieuhaye.fr**.
> Machine-readable companion to [`/.well-known/oauth-protected-resource`](https://mathieuhaye.fr/.well-known/oauth-protected-resource) and [`/.well-known/oauth-authorization-server`](https://mathieuhaye.fr/.well-known/oauth-authorization-server).

## TL;DR

**No authentication is required.** mathieuhaye.fr is a public, read-only portfolio. Every documented resource can be fetched anonymously over HTTPS with a plain `GET`. There is **nothing to register for, no API key to obtain, and no token to present.**

## Audience

This document is for autonomous agents, crawlers, and LLM-based assistants that want to read, summarize, cite, or answer questions about Mathieu Haye — développeur freelance spécialisé IA et automatisation (AI apps, automations, custom CRM).

## Identity model

| Property | Value |
|---|---|
| `identity_types_supported` | `anonymous` |
| Registration required | no |
| Credentials issued | none |
| Protected resources | none |
| Rate limit | be reasonable; standard shared-hosting limits apply |

## Recipe: discover → use

1. **Discover.** Fetch any public discovery document:
   - `https://mathieuhaye.fr/llms.txt` — plain-text site summary
   - `https://mathieuhaye.fr/index.md` — full portfolio as Markdown
   - `https://mathieuhaye.fr/.well-known/agent-skills/index.json` — Agent Skills index
   - `https://mathieuhaye.fr/.well-known/mcp/server-card.json` — MCP (WebMCP) server card
   - `https://mathieuhaye.fr/.well-known/api-catalog` — RFC 9727 linkset
2. **Register.** _Skip._ No registration step exists.
3. **Claim / token.** _Skip._ No credential is issued or accepted.
4. **Use.** `GET` any resource directly. Content negotiation is supported: send `Accept: text/markdown` on `/` and on blog article URLs to receive Markdown instead of HTML.
5. **Handle revoke.** _Not applicable_ — no credentials are issued, so none can be revoked.

## Content & training policy

Reading is welcome (`ai-input=yes`); training on this content without permission is not (`ai-train=no`). The authoritative policy lives in [`robots.txt`](https://mathieuhaye.fr/robots.txt) (Content Signals).

## Contact

A human owns this domain. For anything beyond reading public content (a partnership, a protected integration, a brief): **contact@mathieuhaye.fr** — or see [`/.well-known/security.txt`](https://mathieuhaye.fr/.well-known/security.txt).

---

*If a protected API is ever added here, this file and `/.well-known/oauth-authorization-server` will be updated with real `register_uri`, `claim_uri`, and `revocation_uri` endpoints. Until then, their absence is intentional and truthful: there is genuinely nothing to authenticate against.*
