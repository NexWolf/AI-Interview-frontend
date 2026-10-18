import 'server-only';
import { AxiosServerAPI } from '@/shared/lib/AxiosServerAPI';
import type { ProfileApi } from '@/features/profile/types/profile.types';
import type { UserInfoApi } from '@repo/shared';
import type { AdminSkill } from '@/shared/types/allSkills';
import type { UserSkillItem } from '@/shared/types/userSkills';

// Server Components must forward the current request's cookies rather than
// attempting the browser-only /api/auth/token handshake.
export const accountServer = {
  async profile(): Promise<ProfileApi> {
    const response = await AxiosServerAPI.get('/api/v1/users/me');
    return response.data.data.user;
  },
  async user(): Promise<UserInfoApi> {
    const response = await AxiosServerAPI.get('/api/v1/users/me');
    return response.data.data.user;
  },
  async skills(): Promise<AdminSkill[]> {
    const response = await AxiosServerAPI.get('/api/v1/skills', { params: { limit: 500 } });
    return response.data.data;
  },
  async userSkills(): Promise<UserSkillItem[]> {
    const response = await AxiosServerAPI.get('/api/v1/users/me/skills');
    return response.data.data.skills;
  },
};
