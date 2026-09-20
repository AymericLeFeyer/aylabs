/**
 * Formatage compact « à la YouTube » : toujours trois chiffres significatifs.
 * 13 300 → « 13,3 K », 993 456 → « 993 K », 1 004 000 → « 1,00 M ».
 *
 * La valeur est **tronquée**, jamais arrondie : 999 999 vues restent
 * « 999 K », le million ne s'affiche qu'une fois réellement atteint.
 */
const UNITS = [
  { threshold: 1_000_000_000, suffix: " Md" },
  { threshold: 1_000_000, suffix: " M" },
  { threshold: 1_000, suffix: " K" },
] as const;

export const formatCompactCount = (value: number): string => {
  if (!Number.isFinite(value)) return "0";

  const abs = Math.abs(value);
  const unit = UNITS.find((entry) => abs >= entry.threshold);
  if (!unit) return Math.trunc(value).toString();

  const scaled = value / unit.threshold;
  const absScaled = Math.abs(scaled);
  const decimals = absScaled < 10 ? 2 : absScaled < 100 ? 1 : 0;
  const factor = 10 ** decimals;
  // L'epsilon rattrape les flottants (13,3 × 10 vaut parfois 132,999…).
  const truncated = Math.trunc(scaled * factor + 1e-9) / factor;

  return `${truncated.toFixed(decimals).replace(".", ",")}${unit.suffix}`;
};
