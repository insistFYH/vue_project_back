<template>
    <el-card>
        <div class="card-header">
            <!-- @tab-click="handleClick" -->
            <el-tabs v-model="activeName" class="card-header-left">
                <el-tab-pane label="销售额" name="sale"></el-tab-pane>
                <el-tab-pane label="访问量" name="visit"></el-tab-pane>
            </el-tabs>
            <div class="card-header-right">
                <span @click="setDay">本日</span>
                <span @click="setWeek">本周</span>
                <span @click="setMonth">本月</span>
                <span @click="setYear">本年</span>
                <el-date-picker v-model="date" type="datetimerange" align="right" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['12:00:00', '08:00:00']" class="date">
                </el-date-picker>
            </div>
        </div>
        <div class="card-body">
            <el-row :gutter="10">
                <el-col :span="18">
                    <div class="card-body-left" ref="sale"></div>
                </el-col>
                <el-col :span="6">
                    <div class="card-body-right">
                        <h3>门店{{tabName}}排名</h3>
                        <ul>
                            <li>
                                <span class="rank">1</span>
                                <span>肯德基</span>
                                <span class="saleNumber">323200</span>
                            </li>
                            <li>
                                <span class="rank">2</span>
                                <span>麦当劳</span>
                                <span class="saleNumber">323199</span>
                            </li>
                            <li>
                                <span class="rank">3</span>
                                <span>华莱士</span>
                                <span class="saleNumber">323198</span>
                            </li>
                            <li>
                                <span>4</span>
                                <span>海底捞</span>
                                <span class="saleNumber">323197</span>
                            </li>
                            <li>
                                <span>5</span>
                                <span>汉堡王</span>
                                <span class="saleNumber">323196</span>
                            </li>
                            <li>
                                <span>6</span>
                                <span>真功夫</span>
                                <span class="saleNumber">323195</span>
                            </li>
                            <li>
                                <span>7</span>
                                <span>沙县大酒店</span>
                                <span class="saleNumber">323194</span>
                            </li>
                        </ul>
                    </div>
                </el-col>
            </el-row>
        </div>
    </el-card>
</template>

<script>
import * as echarts from "echarts";
import dayjs from "dayjs";
export default {
    name: "Sale",
    data() {
        return {
            activeName: "sale",
            date: "",
            myCharts: {},
        };
    },
    mounted() {
        this.myCharts = echarts.init(this.$refs.sale);
        this.myCharts.setOption({
            title: {
                text: this.tabName + "趋势",
            },
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "shadow",
                },
            },
            grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true,
            },
            xAxis: [
                {
                    type: "category",
                    data: [
                        "1月",
                        "2月",
                        "3月",
                        "4月",
                        "5月",
                        "6月",
                        "7月",
                        "8月",
                        "9月,",
                        "10月",
                        "11月",
                        "12月",
                    ],
                    axisTick: {
                        alignWithLabel: true,
                    },
                },
            ],
            yAxis: [
                {
                    type: "value",
                },
            ],
            series: [
                {
                    name: "Direct",
                    type: "bar",
                    barWidth: "60%",
                    data: [
                        10, 52, 200, 334, 390, 330, 220, 110, 300, 200, 600,
                        100,
                    ],
                    barWidth: 40,
                },
            ],
        });
    },
    computed: {
        // 计算切换tab名称
        tabName() {
            return this.activeName == "sale" ? "销售额" : "访问量";
        },
    },
    watch: {
        // 监视tab栏名称的变化
        tabName() {
            this.myCharts.setOption({
                title: {
                    text: this.tabName + "趋势",
                },
            });
        },
    },
    methods: {
        // 本日设置
        setDay() {
            let day = dayjs().format("YYYY-MM-DD");
            // console.log(day);
            this.date = [day, day];
        },
        // 本周设置
        setWeek() {
            let start = dayjs().day(1).format("YYYY-MM-DD");
            let end = dayjs().day(7).format("YYYY-MM-DD");
            this.date = [start, end];
        },
        // 本月设置
        setMonth() {
            let start = dayjs().startOf("month").format("YYYY-MM-DD");
            let end = dayjs().endOf("month").format("YYYY-MM-DD");
            this.date = [start, end];
        },
        // 本年设置
        setYear() {
            let start = dayjs().startOf("year").format("YYYY-MM-DD");
            let end = dayjs().endOf("year").format("YYYY-MM-DD");
            this.date = [start, end];
        },
    },
};
</script>

<style scoped>
.card-header {
    display: flex;
    justify-content: space-between;
    position: relative;
}
.card-header-left {
    width: 100%;
}
.card-header-right {
    position: absolute;
    right: 0;
}
.card-header-right span {
    margin-right: 20px;
}
.date {
    width: 250px;
}
.card-body-left {
    height: 340px;
    padding-top: 40px;
}
.card-body-right h3 {
    margin: 0;
    padding: 0;
}
.card-body-right ul li {
    position: relative;
    list-style: none;
    font-size: 16px;
}
.rank {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-left: -5px;
    border-radius: 50%;
    text-align: center;
    line-height: 20px;
    background-color: black;
    color: #fff;
}
.saleNumber {
    position: absolute;
    right: 0;
}
.card-body-right ul li {
    margin: 25px 0;
}
ul li span:first-child {
    margin-right: 30px;
}
</style>