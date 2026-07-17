# Back office /admin, mode d'emploi

> Fichier interne (dossier `_docs/`, jamais uploade). Le back office est prive, non liste dans le sitemap/robots, noindex.

## Ce que c'est
Un back office PHP autonome a https://mathieuhaye.fr/admin (login requis). Pas de base de donnees : les leads sont des fichiers JSONL cote serveur, tout le reste est calcule a la volee.

## Installation (une seule fois)
1. Uploade sur IONOS : `admin.php` (racine, 644), `api/data/.htaccess` (644), le `.htaccess` racine (644), et les 3 fichiers modifies `api/ai-scan.php` (644), `api/contact.php` (644), `api/config.php` (**600**).
2. Ouvre https://mathieuhaye.fr/admin : la premiere fois, la page est en **mode setup**. Elle demande :
   - ton **jeton** = la valeur de `index_ping_token` (deja dans `api/config.php`), comme preuve que c'est toi ;
   - le **mot de passe admin** souhaite (12 caracteres minimum).
3. Elle affiche un **hash bcrypt**. Copie-le, colle-le dans `api/config.php` a la cle `'admin_password_hash' => '...'` (a la place de la valeur vide), re-uploade `config.php` en **600**.
4. Recharge /admin : tu as l'ecran de connexion normal (mot de passe seul).

## Onglets
- **Dashboard** : nb d'articles FR/EN, date du dernier article + cadence (alerte si > 3 jours), nb de scans et de contacts loggues, sante du site (home / robots.txt / llms.txt / sitemap.xml / en-tete Content-Signal en vert/rouge), liens rapides (Search Console, Bing, Analytics, IONOS, booking, LinkedIn Post Inspector).
- **Leads & scans** : chaque contact recu (contact.php) et chaque scan du scanner IA (ai-scan.php) est loggue (date, donnees, score/verdict, langue). Donnee de prospect chaud : qui teste son site ressent le probleme.
- **Articles** : les 20 derniers + checklist de publication (coller `_docs/articles-prompt.md` dans Claude Code).
- **Actions** : bouton « Ping indexation » (Google Indexing API + IndexNow via api/index-ping.php).

## Securite (deja en place, verifiee en revue adversariale)
- Login rate-limite atomique (6 essais / 15 min, flock), CSRF sur tous les formulaires, session durcie (HttpOnly, Secure, SameSite=Strict, liaison user-agent, regeneration d'ID), CSP stricte propre a l'admin, noindex a la fois cote PHP et cote Apache.
- Les logs `api/data/*.jsonl` ne sont jamais servis sur le web (double protection : `api/data/.htaccess` + regle `.jsonl` dans le `.htaccess` racine).
- Le mot de passe n'existe que sous forme de hash bcrypt ; ni le jeton ni la config ne sont jamais affiches.

## Bon a savoir
- Les leads ne s'accumulent que sur le serveur (fichiers dans `api/data/`, crees au premier scan/contact). En local ils sont vides, c'est normal.
- Changer de mot de passe : remets `admin_password_hash` a vide dans `config.php` cote serveur, recharge /admin, refais le setup.
