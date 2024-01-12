import { TRANSACTION_TRANSFER_NATURE, TRANSACTION_TYPES } from 'shared-types';
import { mount } from '@vue/test-utils';
import { router } from '@/routes';
import { createTestingPinia } from '@pinia/testing';
import { VueQueryPlugin } from '@tanstack/vue-query';
import * as dataMocks from '@tests/mocks';
import * as apiMethods from '@/api';
import { OUT_OF_WALLET_ACCOUNT_MOCK } from '@/common/const';
import FormComponent from './index.vue';

const mountComponent = ({ props = {} } = {}) => mount(FormComponent, {
  props,
  global: {
    plugins: [
      createTestingPinia({
        initialState: {
          user: { user: dataMocks.USER },
          currencies: {
            currencies: dataMocks.USER_CURRENCIES,
            systemCurrencies: dataMocks.SYSTEM_CURRENCIES,
            baseCurrency: dataMocks.USER_BASE_CURRENCY,
          },
          categories: {
            categories: dataMocks.USER_CATEGORIES,
          },
          accounts: {
            accountsRecord: dataMocks.ACCOUNTS.reduce((acc, curr) => {
              acc[curr.id] = curr;
              return acc;
            }, {}),
          },
        },
      }),
      VueQueryPlugin,
      router,
    ],
    directives: {
      'click-outside': () => {},
    },
  },
});

const amountFieldSelector = 'input[placeholder="Amount"]';
const targetAmountFieldSelector = 'input[placeholder="Target amount"]';
const fillAlmountField = async (wrapper: ReturnType<typeof mountComponent>, amount: number) => {
  const amountField = wrapper.find<HTMLInputElement>(amountFieldSelector);
  await amountField.setValue(amount);
};

const fillTargetAlmountField = async (
  wrapper: ReturnType<typeof mountComponent>,
  amount: number,
) => {
  const amountField = wrapper.find<HTMLInputElement>('input[placeholder="Target amount"]');
  await amountField.setValue(amount);
};

const findSelectField = (
  wrapper: ReturnType<typeof mountComponent>,
  label: string,
) => wrapper.findAll('[role="select"]').find(item => item.html().includes(label));

const fillAccountField = async (
  wrapper: ReturnType<typeof mountComponent>,
  label: string,
  value: string,
) => {
  const desiredSelectField = await findSelectField(wrapper, label);

  const triggerButton = desiredSelectField.find('button');
  await triggerButton.trigger('click');

  const desiredAccountBtn = wrapper.findAll('button[role="option"]').find(item => item.text().includes(value));
  await desiredAccountBtn.trigger('click');
};

const fillCategoryField = async (wrapper: ReturnType<typeof mountComponent>, categoryName) => {
  const categoryField = wrapper.find('[title="Select category"]');
  await categoryField.trigger('click');

  let desiredCategoryBtn = wrapper
    .findAll('[data-test="category-select-field"] button[role="option"]')
    .find(item => item.text().includes(categoryName));
  await desiredCategoryBtn.trigger('click');

  // Since that's how category selector works, we need to select it one more time
  desiredCategoryBtn = wrapper
    .findAll('[data-test="category-select-field"] button[role="option"]')
    .find(item => item.text().includes(categoryName));
  await desiredCategoryBtn.trigger('click');
};

const submitCreation = async (wrapper: ReturnType<typeof mountComponent>) => {
  const submitBtn = wrapper.find('[aria-label="Create transaction"]');
  await submitBtn.trigger('click');
};

const submitUpdation = async (wrapper: ReturnType<typeof mountComponent>) => {
  const submitBtn = wrapper.find('[aria-label="Edit transaction"]');
  await submitBtn.trigger('click');
};

const incomeFormTypeSelector = 'button[aria-label="Select income"]';
const expenseFormTypeSelector = 'button[aria-label="Select expense"]';
const transferFormTypeSelector = 'button[aria-label="Select transfer"]';

