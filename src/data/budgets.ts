// Tranches de prix, utilisées par le filtre de la collection et par le test « Le parfum pour vous »
export const budgets = [
  { id: "petit", libelle: "Moins de 60 €", min: 0, max: 59.99 },
  { id: "moyen", libelle: "De 60 à 90 €", min: 60, max: 90 },
  { id: "grand", libelle: "Plus de 90 €", min: 90.01, max: Infinity },
] as const;

export type BudgetId = (typeof budgets)[number]["id"];

export const dansBudget = (prix: number, id: string) => {
  const b = budgets.find((x) => x.id === id);
  return !b || (prix >= b.min && prix <= b.max);
};
