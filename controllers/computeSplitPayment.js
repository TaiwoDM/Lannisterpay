import Transaction from "./../models/Transaction.js";

const computeSplitPayment = (req, res, next) => {
  //   get fields from body
  const { ID, Amount, Currency, CustomerEmail, SplitInfo } = req.body;

  //send custom response for trxs containing < 1 split entity or > 20 entities
  if (SplitInfo.length > 20 || SplitInfo < 1) {
    return res.status(400).json({
      message:
        "The SplitInfo array can contain a minimum of 1 split entity and a maximum of 20 entities",
    });
  }

  try {
    //   instantiate new obj
    const transaction = new Transaction(
      ID,
      Amount,
      Currency,
      CustomerEmail,
      SplitInfo
    );

    const result = transaction.computeTransaction();

    //   required response after computations
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

export default computeSplitPayment;