const commonAccountFieldLabel = 'Account';
const fromAccountFieldLabel = 'From account';
const toAccountFieldLabel = 'To account';

describe('transactions create/update/delete form', () => {
  beforeAll(() => {
    // jsdom doesn't implement this method so we're adding our own
    Element.prototype.scrollTo = () => {};
  });
  beforeEach(() => {
    vi.spyOn(apiMethods, 'loadAccounts').mockReturnValue(Promise.resolve(dataMocks.ACCOUNTS));
  });
  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('transaction creation', () => {
    let createTxSpy = vi.spyOn(apiMethods, 'createTransaction');

    beforeEach(() => {
      createTxSpy = vi.spyOn(apiMethods, 'createTransaction');
    });

    test.each([
      ['income transaction', incomeFormTypeSelector, TRANSACTION_TYPES.income],
      ['expense transaction', expenseFormTypeSelector, TRANSACTION_TYPES.expense],
    ])('%s', async (_, formTypeSelector, expected) => {
      const expectedValue = {
        amount: 10,
        account: dataMocks.ACCOUNTS[0],
        category: dataMocks.USER_CATEGORIES[0],
      };

      const wrapper = await mountComponent();

      await wrapper.find(formTypeSelector).trigger('click');

      await fillAlmountField(wrapper, expectedValue.amount);
      await fillAccountField(wrapper, commonAccountFieldLabel, expectedValue.account.name);
      await fillCategoryField(wrapper, expectedValue.category.name);

      await submitCreation(wrapper);

      expect(createTxSpy).toHaveBeenCalledWith({
        amount: String(expectedValue.amount),
        note: null,
        time: expect.any(String),
        transactionType: expected,
        paymentType: expect.any(String),
        accountId: expectedValue.account.id,
        categoryId: expectedValue.category.id,
      });
    });

    test('basic transfer', async () => {
      const expectedValue = {
        amount: 10,
        targetAmount: 20,
        account: dataMocks.ACCOUNTS[0],
        targetAccount: dataMocks.ACCOUNTS[1],
        category: dataMocks.USER_CATEGORIES[0],
      };

      const wrapper = await mountComponent();

      await wrapper.find(transferFormTypeSelector).trigger('click');

      await fillAlmountField(wrapper, expectedValue.amount);
      await fillTargetAlmountField(wrapper, expectedValue.targetAmount);

      await fillAccountField(wrapper, fromAccountFieldLabel, expectedValue.account.name);
      await fillAccountField(wrapper, toAccountFieldLabel, expectedValue.targetAccount.name);

      await submitCreation(wrapper);

      expect(createTxSpy).toHaveBeenCalledWith({
        amount: String(expectedValue.amount),
        destinationAmount: String(expectedValue.targetAmount),
        destinationAccountId: expectedValue.targetAccount.id,
        note: null,
        time: expect.any(String),
        transactionType: TRANSACTION_TYPES.expense,
        transferNature: TRANSACTION_TRANSFER_NATURE.common_transfer,
        paymentType: expect.any(String),
        accountId: expectedValue.account.id,
      });
    });

    test('transfer out of wallet', async () => {
      const expectedValue = {
        amount: 10,
        targetAmount: 20,
        account: dataMocks.ACCOUNTS[0],
        targetAccount: OUT_OF_WALLET_ACCOUNT_MOCK,
        category: dataMocks.USER_CATEGORIES[0],
      };

      const wrapper = await mountComponent();

      await wrapper.find(transferFormTypeSelector).trigger('click');

      await fillAccountField(wrapper, fromAccountFieldLabel, expectedValue.account.name);
      await fillAccountField(wrapper, toAccountFieldLabel, expectedValue.targetAccount.name);

      await fillAlmountField(wrapper, expectedValue.amount);

      await submitCreation(wrapper);

      expect(
        wrapper.find('input[placeholder="Target amount"]').attributes().disabled,
      ).not.toBe(undefined);

      expect(createTxSpy).toHaveBeenCalledWith({
        amount: String(expectedValue.amount),
        note: null,
        time: expect.any(String),
        transactionType: TRANSACTION_TYPES.expense,
        transferNature: TRANSACTION_TRANSFER_NATURE.transfer_out_wallet,
        paymentType: expect.any(String),
        accountId: expectedValue.account.id,
      });
    });
  });

  describe('transaction updation', () => {
    let editTxSpy = vi.spyOn(apiMethods, 'editTransaction');

    beforeEach(() => {
      editTxSpy = vi.spyOn(apiMethods, 'editTransaction');
    });

    test('expense -> income', async () => {
      const wrapper = await mountComponent({
        props: {
          transaction: dataMocks.EXPENSE_TRANSACTION,
        },
      });

      await wrapper.find(incomeFormTypeSelector).trigger('click');

      await submitUpdation(wrapper);

      expect(editTxSpy).toHaveBeenCalledWith({
        accountId: dataMocks.EXPENSE_TRANSACTION.accountId,
        amount: dataMocks.EXPENSE_TRANSACTION.amount,
        categoryId: dataMocks.EXPENSE_TRANSACTION.categoryId,
        note: null,
        paymentType: expect.any(String),
        time: expect.any(String),
        transactionType: TRANSACTION_TYPES.income,
        transferNature: TRANSACTION_TRANSFER_NATURE.not_transfer,
        txId: dataMocks.EXPENSE_TRANSACTION.id,
      });
    });

    test('income -> expense', async () => {
      const wrapper = await mountComponent({
        props: {
          transaction: dataMocks.INCOME_TRANSACTION,
        },
      });

      await wrapper.find(expenseFormTypeSelector).trigger('click');

      await submitUpdation(wrapper);

      expect(editTxSpy).toHaveBeenCalledWith({
        accountId: dataMocks.INCOME_TRANSACTION.accountId,
        amount: dataMocks.INCOME_TRANSACTION.amount,
        categoryId: dataMocks.INCOME_TRANSACTION.categoryId,
        note: null,
        paymentType: expect.any(String),
        time: expect.any(String),
        transactionType: TRANSACTION_TYPES.expense,
        transferNature: TRANSACTION_TRANSFER_NATURE.not_transfer,
        txId: dataMocks.INCOME_TRANSACTION.id,
      });
    });

    test('income -> expense + change amount and category', async () => {
      const expectedValue = {
        amount: 20,
        category: dataMocks.USER_CATEGORIES[1],
      };
      const wrapper = await mountComponent({
        props: {
          transaction: {
            ...dataMocks.INCOME_TRANSACTION,
            categoryId: dataMocks.USER_CATEGORIES[0].id,
          },
        },
      });

      await wrapper.find(expenseFormTypeSelector).trigger('click');

      await fillAlmountField(wrapper, expectedValue.amount);
      await fillCategoryField(wrapper, expectedValue.category.name);

      await submitUpdation(wrapper);

      expect(editTxSpy).toHaveBeenCalledWith({
        accountId: dataMocks.INCOME_TRANSACTION.accountId,
        amount: expectedValue.amount,
        categoryId: expectedValue.category.id,
        note: null,
        paymentType: expect.any(String),
        time: expect.any(String),
        transactionType: TRANSACTION_TYPES.expense,
        transferNature: TRANSACTION_TRANSFER_NATURE.not_transfer,
        txId: dataMocks.INCOME_TRANSACTION.id,
      });
    });

    test.each([
      [TRANSACTION_TYPES.expense, dataMocks.EXTERNAL_EXPENSE_TRANSACTION],
      [TRANSACTION_TYPES.income, dataMocks.EXTERNAL_INCOME_TRANSACTION],
    ])('external %s: modify fields', async (txType, mock) => {
      const expectedValue = {
        category: dataMocks.USER_CATEGORIES[1],
      };
      const wrapper = await mountComponent({
        props: {
          transaction: {
            ...mock,
            categoryId: dataMocks.USER_CATEGORIES[0].id,
          },
        },
      });

      const isExpense = txType === TRANSACTION_TYPES.expense;

      expect(
        await wrapper.find(isExpense ? expenseFormTypeSelector : incomeFormTypeSelector).attributes()['aria-selected'],
      ).not.toBe(undefined);
      expect(
        await wrapper.find(isExpense ? incomeFormTypeSelector : expenseFormTypeSelector).attributes().disabled,
      ).not.toBe(undefined);
      expect(
        await wrapper.find(amountFieldSelector).attributes().disabled,
      ).not.toBe(undefined);
      expect(
        await wrapper.find('input[type="datetime-local"]').attributes().disabled,
      ).not.toBe(undefined);

      expect(
        await findSelectField(wrapper, 'Account').attributes()['aria-disabled'],
      ).not.toBe(undefined);
      expect(
        await findSelectField(wrapper, 'Payment Type').attributes()['aria-disabled'],
      ).not.toBe(undefined);
      expect(
        await wrapper.find('textarea').attributes().disabled,
      ).toBe(undefined);

      await fillCategoryField(wrapper, expectedValue.category.name);
      await submitUpdation(wrapper);

      expect(editTxSpy).toHaveBeenCalledWith({
        categoryId: expectedValue.category.id,
        note: null,
        transferNature: TRANSACTION_TRANSFER_NATURE.not_transfer,
        txId: mock.id,
        paymentType: expect.any(String),
      });
    });

    test.each([
      [TRANSACTION_TYPES.income, dataMocks.INCOME_TRANSACTION],
      [TRANSACTION_TYPES.expense, dataMocks.EXPENSE_TRANSACTION],
    ])('%s -> transfer', async (txType, mock) => {
      const expectedValue = {
        amount: 95,
        account: dataMocks.ACCOUNTS[1],
        targetAccount: dataMocks.ACCOUNTS[2],
        targetAmount: 120,
      };
      const wrapper = await mountComponent({
        props: {
          transaction: mock,
        },
      });

      await wrapper.find(transferFormTypeSelector).trigger('click');

      const initialValue = await wrapper.find<HTMLInputElement>(
        txType === TRANSACTION_TYPES.income
          ? amountFieldSelector
          : targetAmountFieldSelector,
      ).element.value;
      expect(initialValue).toBe('');

      await wrapper.find(amountFieldSelector).setValue(expectedValue.amount);
      await fillAccountField(wrapper, fromAccountFieldLabel, expectedValue.account.name);

      await wrapper.find(targetAmountFieldSelector).setValue(expectedValue.targetAmount);
      await fillAccountField(wrapper, toAccountFieldLabel, expectedValue.targetAccount.name);

      await submitUpdation(wrapper);

      expect(editTxSpy).toHaveBeenCalledWith({
        accountId: expectedValue.account.id,
        amount: expectedValue.amount,

        destinationAccountId: expectedValue.targetAccount.id,
        destinationAmount: expectedValue.targetAmount,

        note: null,
        paymentType: expect.any(String),
        time: expect.any(String),
        transactionType: TRANSACTION_TYPES.expense,
        transferNature: TRANSACTION_TRANSFER_NATURE.common_transfer,
        txId: dataMocks.INCOME_TRANSACTION.id,
      });
    });

    test.todo('transfer -> income');
    test.todo('transfer -> expense');
    test.todo('external expense -> transfer');
    test.todo('external income -> transfer');
    test.todo('transfer -> external expense/income');
    test.todo('transfer data updation. check that opposite is correct');
  });

  describe('transaction deletion', () => {
    test.todo('delete expense');
    test.todo('delete income');
    test.todo('delete transfer');
    test.todo('not able to delete external transaction');
  });
});
