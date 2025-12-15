# Inventory Management System - Out of Stock Feature

## Overview
This GitHub Pages compatible inventory system automatically shows products as "Out of Stock" when inventory reaches 0 in the admin dashboard. The system is fully static and requires no backend server.

## How It Works

### 1. **Admin Panel (admin.html)**
- Admin can manage product inventory through the "Inventory" field in the product form
- When editing a product, the stock value is updated in localStorage
- Example: Setting "Inventory" field to `0` marks product as out of stock

**Key Fields:**
- Product Name
- Price
- Description
- **Inventory** (stock quantity) - Set to 0 to mark as out of stock
- Category
- Image URL

### 2. **Product Data Flow**
```
Admin Panel (sets stock=0)
    ↓
localStorage.blackonn_products (stores product data)
    ↓
products.html (reads from localStorage)
    ↓
Product Page (displays "Out of Stock" badge and disables purchases)
```

### 3. **Products Page (products.html)**
The system checks product inventory and shows:

**When stock > 0 (In Stock):**
- Green "In Stock (X units)" badge
- Size and color options enabled
- "Buy Now" and "Add to Cart" buttons enabled
- Users can purchase

**When stock = 0 (Out of Stock):**
- Red "Out of Stock" badge
- All size and color options disabled (grayed out)
- Red "Out of Stock" message displayed
- "Buy Now" and "Add to Cart" buttons disabled (opacity reduced)
- Users cannot purchase

### 4. **Stock Check Implementation**

The `convertApiProduct()` function in products.html:
```javascript
// Check inventory: if stock is 0, product is out of stock
const inventory = apiProduct.stock || 0;
const isOutOfStockByInventory = inventory === 0;

return {
  // ... other properties ...
  stock: inventory,
  isOutOfStock: isOutOfStockByInventory,
  availableSizes: isOutOfStockByInventory ? [] : availableSizes,
  availableColors: isOutOfStockByInventory ? [] : availableColors,
};
```

When a product is marked as out of stock:
1. `isOutOfStock` flag is set to `true`
2. `availableSizes` array becomes empty
3. `availableColors` array becomes empty
4. All options show as disabled/grayed out

### 5. **Visual Feedback**

**Stock Badge Styling:**
- **In Stock:** Green background (#d1fae5) with green text (#059669)
- **Out of Stock:** Red background (#fee2e2) with red text (#dc2626)

**CSS Classes:**
- `.in-stock-badge` - Green badge with stock count
- `.out-of-stock-badge` - Red badge
- `.out-of-stock-option` - Grayed out size/color options
- `.out-of-stock` - Message displayed when product is unavailable

## Usage Instructions

### To Mark a Product as Out of Stock:

1. **Log in to Admin Panel** → Go to Products section
2. **Edit Product** → Click the edit button for the product
3. **Set Inventory to 0** → Change the "Inventory" field to `0`
4. **Save** → Click "Update Product"

### Result:
- Product page displays "Out of Stock" badge
- Purchase buttons are disabled
- Customer cannot add to cart or buy
- Product remains visible (just marked as unavailable)

### To Restore Stock:

1. **Edit Product** → Click edit again
2. **Update Inventory** → Change the "Inventory" field to desired quantity (e.g., 50)
3. **Save** → Click "Update Product"

### Result:
- Badge changes to "In Stock (X units)"
- Purchase buttons become enabled
- Customers can purchase again

## Technical Details

### Data Storage
- Products are stored in localStorage under key: `blackonn_products`
- Falls back to embedded products if localStorage is empty
- Changes persist across page refreshes

### GitHub Pages Compatibility
✅ **Fully compatible** - Uses only:
- HTML
- CSS
- JavaScript (no backend/Node.js)
- localStorage (browser API)
- No external APIs or server calls required

### Browser Support
- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- Mobile browsers: ✅

## API Product Properties

Each product object should have:
```javascript
{
  id: "prod-001",
  name: "Product Name",
  price: 1499,
  color: "Black",
  size: "All",
  stock: 100,  // ← Key property: set to 0 for out of stock
  description: "Product description",
  image: "assets/img/product.png",
  thumbImages: ["img1.png", "img2.png"],
  position: 1  // Homepage position (1-6)
}
```

## Key Files Modified

1. **products.html** - Added stock checking logic and visual feedback
   - Modified `convertApiProduct()` function
   - Updated `updateStockStatus()` function
   - Added `.stock-badge` CSS styling
   - Updated product detail template with stock badge

2. **admin.html** - Already supports inventory field
   - Product form includes "Inventory" input field
   - Edit form loads stock value
   - Submit handler saves stock to localStorage

3. **assets/js/store.js** - Already supports stock property
   - Products include `stock` property
   - No modifications needed

## Testing

### Test Case 1: Set Product to Out of Stock
1. Go to Admin → Products
2. Edit a product
3. Set Inventory to 0
4. Click "Update Product"
5. Go to Products page
6. Click on that product
7. ✅ Should show "Out of Stock" badge
8. ✅ Purchase buttons should be disabled

### Test Case 2: Restore Stock
1. Go to Admin → Products
2. Edit the same product
3. Set Inventory to 50
4. Click "Update Product"
5. Go to Products page
6. Click on that product
7. ✅ Should show "In Stock (50 units)" badge
8. ✅ Purchase buttons should be enabled

## Notes

- Stock value shown in badge updates automatically
- No page refresh needed (real-time update)
- Works across all browsers
- Perfect for GitHub Pages deployment
- Inventory can be any number (no limits)
- Out of stock products remain visible (not hidden)

## Troubleshooting

**Product still shows as in stock after setting to 0:**
- Clear browser cache
- Check localStorage in browser dev tools
- Ensure admin changes were saved correctly

**Out of Stock not showing:**
- Check browser console for JavaScript errors
- Verify product has `stock` property in data
- Check localStorage has correct product data

## Future Enhancements

Possible improvements:
- Low stock warning (e.g., when stock < 10)
- Automatic email notifications when product runs out
- Stock analytics dashboard
- Reorder reminders for admin
- Quantity-based discounts
