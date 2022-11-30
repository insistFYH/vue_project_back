<template>
    <el-form label-width="80px" :model="spu">
        <el-form-item label="SPU名称">
            <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
        </el-form-item>
        <el-form-item label="品牌">
            <el-select placeholder="请选择品牌" v-model="spu.tmId">
                <el-option :label="tm.tmName" :value="tm.id" v-for="(tm,index) in trademarkList" :key="tm.id">{{tm.tmName}}</el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="SPU描述">
            <el-input type="textarea" placeholder="描述" rows="4" v-model="spu.description"></el-input>
        </el-form-item>
        <el-form-item label="SPU图片">
            <el-upload action="/dev-api/admin/product/fileUpload" list-type="picture-card" :file-list="spuImageList" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handleAdd">
                <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
        </el-form-item>
        <el-form-item label="销售属性">
            <el-select :placeholder="`还有${unselectAttr.length}项未选`" v-model="attrIdAndName">
                <el-option :label="unselect.name" :value="`${unselect.id}:${unselect.name}`" v-for="unselect in unselectAttr" :key="unselect.id"></el-option>
            </el-select>
            <el-button type="primary" icon="el-icon-plus" @click="addSaleAttr" :disabled="!attrIdAndName">添加销售属性</el-button>
            <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
                <el-table-column type="index" label="序号" width="80" align="center">
                </el-table-column>
                <el-table-column prop="saleAttrName" label="属性名" width="width">
                </el-table-column>
                <el-table-column prop="prop" label="属性值名称列表" width="width">
                    <template slot-scope="{row,$index}">
                        <el-tag v-for="(tag,index) in row.spuSaleAttrValueList" :key="tag.id" closable :disable-transitions="false" @close="handleClose(row,index)">
                            {{tag.saleAttrValueName}}
                        </el-tag>
                        <el-input class="input-new-tag" v-if="row.inputVisible" v-model="saleAttrValueName" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(row)" @blur="handleInputConfirm(row)">
                        </el-input>
                        <el-button v-else class="button-new-tag" size="small" @click="showInput(row,$index)">添加</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="prop" label="操作" width="width">
                    <template slot-scope="{row,$index}">
                        <el-button type="danger" icon='el-icon-delete' size='mini' @click="deleteAttr($index)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="saveSpuInfo">保存</el-button>
            <el-button @click="quitChange">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
    name: "AddOrUpdateSpu",
    data() {
        return {
            dialogImageUrl: "",
            dialogVisible: false,
            spu: {
                category3Id: 0,
                spuName: "",
                description: "",
                tmId: "",
                spuImageList: [],
                spuSaleAttrList: [],
            },
            spuImageList: [],
            trademarkList: [],
            saleAttrList: [],
            attrIdAndName: "",
            saleAttrValueName: "",
        };
    },
    methods: {
        //移除照片
        handleRemove(file, fileList) {
            // console.log(file, fileList);
            this.spuImageList = fileList;
        },
        // 预览照片
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        // 上传图片成功
        handleAdd(response, file, fileList) {
            console.log(file, response, fileList);
            // 新上传的照片添加两个属性，便于后续携带数据请求服务器
            this.$set(fileList[fileList.length - 1], "imgName", file.name);
            this.$set(fileList[fileList.length - 1], "imgUrl", response.data);
            this.spuImageList = fileList;
        },
        // 修改spu初始化页面，加载数据
        async initSpu(row) {
            // console.log(row);
            // 获取spu数据
            let spuResult = await this.$API.spu.reqGetSpuById(row.id);
            this.spu = spuResult.data;
            // 获取spu图片数据
            let spuImageListResult = await this.$API.spu.reqGetSpuImageList(
                row.id
            );
            let imageTemp = spuImageListResult.data;
            // 进行相关处理，以便el-upload使用图片
            imageTemp.forEach((item) => {
                item.name = item.imgName;
                item.url = item.imgUrl;
            });
            this.spuImageList = imageTemp;
            // 获取品牌列表
            let trademarkListResult = await this.$API.spu.reqGetTrademarkList();
            this.trademarkList = trademarkListResult.data;
            // 获取销售属性列表
            let saleAttrListResult = await this.$API.spu.reqSaleAttrList();
            this.saleAttrList = saleAttrListResult.data;
        },
        // 添加spu初始化页面
        async addSpu(category3Id) {
            // 存储第三级id
            this.spu.category3Id = category3Id;
            // 获取品牌列表
            let trademarkListResult = await this.$API.spu.reqGetTrademarkList();
            this.trademarkList = trademarkListResult.data;
            // 获取销售属性列表
            let saleAttrListResult = await this.$API.spu.reqSaleAttrList();
            this.saleAttrList = saleAttrListResult.data;
        },
        // 关闭删除attrValue
        handleClose(row, index) {
            row.spuSaleAttrValueList.splice(index, 1);
        },
        // 添加tag，显示input
        showInput(row, index) {
            this.$set(row, "inputVisible", true);
            // console.log(index);
            this.$nextTick((_) => {
                this.$refs.saveTagInput.focus();
            });
        },
        // 属性值添加input框确认
        handleInputConfirm(row) {
            // 空值排除
            if (!this.saleAttrValueName.trim()) {
                this.$message({ type: "info", message: "请输入有效属性值" });
            } else {
                // 避免重复值
                let same = row.spuSaleAttrValueList.some((item) => {
                    return item.saleAttrValueName == this.saleAttrValueName;
                });
                if (!same) {
                    const obj = {
                        baseSaleAttrId: row.baseSaleAttrId,
                        saleAttrName: row.saleAttrName,
                        saleAttrValueName: this.saleAttrValueName,
                    };
                    // 添加
                    row.spuSaleAttrValueList.push(obj);
                    row.inputVisible = false;
                    this.saleAttrValueName = "";
                } else {
                    this.$message({
                        type: "info",
                        message: "已存在该销售属性值",
                    });
                }
            }
        },
        // 添加销售属性
        addSaleAttr() {
            const arr = this.attrIdAndName.split(":");
            const obj = { baseSaleAttrId: arr[0], saleAttrName: arr[1] };
            this.$set(obj, "spuSaleAttrValueList", []);
            // 添加进spu
            this.spu.spuSaleAttrList.push(obj);
            // 清空选择
            this.attrIdAndName = "";
        },
        // 删除销售属性
        deleteAttr(flag) {
            this.spu.spuSaleAttrList = this.spu.spuSaleAttrList.filter(
                (item, index) => {
                    return index != flag;
                }
            );
        },
        // 保存添加|修改属性
        async saveSpuInfo() {
            // 整理数据
            this.spuImageList.forEach((item) => {
                delete item.name;
                delete item.url;
            });
            this.spu.spuImageList = this.spuImageList;
            // 发请求
            let result = await this.$API.spu.reqSaveSpuInfo(this.spu);
            // console.log(result);
            if (result.code == 200) {
                // 切换显示面
                this.$emit("changeScenc", {
                    scenc: 0,
                    flag: this.spu.id ? "update" : "add",
                });
                // 清空数据
                Object.assign(this._data, this.$options.data());
            }
        },
        // 取消添加|修改属性
        quitChange() {
            this.$emit("changeScenc", { scenc: 0 });
            // this.spu = {
            //     category3Id: 0,
            //     spuName: "",
            //     description: "",
            //     tmId: "",
            //     spuImageList: [],
            //     spuSaleAttrList: [],
            // };
            // this.spuImageList = [];
            // 清空数据
            Object.assign(this._data, this.$options.data());
        },
    },
    computed: {
        // 计算未选择销售属性
        unselectAttr() {
            return this.saleAttrList.filter((item) => {
                return this.spu.spuSaleAttrList.every((item2) => {
                    return item.name != item2.saleAttrName;
                });
            });
        },
    },
};
</script>

<style>
.el-tag + .el-tag {
    margin-left: 10px;
}
.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
</style>