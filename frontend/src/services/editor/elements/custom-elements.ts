import * as joint from 'jointjs';
import { IFixedMetadata } from 'src/services/editor/constants/metadata';
import { recommendationArrowsLine } from 'src/services/recommendations';
import icons from 'src/services/editor/elements/svg_icons';
import { COLOR_PRIMARY } from 'src/services/colors';

export enum CustomElement {
  START = 'StartElement',
  ACTION = 'ActionElement',
  EVALUATION = 'EvaluationElement',
  RECOMMENDATION = 'RecommendationElement',
  RECOMMENDATION_TOTAL = 'RecommendationTotalElement',
  RECOMMENDATION_TOGGLER = 'RecommendationTogglerElement',
  END = 'EndElement',
  LINK = 'LinkElement',
  // CARD = 'ElementCardExample',
  LANE = 'LaneElement',
}

export const elementName: {
  [key: string]: string,
} = {
  [CustomElement.START]: 'Start',
  [CustomElement.ACTION]: 'Action',
  [CustomElement.EVALUATION]: 'Evaluation',
  [CustomElement.RECOMMENDATION]: 'Recommendation',
  [CustomElement.RECOMMENDATION_TOTAL]: 'RecommendationTotal',
  [CustomElement.RECOMMENDATION_TOGGLER]: 'RecommendationToggler',
  [CustomElement.END]: 'End',
  [CustomElement.LINK]: 'Link',
  [CustomElement.LANE]: 'Time',
};

export const ROUND_PORT = {
  markup: [
    {
      tagName: 'rect',
      selector: 'body',
    },
  ],
  attrs: {
    body: {
      magnet: true,
      width: 11,
      height: 11,
      x: 0,
      y: 0,
      fill: '#21BA45',
      rx: 6,
      ry: 6,
    },
  },
};

export const ACTION_PORT = {
  markup: [
    {
      tagName: 'rect',
      selector: 'body',
    },
  ],
  attrs: {
    body: {
      magnet: true,
      width: 200,
      height: 11,
      x: 0,
      y: 0,
      fill: '#0089Ef',
      rx: 5,
      ry: 5,
    },
  },
};

export const EVALUATION_PORT = {
  markup: [
    {
      tagName: 'rect',
      selector: 'body',
    },
  ],
  attrs: {
    body: {
      magnet: true,
      width: 138,
      height: 11,
      x: 0,
      y: 0,
      fill: '#ef7542',
      rx: 5,
      ry: 5,
    },
  },
};

export const TEXTAREA_CLASSNAME = 'element-textarea-input';

const getRecommendationTotalAttributes = () => ({
  attrs: {
    body: {
      width: 'calc(w)',
      height: 'calc(h)',
      strokeWidth: 0,
      fill: '#445566',
      rx: 2,
      ry: 2,
    },
    label: {
      textVerticalAnchor: 'middle',
      textAnchor: 'middle',
      x: 'calc(0.5*w)',
      y: 'calc(0.55*h)',
      fontSize: 12,
      fontFamily: 'Courier New, sans-serif',
      fill: 'white',
      text: '1RF',
    },
  },
});

export const RecommendationTotalConstructor = (hasPendency: boolean) => {
  const params = { ...getRecommendationTotalAttributes() };

  params.attrs.body.fill = hasPendency ? '#FF0000' : params.attrs.body.fill;

  return joint.dia.Element.define(
    CustomElement.RECOMMENDATION_TOTAL,
    {
      ...params,
    },
    {
      markup: [{
        tagName: 'rect',
        selector: 'body',
      }, {
        tagName: 'text',
        selector: 'label',
      }],
    },
  );
};

