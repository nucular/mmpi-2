const Report = Vue.component("report-view", {
    template: "#report-view-template",
    data: function() {
        return {
            scaleCategories: [],
            answers: {},
            gender: "male",
            scores: {},
            charts: [
                {
                    labels: ["VRIN", "TRIN", "F", "Fp", "FBS", "L", "K", "S", "Hs", "D", "Hy", "Pd", "Mf", "Pa", "Pt", "Sc", "Ma", "Si"],
                    datasets: [{
                        data: [],
                        lineTension: 0
                    }]
                }
            ]
        };
    },
    created: function() {
        var vm = this;
        $.getJSON("data/scales.json", function(data) {
            vm.scaleCategories = data;
        });
        
        var a = "TTFTFFTFFFFFFTFTFFFTTTFFFTFFTFTFFTFTTTTFTFFFFTTTFTTTTFTTTFTFFTTFTTTFTTTFTFF"
            + "TTFFFTTFFTFTTTFTTTFFFFTFFFFFFTFTTFTFFFFTFTTFTFFTFFFTTTTFFFFTFTFTFFFTFFFTFFT"
            + "FFFTTTFTTFTFTTFTTFFFTTFFTTFTTTTFFFTTFFFTFTFFTTFFTFFFFTFFTFTFFFFTTFTFTFFTFTF"
            + "TFFTFTTTFTTFTFFFFTFFFFFTTTFTFFTFTTTFFTTTTTTTFFFTFTTTTTFFFFTTFFFTFFFTFTFFFFF"
            + "TFTFFTFTTTTFFTFTFFFTFFFFTTFFFTFFFFFFTFTFTFFTFFTTTFFFTFFFTFFFFTFTTFFTFFTTFTF"
            + "TTTFTFFTTTTTFFTTFFTFFFFTTTFFTTFFTTFTTFFFFFTFTFFTTFFTFFFTTTTFFTFTTFTFFFTFFFT"
            + "TTFTTFFTTFTTTTTFTFTFFTTTTTFFTTFTTFTTTFTFTTFFFFTFTFTTFTTTFFTFTFFTTTTTTTFFTFF"
            + "TTFFTFTTFFFFFTFTFFFFFTFFTFFTTFFFTFFFTFTTTF";
        for (var i = 0; i < a.length; i++) {
            vm.answers[i] = a.charAt(i) == "T";
        }
    },
    methods: {
        calculateTScore: function(rawScore, scale) {
            var tScores = scale.tScores[this.gender];
            if (scale.kCorrection) {
                var kScore = this.scores["K"] * scale.kCorrection + rawScore;
                rawScore = Math.floor(kScore + 0.5);
            }
            if (scale.scoreOffsets) {
                rawScore -= scale.scoreOffsets[this.gender];
            }
            return tScores[Math.max(0, Math.min(rawScore, tScores.length - 1))];
        },
        gradeScale: function(scale) {
            var vm = this;
            if (scale.gender && scale.gender != vm.gender) return;
            var rawScore = 0;
            scale.answers.forEach(function(v) {
                for (var i = 0; i < v.length; i += 2) {
                    var question = v[i],
                        answer = v[i+1];
                    if (vm.answers[question] != answer)
                        return
                }
                if (v.length % 2 == 1)
                    rawScore += v[v.length - 1];
                else
                    rawScore++;
            });
            if (scale.subScales) {
                scale.subScales.forEach(vm.gradeScale)
            }
            if (scale.tScores)
                vm.scores[scale.name] = vm.calculateTScore(rawScore, scale);
            else
                vm.scores[scale.name] = rawScore;
        },

        grade: function() {
            var vm = this;
            vm.scaleCategories.forEach(function(category) {
                category.items.forEach(vm.gradeScale);
            });
            vm.charts.forEach(function(chart) {
                chart.labels.forEach(function(name) {
                    chart.datasets.forEach(function(dataset) {
                        dataset.data.push(vm.scores[name]);
                    });
                });
            });
        }
    }
});
