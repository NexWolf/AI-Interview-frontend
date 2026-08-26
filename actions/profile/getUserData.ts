import axios from "axios";
import { cookies } from "next/headers";

export async function getUserData() {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
        console.log(token)
        return;
    };

    try {
        const { AxiosServerAPI } = await import("@/lib/AxiosServer");

        const response = await AxiosServerAPI.get(`/api/v1/users/me/`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return {
            success : true,
            data : response.data,
        }

    } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
            return {
                success: false,
                message: e?.response?.data?.message || "Axios request failed",
                data : null,
            }
        }

        return {
            success: false,
            message : e
        }

    }

}