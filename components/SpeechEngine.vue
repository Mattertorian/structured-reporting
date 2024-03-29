<template>
  <div>
    <v-btn @click="toggleRecording()" fab :text="!recording" color="red">
      <v-icon v-if="recording" large>mic</v-icon>
      <v-icon v-if="!recording" large>mic_off</v-icon>
    </v-btn>
    <v-btn @click="togglePause()" fab :text="!pause" :disabled="!recording" color="green">
      <v-icon v-if="!pause" large>pause</v-icon>
      <v-icon v-if="pause" large>play_arrow</v-icon>
    </v-btn>
    {{recognitionResult}}
    <v-btn @click="copyToClipboard" fab text>
      <v-icon large>file_copy</v-icon>
    </v-btn>
    <v-btn fab text color="black">
      <a :href="jsonData" download="report.json" style="text-decoration: none">
        <v-icon large color="black">cloud_download</v-icon>
      </a>
    </v-btn>
  </div>
</template>

<script>
import { EventBus } from "./EventBus.js";
import { regExpLiteral } from "@babel/types";

export default {
  components: {},
  data() {
    return {
      recording: false, //if true the recording will restart whenever it stops
      pause: false, //if true the microphone and capture will stay on, but the received speech not forwarded for processing
      recognitionResult: "",
      recognition: new (window.SpeechRecognition ||
        window.webkitSpeechRecognition ||
        window.mozSpeechRecognition ||
        window.msSpeechRecognition)(),
      speechSynthesis: window.speechSynthesis
    };
  },
  computed: {
    activeTag() {
      return this.$store.state.activeTag;
    },
    jsonData() {
      const activeReport = this.$store.getters["getActiveReport"];
      const contentType = "application/json";
      const dData = JSON.stringify(activeReport, null, 2);
      const blob = new Blob([dData], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      return url;
    }
  },
  mounted() {
    console.log("inject", this.$inject);
    this.recognition.lang = "da-DK";
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 5;
    this.recognition.onresult = function(event) {
      EventBus.$emit("transcript", event.results[0][0].transcript);
      console.log(
        "SpeechEngine(Default): Du sagde - ",
        event.results[0][0].transcript
      );
    };
    this.recognition.onend = () => {
      if (this.recording) {
        this.startRecording();
      }
    };
    EventBus.$on("transcript", result => this.speechCaptured(result));
    EventBus.$on("numpad-add-pressed", e => {
      console.log(`event is ${e}`);
      this.toggleRecording();
    });
    window.addEventListener("keyup", e => {
      if (e.keyCode == 107) {
        EventBus.$emit("numpad-add-pressed", e);
      }
    });
  },
  methods: {
    copyToClipboard() {
      navigator.clipboard
        .writeText(
          JSON.stringify(this.$store.getters["getActiveReport"], null, 2)
        )
        .then(() => {
          console.log("Successfully copied to clipboard");
        })
        .catch(err => {
          console.error("Failed to copy report to clipboard");
        });
    },
    startRecording: function() {
      this.recognition.start();
      this.recording = true;
    },
    stopRecording: function() {
      this.recognition.stop();
      this.recording = false;
      this.pause = false;
    },
    toggleRecording: function() {
      console.log("toggleRecording");
      this.recording = !this.recording;
      if (this.recording) {
        this.startRecording();
        console.log("Toggle Recording: Recording Started");
      } else {
        this.recognition.abort(); //here we use the abort function, which terminates instantly without passing the final string. This way the user can't start the engine twice
        this.pause = false;
        console.log("Toggle Recording: Recording Stopped");
      }
    },
    speakText: function(text) {
      var utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "de-DE";
      this.speechSynthesis.speak(utterance);
    },
    pauseRecording: function() {
      this.pause = true;
    },
    unpauseRecording: function() {
      this.pause = false;
    },
    togglePause: function() {
      this.pause = !this.pause;
    },
    speechCaptured: function(result) {
      //Vi started med at genkende en række kommandoer.
      // Hvis ingen af dem er fundet og der er valgt et aktivt felt så opdateres dette.
      // Kommandoerne "stop optagelse" og "fortsæt (unpause)" fungere også i pauseret tilstand.
      console.log("SpeechEngine: speech captured");
      this.recognitionResult = '"' + result + '"';
      if (RegExp(/\b(\w*stop optagelse\w*)\b/, "i").test(result)) {
        //"Stop optagelse" afbryder optagelsen og mikrofonen slukkes
        this.stopRecording();
        console.log("SpeechEngine: stopper optagelse");
        this.speakText("stop");
      } else if (RegExp(/\b(\w*fortsæt\w*)\b/, "i").test(result)) {
        //"fortsæt" fortsætter optagelsen
        this.unpauseRecording();
        console.log("SpeechEngine: fortsætter optagelse");
        this.speakText("fortsæt");
      } else if (RegExp(/\b(\w*næste\w*)\b/, "i").test(result)) {
        const availableTagArray = Array.from(
          this.$store.getters.getAvailableTags
        );
        console.log("availableTagArray", availableTagArray);
        console.log("activeTag", this.activeTag);
        const index = availableTagArray.findIndex(tag => {
          return tag.id === this.activeTag.id;
        });
        if (index + 1 < availableTagArray.length) {
          console.log("index", index);
          this.$store.commit("setActiveTag", availableTagArray[index + 1]);
          this.speakText(availableTagArray[index + 1].tag.name["da-DK"]);
          console.log("næste", availableTagArray[index + 1].tag.name["da-DK"]);
        } else {
          console.log("Last available tag reached");
        }
      } else if (!this.pause) {
        //Hvis optagelsen ikke er sat på pause sendes den til analyse
        if (RegExp(/\b(\w*pause\w*)\b/, "i").test(result)) {
          //"pause" pauserer optagelsen, mikrofonen forbliver på
          this.pauseRecording();
          console.log("SpeechEngine: pauserer optagelse");
          this.speakText("pause");
        } else if (RegExp(/(gå\w? til)/, "i").test(result)) {
          //"gå til" udløser en søgning efter hvor den skal gå hen
          const regexb = RegExp(/(?<=(gå\w? til ))(\w*)/, "i");
          if (regexb.test(result) && this.$store.getters.getActiveReport) {
            //forsøg at gå til afsnittet hvis der er et søgeresultat og der er en aktiv rapport valgt
            const matchingWord = result.match(regexb)[0];
            const matchingTag = this.$store.getters.getAvailableTags.find(
              tag => {
                return tag.name.toLowerCase().match(matchingWord.toLowerCase());
              }
            );
            if (matchingTag) {
              //Hvis en tag blev fundet som matcher
              console.log("SpeechEngine: Går nu til ", matchingTag.name);
              this.$store.commit("setActiveTag", matchingTag.tag);
              this.speakText(matchingTag.tag.name["da-DK"]);
            } else {
              //Hvis ingen matchende tag findes
              console.log(
                'SpeechEngine: "Gå til" sagt men "',
                result.match(regexb)[0],
                '" blev ikke fundet'
              );
              this.speakText("fejl");
            }
          }
        } else if (this.activeTag) {
          //Hvis der aktuelt er valgt en tag skal denne updateres med teksten

          if (RegExp(/\b(\w*slet afsnit\w*)\b/, "i").test(result)) {
            //"slet afsnit" sletter det aktuelle tag
            this.$store.commit("setActiveTagText", "");
            console.log("SpeechEngine: sletter tag", this.activeTag.id);
            this.speakText("slettet");
          } else if (RegExp(/\b(\w*læs afsnit\w*)\b/, "i").test(result)) {
            //"læs afsnit" læser hele afsnittet højd
            if (this.activeTag.text == "") {
              this.speakText("tomt");
            } else {
              this.speakText(this.activeTag.text);
            }
          } else {
            //hvis der ikke er nogle commands så updateres det aktuelle teksfelt
            const newText =
              this.activeTag.text == ""
                ? this.activeTag.text + result
                : this.activeTag.text + " " + result;
            const replaceComma = newText.replace(/(\skomma)/g, ",");
            const replacePeriod = replaceComma.replace(/(\spunktum)/g, ".");
            const setUpperCase = replacePeriod.replace(
              /([!?.]\s+)([a-z])/g,
              (m, $1, $2) => $1 + $2.toUpperCase()
            );
            const capitalizeFirstLetter = setUpperCase.replace(
              /(^\w)/g,
              (m, $1) => $1.toUpperCase()
            );
            console.log("SpeechEngine:newtext=", capitalizeFirstLetter);
            this.$store.commit("setActiveTagText", capitalizeFirstLetter);
          }
        }
      }
    }
  }
};
</script>

<style>
</style>
