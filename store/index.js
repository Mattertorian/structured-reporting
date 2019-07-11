import createEasyAccess from 'vuex-easy-access'
import reports from '~/assets/reports.json'
import { defaultMutations } from 'vuex-easy-access'


const easyAccess = createEasyAccess()
// and include as plugin in your vuex store:
export const plugins = [easyAccess]

export const state = () => ({
    activeReport: false,
    reports: reports,
    reportSelected: false,
    activeTag: null,
    language: 'da-DK'
})
export const getters = {
    getActiveReport: (state) => {
        console.log(state.reports)
        const active = state.reports.find(report => {
            console.log(report)
            console.log('state.activeReport', state.activeReport)
            return report.id === state.activeReport
        })
        console.log('getActiveReport', active)
        return active
    },
    getAvailableTags: (state, getters) => {
        if (state.activeReport) {
            const propertyList = Object.keys( getters.getActiveReport.content )
            const tagList = []
            propertyList.forEach(element => {
                getters.getActiveReport.content[element].tags.forEach(tag => {
                    tagList.push({
                        id: tag.id,
                        name: tag.name[state.language],
                        tag: tag
                    }) 
                })
            })
            console.log('tagList', tagList)
            return tagList
        }
    }
    // getActiveTag: (state) => {
    //     const reportIndex = state.reports.findIndex(report => report.id = state.activeReport)
    //     console.log('reportIndex', reportIndex)
    //     const tagIndex = state.reports[reportIndex].content[state.activeTag.type].tags.findIndex(tag => tag.id === state.activeTag.id)
    //     console.log('tagIndex', tagIndex)
    //     return state.reports[reportIndex].content[state.activeTag.type].tags[tagIndex].text
    // }
}
export const mutations = {
    setActiveReport(state, payload) {
        state.activeReport = payload
    },
    setActiveTag(state, payload) {
        console.log('setActiveTag', payload)
        state.activeTag = payload
    },
    setActiveTagText(state, payload) {
        const reportIndex = state.reports.findIndex(report => report.id = state.activeReport)
        console.log('reportIndex', reportIndex)
        const tagIndex = state.reports[reportIndex].content[state.activeTag.type].tags.findIndex(tag => tag.id === state.activeTag.id)
        console.log('tagIndex', tagIndex)
        state.reports[reportIndex].content[state.activeTag.type].tags[tagIndex].text = payload
    },
    ...defaultMutations(state)
}
export const actions = {}

export const strict = false