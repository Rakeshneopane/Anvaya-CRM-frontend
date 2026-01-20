# Anvaya CRM System  

A full-stack Customer Relationship Management (CRM) application that helps manage customers, leads, and interactions efficiently.  
Users can add, view, edit, and track customers, manage leads, and monitor follow-ups through a secure dashboard.

Built with a React frontend, Express/Node backend, MongoDB database.

---

## 🌐 Demo Link  

**Live Demo:** ``` https://crm-frontend-ten-nu.vercel.app/ ```

---

## ⚡ Quick Start  

```bash
git clone https://github.com/Rakeshneopane/CRM-frontend.git
cd my CRM frontend
npm install
npm run dev 
```
---

## Technologies
- React JS
- React Router
- Node.js
- Express
- MongoDB

---

## 🎥 Demo Video

### Watch a walkthrough covering all major features of this CRM:
- Loom Video Link: https://loom.com/your-video-link

---

## ✨ Features

### Dashboard
- Overview of total leads, agents and follow-ups
- Recent activity and quick actions

### Lead Management
- View a list of all leads
- Search customers by name or email in real time
- Add new customers with contact details
- Create and track leads
- Update lead status (New, Contacted, Converted, Lost)
- Assign notes and follow-up dates
- Lead Details
- View complete customer information
- Edit customer details
- View interaction history and notes


---

## 📡 API Reference

- GET /api/leads
- Retrieve all leads

- Sample Response: 
```
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
```

- GET /api/customers/:id <br>
Get details of a single customer

- POST /api/lead <br>
Create a new lead (protected)

---

## Contact

For bugs, feedback, or feature requests, please reach out to:
📧 rakeshneopane@gmail.com or lucasneopane123@gmail.com

---

## Future Improvements
- JWT based Authentication
- Role-based access control (Admin, Sales, Support)
- Email and notification reminders for follow-ups
- Advanced analytics and reporting dashboard
- Import/export customers via CSV

---

## Screen Shots

![alt text](image1.png)