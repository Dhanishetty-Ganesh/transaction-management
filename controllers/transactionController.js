const Transaction = require("../models/Transaction");

// Create a new transaction
const createTransaction = async (req, res) => {
  try {
    const { amount, transaction_type, user } = req.body;
    const transaction = await Transaction.create({ amount, transaction_type, user });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: "Transaction creation failed" });
  }
};

// Get all transactions for a user
const getTransactions = async (req, res) => {
  try {
    const { user_id } = req.query;
    const transactions = await Transaction.find({ user: user_id });
    res.status(200).json({ transactions });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve transactions" });
  }
};

// Update a transaction status
const updateTransactionStatus = async (req, res) => {
  try {
    const { transaction_id } = req.params;
    const { status } = req.body;
    if (!["COMPLETED", "FAILED"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }
    const transaction = await Transaction.findByIdAndUpdate(
      transaction_id,
      { status },
      { new: true }
    );
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ error: "Failed to update transaction status" });
  }
};

// Get details of a specific transaction
const getTransactionById = async (req, res) => {
  try {
    const { transaction_id } = req.params;
    const transaction = await Transaction.findById(transaction_id);
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve transaction details" });
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  updateTransactionStatus,
  getTransactionById,
};
