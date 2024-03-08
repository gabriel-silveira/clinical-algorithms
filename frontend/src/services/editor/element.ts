import * as joint from 'jointjs';
import { dia } from 'jointjs';

import Editor, { deselectAllTexts } from 'src/services/editor/index';
import Ports from 'src/services/editor/ports';

import customElements, {
  CustomElement,
  elementName,
  RecommendationTotalConstructor,
  TEXTAREA_CLASSNAME,
} from 'src/services/editor/elements/custom-elements';

import { reactive } from 'vue';

import { autoResizeTextarea } from 'src/services/editor/textarea';
import icons from 'src/services/editor/elements/svg_icons';

import {
  FORMAL_RECOMMENDATION,
  INFORMAL_RECOMMENDATION,
  GOOD_PRACTICES, RECOMMENDATION_TYPES,
} from 'src/services/editor/constants/metadata/recommendation_type';
import { COLOR_PRIMARY } from 'src/services/colors';

// export interface IElementToolsPadding {
//   left: number | 20,
//   top: number | 12,
//   right: number | 10,
//   bottom: number | 16,
// }

// export interface IElementToolsSettings {
//   element: dia.Element,
//   options?: {
//     position?: {
//       x: number,
//       y: number,
//     },
//     padding?: IElementToolsPadding,
//   }
// }

class Element {
  editor: Editor;

  data: {
    selectedId: dia.Cell.ID,
    elementToCreate: string,
    creationPosition: {
      x: number,
      y: number,
    },
    recommendationsRelationsMap: { [key: dia.Cell.ID]: dia.Cell.ID },
    recommendationsTogglerRelationsMap: { [key: dia.Cell.ID]: dia.Cell.ID },
    wasMoving: boolean,
  } = reactive({
      selectedId: '',
      elementToCreate: '',
      creationPosition: {
        x: 0,
        y: 0,
      },
      recommendationsRelationsMap: {},
      recommendationsTogglerRelationsMap: {},
      wasMoving: false,
    });

  constructor(editor: Editor) {
    this.editor = editor;
  }

  public getAll() {
    return this.editor.data.graph.getElements();
  }

  public isAction(element?: dia.Element) {
    if (element) return element.prop('type') === CustomElement.ACTION;

    return this.getSelected()?.prop('type') === CustomElement.ACTION;
  }

  public isEvaluation(element?: dia.Element) {
    if (element) return element.prop('type') === CustomElement.EVALUATION;

    return this.getSelected()?.prop('type') === CustomElement.EVALUATION;
  }

  public isLane(element?: dia.Element) {
    if (element) return element.prop('type') === CustomElement.LANE;

    return this.getSelected()?.prop('type') === CustomElement.LANE;
  }

  public setCreationPosition(x: number, y: number) {
    const stringX = String(x);
    const stringY = String(y);

    // ...respecting 10px paper grid
    const fixedX = x - Number(stringX[stringX.length - 1]);
    const fixedY = y - Number(stringY[stringY.length - 1]);

    this.data.creationPosition = { x: fixedX, y: fixedY };
  }

  private removeSelected() {
    this.deleteRecommendationsTotals();

    this.getSelected()?.remove();

    this.deselectAll();

    this.editor.graph.notSaved();
  }

  private customRemoveButton(x = -10, y = -10) {
    return new joint.elementTools.Button({
      focusOpacity: 0.5,
      // x,
      // y,
      offset: {
        x,
        y,
      },
      action: () => {
        this.removeSelected();
      },
      markup: [{
        tagName: 'circle',
        selector: 'button',
        attributes: {
          r: 10,
          fill: 'white',
          cursor: 'pointer',
        },
      }, {
        tagName: 'path',
        selector: 'icon',
        attributes: {
          d: 'M 6.1 -3.972 L 4.972 -5.1 L 0.5 -0.628 L -3.972 -5.1 L -5.1 -3.972 L -0.628 0.5 L -5.1 4.972 L -3.972 6.1 L 0.5 1.628 L 4.972 6.1 L 6.1 4.972 L 1.628 0.5 L 6.1 -3.972 z',
          fill: COLOR_PRIMARY,
          cursor: 'pointer',
        },
      }],
    });
  }

  public createElementsTools(elements: dia.Element[]) {
    elements.forEach((element) => {
      if (element.prop('type') === CustomElement.LANE) {
        this.createTools(element, {
          removeButtons: {
            x: 20,
            y: 17,
          },
        });
      } else {
        this.createTools(element);
      }
    });
  }

