import client, { AuthClient } from "@/HOC/client"

export const subcriptionapi = () => {

    return AuthClient().get("/api/plan/getplan")
}
export const addsubcription = (data) => {
    console.log(data, "kshihgviehvi");
    return AuthClient().post('api/plan/addplan', data)
}
export const deletdsubcription = (id) => {
    return AuthClient().delete(`/api/plan/${id}`)
}