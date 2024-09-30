import client, { AuthClient, AuthClientForm } from "@/HOC/client"

export const addCategoryapi = (data) => {

    return AuthClientForm().post('/api/category/addCategory', data)

}
export const getCategoryapi = () => {
    return AuthClientForm().get('/api/category/getCategory')
}
export const addSubcategory = (data) => {
    return AuthClient().post('/api/subcategory/add_subCategory', data)
}
export const getSubcategory = () => {
    return AuthClient().get('/api/subcategory/get_subCategory')
}
export const delSubcategory = (id) => {
    return AuthClientForm().delete(`/api/subcategory/del_subCategory/${id}`)
}