import { endpointsTypes } from 'shared-types';
import { api } from '@/api/_api';
import { format } from 'date-fns';

interface Params {
  accountId?: endpointsTypes.GetBalanceHistoryPayload['accountId'];
  from?: Date;
  to?: Date;
}

export const getBalanceHistory = async (
  { from, to, ...rest }: Params = {},
) => {
  const params: endpointsTypes.GetBalanceHistoryPayload = {
    ...rest,
  };

  if (from) params.from = format(from, 'yyyy-MM-dd');
  if (to) params.to = format(to, 'yyyy-MM-dd');

  const history = await api.get('/stats/balance-history', params);

  return history;
};
