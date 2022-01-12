import { useStore } from 'vuex';
import { authVuexTypes, namespace } from './types';

export const useAuthStore = (): {
  signIn:
    (payload: { password: string; username: string }) => Promise<void>
} => {
  const store = useStore();

  const signIn = async (payload) => {
    await store.dispatch(`${namespace}/${authVuexTypes.LOG_IN}`, payload);
  };

  return {
    signIn,
  };
};
