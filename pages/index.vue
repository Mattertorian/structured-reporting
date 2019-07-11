<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-flex
      xs12
      sm8
      md6
    >
    <div>
        <speech-engine></speech-engine>
    </div>
    <div v-for="type in types" :key="type">
    
      <text-area :type="type">
        
      </text-area>
    </div>  
      
    </v-flex>
  </v-layout>
</template>

<script>
import TextAreaEditable from '~/components/TextAreaEditable.vue'
import TextArea from '~/components/TextArea.vue'
import SpeechEngine from '~/components/SpeechEngine.vue'

export default {
  components: {
    TextArea,
    TextAreaEditable,
    SpeechEngine
  },
  data() {
    return {
      types: ['indication', 'technique', 'comparison', 'findings', 'impression']
    }
  }
}
</script>
