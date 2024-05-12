<template>
  <div
    id="editor"
    class="print-mode bg-grey-4 overflow-hidden absolute-top-left full-width full-height"
  >
    <div
      id="editor-content" class="bg-white overflow-auto full-height"
    >
      <!-- STAGE -->
      <editor-stage />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  onMounted,
  inject, computed,
} from 'vue';

import { useRoute } from 'vue-router';

const route = useRoute();

import EditorStage from 'components/editor/editor-stage.vue';
import Editor from 'src/services/editor';
import { GRAPH_MODE_PRINT } from 'src/services/editor/types';

const editor = inject('editor') as Editor;

const algorithm = computed(() => editor.graph.data.algorithm);

onMounted(async () => {
  const { id } = route.query;

  if (id && typeof id === 'string') {
    editor.setIsMaintainer(false);

    editor.setReadOnly(GRAPH_MODE_PRINT);

    await editor.init('editor-stage');

    await editor.graph.open(id);

    editor.graph.exportPDF();
  }
});
</script>

<style lang="sass" scoped>
@import "src/css/editor"
</style>
