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
    <div v-for="type in types" :key="type">
    
      <text-area :type="type">
        
      </text-area>
    </div>  
      <pre>{{$store.get('activeTag')}}</pre>
      <text-area-editable        
          :tag="$store.get('activeTag')"
          :type="$store.get('activeTag').type"
          v-if="$store.get('activeTag')"
      >

      </text-area-editable>
    </v-flex>
  </v-layout>
</template>

<script>
import TextAreaEditable from '~/components/TextAreaEditable.vue'
import TextArea from '~/components/TextArea.vue'

export default {
  components: {
    TextArea,
    TextAreaEditable
  },
  data() {
    return {
      types: ['indication', 'technique', 'comparison', 'findings', 'impression']
    }
  }
}
</script>
