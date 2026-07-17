# DNS-AID Setup — DNS for AI Discovery (mathieuhaye.fr)

Records DNS à poser pour la découverte d'agents au niveau DNS (draft IETF
`draft-mozleywilliams-dnsop-dnsaid`, s'appuyant sur SVCB/HTTPS — RFC 9460).

> ⚠️ **Lis d'abord ça.** DNS-AID est un standard **très expérimental** (draft IETF, pas
> encore un RFC). Ton site expose **déjà** toute sa découverte au niveau HTTP
> (`.well-known/agent-skills/index.json`, `mcp/server-card.json`, `api-catalog`,
> `llms.txt`, `auth.md`). DNS-AID n'ajoute qu'un **canal de découverte redondant au
> niveau DNS**. Bénéfice réel : marginal aujourd'hui. À faire seulement si tu veux
> cocher la case "isitagentready" à 100 %.

---

## 1. Le record à poser (le seul qui soit honnête pour ce site)

Ton site n'expose **pas** de serveur A2A ni de endpoint MCP distant (le MCP est
"WebMCP" in-browser, pas de endpoint serveur). Donc on ne publie **PAS**
`_a2a._agents` ni `_mcp._agents` : ce serait mentir aux agents. On publie uniquement
le point d'entrée d'**index de découverte**, qui pointe vers l'hôte HTTPS qui sert
déjà les documents `.well-known`.

### Format zone-file (BIND)
```
_index._agents.mathieuhaye.fr. 3600 IN SVCB 1 mathieuhaye.fr. alpn="h2,http/1.1" port=443 mandatory=alpn,port
```

### Si le panneau DNS demande des champs séparés
| Champ | Valeur |
|---|---|
| Type | `SVCB` (ou `HTTPS` si SVCB indisponible) |
| Nom / Host | `_index._agents` |
| TTL | `3600` |
| Priority (SvcPriority) | `1` |
| Target | `mathieuhaye.fr` |
| Params (Value) | `alpn="h2,http/1.1" port=443 mandatory=alpn,port` |

Le point d'entrée de découverte servi derrière ce record est :
`https://mathieuhaye.fr/.well-known/agent-skills/index.json`

> Note : la spec mentionne un paramètre custom `endpoint` au format `keyNNNNN`
> (SvcParamKey numérique non encore enregistré officiellement). Tant qu'il n'est pas
> standardisé, on s'en tient à `alpn` + `port`, suffisants pour un statut "pass".

---

## 2. DNSSEC (obligatoire pour DNS-AID)

La spec exige de **signer la zone avec DNSSEC** pour que les resolveurs validants
renvoient des données authentifiées.

- **IONOS** : Domaines → `mathieuhaye.fr` → onglet DNSSEC → **Activer**. IONOS génère
  et publie les clés (DS) automatiquement si le domaine est chez eux. 1 clic.

---

## 3. ⚠️ Limite IONOS — et la vraie solution

La plupart des panneaux DNS IONOS **n'offrent pas le type d'enregistrement SVCB**, et
beaucoup **refusent les labels en underscore** (`_index._agents`) pour autre chose que
TXT/SRV. Si c'est ton cas, **DNS-AID est bloqué chez IONOS** (même logique que le bug
Google : ce n'est pas toi, c'est l'outil).

### Solution propre : passer le DNS sur Cloudflare (gratuit)
Tu gardes l'hébergement IONOS, tu délègues **uniquement le DNS** à Cloudflare :
1. Crée un compte Cloudflare (gratuit) → "Add site" `mathieuhaye.fr`.
2. Cloudflare importe tes records actuels. Vérifie que A/CNAME/MX/TXT sont identiques.
3. Chez IONOS : remplace les **nameservers** par ceux de Cloudflare.
4. Sur Cloudflare : **DNS → Records → Add record → type SVCB** (supporté nativement),
   colle le record du §1.
5. **DNS → Settings → DNSSEC → Enable** (1 clic, Cloudflare donne le DS à coller chez
   IONOS si besoin).

Cloudflare gère SVCB/HTTPS custom **et** DNSSEC en un clic — IONOS ni l'un ni l'autre
de façon fiable.

---

## 4. Vérification

- DoH (Cloudflare) :
  `https://cloudflare-dns.com/dns-query?name=_index._agents.mathieuhaye.fr&type=SVCB`
  (header `Accept: application/dns-json`)
- Re-scan `https://isitagentready.com` → `checks.discoverability.dnsAid.status` doit
  passer à `"pass"`.

---

## 5. Verdict / priorité

| | |
|---|---|
| Effort | Moyen (probable migration DNS → Cloudflare) |
| Risque | Faible si les records sont recopiés à l'identique avant de switcher les NS |
| Bénéfice SEO/GEO | **Marginal** (la découverte HTTP existe déjà et suffit aux agents) |
| Recommandation | Optionnel. À faire un jour de calme, pas une priorité. |

Si tu veux, je te génère la **liste exacte de tes records actuels à recopier** dans
Cloudflare avant le switch — dis-moi.
