import {
  CONDITIONAL_RECOMMENDATION,
  STRONG_RECOMMENDATION,
} from 'src/services/editor/constants/metadata/recommendation_strength';

import {
  AGAINST_THE_INTERVENTION,
  IN_FAVOR_OF_THE_INTERVENTION,
  BOTH,
} from 'src/services/editor/constants/metadata/direction';

import { IFixedMetadata } from 'src/services/editor/constants/metadata';
import { FORMAL_RECOMMENDATION } from 'src/services/editor/constants/metadata/recommendation_type';

import GradeIcon from 'src/assets/imgs/grade_logo.png';

export const goodPracticeArrowsImage = (data: IFixedMetadata) => {
  if (data.direction === IN_FAVOR_OF_THE_INTERVENTION) {
    return 'imgs/recommendation_arrows/in_favor.png';
  }

  if (data.direction === AGAINST_THE_INTERVENTION) {
    return 'imgs/recommendation_arrows/against.png';
  }

  return 'imgs/recommendation_arrows/both.png';
};

export const recommendationArrowsImage = (data: IFixedMetadata) => {
  // STRONG, IN FAVOR
  if (
    data.strength === STRONG_RECOMMENDATION
    && data.direction === IN_FAVOR_OF_THE_INTERVENTION
  ) {
    return 'imgs/recommendation_arrows/strong_in_favor_intervention.png';
  }

  // CONDITIONAL, IN FAVOR
  if (
    data.strength === CONDITIONAL_RECOMMENDATION
    && data.direction === IN_FAVOR_OF_THE_INTERVENTION
  ) {
    return 'imgs/recommendation_arrows/conditional_in_favor_intervention.png';
  }

  // CONDITIONAL, BOTH
  if (
    data.strength === CONDITIONAL_RECOMMENDATION
    && data.direction === BOTH
  ) {
    return 'imgs/recommendation_arrows/conditional_both_directions.png';
  }

  // CONDITIONAL, AGAINST
  if (
    data.strength === CONDITIONAL_RECOMMENDATION
    && data.direction === AGAINST_THE_INTERVENTION
  ) {
    return 'imgs/recommendation_arrows/conditional_in_favor_comparator.png';
  }

  // STRONG, AGAINST
  if (
    data.strength === STRONG_RECOMMENDATION
    && data.direction === AGAINST_THE_INTERVENTION
  ) {
    return 'imgs/recommendation_arrows/strong_in_favor_comparator.png';
  }

  return '';
};

export const recommendationArrowsLine = (recommendation: IFixedMetadata, showGradeLogo = false) => {
  let items = '';

  if (
    recommendation.recommendation_type === FORMAL_RECOMMENDATION
    && showGradeLogo
  ) {
    items += '<div class="row">';
    items += '<div class="col-10 flex items-center">';
  }

  items += '<div class="row">';
  items += '<div class="col-4 flex items-center text-caption q-pa-sm"><div><b>Comparator:</b><br/>';
  items += recommendation.comparator;
  items += '</div></div>';

  items += '<div class="col-4 flex items-center justify-center">';

  if (recommendation.recommendation_type) {
    if (recommendation.recommendation_type === FORMAL_RECOMMENDATION) {
      if (recommendation.strength && recommendation.direction) {
        items += `<img src="${recommendationArrowsImage(recommendation)}" alt="" />`;
      }
    } else if (recommendation.direction) {
      items += `<img src="${goodPracticeArrowsImage(recommendation)}" alt="" />`;
    }
  }

  items += '</div>';

  items += '<div class="col-4 flex items-center text-caption q-pa-sm"><div><b>Intervention:</b><br/>';
  items += recommendation.intervention;
  items += '</div></div>';

  items += '</div>';

  if (
    recommendation.recommendation_type === FORMAL_RECOMMENDATION
    && showGradeLogo
  ) {
    items += '</div>';
    items += '<div class="col-2 flex items-center justify-center">';
    items += `<img src="${GradeIcon}" style="width:75%" />`;
    items += '</div>';
    items += '</div>';
  }

  return items;
};
