<template>
  <v-app @keyup="handleKeyup(event.target.value)">
    <v-toolbar>
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title>Structured Reporting</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-select
          :items="$store.get('reports')"
          :item-text="'reportName'"
          :item-value="'id'"
          label="Tilgængelige rapporter"
          @change="setActiveReport"
        ></v-select>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>

export default {
  data() {
    return {
    }
  },
  methods: {
    setActiveReport(value) {
      this.$store.commit('setActiveReport', value)
    },
    handleKeyup(e) {
      console.log(e)
    }
  },
  mounted() {
    // window.addEventListener('keyup', function(event) {
    //     // If down arrow was pressed...
    //     if (event.keyCode == 107) { 
    //       console.log('NumpadAdd pressed!');
    //     }
    // });
  }
}
</script>
