# 🍔 FoodRush - Food Delivery Application

A comprehensive full-stack Food Delivery Platform built with **Spring Boot** and **React**. The platform connects hungry customers with restaurant owners, all overseen by a centralized admin panel.

## 🌟 Key Features

### 👤 For Customers
* **Secure Authentication**: JWT-based login and registration.
* **Browse & Search**: Explore restaurants and search for specific dishes.
* **Smart Filtering**: Filter menu items by category and Veg/Non-Veg preferences.
* **Cart Management**: Add items to your cart, adjust quantities, and checkout seamlessly.
* **Order Tracking**: View order history and track the real-time status of current orders.

### 🏪 For Restaurant Owners
* **Business Profile Management**: Register a restaurant with valid FSSAI License and GST details.
* **Menu Management**: Add, update, and soft-delete menu items with image uploads.
* **Order Fulfillment**: Receive incoming orders and update their status (e.g., *Preparing*, *Out for Delivery*, *Delivered*).
* **Dashboard Analytics**: Track total orders, pending requests, and delivered meals.

### 🛡️ For Administrators
* **Restaurant Verification**: Approve new restaurants before their menus go live to customers.
* **Content Moderation**: Block or suspend restaurants that violate platform policies.
* **Platform Overview**: Access detailed information (Phone, Location, GST, License) for all restaurants on the platform.

---

## 🛠️ Technology Stack

### Backend (Spring Boot)
* **Framework**: Spring Boot 3.x, Spring MVC
* **Security**: Spring Security, JWT (JSON Web Tokens)
* **Database**: MySQL / H2 Database with Spring Data JPA
* **Validation**: Hibernate Validator (`@NotBlank`, `@Pattern`, `@NotNull`)
* **Architecture**: Controller-Service-Repository pattern with DTO mapping

### Frontend (React)
* **Framework**: React 18+ (Vite/Create React App)
* **Styling**: Custom Vanilla CSS, Bootstrap 5 (for grids and basic layout)
* **Routing**: React Router DOM v6
* **State Management**: React Context API (`AuthContext`, `CartContext`)
* **API Client**: Axios with Interceptors for JWT injection
* **Icons & Notifications**: `react-icons`, `react-hot-toast`

---

## 🚀 Getting Started

### Prerequisites
* **Java 17+**
* **Maven / Gradle**
* **Node.js 16+** & **npm/yarn**
* **MySQL** (If not using in-memory DB)

### 1. Setting up the Backend (`app-backend`)
1. Navigate to the backend directory:
   ```bash
   cd app-backend
   ```
2. Update your `application.properties` or `application.yml` with your database credentials.
3. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```
   *The backend will typically start on `http://localhost:8080`.*

### 2. Setting up the Frontend (`app-frontend`)
1. Navigate to the frontend directory:
   ```bash
   cd app-frontend
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
   *(Or `npm run dev` if using Vite). The frontend will start on `http://localhost:3000` or `5173`.*

---

## 🔐 Role-Based Access Control (RBAC)
The application utilizes strict API endpoint protection based on the user's role:
* `ROLE_USER`: Can place orders, manage cart, and view the public menu.
* `ROLE_RESTAURANT_OWNER`: Can manage their specific restaurant and menu, and process orders. Cannot access admin routes or order from themselves.
* `ROLE_ADMIN`: Can verify/block restaurants and view global platform data. Cannot place orders.

## 🎨 Design Philosophy
The frontend features a modern, "glassmorphism" inspired light theme. It utilizes a vibrant purple primary color palette (`#7c3aed`), smooth micro-animations on hover, and responsive grids to ensure a premium user experience across both desktop and mobile devices.

---
*Built with ❤️ for seamless food delivery experiences.*
