# Chat agent setup (mathieuhaye.fr)

Mini-guide pour activer le bloc "Est-on fait pour travailler ensemble ?" sur la home.

## 1. Génère ton profil JSON

Va sur https://claude.ai (Sonnet 4.5 ou +), colle ce prompt avec ton CV à jour :

```
Tu vas générer un fichier JSON structuré qui servira de "profil agent" pour
un chatbot sur mon site portfolio mathieuhaye.fr. Ce JSON sera chargé en
system prompt d'un agent Claude qui répond aux visiteurs (recruteurs,
fondateurs, clients potentiels) pour évaluer si on peut travailler ensemble.

Génère un JSON unique au format suivant, en français (avec champs en_summary
en anglais pour les visiteurs anglophones). Sois précis, factuel, jamais
vendeur. N'invente rien : si une info n'est pas dans mon CV, mets null.

{
  "identity": { "nom_complet":"", "titre_actuel":"", "localisation":"", "langues":[], "email":"mathieu.haye03@gmail.com" },
  "positionnement": { "fr":"", "en":"" },
  "situation_2026": { "statut":"", "msc_visee":"", "disponibilite_mission":"" },
  "competences": { "data_ia":[], "finance":[], "outils":[], "langages":[] },
  "experiences": [ {"role":"","entreprise":"","periode":"","impact_chiffre":""} ],
  "projets_phares": [ {"nom":"","description_courte":"","techno":[],"resultat_mesurable":""} ],
  "ce_que_je_cherche": { "missions_freelance":[], "secteurs":[], "deal_breakers":[] },
  "ce_que_je_n_offre_pas": [],
  "tarif_indicatif": { "tjm_freelance":"", "negociable_sur":"" },
  "ton_de_reponse": { "regles":[
    "Tutoiement OK si le visiteur tutoie, sinon vouvoiement",
    "Réponses courtes (3-5 phrases max sauf demande détaillée)",
    "Toujours finir par une question ou un CTA",
    "Si la demande matche bien -> proposer de prendre contact",
    "Si la demande ne matche pas -> le dire honnêtement, suggérer où chercher ailleurs",
    "Jamais inventer une expérience que je n'ai pas",
    "Jamais donner de tarif ferme, toujours dire 'à discuter selon scope'"
  ]}
}

Voici mon CV : [colle ton CV ici]
```

Sauvegarde la sortie JSON dans `/api/profile.json` (remplace le placeholder).

## 2. Crée ta clé Anthropic API

- https://console.anthropic.com/settings/keys → "Create Key"
- Copie la clé (`sk-ant-...`)
- Ajoute 5€ de crédit (console.anthropic.com/settings/billing) — tiendra 1500+ conversations sur Claude Haiku 4.5

## 3. Configure le serveur

1. Renomme `/api/config.example.php` en `/api/config.php`
2. Colle ta clé dans `'anthropic_key' => 'sk-ant-XXX'`
3. (Optionnel) Ajuste `rate_limit_per_h` si besoin

## 4. Upload sur IONOS

Via FileZilla :

```
/api/
  ├── .htaccess              (chmod 644)
  ├── chat.php               (chmod 644)
  ├── contact.php            (chmod 644)
  ├── config.php             (chmod 600) <- ta clé, plus restrictif
  └── profile.json           (chmod 644)
```

Ne PAS uploader `config.example.php` (ou supprime-le ensuite).

## 5. Vérifie

- Va sur https://mathieuhaye.fr/#agent
- Tape un message test
- Tu dois recevoir une réponse en quelques secondes
- Clique "Je peux vous recontacter ?" → remplis → tu reçois un mail sur mathieu.haye03@gmail.com

## Dépannage

- **500 "Server not configured"** : `config.php` manquant ou mal renommé
- **502 "Upstream model error"** : clé API invalide ou crédit épuisé → vérifie sur console.anthropic.com
- **Pas de mail reçu** : IONOS bloque parfois `mail()` sortant. Vérifie les logs serveur ; si bloqué, passer à un service tiers (Formspree, Web3Forms, Resend).
- **CORS** : si tu testes depuis localhost, ajoute temporairement ton origin dans `config.php` ou les headers de `chat.php`.

## Coût indicatif

- Claude Haiku 4.5 : ~$1/MTok input, ~$5/MTok output
- 1 échange typique = ~2 500 tokens in (profil + historique) + 300 tokens out
- Coût par échange : **~0,004 €**
- 5 € de crédit = ~1 250 échanges
