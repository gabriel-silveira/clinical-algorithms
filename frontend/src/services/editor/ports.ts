import Editor from 'src/services/editor/index';

import {
  ACTION_PORT,
  EVALUATION_PORT,
  ROUND_PORT,
} from 'src/services/editor/elements/custom-elements';

class Ports {
  editor: Editor;

  constructor(editor: Editor) {
    this.editor = editor;
  }

  public static generate(
    x: number,
    y: number,
    port: { attrs: { body: { x: number, y: number } } },
  ) {
    const newlyPort = { ...port };

    newlyPort.attrs.body.x = x;
    newlyPort.attrs.body.y = y;

    return {
      items: [newlyPort],
    };
  }

  public static generateToStart() {
    return Ports.generate(14, 20, ROUND_PORT);
  }

  public static generateToAction() {
    return Ports.generate(0, 40, ACTION_PORT);
  }

  public static generateActionPorts() {
    const portBody = {
      magnet: true,
      r: 6,
      fill: 'transparent',
      stroke: 'transparent',
    };

    return {
      groups: {
        top: {
          position: {
            name: 'top',
          },
          attrs: {
            portBody,
          },
          label: {
            position: {
              name: 'left',
              args: { y: 6 },
            },
            markup: [{
              tagName: 'text',
              selector: 'label',
              className: 'label-text',
            }],
          },
          markup: [{
            tagName: 'circle',
            selector: 'portBody',
          }],
        },
        bottom: {
          position: {
            name: 'bottom',
          },
          attrs: {
            portBody,
          },
          label: {
            position: {
              name: 'left',
              args: { y: 6 },
            },
            markup: [{
              tagName: 'text',
              selector: 'label',
              className: 'label-text',
            }],
          },
          markup: [{
            tagName: 'circle',
            selector: 'portBody',
          }],
        },
        in: {
          position: {
            name: 'left',
          },
          attrs: {
            portBody,
          },
          label: {
            position: {
              name: 'left',
              args: { y: 6 },
            },
            markup: [{
              tagName: 'text',
              selector: 'label',
              className: 'label-text',
            }],
          },
          markup: [{
            tagName: 'circle',
            selector: 'portBody',
          }],
        },
        out: {
          position: {
            name: 'right',
          },
          attrs: {
            portBody,
          },
          label: {
            position: {
              name: 'right',
              args: { y: 6 },
            },
            markup: [{
              tagName: 'text',
              selector: 'label',
              className: 'label-text',
            }],
          },
          markup: [{
            tagName: 'circle',
            selector: 'portBody',
          }],
        },
      },
    };
  }

  public static generateToEvaluation() {
    return Ports.generate(31, 38, EVALUATION_PORT);
  }
}

export default Ports;
