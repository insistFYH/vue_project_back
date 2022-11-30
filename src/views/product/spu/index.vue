<template>
    <div>
        <el-card style="margin:20px 0">
            <!-- 三级列表 -->
            <CategoryNav @getListInfo="getSpu" @setOn="setOn" :show="!isShow"></CategoryNav>
        </el-card>
        <el-card>
            <!-- spu列表展示 -->
            <div v-show="scenc==0">
                <!-- 添加按钮 -->
                <el-button type="primary" icon='el-icon-plus' :disabled="on" @click="addSpu">添加SPU</el-button>
                <!-- 表格形式展示 -->
                <el-table :data="records" style="width: 100%" border>
                    <el-table-column type="index" label="序号" width="80" align="center">
                    </el-table-column>
                    <el-table-column prop="spuName" label="SPU名称" width="width">
                    </el-table-column>
                    <el-table-column prop="description" label="SPU描述" width="width">
                    </el-table-column>
                    <el-table-column prop="prop" label="操作" width="width">
                        <template slot-scope="{row,$index}">
                            <hint-button type="success" icon="el-icon-plus" size="mini" title="添加sku" @click="addSku(row)"></hint-button>
                            <hint-button type="warning" icon="el-icon-edit" size="mini" title="修改spu" @click="updateSpu(row)"></hint-button>
                            <hint-button type="info" icon="el-icon-info" size="mini" title="查看当前spu的所有sku列表" @click="showSku(row)"></hint-button>
                            <el-popconfirm title="确定删除吗？" @onConfirm='deleteSpu(row)'>
                                <hint-button type="danger" icon="el-icon-delete" size="mini" title="删除spu" slot="reference"></hint-button>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页器 -->
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[3, 5, 10]" :page-size="limit" layout="prev, pager, next, jumper, ->, sizes, total" :total="total" style="text-align:center">
                </el-pagination>
            </div>
            <!-- 添加|修改spu -->
            <AddOrUpdateSpu v-show="scenc==1" @changeScenc="changeScenc" ref="addOrUpdateSpu"></AddOrUpdateSpu>
            <!-- 添加sku -->
            <AddSku v-show="scenc==2" ref="addSku" @changeScencs="changeScencs"></AddSku>
        </el-card>
        <!-- 显示sku列表弹窗表格 -->
        <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="handleClose">
            <el-table :data="skuList" v-loading="loading">
                <el-table-column header-align="center" align="center" prop="skuName" label="名称">
                </el-table-column>
                <el-table-column header-align="center" align="center" prop="price" label="价格">
                </el-table-column>
                <el-table-column header-align="center" align="center" prop="weight" label="重量">
                </el-table-column>
                <el-table-column header-align="center" align="center" label="默认图片">
                    <template slot-scope="{row,$index}">
                        <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px">
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
import AddOrUpdateSpu from "./AddOrUpdateSpu";
import AddSku from "./AddSku";
export default {
    name: "Spu",
    data() {
        return {
            // 显示表格控制
            isShow: true,
            // 控制添加spu按钮disable
            on: true,
            // 存放三个id
            originId: {},
            category3Id: null,
            page: 1,
            limit: 3,
            // spu列表
            records: [],
            total: null,
            //0:展示spu列表，1：添加|修改spu，2：添加sku
            scenc: 0,
            // 点击当前spu
            spu: {},
            skuList: [],
            //控制sku弹窗
            dialogTableVisible: false,
            // loading
            loading: true,
        };
    },
    components: {
        AddOrUpdateSpu,
        AddSku,
    },
    methods: {
        //获取spu
        async getSpu(data) {
            this.originId = data;
            this.category3Id = data.category3Id;
            const { page, limit, category3Id } = this;
            let result = await this.$API.spu.reqGetSpu(
                page,
                limit,
                category3Id
            );
            // console.log(result);
            if (result.code == 200) {
                this.total = result.data.total;
                this.records = result.data.records;
                this.on = false;
            }
        },
        //设置添加spu按钮disable
        setOn() {
            this.on = true;
        },
        //分页器换页
        handleCurrentChange(page) {
            this.page = page;
            this.getSpu(this.originId);
        },
        //分页器调整页面数据条数
        handleSizeChange(limit) {
            this.limit = limit;
            this.getSpu(this.originId);
        },
        // 添加spu
        addSpu() {
            this.scenc = 1;
            this.isShow = false;
            // 获取子组件
            let handleSpu = this.$refs.addOrUpdateSpu;
            handleSpu.addSpu(this.category3Id);
        },
        // 修改spu
        updateSpu(row) {
            this.scenc = 1;
            this.isShow = false;
            // 获取子组件
            let handleSpu = this.$refs.addOrUpdateSpu;
            handleSpu.initSpu(row);
        },
        // spu页面，改变展示页面，返回展示页面
        changeScenc({ scenc, flag }) {
            this.scenc = scenc;
            this.isShow = true;
            if (flag == "update") {
                this.$message({
                    type: "success",
                    message: "修改spu成功",
                });
            } else if (flag == "add") {
                this.$message({
                    type: "success",
                    message: "添加spu成功",
                });
                this.page = 1;
            }
            this.getSpu(this.originId);
        },
        // 删除spu
        async deleteSpu(row) {
            let result = await this.$API.spu.reqDeleteSpu(row.id);
            if (result.code == 200) {
                this.$message({ type: "success", message: "删除spu成功" });
                this.getSpu(this.originId);
                // 当前页没有数据则返回上一页
                if (this.records.length < 2) {
                    this.page -= 1;
                    this.getSpu(this.originId);
                }
            }
        },
        // 添加sku
        addSku(row) {
            this.scenc = 2;
            this.isShow = false;
            // 获取addSku子组件
            let addSku = this.$refs.addSku;
            addSku.initSku(row, this.originId);
        },
        // sku页面，改变页面
        changeScencs(scenc) {
            this.scenc = scenc;
        },
        // 展示当前spu的所有sku列表
        async showSku(row) {
            this.spu = row;
            this.dialogTableVisible = true;
            let result = await this.$API.spu.reqSkuById(row.id);
            if (result.code == 200) {
                this.skuList = result.data;
                this.loading = false;
            }
        },
        // 关闭dialog框
        handleClose(done) {
            this.loading = true;
            this.skuList = [];
            done();
        },
    },
};
</script>

<style>
</style>