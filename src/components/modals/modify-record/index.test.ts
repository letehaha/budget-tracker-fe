import { TRANSACTION_TRANSFER_NATURE, TRANSACTION_TYPES } from 'shared-types';
import { mount } from '@vue/test-utils';
import { router } from '@/routes';
import { createTestingPinia } from '@pinia/testing';
import { VueQueryPlugin } from '@tanstack/vue-query';
import * as dataMocks from '@tests/mocks';
import * as apiMethods from '@/api';
import { OUT_OF_WALLET_ACCOUNT_MOCK } from '@/common/const';
import FormComponent from './index.vue';

const mountComponent = () => mount(FormComponent, {
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

const fillAlmountField = async (wrapper: ReturnType<typeof mountComponent>, amount: number) => {
  const amountField = wrapper.find<HTMLInputElement>('input[placeholder="Amount"]');
  await amountField.setValue(amount);
};

const fillTargetAlmountField = async (
  wrapper: ReturnType<typeof mountComponent>,
  amount: number,
) => {
  const amountField = wrapper.find<HTMLInputElement>('input[placeholder="Target amount"]');
  await amountField.setValue(amount);
};

const fillAccountField = async (
  wrapper: ReturnType<typeof mountComponent>,
  label: string,
  value: string,
) => {
  const desiredSelectField = wrapper
    .findAll('[role="select"]')
    .find(item => item.html().includes(label));

  const accountField = desiredSelectField.find('[title="Select account"]');
  await accountField.trigger('click');

  const desiredAccountBtn = wrapper.findAll('button[role="option"]').find(item => item.text().includes(value));
  await desiredAccountBtn.trigger('click');
};

const fillCategoryField = async (wrapper: ReturnType<typeof mountComponent>, value) => {
  const categoryField = wrapper.find('[title="Select category"]');
  await categoryField.trigger('click');

  let desiredCategoryBtn = wrapper
    .findAll('[data-test="category-select-field"] button[role="option"]')
    .find(item => item.text().includes(value));
  await desiredCategoryBtn.trigger('click');

  // Since that's how category selector works, we need to select it one more time
  desiredCategoryBtn = wrapper
    .findAll('[data-test="category-select-field"] button[role="option"]')
    .find(item => item.text().includes(value));
  await desiredCategoryBtn.trigger('click');
};

const submitForm = async (wrapper: ReturnType<typeof mountComponent>) => {
  const submitBtn = wrapper.find('[aria-label="Create transaction"]');
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

      await submitForm(wrapper);

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

      await submitForm(wrapper);

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

      await submitForm(wrapper);

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
    test.todo('expense -> income');
    test.todo('income -> expense');
    test.todo('different amount, date, category');
    test.todo('external transaction (check payload, check fields are disabled)');
    test.todo('income -> transfer');
    test.todo('expense -> transfer');
    test.todo('transfer -> income');
    test.todo('transfer -> expense');
    test.todo('transfer -> external expense/income');
  });

  describe('transaction deletion', () => {
    test.todo('delete expense');
    test.todo('delete income');
    test.todo('delete transfer');
    test.todo('not able to delete external transaction');
  });
});
