import { ref } from 'vue';
import { defineStore } from 'pinia';
import { UserModel } from 'shared-types';
import { loadUserData } from '@/api';

export const useUserStore = defineStore('user', () => {
  const user = ref<UserModel>(null);

  const loadUser = async () => {
    try {
      const result = await loadUserData();

      user.value = result;
    } catch (e) {}
  };

  return {
    user,
    loadUser,
  };
});