const customElements = {
  [CustomElement.LINK]: joint.dia.Link.define(CustomElement.LINK, {
    connector: { name: 'rounded' },
    router: { name: 'manhattan' },
    attrs: {
      line: {
        connection: true,
        stroke: 'grey',
        strokeWidth: 2,
        targetAnchor: {},
        targetMarker: {
          stroke: 'none',
          strokeWidth: 0,
          type: 'path',
          fill: 'grey',
          d: 'M 10 -10 -2 0 10 10 Z',
        },
      },
    },
  }, {
    markup: [{
      tagName: 'path',
      selector: 'line',
      attributes: {
        fill: 'none',
        pointerEvents: 'none',
      },
    }],
  }),

  [CustomElement.RECOMMENDATION_TOGGLER]: joint.dia.Element.define(
    CustomElement.RECOMMENDATION_TOGGLER,
    {
      attrs: {
        button: {
          r: 12,
          fill: COLOR_PRIMARY,
          cursor: 'pointer',
        },
        icon: {
          d: icons.plus,
          fill: 'white',
          pointerEvents: 'none',
          cursor: 'pointer',
        },
      },
    },
    {
      markup: [{
        tagName: 'circle',
        selector: 'button',
      }, {
        tagName: 'path',
        selector: 'icon',
      }],
    },
  ),

  [CustomElement.RECOMMENDATION]: (recommendations: IFixedMetadata[]) => {
    let items = '';

    // only the 3 first recommendations
    for (const recommendation of recommendations) {
      if (recommendation.intervention && recommendation.comparator) {
        items += `<div class="bg-white row" data-index="${recommendation.index}">`;

        items += recommendationArrowsLine(recommendation, true);

        items += '</div>';
      }
    }

    return joint.dia.Element.define(CustomElement.RECOMMENDATION, {
      attrs: {
        foreignObject: {
          width: 'calc(w)',
          height: 'calc(h)',
        },
      },
    }, {
      markup: joint.util.svg/* xml */`
      <foreignObject
        @selector="foreignObject"
      >
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          class="recommendation-element"
        >
          <div class="text-caption">
            ${items}
          </div>
        </div>
      </foreignObject>
    `,
    });
  },

  [CustomElement.RECOMMENDATION_TOTAL]: joint.dia.Element.define(
    CustomElement.RECOMMENDATION_TOTAL,
    {
      ...getRecommendationTotalAttributes(),
    },
    {
      markup: [{
        tagName: 'rect',
        selector: 'body',
      }, {
        tagName: 'text',
        selector: 'label',
      }],
    },
  ),

  [CustomElement.START]: joint.dia.Element.define(CustomElement.START, {
    attrs: {
      body: {
        width: 'calc(w)',
        height: 'calc(h)',
        rx: 20,
        ry: 20,
        fill: 'white',
        stroke: '#21BA45',
        strokeWidth: 3,
      },
    },
  }, {
    markup: [{
      tagName: 'rect',
      selector: 'body',
    }, {
      tagName: 'text',
      selector: 'label',
    }, {
      tagName: 'path',
      selector: 'icon',
    }],
  }),

  [CustomElement.ACTION]: joint.dia.Element.define(CustomElement.ACTION, {
    attrs: {
      foreignObject: {
        width: 'calc(w)',
        height: 'calc(h)',
      },
    },
  }, {
    markup: joint.util.svg/* xml */`
      <foreignObject
        @selector="foreignObject"
      >
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          class="editor-action-element"
        >
          <div class="editor-action-element-bevel">
            <textarea
              class="${TEXTAREA_CLASSNAME}"
              autocomplete="off"
              placeholder="Acción"
              contenteditable="true"
              maxlength="60"
              spellcheck="false"
              rows="1"
              @selector="elementLabel"
            ></textarea>
          </div>
        </div>
      </foreignObject>
    `,
  }),

  [CustomElement.EVALUATION]: joint.dia.Element.define(CustomElement.EVALUATION, {
    attrs: {
      foreignObject: {
        width: 'calc(w)',
        height: 'calc(h)',
      },
    },
  }, {
    markup: joint.util.svg/* xml */`
      <foreignObject
        @selector="foreignObject"
      >
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          class="editor-evaluation-element"
        >
          <div>
            <textarea
              class="${TEXTAREA_CLASSNAME}"
              autocomplete="off"
              placeholder="Evaluación"
              contenteditable="true"
              maxlength="60"
              spellcheck="false"
              rows="1"
              @selector="elementLabel"
            ></textarea>
          </div>
        </div>
      </foreignObject>
    `,
  }),

  [CustomElement.LANE]: joint.dia.Element.define(CustomElement.LANE, {
    attrs: {
      foreignObject: {
        width: 'calc(w)',
        height: 'calc(h)',
      },
    },
  }, {
    markup: joint.util.svg/* xml */`
      <foreignObject
        @selector="foreignObject"
      >
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          class="editor-lane-element"
        >
          <div
            style="cursor:move"
          >
            <div
              style="height:20px;border-bottom:2px solid #777777;margin-top:30px"
            >
            </div>
            <input
              class="${TEXTAREA_CLASSNAME}"
              placeholder="Título"
              contenteditable="true"
              maxlength="60"
              spellcheck="false"
              style="width:530px"
            />
          </div>
        </div>
      </foreignObject>
    `,
  }),

  [CustomElement.END]: joint.dia.Element.define(CustomElement.END, {
    // size: {
    //   width: 40,
    //   height: 40,
    // },
    attrs: {
      body: {
        width: 'calc(w)',
        height: 'calc(h)',
        rx: 20,
        ry: 20,
        fill: 'white',
        stroke: '#FF0000',
        strokeWidth: 3,
      },
      // body: {
      //   width: 40,
      //   height: 40,
      //   rx: 25,
      //   ry: 25,
      //   fill: 'white',
      //   stroke: '#FF0000',
      //   strokeWidth: 3,
      // },
    },
  }, {
    markup: [{
      tagName: 'rect',
      selector: 'body',
    }, {
      tagName: 'text',
      selector: 'label',
    }, {
      tagName: 'path',
      selector: 'icon',
    }],
  }),
};

export default customElements;
