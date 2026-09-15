# easy / Shapes Studio

Ce depot est directement l'application Next.js du studio de motion design.

## Deploiement Vercel

Lors de la creation du projet Vercel, selectionner ce depot puis definir :

- **Root Directory** : laisser vide (racine du depot)
- **Framework Preset** : `Next.js`
- **Build Command** : `npm run build`
- **Install Command** : `npm ci`
- **Output Directory** : laisser la valeur par defaut de Next.js

Le fichier `vercel.json` rend le framework et les commandes explicites. Vercel detecte automatiquement l'application Next.js depuis la racine du depot et deploye `src/app` avec les assets de `public/`.

Les anciens fichiers de travail dans `web/` et `uploads/` sont ignores par Git ; ils ne font pas partie de l'application deployee.

## Developpement local

```bash
npm ci
npm run dev
```

Validation locale :

```bash
npm run lint
npm run build
```
