<template>
  <v-layout justify-center align-center>
    <v-flex xs12>
      <v-card v-if="$store.get('activeReport')" max-width="800px" min-width="800px">
        <v-card-title
          class="title text-capitalize"
        >{{$store.getters.getActiveReport.content[type].name['da-DK']}}</v-card-title>
        <br />
        <div
          v-for="finding in $store.getters.getActiveReport.content[type].tags"
          :key="finding.id"
          @click="setActiveTag(finding)"
        >
          <v-card-text :name="finding.id" :value="finding.text">
            <div>
              <div v-if="finding.id === $store.get('activeTag.id')">
                <span
                  v-if="finding.name['da-DK'] !== 'indikation' && finding.name['da-DK'] !== 'teknik' && finding.name['da-DK'] !== 'sammenligning' && finding.name['da-DK'] !== 'konklusion'"
                  class="body-2 text-capitalize"
                  style="bold"
                >{{finding.name['da-DK']}}:</span>

                <text-area-editable :tag="finding" :type="'findings'"></text-area-editable>
              </div>
              <div v-else>
                <span
                  v-if="finding.name['da-DK'] !== 'indikation' && finding.name['da-DK'] !== 'teknik' && finding.name['da-DK'] !== 'sammenligning' && finding.name['da-DK'] !== 'konklusion'"
                  class="body-2 text-capitalize"
                  style="bold"
                >{{finding.name['da-DK']}}:</span>
                {{finding.text}}
              </div>
            </div>
          </v-card-text>
        </div>
      </v-card>
      <div style="margin-bottom: 60px" />
    </v-flex>
  </v-layout>
</template>

<script>
import TextAreaEditable from "~/components/TextAreaEditable.vue";

export default {
  props: {
    type: String
  },
  methods: {
    setActiveTag(value) {
      this.$store.commit("setActiveTag", value);
    }
  },
  components: {
    TextAreaEditable
  }
};
</script>

<style>
</style>
