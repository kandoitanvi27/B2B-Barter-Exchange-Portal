# B2B Barter Exchange Portal (MERN)

A full-stack B2B barter marketplace built with the MERN stack (MongoDB, Express.js, React.js, Node.js). This platform allows businesses to list surplus inventory and propose trade deals without direct monetary transactions.

## 🚀 Features

- **User Authentication**: Secure Login/Register with JWT and Role-Based Access Control (RBAC).
- **Inventory Management**: Create, Read, Update, and Delete (CRUD) listings with image support.
- **Marketplace**: Browse and search listings with filtering (Category, Search text).
- **Trade System**:
  - Propose trades by offering your items for others'.
  - Accept, Reject, or Cancel trade proposals.
  - View full transaction history.
- **Responsive UI**: Modern design using Tailwind CSS.

## 📸 Screenshots

| Landing Page | Marketplace |
|:---:|:---:|
| ![Landing](./screenshots/home.png) | ![Marketplace](./screenshots/marketplace.png) |

| Login | Register |
|:---:|:---:|
| ![Login](./screenshots/login.png) | ![Register](./screenshots/register.png) |

| Listing Details | Create Listing |
|:---:|:---:|
| ![Details](./screenshots/listing_details.png) | ![Create](./screenshots/create_listing.png) |


## 🛠 Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Context API.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose ODM).
- **Validation**: Joi (Server-side).

## 🏗 System Architecture

The application follows a standard **MERN Stack (3-Tier)** architecture:

```mermaid
graph TD
    Client["React Client (Vite)"] <-->|"REST API / JSON"| Server["Express Server"]
    Server <-->|"Mongoose ODM"| DB[("MongoDB")]
    
    subgraph Frontend
    Client
    end
    
    subgraph Backend
    Server
    DB
    end
```

## 📚 Documentation

### 1. Software Requirements Specification (SRS)
#### 1.1 Purpose
The purpose of this document is to define the requirements for the B2B Barter Exchange Portal, a web-based marketplace allowing businesses to list surplus inventory and exchange goods or services without direct monetary transactions.

#### 1.2 Scope
The application will be a full-stack web application using the MERN stack (MongoDB, Express.js, React.js, Node.js). It will facilitate user registration, inventory listing, trade proposal creation, and transaction history tracking.

#### 2. General Description
**Product Perspective**: This is a standalone web application accessible via modern web browsers. It consists of a React.js frontend and a Node.js/Express.js backend connecting to a MongoDB database.

**User Classes**:
- **Guest**: Can view public listings.
- **Registered Business User**: Can list items, propose trades, and view history.
- **Admin**: Can manage users, moderate listings, and resolve disputes.

#### 3. Functional Requirements
**Authentication & Authorization**:
- **Registration/Login**: Users can sign up and log in using email/password.
- **JWT Authentication**: Secure stateless authentication using JSON Web Tokens.
- **RBAC**: Middleware to differentiate between 'User' and 'Admin' roles.

**Inventory Management**:
- **Create Listing**: Users can add items with details (title, description, category, value, images).
- **Read Listings**: Paginated view of available items with text search.
- **Update/Delete**: Full CRUD capabilities for item owners.

**Trade/Exchange Mechanism**:
- **Propose Trade**: User A proposes an item in exchange for User B's item.
- **Trade Lifecycle**: `Pending` → `Accepted` → `Completed`.

**Transaction History**:
- **Logs**: Immutable record of completed trades.
- **Dashboard**: View past trades and active proposals.

#### 4. Non-Functional Requirements
- **Performance**: Server-side pagination, React code-splitting.
- **Security**: Bcrypt password hashing, Joi input validation, Helmet for security headers.
- **Usability**: Responsive design with Tailwind CSS.

---

### 2. System Design Document (SDD)

#### System Architecture
The system follows a classic **3-Tier Architecture** (MERN Stack).

**1. Presentation Layer (Client)**: React.js SPA handling UI and API consumption.
**2. Application Layer (Server)**: Node.js + Express.js handling business logic and routing.
**3. Data Layer (Database)**: MongoDB storing JSON-like documents.

#### Database Schema Design
**Users Collection**
- `username`, `email` (Unique)
- `passwordHash` (Bcrypt)
- `role` ('user', 'admin')

**Listings Collection**
- `owner` (Ref: User)
- `title`, `description`, `category`
- `status` ('available', 'pending', 'traded')
- `images` (Array of URLs)

**Trades Collection**
- `initiator`, `receiver` (Ref: User)
- `listingInitiator`, `listingReceiver` (Ref: Listing)
- `status` ('pending', 'accepted', 'rejected', 'completed', 'cancelled')
- `message` (String)

