<template>
  <div>
    <div
      v-if="loading"
      class="absolute-top-left full-width full-height z-max bg-white
      flex justify-center items-center"
    >
      <loading-spinner
        v-if="loading"
        label="Generando archivo PDF... por favor espere."
      />
    </div>

    <div
      id="editor"
      class="print-mode bg-grey-4 overflow-hidden absolute-top-left full-width full-height"
    >
      <div
        id="editor-content"
        class="bg-white overflow-auto full-height"
      >
        <!-- STAGE -->
        <editor-stage/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, inject, ref } from 'vue';
import { useRoute } from 'vue-router';

import { GRAPH_MODE_PRINT } from 'src/services/editor/types';
import Editor from 'src/services/editor';
import LoadingSpinner from 'components/spinners/loading-spinner.vue';
import EditorStage from 'components/editor/editor-stage.vue';
import { html2pdf } from 'src/services/pdf';

const route = useRoute();

const editor = inject('editor') as Editor;

const loading = ref(true);

onMounted(async () => {
  const {
    id,
    logo,
  } = route.query;

  const putLogoOnHeader = logo === 'true';

  if (id && typeof id === 'string') {
    editor.setIsMaintainer(false);

    editor.graph.setMode(GRAPH_MODE_PRINT);

    editor.setReadOnly(true);

    await editor.graph.open(id);

    await editor.graph.setToPrint(putLogoOnHeader, 0.7);

    setTimeout(async () => {
      editor.element.hideAllPorts();

      await html2pdf({
        elementId: 'editor-stage',
        title: editor.graph.data.algorithm.title,
        width: Number((editor.graph.data.printSize.width * editor.graph.data.scale).toFixed(0)),
        height: Number((editor.graph.data.printSize.height * editor.graph.data.scale).toFixed(0)),
      });

      loading.value = false;
    }, 2000);
  }
});
</script>

<style lang="sass" scoped>
@import "src/css/editor"
</style>
