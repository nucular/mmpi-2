const Test = Vue.component("test-view", {
    template: "#test-view-template",
    data: function() {
        return {
            questions: [],
            answers: {},
            currentRoute: "1"
        };
    },
    created: function() {
        var self = this;
        $.getJSON("data/questions.json", function(data) {
            self.questions = data;
        });
    },
    computed: {
        currentQuestion: function() {
            return parseInt(this.$route.params.question) - 1;
        },
        paginationStart: function() {
            return Math.max(0, this.currentQuestion - 2);
        },
        paginationEnd: function() {
            return Math.min(this.paginationStart + 5, this.questions.length - 1);
        }
    },
    methods: {
        answer: function(state) {
            var vm = this;
            vm.answers[vm.currentQuestion] = state;
            vm.$router.push({name: "test", params: {question: vm.currentQuestion + 1}});
        }
    }
});
