import { AuthClient } from "@/HOC/client"


export const userapi = (paidUsersChecked, freeUsersChecked) => {
    let params = {

    }
    if (paidUsersChecked) {
        params.paidUser = true
    }
    if (freeUsersChecked) {
        params.freeUser = true
    }
    return AuthClient().get("/api/userplan", { params })
}

export const deleteduserapi = (id) => {
    return AuthClient().delete(`/api/userplan/${id}`)
}