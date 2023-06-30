import { ref } from 'vue';
import { defineStore } from 'pinia';
import { api } from '@/api';
import { UserRecord } from '@/js/records';

export const useUserStore = defineStore('user', () => {
  const user = ref(null);

  const loadUser = async () => {
    try {
      const result = await api.get('/user');

      user.value = new UserRecord(result);
    } catch (e) {}
  };

  return {
    user,
    loadUser,
  };
});
