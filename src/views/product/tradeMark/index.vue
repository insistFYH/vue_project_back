<template>
    <div>
        <el-button type="primary" icon='el-icon-plus' style="margin:20px 0" @click="addTradeMark">添加</el-button>
        <!-- 表格显示品牌列表 -->
        <el-table style="width: 100%" border :data="tradeList">
            <el-table-column type="index" label="序号" width="80px" align="center">
            </el-table-column>
            <el-table-column prop="tmName" label="品牌名称" width="width">
            </el-table-column>
            <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
                <template slot-scope="{row,$index}">
                    <img :src="row.logoUrl" alt="" style="width:80px;height:60px">
                </template>
            </el-table-column>
            <el-table-column prop="prop" label="操作" width="width">
                <template slot-scope="{row,$index}">
                    <el-button type="warning" icon='el-icon-edit' size="mini" @click="updateTradeMark(row)">修改</el-button>
                    <el-button type="danger" icon='el-icon-delete' size='mini' @click="deleteTradeMark(row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination style="margin-top:20px;text-align:center" :current-page="page" :page-sizes="[3, 5, 8]" :page-size="limit" :pager-count="7" layout="prev, pager, next, jumper,->, sizes, total" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange">
        </el-pagination>
        <!-- 增加修改对话框 -->
        <el-dialog :title="!tmForm.id?'品牌添加':'品牌修改'" :visible.sync="dialogFormVisible">
            <el-form :model="tmForm" :rules="rules" ref="tmForm">
                <el-form-item label="品牌名称" :label-width="formLabelWidth" prop="tmName">
                    <el-input size="mini" v-model="tmForm.tmName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="品牌LOGO" :label-width="formLabelWidth" prop="logoUrl">
                    <el-upload class="avatar-uploader" action="/dev-api/admin/product/fileUpload" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addAndUpdateTradeMark">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "TradeMark",
    data() {
        return {
            page: 1,
            limit: 3,
            total: 10,
            tradeList: [],
            // 对话框设置
            dialogFormVisible: false,
            formLabelWidth: "120px",
            tmForm: {
                id: "",
                tmName: "",
                logoUrl: "",
            },
            // 表单验证
            rules: {
                tmName: [
                    {
                        required: true,
                        message: "请输入品牌名称",
                        trigger: "blur",
                    },
                    {
                        min: 2,
                        max: 10,
                        message: "长度在 2 到 10 个字符",
                        trigger: "blur",
                    },
                ],
                logoUrl: [
                    {
                        required: true,
                        message: "请上传品牌LOGO",
                        trigger: "change",
                    },
                ],
            },
        };
    },
    mounted() {
        this.getData();
    },
    methods: {
        //获取品牌列表
        async getData() {
            const { page, limit } = this;
            let result = await this.$API.tradeMark.reqTradeMarkList(
                page,
                limit
            );
            // console.log(111, result);
            if (result.code == 200) {
                (this.total = result.data.total),
                    (this.tradeList = result.data.records);
                //若当前页没有数据，返回上一页
                if (this.tradeList.length < 1) {
                    this.page -= 1;
                    // console.log(this.page);
                    this.getData();
                }
            }
        },
        // 修改当前页
        handleCurrentChange(page) {
            this.page = page;
            this.getData();
        },
        // 修改页面显示条数
        handleSizeChange(limit) {
            this.limit = limit;
            this.getData();
        },
        // 添加品牌信息
        addTradeMark() {
            this.dialogFormVisible = true;
            this.tmForm = { id: "", tmName: "", logoUrl: "" };
        },
        //修改品牌信息
        updateTradeMark(row) {
            this.dialogFormVisible = true;
            this.tmForm = { ...row };
        },
        // upload图片上传成功后
        handleAvatarSuccess(res, file) {
            // this.imageUrl = URL.createObjectURL(file.raw);
            // console.log(res.data);
            this.tmForm.logoUrl = res.data;
        },
        //upload上传之前检查
        beforeAvatarUpload(file) {
            const isJPG = file.type === "image/jpeg";
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error("上传头像图片只能是 JPG 格式!");
            }
            if (!isLt2M) {
                this.$message.error("上传头像图片大小不能超过 2MB!");
            }
            return isJPG && isLt2M;
        },

        //添加||修改品牌信息实现
        addAndUpdateTradeMark() {
            //表单验证
            this.$refs.tmForm.validate(async (valid) => {
                if (valid) {
                    let tradeMark = this.tmForm;
                    let result =
                        await this.$API.tradeMark.reqAddAndUpdateTradeMark(
                            tradeMark
                        );
                    // console.log(result);
                    // 关闭对话框
                    this.dialogFormVisible = false;
                    if (result.code == 200) {
                        if (!this.tmForm.id) {
                            this.$message({
                                message: "品牌添加成功",
                                type: "success",
                            });
                        } else {
                            this.$message({
                                message: "品牌修改成功",
                                type: "success",
                            });
                        }
                        this.getData();
                    }
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        //删除品牌
        async deleteTradeMark(id) {
            let result = await this.$API.tradeMark.reqDeleteTradeMark(id);
            // console.log("@@@", result);
            if (result.code == 200) {
                this.dialogFormVisible = false;
                this.$message({
                    message: "品牌删除成功",
                    type: "success",
                });
                this.getData();
            }
        },
    },
};
</script>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>