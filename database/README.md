# BLACKONN Database

This folder contains the persistent database files for the BLACKONN e-commerce application.

## File Structure

```
database/
├── users.json      - User accounts (id, name, email, password, phone, role)
├── products.json   - Product catalog (id, name, price, stock, etc.)
├── images.json     - Product images (mainImage, thumbImages per product)
├── orders.json     - Customer orders (id, customer, items, amount, status)
├── sessions.json   - Active login sessions (token -> user info)
└── README.md       - This file
```

## Files Description

### users.json

Contains all registered user accounts including:

- **id**: Unique user identifier (UUID)
- **name**: User's full name
- **email**: User's email address (used for login)
- **password**: User's password (stored as plain text - consider hashing in production)
- **phone**: User's phone number (optional)
- **role**: User role - 'admin' or 'customer'
- **createdAt**: Account creation timestamp

### products.json

Contains all products in the catalog:

- **id**: Unique product identifier (UUID)
- **name**: Product name
- **price**: Product price in INR
- **color**: Product color
- **size**: Product size (S, M, L, XL, or ALL)
- **stock**: Available inventory count
- **image**: Reference to main product image
- **thumbImages**: Array of thumbnail image references
- **position**: Home page display position (1-6)
- **createdAt**: Product creation timestamp

### images.json

Contains product images stored separately for better organization:

- **Key**: Product ID (UUID)
- **mainImage**: Base64 encoded main product image
- **thumbImages**: Array of base64 encoded thumbnail images
- **createdAt**: Image upload timestamp
- **updatedAt**: Last update timestamp

### orders.json

Contains all customer orders:

- **id**: Unique order identifier (UUID)
- **customer**: Customer details (name, email, phone)
- **items**: Array of ordered products
- **amount**: Total order amount
- **address**: Delivery address
- **paymentMethod**: Payment method used
- **status**: Order status (pending, processing, shipped, delivered)
- **createdAt**: Order creation timestamp

### sessions.json

Contains active user sessions:

- Keyed by session token
- Contains user info for authenticated sessions
- Sessions are created on login and removed on logout

## API Endpoints for Images

- `GET /api/images` - Get all product images (admin only)
- `GET /api/images/:productId` - Get images for a specific product
- `PUT /api/images/:productId` - Upload/update images for a product (admin only)
- `DELETE /api/images/:productId` - Delete images for a product (admin only)

## Security Notes

⚠️ **WARNING**: This is a simple file-based database for development/demo purposes.

For production, consider:
1. **Password Hashing**: Use bcrypt or argon2 to hash passwords
2. **Database**: Use a proper database like MongoDB, PostgreSQL, or MySQL
3. **Session Management**: Use secure session tokens with expiration
4. **Environment Variables**: Store sensitive credentials in environment variables
5. **HTTPS**: Always use HTTPS in production

## Admin Credentials

- **Email**: Arunava458@gmail.com
- **Password**: 9732@Piku

## Backup

The original `server-data.json` file (if it existed) has been backed up to `server-data.backup.json` after migration to this folder structure.
