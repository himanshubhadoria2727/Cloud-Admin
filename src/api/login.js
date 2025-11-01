import client from "@/HOC/client"

export const login = (data) => {
    return client.post("/api/user/admin-login", data)
}