<template>
    <div ref="line" class="line"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
    name: "LineChart",
    mounted() {
        let myCharts = echarts.init(this.$refs.line);
        myCharts.setOption({
            xAxis: {
                // 隐藏x轴
                show: false,
                type: "category",
            },
            yAxis: {
                // 隐藏y轴
                show: false,
            },
            series: [
                {
                    type: "line",
                    data: [10, 20, 50, 33, 44, 10, 80, 5],
                    // 曲线拐点设置透明
                    itemStyle: {
                        opacity: 0,
                    },
                    // 设置曲线的颜色
                    lineStyle: {
                        color: "purple",
                    },
                    // 设置区域渐变色填充
                    areaStyle: {
                        color: {
                            type: "linear",
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: "purple", // 0% 处的颜色
                                },
                                {
                                    offset: 1,
                                    color: "#fff", // 100% 处的颜色
                                },
                            ],
                            global: false, // 缺省为 false
                        },
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

<style scoped>
.line {
    width: 100%;
    height: 100%;
}
</style>