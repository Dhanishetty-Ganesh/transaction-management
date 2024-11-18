const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

// POST /api/transactions/ - Create a new transaction
router.post("/transactions", async (req, res) => {
  const { amount, transaction_type, user } = req.body;

  try {
    const newTransaction = new Transaction({
      amount,
      transaction_type,
      user,
      status: "PENDING", // Default status is PENDING
    });

    await newTransaction.save();

    res.status(201).json({
      transaction_id: newTransaction._id,
      amount: newTransaction.amount,
      transaction_type: newTransaction.transaction_type,
      status: newTransaction.status,
      user: newTransaction.user,
      timestamp: newTransaction.timestamp,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating transaction" });
  }
});


// GET /api/transactions/ - Get all transactions for a user
router.get("/transactions", async (req, res) => {
  const { user_id } = req.query;

  try {
    const transactions = await Transaction.find({ user: user_id });
    res.status(200).json({
      transactions: transactions.map(transaction => ({
        transaction_id: transaction._id,
        amount: transaction.amount,
        transaction_type: transaction.transaction_type,
        status: transaction.status,
        timestamp: transaction.timestamp,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching transactions" });
  }
});

// PUT /api/transactions/:id - Update the status of a transaction
router.put("/transactions/:id", async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  if (!["COMPLETED", "FAILED"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({
      transaction_id: updatedTransaction._id,
      amount: updatedTransaction.amount,
      transaction_type: updatedTransaction.transaction_type,
      status: updatedTransaction.status,
      timestamp: updatedTransaction.timestamp,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating transaction" });
  }
});

// GET /api/transactions/:id - Get details of a specific transaction
router.get("/transactions/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({
      transaction_id: transaction._id,
      amount: transaction.amount,
      transaction_type: transaction.transaction_type,
      status: transaction.status,
      timestamp: transaction.timestamp,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching transaction" });
  }
});

module.exports = router;
