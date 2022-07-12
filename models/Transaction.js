class Transaction {
  constructor(ID, Amount, Currency, CustomerEmail, SplitInfo) {
    this.SplitBreakdown = [];
    this.ID = ID;
    this.Amount = Amount;
    this.Currency = Currency;
    this.CustomerEmail = CustomerEmail;
    this.SplitInfo = SplitInfo;
    this.Balance = Amount;

    this.TotalRatio = 0; //variable for total ratios
    this.sortedSplit = this.SplitInfo.sort((a, b) =>
      a.SplitType == b.SplitType ? 0 : a.SplitType > b.SplitType ? 1 : -1
    ); //sorting by splittype in splitinfo array of objs
    this.InitialRatioBal = Amount;

    // getting sum of ind. ratio stored in TotalRatio with a loop
    this.SplitInfo.forEach((split) => {
      if (split.SplitType.toUpperCase() == "RATIO") {
        this.TotalRatio += split.SplitValue;
      }
    });
  }

  computeTransaction = () => {
    this.sortedSplit.forEach((el) => {
      if (this.Balance >= 0) {
        if (el.SplitType == "FLAT") {
          this.flatComputation(el);
        } else if (el.SplitType == "PERCENTAGE") {
          this.percentageComputation(el);
        } else {
          this.ratioComputation(el);
        }
      } else throw new Error("The final Balance value cannot be lesser than 0");
    });

    return {
      ID: this.ID,
      Amount: this.Balance,
      SplitBreakdown: this.SplitBreakdown,
    };
  };

  flatComputation = (data) => {
    const Amount = data.SplitValue;

    if (Amount <= this.Balance && Amount >= 0) {
      this.Balance -= Amount;

      this.InitialRatioBal -= Amount;

      this.SplitBreakdown.push({
        SplitEntityId: data.SplitEntityId,
        Amount,
      });
    } else
      throw new Error(
        "The split Amount value computed for each entity cannot be greater than the transaction Amountand the split Amount value computed for each entity cannot be lesser than 0"
      );
  };

  percentageComputation = (data) => {
    const Amount = (data.SplitValue / 100) * this.Balance;

    if (Amount <= this.Balance && Amount >= 0) {
      this.Balance -= Amount;

      this.InitialRatioBal -= Amount;

      this.SplitBreakdown.push({
        SplitEntityId: data.SplitEntityId,
        Amount,
      });
    } else
      throw new Error(
        "The split Amount value computed for each entity cannot be greater than the transaction Amountand the split Amount value computed for each entity cannot be lesser than 0"
      );
  };

  ratioComputation = (data) => {
    const Amount = (data.SplitValue / this.TotalRatio) * this.InitialRatioBal;

    if (Amount <= this.Balance && Amount >= 0) {
      this.Balance -= Amount;

      this.SplitBreakdown.push({
        SplitEntityId: data.SplitEntityId,
        Amount,
      });
    } else
      throw new Error(
        "The split Amount value computed for each entity cannot be greater than the transaction Amountand the split Amount value computed for each entity cannot be lesser than 0"
      );
  };
}

export default Transaction;
