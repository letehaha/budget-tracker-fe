import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { UserModel } from 'shared-types';
import { loadUserData } from '@/api';

export const useUserStore = defineStore('user', () => {
  const user = ref<UserModel | null>(null);
  const isUserExists = computed(() => Boolean(user.value));

  const loadUser = async () => {
    try {
      const result = await loadUserData();

      user.value = result;
    } catch (e) {}
  };

  return {
    user,
    isUserExists,
    loadUser,
  };
});
