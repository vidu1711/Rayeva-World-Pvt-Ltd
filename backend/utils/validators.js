/**
 * Request body validators for proposal and impact endpoints.
 */

function validateProposalBody(body) {
  const errors = [];
  if (!body || typeof body !== 'object') {
    return { valid: false, errors: ['Request body must be a JSON object'] };
  }
  if (!body.event_type || typeof body.event_type !== 'string' || !body.event_type.trim()) {
    errors.push('event_type is required and must be a non-empty string');
  }
  const budget = Number(body.budget);
  if (body.budget === undefined || body.budget === null || Number.isNaN(budget) || budget <= 0) {
    errors.push('budget is required and must be a positive number');
  }
  if (!body.sustainability_goal || typeof body.sustainability_goal !== 'string' || !body.sustainability_goal.trim()) {
    errors.push('sustainability_goal is required and must be a non-empty string');
  }
  return {
    valid: errors.length === 0,
    errors,
    normalized: errors.length === 0 ? { event_type: body.event_type.trim(), budget, sustainability_goal: body.sustainability_goal.trim() } : null,
  };
}

function validateImpactBody(body) {
  const errors = [];
  if (!body || typeof body !== 'object') {
    return { valid: false, errors: ['Request body must be a JSON object'] };
  }
  if (!Array.isArray(body.order_items) || body.order_items.length === 0) {
    errors.push('order_items is required and must be a non-empty array');
  } else {
    body.order_items.forEach((item, i) => {
      if (!item || typeof item !== 'object') {
        errors.push(`order_items[${i}] must be an object with product and quantity`);
      } else {
        if (!item.product || typeof item.product !== 'string' || !item.product.trim()) {
          errors.push(`order_items[${i}].product is required and must be a non-empty string`);
        }
        const qty = Number(item.quantity);
        if (item.quantity === undefined || item.quantity === null || Number.isNaN(qty) || qty < 0) {
          errors.push(`order_items[${i}].quantity is required and must be a non-negative number`);
        }
      }
    });
  }
  return {
    valid: errors.length === 0,
    errors,
    normalized: errors.length === 0 ? { order_items: body.order_items } : null,
  };
}

module.exports = { validateProposalBody, validateImpactBody };
