<template>
  <div
    id="editor-elements-toolbar"
    class="shadow-light bg-white q-pa-md"
    :class="{ hide: !showElementsMenu }"
  >
    <div
      class="absolute-top-right bg-white q-py-sm hide-elements-menu-button"
      @click="toggleElementsMenu"
    >
      <q-icon
        :name="showElementsMenu ? 'chevron_left' : 'chevron_right'"
        class="text-primary"
        size="sm"
      />
    </div>

    <div
      class="create-element-button cursor-pointer text-center q-mb-sm"
      draggable="true"
      @dragstart="setCreatingElement(CustomElement.START)"
    >
      <q-icon
        class="q-mr-sm inline-block"
        name="radio_button_unchecked"
        color="positive"
        size="34px"
      />
      <div class="inline-block q-mt-sm text-positive">
        <b>Inicio</b>
      </div>
    </div>

    <div
      class="create-element-button cursor-pointer text-center"
      draggable="true"
      @dragstart="setCreatingElement(CustomElement.ACTION)"
    >
      <img src="imgs/new_action_element.png" />
    </div>

    <div
      class="create-element-button cursor-pointer text-center action-element"
      draggable="true"
      @dragstart="setCreatingElement(CustomElement.EVALUATION)"
    >
      <img src="imgs/new_evaluation_element.png" />
    </div>

    <div
      class="create-element-button cursor-pointer text-center q-mb-sm"
      draggable="true"
      @dragstart="setCreatingElement(CustomElement.END)"
    >
      <q-icon
        class="q-mr-sm inline-block"
        name="radio_button_unchecked"
        color="red"
        size="34px"
      />
      <div class="inline-block q-mt-sm text-red">
        <b>Fin</b>
      </div>
    </div>

    <div
      class="create-element-button cursor-pointer text-center q-mb-sm"
      draggable="true"
      @dragstart="setCreatingElement(CustomElement.LANE)"
    >
      <q-icon
        class="q-mr-sm inline-block"
        name="power_input"
        color="black"
        size="34px"
      />
      <div class="inline-block q-mt-sm text-black">
        <b>Tiempo</b>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue';
import { CustomElement } from 'src/services/editor/elements/custom-elements';
import Editor from 'src/services/editor';

const editor = inject('editor') as Editor;

const showElementsMenu = ref(true);

const setCreatingElement = (elementName: string) => {
  editor.element.data.elementToCreate = elementName;
};

const toggleElementsMenu = () => {
  showElementsMenu.value = !showElementsMenu.value;
};

onMounted(() => {
  const editorStage = document.getElementById('editor-stage');

  if (editorStage) {
    editorStage.addEventListener('dragover', (event) => {
      // prevent default to allow drop
      event.preventDefault();
    });

    editorStage.addEventListener('drop', (event) => {
      editor.element.createElement(event);
    });
  }
});
</script>

<style lang="sass">
.create-element-button
  padding: 10px 0
  border: 1px solid #FFF
  border-radius: 6px
  min-height: 60px

  .action-element
    background-size: cover

.hide-elements-menu-button
  margin-right: -25px
  margin-top: 10px
  -webkit-border-top-right-radius: 5px
  -webkit-border-bottom-right-radius: 5px
  -moz-border-radius-topright: 5px
  -moz-border-radius-bottomright: 5px
  border-top-right-radius: 5px
  border-bottom-right-radius: 5px
  cursor: pointer
</style>
