const Client = require('../models/Client');

// Create client
const createClient = async (req, res) => {
  try {
    const sellerId = req.sellerId;
    if (!sellerId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const client = new Client({ ...req.body, sellerId });
    await client.save();
    res.status(201).json({ success: true, data: { client } });
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ success: false, message: 'Error creating client' });
  }
};

// List clients (optionally by shopId, search)
const listClients = async (req, res) => {
  try {
    const sellerId = req.sellerId;
    const { shopId, search } = req.query;
    if (!sellerId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const query = { sellerId };
    if (shopId) query.shopId = shopId;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { gstin: { $regex: search, $options: 'i' } }
      ];
    }

    const clients = await Client.find(query).sort({ name: 1 });
    res.json({ success: true, data: { clients } });
  } catch (error) {
    console.error('Error listing clients:', error);
    res.status(500).json({ success: false, message: 'Error listing clients' });
  }
};

// Get client by id
const getClient = async (req, res) => {
  try {
    const sellerId = req.sellerId;
    const { id } = req.params;
    if (!sellerId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const client = await Client.findOne({ _id: id, sellerId });
    if (!client) return res.status(404).json({ success: false, message: 'Client not found' });
    res.json({ success: true, data: { client } });
  } catch (error) {
    console.error('Error getting client:', error);
    res.status(500).json({ success: false, message: 'Error getting client' });
  }
};

// Update client
const updateClient = async (req, res) => {
  try {
    const sellerId = req.sellerId;
    const { id } = req.params;
    if (!sellerId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const updateData = { ...req.body };
    delete updateData.sellerId;

    const client = await Client.findOneAndUpdate(
      { _id: id, sellerId },
      updateData,
      { new: true }
    );
    if (!client) return res.status(404).json({ success: false, message: 'Client not found' });
    res.json({ success: true, data: { client } });
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ success: false, message: 'Error updating client' });
  }
};

// Delete client
const deleteClient = async (req, res) => {
  try {
    const sellerId = req.sellerId;
    const { id } = req.params;
    if (!sellerId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const client = await Client.findOneAndDelete({ _id: id, sellerId });
    if (!client) return res.status(404).json({ success: false, message: 'Client not found' });
    res.json({ success: true, message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ success: false, message: 'Error deleting client' });
  }
};

module.exports = {
  createClient,
  listClients,
  getClient,
  updateClient,
  deleteClient
};


