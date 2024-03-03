<template>
  <div
    id="editor-stage-wrapper"
    class="overflow-auto"
  >
    <div id="editor-stage"></div>
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted } from 'vue';

import Editor from 'src/services/editor';

const editor = inject('editor') as Editor;

onMounted(async () => {
  // await editor.init('editor-stage');
});
</script>

<style lang="sass">
#editor-stage-wrapper
  position: absolute
  width: 100%
  height: 100%
</style>
