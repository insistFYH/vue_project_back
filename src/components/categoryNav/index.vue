<template>
    <div>
        <el-card shadow="always" style="margin:20px 0">
            <el-form :inline="true" class="demo-form-inline" :model="formInfo">
                <el-form-item label="一级分类">
                    <el-select placeholder="请选择" v-model="formInfo.category1Name" :disabled="show">
                        <el-option :label="cate1.name" :value="cate1.name" v-for="(cate1) in category1" :key="cate1.id" @click.native="getCategory2(cate1.id)"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="二级分类">
                    <el-select placeholder="请选择" v-model="formInfo.category2Name" :disabled="show">
                        <el-option :label="cate2.name" :value="cate2.name" v-for="(cate2) in category2" :key="cate2.id" @click.native="getCategory3(cate2.id)"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="三级分类">
                    <el-select placeholder="请选择" v-model="formInfo.category3Name" :disabled="show">
                        <el-option :label="cate3.name" :value="cate3.name" v-for="(cate3) in category3" :key="cate3.id" @click.native="getCategoryAttr(cate3.id)"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
export default {
    name: "CategoryNav",
    // 设置三级联动列表的可操作性
    props: ["show"],
    data() {
        return {
            category1: [],
            category2: [],
            category3: [],
            formInfo: {
                category1Id: "",
                category2Id: "",
                category3Id: "",
                category1Name: "",
                category2Name: "",
                category3Name: "",
            },
        };
    },
    mounted() {
        this.getCategory1();
    },
    methods: {
        //获取一级分类列表
        async getCategory1() {
            let result = await this.$API.attr.reqGetCategory1();
            // console.log("@@@", result);
            if (result.code == 200) {
                this.category1 = result.data;
            }
        },
        // 获取二类分级列表
        async getCategory2(category1Id) {
            this.category3 = "";
            this.formInfo.category2Name = "";
            this.formInfo.category3Name = "";
            this.formInfo.category2Id = "";
            this.formInfo.category3Id = "";
            this.formInfo.category1Id = category1Id;
            let result = await this.$API.attr.reqGetCategory2(category1Id);
            // console.log("@@@", result);
            if (result.code == 200) {
                this.category2 = result.data;
                this.$emit("setOn");
            }
        },
        //获取三及分类列表
        async getCategory3(category2Id) {
            this.formInfo.category3Name = "";
            this.formInfo.category3Id = "";
            this.formInfo.category2Id = category2Id;
            let result = await this.$API.attr.reqGetCategory3(category2Id);
            // console.log(result);
            if (result.code == 200) {
                this.category3 = result.data;
                this.$emit("setOn");
            }
        },
        //获取商品属性
        getCategoryAttr(id) {
            this.formInfo.category3Id = id;
            let { category1Id, category2Id, category3Id } = this.formInfo;
            this.$emit("getListInfo", {
                category1Id,
                category2Id,
                category3Id,
            });
        },
    },
};
</script>

<style>
</style>