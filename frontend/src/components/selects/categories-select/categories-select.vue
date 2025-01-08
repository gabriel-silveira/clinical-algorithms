<template>
  <div :id="props.customSelectId" class="custom-select">
    <select
      v-model="selectedItem"
    >
      <option disabled selected>Categoría</option>
      <option value="1">Doenças metabólicas</option>
      <option value="1">Doenças autoimunes</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { CustomSelect } from 'components/selects/categories-select/categories-select';

const props = defineProps({
  customSelectId: {
    type: String,
    required: true,
  },
  customSelectLabel: {
    type: String,
    required: true,
  },
});

const selectedItem = ref(null);

onMounted(() => {
  CustomSelect.init(props.customSelectId, props.customSelectLabel);
});
</script>

<style lang="sass">
/* The container must be positioned relative: */
.custom-select
  position: relative

.custom-select select
  display: none /*hide original SELECT element: */

.select-selected
  background-color: DodgerBlue

/* Style the arrow inside the select element: */
.select-selected:after
  position: absolute
  content: ""
  top: 14px
  right: 10px
  width: 0
  height: 0

/* Point the arrow upwards when the select box is open (active): */
.select-selected.select-arrow-active:after
  border-color: transparent transparent #fff transparent
  top: 7px

/* style the items (options), including the selected item: */
.select-items div,.select-selected
  color: #ffffff
  padding: 8px 16px
  cursor: pointer

/* Style items (options): */
.select-items
  position: absolute
  background-color: DodgerBlue
  left: 0
  right: 0
  z-index: 99

/* Hide the items when the select box is closed: */
.select-hide
  display: none

.select-items div:hover, .same-as-selected
  background-color: rgba(0, 0, 0, 0.1)
</style>
