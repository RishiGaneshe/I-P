<h1 align="center">🚀 Developer Profile Backend System</h1>

<p align="center">
Production-grade backend system to manage and showcase a developer profile, skills, projects and experience.
</p>

<p align="center">
Built with clean architecture, optimized queries, and real production backend practices.
</p>

---

# 🧠 Tech Stack

## ⚙️ Backend
- Node.js  
- Express.js  
- PostgreSQL  
- Sequelize ORM  
- Redis (connection ready)

## 🔐 Security & Middleware
- Basic Authentication (protected write APIs)
- Rate Limiting
- Input validation & normalization
- Transaction-safe updates
- Centralized error handling
- SQL injection safe queries

## 🚀 DevOps
- GitHub Actions CI/CD ready
- PM2 process manager
- SSH auto deployment ready
- Production logging support

---

# 🌐 Base URL

```
https://ip.codewithrishi.fun
```

---

# 🗄️ Database Design

## 👤 Profile
Primary developer information.

| Field | Type |
|------|------|
| id | uuid |
| name | string |
| email | unique |
| education | text |
| github | string |
| linkedin | string |
| portfolio | string |

---

## 🧠 Skills

| Field | Type |
|------|------|
| id | uuid |
| profileId | fk |
| name | indexed |

---

## 💼 Projects

| Field | Type |
|------|------|
| id | uuid |
| profileId | fk |
| title | indexed |
| description | text |

---

## 🔗 Project Links

| Field | Type |
|------|------|
| id | uuid |
| projectId | fk |
| label | string |
| url | string |

---

## 🏢 Work Experience

| Field | Type |
|------|------|
| id | uuid |
| profileId | fk |
| company | string |
| role | string |
| description | text |

---

# 🔐 Security Features

- Protected profile creation via authentication
- Rate limiting enabled
- Input validation & sanitization
- SQL injection safe queries
- Transaction-safe updates
- Centralized error handling
- Safe update operations with rollback support

---

# 📡 API Endpoints

---

# 🧑 Profile APIs

## 1️⃣ Get Profile

Fetch full developer profile with skills, projects and experience.

**Endpoint**
```
GET /api/profile
```

**Success Response**
```json
{
  "success": true,
  "data": {}
}
```

---

## 2️⃣ Create Profile (Protected 🔒)

Create developer profile with skills, projects and experience.

**Endpoint**
```
POST /api/profile
```

**Authentication Required**
```
Basic Auth
```

> ⚠️ This endpoint is protected and cannot be accessed without authentication.

**Request Body**
```json
{
  "name": "Abhishek",
  "email": "dev@email.com",
  "education": "B.Tech",
  "github": "github.com/dev",
  "linkedin": "linkedin.com/in/dev",
  "portfolio": "dev.com"
}
```

**Success Response**
```json
{
  "success": true,
  "message": "profile created",
  "data": {}
}
```

---

## 3️⃣ Update Profile (Protected 🔒)

Update profile, skills, projects or experience.

**Endpoint**
```
PUT /api/profile
```

**Authentication**
```
Basic Auth Required
```

**Request Body**
```json
{
  "name": "Updated Name",
  "education": "Updated Education"
}
```

**Success Response**
```json
{
  "success": true,
  "message": "profile updated",
  "data": {}
}
```

---

# 🔍 Search & Discovery APIs

## 4️⃣ Get Projects by Skill

Returns projects filtered by skill with pagination.

**Endpoint**
```
GET /api/projects?skill=node&page=1&limit=10
```

**Query Params**

| Param | Required | Description |
|------|----------|-------------|
| skill | Yes | Skill name |
| page | No | Page number |
| limit | No | Records per page |

**Success Response**
```json
{
  "success": true,
  "page": 1,
  "count": 25,
  "data": []
}
```

---

## 5️⃣ Top Skills

Returns most used skills across projects.

**Endpoint**
```
GET /api/skills/top
```

**Success Response**
```json
{
  "success": true,
  "data": []
}
```

---

## 6️⃣ Global Search

Search across profile, skills and projects.

**Endpoint**
```
GET /api/search?q=node&page=1&limit=10
```

**Query Params**

| Param | Required | Description |
|------|----------|-------------|
| q | Yes | Search keyword |
| page | No | Page number |
| limit | No | Records per page |

**Success Response**
```json
{
  "success": true,
  "page": 1,
  "count": 12,
  "data": []
}
```

---

# 🌐 UI Route

## Load Profile Portfolio UI

Server-rendered developer portfolio page.

**Endpoint**
```
GET /
```

Returns rendered developer portfolio UI.

---

# ⚙️ Pagination Logic

Standard pagination supported on all search endpoints.

| Param | Default |
|------|---------|
| page | 1 |
| limit | 10 |
| offset | calculated internally |

---

# 🏁 Production Notes

- Built with clean service-repository architecture  
- All writes are transaction-safe  
- Optimized indexed queries  
- Scalable & deployment ready  
- Designed for real production usage  

---

<p align="center">
⭐ Production-grade backend portfolio project
</p>
