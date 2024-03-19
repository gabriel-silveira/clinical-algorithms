<template>
  <q-card class="q-mb-md">
    <q-card-section class="q-pa-none">
      <q-expansion-item
        :label="blockName"
        default-opened
        header-class="bg-grey-2 text-primary text-body1"
        expand-icon-class="text-primary"
      >
        <q-card>
          <q-card-section class="q-pa-none">
            <div class="q-px-md q-py-md">
              <q-select
                v-model="data.recommendation_type"
                :options="RECOMMENDATION_TYPES"
                class="q-mb-lg"
                label="Recommendation type"
                map-options
                emit-value
                dense
                @update:model-value="setProp('recommendation_type')"
              />

              <q-input
                v-model="data.description"
                label="Original transcription"
                type="textarea"
                spellcheck="false"
                dense
                @update:model-value="setProp('description')"
              />

              <q-select
                v-model="data.intervention_type"
                :options="['Treatment', 'Diagnosis', 'Population classification']"
                class="q-my-lg"
                label="Intervention type"
                dense
                @update:model-value="setProp('intervention_type')"
              />

              <q-input
                v-model="data.intervention"
                :rules="[val => !!val || 'Informe la intervención.']"
                ref="refIntervention"
                class="q-mt-md"
                label="Intervention"
                spellcheck="false"
                dense
                @update:model-value="setProp('intervention')"
              />

              <q-input
                v-model="data.comparator"
                :rules="[val => !!val || 'Informe el comparador.']"
                ref="redComparator"
                class="q-mt-md"
                label="Comparator"
                spellcheck="false"
                dense
                @update:model-value="setProp('comparator')"
              />

              <q-select
                v-if="isFormal"
                v-model="data.strength"
                :options="STRENGTH"
                :rules="[val => !!val || 'Informe la fuerza del recomendación.']"
                ref="refStrength"
                class="q-my-lg"
                label="Recommendation strength"
                map-options
                emit-value
                dense
                @update:model-value="setProp('strength')"
              />

              <q-select
                v-model="data.direction"
                :options="DIRECTIONS"
                :rules="[val => !!val || 'Informe la dirección.']"
                ref="refDirection"
                class="q-my-lg"
                label="Direction"
                map-options
                emit-value
                dense
                @update:model-value="setProp('direction')"
              />

              <q-select
                v-if="isFormal"
                v-model="data.certainty_of_the_evidence"
                :options="['High', 'Moderate', 'Low', 'Very Low']"
                class="q-my-lg"
                label="Certainty of evidence"
                dense
                @update:model-value="setProp('certainty_of_the_evidence')"
              />

              <q-input
                v-model="data.implementation_considerations"
                label="Implementation considerations"
                class="q-my-lg"
                type="textarea"
                spellcheck="false"
                dense
                @update:model-value="setProp('implementation_considerations')"
              />

              <q-input
                v-model="data.additional_comments"
                label="Additional comments"
                class="q-my-lg"
                type="textarea"
                spellcheck="false"
                dense
                @update:model-value="setProp('additional_comments')"
              />

              <q-input
                v-model="data.recommendation_source"
                label="Recommendation source"
                class="q-my-lg"
                type="textarea"
                spellcheck="false"
                dense
                @update:model-value="setProp('recommendation_source')"
              />

              <metadata-links-form
                :block-index="props.index"
              />
            </div>

            <q-separator />

            <div class="bg-grey-2">
              <q-btn
                :label="`Borrar ${blockName}`"
                class="full-width"
                color="negative"
                icon="close"
                no-caps
                flat
                @click="showDeleteBlockDialog = true"
              />
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <!-- REMOVE METADATA BLOCK -->
      <delete-modal
        :show="showDeleteBlockDialog"
        title="¿Tienes certeza de que deseas eliminar estas informaciones?"
        :item-name="blockName"
        @cancel="showDeleteBlockDialog = false"
        @confirm="deleteBlock"
      />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onBeforeMount,
  onMounted,
  reactive,
  inject,
  ref,
} from 'vue';

import Editor from 'src/services/editor';
import MetadataLinksForm from 'components/forms/editor/fixed-metadata-links-form.vue';
import DeleteModal from 'components/modals/simple-modal.vue';

import { BOTH, DIRECTIONS } from 'src/services/editor/constants/metadata/direction';

import {
  FORMAL_RECOMMENDATION,
  RECOMMENDATION_TYPES,
} from 'src/services/editor/constants/metadata/recommendation_type';

import {
  STRENGTH,
  STRONG_RECOMMENDATION,
} from 'src/services/editor/constants/metadata/recommendation_strength';

import { QInput, QSelect } from 'quasar';

const editor = inject('editor') as Editor;

const props = defineProps({
  index: {
    type: Number,
    default: 0,
  },
});

