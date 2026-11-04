// Catalogue de la boutique : ajoutez, modifiez ou supprimez des parfums dans la liste « catalogue » plus bas.
// Chaque parfum obtient automatiquement sa propre page : /parfums/<slug> (le slug est créé à partir du nom).

export type Famille =
  | "Floral"
  | "Fruité"
  | "Frais"
  | "Boisé"
  | "Oriental"
  | "Gourmand"
  | "Musqué"
  | "Aromatique";
export type Genre = "Femme" | "Homme" | "Mixte";
export type Moment = "Jour" | "Soir" | "Jour et soir";
export type TypeJus = "Eau de Cologne" | "Eau de toilette" | "Eau de parfum" | "Extrait de parfum";

export type Parfum = {
  slug: string;
  nom: string;
  famille: Famille;
  genre: Genre;
  intensite: 1 | 2 | 3; // 1 = légère, 2 = modérée, 3 = intense
  moment: Moment;
  prix: number; // en euros
  contenance: string;
  description: string;
  notes: { tete: string[]; coeur: string[]; fond: string[] };
  couleur: string; // teinte du flacon dessiné en CSS
  popularite: number; // de 0 à 100, sert au tri « Meilleures ventes »
  nouveau?: boolean;
  // Type de jus et part de concentré de parfum dans le flacon
  concentration: { type: TypeJus; pourcentage: number };
  // Répartition du concentré de parfum par ingrédient (le total doit faire 100)
  composition: { ingredient: string; pourcentage: number }[];
  // Allergènes à déclarer sur l'étiquette (réglementation européenne)
  allergenes: string[];
};

export const familles: Famille[] = [
  "Floral", "Fruité", "Frais", "Boisé", "Oriental", "Gourmand", "Musqué", "Aromatique",
];

export const libelleIntensite = { 1: "Légère", 2: "Modérée", 3: "Intense" } as const;

// Part de concentré par défaut selon le type de jus
const concentrationParDefaut: Record<TypeJus, number> = {
  "Eau de Cologne": 5,
  "Eau de toilette": 12,
  "Eau de parfum": 18,
  "Extrait de parfum": 25,
};

// ---------------------------------------------------------------------------
// Format d'écriture simplifié :
//   notes       : "tête 1, tête 2 | cœur 1, cœur 2 | fond 1, fond 2"
//   composition : "Ingrédient 25, Autre ingrédient 15, ..." (total = 100)
//   allergenes  : "Linalool, Limonene, ..."
// ---------------------------------------------------------------------------
type Saisie = {
  nom: string;
  famille: Famille;
  genre: Genre;
  intensite: 1 | 2 | 3;
  moment: Moment;
  prix: number;
  contenance: string;
  type: TypeJus;
  pourcentage?: number; // si différent de la valeur par défaut du type de jus
  couleur: string;
  popularite: number;
  nouveau?: boolean;
  description: string;
  notes: string;
  composition: string;
  allergenes: string;
};

