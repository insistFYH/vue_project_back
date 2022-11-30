<template>
    <div>
        <!-- 三级列表 -->
        <CategoryNav @getListInfo="getCategoryAttr" @setOn="setOn" :show="!isShow"></CategoryNav>
        <!-- 属性展示，添加，修改 -->
        <el-card shadow="always">
            <!-- 展示 -->
            <div v-show="isShow">
                <el-button type="primary" icon='el-icon-plus' size="big" @click.native="addAttr" :disabled="on">添加属性</el-button>
                <el-table style="width: 100%" border :data="attrList">
                    <el-table-column type="index" prop="prop" label="序号" width="80" align="center">
                    </el-table-column>
                    <el-table-column prop="attrName" label="属性名称" width="150">
                    </el-table-column>
                    <el-table-column prop="attrValueList" label="属性值列表" width="width">
                        <template slot-scope="{row,$index}">
                            <el-tag type="success" v-for="value in row.attrValueList" :key="value.id" style="margin:0 20px">{{value.valueName}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="prop" label="操作" width="150">
                        <template slot-scope="{row,$index}">
                            <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)"></el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 添加页面||修改页面 -->
            <div v-show="!isShow">
                <el-form :inline="true" label-width="80px" :model="attrInfo">
                    <el-form-item label="属性名">
                        <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
                    </el-form-item>
                </el-form>
                <el-button type="primary" size="big" icon="el-icon-plus" :disabled="!attrInfo.attrName" @click="addAttrValue">添加属性值</el-button>
                <el-button>取消</el-button>
                <el-table style="width: 100%;margin:20px 0" border :data="attrInfo.attrValueList">
                    <el-table-column type="index" prop="prop" label="序号" width="80">
                    </el-table-column>
                    <el-table-column prop="prop" label="属性值名称" width="width">
                        <template slot-scope="{row,$index}">
                            <el-input v-model="row.valueName" placeholder="请输入属性值名称" size="mini" v-if="row.flag" @blur="showSpan(row,$index)" @keyup.native.enter="showSpan(row,$index)" :ref="$index"></el-input>
                            <span v-else @click="toEdit(row,$index)" style="height:20px">{{row.valueName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="prop" label="操作" width="width">
                        <template slot-scope="{row,$index}">
                            <el-popconfirm :title="`确定删除${row.valueName}吗？`" @onConfirm="deleteAttrValue($index)">
                                <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"></el-button>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button type="primary" @click="addOrUpdateAttr" :disabled="attrInfo.attrValueList.length<1">保存</el-button>
                <el-button @click="outAddAttr">取消</el-button>
            </div>
        </el-card>
        <!-- 添加属性页 -->

    </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
    name: "Attr",
    data() {
        return {
            attrList: [],
            isShow: true,
            on: true,
            attrInfo: {
                attrName: "",
                attrValueList: [],
                categoryId: undefined,
                categoryLevel: 3,
            },
            //码的不行，补缺，保存最先传过来的data
            originId: {},
        };
    },
    methods: {
        //获取商品属性
        async getCategoryAttr(data) {
            //预先设置添加属性的id
            this.attrInfo.categoryId = data.category3Id;
            this.originId = data;
            let result = await this.$API.attr.reqGetCategoryAttr(data);
            console.log(333, result);
            if (result.code == 200) {
                this.attrList = result.data;
                this.on = false;
            }
        },
        // 设置添加属性按钮disable
        setOn() {
            this.on = true;
        },
        //添加商品属性
        addAttr() {
            this.isShow = false;
            // 清除上一次残留数据，数据回退
            this.attrInfo.attrName = "";
            this.attrInfo.attrValueList = [];
        },
        //添加商品属性值
        addAttrValue() {
            //增加一行属性值填写
            this.attrInfo.attrValueList.push({
                attrId: this.attrInfo.id,
                valueName: "",
                //flag控制input和span的显示和隐藏
                flag: true,
            });
            //添加框上input元素自动聚焦
            let length = this.attrInfo.attrValueList.length;
            this.$nextTick(() => {
                this.$refs[length - 1].focus();
            });
        },
        //取消添加属性
        outAddAttr() {
            // 回到属性展示页面
            this.isShow = true;
        },
        //修改商品属性
        updateAttr(row) {
            this.isShow = false;
            this.attrInfo = cloneDeep(row);
            this.attrInfo.attrValueList.forEach((item) => {
                this.$set(item, "flag", false);
            });
        },
        // 失去焦点显示span，同时进行输入值的校验
        showSpan(row, $index) {
            // 属性值为空的情况
            if (!row.valueName.trim()) {
                this.$message("请输入有效属性值");
                return;
            }
            let repeat = this.attrInfo.attrValueList.some((item, index) => {
                if ($index !== index) {
                    return item.valueName == row.valueName;
                }
            });
            // 存在重复属性值
            if (repeat) {
                this.$message("已存在该属性值");
                return;
            }
            row.flag = false;
        },
        //点击span进入编辑模式
        toEdit(row, index) {
            row.flag = true;
            // console.log(this.$refs);
            //自动聚焦
            this.$nextTick(() => {
                this.$refs[index].focus();
            });
        },
        //删除商品属性
        deleteAttrValue(index) {
            this.attrInfo.attrValueList.splice(index, 1);
        },
        //保存添加或修改的商品属性
        async addOrUpdateAttr() {
            // alert(111);
            //将属性值为空的项过滤掉
            //将flag属性删除
            this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
                (item) => {
                    if (item.valueName !== "") {
                        delete item.flag;
                        return true;
                    }
                }
            );
            try {
                await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
                this.isShow = true;
                this.$message({
                    type: "success",
                    message: "添加或修改属性成功",
                });
                this.getCategoryAttr(this.originId);
            } catch (error) {
                this.$message({ type: "error", message: "添加或修改属性失败" });
            }
        },
    },
};
</script>

<style>
</style>