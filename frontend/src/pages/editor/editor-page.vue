<template>
  <div
    :style="{ width }"
    id="editor"
    class="bg-grey-4 overflow-hidden"
  >
    <div id="editor-header">
      <editor-stage-header />

      <zooming-bar
        class="absolute-top-right"
      />
    </div>

    <div id="editor-content" class="bg-white overflow-auto">
      <!-- ELEMENTS -->
      <editor-elements-toolbar
        v-if="!readOnly"
      />

      <!-- STAGE -->
      <editor-stage />

      <!-- METADATA -->
      <editor-metadata-panel />

      <!-- ACTIONS -->
      <editor-actions-buttons />
    </div>

    <simple-modal
      :show="editor.data.showSaveDialog"
      confirm-label="Guardar"
      cancel-label="Salir"
      title="Hay cambios no guardados en este algoritmo."
      item-name="¿Quieres guardar antes de salir?"
      :negative="true"
      :show-close-button="true"
      @close="toggleSaveDialog"
      @cancel="exitEditor"
      @confirm="saveGraph"
    />

    <!-- RECOMMENDATION VALIDATION LOG PANEL -->
    <div
      v-if="showRecommendationLogPanel"
      class="absolute-bottom-left q-mx-lg q-pa-md bg-white
      z-max rounded-borders shadow-light-with-borders"
      style="margin-bottom: 110px"
    >
      <div class="q-pb-md">{{ editor.metadata.data.hasPendency }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  onBeforeMount,
  onMounted,
  inject,
} from 'vue';

import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';

import Settings from 'src/services/settings';
import EditorStage from 'components/editor/editor-stage.vue';
import Editor from 'src/services/editor';
import EditorStageHeader from 'components/editor/editor-stage-header.vue';
import EditorElementsToolbar from 'components/editor/editor-elements-toolbar.vue';
import EditorMetadataPanel from 'components/editor/editor-metadata-panel.vue';
import EditorActionsButtons from 'components/editor/editor-actions-buttons.vue';
import SimpleModal from 'components/modals/simple-modal.vue';

import {
  ALGORITHMS_INDEX,
  ALGORITHMS_SEARCH,
} from 'src/router/routes/algorithms';

import ZoomingBar from 'components/bar/zooming-bar.vue';

const route = useRoute();
const router = useRouter();

const editor = inject('editor') as Editor;

const settings = inject('settings') as Settings;

const width = computed(
  () => (settings.page.mainMenu ? 'calc(100% - 300px)' : '100%'),
);

const readOnly = computed(() => editor.data.readOnly);

const showRecommendationLogPanel = computed(
  // () => window.location.host.includes('192.168.1.68:8080'),
  () => window.location.host.includes('000.168.1.68:8080'),
);

const exitEditor = () => {
  if (route.query.search) {
    return router.push({
      name: ALGORITHMS_SEARCH,
      query: {
        keyword: route.query.search,
      },
    });
  }

  return router.push({ name: ALGORITHMS_INDEX });
};

const toggleSaveDialog = () => {
  editor.toggleSaveDialog();
};

const saveGraph = () => {
  if (editor.metadata.hasPendency()) {
    editor.metadata.alertPendency('salir');

    editor.toggleSaveDialog();
  } else {
    editor.graph.save();

    exitEditor();
  }
};

onBeforeMount(async () => {
  settings.page.mainMenu = false;

  const { id, mode } = route.query;

  if (
    id
    && typeof id === 'string'
    && typeof mode === 'string'
  ) {
    editor.setIsMaintainer(await settings.isMaintainer());

    editor.setReadOnly(mode);

    await editor.init('editor-stage');

    await editor.graph.open(id);

    settings.page.setTitle(editor.data.readOnly ? 'Publicación de algoritmo' : 'Editar algoritmo');
  }
});

onMounted(async () => {
  document.onkeydown = editor.keyPress;
});

onBeforeRouteLeave(() => {
  settings.page.mainMenu = true;

  editor.reset();
});
</script>

<style lang="sass" scoped>
@import "src/css/editor"
</style>
