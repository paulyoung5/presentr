<style>
.inspector {
  grid-area: inspector;
  
  background-color: var(--medium-grey);
  box-shadow: -5px 0 5px rgba(0, 0, 0, 0.2);
  z-index: 1;
  position: relative;
  overflow-y: scroll;
  
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  align-items: start;
  justify-items: stretch;
  align-content: start;
  justify-content: start;
}

.inspector .section {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
}

.inspector .section.hidden .options {
  height: 0;
  opacity: 0;
  padding: 0;
  transform: translateY(-100%);
  visibility: hidden;
  transition: 0.4s opacity transform;
}

.inspector .section.hidden .header a i {
  transform: rotate(180deg);
  transition: 0.4s all;
}

.inspector .section .header {
  background-color: rgba(0, 0, 0, 0.2);
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9em;
  
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 1fr auto;
  align-items: center;
}

.inspector .section .header a:first-child {
  font-weight: bold;
  user-select: none;
  -moz-user-select: none;
}

.inspector .section .header a {
  padding: 0.3em 0.7em;
}

.inspector .section .header a:last-child {
  display: flex;
  align-items: center;
  justify-content: center;
}
.inspector .section .header a:last-child:hover {
  background-color: rgba(0, 0, 0, 0.2);
}

.inspector .section .options {
  padding: 1em;
  
  display: grid;
  grid-gap: 1em;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  justify-content: stretch;
}

.inspector .section .options > :not(label):not(.colour-picker),
.inspector .section .options > .colour-picker input {
  width: 100%;
  background-color: white;
  padding: 0.5em 0.7em;
  border: 0;
  outline: 2px solid rgba(0, 0, 0, 0.2);
  border-radius: 0;
}
.inspector .section .options > :not(label):not(.colour-picker):focus,
.inspector .section .options > .colour-picker input:focus {
  outline-color: rgba(0, 0, 0, 0.4);
}

.delete {
  margin: 1em;
  padding: 0.8em 1em;
  border-radius: 5px;

  background-color: hsl(0, 100%, 60%);
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 1em;
  align-items: center;
}
.delete:hover {
  background-color: hsl(0, 100%, 55%);
}

@media only screen 
      and (device-width : 375px) 
      and (device-height : 812px) 
      and (-webkit-device-pixel-ratio : 3) {
  .inspector {
    max-height: 100%;
    overflow-x: visible;
    overflow-y: scroll;
  }

  .inspector .section .options {
    padding-right: env(safe-area-inset-right) !important;
    grid-template-columns: 1fr;
  }

  .inspector .section .header a:last-child {
    visibility: hidden;
  }
}

@media (max-width: 800px) {
  .inspector {
    display: none;
  }
}
</style>

<template>
  <div class="inspector">
    <div class="slide-properties section" v-if="!currentElement">
      <div class="header">
        <a href="#" @click.prevent="toggleSection">PROPERTIES</a>
        <a href="#" @click.prevent="toggleSection">
          <i class="material-icons">arrow_drop_down</i>
        </a>
      </div>

      <div class="options">
        <label>Background</label>
        <colour-picker :value.sync="backgroundColour"></colour-picker>
      </div>
    </div>

    <div class="appearance section" v-if="isTextElement">
      <div class="header">
        <a href="#" @click.prevent="toggleSection">APPEARANCE</a>
        <a href="#" @click.prevent="toggleSection">
          <i class="material-icons">arrow_drop_down</i>
        </a>
      </div>

      <div class="options">
        <label>Fill</label>
        <colour-picker :value.sync="fill"></colour-picker>

        <label>Value</label>
        <input type="text" v-model="content">
      </div>
    </div>

    <div class="position section" v-if="currentElement">
      <div class="header">
        <a href="#" @click.prevent="toggleSection">POSITION</a>
        <a href="#" @click.prevent="toggleSection">
          <i class="material-icons">arrow_drop_down</i>
        </a>
      </div>

      <div class="options">
        <label>X</label> <input type="number" min="0" step="1" v-model="xPosition">
        <label>Y</label> <input type="number" min="0" step="1" v-model="yPosition">
      </div>
    </div>

    <div class="font section" v-if="isTextElement">
      <div class="header">
        <a href="#" @click.prevent="toggleSection">FONT</a>
        <a href="#" @click.prevent="toggleSection">
          <i class="material-icons">arrow_drop_down</i>
        </a>
      </div>

      <div class="options">
        <label>Family</label>
        <select v-model="fontFamily">
          <option v-for="font in fonts" :value="font.name">{{ font.name }}</option>
        </select>

        <label>Size</label>
        <input type="number" step="5" min="10" max="200" v-model="fontSize">
      </div>
    </div>

    <a href="#" class="delete" v-if="currentElement" @click="deleteElement(currentElement.id)">
      <i class="material-icons">delete</i>
      <span>Delete element</span>
    </a>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ColourPicker from './ColourPicker'