#### API Design (RESTful)
**Auth Routes**
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

**Listing Routes**
- `POST /api/listings` (Create)
- `GET /api/listings` (Read All)
- `GET /api/listings/:id` (Read One)
- `PUT /api/listings/:id` (Update)
- `DELETE /api/listings/:id` (Delete)

**Trade Routes**
- `POST /api/trades` (Propose)
- `GET /api/trades/history` (View History)
- `PUT /api/trades/:id/:action` (Accept/Reject/Cancel)

#### Security Strategy
- **JWT**: Stateless session management.
- **Validation**: Joi middleware for rigorous input checking.
- **Indexing**: Text indexes on listing titles for performant search.

## 📊 Engineering Diagrams

### 1. Unified Modeling Language (UML) Diagrams

#### Use Case Diagram
Visualizes the interactions between actors (Users, Admins) and the system.

```mermaid
graph TD
    User((User))
    Admin((Admin))
    
    subgraph "Barter Portal System"
        Reg[Register/Login]
        View[View Marketplace]
        List[Manage Inventory]
        Trade[Propose/Manage Trades]
        Profile[Manage Profile]
        Mod[Moderate Content]
        Users[Manage Users]
    end
    
    User --> Reg
    User --> View
    User --> List
    User --> Trade
    User --> Profile
    
    Admin --> Reg
    Admin --> View
    Admin --> Mod
    Admin --> Users
```

#### Sequence Diagram (Trade Lifecycle)
Details the step-by-step flow of a trade proposal and acceptance.

```mermaid
sequenceDiagram
    actor Init as Initiator
    participant UI as Frontend
    participant API as Backend API
    participant DB as MongoDB
    actor Rec as Receiver

    Note over Init, Rec: Trade Proposal Phase
    Init->>UI: Select Item & Propose Trade
    UI->>API: POST /api/trades
    API->>DB: Save Trade (Status: Pending)
    DB-->>API: Acknowledge
    API-->>UI: Trade Created
    
    Note over Rec: Notification/View Phase
    Rec->>UI: View Trade History
    UI->>API: GET /api/trades
    API->>DB: Fetch Pending Trades
    DB-->>API: Return Trade List
    API-->>UI: Display Proposals
    
    Note over Init, Rec: Resolution Phase
    Rec->>UI: Click "Accept"
    UI->>API: PUT /trades/:id/accept
    API->>DB: Update Trade (Status: Accepted)
    API->>DB: Update Initiator Listing (Status: Traded)
    API->>DB: Update Receiver Listing (Status: Traded)
    DB-->>API: Success
    API-->>UI: Trade Completed Notification
```

### 2. Data Models & Flow

#### Entity Relationship Diagram (ERD)
Illustrates the schema relationships between Users, Listings, and Trades.

```mermaid
erDiagram
    USER ||--o{ LISTING : "owns"
    USER ||--o{ TRADE : "initiates"
    USER ||--o{ TRADE : "receives"
    
    LISTING ||--o{ TRADE : "is_offered_in"
    LISTING ||--o{ TRADE : "is_requested_in"

    USER {
        ObjectId _id
        string username
        string email
        string password
    }
    
    LISTING {
        ObjectId _id
        string title
        string category
        string status
        number value
        ObjectId owner_id
    }
    
    TRADE {
        ObjectId _id
        ObjectId initiator_id
        ObjectId receiver_id
        ObjectId listing_init_id
        ObjectId listing_recv_id
        string status
        date createdAt
    }
```

#### Data Flow Diagram (DFD Level 0)
Shows the high-level flow of data through the system.

```mermaid
graph LR
    User[User] -- " Credentials " --> Auth[Authentication Process]
    Auth -- " Token " --> User
    
    User -- " Listing Details " --> Inv[Inventory Management]
    Inv -- " Search Query " --> DB[(Database)]
    DB -- " Listing Data " --> Inv
    
    User -- " Trade Proposal " --> Trade[Trade System]
    Trade -- " Update Status " --> DB
    DB -- " History/Status " --> Trade
    Trade -- " Notification " --> User
```

## 📦 Installation & Run

### Prerequisites
- Node.js (v14+)
- MongoDB (Running locally or a Cloud URI)

### 1. Backend Setup
```bash
cd server
npm install
# Create a .env file based on strict requirements or use default:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/barter-app
# JWT_SECRET=your_secret_key
npm run dev
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```

## 🤝 Contributing
Self-project for portfolio/learning purposes.

## 📄 License
MIT