const catalogue: Saisie[] = [
  // ----- Floral -----
  {
    nom: "Jardin de Grasse", famille: "Floral", genre: "Femme", intensite: 2, moment: "Jour",
    prix: 75, contenance: "50 ml", type: "Eau de parfum", pourcentage: 16, couleur: "#e7a9b8",
    popularite: 90, nouveau: true,
    description: "Une promenade matinale dans les champs de fleurs de Grasse : jasmin, tubéreuse et une rosée verte.",
    notes: "Feuille de violette, Poire | Jasmin, Tubéreuse | Musc blanc, Iris",
    composition: "Absolue de jasmin 25, Tubéreuse 18, Musc blanc 15, Iris 12, Néroli 12, Poire 10, Feuille de violette 8",
    allergenes: "Benzyl Benzoate, Linalool, Benzyl Salicylate, Farnesol",
  },
  {
    nom: "Rose Poudrée", famille: "Floral", genre: "Femme", intensite: 2, moment: "Jour",
    prix: 72, contenance: "50 ml", type: "Eau de parfum", couleur: "#e8b4b8", popularite: 86,
    description: "Une rose délicate enveloppée d'iris et de violette, d'une élégance intemporelle.",
    notes: "Litchi, Bergamote | Rose de Mai, Violette | Iris, Musc blanc",
    composition: "Rose de Mai 28, Iris 18, Violette 14, Musc blanc 14, Litchi 10, Bergamote 10, Héliotrope 6",
    allergenes: "Citronellol, Geraniol, Linalool, Alpha-Isomethyl Ionone",
  },
  {
    nom: "Pivoine Céleste", famille: "Floral", genre: "Femme", intensite: 1, moment: "Jour",
    prix: 54, contenance: "50 ml", type: "Eau de toilette", couleur: "#f2b8c6", popularite: 79,
    description: "Un bouquet de pivoines fraîchement cueillies, lumineux et pétillant.",
    notes: "Cassis, Mandarine | Pivoine, Rose | Musc, Cèdre blanc",
    composition: "Pivoine 30, Rose 18, Musc 16, Cassis 14, Mandarine 12, Cèdre blanc 10",
    allergenes: "Limonene, Citronellol, Geraniol, Linalool",
  },
  {
    nom: "Tubéreuse Absolue", famille: "Floral", genre: "Femme", intensite: 3, moment: "Soir",
    prix: 115, contenance: "50 ml", type: "Extrait de parfum", couleur: "#efe0c2", popularite: 71,
    description: "Une tubéreuse crémeuse et capiteuse, pour celles qui aiment ne pas passer inaperçues.",
    notes: "Noix de coco, Gardénia | Tubéreuse, Jasmin sambac | Vanille, Bois de santal",
    composition: "Tubéreuse 34, Jasmin sambac 18, Gardénia 12, Vanille 12, Bois de santal 12, Noix de coco 8, Musc 4",
    allergenes: "Benzyl Benzoate, Benzyl Salicylate, Farnesol, Linalool",
  },
  {
    nom: "Néroli Blanc", famille: "Floral", genre: "Mixte", intensite: 1, moment: "Jour",
    prix: 68, contenance: "100 ml", type: "Eau de toilette", couleur: "#f1e6c4", popularite: 77,
    description: "La fleur d'oranger dans toute sa pureté, solaire et apaisante.",
    notes: "Petit-grain, Citron | Néroli, Fleur d'oranger | Musc blanc, Ambrette",
    composition: "Néroli 30, Fleur d'oranger 22, Petit-grain 14, Musc blanc 14, Citron 12, Ambrette 8",
    allergenes: "Limonene, Linalool, Farnesol, Geraniol",
  },
  {
    nom: "Iris Velours", famille: "Floral", genre: "Mixte", intensite: 2, moment: "Jour et soir",
    prix: 98, contenance: "50 ml", type: "Eau de parfum", couleur: "#b9a7c9", popularite: 74,
    description: "Un iris poudré et racé, posé sur un lit de cuir souple et de bois de cèdre.",
    notes: "Graine de carotte, Poivre rose | Iris, Mimosa | Accord cuir, Cèdre",
    composition: "Iris 30, Accord cuir 16, Cèdre 14, Mimosa 12, Poivre rose 10, Musc 10, Graine de carotte 8",
    allergenes: "Alpha-Isomethyl Ionone, Linalool, Limonene",
  },
  {
    nom: "Muguet de Mai", famille: "Floral", genre: "Femme", intensite: 1, moment: "Jour",
    prix: 49, contenance: "30 ml", type: "Eau de toilette", couleur: "#d5e3c0", popularite: 68,
    description: "Le parfum porte-bonheur du printemps : vert, frais et délicatement floral.",
    notes: "Feuilles vertes, Citron | Muguet, Lilas | Musc, Mousse de chêne",
    composition: "Muguet 32, Lilas 16, Musc 16, Feuilles vertes 14, Citron 12, Mousse de chêne 10",
    allergenes: "Hydroxycitronellal, Linalool, Limonene, Evernia Prunastri Extract",
  },
  {
    nom: "Jasmin de Nuit", famille: "Floral", genre: "Femme", intensite: 3, moment: "Soir",
    prix: 92, contenance: "50 ml", type: "Eau de parfum", couleur: "#e3c98a", popularite: 82,
    description: "Un jasmin sensuel et ambré qui s'épanouit à la tombée du jour.",
    notes: "Mandarine, Ylang-ylang | Jasmin, Fleur d'oranger | Ambre, Benjoin",
    composition: "Absolue de jasmin 30, Ambre 18, Benjoin 16, Ylang-ylang 14, Fleur d'oranger 12, Mandarine 10",
    allergenes: "Benzyl Benzoate, Linalool, Benzyl Alcohol, Farnesol",
  },
  {
    nom: "Magnolia Soie", famille: "Floral", genre: "Femme", intensite: 2, moment: "Jour",
    prix: 79, contenance: "50 ml", type: "Eau de parfum", couleur: "#f0d4da", popularite: 73,
    nouveau: true,
    description: "Un magnolia lacté et soyeux, d'une douceur lumineuse.",
    notes: "Poire, Bergamote | Magnolia, Pivoine | Musc, Bois de santal",
    composition: "Magnolia 30, Musc 18, Pivoine 15, Bois de santal 15, Poire 12, Bergamote 10",
    allergenes: "Linalool, Limonene, Geraniol",
  },

  // ----- Fruité -----
  {
    nom: "Pêche de Vigne", famille: "Fruité", genre: "Femme", intensite: 1, moment: "Jour",
    prix: 52, contenance: "50 ml", type: "Eau de toilette", couleur: "#f4b183", popularite: 80,
    description: "Une pêche juteuse et veloutée, gaie comme un après-midi d'été.",
    notes: "Pêche, Mandarine | Abricot, Osmanthus | Musc, Bois blonds",
    composition: "Pêche 26, Musc 18, Abricot 16, Osmanthus 14, Bois blonds 14, Mandarine 12",
    allergenes: "Limonene, Linalool, Benzyl Salicylate",
  },
  {
    nom: "Figue Solaire", famille: "Fruité", genre: "Mixte", intensite: 2, moment: "Jour",
    prix: 74, contenance: "50 ml", type: "Eau de parfum", couleur: "#9bb07a", popularite: 83,
    description: "La figue gorgée de soleil, entre feuille verte et lait de figuier.",
    notes: "Feuille de figuier, Bergamote | Figue, Noix de coco | Cèdre, Musc",
    composition: "Figue 28, Feuille de figuier 18, Cèdre 18, Musc 14, Bergamote 12, Noix de coco 10",
    allergenes: "Limonene, Linalool, Coumarin",
  },
  {
    nom: "Cassis Noir", famille: "Fruité", genre: "Mixte", intensite: 2, moment: "Jour et soir",
    prix: 69, contenance: "50 ml", type: "Eau de parfum", couleur: "#5b3a55", popularite: 70,
    description: "Un cassis croquant et légèrement acidulé, adouci par la rose et le patchouli.",
    notes: "Cassis, Pamplemousse | Rose, Framboise | Patchouli, Musc",
    composition: "Cassis 28, Patchouli 18, Framboise 14, Rose 14, Musc 14, Pamplemousse 12",
    allergenes: "Limonene, Citronellol, Geraniol, Linalool",
  },
  {
    nom: "Poire Givrée", famille: "Fruité", genre: "Femme", intensite: 1, moment: "Jour",
    prix: 45, contenance: "30 ml", type: "Eau de toilette", couleur: "#d6e2b0", popularite: 66,
    description: "Une poire fraîche et croquante, givrée de notes mentholées.",
    notes: "Poire, Menthe | Freesia, Pomme verte | Musc blanc, Ambrette",
    composition: "Poire 30, Musc blanc 20, Pomme verte 14, Freesia 14, Ambrette 12, Menthe 10",
    allergenes: "Limonene, Linalool",
  },
  {
    nom: "Framboise Sauvage", famille: "Fruité", genre: "Femme", intensite: 2, moment: "Jour et soir",
    prix: 58, contenance: "50 ml", type: "Eau de parfum", couleur: "#c94f6d", popularite: 84,
    description: "Une framboise gourmande et pétillante, twistée de poivre rose.",
    notes: "Framboise, Poivre rose | Rose, Violette | Vanille, Musc",
    composition: "Framboise 28, Vanille 18, Rose 16, Musc 16, Violette 12, Poivre rose 10",
    allergenes: "Citronellol, Geraniol, Alpha-Isomethyl Ionone, Coumarin",
  },
  {
    nom: "Mangue Paradis", famille: "Fruité", genre: "Mixte", intensite: 1, moment: "Jour",
    prix: 48, contenance: "100 ml", type: "Eau de toilette", couleur: "#f2b134", popularite: 72,
    nouveau: true,
    description: "Une évasion tropicale : mangue mûre, fruit de la passion et fleurs blanches.",
    notes: "Mangue, Fruit de la passion | Frangipanier, Fleur de tiaré | Noix de coco, Musc",
    composition: "Mangue 26, Fruit de la passion 16, Noix de coco 16, Musc 16, Frangipanier 14, Fleur de tiaré 12",
    allergenes: "Limonene, Linalool, Benzyl Salicylate",
  },
  {
    nom: "Pomme d'Amour", famille: "Fruité", genre: "Femme", intensite: 2, moment: "Soir",
    prix: 62, contenance: "50 ml", type: "Eau de parfum", couleur: "#b8323f", popularite: 69,
    description: "Une pomme rouge caramélisée, espiègle et séductrice.",
    notes: "Pomme rouge, Citron | Rose, Cannelle | Caramel, Bois de santal",
    composition: "Pomme rouge 28, Caramel 20, Bois de santal 18, Rose 14, Cannelle 10, Citron 10",
    allergenes: "Cinnamal, Eugenol, Limonene, Citronellol",
  },

  // ----- Frais -----
  {
    nom: "Brise Marine", famille: "Frais", genre: "Mixte", intensite: 1, moment: "Jour",
    prix: 65, contenance: "50 ml", type: "Eau de toilette", couleur: "#7fb3c8", popularite: 88,
    nouveau: true,
    description: "La fraîcheur de l'océan en été : agrumes pétillants, sel marin et une touche de figue.",
    notes: "Citron de Sicile, Pamplemousse | Accord marin, Figue | Ambrette, Bois flotté",
    composition: "Accord marin 22, Citron de Sicile 20, Pamplemousse 15, Figue 13, Bois flotté 12, Ambrette 10, Menthe 8",
    allergenes: "Limonene, Citral, Linalool, Geraniol",
  },
  {
    nom: "Citron Riviera", famille: "Frais", genre: "Mixte", intensite: 1, moment: "Jour",
    prix: 42, contenance: "100 ml", type: "Eau de Cologne", couleur: "#ecd85f", popularite: 81,
    description: "Un zeste de citron de Menton sous le soleil de la Riviera, vif et lumineux.",
    notes: "Citron de Menton, Bergamote | Petit-grain, Basilic | Musc, Vétiver",
    composition: "Citron de Menton 32, Bergamote 20, Petit-grain 14, Musc 14, Basilic 10, Vétiver 10",
    allergenes: "Limonene, Citral, Linalool, Geraniol",
  },
  {
    nom: "Thé Vert Matcha", famille: "Frais", genre: "Mixte", intensite: 1, moment: "Jour",
    prix: 56, contenance: "50 ml", type: "Eau de toilette", couleur: "#a7c48a", popularite: 75,
    description: "La sérénité d'une cérémonie du thé : matcha, jasmin et bois de cèdre.",
    notes: "Bergamote, Gingembre | Thé vert, Jasmin | Cèdre, Musc",
    composition: "Accord thé vert 30, Cèdre 16, Musc 16, Jasmin 14, Bergamote 14, Gingembre 10",
    allergenes: "Linalool, Limonene, Benzyl Salicylate",
  },
  {
    nom: "Eau de Glacier", famille: "Frais", genre: "Homme", intensite: 1, moment: "Jour",
    prix: 59, contenance: "100 ml", type: "Eau de toilette", couleur: "#a9d3e0", popularite: 78,
    description: "Une fraîcheur minérale et glacée, comme l'air pur des sommets.",
    notes: "Menthe poivrée, Citron vert | Accord minéral, Sauge | Cèdre, Ambre gris",
    composition: "Accord minéral 24, Cèdre 18, Menthe poivrée 16, Citron vert 16, Ambre gris 14, Sauge 12",
    allergenes: "Limonene, Linalool, Citral",
  },
  {
    nom: "Pamplemousse Rose", famille: "Frais", genre: "Femme", intensite: 1, moment: "Jour",
    prix: 46, contenance: "50 ml", type: "Eau de toilette", couleur: "#f5a3a0", popularite: 67,
    description: "Un pamplemousse rose pétillant, à la fois acidulé et légèrement fleuri.",
    notes: "Pamplemousse rose, Mandarine | Rhubarbe, Rose | Musc, Vétiver",
    composition: "Pamplemousse rose 30, Musc 18, Mandarine 14, Rhubarbe 14, Rose 12, Vétiver 12",
    allergenes: "Limonene, Citral, Citronellol, Geraniol",
  },
  {
    nom: "Sel d'Écume", famille: "Frais", genre: "Mixte", intensite: 2, moment: "Jour",
    prix: 78, contenance: "50 ml", type: "Eau de parfum", couleur: "#8fb9c9", popularite: 76,
    nouveau: true,
    description: "Le sel sur la peau après la baignade, adouci par la sauge et les bois flottés.",
    notes: "Sel marin, Ambrette | Sauge sclarée, Algues | Bois flotté, Ambre gris",
    composition: "Accord sel marin 26, Sauge sclarée 18, Bois flotté 18, Ambre gris 16, Algues 12, Ambrette 10",
    allergenes: "Linalool, Limonene, Coumarin",
  },
  {
    nom: "Verveine Fraîche", famille: "Frais", genre: "Mixte", intensite: 1, moment: "Jour",
    prix: 39, contenance: "100 ml", type: "Eau de Cologne", couleur: "#c9dd8f", popularite: 64,
    description: "Une verveine citronnée et aromatique, parfaite pour un coup de fraîcheur.",
    notes: "Verveine, Citron | Menthe, Feuille de citronnier | Musc blanc, Cèdre",
    composition: "Verveine 32, Citron 18, Feuille de citronnier 14, Musc blanc 14, Menthe 12, Cèdre 10",
    allergenes: "Citral, Limonene, Geraniol, Linalool",
  },
  {
    nom: "Gingembre Vif", famille: "Frais", genre: "Homme", intensite: 2, moment: "Jour",
    prix: 58, contenance: "100 ml", type: "Eau de toilette", couleur: "#d9a441", popularite: 71,
    description: "Un gingembre piquant et énergisant, idéal pour bien démarrer la journée.",
    notes: "Gingembre, Citron vert | Poivre noir, Géranium | Vétiver, Cèdre",
    composition: "Gingembre 28, Vétiver 18, Citron vert 16, Cèdre 16, Géranium 12, Poivre noir 10",
    allergenes: "Limonene, Citral, Geraniol, Linalool",
  },

  // ----- Boisé -----
  {
    nom: "Cèdre Sauvage", famille: "Boisé", genre: "Homme", intensite: 3, moment: "Soir",
    prix: 82, contenance: "50 ml", type: "Eau de parfum", couleur: "#6b7f5a", popularite: 85,
    description: "Un sillage boisé et fumé, comme un feu de bois en forêt. Puissant, élégant, inoubliable.",
    notes: "Poivre noir, Cardamome | Cèdre de l'Atlas, Cuir | Vétiver, Encens",
    composition: "Cèdre de l'Atlas 28, Vétiver 18, Accord cuir 14, Encens (oliban) 12, Poivre noir 10, Patchouli 10, Cardamome 8",
    allergenes: "Limonene, Linalool, Eugenol",
  },
  {
    nom: "Vétiver Fumé", famille: "Boisé", genre: "Homme", intensite: 2, moment: "Jour et soir",
    prix: 85, contenance: "50 ml", type: "Eau de parfum", couleur: "#5d6b4f", popularite: 79,
    description: "Un vétiver terreux et fumé, d'une élégance brute.",
    notes: "Pamplemousse, Poivre noir | Vétiver d'Haïti, Bouleau | Encens, Cèdre",
    composition: "Vétiver d'Haïti 32, Cèdre 18, Encens 16, Bouleau 12, Pamplemousse 12, Poivre noir 10",
    allergenes: "Limonene, Linalool",
  },
  {
    nom: "Santal Crémeux", famille: "Boisé", genre: "Mixte", intensite: 2, moment: "Jour et soir",
    prix: 95, contenance: "50 ml", type: "Eau de parfum", couleur: "#d4b48c", popularite: 93,
    description: "Un santal lacté et réconfortant, comme une seconde peau.",
    notes: "Cardamome, Accord lacté | Bois de santal, Iris | Musc, Ambre",
    composition: "Bois de santal 36, Musc 16, Iris 14, Ambre 14, Cardamome 10, Accord lacté 10",
    allergenes: "Linalool, Limonene, Coumarin",
  },
  {
    nom: "Sous-Bois", famille: "Boisé", genre: "Mixte", intensite: 2, moment: "Jour",
    prix: 76, contenance: "50 ml", type: "Eau de parfum", couleur: "#3f5a3c", popularite: 65,
    description: "Une balade en forêt après la pluie : mousse, cyprès et terre humide.",
    notes: "Cyprès, Galbanum | Pin, Feuille de lierre | Mousse de chêne, Patchouli",
    composition: "Mousse de chêne 22, Cyprès 20, Patchouli 20, Pin 16, Feuille de lierre 12, Galbanum 10",
    allergenes: "Evernia Prunastri Extract, Limonene, Linalool",
  },
  {
    nom: "Cuir de Russie", famille: "Boisé", genre: "Homme", intensite: 3, moment: "Soir",
    prix: 119, contenance: "50 ml", type: "Extrait de parfum", couleur: "#6b3f2a", popularite: 72,
    description: "Un cuir fumé et raffiné aux accents de bouleau et de tabac blond.",
    notes: "Bergamote, Safran | Accord cuir, Bouleau | Tabac blond, Labdanum",
    composition: "Accord cuir 32, Bouleau 16, Tabac blond 16, Labdanum 14, Bergamote 12, Safran 10",
    allergenes: "Limonene, Linalool, Eugenol",
  },
  {
    nom: "Patchouli Intense", famille: "Boisé", genre: "Mixte", intensite: 3, moment: "Soir",
    prix: 88, contenance: "50 ml", type: "Eau de parfum", couleur: "#4a3a2e", popularite: 77,
    description: "Un patchouli sombre et magnétique, réchauffé par le cacao et l'ambre.",
    notes: "Bergamote, Poivre rose | Patchouli, Cacao | Ambre, Vanille",
    composition: "Patchouli 34, Ambre 18, Vanille 16, Cacao 14, Bergamote 10, Poivre rose 8",
    allergenes: "Limonene, Coumarin, Linalool",
  },
  {
    nom: "Hinoki Zen", famille: "Boisé", genre: "Mixte", intensite: 1, moment: "Jour",
    prix: 72, contenance: "50 ml", type: "Eau de toilette", couleur: "#c7a77c", popularite: 70,
    nouveau: true,
    description: "Le bois de hinoki japonais, propre et apaisant comme un bain de forêt.",
    notes: "Yuzu, Bergamote | Bois de hinoki, Encens | Cèdre, Musc",
    composition: "Bois de hinoki 32, Yuzu 16, Cèdre 16, Musc 14, Encens 12, Bergamote 10",
    allergenes: "Limonene, Linalool",
  },

  // ----- Oriental -----
  {
    nom: "Ambre Nocturne", famille: "Oriental", genre: "Mixte", intensite: 3, moment: "Soir",
    prix: 89, contenance: "50 ml", type: "Eau de parfum", couleur: "#c8873a", popularite: 98,
    description: "Notre signature. Un ambre chaud et enveloppant, adouci par la vanille et réveillé par une pointe de safran.",
    notes: "Safran, Bergamote | Ambre, Rose de Damas | Vanille, Bois de santal",
    composition: "Résinoïde d'ambre 22, Absolue de vanille 18, Bois de santal 15, Rose de Damas 12, Bergamote 10, Musc 10, Benjoin 8, Safran 5",
    allergenes: "Linalool, Limonene, Coumarin, Geraniol, Citronellol",
  },
  {
    nom: "Oud Impérial", famille: "Oriental", genre: "Mixte", intensite: 3, moment: "Soir",
    prix: 129, contenance: "50 ml", type: "Extrait de parfum", couleur: "#5a2e3a", popularite: 80,
    description: "Notre création la plus précieuse. Un oud profond, sublimé par la rose et le patchouli.",
    notes: "Rose turque, Framboise | Oud, Patchouli | Ambre gris, Labdanum",
    composition: "Oud 26, Rose turque 20, Patchouli 16, Ambre gris 12, Labdanum 10, Framboise 6, Bois de santal 6, Safran 4",
    allergenes: "Citronellol, Geraniol, Eugenol, Linalool",
  },
  {
    nom: "Safran Royal", famille: "Oriental", genre: "Mixte", intensite: 3, moment: "Soir",
    prix: 135, contenance: "50 ml", type: "Extrait de parfum", couleur: "#9e3a2b", popularite: 74,
    description: "Un safran précieux et lumineux, enveloppé de rose et de bois de oud.",
    notes: "Safran, Poivre rose | Rose de Damas, Oud | Ambre, Musc",
    composition: "Oud 22, Rose de Damas 20, Safran 18, Ambre 18, Musc 14, Poivre rose 8",
    allergenes: "Citronellol, Geraniol, Eugenol",
  },
  {
    nom: "Encens Sacré", famille: "Oriental", genre: "Mixte", intensite: 3, moment: "Soir",
    prix: 99, contenance: "50 ml", type: "Eau de parfum", couleur: "#6e6158", popularite: 68,
    description: "La fumée mystique des églises anciennes : encens, myrrhe et bois sombres.",
    notes: "Élémi, Poivre noir | Encens (oliban), Myrrhe | Labdanum, Cèdre",
    composition: "Encens (oliban) 30, Labdanum 18, Cèdre 18, Myrrhe 16, Élémi 10, Poivre noir 8",
    allergenes: "Limonene, Linalool",
  },
  {
    nom: "Épices d'Orient", famille: "Oriental", genre: "Homme", intensite: 3, moment: "Soir",
    prix: 84, contenance: "50 ml", type: "Eau de parfum", couleur: "#a5552e", popularite: 76,
    description: "Un voyage sur la route des épices : cannelle, cardamome et clou de girofle.",
    notes: "Cardamome, Orange amère | Cannelle, Clou de girofle | Tabac, Vanille",
    composition: "Vanille 26, Tabac 22, Cannelle 16, Cardamome 14, Orange amère 12, Clou de girofle 10",
    allergenes: "Cinnamal, Eugenol, Limonene, Coumarin",
  },
  {
    nom: "Ambre Doré", famille: "Oriental", genre: "Femme", intensite: 2, moment: "Jour et soir",
    prix: 69, contenance: "50 ml", type: "Eau de parfum", couleur: "#d99a4e", popularite: 87,
    description: "Un ambre lumineux et velouté, plus léger que notre Ambre Nocturne.",
    notes: "Mandarine, Fleur d'oranger | Ambre, Héliotrope | Vanille, Musc",
    composition: "Résinoïde d'ambre 26, Vanille 20, Musc 18, Mandarine 12, Fleur d'oranger 12, Héliotrope 12",
    allergenes: "Limonene, Coumarin, Linalool",
  },
  {
    nom: "Nuit de Marrakech", famille: "Oriental", genre: "Femme", intensite: 3, moment: "Soir",
    prix: 105, contenance: "50 ml", type: "Eau de parfum", couleur: "#7a2d4a", popularite: 78,
    nouveau: true,
    description: "Une rose épicée et ambrée, envoûtante comme une nuit dans la médina.",
    notes: "Safran, Grenade | Rose, Jasmin | Oud, Benjoin",
    composition: "Rose 24, Benjoin 24, Oud 20, Jasmin 14, Grenade 10, Safran 8",
    allergenes: "Citronellol, Geraniol, Benzyl Benzoate, Linalool",
  },

  // ----- Gourmand -----
  {
    nom: "Vanille Bourbon", famille: "Gourmand", genre: "Mixte", intensite: 2, moment: "Jour et soir",
    prix: 79, contenance: "50 ml", type: "Eau de parfum", couleur: "#e2c08d", popularite: 96,
    description: "Une vanille de Madagascar riche et boisée, loin des vanilles trop sucrées.",
    notes: "Rhum, Poivre rose | Vanille Bourbon, Fève tonka | Bois de santal, Benjoin",
    composition: "Absolue de vanille 34, Bois de santal 18, Fève tonka 16, Benjoin 16, Rhum 10, Poivre rose 6",
    allergenes: "Coumarin, Benzyl Benzoate, Linalool",
  },
  {
    nom: "Caramel Salé", famille: "Gourmand", genre: "Femme", intensite: 2, moment: "Jour et soir",
    prix: 55, contenance: "50 ml", type: "Eau de parfum", couleur: "#c2884f", popularite: 89,
    description: "Un caramel au beurre salé fondant, gourmand sans être écœurant.",
    notes: "Fleur de sel, Poire | Caramel, Praliné | Vanille, Musc",
    composition: "Caramel 30, Vanille 20, Praliné 16, Musc 14, Fleur de sel 10, Poire 10",
    allergenes: "Coumarin, Linalool",
  },
  {
    nom: "Café Noir", famille: "Gourmand", genre: "Homme", intensite: 3, moment: "Soir",
    prix: 86, contenance: "50 ml", type: "Eau de parfum", couleur: "#3e2a20", popularite: 82,
    description: "Un expresso serré, adouci d'une touche de cacao et de bois de santal.",
    notes: "Cardamome, Bergamote | Café, Cacao | Bois de santal, Fève tonka",
    composition: "Accord café 30, Bois de santal 18, Cacao 16, Fève tonka 16, Cardamome 10, Bergamote 10",
    allergenes: "Coumarin, Limonene, Linalool",
  },
  {
    nom: "Pistache Chérie", famille: "Gourmand", genre: "Femme", intensite: 1, moment: "Jour",
    prix: 47, contenance: "30 ml", type: "Eau de toilette", couleur: "#b9cf8e", popularite: 75,
    nouveau: true,
    description: "Une crème de pistache douce et amusante, pour un sillage tendre.",
    notes: "Pistache, Amande | Héliotrope, Accord lacté | Musc, Vanille",
    composition: "Accord pistache 28, Musc 18, Vanille 16, Amande 14, Héliotrope 14, Accord lacté 10",
    allergenes: "Coumarin, Linalool",
  },
  {
    nom: "Chocolat Velours", famille: "Gourmand", genre: "Mixte", intensite: 3, moment: "Soir",
    prix: 92, contenance: "50 ml", type: "Eau de parfum", couleur: "#5a3424", popularite: 73,
    description: "Un chocolat noir intense, relevé de baies roses et de patchouli.",
    notes: "Baies roses, Orange | Cacao, Iris | Patchouli, Vanille",
    composition: "Cacao 30, Patchouli 20, Vanille 20, Iris 12, Orange 10, Baies roses 8",
    allergenes: "Limonene, Coumarin",
  },
  {
    nom: "Miel d'Acacia", famille: "Gourmand", genre: "Femme", intensite: 2, moment: "Jour",
    prix: 64, contenance: "50 ml", type: "Eau de parfum", couleur: "#e8b94a", popularite: 70,
    description: "Un miel doré et floral, chaud comme un rayon de soleil.",
    notes: "Mandarine, Bergamote | Miel, Fleur d'acacia | Cire d'abeille, Musc",
    composition: "Absolue de miel 28, Cire d'abeille 18, Fleur d'acacia 16, Musc 16, Mandarine 12, Bergamote 10",
    allergenes: "Limonene, Linalool, Benzyl Alcohol",
  },

  // ----- Musqué -----
  {
    nom: "Fleur de Coton", famille: "Musqué", genre: "Femme", intensite: 1, moment: "Jour",
    prix: 59, contenance: "50 ml", type: "Eau de toilette", pourcentage: 10, couleur: "#d9d3c7",
    popularite: 92,
    description: "La douceur du linge propre et d'une peau fraîchement lavée. Délicat et réconfortant.",
    notes: "Aldéhydes, Fleur d'oranger | Fleur de coton, Muguet | Musc, Cachemire",
    composition: "Musc 30, Accord fleur de coton 22, Accord cachemire 15, Muguet 12, Fleur d'oranger 10, Aldéhydes 6, Héliotrope 5",
    allergenes: "Hexyl Cinnamal, Hydroxycitronellal, Linalool, Coumarin",
  },
  {
    nom: "Musc Blanc", famille: "Musqué", genre: "Mixte", intensite: 1, moment: "Jour",
    prix: 44, contenance: "50 ml", type: "Eau de toilette", couleur: "#e6e0d6", popularite: 95,
    description: "Un musc propre et cotonneux, doux comme un câlin. L'un de nos best-sellers.",
    notes: "Aldéhydes, Poire | Musc blanc, Fleur d'oranger | Ambrette, Cèdre blanc",
    composition: "Musc blanc 40, Ambrette 16, Fleur d'oranger 14, Cèdre blanc 14, Aldéhydes 8, Poire 8",
    allergenes: "Linalool, Hexyl Cinnamal",
  },
  {
    nom: "Peau de Soie", famille: "Musqué", genre: "Femme", intensite: 1, moment: "Jour et soir",
    prix: 66, contenance: "50 ml", type: "Eau de parfum", couleur: "#e9d3c6", popularite: 81,
    description: "Un musc poudré et sensuel qui sublime l'odeur naturelle de la peau.",
    notes: "Bergamote, Pétales de rose | Iris, Musc | Ambrette, Bois de santal",
    composition: "Musc 34, Iris 16, Ambrette 14, Bois de santal 14, Pétales de rose 12, Bergamote 10",
    allergenes: "Citronellol, Linalool, Alpha-Isomethyl Ionone",
  },
  {
    nom: "Cachemire Nu", famille: "Musqué", genre: "Mixte", intensite: 2, moment: "Soir",
    prix: 81, contenance: "50 ml", type: "Eau de parfum", couleur: "#cbb9a8", popularite: 74,
    description: "Un musc boisé et chaud, doux comme une étole de cachemire.",
    notes: "Poivre rose, Cardamome | Musc, Accord cachemire | Ambre, Vanille",
    composition: "Musc 30, Accord cachemire 20, Ambre 18, Vanille 16, Poivre rose 8, Cardamome 8",
    allergenes: "Coumarin, Linalool",
  },

  // ----- Aromatique -----
  {
    nom: "Lavande Provence", famille: "Aromatique", genre: "Mixte", intensite: 1, moment: "Jour",
    prix: 49, contenance: "100 ml", type: "Eau de toilette", couleur: "#9a8fc4", popularite: 77,
    description: "La lavande des plateaux de Haute-Provence, fraîche et réconfortante.",
    notes: "Lavande, Bergamote | Romarin, Géranium | Fève tonka, Musc",
    composition: "Lavande 34, Fève tonka 16, Bergamote 14, Musc 14, Romarin 12, Géranium 10",
    allergenes: "Linalool, Coumarin, Limonene, Geraniol",
  },
  {
    nom: "Romarin Sauvage", famille: "Aromatique", genre: "Homme", intensite: 2, moment: "Jour",
    prix: 62, contenance: "100 ml", type: "Eau de toilette", couleur: "#7f9a6a", popularite: 69,
    description: "Les herbes de la garrigue sous le soleil : romarin, thym et cyprès.",
    notes: "Romarin, Citron | Thym, Sauge | Cyprès, Vétiver",
    composition: "Romarin 26, Cyprès 18, Vétiver 16, Thym 14, Sauge 14, Citron 12",
    allergenes: "Limonene, Linalool, Geraniol",
  },
  {
    nom: "Basilic Menthe", famille: "Aromatique", genre: "Mixte", intensite: 1, moment: "Jour",
    prix: 45, contenance: "50 ml", type: "Eau de toilette", couleur: "#6fae7a", popularite: 66,
    description: "Un duo vert et pétillant, comme un jardin d'herbes après l'arrosage.",
    notes: "Basilic, Menthe | Citron vert, Feuille de tomate | Musc, Vétiver",
    composition: "Basilic 26, Menthe 18, Musc 16, Citron vert 14, Vétiver 14, Feuille de tomate 12",
    allergenes: "Limonene, Linalool, Citral",
  },
  {
    nom: "Fougère Royale", famille: "Aromatique", genre: "Homme", intensite: 2, moment: "Jour et soir",
    prix: 74, contenance: "50 ml", type: "Eau de parfum", couleur: "#4f6b5e", popularite: 83,
    description: "Le grand classique de la parfumerie masculine : lavande, géranium et mousse de chêne.",
    notes: "Lavande, Bergamote | Géranium, Sauge sclarée | Mousse de chêne, Fève tonka",
    composition: "Lavande 24, Mousse de chêne 18, Fève tonka 18, Bergamote 14, Géranium 14, Sauge sclarée 12",
    allergenes: "Coumarin, Linalool, Geraniol, Evernia Prunastri Extract",
  },

  // ----- Sélection homme -----
  {
    nom: "Bergamote Gentleman", famille: "Frais", genre: "Homme", intensite: 1, moment: "Jour",
    prix: 54, contenance: "100 ml", type: "Eau de toilette", couleur: "#e3c76a", popularite: 86,
    description: "Une bergamote de Calabre vive et élégante, soulignée de vétiver. Le parfum idéal pour le bureau.",
    notes: "Bergamote, Citron | Lavande, Poivre rose | Vétiver, Cèdre",
    composition: "Bergamote 30, Vétiver 18, Citron 14, Cèdre 14, Lavande 14, Poivre rose 10",
    allergenes: "Limonene, Linalool, Citral",
  },
  {
    nom: "Vent du Large", famille: "Frais", genre: "Homme", intensite: 2, moment: "Jour",
    prix: 68, contenance: "100 ml", type: "Eau de toilette", couleur: "#5f8fb0", popularite: 91,
    description: "Un sillage aquatique et salé, taillé pour les escapades au bord de mer.",
    notes: "Accord marin, Citron vert | Sauge, Romarin | Ambre gris, Bois flotté",
    composition: "Accord marin 28, Ambre gris 16, Bois flotté 16, Citron vert 14, Sauge 14, Romarin 12",
    allergenes: "Limonene, Linalool, Citral",
  },
  {
    nom: "Agrumes Sport", famille: "Frais", genre: "Homme", intensite: 1, moment: "Jour",
    prix: 42, contenance: "100 ml", type: "Eau de Cologne", couleur: "#f0b04a", popularite: 73,
    nouveau: true,
    description: "Un cocktail d'agrumes énergisant, parfait après le sport.",
    notes: "Orange sanguine, Pamplemousse | Menthe, Gingembre | Musc, Cèdre",
    composition: "Orange sanguine 26, Pamplemousse 20, Musc 16, Menthe 14, Gingembre 12, Cèdre 12",
    allergenes: "Limonene, Citral, Linalool",
  },
  {
    nom: "Yuzu Électrique", famille: "Frais", genre: "Homme", intensite: 2, moment: "Jour et soir",
    prix: 72, contenance: "50 ml", type: "Eau de parfum", couleur: "#cfcc4f", popularite: 77,
    description: "Un yuzu japonais pétillant, électrisé de poivre et posé sur un bois sec.",
    notes: "Yuzu, Poivre de Sichuan | Thé noir, Géranium | Vétiver, Bois de gaïac",
    composition: "Yuzu 30, Vétiver 18, Thé noir 14, Bois de gaïac 14, Poivre de Sichuan 12, Géranium 12",
    allergenes: "Limonene, Geraniol, Linalool",
  },
  {
    nom: "Bois d'Ébène", famille: "Boisé", genre: "Homme", intensite: 3, moment: "Soir",
    prix: 98, contenance: "50 ml", type: "Eau de parfum", couleur: "#2e2620", popularite: 80,
    description: "Un bois sombre et fumé, profond comme une nuit sans lune.",
    notes: "Poivre noir, Élémi | Bois de gaïac, Cade | Labdanum, Accord bois d'ébène",
    composition: "Accord bois d'ébène 28, Labdanum 24, Bois de gaïac 18, Cade 12, Poivre noir 10, Élémi 8",
    allergenes: "Limonene, Linalool, Eugenol",
  },
  {
    nom: "Cèdre Bleu", famille: "Boisé", genre: "Homme", intensite: 1, moment: "Jour",
    prix: 64, contenance: "100 ml", type: "Eau de toilette", couleur: "#6f8a99", popularite: 84,
    description: "Un cèdre frais et aérien, éclairé de bergamote et de lavande.",
    notes: "Bergamote, Lavande | Cèdre de Virginie, Iris | Vétiver, Musc",
    composition: "Cèdre de Virginie 32, Bergamote 16, Vétiver 16, Musc 14, Lavande 12, Iris 10",
    allergenes: "Limonene, Linalool, Alpha-Isomethyl Ionone",
  },
  {
    nom: "Tabac Blond", famille: "Boisé", genre: "Homme", intensite: 3, moment: "Soir",
    prix: 92, contenance: "50 ml", type: "Eau de parfum", couleur: "#a8743c", popularite: 88,
    description: "Des feuilles de tabac séchées au soleil, adoucies par le miel et la fève tonka.",
    notes: "Poivre rose, Prune | Feuille de tabac, Miel | Fève tonka, Bois de santal",
    composition: "Feuille de tabac 30, Fève tonka 20, Bois de santal 18, Miel 14, Prune 10, Poivre rose 8",
    allergenes: "Coumarin, Linalool, Eugenol",
  },
  {
    nom: "Écorce Noire", famille: "Boisé", genre: "Homme", intensite: 2, moment: "Jour et soir",
    prix: 79, contenance: "50 ml", type: "Eau de parfum", couleur: "#4d4036", popularite: 71,
    description: "Un bouleau fumé et une écorce terreuse, à la fois brut et raffiné.",
    notes: "Cardamome, Pomme verte | Bouleau, Cyprès | Patchouli, Mousse de chêne",
    composition: "Bouleau 24, Patchouli 20, Mousse de chêne 18, Cyprès 16, Cardamome 12, Pomme verte 10",
    allergenes: "Limonene, Linalool, Evernia Prunastri Extract",
  },
  {
    nom: "Santal Noir", famille: "Boisé", genre: "Homme", intensite: 2, moment: "Soir",
    prix: 105, contenance: "50 ml", type: "Eau de parfum", couleur: "#3b2a24", popularite: 79,
    nouveau: true,
    description: "Un santal sec et épicé, rehaussé de cuir et de cardamome.",
    notes: "Cardamome, Violette | Bois de santal, Accord cuir | Papyrus, Ambre",
    composition: "Bois de santal 34, Accord cuir 16, Ambre 16, Papyrus 14, Cardamome 12, Violette 8",
    allergenes: "Linalool, Limonene, Alpha-Isomethyl Ionone",
  },
  {
    nom: "Ambre Noir", famille: "Oriental", genre: "Homme", intensite: 3, moment: "Soir",
    prix: 112, contenance: "50 ml", type: "Extrait de parfum", couleur: "#4a2a1c", popularite: 87,
    description: "La version masculine de notre signature : un ambre fumé, cuiré et épicé.",
    notes: "Poivre noir, Safran | Ambre, Accord cuir | Encens, Vanille",
    composition: "Résinoïde d'ambre 28, Accord cuir 16, Vanille 16, Encens 14, Poivre noir 14, Safran 12",
    allergenes: "Coumarin, Limonene, Linalool, Eugenol",
  },
  {
    nom: "Oud Cuir", famille: "Oriental", genre: "Homme", intensite: 3, moment: "Soir",
    prix: 145, contenance: "50 ml", type: "Extrait de parfum", couleur: "#3a1f1a", popularite: 74,
    description: "Un oud fumé et animal, gainé d'un cuir noir. Pour les connaisseurs.",
    notes: "Safran, Cardamome | Oud, Accord cuir | Bouleau, Musc",
    composition: "Oud 30, Accord cuir 22, Bouleau 14, Musc 14, Safran 10, Cardamome 10",
    allergenes: "Linalool, Limonene, Eugenol",
  },
  {
    nom: "Rhum Épicé", famille: "Oriental", genre: "Homme", intensite: 2, moment: "Soir",
    prix: 76, contenance: "50 ml", type: "Eau de parfum", couleur: "#8a4a26", popularite: 82,
    description: "Un rhum ambré, réchauffé de cannelle et de vanille, comme un soir d'hiver au coin du feu.",
    notes: "Rhum, Orange | Cannelle, Clou de girofle | Vanille, Bois de chêne",
    composition: "Rhum 24, Vanille 22, Bois de chêne 20, Cannelle 14, Orange 12, Clou de girofle 8",
    allergenes: "Cinnamal, Eugenol, Limonene, Coumarin",
  },
  {
    nom: "Poivre Noir", famille: "Oriental", genre: "Homme", intensite: 2, moment: "Jour et soir",
    prix: 69, contenance: "50 ml", type: "Eau de parfum", couleur: "#4a4644", popularite: 76,
    description: "Un poivre noir piquant et lumineux, adouci par un fond ambré.",
    notes: "Poivre noir, Pamplemousse | Encens, Coriandre | Ambre, Vétiver",
    composition: "Poivre noir 26, Ambre 20, Vétiver 16, Pamplemousse 14, Encens 14, Coriandre 10",
    allergenes: "Limonene, Linalool",
  },
  {
    nom: "Tonka Intense", famille: "Gourmand", genre: "Homme", intensite: 3, moment: "Soir",
    prix: 84, contenance: "50 ml", type: "Eau de parfum", couleur: "#7a5634", popularite: 85,
    description: "Une fève tonka chaude et amandée, rehaussée de lavande et de bois de santal.",
    notes: "Lavande, Bergamote | Fève tonka, Amande | Vanille, Bois de santal",
    composition: "Fève tonka 32, Vanille 18, Bois de santal 16, Amande 12, Lavande 12, Bergamote 10",
    allergenes: "Coumarin, Linalool, Limonene",
  },
  {
    nom: "Whisky Fumé", famille: "Gourmand", genre: "Homme", intensite: 3, moment: "Soir",
    prix: 96, contenance: "50 ml", type: "Eau de parfum", couleur: "#b07a35", popularite: 78,
    nouveau: true,
    description: "L'âme d'un vieux whisky tourbé : bois de chêne, cuir et une pointe de miel.",
    notes: "Accord whisky, Poivre rose | Miel, Accord cuir | Bois de chêne, Vétiver",
    composition: "Accord whisky 26, Bois de chêne 20, Vétiver 18, Accord cuir 14, Miel 12, Poivre rose 10",
    allergenes: "Linalool, Limonene, Eugenol",
  },
  {
    nom: "Ananas Boisé", famille: "Fruité", genre: "Homme", intensite: 2, moment: "Jour",
    prix: 82, contenance: "50 ml", type: "Eau de parfum", couleur: "#c9a03a", popularite: 94,
    description: "Un ananas juteux et fumé sur un fond de bouleau et de musc. Le chic décontracté.",
    notes: "Ananas, Cassis | Bouleau, Jasmin | Mousse de chêne, Musc",
    composition: "Ananas 26, Bouleau 18, Mousse de chêne 18, Musc 18, Cassis 12, Jasmin 8",
    allergenes: "Limonene, Linalool, Evernia Prunastri Extract",
  },
  {
    nom: "Musc d'Acier", famille: "Musqué", genre: "Homme", intensite: 2, moment: "Jour et soir",
    prix: 72, contenance: "50 ml", type: "Eau de parfum", couleur: "#9c968c", popularite: 72,
    description: "Un musc sec et propre, aux accents de pierre et d'iris. Discret mais magnétique.",
    notes: "Aldéhydes, Poivre blanc | Iris, Musc | Ambrette, Cèdre",
    composition: "Musc 34, Ambrette 18, Cèdre 16, Iris 14, Aldéhydes 10, Poivre blanc 8",
    allergenes: "Linalool, Alpha-Isomethyl Ionone, Limonene",
  },
  {
    nom: "Barbier Royal", famille: "Aromatique", genre: "Homme", intensite: 2, moment: "Jour",
    prix: 66, contenance: "100 ml", type: "Eau de toilette", couleur: "#5b7a8c", popularite: 81,
    description: "L'odeur d'un salon de barbier à l'ancienne : lavande, savon et mousse de chêne.",
    notes: "Lavande, Citron | Géranium, Accord savon | Mousse de chêne, Musc",
    composition: "Lavande 28, Mousse de chêne 16, Musc 16, Géranium 14, Accord savon 14, Citron 12",
    allergenes: "Linalool, Geraniol, Limonene, Evernia Prunastri Extract",
  },
  {
    nom: "Sauge Minérale", famille: "Aromatique", genre: "Homme", intensite: 1, moment: "Jour",
    prix: 58, contenance: "100 ml", type: "Eau de toilette", couleur: "#8aa0a0", popularite: 70,
    description: "Une sauge sclarée fraîche sur des pierres chauffées au soleil.",
    notes: "Sauge sclarée, Pamplemousse | Accord minéral, Romarin | Ambre gris, Cèdre",
    composition: "Sauge sclarée 28, Accord minéral 18, Ambre gris 16, Cèdre 14, Pamplemousse 12, Romarin 12",
    allergenes: "Linalool, Limonene",
  },
  {
    nom: "Menthe Glaciale", famille: "Aromatique", genre: "Homme", intensite: 1, moment: "Jour",
    prix: 44, contenance: "100 ml", type: "Eau de Cologne", couleur: "#8fd0c0", popularite: 68,
    description: "Une menthe poivrée ultra-fraîche, pour un coup de fouet immédiat.",
    notes: "Menthe poivrée, Citron | Basilic, Lavande | Musc, Vétiver",
    composition: "Menthe poivrée 30, Citron 16, Musc 16, Vétiver 14, Basilic 12, Lavande 12",
    allergenes: "Limonene, Linalool, Citral",
  },
  {
    nom: "Fougère Nocturne", famille: "Aromatique", genre: "Homme", intensite: 3, moment: "Soir",
    prix: 88, contenance: "50 ml", type: "Eau de parfum", couleur: "#2f3e46", popularite: 83,
    description: "Une fougère moderne et sombre, où la lavande rencontre la vanille et l'ambre.",
    notes: "Lavande, Cardamome | Géranium, Sauge | Vanille, Ambre",
    composition: "Lavande 26, Vanille 20, Ambre 18, Géranium 14, Sauge 12, Cardamome 10",
    allergenes: "Linalool, Coumarin, Geraniol",
  },
];

