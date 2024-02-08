import Editor from 'src/services/editor/index';
import { dia } from 'jointjs';
import { reactive } from 'vue';
import { IFixedMetadata, IFixedMetadataLink } from 'src/services/editor/constants/metadata';

class Metadata {
  editor: Editor;

  data: {
    mountingComponent: boolean,
    loadingBlocks: boolean,
    totalBlocks: number,
    totalLinks: { [key: number]: number },
    showPanel: boolean,
    recommendationToShow: {
      originalElementId: dia.Cell.ID,
      data: IFixedMetadata,
    } | null,
    pendency: string[] | null,
  } = reactive({
      mountingComponent: true,
      loadingBlocks: false,
      totalBlocks: 0,
      totalLinks: {},
      showPanel: false,
      recommendationToShow: null,
      pendency: null,
    });

  constructor(editor: Editor) {
    this.editor = editor;
  }

  get pendency() {
    return {
      has: () => this.data.pendency !== null && this.data.pendency.length > 0,
      add: (blockIndex: number, propName: string) => {
        const pendency = `${blockIndex}-${propName}`;

        if (this.data.pendency === null) this.data.pendency = [];

        const pendencyExists = this.data.pendency.find((value) => value === pendency);

        if (!pendencyExists) {
          this.data.pendency.push(pendency);
        }
      },
      remove: (blockIndex: number, propName: string) => {
        const pendency = `${blockIndex}-${propName}`;

        if (this.data.pendency) {
          this.data.pendency = [...this.data.pendency.filter((value) => value !== pendency)];
        }
      },
      clear: () => {
        this.data.pendency = null;
      },
    };
  }

  public clearMetadata() {
    this.data.mountingComponent = true;
    this.data.totalLinks = {};
    this.data.totalBlocks = 0;
    this.data.recommendationToShow = null;
  }

  public closeMetadataPanel() {
    this.data.showPanel = false;
  }

  public openMetadataPanel() {
    this.data.showPanel = true;
  }

  public resetTotalBlocks() {
    this.data.totalBlocks = 0;
  }

  public updateTotalBlocks() {
    const metadata = this.getFromElement();

    if (metadata && metadata.fixed) {
      this.data.totalBlocks = metadata.fixed.length;
    }
  }

  public getFromElement(element: dia.Element | undefined = undefined) {
    if (element) {
      const prop = element.prop('props/metadata') as {
        fixed: IFixedMetadata[]
      };

      return prop || undefined;
    }

    const selectedElement = this.editor.element.getSelected();

    if (selectedElement) {
      const prop = selectedElement.prop('props/metadata') as {
        fixed: IFixedMetadata[]
      };

      return prop || undefined;
    }

    return undefined;
  }

