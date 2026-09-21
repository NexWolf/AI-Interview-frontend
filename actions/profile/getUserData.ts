import { API_URL } from "@/constants/routes";
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
        const { AxiosServerAPI } = await import("@/shared/lib/AxiosServerAPI");

        const response = await AxiosServerAPI.get(`${API_URL}/api/v1/users/me/`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return {
            success: true,
            data: response.data,
        }

    } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
            const backendMessage = e.response?.data?.message || e?.response?.data?.detail;
            const statusCode = e?.response?.status;
            return {
                success: false,
                message: backendMessage || e.message || "Axios Request failed",
                data: null,
                status: statusCode
            }
        }

        return {
            success: false,
            message: e instanceof Error ? e.message : "An unexpected error occurred",
            data: null,
        }

    }

}


// import axios from "axios";
// import { cookies } from "next/headers";
// import { AxiosServerAPI } from "@/lib/AxiosServerAPI";

// interface ErrorResponse {
//     message?: string;
//     detail?: string;
// }

// interface UserData {
//     id: string;
//     email: string;
//     // ... باقي حقول اليوزر عندك
//     [key: string]: unknown;
// }

// type GetUserDataResult =
//     | { success: true; data: UserData; message?: undefined; status?: undefined }
//     | { success: false; data: null; message: string; status?: number };

// export async function getUserData(): Promise<GetUserDataResult> {
//     const cookieStore = await cookies();
//     const token = cookieStore.get("accessToken")?.value;

//     if (!token) {
//         return {
//             success: false,
//             message: "No access token found",
//             data: null,
//         };
//     }

//     try {
//         const response = await AxiosServerAPI.get(`/api/v1/users/me/`, {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         });

//         return {
//             success: true,
//             data: response.data,
//         };
//     } catch (e: unknown) {
//         if (axios.isAxiosError<ErrorResponse>(e)) {
//             const backendMessage = e.response?.data?.message || e.response?.data?.detail;
//             const statusCode = e.response?.status;

//             return {
//                 success: false,
//                 message: backendMessage || e.message || "Axios Request failed",
//                 data: null,
//                 status: statusCode,
//             };
//         }

//         return {
//             success: false,
//             message: e instanceof Error ? e.message : "An unexpected error occurred",
//             data: null,
//         };
//     }
// }