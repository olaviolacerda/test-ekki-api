/* eslint-disable func-names */
const createTransfer = async function (models, req, res) {
  await models.Transaction
    .registerTransaction(req.body)
    .then((transaction) => {
      console.log(transaction.getValues());
      models.Account.findOne({ where: { id: transaction.sourceAccountId } })
        .then((sourceAccount) => {
          models.Account.findOne({ where: { id: transaction.targetAccountId } })
            .then(async (targetAccount) => {
              const withdraw = sourceAccount.withdraw(transaction.amount);

              if (withdraw.status) targetAccount.deposit(transaction.amount);
              res.status(200).json(
                {
                  account: sourceAccount,
                  message: withdraw.message,
                },
              );
            });
        });
    }).catch(error => res.status(400).json(error));
};

module.exports = {
  createTransfer,
};
