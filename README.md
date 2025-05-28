# Book Hub Project 📚

A web application for book enthusiasts to discover and share their reading experiences.

## 🛠 Tech Stack

### Backend

- **Runtime:** Node.js
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Email Service:** SendGrid
- **Development:** Nodemon for hot-reload

### Frontend

- **Framework:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** Firebase
- **Code Quality:**
  - ESLint for linting
  - Prettier for code formatting
  - TypeScript for type safety

## 📁 Project Structure

```
.
├── server/                 # Backend application
│   ├── WebApi/            # API routes and controllers
│   ├── Services/          # Business logic layer
│   ├── Data/             # Data models and repositories
│   ├── server.ts         # Server entry point
│   └── .env-sample       # Environment variables template
├── front/                 # Frontend application
│   ├── src/
│   │   ├── api/          # API integration
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── router/       # Route definitions
│   │   ├── theme/        # Styling and Tailwind config
│   │   └── types/        # TypeScript type definitions
│   ├── public/           # Static assets
│   └── vite.config.ts    # Vite configuration
└── package.json          # Root package configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/vladcondurat/book-reviewer.git
   cd book-reviewer
   ```

2. **Set up the backend:**

   ```bash
   cd server
   npm install
   cp .env-sample .env  # Configure your environment variables
   ```

3. **Configure environment variables:**
   Create a `.env` file in the `server/` directory with the following variables:

   ```
   PORT=3000
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   SENDGRID_API_KEY=your_sendgrid_api_key
   ```

4. **Run the backend:**

   ```bash
   npm run dev  # Development mode with hot-reload
   ```

5. **Set up the frontend:**

   ```bash
   cd ../front
   npm install
   ```

6. **Run the frontend:**
   ```bash
   npm run dev  # Starts the development server
   ```

## 📚 Application Features and Workflows

### User Authentication

- Secure registration with email, password, username, and avatar
- JWT-based authentication system
- Password reset functionality via email (SendGrid integration)
- Role-based access (Regular users and Admins)

### Book Review System

- Comprehensive review system with:
  - Detailed descriptions
  - 5-star rating system
  - Reading progress tracking
  - User profile integration
- Reviews display:
  - User avatar and username
  - Star rating visualization
  - Reading progress percentage
  - Review content

### Reading Progress Tracking

- Percentage-based progress tracking per book
- Progress requirement for review submission
- Visual progress indicators
- Progress history tracking

### Book Management

- Complete book information:
  - Title and author
  - Genre and year
  - Publishing house
  - Description
  - Cover image
- Admin capabilities:
  - Book creation
  - Information updates
  - Book deletion

### User Features

- Personal library management:
  - Favorite books collection
  - Reading progress tracking
  - Review history
- Profile customization:
  - Username and avatar
  - Reading preferences
  - Activity history

### Statistics and Analytics

- Personal reading insights:
  - Books completed
  - Genre preferences
  - Author preferences
  - Current reading list
  - Review activity
  - Progress analytics

### Search and Discovery

- Book search functionality
- Latest releases section
- News updates
- User support contact form

### Security Features

- Secure password hashing with salt
- JWT authentication
- Role-based access control
- Protected API endpoints
- Admin-only operations

### API Endpoints

- User operations (register, login, update, delete)
- Book management (CRUD)
- Review system
- Progress tracking
- Statistics
- Search functionality
- Contact support

### Frontend Features

- Modern UI with Tailwind CSS
- Responsive design
- Interactive components:
  - Star rating system
  - Progress tracking
  - Real-time updates
- User-friendly navigation

## 📝 License

This project is licensed under the ISC License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
