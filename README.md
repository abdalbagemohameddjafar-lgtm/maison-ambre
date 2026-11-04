# Maison Ambre — Site vitrine de parfumerie

Site vitrine pour une parfumerie de créateur (boutique fictive), réalisé avec [Astro](https://astro.build).

> Projet de démonstration — les informations de la boutique, les produits et leurs compositions sont fictifs.

## Fonctionnalités

- **Catalogue de parfums** avec filtre par famille olfactive (Oriental, Floral, Boisé…)
- **Page détaillée par parfum**, générée automatiquement : pyramide olfactive, composition en pourcentages, liste INCI et allergènes
- **Informations pratiques** : adresse, itinéraire, horaires d'ouverture
- **Formulaire de contact** et mentions légales (RGPD)
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
