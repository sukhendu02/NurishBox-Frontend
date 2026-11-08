// Shared helpers for ProductCard, CartControl and ProductDetailPopup.

export const formatPrice = (value) => `₹${Number(value).toFixed(2)}`;

// A product without inventory rows is treated as in stock (same rule the card used).
export function isInStock(product) {
  const inv = product.inventory?.[0];
  return inv ? inv.quantity > 0 && inv.isAvailable : true;
}

export function getDiscount(product) {
  const save = product.price - product.sellingPrice;
  if (!(save > 0)) return null;
  return { save, percent: Math.round((save / product.price) * 100) };
}
