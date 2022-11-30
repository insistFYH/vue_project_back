import request from '@/utils/request'
//获取spu列表
export const reqGetSpu = (page, limit, category3Id) => {
    return request({
        url: `/admin/product/${page}/${limit}`,
        method: 'GET',
        params: { category3Id }
    })
}

//获取单个spu
export const reqGetSpuById = (spuId) => {
    return request({
        url: `/admin/product/getSpuById/${spuId}`,
        method: 'get'
    })
}

//获取spu图片列表
export const reqGetSpuImageList = (spuId) => {
    return request({
        url: `/admin/product/spuImageList/${spuId}`,
        method: 'get'
    })
}

// 获取销售属性列表
export const reqSaleAttrList = () => {
    return request({
        url: `/admin/product/baseSaleAttrList`,
        method: 'get'
    })
}

// 获取品牌列表
export const reqGetTrademarkList = () => {
    return request({
        url: '/admin/product/baseTrademark/getTrademarkList',
        method: 'get'
    })
}

// 保存添加|修改属性
export const reqSaveSpuInfo = (data) => {
    if (data.id) {
        return request({
            url: '/admin/product/updateSpuInfo',
            method: 'post',
            data
        })
    } else {
        return request({
            url: '/admin/product/saveSpuInfo',
            method: 'post',
            data
        })
    }
}

// 删除spu
export const reqDeleteSpu = (spuId) => request({ url: `/admin/product/deleteSpu/${spuId}`, method: 'delete' })

// 获取销售属性列表
export const reqSpuSaleAttrList = (spuId) => {
    return request({
        url: `/admin/product/spuSaleAttrList/${spuId}`,
        method: 'get'
    })
}

// 获取图片列表
export const reqSpuImageList = (spuId) => {
    return request({
        url: `/admin/product/spuImageList/${spuId}`,
        method: 'get'
    })
}

// 获取属性信息列表
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => {
    return request({
        url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
        method: 'get'
    })
}

// 保存添加sku
export const reqSaveSkuInfo = (data) => {
    return request({
        url: '/admin/product/saveSkuInfo',
        method: 'post',
        data
    })
}

// 获取spu的sku列表
export const reqSkuById = (spuId) => {
    return request({
        url: `/admin/product/findBySpuId/${spuId}`,
        method: 'get'
    })
}