  get fixed() {
    return {
      removeBlock: async (index: number) => {
        this.data.loadingBlocks = true;

        const selectedElement = this.editor.element.getSelected();

        if (selectedElement) {
          const metadata = this.getFromElement(selectedElement);

          if (
            metadata
            && metadata?.fixed
            && metadata?.fixed.length
          ) {
            // get fixed metadata
            const oldItems = [...metadata.fixed];

            // delete metadata before updating
            await this.editor.element.setProp('metadata', null);

            const updatedFixedMetadata: IFixedMetadata[] = [];

            let newIndex = 1;

            for (let currentIndex = 0; currentIndex < oldItems.length; currentIndex += 1) {
              if (currentIndex !== (index - 1)) {
                updatedFixedMetadata.push({
                  ...oldItems[currentIndex],
                  index: newIndex,
                });

                newIndex += 1;
              }
            }

            await this.editor.element.setProp('metadata', {
              fixed: updatedFixedMetadata,
              variable: [],
            });

            this.data.totalBlocks = updatedFixedMetadata.length;
          }
        }

        setTimeout(() => {
          this.editor.element.updateRecommendationsTotals(selectedElement);

          this.editor.graph.notSaved();

          this.updateTotalBlocks();

          this.data.loadingBlocks = false;
        }, 1000);
      },
      get: (element: dia.Element | undefined = undefined) => {
        if (element) {
          const prop = element.prop('props/metadata') as {
            fixed: IFixedMetadata[]
          };

          return prop.fixed || undefined;
        }

        const selectedElement = this.editor.element.getSelected();

        if (selectedElement) {
          const prop = selectedElement.prop('props/metadata') as {
            fixed: IFixedMetadata[]
          };

          return prop.fixed || undefined;
        }

        return undefined;
      },
      set: async (index: number, data: IFixedMetadata) => {
        if (!this.data.mountingComponent) {
          const selectedElement = this.editor.element.getSelected();

          if (selectedElement) {
            const metadata = this.getFromElement(selectedElement);

            // already has fixed metadata
            if (
              metadata
              && metadata?.fixed
              && metadata?.fixed.length
            ) {
              // get fixed metadata
              const oldValues = [...metadata.fixed];

              // delete metadata before updating
              await this.editor.element.setProp('metadata', null);

              const updatedFixedMetadata: IFixedMetadata[] = [];

              if (index <= metadata?.fixed.length) {
                for (
                  let currentIndex = 0;
                  currentIndex < metadata.fixed.length;
                  currentIndex += 1
                ) {
                  if (currentIndex === (index - 1)) {
                    updatedFixedMetadata.push(data);
                  } else {
                    updatedFixedMetadata.push({ ...oldValues[currentIndex] });
                  }
                }
              } else {
                updatedFixedMetadata.push(...oldValues);

                updatedFixedMetadata.push(data);
              }

              await this.editor.element.setProp('metadata', {
                fixed: updatedFixedMetadata,
                variable: [],
              });
            } else {
              await this.editor.element.setProp('metadata', {
                fixed: [data],
                variable: [],
              });
            }

            this.editor.graph.notSaved();
          }
        }
      },
      setTotalLinksInBlock: (blockIndex: number) => {
        const metadata = this.getFromElement();

        // already has fixed metadata
        if (
          metadata
          && metadata.fixed
          && metadata.fixed.length
        ) {
          const { fixed } = metadata;

          if (fixed && fixed.length && fixed[blockIndex - 1]) {
            this.data.totalLinks[blockIndex] = fixed[blockIndex - 1].links.length;
          }
        }
      },
      getLinks: (blockIndex: number, linkIndex: number) => {
        const selectedElement = this.editor.element.getSelected();

        if (selectedElement) {
          const metadata = this.getFromElement(selectedElement);

          // already has fixed metadata
          if (
            metadata
            && metadata.fixed
            && metadata.fixed.length
          ) {
            const { fixed } = metadata;

            if (fixed && fixed.length) {
              return fixed[blockIndex - 1].links[linkIndex - 1];
            }
          }
        }

        return undefined;
      },
      removeLink: (blockIndex: number, linkIndex: number) => {
        const selectedElement = this.editor.element.getSelected();

        if (selectedElement) {
          const metadata = this.getFromElement(selectedElement);

          // already has fixed metadata
          if (
            metadata
            && metadata.fixed
            && metadata.fixed.length
          ) {
            // has block
            if (metadata.fixed[blockIndex - 1]) {
              // has a links?
              if (
                metadata.fixed[blockIndex - 1].links.length
              ) {
                const oldLinks = [...metadata.fixed[blockIndex - 1].links];
                const updatedLinks: IFixedMetadataLink[] = [];

                // clear before updating
                void this.editor.element.setProp(
                  `metadata/fixed/${blockIndex - 1}/links`,
                  null,
                );

                let newIndex = 1;

                // eslint-disable-next-line no-restricted-syntax
                for (const oldLink of oldLinks) {
                  if (oldLink.index !== linkIndex) {
                    updatedLinks.push({
                      ...oldLink,
                      index: newIndex,
                    });

                    newIndex += 1;
                  }
                }

                void this.editor.element.setProp(
                  `metadata/fixed/${blockIndex - 1}/links`,
                  [...updatedLinks],
                );
              }
            }
          }
        }
      },
      saveLink: async (params: {
        blockIndex: number,
        linkIndex: number,
        url: string,
        type: string,
      }) => {
        const selectedElement = this.editor.element.getSelected();

        if (selectedElement) {
          const metadata = this.getFromElement(selectedElement);

          // has fixed metadata?
          if (
            metadata
            && metadata.fixed
            && metadata.fixed.length
          ) {
            // has block
            if (metadata.fixed[params.blockIndex - 1]) {
              // has a link in this index?
              if (
                metadata.fixed[params.blockIndex - 1].links.length
                && metadata.fixed[params.blockIndex - 1].links[params.linkIndex - 1]
              ) {
                // update the current link in block
                void this.editor.element.setProp(
                  `metadata/fixed/${params.blockIndex - 1}/links/${params.linkIndex - 1}`,
                  {
                    index: params.linkIndex,
                    url: params.url,
                    type: params.type,
                  },
                );

                if (!this.editor.metadata.data.mountingComponent) {
                  this.editor.graph.notSaved();
                }
              } else if (
                metadata.fixed[params.blockIndex - 1].links.length
              ) {
                // add link in the block
                const updatedFixedMetadata = {
                  ...metadata.fixed[params.blockIndex - 1],
                  links: [
                    ...metadata.fixed[params.blockIndex - 1].links,
                    {
                      index: params.linkIndex,
                      url: params.url,
                      type: params.type,
                    },
                  ],
                };

                void this.fixed.set(params.blockIndex, updatedFixedMetadata);
              } else { // will insert the very first link in the block
                // insert new link in the block
                const updatedFixedMetadata = {
                  ...metadata.fixed[params.blockIndex - 1],
                  links: [{
                    index: params.linkIndex,
                    url: params.url,
                    type: params.type,
                  }],
                };

                void this.fixed.set(params.blockIndex, updatedFixedMetadata);
              }
            }
          }
        }
      },
    };
  }

  public addLink(blockIndex: number) {
    if (!this.data.totalLinks[blockIndex]) {
      this.data.totalLinks[blockIndex] = 1;
    } else {
      this.data.totalLinks[blockIndex] += 1;
    }
  }

  public showRecommendation(elementId: dia.Cell.ID, recommendationIndex: number) {
    this.data.showPanel = true;

    const element = this.editor.element.getById(elementId);

    if (element) {
      const metadata = this.getFromElement(element);

      if (
        metadata
        && metadata.fixed
        && metadata.fixed[recommendationIndex - 1]
      ) {
        this.data.recommendationToShow = {
          data: { ...metadata.fixed[recommendationIndex - 1] },
          originalElementId: elementId,
        };
      }
    }
  }

  public async setMetadataProps(index: number, propName: string, data: IFixedMetadata) {
    const metadata = this.getFromElement();

    // create metadata block if it doesn't exist
    if (!metadata || !metadata.fixed[index - 1]) {
      await this.fixed.set(index, {
        ...data,
      });
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await this.editor.element.setProp(`metadata/fixed/${index - 1}/${propName}`, data[propName]);

    if (propName === 'recommendation_type') {
      setTimeout(() => {
        this.editor.element.updateRecommendationsTotals();

        this.editor.graph.notSaved();
      }, 500);
    } else {
      this.editor.graph.notSaved();
    }
  }

  public alertPendency() {
    this.editor.quasar.notify({
      type: 'negative',
      message: 'Resuelva los problemas pendientes antes de guardar.',
    });
  }
}

export default Metadata;
