import { ref } from 'vue';
import { defineStore } from 'pinia';
import { loadUserData } from '@/api';
import * as types from '@/common/types';

export const useUserStore = defineStore('user', () => {
  const user = ref<types.UserRecord>(null);

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
