<template>
  <v-layout>
    <v-flex>
      <div>
        <v-textarea
          :name="$store.get('activeTag').id"
          :value="$store.get('activeTag').text"
          autofocus
          :outlined="true"
          auto-grow
          @input="setActiveTagText"
        ></v-textarea>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  methods: {
    setActiveTagText(value) {
      console.log("value", value);
      this.$store.commit("setActiveTagText", value);
    }
  }
};
</script>

<style>
</style>
