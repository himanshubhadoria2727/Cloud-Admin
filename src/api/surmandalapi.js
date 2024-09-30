import { AuthClientForm } from "@/HOC/client";


export const addSurmandal = (data) => {

    return AuthClientForm().post('/api/surmandalRouter/add', data)
}
export const getSurmandal = () => {
    return AuthClientForm().get("/api/surmandalRouter/get")
}
export const delSurmandal = (id) => {
    return AuthClientForm().delete(`/api/surmandalRouter/del/${id}`)
}
export const addSurpeti = (data) => {

    return AuthClientForm().post('/api/surpetiRouter/add', data)
}