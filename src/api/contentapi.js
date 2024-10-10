import { AuthClient } from "@/HOC/client"


export const allContent = () => {
    return AuthClient().get('/api/content/allContent')
}

export const deletedcontent = (id) => {
    return AuthClient().delete(`/api/content/${id}`)
}

export const addContent = (data) => {
    return AuthClient().post('/api/content/addContent', data); // Use the appropriate endpoint
};

export const singlecontent = (id) => {
    return AuthClient().get(`/api/content/editContent/${id}`)
}

export const editcontent = (id, data) => {
    return AuthClient().put(`/api/content/editContent/${id}`, data)
}