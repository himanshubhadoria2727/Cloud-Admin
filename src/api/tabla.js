import { AuthClientForm } from "@/HOC/client"



export const getTabla = () => {
    return AuthClientForm().get("/api/tabla/get")
}
export const delTabla = (id) => {
    return AuthClientForm().delete(`/api/tabla/del/${id}`)
}
export const addTabla = (data) => {
    console.log(data, "hshshshshh");
    return AuthClientForm().post('/api/tabla/add', data)
}