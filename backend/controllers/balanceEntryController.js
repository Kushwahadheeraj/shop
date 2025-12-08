const BalanceEntry = require('../models/BalanceEntry');

// Get all balance entries grouped by person (phone number)
const getAllBalanceEntries = async (req, res) => {
  try {
    const sellerId = req.sellerId;
    if (!sellerId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { search, status } = req.query;
    const query = { sellerId };
    
    if (status) {
      query.status = status;
    }

    // Get all entries
    let entries = await BalanceEntry.find(query).sort({ entryDate: -1 });

    // If search is provided, filter by name or phone
    if (search) {
      entries = entries.filter(entry => 
        entry.name.toLowerCase().includes(search.toLowerCase()) ||
        entry.phone.includes(search)
      );
    }

    // Group entries by phone number (person)
    const personsMap = new Map();
    
    entries.forEach(entry => {
      const key = entry.phone;
      if (!personsMap.has(key)) {
        personsMap.set(key, {
          name: entry.name,
          phone: entry.phone,
          address: entry.address,
          entries: [],
          totalCredit: 0,
          totalPayment: 0,
          remainingBalance: 0
        });
      }
      
      const person = personsMap.get(key);
      person.entries.push(entry);
      
      // Skip entries with very small amounts (0.01) used for person creation
      if (entry.amount <= 0.01 && entry.description === 'Person added to system') {
        return; // Skip this entry in calculations
      }
      
      if (entry.entryType === 'credit') {
        person.totalCredit += entry.amount;
      } else if (entry.entryType === 'payment') {
        person.totalPayment += entry.amount;
      }
    });

    // Calculate remaining balance for each person
    const persons = Array.from(personsMap.values()).map(person => {
      person.remainingBalance = person.totalCredit - person.totalPayment;
      // Sort entries by date (newest first)
      person.entries.sort((a, b) => new Date(b.entryDate) - new Date(a.entryDate));
      return person;
    });

    // Sort persons by remaining balance (highest first)
    persons.sort((a, b) => b.remainingBalance - a.remainingBalance);

    res.json({
      success: true,
      data: {
        persons,
        totalPersons: persons.length,
        totalCredit: persons.reduce((sum, p) => sum + p.totalCredit, 0),
        totalPayment: persons.reduce((sum, p) => sum + p.totalPayment, 0),
        totalRemaining: persons.reduce((sum, p) => sum + p.remainingBalance, 0)
      }
    });
  } catch (error) {
    console.error('Error fetching balance entries:', error);
    res.status(500).json({ success: false, message: 'Error fetching balance entries' });
  }
};

// Create a new balance entry (credit or payment)
const createBalanceEntry = async (req, res) => {
  try {
    const sellerId = req.sellerId;
    if (!sellerId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { name, phone, address, entryType, amount, description, entryDate, paymentDate, notes } = req.body;

    if (!name || !phone || !entryType || !amount) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, phone, entryType, and amount are required' 
      });
    }

    if (entryType !== 'credit' && entryType !== 'payment') {
      return res.status(400).json({ 
        success: false, 
        message: 'entryType must be either "credit" or "payment"' 
      });
    }

    // Check if person exists, if yes, use their address
    const existingEntry = await BalanceEntry.findOne({ sellerId, phone }).sort({ createdAt: -1 });
    const finalAddress = address || (existingEntry ? existingEntry.address : '');

    const entry = new BalanceEntry({
      sellerId,
      name,
      phone,
      address: finalAddress,
      entryType,
      amount,
      description: description || '',
      entryDate: entryDate ? new Date(entryDate) : new Date(),
      paymentDate: paymentDate ? new Date(paymentDate) : (entryType === 'payment' ? new Date() : null),
      notes: notes || '',
      status: 'active'
    });

    await entry.save();

    // Check if balance is cleared and update status
    await updatePersonStatus(sellerId, phone);

    res.status(201).json({
      success: true,
      data: { entry }
    });
  } catch (error) {
    console.error('Error creating balance entry:', error);
    res.status(500).json({ success: false, message: 'Error creating balance entry' });
  }
};

// Update balance entry
const updateBalanceEntry = async (req, res) => {
  try {
    const sellerId = req.sellerId;
    const { id } = req.params;
    
    if (!sellerId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const updateData = { ...req.body };
    delete updateData.sellerId;

    // Convert date strings to Date objects if present
    if (updateData.entryDate) {
      updateData.entryDate = new Date(updateData.entryDate);
    }
    if (updateData.paymentDate) {
      updateData.paymentDate = new Date(updateData.paymentDate);
    }

    const entry = await BalanceEntry.findOneAndUpdate(
      { _id: id, sellerId },
      updateData,
      { new: true }
    );

    if (!entry) {
      return res.status(404).json({ success: false, message: 'Entry not found' });
    }

    // Update person status after modification
    await updatePersonStatus(sellerId, entry.phone);

    res.json({
      success: true,
      data: { entry }
    });
  } catch (error) {
    console.error('Error updating balance entry:', error);
    res.status(500).json({ success: false, message: 'Error updating balance entry' });
  }
};

// Delete balance entry
const deleteBalanceEntry = async (req, res) => {
  try {
    const sellerId = req.sellerId;
    const { id } = req.params;
    
    if (!sellerId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const entry = await BalanceEntry.findOne({ _id: id, sellerId });
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Entry not found' });
    }

    const phone = entry.phone;
    await BalanceEntry.findByIdAndDelete(id);

    // Update person status after deletion
    await updatePersonStatus(sellerId, phone);

    res.json({
      success: true,
      message: 'Entry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting balance entry:', error);
    res.status(500).json({ success: false, message: 'Error deleting balance entry' });
  }
};

// Delete all entries for a person (when all payment is done)
const deletePersonEntries = async (req, res) => {
  try {
    const sellerId = req.sellerId;
    const { phone } = req.params;
    
    if (!sellerId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const result = await BalanceEntry.deleteMany({ sellerId, phone });
    
    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} entries for this person`
    });
  } catch (error) {
    console.error('Error deleting person entries:', error);
    res.status(500).json({ success: false, message: 'Error deleting person entries' });
  }
};

// Helper function to update person status based on balance
const updatePersonStatus = async (sellerId, phone) => {
  try {
    const entries = await BalanceEntry.find({ sellerId, phone, status: 'active' });
    
    let totalCredit = 0;
    let totalPayment = 0;
    
    entries.forEach(entry => {
      if (entry.entryType === 'credit') {
        totalCredit += entry.amount;
      } else if (entry.entryType === 'payment') {
        totalPayment += entry.amount;
      }
    });
    
    const remainingBalance = totalCredit - totalPayment;
    
    // If balance is cleared (remaining <= 0), mark all entries as cleared
    if (remainingBalance <= 0) {
      await BalanceEntry.updateMany(
        { sellerId, phone, status: 'active' },
        { status: 'cleared' }
      );
    }
  } catch (error) {
    console.error('Error updating person status:', error);
  }
};

module.exports = {
  getAllBalanceEntries,
  createBalanceEntry,
  updateBalanceEntry,
  deleteBalanceEntry,
  deletePersonEntries
};

