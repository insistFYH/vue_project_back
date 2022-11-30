import request from '@/utils/request'
//获取一级分类列表
export const reqGetCategory1 = () => {
    return request({
        url: '/admin/product/getCategory1',
        method: 'get'
    })
}

//获取二级分类列表
export const reqGetCategory2 = (category1Id) => {
    return request({
        url: `/admin/product/getCategory2/${category1Id}`,
        method: 'get'
    })
}

//获取三及分类列表
export const reqGetCategory3 = (category2Id) => {
    return request({
        url: `/admin/product/getCategory3/${category2Id}`,
        method: 'get'
    })
}

//获取商品属性
export const reqGetCategoryAttr = (data) => {
    let { category1Id, category2Id, category3Id } = data
    return request({
        url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
        method: 'get',
    })
}

//添加或修改商品属性
export const reqAddOrUpdateAttr = (data) => {
    return request({
        url: '/admin/product/saveAttrInfo',
        method: 'post',
        data
    })
}