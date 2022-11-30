<template>
    <div>
        <Cards></Cards>
        <Sale></Sale>
        <el-row :gutter="30">
            <el-col :span="12">
                <Search></Search>
            </el-col>
            <el-col :span="12">
                <Category></Category>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import Cards from "./cards";
import Sale from "./sale";
import Search from "./search";
import Category from "./category";
export default {
    name: "Dashboard",
    components: {
        Cards,
        Sale,
        Search,
        Category,
    },
};
</script>

<style  scoped>
</style>
