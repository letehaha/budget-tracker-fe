import { mount } from '@vue/test-utils';
import { router } from '@/routes';
import { createTestingPinia } from '@pinia/testing';
import { VueQueryPlugin } from '@tanstack/vue-query';
import * as dataMocks from '@tests/mocks';
import * as apiMethods from '@/api';
import { TRANSACTION_TYPES } from 'shared-types';
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

const fillAccountField = async (wrapper: ReturnType<typeof mountComponent>, value: string) => {
  const accountField = wrapper.find('[title="Select account"]');
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

describe('transactions create/update/delete form', () => {
  beforeAll(() => {
    // jsdom doesn't implement this method so we're adding our own
    Element.prototype.scrollTo = () => {};
  });
  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('transaction creation', () => {
    test.each([
      ['income transaction', 'button[aria-label="Select income"]', TRANSACTION_TYPES.income],
      ['expense transaction', 'button[aria-label="Select expense"]', TRANSACTION_TYPES.expense],
    ])('%s', async (_, formTypeSelector, expected) => {
      vi.spyOn(apiMethods, 'loadAccounts').mockReturnValue(Promise.resolve(dataMocks.ACCOUNTS));
      const createTxSpy = vi.spyOn(apiMethods, 'createTransaction');
      const expectedValue = {
        amount: 10,
        account: dataMocks.ACCOUNTS[0],
        category: dataMocks.USER_CATEGORIES[0],
      };

      const wrapper = mountComponent();

      await wrapper.find(formTypeSelector).trigger('click');

      await fillAlmountField(wrapper, expectedValue.amount);
      await fillAccountField(wrapper, expectedValue.account.name);
      await fillCategoryField(wrapper, expectedValue.category.name);

      const submitBtn = wrapper.find('[aria-label="Create transaction"]');
      await submitBtn.trigger('click');

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

    test.todo('basic transfer');
    test.todo('transfer out of wallet');
    test.todo('transfer with different currencies');
    test.todo('transfer with different currencies out of wallet');
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
