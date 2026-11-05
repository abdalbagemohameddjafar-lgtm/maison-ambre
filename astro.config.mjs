// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Adresse publique du site (Cloudflare Pages)
  site: 'https://maison-ambre.pages.dev',
  vite: {
    build: {
      // Le flacon 3D (Three.js, ~550 Ko) est un morceau séparé, chargé seulement après
      // l'affichage de la page et si WebGL est disponible : sa taille est voulue.
      chunkSizeWarningLimit: 600,
    },
  },
});
