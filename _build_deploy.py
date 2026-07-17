# -*- coding: utf-8 -*-
"""Rebuild _deploy/ : miroir pret-a-uploader du site (IONOS).

Usage : python _build_deploy.py  (depuis la racine du repo)

Inclut les secrets api/config.php + api/google-sa.json (workflow assume :
_deploy est la source d'upload complete). Exclut les docs internes (_docs/),
les gabarits (_*.html), les scripts et fichiers de travail (_*.py, _*.md...).
"""
import os, shutil, fnmatch

SRC, DST = '.', '_deploy'
EXCLUDE_DIRS = {'.claude', '_deploy', '_docs', '_contenu', '.git', 'node_modules'}
EXCLUDE_FILES = {'google-sa.json', 'assets/index.html'}  # racine uniquement (api/google-sa.json reste inclus)
EXCLUDE_GLOBS = ['_*.md', '_*.py', '_*.html', '_*.js', '_*.png', 'iar*.json', '*.bak', '.DS_Store']


def rel(p):
    return os.path.relpath(p, SRC).replace(os.sep, '/')


def main():
    if os.path.isdir(DST):
        shutil.rmtree(DST)
    copied = 0
    for root, dirs, files in os.walk(SRC):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        for fn in files:
            r = rel(os.path.join(root, fn))
            if r == DST or r.startswith(DST + '/'):
                continue
            if r in EXCLUDE_FILES or any(fnmatch.fnmatch(fn, g) for g in EXCLUDE_GLOBS):
                continue
            d = os.path.join(DST, r)
            os.makedirs(os.path.dirname(d), exist_ok=True)
            shutil.copy2(os.path.join(root, fn), d)
            copied += 1
    print('DEPLOY:', copied, 'fichiers')
    print('Rappel permissions serveur : secrets (api/config.php, api/google-sa.json) 600, le reste 644, dossiers 755.')


if __name__ == '__main__':
    main()
