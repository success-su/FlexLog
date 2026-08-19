const KG_TO_LB = 2.2046226218

export function convertWeight(value, from, to) {
  if (from === to) return Number(value)
  return from === 'kg' ? Number(value) * KG_TO_LB : Number(value) / KG_TO_LB
}
