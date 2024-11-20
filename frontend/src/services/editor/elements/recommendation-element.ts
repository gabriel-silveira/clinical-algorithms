import * as joint from 'jointjs';
import { CustomElement } from 'src/services/editor/elements/custom-elements';

const defaults = {
  attrs: {
    body: {
      width: 'calc(w)',
      height: 'calc(h)',
      fill: '#F4F4F6',
      strokeWidth: 0,
    },
    title: {
      style: 'font-size: 32px; font-weight: bold',
      refX: 30,
      refY: 35,
    },
    description: {
      style: 'font-size: 18px',
      refX: 30,
      refY: 90,
    },
    author: {
      style: 'font-size: 16px',
      refX: 30,
      refY: 132,
    },
  },
};

const markup = {
  markup: [{
    tagName: 'rect',
    selector: 'body',
  }, {
    tagName: 'text',
    selector: 'title',
  }, {
    tagName: 'text',
    selector: 'description',
  }, {
    tagName: 'text',
    selector: 'author',
  }],
};

const RecommendationDescriptionConstructor = joint.dia.Element.define(
  CustomElement.RECOMMENDATION_DESCRIPTION,
  defaults,
  markup,
);

export default RecommendationDescriptionConstructor;
