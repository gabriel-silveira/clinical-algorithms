<template>
  <q-dialog
    v-model="showDialog"
    persistent
  >
    <q-card>
      <q-card-section
        v-if="props.title"
        class="row items-center"
        :class="{ 'text-negative': props.negative, 'q-px-xl q-pt-lg': props.showCloseButton }"
      >
        <b class="q-px-md q-pt-sm">{{ props.title }}</b>

        <q-btn
          v-if="props.showCloseButton"
          class="absolute-top-right q-ma-sm"
          icon="close"
          color="primary"
          dense
          round
          flat
          @click="emitEvent('close')"
        />
      </q-card-section>

      <q-card-section
        v-if="props.itemName"
        class="text-center q-pb-lg"
      >
        {{ props.itemName }}
      </q-card-section>

      <slot />

      <q-card-actions align="right" class="q-pa-md">
        <q-btn
          style="padding: 0 30px; min-width: 110px"
          :label="props.cancelLabel"
          color="primary"
          @click="emitEvent('cancel')"
          flat
        />

        <q-btn
          style="padding: 0 30px; min-width: 110px"
          :loading="props.confirming"
          :label="props.confirmLabel"
          color="primary"
          push
          @click="emitEvent('confirm')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  showCloseButton: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  itemName: {
    type: String,
    default: '',
  },
  negative: {
    type: Boolean,
    default: false,
  },
  confirming: {
    type: Boolean,
    default: false,
  },
  confirmLabel: {
    type: String,
    default: 'Borrar',
  },
  cancelLabel: {
    type: String,
    default: 'Cancelar',
  },
});

const emits = defineEmits(['cancel', 'confirm', 'close']);

const showDialog = ref(false);

watch(() => props.show, (value) => {
  showDialog.value = value;
});

const emitEvent = (eventName: 'cancel' | 'confirm' | 'close') => {
  emits(eventName);
};
</script>
