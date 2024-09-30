import Axios from "axios";
import APIConstants from "./constant";



class Client {
    axios = Axios;

    constructor() {
        this.axios.defaults.baseURL = APIConstants.base_url;
    }

    create = () => {

        return this.axios;
    };



    createWithAuth = () => {
        const auth_token = localStorage.getItem("auth_token");
        this.axios.defaults.headers.post["Content-Type"] = 'application/json';
        this.axios.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${auth_token}`;
        return this.axios;
    };
    createWithAuthForm = () => {
        const auth_token = localStorage.getItem("auth_token");
        this.axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
        this.axios.defaults.headers.common[
            "Authorization"
        ] = `Bearer ${auth_token}`;
        return this.axios;
    };
}


export default new Client().create();
export const AuthClient = new Client().createWithAuth;
export const AuthClientForm = new Client().createWithAuthForm;