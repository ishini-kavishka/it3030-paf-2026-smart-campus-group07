# it3030-paf-2026-smart-campus-group07
spring boot for campus management 
# 🎓 Smart Campus Operations Hub

**IT3030 – PAF Assignment 2026**

---

## 📌 Overview

A full-stack web application to manage university resources and maintenance operations.

Users can:

* Book rooms and equipment
* Report incidents
* Track status updates
* Receive notifications

Admins can manage resources, bookings, and tickets.

---

## 🛠️ Tech Stack

* **Backend:** Spring Boot (REST API)
* **Frontend:** React.js
* **Database:** MySQL / MongoDB
* **Tools:** GitHub, Postman

---

## 🚀 Key Features

* Resource management (CRUD)
* Booking system with approval workflow
* Conflict prevention for bookings
* Incident ticket system with image upload
* Notification system
* Role-based authentication (USER, ADMIN)

---

## 🏗️ Architecture

```text
React Frontend → Spring Boot API → Database
```

---

## ⚙️ Setup

### Backend

```bash
mvn spring-boot:run
```

### Frontend

```bash
npm install
npm start
```

---

## 🔗 API (Sample)

* `POST /bookings`
* `GET /resources`
* `POST /tickets`

---

## 👥 Team Contribution

* **Member 1:** Resources module
* **Member 2:** Booking module
* **Member 3:** Ticket module
* **Member 4:** Auth & Notifications