  public toggleRecommendation(togglerButtonId: string) {
    const togglerButton = this.getById(togglerButtonId);

    if (togglerButton) {
      const domElement = document.querySelector(`[model-id="${this.data.recommendationsTogglerRelationsMap[togglerButtonId]}"]`);

      if (domElement) {
        if (domElement.getAttribute('display')) {
          domElement.removeAttribute('display');

          togglerButton.attr('icon/d', icons.minus);
        } else {
          domElement.setAttribute('display', 'none');

          togglerButton.attr('icon/d', icons.plus);
        }
      }
    }
  }

  private static createBoundaryTool() {
    return new joint.elementTools.Boundary({
      padding: 10,
      rotate: true,
      useModelGeometry: true,
    });
  }

  static getExpandRecommendationButtonPosition(element: dia.Element) {
    const type = element.prop('type');

    const { width, height } = element.size();

    if (type === CustomElement.ACTION) {
      return {
        x: width + 28,
        y: height - 2,
      };
    }

    return {
      x: width + 25,
      y: height,
    };
  }

  private createTools(element: dia.Element, params?: { removeButtons: { x: number, y: number } }) {
    const allTools: (joint.elementTools.Button | joint.elementTools.Boundary)[] = [];

    // tools for edit mode
    if (!this.editor.data.readOnly) {
      allTools.push(Element.createBoundaryTool());

      const removeButton = this.customRemoveButton(
        params?.removeButtons.x,
        params?.removeButtons.y,
      );

      allTools.push(removeButton);
    }

    const toolsView = new joint.dia.ToolsView({
      tools: [...allTools],
    });

    if (this.editor.data.paper instanceof dia.Paper) {
      const elementView = element.findView(this.editor.data.paper);

      elementView.addTools(toolsView);

      elementView.hideTools();
    }
  }

  public async createElement(event: DragEvent) {
    // prevent default action (open as link for some elements)
    event.preventDefault();

    switch (this.data.elementToCreate) {
      case CustomElement.START:
        this.setCreationPosition(event.x - 24, event.y - 135);
        await this.create.Start();
        break;
      case CustomElement.ACTION:
        this.setCreationPosition(event.x - 100, event.y - 150);
        await this.create.Action();
        break;
      case CustomElement.EVALUATION:
        this.setCreationPosition(event.x - 100, event.y - 150);
        await this.create.Evaluation();
        break;
      case CustomElement.END:
        this.setCreationPosition(event.x - 24, event.y - 135);
        await this.create.End();
        break;
      case CustomElement.LANE:
        this.setCreationPosition(event.x - 24, event.y - 135);
        await this.create.Lane();
        break;
      default:
        await this.create.Start();
    }

    this.editor.graph.notSaved();
  }

