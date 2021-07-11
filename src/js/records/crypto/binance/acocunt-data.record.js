// eslint-disable-next-line max-classes-per-file
export class BinanceBalanceRecord {
  constructor(record = {}) {
    this._record = record;

    this.asset = record.asset;
    this.free = record.free;
    this.locked = record.locked;
    this.price = record.usdPrice;
    this.precision = record.free.split('.')[1].length;
  }

  get total() {
    return (Number(this.free) + Number(this.locked)).toFixed(this.precision);
  }
}

export class BinanceAccountDataRecord {
  constructor(record = {}) {
    this._record = record;

    this.accountType = record.accountType;
    this.balances = record.balances
      ?.map(item => new BinanceBalanceRecord(item));
    this.buyerCommission = record.buyerCommission;
    this.canDeposit = record.canDeposit;
    this.canTrade = record.canTrade;
    this.canWithdraw = record.canWithdraw;
    this.makerCommission = record.makerCommission;
    this.permissions = record.permissions;
    this.sellerCommission = record.sellerCommission;
    this.takerCommission = record.takerCommission;
    this.updateTime = record.updateTime;
  }
}
