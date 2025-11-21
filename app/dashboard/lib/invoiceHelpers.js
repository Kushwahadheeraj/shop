/**
 * Helper functions for invoice operations
 * Extracted from backend/controllers/invoiceController.js
 */

export const sanitizeItems = (items = []) =>
  (Array.isArray(items) ? items : [])
    .filter((item) => item?.name)
    .map((item) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      return {
        name: item.name,
        quantity,
        unit: item.unit || 'pc',
        unitPrice,
        amount: item.amount ? Number(item.amount) : quantity * unitPrice,
      };
    });

export const calculateTotals = (items, pricing = {}) => {
  const subtotal =
    pricing.subtotal !== undefined
      ? Number(pricing.subtotal)
      : items.reduce((sum, item) => sum + item.amount, 0);

  const discount = pricing.discount !== undefined ? Number(pricing.discount) : 0;
  const totalAmount =
    pricing.totalAmount !== undefined ? Number(pricing.totalAmount) : subtotal - discount;

  return {
    subtotal: Math.max(0, subtotal),
    discount: Math.max(0, discount),
    totalAmount: Math.max(0, totalAmount),
  };
};

export const normalizePayment = (payment = {}, totalAmount = 0) => {
  const paidAmount = payment.paidAmount !== undefined ? Number(payment.paidAmount) : 0;
  const remainingAmount =
    payment.remainingAmount !== undefined
      ? Number(payment.remainingAmount)
      : Math.max(totalAmount - paidAmount, 0);

  const status =
    payment.status ||
    (paidAmount >= totalAmount ? 'paid' : paidAmount > 0 ? 'partial' : 'pending');

  return {
    paidAmount: Math.max(0, paidAmount),
    remainingAmount: Math.max(0, remainingAmount),
    status,
  };
};

