<template>
    <el-card>
        <div slot="header" class="header">
            <span>线上热门搜索</span>
            <el-dropdown>
                <span class="el-dropdown-link">
                    <i class="el-icon-more el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>黄金糕</el-dropdown-item>
                    <el-dropdown-item>狮子头</el-dropdown-item>
                    <el-dropdown-item>螺蛳粉</el-dropdown-item>
                    <el-dropdown-item>双皮奶</el-dropdown-item>
                    <el-dropdown-item>蚵仔煎</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <div class="content">
            <el-row :gutter="10">
                <el-col :span="12">
                    <SearchChart></SearchChart>
                </el-col>
                <el-col :span="12">
                    <SearchChart></SearchChart>
                </el-col>
            </el-row>
        </div>
        <div class="footer">
            <el-table :data="tableData" style="width: 100%" border>
                <el-table-column label="排名" width="80">
                </el-table-column>
                <el-table-column label="搜索关键字">
                </el-table-column>
                <el-table-column label="用户数" sortable width="180">
                </el-table-column>
                <el-table-column label="周涨幅" sortable width="180">
                </el-table-column>
            </el-table>
            <!--  @size-change="handleSizeChange"
                @current-change="handleCurrentChange" -->
            <el-pagination :current-page="7" :page-size="3" layout="prev, pager, next" :total="300" class="pagination">
            </el-pagination>
        </div>
    </el-card>
</template>

<script>
import SearchChart from "./searchChart";
export default {
    name: "Search",
    components: {
        SearchChart,
    },
    data() {
        return {
            tableData: [],
        };
    },
};
</script>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
    border-bottom: 1px solid #eee;
}
.pagination {
    float: right;
}
</style>