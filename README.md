# Anvaya CRM – Frontend Application

This repository contains the **frontend application** for the **Anvaya CRM system**.  
It is built using **React.js** and provides a user interface for managing **leads, sales agents, reports, and CRM workflows**.

The frontend communicates with the backend APIs to fetch and manage CRM data.

---

## 🚀 Features

- Single Page Application built with React
- Lead management (add, list, and filter leads)
- Sales agent management
- Reports and dashboard views
- Global state management using Context API
- Reusable component-based UI
- Responsive sidebar and mobile-friendly layout
- Backend API integration

---

## 🛠️ Tech Stack

- **Library:** React.js  
- **State Management:** Context API  
- **Routing:** React Router  
- **Styling:** CSS  
- **Build Tool:** Vite  
- **API Communication:** Fetch API  

---

## Base URL
```
http://localhost:3000/api
```
## Getting Started|

**Clone the repository**
```
git clone <your-frontend-repo-url>
```
**install Dependency**
```
npm install
```
**Run the Application**
```
npm run dev
```
**Application available at**
```
http://localhost:5173
```

## API Integration

**API base url**
```
/api
```

Example:
```
/api/leads
/api/agents
/api/tags
/api/reports

```
---
## Application Flow

- The React application starts from main.jsx
- Global state is initialized using Context Providers
- Pages fetch data from backend APIs
- Components render data and handle user interactions
- UI updates automatically based on state changes

---

👨‍💻 Author

Rakesh Neopane
Frontend Developer