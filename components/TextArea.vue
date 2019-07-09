<template>
    <v-layout
        justify-center
        align-center
        >
        <v-flex
            xs12
        >
            <v-card v-if="$store.get('activeReport')">
                <v-card-title class="title">{{$store.getters.getActiveReport.content[type].name['da-dk']}}</v-card-title>
                <div
                    v-for="finding in $store.getters.getActiveReport.content[type].tags"
                    :key="finding.id"
                    @click="setActiveTag(finding)"
                    >

                    <v-card-text
                        :name="finding.id"
                        :value="finding.text"
                        
                    >
                        <p>
                            
                            <div v-if="finding.id === $store.get('activeTag.id')">
                                <span class="body-2" style="bold">{{finding.name['da-dk']}}:</span>
                                <text-area-editable
                                    
                                    :tag="finding"
                                    :type="'findings'"
                                    
                                >

                                </text-area-editable>
                            </div>
                            <div
                                v-else
                                >
                                <span class="body-2" style="bold">{{finding.name['da-dk']}}:</span>
                                {{finding.text}}
                            </div>
                        </p>
                    </v-card-text>
                </div>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
import TextAreaEditable from '~/components/TextAreaEditable.vue'


export default {
    props: {
        type: String
    },
    methods: {
        setActiveTag(value) {
            this.$store.commit('setActiveTag', value)
        },
        
    },
    components: {
        TextAreaEditable
    }
}
</script>

<style>

</style>
