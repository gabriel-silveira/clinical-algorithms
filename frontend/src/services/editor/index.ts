import * as joint from 'jointjs';
import { dia } from 'jointjs';

import { IJointData } from 'src/services/editor/types';
import { reactive } from 'vue';
import customElements, { CustomElement } from 'src/services/editor/elements/custom-elements';
import Element from 'src/services/editor/element';
import Ports from 'src/services/editor/ports';
import Graph from 'src/services/editor/graph';
import Metadata from 'src/services/editor/metadata';
import { RouteLocationNormalizedLoaded, Router } from 'vue-router';
import { ALGORITHMS_EDITOR } from 'src/router/routes/algorithms';
import { QVueGlobals } from 'quasar';

const graph = new joint.dia.Graph({}, { cellNamespace: customElements });

export const deselectAllTexts = () => {
  window.getSelection()?.removeAllRanges();
};

class Editor {
  paperDiv: HTMLElement | undefined;

  graph: Graph;

  element: Element;

  ports: Ports;

  metadata: Metadata;

  quasar: QVueGlobals;

  route: RouteLocationNormalizedLoaded;

  router: Router;

  data: IJointData = reactive({
    isMaintainer: false,
    readOnly: false,
    showSaveDialog: false,
    paper: undefined,
    graph,
  });

  constructor(
    quasar: QVueGlobals,
    route: RouteLocationNormalizedLoaded,
    router: Router,
  ) {
    this.quasar = quasar;
    this.route = route;
    this.router = router;

    this.element = new Element(this);
    this.ports = new Ports(this);
    this.graph = new Graph(this);
    this.metadata = new Metadata(this);
  }

  public reset() {
    this.graph.data.savingTimeout = null;
    this.data.graph.clear();
  }

  public async init(elementId: string) {
    await this.setPaper(elementId);
  }

  private async setPaper(elementId: string) {
    return new Promise((resolve, reject) => {
      try {
        this.paperDiv = document.getElementById(elementId) || undefined;

        this.data.paper = new joint.dia.Paper({
          el: this.paperDiv,
          model: this.data.graph,
          width: 3000,
          height: 3000,

          cellViewNamespace: customElements,
          preventDefaultViewAction: false,

          drawGrid: false,
          gridSize: 2,
          background: {
            color: '#EAEAEA',
          },

          linkPinning: false,
          snapLinks: { radius: 10 },

          interactive: () => !this.data.readOnly,

          defaultLink: new joint.dia.Link({
            attrs: {
              '.marker-target': {
                d: 'M 10 0 L 0 5 L 10 10 z',
              },
            },
          }),
        });

        this.data.paper.on('blank:pointerup', (/* elementView */) => {
          // if (this.metadata.pendency.has()) {
          //   this.metadata.alertPendency();
          // } else {
          //   this.element.deselectAll();
          // }
          this.element.deselectAll();
        });

        this.data.paper.on('blank:pointerdown cell:pointerdown', () => {
          if (document.activeElement && document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();

            deselectAllTexts();
          }
        });

        // this.data.paper.on('cell:pointerdown', (cellView, evt) => {
        //   cellView.preventDefaultInteraction(evt);
        // });

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.data.graph.on('change:position', (cell: dia.Cell) => {
          this.element.data.wasMoving = true;

          this.graph.notSaved();

          deselectAllTexts();

          const element = this.element.getById(cell.id);

          if (element) {
            this.element.deleteRecommendationsTotals(element);
          }
        });

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.data.graph.on('change:vertices', (/* cell: dia.Cell */) => {
          this.graph.notSaved();
        });

        this.data.paper.on('element:pointerdown', (/* elementView: dia.ElementView */) => {
          this.element.deselectAll();
        });

        this.data.paper.on('element:pointerup', (elementView: dia.ElementView) => {
          // do not select lane element if it's in read only mode
          if (
            !(
              this.data.readOnly
              && elementView.options.model.prop('type') === CustomElement.LANE
            )
          ) {
            this.element.select(elementView.options.model.id);
          }

          // redraw recommendations totals after stop moving
          if (this.element.data.wasMoving) {
            this.element.updateRecommendationsTotals();

            this.element.data.wasMoving = false;
          }
        });

        this.data.paper.on('link:snap:connect', () => {
          this.element.deselectAll();

          deselectAllTexts();
        });

        this.data.paper.on('link:connect', () => {
          this.element.deselectAll();

          this.graph.notSaved();
        });

        this.data.paper.on('link:disconnect', () => {
          this.element.deselectAll();

          this.graph.notSaved();
        });

        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  // private static createLink() {
  //   return new customElements.LinkElement();
  // }

  public toggleSaveDialog() {
    this.data.showSaveDialog = !this.data.showSaveDialog;
  }

  public setReadOnly(mode: string) {
    this.data.readOnly = !this.data.isMaintainer || mode === 'public';
  }

  public async switchToMode() {
    await this.router.replace({
      name: ALGORITHMS_EDITOR,
      query: {
        id: this.route.query.id,
        mode: this.route.query.mode === 'edit' ? 'public' : 'edit',
        node: this.route.query.node || undefined,
        search: this.route.query.search || undefined,
      },
    });

    setTimeout(() => window.location.reload(), 50);
  }

  static setScroll(params: { x?: number, y?: number }) {
    const stageWrapper = document.getElementById('editor-stage-wrapper');

    if (stageWrapper) {
      if (params.x !== undefined) {
        stageWrapper.scrollLeft = params.x;
      }

      if (params.y !== undefined) {
        stageWrapper.scrollTop = params.y;
      }
    }
  }

  public setIsMaintainer(value: boolean) {
    this.data.isMaintainer = value;
  }
}

export default Editor;
