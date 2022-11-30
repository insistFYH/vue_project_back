import request from '@/utils/request'
// 获取sku列表
export const reqSkuList = (page, limit) => {
    return request({
        url: `/admin/product/list/${page}/${limit}`,
        method: 'get'
    })
}

// 上架
export const reqOnSale = (skuId) => {
    return request({
        url: `/admin/product/onSale/${skuId}`,
        method: 'get'
    })
}

// 下架
export const reqCancelSale = (skuId) => {
    return request({
        url: `/admin/product/cancelSale/${skuId}`,
        method: 'get'
    })
}

// 获取sku详细信息
export const reqSkuInfo = (skuId) => {
    return request({
        url: `/admin/product/getSkuById/${skuId}`,
        method: 'get'
    })
}