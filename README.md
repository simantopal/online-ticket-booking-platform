# TicketBari - Online Ticket Booking Platform

## Purpose

TicketBari is a full-stack online ticket booking platform where users can discover events, book tickets, and make secure payments. Vendors can create and manage events, while administrators oversee platform activities, approve events, and manage advertisements.

## Live URL

Frontend: https://your-frontend-url.vercel.app

Backend: https://your-backend-url.vercel.app

## Key Features

### User Features
- User authentication with Better Auth
- Browse all available events/tickets
- Search, filter, sort, and paginate tickets
- View detailed event information
- Book tickets securely
- Stripe payment integration
- Manage personal bookings
- Responsive design for all devices
- Dark and Light mode support

### Vendor Features
- Create new events/tickets
- Update and delete own tickets
- View ticket sales and revenue statistics
- Manage event bookings
- Upload event images using ImgBB

### Admin Features
- Manage all users
- Approve or reject vendor events
- Manage advertisements
- View platform analytics
- Role-based dashboard access

### Security Features
- JWT protected APIs
- Role-based authorization
- Protected routes and dashboards
- Secure authentication using Better Auth

## Technologies Used

### Frontend
- Next.js 15
- React
- Tailwind CSS
- HeroUI
- Better Auth
- Axios
- React Hook Form
- React Hot Toast
- Recharts
- Next Themes
- SweetAlert2


## NPM Packages Used

### Frontend Packages

```bash
@heroui/react
@heroui/theme
@tanstack/react-query
axios
better-auth
next
react
react-dom
react-hook-form
react-hot-toast
recharts
sweetalert2
next-themes
```

## Installation

### Clone the Repository

```bash
git clone https://github.com/simantopal/online-ticket-booking-platform.git
git clone https://github.com/simantopal/ticketbari-server.git
```

### Install Dependencies

```bash
npm install
```

### Run Frontend

```bash
npm run dev
```

### Run Backend

```bash
nodemon index.js
```
## Project Status

Completed as a full-stack MERN assessment project with authentication, ticket booking, payment integration, role-based dashboards, and admin management functionalities.