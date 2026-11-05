# Maison Ambre — Site vitrine de parfumerie

Site vitrine pour une parfumerie de créateur (boutique fictive), réalisé avec [Astro](https://astro.build).

> Projet de démonstration — les informations de la boutique, les produits et leurs compositions sont fictifs.

## Fonctionnalités

- **Catalogue de parfums** avec filtre par famille olfactive (Oriental, Floral, Boisé…)
- **Page détaillée par parfum**, générée automatiquement : pyramide olfactive, composition en pourcentages, liste INCI et allergènes
- **Informations pratiques** : adresse, itinéraire, horaires d'ouverture
- **Formulaire de contact** (Web3Forms, anti-spam) et pages légales (RGPD)
- **Responsive** : menu burger sur mobile
- **Référencement** : données structurées schema.org (`Store`, `Product`), balises Open Graph
- **Respect de la vie privée** : aucun cookie, polices hébergées localement
- **Accessibilité** : navigation clavier, lien d'évitement, contrastes soignés
- Page 404 personnalisée

## Lancer le projet

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # génère le site dans dist/
```

## Structure

```
src/
├── data/parfums.ts          # catalogue (ajouter un parfum ici crée sa page)
├── layouts/Layout.astro     # gabarit commun : en-tête, pied de page, styles
├── components/              # Flacon, CarteParfum
└── pages/
    ├── index.astro          # accueil
    ├── parfums/[slug].astro # page de chaque parfum
    ├── mentions-legales.astro
    └── 404.astro
```


## Formulaire de contact (Web3Forms)

Le formulaire envoie les messages via [Web3Forms](https://web3forms.com). Aucune adresse e-mail
n'est écrite dans le code : l'adresse de réception est celle du compte Web3Forms.

1. Créer une clé gratuite sur <https://web3forms.com> avec l'adresse qui doit recevoir les messages.
2. Copier `.env.example` en `.env` et coller la clé : `PUBLIC_WEB3FORMS_KEY=xxxxxxxx`.
3. Sur Cloudflare Pages : *Settings → Variables and secrets* → ajouter `PUBLIC_WEB3FORMS_KEY`,
   puis relancer un déploiement.

Sans clé, le formulaire reste utilisable en **mode démo** : validation normale, message de
confirmation, mais rien n'est envoyé. La case cachée `botcheck` sert de piège à robots (honeypot).

## Mise en ligne (Cloudflare Pages)

Le site est hébergé par **Cloudflare Pages** (c'est l'hébergeur indiqué dans les mentions légales,
données dans `src/data/societe.ts`). Adresse : <https://maison-ambre.pages.dev>.

- Dépôt GitHub relié : chaque `git push` sur `main` redéploie automatiquement.
- **Build command** : `npm run build`
- **Build output directory** : `dist`
- **Version de Node** : fixée par le fichier `.node-version` (24), nécessaire à Astro 7.
- **Variable** : `PUBLIC_WEB3FORMS_KEY` (voir ci-dessus).
- L'adresse publique est déclarée dans `astro.config.mjs` (`site`) : à changer en cas de nom de domaine.

Créer le projet la première fois : Cloudflare → *Workers & Pages → Create → Pages → Connect to Git*,
choisir le dépôt, preset **Astro**, puis les réglages ci-dessus.
