# BLACKONN E-Commerce Website

A fully functional e-commerce website with authentication, product management, shopping cart, and order tracking - optimized for GitHub Pages deployment.

## 🚀 Features

### Authentication System
- **User Registration**: Complete signup with validation
- **Secure Login**: Enhanced security with session management
- **Password Reset**: Token-based password recovery
- **Account Lockout**: Protection against brute force attacks
- **Admin Access**: Special admin login functionality

### User Management
- **Profile Management**: Update personal information
- **Order History**: Track all purchases
- **Return Tracking**: Separate tracking for returns vs orders
- **Wishlist**: Save favorite products
- **Address Management**: Multiple delivery addresses

### Shopping Features
- **Product Catalog**: Browse products by category
- **Advanced Search**: Find products quickly
- **Shopping Cart**: Add, remove, update quantities
- **Checkout Process**: Secure order placement
- **Payment Integration**: Ready for payment gateway

### Admin Panel
- **Order Management**: View and update order status
- **Returns Management**: Handle return requests
- **Product Management**: Add/edit/delete products
- **User Management**: View user accounts
- **Analytics**: Sales and user activity reports

## 🛠️ Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Storage**: localStorage (GitHub Pages compatible)
- **Authentication**: Custom JWT-like session tokens
- **Security**: Password hashing, session validation
- **Responsive**: Mobile-first design

## 📁 Project Structure

```
blackonn-website/
├── index.html              # Homepage
├── login.html              # User login
├── signup.html             # User registration
├── forgot-password.html    # Password reset request
├── reset-password.html     # Password reset form
├── profile.html            # User profile/dashboard
├── cart.html               # Shopping cart
├── checkout.html           # Checkout process
├── products.html           # Product catalog
├── admin.html              # Admin panel
├── assets/
│   ├── css/
│   │   └── styles.css      # Main stylesheet
│   ├── js/
│   │   ├── auth.js         # Authentication utilities
│   │   └── main.js         # Main JavaScript
│   └── img/                # Images and icons
├── data/                   # Static data files
└── *.html                  # Other pages
```

## 🚀 GitHub Pages Deployment

### Step 1: Repository Setup
1. Create a new GitHub repository
2. Upload all files to the repository
3. Go to Settings → Pages
4. Select "Deploy from a branch"
5. Choose "main" branch and "/ (root)" folder
6. Click "Save"

### Step 2: Enable GitHub Pages
- Your site will be available at: `https://yourusername.github.io/repository-name/`
- The authentication system works entirely client-side using localStorage

### Step 3: Admin Access
- **Admin Email**: Arunava458@gmail.com
- **Admin Password**: 9732@Piku
- Access admin panel at: `https://yourusername.github.io/repository-name/admin.html`

## 🔐 Authentication System

### How It Works
- **Registration**: Users create accounts with email/password
- **Login**: Secure authentication with session tokens
- **Session Management**: 24-hour session timeout
- **Security Features**:
  - Account lockout after 5 failed attempts
  - Password strength requirements
  - Session validation
  - Activity logging

### Password Reset Process
1. User requests password reset on `forgot-password.html`
2. System generates reset token (stored in localStorage)
3. User receives token (displayed in console/alert for demo)
4. User enters token on `reset-password.html`
5. Password is updated securely

## 📊 Data Storage

All data is stored in the browser's localStorage:

- `blackonn_users`: User accounts
- `blackonn_user`: Current session
- `blackonn_admin_auth`: Admin session
- `blackonn_products`: Product catalog
- `blackonn_cart`: Shopping cart
- `blackonn_orders`: Order history
- `blackonn_returns`: Return requests
- `blackonn_wishlist`: User wishlists

## 🎨 Customization

### Styling
- Main styles in `assets/css/styles.css`
- Responsive design for mobile/tablet/desktop
- Premium glass morphism effects
- Smooth animations and transitions

### Branding
- Logo: `BLACKONN 004_page-0001.png`
- Colors: Black/white premium theme
- Typography: Modern sans-serif fonts

## 🔧 Development

### Local Development
```bash
# Clone the repository
git clone https://github.com/yourusername/blackonn-website.git

# Open in browser (no server needed)
# Just open index.html in your browser
```

### Adding New Features
1. Authentication: Use `window.blackonnAuth` methods
2. Data Storage: Use localStorage with 'blackonn_' prefix
3. UI Components: Follow existing HTML/CSS patterns

## 📝 API Methods

### Authentication
```javascript
// Login
const result = await window.blackonnAuth.login(email, password);

// Register
const result = await window.blackonnAuth.register(userData);

// Logout
window.blackonnAuth.logout();

// Check auth status
const auth = window.blackonnAuth.isAuthenticated();
```

### User Management
```javascript
// Update profile
const result = await window.blackonnAuth.updateProfile(userId, updates);

// Get current user
const user = window.blackonnAuth.getCurrentUser();
```

## 🛡️ Security Features

- **Password Hashing**: Basic hashing for demo (use proper crypto in production)
- **Session Tokens**: Unique tokens for each session
- **Account Lockout**: Prevents brute force attacks
- **Input Validation**: Client-side validation for all forms
- **XSS Protection**: Proper input sanitization

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Adaptive layouts for tablets
- **Desktop Enhancement**: Full feature set on desktop
- **Touch Friendly**: Large touch targets for mobile

## 🌟 Premium Features

- **Glass Morphism**: Modern UI with backdrop blur effects
- **Smooth Animations**: CSS transitions and transforms
- **Interactive Elements**: Hover effects and micro-interactions
- **Loading States**: Visual feedback for user actions
- **Error Handling**: Comprehensive error messages

## 📞 Support

For issues or questions:
- Check browser console for errors
- Verify localStorage is enabled
- Clear browser data if authentication fails

## 📄 License

This project is for educational and demonstration purposes.

---

**BLACKONN** - Premium Fashion E-Commerce Platform</content>
<parameter name="filePath">c:\Users\Admin\Desktop\landingWebsite-main\README.md