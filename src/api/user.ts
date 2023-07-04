import { api } from '@/api'
import * as types from '@/common/types'

export const loadUserData = async (): Promise<types.UserRecord> => {
  let result = await api.get('/user');

  return result;
}