  get create() {
    return {
      Start: async () => {
        const element = new customElements.StartElement({
          position: {
            x: this.data.creationPosition.x,
            y: this.data.creationPosition.y,
          },
          ports: Ports.generateToStart(),
        }).resize(40, 40).addTo(this.editor.data.graph);

        this.createTools(element);

        // deselectAllTexts();
      },
      Action: async () => {
        const element = new customElements.ActionElement({
          position: {
            x: this.data.creationPosition.x,
            y: this.data.creationPosition.y,
          },
          ports: Ports.generateToAction(),
        }).resize(200, 100).addTo(this.editor.data.graph);

        this.createTools(element);

        this.textarea.createEventHandlers();

        // deselectAllTexts();
      },
      RecommendationTogglerButton: (
        originalElement: dia.Element,
        recommendationElement: dia.Element,
      ) => {
        const { width, height } = originalElement.size();
        const { x, y } = originalElement.position();

        const togglerElement = new customElements.RecommendationTogglerElement({
          position: {
            x: x + width + 21,
            y: y + height - 10,
          },
        }).addTo(this.editor.data.graph);

        this.data.recommendationsTogglerRelationsMap[togglerElement.id] = recommendationElement.id;
      },
      Recommendation: async (x: number, y: number, originalElement: dia.Element) => {
        const metadata = this.editor.metadata.getFromElement(originalElement);

        if (metadata && metadata.fixed) {
          const RecommendationElement = customElements.RecommendationElement(metadata.fixed);

          const recommendationElement = new RecommendationElement({
            position: {
              x,
              y,
            },
          }).resize(500, 175);

          this.create.RecommendationTogglerButton(originalElement, recommendationElement);

          recommendationElement.attr('./display', 'none');

          setTimeout(() => {
            recommendationElement.addTo(this.editor.data.graph);

            // create click event handlers for each recommendation
            this.create.RecommendationEventHandlers(
              recommendationElement.id,
              originalElement.id,
            );
          }, 100);
        }
      },
      RecommendationEventHandlers: (
        recommendationElementId: dia.Cell.ID,
        originalElementId: dia.Cell.ID,
      ) => {
        // create the ID relations between original element (that contains recommendations)
        // and the element with recommendations list
        // (used for toggle button)
        this.data.recommendationsRelationsMap[originalElementId] = recommendationElementId;

        const domElement = document.querySelector(`[model-id="${recommendationElementId}"]`);

        if (domElement) {
          const listItems = domElement?.getElementsByClassName('row');

          if (listItems.length) {
            for (const listItem of listItems) {
              listItem.addEventListener('click', () => {
                this.editor.metadata.showRecommendation(
                  originalElementId,
                  Number(listItem.getAttribute('data-index')),
                );
              });
            }
          }
        }
      },
      Evaluation: async () => {
        const element = new customElements.EvaluationElement({
          position: {
            x: this.data.creationPosition.x,
            y: this.data.creationPosition.y,
          },
          ports: Ports.generateToEvaluation(),
        }).resize(200, 100).addTo(this.editor.data.graph);

        this.createTools(element);

        this.textarea.createEventHandlers();

        // deselectAllTexts();
      },
      End: async () => {
        const element = new customElements.EndElement({
          position: {
            x: this.data.creationPosition.x,
            y: this.data.creationPosition.y,
          },
        }).resize(40, 40).addTo(this.editor.data.graph);

        this.createTools(element);

        // deselectAllTexts();
      },
      Lane: async () => {
        const element = new customElements.LaneElement({
          position: {
            x: 0,
            y: this.data.creationPosition.y,
          },
        }).resize(3000, 50).addTo(this.editor.data.graph);

        this.createTools(element, {
          removeButtons: {
            x: 20,
            y: 17,
          },
        });

        this.textarea.createEventHandlers();

        // deselectAllTexts();
      },
      RecommendationTotal: async (
        element: dia.Element,
        type: string,
        totalRecommendations: number,
        refY: number,
      ) => {
        const hasPendency = this.editor.metadata.hasTypePendency(element, type);

        if (hasPendency) this.editor.metadata.createPendency();

        const recommendationAbbreviation = {
          [FORMAL_RECOMMENDATION]: 'RF',
          [INFORMAL_RECOMMENDATION]: 'RI',
          [GOOD_PRACTICES]: 'BP',
        };

        const { x, y } = element.position();

        const { width } = element.size();

        const RTEConstructor = RecommendationTotalConstructor(hasPendency);

        const createElement = new RTEConstructor({
          position: {
            x: x + width + 9,
            y: y + refY,
          },
        }).resize(28, 17).addTo(this.editor.data.graph);

        createElement.prop('props/parentElement', element.id);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        createElement.attr('label/text', `${totalRecommendations}${recommendationAbbreviation[type]}`);
      },
    };
  }

  public deselectAll() {
    const elements = this.editor.data.graph.getElements();

    // remove stroke from the selected element
    elements.forEach((element) => {
      // hide element tools
      if (this.editor.data.paper && !this.editor.data.readOnly) {
        element.findView(this.editor.data.paper).hideTools();
      } else if (this.editor.data.readOnly) {
        this.createReadonlyTools(element, false);
      }
    });

    this.editor.element.data.selectedId = '';
  }

  public async setProp(
    propName: string,
    value: boolean | string | number | object | undefined | null,
  ) {
    this.getSelected()?.prop(`props/${propName}`, value);

    // avoid "setNotSavedChanges" without changing anything
    // if (commitChanges) {
    //   await this.joint.setNotSavedChanges(true);
    // }
  }

  public async setAttr(attrName: string, value: string) {
    this.getSelected()?.attr(attrName, value);

    // await this.joint.setNotSavedChanges(true);
  }

  public getById(id: dia.Cell.ID): dia.Element | undefined {
    return this.editor.data.graph.getElements().find((element) => element.id === id);
  }

  private createReadonlyTools(element: dia.Element, showBoundary: boolean) {
    if (this.editor.data.paper) {
      const allTools: (joint.elementTools.Button | joint.elementTools.Boundary)[] = [];

      const elementView = element.findView(this.editor.data.paper);

      if (showBoundary) {
        allTools.push(Element.createBoundaryTool());
      }

      const metadata = this.editor.metadata.getFromElement(element);

      if (metadata?.fixed && metadata.fixed.length) {
        // this.createExpandRecommendationsButton(
        //   allTools,
        //   { ...Element.getExpandRecommendationButtonPosition(element) },
        //   showBoundary ? 2 : 1,
        // );
      }

      const toolsView = new joint.dia.ToolsView({
        tools: [...allTools],
      });

      elementView.addTools(toolsView);
    }
  }

