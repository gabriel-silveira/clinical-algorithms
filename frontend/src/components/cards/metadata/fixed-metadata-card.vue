<template>
  <q-card
    v-if="fixedMetadata"
    class="q-ma-xs q-mb-lg"
  >
    <q-card-section class="q-pa-none">
      <div class="q-pa-md">
        <div>
          <q-img
            v-if="fixedMetadata.recommendation_type === FORMAL_RECOMMENDATION"
            :src="GradeIcon"
            width="60px"
            class="float-right"
          />

          <div
            class="text-body1 text-bold"
            style="text-transform: uppercase"
          >
            {{ fixedMetadata.index }}. {{
              fixedMetadata.recommendation_type ?
                RECOMMENDATION_TYPES.find(
                  (type) => type.value === fixedMetadata.recommendation_type,
                ).label : 'Recommendation type was not selected'
            }}
          </div>
        </div>

        <div
          v-if="fixedMetadata.intervention_type || fixedMetadata.certainty_of_the_evidence"
          class="row q-pt-md"
        >
          <div
            v-if="fixedMetadata.intervention_type"
            class="col-6"
          >
            <div class="float-left">
              <b>Type</b><br/>{{ fixedMetadata.intervention_type }}
            </div>

            <q-img
              v-if="fixedMetadata.intervention_type === INTERVENTION_TYPES.DIAGNOSIS"
              :src="DiagnosisIcon"
              style="margin-top:-4px"
              width="48px"
              class="q-ml-sm float-left"
            />

            <q-img
              v-if="fixedMetadata.intervention_type === INTERVENTION_TYPES.TREATMENT"
              :src="TreatmentIcon"
              style="margin-top:-2px"
              width="48px"
              class="q-ml-sm float-left"
            />

            <q-img
              v-if="
                fixedMetadata.intervention_type === INTERVENTION_TYPES.POPULATION_CLASSIFICATION
              "
              :src="PopulationClassificationIcon"
              style="margin-top:-7px"
              width="60px"
              class="q-ml-sm float-left"
            />
          </div>

          <div
            v-if="isFormal && fixedMetadata.certainty_of_the_evidence"
            class="col-6"
          >
            <b>Certainty of evidence</b><br/>{{ fixedMetadata.certainty_of_the_evidence }}

            <q-img
              v-for="index in certaintyRange"
              :src="CertaintyIcon"
              :key="`certainty${index}`"
              width="24px"
              class="q-ml-sm"
            />
          </div>
        </div>

        <div
          v-if="fixedMetadata.description"
          class="q-pt-md"
          style="word-break: break-all"
        >
          <div><b>Original transcription</b></div>

          <div>{{ fixedMetadata.description }}</div>
        </div>
      </div>

      <q-separator />

      <recommendation-arrows
        v-if="fixedMetadata.intervention && fixedMetadata.comparator"
        :fixed-metadata="fixedMetadata"
        class="q-my-md q-mx-sm"
      />

      <q-separator
        v-if="(
          fixedMetadata.implementation_considerations
          || fixedMetadata.additional_comments
          || fixedMetadata.recommendation_source
        )"
      />

      <div
        v-if="(
          fixedMetadata.comparator
          || fixedMetadata.implementation_considerations
          || fixedMetadata.additional_comments
          || fixedMetadata.recommendation_source
        )"
      >
        <div class="q-pt-md q-px-md">
          <div
            v-if="fixedMetadata.implementation_considerations"
            class="q-pb-lg"
          >
            <div class="q-pb-sm"><b>Implementation considerations</b></div>

            <div>{{ fixedMetadata.implementation_considerations }}</div>
          </div>

          <div
            v-if="fixedMetadata.additional_comments"
            class="q-pb-lg"
            style="word-break: break-all"
          >
            <div class="q-pb-sm"><b>Additional comments</b></div>

            <div>{{ fixedMetadata.additional_comments }}</div>
          </div>

          <div
            v-if="fixedMetadata.recommendation_source"
            class="q-pb-lg"
            style="word-break: break-all"
          >
            <div class="q-pb-sm"><b>Recommendation source</b></div>

            <div>{{ fixedMetadata.recommendation_source }}</div>
          </div>
        </div>
      </div>

      <q-separator
        v-if="fixedMetadata.links.length"
      />

      <div
        v-if="fixedMetadata.links.length"
        class="q-pa-lg"
      >
        <div class="q-pb-sm"><b>Links</b></div>

        <q-card
          v-for="link of fixedMetadata.links"
          :key="`link-${fixedMetadata.index}-${link.index}`"
          class="q-mb-md"
        >
          <q-card-section>
            <div class="q-pb-sm"><b>{{ link.type }}</b>
            </div>

            <div><a
              :href="link.url"
              target="_blank"
              class="text-primary"
              style="word-break: break-all"
            >
              {{ link.url }}
            </a></div>
          </q-card-section>
        </q-card>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onBeforeMount,
  inject,
  ref,
} from 'vue';

import { IFixedMetadata } from 'src/services/editor/constants/metadata';

import Editor from 'src/services/editor';

import {
  FORMAL_RECOMMENDATION,
  RECOMMENDATION_TYPES,
} from 'src/services/editor/constants/metadata/recommendation_type';

import RecommendationArrows from 'components/items/recommendations/recommendation-arrows.vue';

import { CERTAINTY } from 'src/services/editor/constants/metadata/certainty';

import GradeIcon from 'src/assets/imgs/grade_logo.png';
import CertaintyIcon from 'src/assets/imgs/certainty.png';
import DiagnosisIcon from 'src/assets/imgs/diagnosis.png';
import TreatmentIcon from 'src/assets/imgs/treatment.png';
import PopulationClassificationIcon from 'src/assets/imgs/population_classification.png';
import { INTERVENTION_TYPES } from 'src/services/editor/constants/metadata/intervention';

const editor = inject('editor') as Editor;

const props = defineProps({
  index: {
    type: Number,
    required: true,
  },
});

const fixedMetadata = ref<IFixedMetadata | null>(null);
const certaintyRange = ref(0);

const isFormal = computed(
  () => fixedMetadata.value
    && fixedMetadata.value.recommendation_type === RECOMMENDATION_TYPES[0].value,
);

const recommendation = computed(() => editor.metadata.data.recommendationToShow);

onBeforeMount(() => {
  // show single recommendation
  if (recommendation.value) {
    fixedMetadata.value = recommendation.value?.data || null;
  } else {
    // show all recommendations
    const metadata = editor.metadata.getFromElement();

    if (metadata) {
      const { fixed } = metadata;

      fixedMetadata.value = { ...fixed[props.index - 1] };
    }
  }

  if (fixedMetadata.value.certainty_of_the_evidence) {
    if (fixedMetadata.value.certainty_of_the_evidence === CERTAINTY.VERY_LOW) {
      certaintyRange.value = 1;
    }

    if (fixedMetadata.value.certainty_of_the_evidence === CERTAINTY.LOW) {
      certaintyRange.value = 2;
    }

    if (fixedMetadata.value.certainty_of_the_evidence === CERTAINTY.MODERATE) {
      certaintyRange.value = 3;
    }

    if (fixedMetadata.value.certainty_of_the_evidence === CERTAINTY.HIGH) {
      certaintyRange.value = 4;
    }
  }
});

onBeforeUnmount(() => {
  editor.metadata.clearMetadata();
});
</script>
