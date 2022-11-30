<template>
    <div ref="bar" class="bar"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
    name: "BarChart",
    mounted() {
        let myCharts = echarts.init(this.$refs.bar);
        myCharts.setOption({
            xAxis: {
                show: false,
                data: [60, 42, 14, 16, 28, 38, 15, 43, 19],
            },
            yAxis: {
                show: false,
            },
            series: [
                {
                    type: "bar",
                    data: [60, 42, 24, 66, 28, 38, 55, 43, 19],
                },
            ],
            grid: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
            },
        });
    },
};
</script>

<style>
.bar {
    width: 100%;
    height: 100%;
}
</style>