  public select(elementId: dia.Cell.ID) {
    this.deselectAll();

    const element = this.getById(elementId);

    if (element && this.editor.data.paper) {
      const elementView = element.findView(this.editor.data.paper);

      if (elementView) {
        if (this.editor.data.readOnly) {
          this.createReadonlyTools(element, true);
        }

        elementView.showTools();

        this.data.selectedId = elementId;

        console.log('Selected element props:');
        console.log({ ...element });

        const selectedElement = this.getSelected();

        if (selectedElement && selectedElement.prop('type') === CustomElement.LANE) {
          const { y } = selectedElement.position();

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          selectedElement.position(0, y);

          if (document.activeElement?.tagName !== 'INPUT') {
            deselectAllTexts();
          }
        }
      }
    }
  }

  public getSelected() {
    const elements = this.editor.data.graph.getElements();

    return elements.find(({ id }) => this.data.selectedId === id);
  }

  public getLabel(element?: dia.Element) {
    if (element) return element.prop('props/label') || '';

    return this.getSelected()?.prop('props/label') || '';
  }

  public getTitle() {
    return this.getSelected()?.prop('title') || '';
  }

  // PROBABLY DEPRECATED
  // public async setTitle(title: string) {
  //   await this.setProp('title', title);
  //
  //   await this.setAttr('label/text', title);
  // }

  public getName() {
    const elementType = this.getSelected()?.prop('type');

    if (elementType) return elementName[elementType];

    return '';
  }

  get input() {
    return {
      setValues: (elements: dia.Element[]) => {
        elements.forEach((element) => {
          if (this.isLane(element)) {
            const textarea = this.input.getFromEditorElement(element.id);

            if (textarea) {
              textarea.value = element.prop('props/label') || '';
            }
          }

          setTimeout(() => {
            deselectAllTexts();
          }, 1);
        });
      },
      getFromEditorElement(elementId: dia.Cell.ID) {
        const domElement = document.querySelector(`[model-id="${elementId}"]`);

        return domElement?.getElementsByTagName('input')[0];
      },
    };
  }

  get textarea() {
    return {
      getFromEditorElement(elementId: dia.Cell.ID) {
        const domElement = document.querySelector(`[model-id="${elementId}"]`);

        return domElement?.getElementsByTagName('textarea')[0];
      },
      value: () => {
        const selectedElement = this.getSelected();

        if (selectedElement) {
          // this.textarea.
        }
      },
      setValues: (elements: dia.Element[]) => {
        elements.forEach((element) => {
          if (
            this.isAction(element)
            || this.isEvaluation(element)
            // || this.isLane(element)
          ) {
            const textarea = this.textarea.getFromEditorElement(element.id);

            if (textarea) {
              textarea.value = element.prop('props/label') || '';
            }
          }

          setTimeout(() => {
            deselectAllTexts();
          }, 1);
        });
      },
      getEditorElement: (input: HTMLElement) => {
        const father = input.parentElement;
        const grandfather = father?.parentElement;
        const grandGrandfather = grandfather?.parentElement;
        const element = grandGrandfather?.parentElement;

        if (element) {
          const elementId = element?.getAttribute('model-id');

          if (elementId) return this.getById(elementId);
        }

        return undefined;
      },
      createEventHandlers: () => {
        const inputs = document.getElementsByClassName(TEXTAREA_CLASSNAME);

        if (inputs.length) {
          // eslint-disable-next-line no-restricted-syntax
          for (const input of inputs) {
            if (input instanceof HTMLTextAreaElement) {
              autoResizeTextarea(input);
            }

            input.addEventListener('input', (event) => {
              const element = this.textarea.getEditorElement(event.target as HTMLElement);

              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              element?.prop('props/label', event.target?.value);

              this.editor.graph.notSaved();
            });
          }
        }
      },
      disableAll() {
        const inputs = document.getElementsByClassName(TEXTAREA_CLASSNAME);

        if (inputs.length) {
          // eslint-disable-next-line no-restricted-syntax
          for (const input of inputs) {
            input.setAttribute('readonly', 'true');
            input.classList.add('cursor-inherit');
          }
        }
      },
    };
  }

