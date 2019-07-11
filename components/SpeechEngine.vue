<template>
    <div> 
        <v-btn @click="startRecording()">START</v-btn>
        <v-btn @click="stopRecording()">STOP</v-btn>
        <pre>{{recognitionResult}}</pre>
        
    </div>
</template>

<script>

import { EventBus } from './EventBus.js';
import { regExpLiteral } from '@babel/types';

export default {
  components: {

  },
  data () {
    return {
      clickCount: 0,
      recognitionResult: '',
      recognition: new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)()
    }
  },
  mounted(){
    this.recognition.lang='da-DK';
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 5;
    this.recognition.onresult = function(event) {
      // this.setRecognitionResult(event.results[0][0].transcript)
      EventBus.$emit('transcript', event.results[0][0].transcript)
      console.log('SpeechEngine: Du sagde - ', event.results[0][0].transcript);
    }
    this.recognition.onend = () => {
      this.startRecording()
    }
    EventBus.$on('transcript', (result) => this.speechCaptured(result))
    EventBus.$on('numpad-add-pressed', (e) => {
      console.log(`event is ${e}`)
      this.startRecording()
    });
    window.addEventListener('keyup',(e)=>{
      if (e.keyCode==107){
        EventBus.$emit('numpad-add-pressed', e)
      }
    })
    
  },
  methods:{
    startRecording: function(){
      this.recognition.start();
      console.log('SpeechEngine: Recording Started');
    },
    stopRecording: function(){
      this.recognition.stop();
      console.log('SpeechEngine: Recording Stopped');
    },
    speechCaptured: function(result){
      console.log('SpeechEngine: SpeechCaptured');
      this.recognitionResult += result;
      const regexa = new RegExp(/((g|G)(å|år) (t|T)il)/);
      console.log(regexa.test(result));
      const regexb = RegExp(/(?<=(g|G)(å|år) (t|T)il )(\w*)/)
      console.log(regexb.test(result));
      console.log(result.match(regexb));
      if (regexb.test(result)) {
        const matchingWord = result.match(regexb)[0]
  
        const matchingTag = this.$store.getters.getAvailableTags.find(tag => {
          return tag.name.toLowerCase().match(matchingWord.toLowerCase())
        })
        if (matchingTag) {
          console.log('matchingTag', matchingTag)
          this.$store.commit('setActiveTag', matchingTag.tag)
        }
      }

    }
  }
}
</script>

<style>

</style>
