 Vue.component("line-chart", {
    extends: VueChartJs.Line,
    mixins: [VueChartJs.mixins.reactiveProp],
    props: ["options"],
    mounted: function() {
        this.renderChart(this.chartData, this.options);
    }
});
