<template>
    <div>
        <button @click="startRecording()">START</button>
        <button @click="stopRecording()">STOP</button>
    </div>
</template>

<script>
export default {
  
  components: {
  },
  data () {
    return {
      recognition: new window.webkitSpeechRecognition(),
      // recognition: new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)()
    }
  },
  mounted(){
    console.log('inject', this.$inject)
    this.recognition.lang='da-DK';
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 5;
    this.recognition.onresult = function(event) {
      console.log('SpeechEngine: Du sagde - ', event.results[0][0].transcript);
    }
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
    handleRecording () {
      if(this.isRecording) {
        this.stopRecording()
      } else {
        this.startRecording()
      }
    }
  }
}
</script>

<style>

</style>
