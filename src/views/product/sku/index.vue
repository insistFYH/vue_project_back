<template>
    <div>
        <!-- 表格展示sku列表 -->
        <el-table style="width: 100%" border :data="skuList">
            <el-table-column type="index" label="序号" width="80" align="center">
            </el-table-column>
            <el-table-column prop="skuName" label="名称" width="width">
            </el-table-column>
            <el-table-column prop="skuDesc" label="描述" width="width">
            </el-table-column>
            <el-table-column prop="prop" label="默认图片" width="width">
                <template slot-scope="{row,$index}">
                    <img :src="row.skuDefaultImg" alt="" style="width:100px;height">
                </template>
            </el-table-column>
            <el-table-column prop="weight" label="重量" width="80">
            </el-table-column>
            <el-table-column prop="price" label="价格" width="80">
            </el-table-column>
            <el-table-column prop="prop" label="操作" width="width">
                <template slot-scope="{row,$index}">
                    <el-button type="success" icon="el-icon-top" size="mini" v-if="row.isSale==0" @click="sale(row)"></el-button>
                    <el-button type="success" icon="el-icon-bottom" size="mini" v-else @click="cancelSale(row)"></el-button>
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit()"></el-button>
                    <el-button type="info" icon="el-icon-info" size="mini" @click="getSkuInfo(row)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination :current-page="page" :page-sizes="[3, 5, 10]" :page-size="limit" layout="prev, pager, next, jumper, ->, sizes, total" :total="total" style="text-align:center" @current-change="getSkuList" @size-change="handleSizeChange">
        </el-pagination>
        <!-- drawer -->
        <el-drawer :visible.sync="drawer" :show-close="false" size="50%">
            <el-row>
                <el-col :span="5">
                    <div>名称</div>
                </el-col>
                <el-col :span="16">
                    <div>{{skuInfo.skuName}}</div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="5">
                    <div>描述</div>
                </el-col>
                <el-col :span="16">
                    <div>{{skuInfo.skuDesc}}</div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="5">
                    <div>价格</div>
                </el-col>
                <el-col :span="16">
                    <div>{{skuInfo.price}}元</div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="5">
                    <div>平台属性</div>
                </el-col>
                <el-col :span="16">
                    <el-tag type="success" v-for="(attr, index) in skuInfo.skuAttrValueList" :key="attr.id" style="margin-right:10px">{{attr.attrName}}</el-tag>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="5">
                    <div>商品图片</div>
                </el-col>
                <el-col :span="16">
                    <el-carousel :interval="5000" arrow="always">
                        <el-carousel-item v-for="img in skuInfo.skuImageList" :key="img.id">
                            <img :src="img.imgUrl" alt="" style="width:100%">
                        </el-carousel-item>
                    </el-carousel>
                </el-col>
            </el-row>
        </el-drawer>
    </div>
</template>

<script>
export default {
    name: "Sku",
    data() {
        return {
            page: 1,
            limit: 10,
            total: 0,
            skuList: [],
            drawer: false, //控制drawer显示与隐藏
            skuInfo: {},
        };
    },
    mounted() {
        this.getSkuList();
    },
    methods: {
        // 获取sku列表
        async getSkuList(pages = 1) {
            // 分页器注入pages，切换当前页
            this.page = pages;
            const { page, limit } = this;
            let result = await this.$API.sku.reqSkuList(page, limit);
            if (result.code == 200) {
                this.total = result.data.total;
                this.skuList = result.data.records;
            }
        },
        // 改变单页显示表格条数
        handleSizeChange(limit) {
            this.limit = limit;
            this.getSkuList();
        },
        // 上架
        async sale(row) {
            let result = await this.$API.sku.reqOnSale(row.id);
            if (result.code == 200) {
                row.isSale = 1;
                this.$message({
                    type: "success",
                    message: "上架成功",
                });
            }
        },
        // 下架
        async cancelSale(row) {
            let result = await this.$API.sku.reqCancelSale(row.id);
            if (result.code == 200) {
                row.isSale = 0;
                this.$message({
                    type: "success",
                    message: "下架成功",
                });
            }
        },
        // 编辑
        edit() {
            this.$message({
                type: "info",
                message: "正在开发中",
            });
        },
        // 获取sku详细信息
        async getSkuInfo(row) {
            this.drawer = true;
            let result = await this.$API.sku.reqSkuInfo(row.id);
            if (result.code == 200) {
                this.skuInfo = result.data;
            }
        },
    },
};
</script>
<style>
.el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}
.el-carousel__button {
    width: 10px;
    height: 10px;
    border-radius: 50%;
}
</style>
<style scope>
.el-row .el-col-5 {
    font-size: 18px;
    text-align: right;
}
.el-row .el-col {
    margin: 10px;
}
</style>