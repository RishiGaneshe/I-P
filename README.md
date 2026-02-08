# 🚀 Developer Profile Backend System

A production-style backend system to manage and showcase a developer profile, skills, projects, and work experience with search, pagination, update capabilities, and CI/CD deployment.

This project demonstrates clean backend architecture, optimized queries, and production-level practices.

---

# 🧠 Tech Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- Redis (connection ready)

### Security & Middleware
- Basic Authentication
- Rate Limiting
- Transaction-safe updates
- Input normalization & validation

### DevOps
- GitHub Actions CI/CD
- PM2 process manager
- SSH auto deployment

---

# 🗄️ Database Design

## Profile
Stores primary profile information.

| Field | Type |
|------|------|
id | uuid |
name | string |
email | unique |
education | text |
github | string |
linkedin | string |
portfolio | string |

## Skills
| Field | Type |
|------|------|
id | uuid |
profileId | fk |
name | indexed |

## Projects
| Field | Type |
|------|------|
id | uuid |
profileId | fk |
title | indexed |
description | text |

## Project Links
| Field | Type |
|------|------|
id | uuid |
projectId | fk |
label | string |
url | string |

## Work Experience
| Field | Type |
|------|------|
id | uuid |
profileId | fk |
company | string |
role | string |
description | text |

---

# 🔐 Security Features

- Basic auth protected APIs
- Rate limiting enabled
- SQL injection safe queries
- Transaction-safe updates
- Email uniqueness enforced

---

# 📡 API Endpoints

Base URL:
