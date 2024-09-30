const APIConstants = {
    base_url: process.env.NEXT_PUBLIC_REST_API_ENDPOINT,
    // base_url: "http://digimonktech.com:1973",
};

export default APIConstants;
export const linkbase = `${APIConstants.base_url}/media`