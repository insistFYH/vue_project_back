<template>
    <div ref="bar" class="bar"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
    name: "RowBarChart",
    mounted() {
        let myCharts = echarts.init(this.$refs.bar);
        myCharts.setOption({
            xAxis: {
                show: false,
                min: 0,
                max: 100,
            },
            yAxis: {
                show: false,
                // 均分
                type: "category",
            },
            series: [
                {
                    type: "bar",
                    data: [78],
                    // 条大小
                    barWidth: 10,
                    color: "cyan",
                    showBackground: true,
                    backgroundStyle: {
                        color: "#eee",
                    },
                    label: {
                        show: true,
                        //改变文本内容
                        formatter: "|",
                        //文本标签位置调试
                        position: "right",
                    },
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