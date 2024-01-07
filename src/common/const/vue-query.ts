// This query might be added to other queries so that on transcation create/edit
// we can call for invalidating all the queries that include that particular one
const TX_CHANGE_QUERY = 'global-query-tx-change';

export const VUE_QUERY_CACHE_KEYS = Object.freeze({
  // widget balance trend
  widgetBalanceTrend: [TX_CHANGE_QUERY, 'widget-balance-trend'],
  widgetBalanceTotalBalance: [TX_CHANGE_QUERY, 'widget-balance-total-balance'],
  widgetBalancePreviousBalance: [TX_CHANGE_QUERY, 'widget-balance-previous-balance'],

  // widget expenses structure
  widgetExpensesStructureTotal: [TX_CHANGE_QUERY, 'widget-expenses-structure-total'],
  widgetExpensesStructureCurrentAmount: [TX_CHANGE_QUERY, 'widget-expenses-structure-current-amount'],
  widgetExpensesStructurePrevAmount: [TX_CHANGE_QUERY, 'widget-expenses-structure-prev-amount'],

  // widget latest records
  widgetLatestRecords: [TX_CHANGE_QUERY, 'widget-latest-records'],

  // others
  analyticsBalanceHistoryTrend: [TX_CHANGE_QUERY, 'analytics-balance-history-trend'],

  recordsPageRecordsList: [TX_CHANGE_QUERY, 'records-page-records-list'],

  recordsPageTransactionList: [TX_CHANGE_QUERY, 'records-page'],

  accountSpecificTransactions: ['account-transactions'],

  allAccounts: [TX_CHANGE_QUERY, 'all-accounts'],
});

export {
  TX_CHANGE_QUERY as VUE_QUERY_TX_CHANGE_QUERY,
};