export default {
  name: 'inspector',
  components: {
    'colour-picker': ColourPicker
  },
  data () {
    return {
      fonts: [
        {name: 'Arial'},
        {name: 'Verdana'},
        {name: 'Helvetica'},
        {name: 'Comic Sans MS'},
        {name: 'Impact'},
        {name: 'Times New Roman'},
        {name: 'Georgia'},
        {name: 'Courier'},
        {name: 'Courier New'}
      ]
    }
  },
  computed: {
    ...mapGetters('editor', ['currentSlide', 'currentElement']),
    isTextElement () {
      return this.currentElement ? this.currentElement && this.currentElement.type === 'TEXT' : false
    },
    backgroundColour: {
      get () {
        return this.currentSlide ? this.currentSlide.backgroundColour : '#FFFFFF'
      },
      set (value) {
        return this.updateBackgroundColour(value)
      }
    },
    xPosition: {
      get () {
        return this.currentElement ? Number(this.currentElement.properties.x.substr(0, this.currentElement.properties.x.length - 2)) : 0
      },
      set (value) {
        this.updateX({element: this.currentElement, value: `${value}px`})
      }
    },
    yPosition: {
      get () {
        return this.currentElement ? Number(this.currentElement.properties.y.substr(0, this.currentElement.properties.y.length - 2)) : 0
      },
      set (value) {
        this.updateY({element: this.currentElement, value: `${value}px`})
      }
    },
    fill: {
      get () {
        return this.currentElement && this.currentElement.properties.fill ? this.currentElement.properties.fill : '#000000'
      },
      set (value) {
        this.updateFill({element: this.currentElement, value})
      }
    },
    content: {
      get () {
        return this.currentElement && this.currentElement.properties.content ? this.currentElement.properties.content : ''
      },
      set (value) {
        this.updateContent({element: this.currentElement, value})
      }
    },
    fontFamily: {
      get () {
        return this.currentElement ? this.currentElement.properties.fontFamily : ''
      },
      set (value) {
        this.updateFontFamily({element: this.currentElement, value})
      }
    },
    fontSize: {
      get () {
        return this.currentElement ? Number(this.currentElement.properties.fontSize.substr(0, this.currentElement.properties.fontSize.length - 2)) : '0px'
      },
      set (value) {
        this.updateFontSize({element: this.currentElement, value: `${value}px`})
      }
    }
  },
  watch: {
    currentElement: function () {
      this.$el.classList.remove('changed')
      setTimeout(() => {
        this.$el.classList.add('changed')
      }, 100)
    }
  },
  methods: {
    ...mapActions('editor', ['updateBackgroundColour', 'updateX', 'updateY', 'updateFontFamily', 'updateFontSize', 'updateFill', 'updateContent', 'deleteElement']),
    toggleSection (e) {
      let sectionEl = e.currentTarget.parentElement.parentElement
      sectionEl.classList.toggle('hidden')
    }
  }
}
</script>
