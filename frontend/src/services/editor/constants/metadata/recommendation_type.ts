export const FORMAL_RECOMMENDATION = 'formal';
export const INFORMAL_RECOMMENDATION = 'not_formal';
export const GOOD_PRACTICES = 'good_practices';

export const RECOMMENDATION_TYPES = [
  {
    value: FORMAL_RECOMMENDATION,
    label: 'Formal recommendation',
  },
  {
    value: GOOD_PRACTICES,
    label: 'Good practice statement',
  },
  {
    value: INFORMAL_RECOMMENDATION,
    label: 'Informal recommendation',
  },
];

export const getRecommendationTypeLabel = (recommendationType: string) => {
  const recommendationFound = RECOMMENDATION_TYPES.find(
    (type) => type.value === recommendationType,
  );

  return recommendationFound?.label;
};
