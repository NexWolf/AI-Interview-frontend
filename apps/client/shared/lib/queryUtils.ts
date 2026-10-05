import axios from "axios"

export const defaultAuthRetry = (failureCount : number, error : unknown) => {
    if(axios.isAxiosError(error) && error.response?.status === 401) {
        return false;
    }
    return failureCount < 2;
}