// ---------------------------------------------------------------------------
// Transformation du format simplifié en fiches complètes (rien à modifier ici)
// ---------------------------------------------------------------------------
const liste = (texte: string) => texte.split(",").map((s) => s.trim()).filter(Boolean);

const creerSlug = (nom: string) =>
  nom
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const creer = (s: Saisie): Parfum => {
  const [tete = "", coeur = "", fond = ""] = s.notes.split("|");
  const composition = liste(s.composition).map((morceau) => {
    const m = morceau.match(/^(.*\S)\s+(\d+)$/);
    if (!m) throw new Error(`Composition mal écrite pour « ${s.nom} » : « ${morceau} »`);
    return { ingredient: m[1], pourcentage: Number(m[2]) };
  });
  const total = composition.reduce((t, c) => t + c.pourcentage, 0);
  if (total !== 100) throw new Error(`La composition de « ${s.nom} » fait ${total} % au lieu de 100 %`);

  return {
    slug: creerSlug(s.nom),
    nom: s.nom,
    famille: s.famille,
    genre: s.genre,
    intensite: s.intensite,
    moment: s.moment,
    prix: s.prix,
    contenance: s.contenance,
    description: s.description,
    notes: { tete: liste(tete), coeur: liste(coeur), fond: liste(fond) },
    couleur: s.couleur,
    popularite: s.popularite,
    nouveau: s.nouveau,
    concentration: { type: s.type, pourcentage: s.pourcentage ?? concentrationParDefaut[s.type] },
    composition,
    allergenes: liste(s.allergenes),
  };
};

export const parfums: Parfum[] = catalogue.map(creer);

// Sécurité : deux parfums ne peuvent pas avoir la même adresse
const slugs = new Set<string>();
for (const p of parfums) {
  if (slugs.has(p.slug)) throw new Error(`Deux parfums ont la même adresse : ${p.slug}`);
  slugs.add(p.slug);
}

export const formatPrix = (prix: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(prix);
