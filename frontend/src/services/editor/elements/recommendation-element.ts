import * as joint from 'jointjs';
import { CustomElement } from 'src/services/editor/elements/custom-elements';

const defaults = {
  attrs: {
    body: {
      width: 'calc(w)',
      height: 'calc(h)',
      fill: 'white',
      strokeWidth: 1,
      stroke: '#AAAAAA',
      rx: 5,
    },
    recommendation_type: {
      style: 'font-size: 18px; font-weight: 500',
      refX: 15,
      refY: 20,
    },
    grade_logo: {
      xlinkHref: './imgs/grade_logo.png',
      refX: 260,
      refY: 17,
      height: 24,
    },
    intervention_type_label: {
      style: 'font-weight: bold',
      refX: 15,
      refY: 70,
      text: 'Intervention type',
    },
    intervention_type_text: {
      refX: 15,
      refY: 93,
    },
    intervention_type_image: {
      xlinkHref: './img/diagnosis.bfe91be3.png',
      refX: 150,
      refY: 68,
      height: 40,
    },
    certainty_label: {
      style: 'font-weight: bold',
      refX: 330,
      refY: 70,
      text: 'Certainty of evidence',
    },
    certainty_text: {
      refX: 330,
      refY: 93,
    },
    certainty_icon_1: {
      xlinkHref: './imgs/certainty.png',
      refX: 365,
      refY: 90,
      height: 20,
    },
    certainty_icon_2: {
      xlinkHref: './imgs/certainty.png',
      refX: 365,
      refY: 90,
      height: 20,
    },
    certainty_icon_3: {
      xlinkHref: './imgs/certainty.png',
      refX: 365,
      refY: 90,
      height: 20,
    },
    certainty_icon_4: {
      xlinkHref: './imgs/certainty.png',
      refX: 365,
      refY: 90,
      height: 20,
    },
    original_transcription_label: {
      style: 'font-weight: bold',
      refX: 15,
      refY: 125,
      text: 'Original transcription',
    },
    original_transcription_text: {
      style: 'line-height: 200%;',
      refX: 15,
      refY: 148,
    },
    comparator_label: {
      style: 'font-weight: bold',
      refX: 15,
      refY: 220,
      text: 'Comparator',
    },
    comparator_text: {
      style: 'line-height: 200%;',
      refX: 15,
      refY: 240,
      text: 'Texto do comparador',
    },
    intervention_label: {
      style: 'font-weight: bold',
      refX: 600,
      refY: 220,
      text: 'Intervention',
    },
    intervention_text: {
      style: 'line-height: 200%;',
      refX: 600,
      refY: 240,
      text: 'Texto do comparador',
    },
    recommendation_arrows_image: {
      xlinkHref: 'imgs/recommendation_arrows/strong_in_favor_intervention.png',
      refX: 300,
      refY: 220,
    },
  },
};

const markup = {
  markup: [{
    tagName: 'rect',
    selector: 'body',
  }, {
    tagName: 'text',
    selector: 'recommendation_type',
  }, {
    tagName: 'image',
    selector: 'grade_logo',
  }, {
    tagName: 'text',
    selector: 'intervention_type_label',
  }, {
    tagName: 'text',
    selector: 'intervention_type_text',
  }, {
    tagName: 'image',
    selector: 'intervention_type_image',
  }, {
    tagName: 'text',
    selector: 'certainty_label',
  }, {
    tagName: 'text',
    selector: 'certainty_text',
  }, {
    tagName: 'image',
    selector: 'certainty_icon_1',
  }, {
    tagName: 'image',
    selector: 'certainty_icon_2',
  }, {
    tagName: 'image',
    selector: 'certainty_icon_3',
  }, {
    tagName: 'image',
    selector: 'certainty_icon_4',
  }, {
    tagName: 'image',
    selector: 'certainty_icon_5',
  }, {
    tagName: 'text',
    selector: 'original_transcription_label',
  }, {
    tagName: 'text',
    selector: 'original_transcription_text',
  }, {
    tagName: 'text',
    selector: 'comparator_label',
  }, {
    tagName: 'text',
    selector: 'comparator_text',
  }, {
    tagName: 'text',
    selector: 'intervention_label',
  }, {
    tagName: 'text',
    selector: 'intervention_text',
  }, {
    tagName: 'image',
    selector: 'recommendation_arrows_image',
  }],
};

const RecommendationDescriptionConstructor = joint.dia.Element.define(
  CustomElement.RECOMMENDATION_DESCRIPTION,
  defaults,
  markup,
);

export default RecommendationDescriptionConstructor;
