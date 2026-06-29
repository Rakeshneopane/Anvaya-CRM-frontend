# Anvaya CRM System  

A full-stack Customer Relationship Management (CRM) application that helps manage customers, leads, and interactions efficiently.
Users can add, view, edit, and track customers, manage leads, and monitor follow-ups through a secure dashboard.

Built with a React frontend, Node.js/Express backend, and MongoDB database.

---

## Technologies

- React JS
- React Router
- Node.js
- Express
- MongoDB
- JavaScript (ES6+)
- REST APIs
- Bootstrap
- Clerk Authentication

---

## Demo

- **Frontend:** [Live Demo](https://crm-frontend-ten-nu.vercel.app/)
- **Backend API:** [Backend API](https://crm-backend-pi-six.vercel.app/)
- 🎥 **Loom Walkthrough:** [Watch Here](https://www.loom.com/share/01ec0a872c6f4316ad0ecd71b48de80c)

---

## Authentication

This application uses **Clerk Authentication**.

Click **Sign In** to authenticate using your Google account (or email/password if enabled) and access the CRM dashboard.

---

## ⚡ Quick Start

### 1. Clone and run the backend

```bash
git clone https://github.com/Rakeshneopane/Anvaya-CRM-backend.git
cd Anvaya-CRM-backend
npm install
npm run dev
```

### 2. Clone and run the frontend

Open a second terminal:

```bash
git clone https://github.com/Rakeshneopane/Anvaya-CRM-frontend.git
cd Anvaya-CRM-frontend
npm install
npm run dev
```

The frontend communicates with the backend running on `http://localhost:4000`.

---

## 🔐 Environment Setup

### Frontend

Create a `.env` file inside the frontend project:

```env
VITE_API_BASE_URL=http://localhost:4000
```

For production:

```env
VITE_API_BASE_URL=https://crm-backend-pi-six.vercel.app
```

### Backend

Create a `.env` file inside the backend project:

```env
PORT=4000
NODE_ENV=development

MONGODB_URI=your_mongodb_connection_string
```

For production, replace the localhost URLs with your deployed backend URL.

> **Note:**
>
> - Restart the development server after updating the `.env` file.
> - Add `.env` to `.gitignore` to avoid committing sensitive credentials.

---

## ✨ Features

### Dashboard
- Displays an overview of total leads, agents, and follow-ups
- Displays recent activity and quick actions

### Lead Management
- Displays a list of all leads
- Searches customers by name or email in real time
- Adds new customers with contact details
- Creates and tracks leads
- Updates lead status (New, Contacted, Converted, Lost)
- Assigns notes and follow-up dates

### Lead Details
- Displays complete customer information
- Updates customer details
- Displays interaction history and comments

---

## 📡 API Reference

### Agents
- `POST /agents` – Create a new agent
- `GET /agents` – Fetch all agents
- `DELETE /agents/:id` – Delete an agent

### Leads
- `POST /lead` – Create a new lead
- `GET /leads` – Fetch all leads
- `GET /lead/:id` – Fetch lead by ID
- `PUT /lead/:id` – Update lead
- `DELETE /lead/:id` – Delete lead

### Lead Comments
- `POST /lead/:id/comments` – Add a comment
- `GET /lead/:id/comments` – Fetch comments
- `DELETE /lead/:leadId/comments/:commentId` – Delete comment

### Tags
- `POST /tags` – Create a tag
- `GET /tags` – Fetch all tags
- `DELETE /tags/:id` – Delete a tag

### Sample Response (`GET /leads`)
```
{
  "leads": [
    {
      "_id": "6940dd24cde32b58fd39a82e",
      "name": "Mandeep",
      "source": "Website",
      "salesAgent": {
        "_id": "6937a904523abc334872ede1",
        "name": "Rakesh Neopane",
        "email": "rakeshCRM@gmal.com",
        "createdAt": "2025-12-09T04:43:48.979Z",
        "__v": 0
      },
      "status": "Qualified",
      "tags": [
        {
          "_id": "694facd03f1aab1620f17c59",
          "name": "Follow-up",
          "createdAt": "2025-12-27T09:54:24.477Z",
          "__v": 0
        }
      ],
      "timeToClose": 9,
      "priority": "High",
      "createdAt": "2025-12-16T04:16:36.453Z",
      "updatedAt": "2025-12-16T04:16:36.456Z",
      "__v": 0
    }
  ]
}
```

---

## 📷 Screenshots

![DashBoard](./src/assets/image1.png)
![Lead List](./src/assets/image2.png)
![Lead Details](./src/assets/image3.png)
![Reports](./src/assets/image.png)

---

## 🚀 Future Improvements

- Fine-grained role-based access control (Admin, Sales, Support)
- Email and notification reminders for follow-ups
- Advanced analytics and reporting dashboard
- Import/export customers via CSV

---

## 📬 Contact

For bugs, feedback, or feature requests, feel free to reach out:

- 📧 Email: rakeshneopane@gmail.com
- 📧 Alternate Email: lucasneopane123@gmail.com
- 💼 LinkedIn: https://linkedin.com/in/rakesh-neopane
