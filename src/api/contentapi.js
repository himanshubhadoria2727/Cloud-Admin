import { AuthClient } from "@/HOC/client"


export const allContent = () => {
    return AuthClient().get('/api/content/allContent')
}

export const deletedcontent = (id) => {
    return AuthClient().delete(`/api/content/${id}`)
}

export const singlecontent = (id) => {
    return AuthClient().get(`/api/content/editContent/${id}`)
}

export const editcontent = (id, data) => {
    return AuthClient().put(`/api/content/editContent/${id}`, data)
}