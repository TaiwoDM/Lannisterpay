let SplitBreakdown;

class Transaction {
  constructor(ID, Amount, Currency, CustomerEmail, SplitInfo) {
    SplitBreakdown = [];

    this.ID = ID;
    this.Amount = Amount;
    this.Currency = Currency;
    this.CustomerEmail = CustomerEmail;
    this.SplitInfo = SplitInfo;
    this.Balance = Amount;

    this.TotalRatio = 0; //variable for total ratios
    this.SplitInfo.sort((a, b) =>
      a.SplitType == b.SplitType ? 0 : a.SplitType > b.SplitType ? 1 : -1
    ); //sorting by splittype in splitinfo array of objs
    this.index = 0;

    // getting sum of ind. ratio stored in TotalRatio with a loop
    this.SplitInfo.forEach((split) => {
      if (split.SplitType.toUpperCase() == "RATIO") {
        this.TotalRatio += split.SplitValue;
      }
    });
  }

  // function to update SplitBreakdown, Balance and Index
  updateSplitBreakDownBalanceAndIndex = (SplitEntityId, Amount) => {
    SplitBreakdown.push({ SplitEntityId, Amount });

    this.Balance = this.Balance - Amount;

    this.index += 1;
  };

  flatComputation = () => {
    if (
      this.SplitInfo[this.index] &&
      this.SplitInfo[this.index].SplitType.toUpperCase() == "FLAT"
    ) {
      const SplitEntityId = this.SplitInfo[this.index].SplitEntityId;
      const SVal = this.SplitInfo[this.index].SplitValue;
      const Amount = SVal;

      if (Amount >= 0 && Amount <= this.Balance) {
        this.updateSplitBreakDownBalanceAndIndex(SplitEntityId, Amount);

        return this.flatComputation();
      } else {
        SplitBreakdown.push({ SplitEntityId, Amount });
        this.index += 1;
        return;
      }
    }
  };

  percentageComputation = () => {
    if (
      // are there untreated elements in the splitinfo array?
      this.SplitInfo[this.index] &&
      this.SplitInfo[this.index].SplitType.toUpperCase() == "PERCENTAGE"
    ) {
      // dec variables to ease referencing
      const SplitEntityId = this.SplitInfo[this.index].SplitEntityId;
      const SVal = this.SplitInfo[this.index].SplitValue;
      const Amount = (SVal / 100) * this.Balance;

      if (Amount >= 0 && Amount <= this.Balance) {
        // is the amount greater than 0 and less than amount?
        this.updateSplitBreakDownBalanceAndIndex(SplitEntityId, Amount);

        return this.percentageComputation();
      } else {
        SplitBreakdown.push({ SplitEntityId, Amount });
        this.index += 1;
        return;
      }
    }
  };

  ratioComputation(balance) {
    if (
      this.SplitInfo[this.index] &&
      this.SplitInfo[this.index].SplitType.toUpperCase() == "RATIO"
    ) {
      const TR = this.TotalRatio;
      const SplitEntityId = this.SplitInfo[this.index].SplitEntityId;
      const SVal = this.SplitInfo[this.index].SplitValue;
      const Amount = (SVal / TR) * balance;

      if (Amount >= 0 && Amount <= this.Balance) {
        this.updateSplitBreakDownBalanceAndIndex(SplitEntityId, Amount);

        return this.ratioComputation(balance);
      } else {
        SplitBreakdown.push({ SplitEntityId, Amount });
        index += 1;
        return;
      }
    }
  }
}

export { Transaction, SplitBreakdown };