const showDeleteBlockDialog = ref(false);

const refIntervention = ref<QInput>();
const redComparator = ref<QInput>();
const refDirection = ref<QSelect>();
const refStrength = ref<QSelect>();

// we need to set a timeout for each prop (ex: validation[propName] )
const validation: { [key: string]: ReturnType<typeof setTimeout> } = reactive({});

const data = reactive({
  index: 1,
  description: '',
  recommendation_type: '',
  intervention_type: '',
  intervention: '',
  comparator: '',
  direction: '',
  strength: '',
  certainty_of_the_evidence: '',
  implementation_considerations: '',
  additional_comments: '',
  recommendation_source: '',
  links: [],
});

const blockName = computed(() => `${props.index}. ${
  data.recommendation_type ? RECOMMENDATION_TYPES.find(
    (type) => type.value === data.recommendation_type,
  )?.label : 'Select recommendation type'
}`);

const isFormal = computed(() => data.recommendation_type === RECOMMENDATION_TYPES[0].value);

const validateInterventionAndComparator = (propName: string) => {
  clearTimeout(validation[propName]);

  if (propName === 'intervention') {
    if (data.intervention && !data.comparator) {
      redComparator.value?.validate();
    }
  }

  if (propName === 'comparator') {
    if (data.comparator && !data.intervention) {
      refIntervention.value?.validate();
    }
  }
};

const validateDirectionAndStrength = (propName?: string) => {
  if (data.recommendation_type === FORMAL_RECOMMENDATION) {
    if (data.direction && data.strength) {
      if (
        data.strength === STRONG_RECOMMENDATION
        && data.direction === BOTH
      ) {
        if (propName === 'strength') {
          data.direction = '';

          editor.metadata.setMetadata(props.index, 'direction', data);
        } else if (propName === 'direction') {
          data.strength = '';

          editor.metadata.setMetadata(props.index, 'strength', data);
        }
      }
    }

    if (data.direction && !data.strength) {
      refStrength.value?.validate();
    }

    if (data.strength && !data.direction) {
      refDirection.value?.validate();
    }

    if (!data.direction && !data.strength) {
      refStrength.value?.validate();

      refDirection.value?.validate();
    }
  } else if (
    // non-formal recommendations must have direction
    data.recommendation_type
  ) {
    if (!data.direction) {
      refDirection.value?.validate();
    }
  }
};

const setProp = (propName: string) => {
  if (['intervention', 'comparator'].includes(propName)) {
    validateInterventionAndComparator(propName);
  }

  if (['direction', 'strength'].includes(propName)) {
    validateDirectionAndStrength(propName);
  }

  if (propName === 'recommendation_type') {
    if (data.recommendation_type === FORMAL_RECOMMENDATION) {
      if (!data.strength) {
        refStrength.value?.validate();
      }

      if (!data.direction) {
        refDirection.value?.validate();
      }
    } else if (!data.direction) {
      refDirection.value?.validate();
    }
  }

  editor.metadata.setMetadata(props.index, propName, data);
};

const deleteBlock = () => {
  showDeleteBlockDialog.value = false;

  editor.metadata.fixed.removeBlock(props.index);
};

const setInitialValues = () => {
  const metadata = editor.metadata.getFromElement();

  data.index = props.index;

  if (metadata) {
    const { fixed } = metadata;

    const currentIndex = props.index - 1;

    if (fixed[currentIndex]) {
      data.description = fixed[currentIndex].description;
      data.recommendation_type = fixed[currentIndex].recommendation_type;
      data.intervention_type = fixed[currentIndex].intervention_type;
      data.intervention = fixed[currentIndex].intervention;
      data.comparator = fixed[currentIndex].comparator;
      data.direction = fixed[currentIndex].direction;
      data.strength = fixed[currentIndex].strength;
      data.certainty_of_the_evidence = fixed[currentIndex].certainty_of_the_evidence;
      data.implementation_considerations = fixed[currentIndex].implementation_considerations;
      data.additional_comments = fixed[currentIndex].additional_comments;
      data.recommendation_source = fixed[currentIndex].recommendation_source;
    }
  }

  setTimeout(() => {
    editor.metadata.data.mountingComponent = false;
  }, 500);
};

const validateAllFields = () => {
  // check integrity between intervention and comparator
  validateInterventionAndComparator('intervention');
  validateInterventionAndComparator('comparator');

  // check integrity between direction and strength
  validateDirectionAndStrength();
};

onBeforeMount(() => {
  // editor.metadata.pendency.clear();
  // editor.metadata.pendency.clearRecommendationTypes();

  setInitialValues();
});

onMounted(() => {
  validateAllFields();
});

onBeforeUnmount(() => {
  editor.metadata.clearMetadata();
});
</script>
