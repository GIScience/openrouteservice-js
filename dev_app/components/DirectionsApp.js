import Openrouteservice from '@/index.js'

export default {
    props: {
        msg: {
            type: String,
            required: false
        }
    },
    data() {
        return {
            json_back: {},
            data_ready: false
        }
    },
    methods: {},

    async mounted() {
        const orsDirections = new Openrouteservice.Directions({
            api_key: import.meta.env.VITE_ORS_API_KEY
        })

        const json1 = { "options": '{ "option1": "o1", "option2": "o2" }'}
        console.log(json1.options)
        console.log(typeof json1.options)
        console.log(json1)
        console.log(typeof json1)


        let body = {}
        try {
            body = await orsDirections.getBody(json1)
            console.log(json1.options)
            console.log(typeof json1.options)
            console.log(json1)
            console.log(typeof json1)

            this.json_back = body
        } catch (e) {
            this.json_back = JSON.stringify(e, null, "\t")
        }

        this.data_ready = true
    }
}