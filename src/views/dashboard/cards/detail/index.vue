<template>
    <div>
        <el-card>
            <div class="header">
                <span>{{title}}</span>
                <svg t="1665387384967" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2962" width="16" height="16">
                    <path d="M536 480v192a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16V480a16 16 0 0 1 16-16h16a16 16 0 0 1 16 16z m-32-128h16a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16v-32a16 16 0 0 1 16-16z m8 448c159.056 0 288-128.944 288-288s-128.944-288-288-288-288 128.944-288 288 128.944 288 288 288z m0 48c-185.568 0-336-150.432-336-336s150.432-336 336-336 336 150.432 336 336-150.432 336-336 336z" p-id="2963"></path>
                </svg>
            </div>
            <div class="content">{{number}}</div>
            <div class="echart">
                <slot name="echart"></slot>
            </div>
            <div class="footer">
                <slot name="footer"></slot>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    name: "Detail",
    props: ["title", "number"],
};
</script>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    color: rgb(217, 217, 217);
}
.content {
    font-size: 30px;
    margin: 10px 0;
}
.echart {
    width: 100%;
    height: 50px;
}
.footer {
    padding-top: 10px;
    border-top: 1px solid #eee;
}
</style>