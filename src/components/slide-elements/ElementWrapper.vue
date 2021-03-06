<style scoped>
  @keyframes rotateDashes {
    0% {
      stroke-dashoffset: 0;
    }

    100% {
      stroke-dashoffset: 60;
    }
  }

  g:hover {
    cursor: pointer;
  }

  g:hover .bbox {
    stroke: rgba(0, 0, 0, 0.4);
  }

  g.inspecting .bbox {
    stroke-linecap: round;
    stroke: rgba(0, 0, 0, 0.6);
    stroke-dasharray: 15px;
    animation: rotateDashes 5s infinite linear;
  }
</style>

<template>
  <g :class="computedStyles" @click.stop="inspectElement(element.id)" @mouseover="updateBBox">
    <rect
      class="bbox"
      :width="containerWidth"
      :height="containerHeight"
      :x="containerX"
      :y="containerY"
      fill="none"
      stroke-width="2px"
      stroke="none"
    />

    <slot name="actual-element">
      <text x="0" y="0" font-size="12" fill="black">Unable to load element</text>
    </slot>
  </g>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import elementHelpers from './helpers'
import InspectingUserLabel from './InspectingUserLabel'

export default {
  name: 'element-wrapper',
  props: {
    element: Object
  },
  components: {
    'inspecting-user-label': InspectingUserLabel
  },
  data () {
    return {
      actualEl: null,
      bbox: null
    }
  },
  computed: {
    ...mapGetters('editor', ['selectedElementIndex']),
    computedStyles () {
      return {
        'inspecting': (this.selectedElementIndex === this.element.id)
      }
    },
    containerX () {
      return this.bbox ? this.bbox.x - 10 : 0
    },
    containerY () {
      return this.bbox ? this.bbox.y - 10 : 0
    },
    containerWidth () {
      return this.bbox ? this.bbox.width + 20 : 0
    },
    containerHeight () {
      return this.bbox ? this.bbox.height + 20 : 0
    }
  },
  watch: {
    element: {
      handler: function () {
        return this.updateBBox(this.actualEl)
      },
      deep: true
    },
    currentElement: {
      handler: function () {
        return this.updateBBox(this.actualEl)
      },
      deep: true
    },
    currentSlide: {
      handler: function () {
        return this.updateBBox(this.actualEl)
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('editor', ['inspectElement', 'currentElement', 'currentSlide', 'updateCoordinates']),
    ...elementHelpers
  },
  mounted () {
    this.actualEl = this.$slots['actual-element'][0].elm
    this.updateBBox(this.actualEl)
  }
}
</script>
