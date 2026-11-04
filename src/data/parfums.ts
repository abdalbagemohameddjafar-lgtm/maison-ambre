// Catalogue de la boutique : ajoutez, modifiez ou supprimez des parfums ici.
// Chaque parfum obtient automatiquement sa propre page : /parfums/<slug>

export type Parfum = {
  slug: string;
  nom: string;
  famille: string;
  prix: number; // en euros
  contenance: string;
  description: string;
  notes: { tete: string[]; coeur: string[]; fond: string[] };
  couleur: string; // teinte du flacon dessiné en CSS
  nouveau?: boolean;
  // Type de jus et part de concentré de parfum dans le flacon
  concentration: { type: string; pourcentage: number };
  // Répartition du concentré de parfum par ingrédient (le total doit faire 100)
  composition: { ingredient: string; pourcentage: number }[];
  // Allergènes à déclarer sur l'étiquette (réglementation européenne)
  allergenes: string[];
};

export const parfums: Parfum[] = [
  {
    slug: "ambre-nocturne",
    nom: "Ambre Nocturne",
    famille: "Oriental",
    prix: 89,
    contenance: "50 ml",
    description:
      "Notre signature. Un ambre chaud et enveloppant, adouci par la vanille et réveillé par une pointe de safran.",
    notes: {
      tete: ["Safran", "Bergamote"],
      coeur: ["Ambre", "Rose de Damas"],
      fond: ["Vanille", "Bois de santal"],
    },
    couleur: "#c8873a",
    concentration: { type: "Eau de parfum", pourcentage: 18 },
    composition: [
      { ingredient: "Résinoïde d'ambre", pourcentage: 22 },
      { ingredient: "Absolue de vanille", pourcentage: 18 },
      { ingredient: "Bois de santal", pourcentage: 15 },
      { ingredient: "Rose de Damas", pourcentage: 12 },
      { ingredient: "Bergamote", pourcentage: 10 },
      { ingredient: "Musc", pourcentage: 10 },
      { ingredient: "Benjoin", pourcentage: 8 },
      { ingredient: "Safran", pourcentage: 5 },
    ],
    allergenes: ["Linalool", "Limonene", "Coumarin", "Geraniol", "Citronellol"],
  },
  {
    slug: "jardin-de-grasse",
    nom: "Jardin de Grasse",
    famille: "Floral",
    prix: 75,
    contenance: "50 ml",
    description:
      "Une promenade matinale dans les champs de fleurs de Grasse : jasmin, tubéreuse et une rosée verte.",
    notes: {
      tete: ["Feuille de violette", "Poire"],
      coeur: ["Jasmin", "Tubéreuse"],
      fond: ["Musc blanc", "Iris"],
    },
    couleur: "#e7a9b8",
    nouveau: true,
    concentration: { type: "Eau de parfum", pourcentage: 16 },
    composition: [
      { ingredient: "Absolue de jasmin", pourcentage: 25 },
      { ingredient: "Tubéreuse", pourcentage: 18 },
      { ingredient: "Musc blanc", pourcentage: 15 },
      { ingredient: "Iris", pourcentage: 12 },
      { ingredient: "Néroli", pourcentage: 12 },
      { ingredient: "Poire", pourcentage: 10 },
      { ingredient: "Feuille de violette", pourcentage: 8 },
    ],
    allergenes: ["Benzyl Benzoate", "Linalool", "Benzyl Salicylate", "Farnesol"],
  },
  {
    slug: "cedre-sauvage",
    nom: "Cèdre Sauvage",
    famille: "Boisé",
    prix: 82,
    contenance: "50 ml",
    description:
      "Un sillage boisé et fumé, comme un feu de bois en forêt. Puissant, élégant, inoubliable.",
    notes: {
      tete: ["Poivre noir", "Cardamome"],
      coeur: ["Cèdre de l'Atlas", "Cuir"],
      fond: ["Vétiver", "Encens"],
    },
    couleur: "#6b7f5a",
    concentration: { type: "Eau de parfum", pourcentage: 18 },
    composition: [
      { ingredient: "Cèdre de l'Atlas", pourcentage: 28 },
      { ingredient: "Vétiver", pourcentage: 18 },
      { ingredient: "Accord cuir", pourcentage: 14 },
      { ingredient: "Encens (oliban)", pourcentage: 12 },
      { ingredient: "Poivre noir", pourcentage: 10 },
      { ingredient: "Patchouli", pourcentage: 10 },
      { ingredient: "Cardamome", pourcentage: 8 },
    ],
    allergenes: ["Limonene", "Linalool", "Eugenol"],
  },
  {
    slug: "brise-marine",
    nom: "Brise Marine",
    famille: "Frais",
    prix: 65,
    contenance: "50 ml",
    description:
      "La fraîcheur de l'océan en été : agrumes pétillants, sel marin et une touche de figue.",
    notes: {
      tete: ["Citron de Sicile", "Pamplemousse"],
      coeur: ["Accord marin", "Figue"],
      fond: ["Ambrette", "Bois flotté"],
    },
    couleur: "#7fb3c8",
    nouveau: true,
    concentration: { type: "Eau de toilette", pourcentage: 12 },
    composition: [
      { ingredient: "Accord marin", pourcentage: 22 },
      { ingredient: "Citron de Sicile", pourcentage: 20 },
      { ingredient: "Pamplemousse", pourcentage: 15 },
      { ingredient: "Figue", pourcentage: 13 },
      { ingredient: "Bois flotté", pourcentage: 12 },
      { ingredient: "Ambrette", pourcentage: 10 },
      { ingredient: "Menthe", pourcentage: 8 },
    ],
    allergenes: ["Limonene", "Citral", "Linalool", "Geraniol"],
  },
  {
    slug: "oud-imperial",
    nom: "Oud Impérial",
    famille: "Oriental",
    prix: 129,
    contenance: "50 ml",
    description:
      "Notre création la plus précieuse. Un oud profond, sublimé par la rose et le patchouli.",
    notes: {
      tete: ["Rose turque", "Framboise"],
      coeur: ["Oud", "Patchouli"],
      fond: ["Ambre gris", "Labdanum"],
    },
    couleur: "#5a2e3a",
    concentration: { type: "Extrait de parfum", pourcentage: 25 },
    composition: [
      { ingredient: "Oud", pourcentage: 26 },
      { ingredient: "Rose turque", pourcentage: 20 },
      { ingredient: "Patchouli", pourcentage: 16 },
      { ingredient: "Ambre gris", pourcentage: 12 },
      { ingredient: "Labdanum", pourcentage: 10 },
      { ingredient: "Framboise", pourcentage: 6 },
      { ingredient: "Bois de santal", pourcentage: 6 },
      { ingredient: "Safran", pourcentage: 4 },
    ],
    allergenes: ["Citronellol", "Geraniol", "Eugenol", "Linalool"],
  },
  {
    slug: "fleur-de-coton",
    nom: "Fleur de Coton",
    famille: "Musqué",
    prix: 59,
    contenance: "50 ml",
    description:
      "La douceur du linge propre et d'une peau fraîchement lavée. Délicat et réconfortant.",
    notes: {
      tete: ["Aldéhydes", "Fleur d'oranger"],
      coeur: ["Fleur de coton", "Muguet"],
      fond: ["Musc", "Cachemire"],
    },
    couleur: "#d9d3c7",
    concentration: { type: "Eau de toilette", pourcentage: 10 },
    composition: [
      { ingredient: "Musc", pourcentage: 30 },
      { ingredient: "Accord fleur de coton", pourcentage: 22 },
      { ingredient: "Accord cachemire", pourcentage: 15 },
      { ingredient: "Muguet", pourcentage: 12 },
      { ingredient: "Fleur d'oranger", pourcentage: 10 },
      { ingredient: "Aldéhydes", pourcentage: 6 },
      { ingredient: "Héliotrope", pourcentage: 5 },
    ],
    allergenes: ["Hexyl Cinnamal", "Hydroxycitronellal", "Linalool", "Coumarin"],
  },
];

export const formatPrix = (prix: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(prix);