  public createRecommendations() {
    const allElements = this.getAll();

    if (allElements.length) {
      for (const element of allElements) {
        if (element.prop('type') === CustomElement.ACTION) {
          const { x, y } = element.position();

          void this.create.Recommendation(x, y + 106, element);
        } else if (element.prop('type') === CustomElement.EVALUATION) {
          const { x, y } = element.position();

          void this.create.Recommendation(x + 1, y + 111, element);
        }
      }
    }
  }

  static removeLinkToolButtons(linkView: dia.LinkView) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    linkView.$el[0].getElementsByClassName('link-tools')[0]?.remove();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const markVertexGroups = linkView.$el[0].getElementsByClassName('marker-vertex-group');

    if (markVertexGroups && markVertexGroups.length) {
      for (const markVertexGroup of markVertexGroups) {
        markVertexGroup.getElementsByClassName('marker-vertex-remove-area')[0]?.remove();
        markVertexGroup.getElementsByClassName('marker-vertex-remove')[0]?.remove();
      }
    }
  }

  public createRecommendationsTotals(element?: dia.Element) {
    const currentElement = element || this.getSelected();

    if (currentElement) {
      if (
        [CustomElement.ACTION, CustomElement.EVALUATION].includes(currentElement.prop('type'))
      ) {
        const totals: { [key: string]: number } = {};

        const metadata = this.editor.metadata.getFromElement(element);

        if (metadata && metadata.fixed.length) {
          for (const fixedMetadata of metadata.fixed) {
            if (fixedMetadata) {
              if (!totals[fixedMetadata.recommendation_type]) {
                totals[fixedMetadata.recommendation_type] = 1;
              } else {
                totals[fixedMetadata.recommendation_type] += 1;
              }
            }
          }

          if (Object.keys(totals).length) {
            let y = 2;

            for (const { value } of RECOMMENDATION_TYPES) {
              if (totals[value]) {
                void this.create.RecommendationTotal(currentElement, value, totals[value], y);

                y += 20;
              }
            }
          }
        }
      }
    }
  }

  public deleteRecommendationsTotals(element?: dia.Element) {
    const parentElement = element || this.getSelected();

    if (parentElement) {
      for (const currentElement of this.getAll()) {
        if (
          currentElement.prop('type') === CustomElement.RECOMMENDATION_TOTAL
          && currentElement.prop('props/parentElement') === parentElement.id
        ) {
          currentElement.remove();
        }
      }
    }
  }

  public updateRecommendationsTotals(element?: dia.Element) {
    this.deleteRecommendationsTotals();

    const parentElement = element || this.getSelected();

    if (parentElement) {
      this.editor.metadata.clearPendency();

      this.createRecommendationsTotals(parentElement);
    }
  }

  public async createAllRecommendationsTotals() {
    const allElements = this.getAll();

    if (allElements.length) {
      for (const element of allElements) {
        this.updateRecommendationsTotals(element);
      }
    }
  }

  public showAllTools() {
    const allElements = this.getAll();

    if (allElements.length) {
      for (const element of allElements) {
        if (
          [CustomElement.ACTION, CustomElement.EVALUATION].includes(element.prop('type'))
          && this.editor.data.paper
        ) {
          const elementView = element.findView(this.editor.data.paper);

          if (elementView) {
            elementView.showTools();
          }
        }
      }
    }
  }

  public centerViewOnSelected() {
    const selectedElement = this.getSelected();

    if (selectedElement) {
      const { y, x } = selectedElement.position();

      const stageWrapper = document.getElementById('editor-stage-wrapper');

      if (stageWrapper) {
        const diffToYCenter = (((stageWrapper.offsetHeight - 36) / 2) - 100);
        const diffToXCenter = ((stageWrapper.offsetWidth / 2) - 200);

        const newY = y - diffToYCenter;
        const newX = x - diffToXCenter;

        Editor.setScroll({ y: newY, x: newX });
      }
    }
  }

  public clone() {
    const selectedElement = this.getSelected();

    if (selectedElement) {
      this.deselectAll();

      const labelPrefix = 'Clone';

      const clonedElement = selectedElement.clone();

      clonedElement.prop('props/label', `${labelPrefix} - ${selectedElement.prop('props/label') || ''}`);

      clonedElement.translate(40, 40);

      clonedElement.addTo(this.editor.data.graph);

      this.createTools(clonedElement);

      setTimeout(() => {
        this.editor.element.textarea.setValues([clonedElement]);

        clonedElement.toFront();

        this.select(clonedElement.id);
      }, 100);
    }
  }
}

export default Element;
