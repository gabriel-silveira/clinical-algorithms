export const HIGH = 'High';
export const MODERATE = 'Moderate';
export const LOW = 'Low';
export const VERY_LOW = 'Very Low';

export const CERTAINTY = {
  HIGH,
  MODERATE,
  LOW,
  VERY_LOW,
};

const CERTAINTY_SPANISH: { [key: string]: string } = {
  [HIGH]: 'Alta',
  [MODERATE]: 'Moderada',
  [LOW]: 'Baja',
  [VERY_LOW]: 'Muy baja',
};

export function translateCertainty(value: string) {
  return CERTAINTY_SPANISH[value];
}
