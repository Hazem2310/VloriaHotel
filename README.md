# 🏨 Veloria Hotel - Full Stack Hotel Management System

A complete hotel booking and management system built with **React**, **Node.js**, **Express**, and **MySQL**.

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication with httpOnly cookies
- Role-based access control (Admin/User)
- Secure password hashing with bcrypt

### 👤 User Features
- Browse available rooms
- View room details with pricing
- Make room bookings with date selection
- View booking history
- Cancel pending bookings
- Multi-language support (English/Arabic/Hebrew)
- AI chat assistant for hotel inquiries

### 👑 Admin Features
- Comprehensive dashboard with statistics
- Manage rooms (CRUD operations)
- Manage services (CRUD operations)
- View and manage all bookings
- Update booking status
- Advanced reports and analytics:
  - Total revenue
  - Completed bookings
  - Average booking price
  - Most booked room
  - Monthly revenue trends

### 🤖 AI Chat Assistant
- Powered by OpenAI GPT-3.5
- Answers questions about rooms, services, and policies
- Helps with booking guidance
- Available to all visitors

### 🌍 Multi-Language Support
- English (default)
- Arabic (RTL support)
- Hebrew (RTL support)
- Persistent language selection

## 🛠️ Tech Stack

### Frontend
- **React** 19.2.3
- **React Router** 7.13.0
- **Axios** for API calls
- **Context API** for state management
- **CSS Modules** for styling

### Backend
- **Node.js** with **Express** 5.2.1
- **MySQL** database with **mysql2**
- **JWT** for authentication
- **bcryptjs** for password hashing
- **cookie-parser** for cookie handling
- **OpenAI API** for AI chat
- **multer** for file uploads

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL (v8 or higher)
- OpenAI API key (for AI chat feature)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
cd "veloria Hotel"
```

### 2. Database Setup

Create the MySQL database and tables:

```sql
-- Create database
CREATE DATABASE veloria_hotel;
USE veloria_hotel;

-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user','admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rooms table
CREATE TABLE rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  capacity INT NOT NULL,
  image VARCHAR(255),
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  room_id INT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status ENUM('pending','confirmed','completed','cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

-- Insert default admin user (password: admin123)
INSERT INTO users (name, email, password, role) 
VALUES ('Admin', 'admin@veloria.com', '$2a$10$YourHashedPasswordHere', 'admin');

-- Insert sample rooms
INSERT INTO rooms (title, description, price, capacity, is_available) VALUES
('Deluxe Suite', 'Spacious suite with ocean view and premium amenities', 299.99, 2, TRUE),
('Family Room', 'Perfect for families with separate sleeping areas', 199.99, 4, TRUE),
('Executive Room', 'Business-class room with workspace', 249.99, 2, TRUE);
```

### 3. Backend Setup

```bash
cd server
npm install
```

Create `.env` file in the `server` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=veloria_hotel

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=30d

# Client URL
CLIENT_URL=http://localhost:3000

# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here
```

Start the server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

Server will run on `http://localhost:5000`

### 4. Frontend Setup

```bash
cd client
npm install
```

Create `.env` file in the `client` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the React app:
```bash
npm start
```

Client will run on `http://localhost:3000`

## 📁 Project Structure

```
veloria-hotel/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/     # Reusable components
│       │   ├── AIChat/
│       │   ├── Header/
│       │   ├── Footer/
│       │   ├── LanguageSwitcher/
│       │   └── ProtectedRoute/
│       ├── context/        # Context providers
│       │   ├── AuthContext.jsx
│       │   └── LanguageContext.jsx
│       ├── pages/          # Page components
│       │   ├── admin/      # Admin pages
│       │   ├── user/       # User pages
│       │   ├── home/
│       │   └── auth/
│       ├── utils/          # Utility functions
│       ├── translations.js # Multi-language translations
│       └── App/
│
└── server/                 # Node.js backend
    ├── config/             # Configuration files
    │   ├── db.js
    │   └── schema.sql
    ├── controllers/        # Route controllers
    │   ├── authController.js
    │   ├── roomController.js
    │   ├── serviceController.js
    │   ├── bookingController.js
    │   ├── reportController.js
    │   └── aiController.js
    ├── middleware/         # Custom middleware
    │   └── auth.js
    ├── routes/             # API routes
    │   ├── auth.js
    │   ├── rooms.js
    │   ├── services.js
    │   ├── bookings.js
    │   ├── reports.js
    │   └── ai.js
    └── index.js            # Server entry point
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get room by ID
- `POST /api/rooms` - Create room (Admin only)
- `PUT /api/rooms/:id` - Update room (Admin only)
- `DELETE /api/rooms/:id` - Delete room (Admin only)

### Services
- `GET /api/services` - Get all services
- `POST /api/services` - Create service (Admin only)
- `PUT /api/services/:id` - Update service (Admin only)
- `DELETE /api/services/:id` - Delete service (Admin only)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my` - Get user's bookings
- `GET /api/bookings` - Get all bookings (Admin only)
- `PUT /api/bookings/:id/status` - Update booking status (Admin only)
- `DELETE /api/bookings/:id` - Cancel booking

### Reports
- `GET /api/reports` - Get analytics and reports (Admin only)

### AI Chat
- `POST /api/ai/chat` - Chat with AI assistant

## 👥 Default Credentials

After setting up the database, create an admin user:

```sql
-- Hash the password 'admin123' using bcrypt
INSERT INTO users (name, email, password, role) 
VALUES ('Admin', 'admin@veloria.com', '$2a$10$[bcrypt-hashed-password]', 'admin');
```

Or register through the UI and manually update the role in the database:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

## 🌐 Multi-Language Support

The application supports three languages with automatic RTL (Right-to-Left) layout for Arabic and Hebrew:

- **English** (en) - Default, LTR
- **Arabic** (ar) - RTL
- **Hebrew** (he) - RTL

Language preference is stored in localStorage and persists across sessions.

## 🤖 AI Chat Configuration

To enable the AI chat feature:

1. Get an OpenAI API key from https://platform.openai.com/
2. Add it to your `server/.env` file:
   ```env
   OPENAI_API_KEY=sk-your-api-key-here
   ```

The AI assistant is configured to help with:
- Room information and availability
- Pricing and capacity details
- Hotel services and amenities
- Booking procedures
- Check-in/check-out policies

## 🔒 Security Features

- JWT tokens stored in httpOnly cookies
- Password hashing with bcrypt (10 salt rounds)
- CORS configured with credentials
- SQL injection prevention with prepared statements
- Role-based access control
- Input validation on all endpoints

## 📊 Reports & Analytics

Admin dashboard provides:
- Total revenue from completed bookings
- Total number of bookings
- Completed bookings count
- Average booking price
- Most booked room
- Monthly revenue trends
- Recent bookings list
- Booking status breakdown

## 🎨 UI/UX Features

- Responsive design for all devices
- Modern gradient-based color scheme
- Smooth animations and transitions
- Loading states and error handling
- Accessible navigation
- Mobile-friendly interface

## 🐛 Troubleshooting

### Port Already in Use
If you get `EADDRINUSE` error:
```bash
# Find process using port 5000
netstat -ano | findstr :5000
# Kill the process
taskkill /PID <PID> /F
```

### Database Connection Error
- Verify MySQL is running
- Check database credentials in `.env`
- Ensure database `veloria_hotel` exists

### AI Chat Not Working
- Verify OpenAI API key is valid
- Check API key has sufficient credits
- Review server logs for error details

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Contact

For support or inquiries, please contact the development team.

---

**Built with ❤️ using React, Node.js, Express, and MySQL**
