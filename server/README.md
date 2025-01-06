# **Employee Management System**

## **Table of Contents**
- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Third-Party Integrations](#third-party-integrations)
- [Future Enhancements](#future-enhancements)
- [License](#license)

---

## **Overview**
The **Employee Management System** is a full-stack MERN application designed to manage employee records efficiently. It includes features such as role-based access control, CRUD operations for employees, audit logs, and integrations with Google Calendar and SendGrid for notifications.

---

## **Features**
- **Employee Management:**
  - List, add, edit, and delete employees.
  - Upload and display profile pictures.
  - Search and filter employees by name, department, or status.
  - Audit logs to track changes.
- **Role-Based Access Control (RBAC):**
  - **Admin:** Full access.
  - **Manager:** Restricted to their department.
  - **User:** Read-only access.
- **Third-Party Integrations:**
  - Google Calendar: Schedule employee reviews and probation reminders.
  - SendGrid: Send email notifications for events.
- **Webhook Notifications:**
  - Notify external systems on critical events like employee status updates.

---

## **Technologies Used**
### **Frontend**
- React.js
- React Router DOM
- Axios
- Material-UI (MUI) / CoreUI (for styling)

### **Backend**
- Node.js
- Express.js
- MongoDB (Mongoose)

### **Third-Party APIs**
- Google Calendar API
- SendGrid Email API

---

## **Installation**
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/employee-management-system.git
   cd employee-management-system
