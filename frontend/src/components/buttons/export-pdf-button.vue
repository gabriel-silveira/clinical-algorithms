<template>
  <q-btn
    label="PDF"
    class="float-right q-ml-lg"
    style="width:120px"
    color="primary"
    push
    @click="tryDownloadPdf"
  />

  <simple-modal
    :show="showPutOPSLogoDialog"
    :show-close-button="true"
    cancel-label="No"
    confirm-label="Sí"
    title="Incluir el logotipo de OPS"
    @close="showPutOPSLogoDialog = false"
    @cancel="downloadPdf(false)"
    @confirm="downloadPdf(true)"
  >
    <div class="q-pa-lg">
      ¿Quiere incluir el logotipo de OPS en el encabezado del PDF?
    </div>
  </simple-modal>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue';
import { useRoute } from 'vue-router';

import Editor from 'src/services/editor';

import { ALGORITHMS_PUBLIC_PRINT_PATH } from 'src/router/routes/algorithms';
import SimpleModal from 'components/modals/simple-modal.vue';

const editor = inject('editor') as Editor;

const route = useRoute();

const showPutOPSLogoDialog = ref(false);

const tryDownloadPdf = async () => {
  if (editor.metadata.hasPendency()) {
    editor.metadata.alertPendency('descargar el PDF');
  } else {
    // ask if one wants to put the OPS logo on the header before downloading (for admins only)
    showPutOPSLogoDialog.value = true;
  }
};

const downloadPdf = async (putLogo: boolean) => {
  if (editor.graph.isNotSaved) {
    await editor.graph.save();
  }

  showPutOPSLogoDialog.value = false;

  window.open(`${ALGORITHMS_PUBLIC_PRINT_PATH}?id=${route.query.id}&logo=${putLogo}`);
};
</script>
