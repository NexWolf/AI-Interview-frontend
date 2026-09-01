import { AxiosAPI } from "../../../shared/lib/AxiosAPI"

export const onboardingService = {
    create: (data: FormData) => {
        return AxiosAPI.post('/api/v1/users/me/setup-profile', data)
    }
}