<template>
    <el-form ref="form" :model="skuInfo" label-width="80px">
        <el-form-item label="SPU名称">{{spu.spuName}}
        </el-form-item>
        <el-form-item label="SKU名称">
            <el-input placeholder="sku名称" v-model="skuInfo.skuName"></el-input>
        </el-form-item>
        <el-form-item label="价格(元)">
            <el-input placeholder="价格(元)" type="number" v-model="skuInfo.price"></el-input>
        </el-form-item>
        <el-form-item label="重量(千克)">
            <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
        </el-form-item>
        <el-form-item label="规格描述">
            <el-input type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
        </el-form-item>
        <el-form-item label="平台属性">
            <el-form label-width="80px" :inline="true" class="demo-form-inline">
                <el-form-item :label="attrInfo.attrName" v-for="(attrInfo,index) in attrInfoList" :key="attrInfo.id">
                    <el-select v-model="attrInfo.attrIdAndValueId" placeholder="请选择">
                        <el-option :label="attrValue.valueName" :value="`${attrInfo.id}:${attrValue.id}`" v-for="(attrValue,index) in attrInfo.attrValueList" :key="attrValue.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-form-item>
        <el-form-item label="销售属性">
            <el-form label-width="80px" :inline="true" class="demo-form-inline">
                <el-form-item :label="saleAttr.saleAttrName" v-for="(saleAttr,index) in spuSaleAttrList" :key="saleAttr.id">
                    <el-select v-model="saleAttr.saleAttrIdAndSaleValueId" placeholder="请选择">
                        <el-option :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" v-for="(saleAttrValue,index) in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-form-item>
        <el-form-item label="图片列表">
            <el-table style="width: 100%" border :data="spuImageList" @selection-change="selectImage">
                <el-table-column type="selection" prop="prop" width="80">
                </el-table-column>
                <el-table-column prop="prop" label="图片" width="width">
                    <template slot-scope="{row,$index}">
                        <img :src="row.imgUrl" alt="" style="width: 100px; height: 100px">
                    </template>
                </el-table-column>
                <el-table-column prop="imgName" label="名称" width="width">
                </el-table-column>
                <el-table-column prop="prop" label="操作" width="width">
                    <template slot-scope="{row,$index}">
                        <el-button type="primary" v-if="row.isDefault==0" @click="setDefault(row)">设置默认</el-button>
                        <el-button v-else>默认</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="saveSku">保存</el-button>
            <el-button @click="quitAdd">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
    name: "AddSku",
    data() {
        return {
            skuInfo: {
                category3Id: 0,
                spuId: 0,
                tmId: 0,
                skuDesc: "",
                skuName: "",
                price: 0,
                weight: "",
                skuDefaultImg: "",
                skuAttrValueList: [
                    // {
                    //     attrId: 0,
                    //     attrName: "string",
                    //     id: 0,
                    //     skuId: 0,
                    //     valueId: 0,
                    //     valueName: "string",
                    // },
                ],
                skuImageList: [
                    // {
                    //     id: 0,
                    //     imgName: "string",
                    //     imgUrl: "string",
                    //     isDefault: "string",
                    //     skuId: 0,
                    //     spuImgId: 0,
                    // },
                ],
                skuSaleAttrValueList: [
                    // {
                    //     id: 0,
                    //     saleAttrId: 0,
                    //     saleAttrName: "string",
                    //     saleAttrValueId: 0,
                    //     saleAttrValueName: "string",
                    //     skuId: 0,
                    //     spuId: 0,
                    // },
                ],
            },
            spuSaleAttrList: [],
            spuImageList: [],
            attrInfoList: [],
            spu: {},
            imageList: [],
        };
    },
    methods: {
        // 添加sku，初始化页面
        async initSku(row, originId) {
            // 收集skuInfo数据
            this.skuInfo.category3Id = originId.category3Id;
            this.skuInfo.spuId = row.id;
            this.skuInfo.tmId = row.tmId;
            // 收集spu
            this.spu = row;
            // 获取销售属性列表
            let resultSaleAttr = await this.$API.spu.reqSpuSaleAttrList(row.id);
            if (resultSaleAttr.code == 200) {
                this.spuSaleAttrList = resultSaleAttr.data;
            }
            // 获取图片列表
            let resultImageList = await this.$API.spu.reqSpuImageList(row.id);
            if (resultImageList.code == 200) {
                let temp = resultImageList.data;
                temp.forEach((item) => {
                    item.isDefault = 0;
                });
                this.spuImageList = temp;
            }
            // 获取属性信息列表
            let resultAttrInfo = await this.$API.spu.reqAttrInfoList(
                originId.category1Id,
                originId.category2Id,
                originId.category3Id
            );
            if (resultAttrInfo.code == 200) {
                this.attrInfoList = resultAttrInfo.data;
            }
        },
        // 选择图片，收集数据
        selectImage(selectImage) {
            console.log(selectImage);
            this.imageList = selectImage;
        },
        // 图片列表设置默认
        setDefault(row) {
            this.spuImageList.forEach((item) => {
                item.isDefault = 0;
            });
            row.isDefault = 1;
            this.skuInfo.skuDefaultImg = row.imgUrl;
        },
        // 保存sku
        async saveSku() {
            const { attrInfoList, skuInfo, spuSaleAttrList, imageList } = this;
            // 整理平台属性参数
            skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
                if (item.attrIdAndValueId) {
                    const [attrId, valueId] = item.attrIdAndValueId.split(":");
                    prev.push({ attrId, valueId });
                }
                return prev;
            }, []);
            // 整理销售属性参数
            skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce(
                (prev, item) => {
                    if (item.saleAttrIdAndSaleValueId) {
                        const [saleAttrId, saleAttrValueId] =
                            item.saleAttrIdAndSaleValueId.split(":");
                        prev.push({ saleAttrId, saleAttrValueId });
                    }
                    return prev;
                },
                []
            );
            // 整理图片列表参数
            skuInfo.skuImageList = imageList.map((item) => {
                return {
                    imgName: item.imgName,
                    imgUrl: item.imgUrl,
                    isDefault: item.isDefault,
                    skuId: item.id,
                };
            });
            // 发请求
            let result = await this.$API.spu.reqSaveSkuInfo(skuInfo);
            if (result.code == 200) {
                this.$emit("changeScencs", 0);
                this.$message({ type: "success", message: "添加sku成功" });
                // 清空数据
                Object.assign(this._data, this.$options.data());
            }
        },
        // 取消添加sku
        quitAdd() {
            this.$emit("changeScencs", 0);
            Object.assign(this._data, this.$options.data());
        },
    },
};
</script>

<style>
</style>