<template>
    <el-card>
        <div slot="header" class="header">
            <span>销售额类比占比</span>
            <el-radio-group v-model="path">
                <el-radio-button label="全部渠道"></el-radio-button>
                <el-radio-button label="线上"></el-radio-button>
                <el-radio-button label="门店"></el-radio-button>
            </el-radio-group>
        </div>
        <div class="content" ref="pie"></div>
    </el-card>
</template>

<script>
import * as echarts from "echarts";
export default {
    name: "Category",
    data() {
        return {
            path: "全部渠道",
        };
    },
    mounted() {
        let myCharts = echarts.init(this.$refs.pie);
        myCharts.setOption({
            title: {
                text: "Direct",
                subtext: "735",
                left: "center",
                top: "center",
            },
            tooltip: {
                trigger: "item",
            },
            series: [
                {
                    name: "Access From",
                    type: "pie",
                    radius: ["40%", "70%"],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: "#fff",
                        borderWidth: 2,
                    },
                    label: {
                        show: true,
                        position: "outside",
                    },
                    labelLine: {
                        show: true,
                    },
                    data: [
                        { value: 1048, name: "Search Engine" },
                        { value: 735, name: "Direct" },
                        { value: 580, name: "Email" },
                        { value: 484, name: "Union Ads" },
                        { value: 300, name: "Video Ads" },
                    ],
                },
            ],
        });
        // 鼠标经过，改变饼图中间数值
        myCharts.on("mouseover", function (params) {
            // console.log(params);
            myCharts.setOption({
                title: {
                    text: params.name,
                    subtext: params.value,
                    left: "center",
                    top: "center",
                },
            });
        });
    },
};
</script>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
}
.content {
    width: 100%;
    height: 300px;
}
</style>