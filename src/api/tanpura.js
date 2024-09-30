import { AuthClientForm } from "@/HOC/client"
import APIConstants from "@/HOC/constant";



export const addTanpura = (data) => {
    console.log(data, "sjhweufhurgurgurw");
    const formdata = new FormData();
    formdata.append("pitch", data?.pitch);
    formdata.append("types", data?.types);
    formdata.append("file1", data?.file1?.originFileObj
    );
    formdata.append("file1", data.file2?.originFileObj
    );
    formdata.append("file1", data.file3?.originFileObj
    );
    formdata.append("file1", data.file4?.originFileObj
    );
    formdata.append("bpm", data?.bpm);

    const requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow"
    };

    return fetch(`${APIConstants?.base_url}/api/tanpura/add`, requestOptions)

        .then((result) => {
            return result.json()
        })
        .catch((error) => console.error(error));
}


export const getTanpura = () => {
    return AuthClientForm().get('/api/tanpura/get')
}
export const delTanpura = (id) => {
    return AuthClientForm().delete(`/api/tanpura/del/${id}`)
}