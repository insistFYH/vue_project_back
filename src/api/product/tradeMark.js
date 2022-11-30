import request from '@/utils/request'
//获取品牌信息列表
export const reqTradeMarkList = (page, limit) => {
        return request({
            url: `/admin/product/baseTrademark/${page}/${limit}`,
            method: 'get'
        })
    }
    //添加||修改品牌信息实现
export const reqAddAndUpdateTradeMark = (tradeMark) => {
        if (tradeMark.id) {
            console.log(tradeMark)
            return request({
                url: "/admin/product/baseTrademark/update",
                method: 'put',
                data: tradeMark
            })
        } else {
            return request({
                url: "/admin/product/baseTrademark/save",
                method: 'post',
                data: tradeMark
            })
        }
    }
    //删除品牌
export const reqDeleteTradeMark = (id) => {
    return request({
        url: `/admin/product/baseTrademark/remove/${id}`,
        method: 'delete'
    })
}