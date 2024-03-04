<template>
  <div class="q-mt-sm q-mr-md">
    <q-btn
      class="float-left q-mt-xs q-mr-md"
      icon="remove"
      dense
      round
      flat
      @click="decreaseZoom"
    />

    <q-select
      v-model="zoomLevel"
      :options="zoomLevels"
      style="width:80px"
      class="float-left q-mr-md"
      label="Zoom"
      dense
      @update:model-value="setZoomLevel"
    />

    <q-btn
      class="q-mt-xs"
      icon="add"
      dense
      round
      flat
      @click="increaseZoom"
    />
  </div>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue';

import Editor from 'src/services/editor';

const editor = inject('editor') as Editor;

const zoomLevel = ref({
  value: 100,
  label: '100%',
});

const zoomLevels = ref([]);

for (let i = 50; i <= 150; i += 10) {
  zoomLevels.value.push({
    value: i,
    label: `${i}%`,
  });
}

const setZoomLevel = (level: { value: number }) => {
  editor.data.paper?.scale(level.value / 100);
};

const getCurrentZoomIndex = () => {
  let index = 0;

  for (const level of zoomLevels.value) {
    if (JSON.stringify(level) === JSON.stringify(zoomLevel.value)) {
      return index;
    }

    index += 1;
  }

  return 0;
};

const decreaseZoom = () => {
  const index = getCurrentZoomIndex();

  if (index) {
    const previousLevel = getCurrentZoomIndex() - 1;

    zoomLevel.value = { ...zoomLevels.value[previousLevel] };

    setZoomLevel(zoomLevel.value);
  }
};

const increaseZoom = () => {
  const index = getCurrentZoomIndex();

  if (index < 10) {
    const nextLevel = getCurrentZoomIndex() + 1;

    zoomLevel.value = { ...zoomLevels.value[nextLevel] };

    setZoomLevel(zoomLevel.value);
  }
};
</script>
