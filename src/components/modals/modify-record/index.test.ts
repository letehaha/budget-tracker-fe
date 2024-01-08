import { mount } from '@vue/test-utils';
import { router } from '@/routes';
import { createTestingPinia } from '@pinia/testing';
import { VueQueryPlugin } from '@tanstack/vue-query';
import * as dataMocks from '@tests/mocks';
import * as apiMethods from '@/api';
import { TRANSACTION_TYPES } from 'shared-types';
import FormComponent from './index.vue';

describe('transactions create/update/delete form', () => {
  beforeAll(() => {
    // jsdom doesn't implement this method so we're adding our own
    Element.prototype.scrollTo = () => {};
  });
  afterEach(() => {
    vi.resetAllMocks();
  });

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

  describe('transaction creation', () => {
    test.each([
      ['income transaction', 'button[aria-label="Select income"]', TRANSACTION_TYPES.income],
      ['expense transaction', 'button[aria-label="Select expense"]', TRANSACTION_TYPES.expense],
    ])('%s', async (_, formTypeSelector, expected) => {
      vi.spyOn(apiMethods, 'loadAccounts').mockReturnValue(Promise.resolve(dataMocks.ACCOUNTS));
      const createTxSpy = vi.spyOn(apiMethods, 'createTransaction');
      const AMOUNT = 10;

      const wrapper = mountComponent();

      await wrapper.find(formTypeSelector).trigger('click');

      const amountField = wrapper.find<HTMLInputElement>('input[placeholder="Amount"]');
      await amountField.setValue(AMOUNT);

      const accountField = wrapper.find('[title="Select account"]');
      await accountField.trigger('click');
      const desiredAccountBtn = wrapper.find('button[role="option"]');
      await desiredAccountBtn.trigger('click');

      const categoryField = wrapper.find('[title="Select category"]');
      await categoryField.trigger('click');
      let desiredCategoryBtn = wrapper.find('[data-test="category-select-field"] button[role="option"]');
      await desiredCategoryBtn.trigger('click');
      // Since that's how category selector works, we need to select it one more time
      desiredCategoryBtn = wrapper.find('[data-test="category-select-field"] button[role="option"]');
      await desiredCategoryBtn.trigger('click');

      const submitBtn = wrapper.find('[aria-label="Create transaction"]');
      await submitBtn.trigger('click');

      expect(createTxSpy).toHaveBeenCalledWith({
        amount: String(AMOUNT),
        note: null,
        time: expect.any(String),
        transactionType: expected,
        paymentType: expect.any(String),
        accountId: dataMocks.ACCOUNTS[0].id,
        categoryId: dataMocks.USER_CATEGORIES[0].id,
      });
    });
  });
});
