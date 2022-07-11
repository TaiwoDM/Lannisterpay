import { Transaction, SplitBreakdown } from "./../models/Transaction.js";

const computeSplitPayment = (req, res, next) => {
  //   get fields from body
  const { ID, Amount, Currency, CustomerEmail, SplitInfo } = req.body;

  //   instantiate new obj
  const transaction = new Transaction(
    ID,
    Amount,
    Currency,
    CustomerEmail,
    SplitInfo
  );

  //send custom response for trxs containing < 1 split entity or > 20 entities
  if (SplitInfo.length > 20 || SplitInfo < 1) {
    return res.status(400).json({
      ID: transaction.ID,
      Balance: transaction.Balance,
      SplitBreakdown,
    });
  }

  //   compute flat split type splits
  transaction.flatComputation();

  // compute percentage split type splits
  transaction.percentageComputation();

  //   deep copy the balance just before ratio computations starts
  const arr = [transaction.Balance];
  const deepCopyBalance = [...arr];
  //   compute ratio split types
  transaction.ratioComputation(deepCopyBalance[0]);

  //   required response after computations
  res.status(200).json({
    ID: transaction.ID,
    Balance: transaction.Balance,
    SplitBreakdown,
  });
};

export default computeSplitPayment;
