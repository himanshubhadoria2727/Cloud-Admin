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

export const getUser = (page = 1, pageSize = 5, search='') => {
    return AuthClient().get('/api/user/getUser', {
      params: { page, pageSize,search }, // Pass page and pageSize as query parameters
    });
  };
  
export const deleteduserapi = (id) => {
    return AuthClient().delete(`/api/userplan/${id}`)
}