# Software Requirements Specification (SRS)
## B2B Barter Exchange Portal

### 1. Introduction
#### 1.1 Purpose
The purpose of this document is to define the requirements for the B2B Barter Exchange Portal, a web-based marketplace allowing businesses to list surplus inventory and exchange goods or services without direct monetary transactions.

#### 1.2 Scope
The application will be a full-stack web application using the MERN stack (MongoDB, Express.js, React.js, Node.js). It will facilitate user registration, inventory listing, trade proposal creation, and transaction history tracking.

### 2. General Description
#### 2.1 Product Perspective
This is a standalone web application accessible via modern web browsers. It consists of a React.js frontend and a Node.js/Express.js backend connecting to a MongoDB database.

#### 2.2 User Classes and Characteristics
- **Guest**: Can view public listings (optional, depending on privacy).
- **Registered Business User**: Can list items, propose trades, and view history.
- **Admin**: Can manage users, moderate listings, and resolve disputes.

### 3. Functional Requirements

#### 3.1 Authentication & Authorization
- **Registration/Login**: Users can sign up and log in using email/password.
- **JWT Authentication**: Secure stateless authentication using JSON Web Tokens.
- **RBAC (Role-Based Access Control)**:
    - Middleware to differentiate between 'User' and 'Admin' roles.
    - Protected routes for sensitive actions (e.g., admin dashboard).

#### 3.2 Inventory Management
- **Create Listing**: Users can add items with details (title, description, quantity, estimated value, images).
- **Read Listings**: Paginated view of available items from other users.
- **Update/Delete Listing**: Users can modify or remove their own unsold items.
- **Search & Filter**: Find items by category or keywords (using MongoDB text indexing).

#### 3.3 Trade/Exchange Mechanism
- **Propose Trade**: User A proposes an item (or items) in exchange for User B's item.
- **Trade Status**: Deals go through states: `Pending`, `Accepted`, `Rejected`, `Completed`, `Cancelled`.
- **Notifications**: (Optional for MVP) Notify users of trade updates.

#### 3.4 Transaction History
- **Logs**: Immutable record of completed trades.
- **User Dashboard**: View past trades and current active proposals.

### 4. Non-Functional Requirements
#### 4.1 Performance
- **Server-side Pagination**: API endpoints for listings must support pagination to handle large datasets.
- **Code-Splitting**: React frontend should use `React.lazy` and `Suspense` to load components on demand.
- **Database Indexing**: Essential fields (e.g., status, created_at, text search) must be indexed in MongoDB.

#### 4.2 Security
- **Data Protection**: Passwords hashed using bcrypt.
- **Input Validation**: Sanitize inputs to prevent injection attacks (using libraries like Joi or express-validator).
- **CORS**: Properly configured Cross-Origin Resource Sharing.

#### 4.3 Usability
- **Responsive Design**: Mobile-friendly layout using CSS media queries or a framework.

### 5. Technology Stack
- **Frontend**: React.js, Redux (or Context API), React Router.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose ODM).
- **Authentication**: Passport.js or custom JWT middleware.

### 6. Future Scope
- Real-time chat between traders.
- Integration with shipping providers.
- B2B reputation/rating system.
