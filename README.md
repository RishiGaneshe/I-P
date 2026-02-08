# 🚀 Developer Profile Backend System

A production-style backend system to manage and showcase a developer profile, skills, projects, and work experience with search, pagination, and update capabilities.

Designed with clean architecture, optimized queries, and production-level backend practices.

---

# 🧠 Tech Stack

## Backend
- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- Redis (connection ready)

## Security & Middleware
- Basic Authentication (protected write APIs)
- Rate Limiting
- Input validation & normalization
- Transaction-safe updates
- Centralized error handling

## DevOps
- GitHub Actions CI/CD
- PM2 process manager
- SSH auto deployment ready

---

# 🗄️ Database Design

## Profile
Stores primary developer information.

| Field | Type |
|------|------|
| id | uuid |
| name | string |
| email | unique |
| education | text |
| github | string |
| linkedin | string |
| portfolio | string |

## Skills
| Field | Type |
|------|------|
| id | uuid |
| profileId | fk |
| name | indexed |

## Projects
| Field | Type |
|------|------|
| id | uuid |
| profileId | fk |
| title | indexed |
| description | text |

## Project Links
| Field | Type |
|------|------|
| id | uuid |
| projectId | fk |
| label | string |
| url | string |

## Work Experience
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
- Transaction-safe profile updates
- Centralized error handling

---

# 📡 API Endpoints

## Base URL
http://localhost:3000


---

# 🧑 Profile APIs

## 1. Get Profile
Fetch full developer profile with skills, projects and experience.

**Endpoint**
GET /api/profile


**Success Response**
```json
{
  "success": true,
  "data": { }
}
2. Create Profile (Protected)
Create developer profile with skills, projects and experience.

Endpoint

POST /api/profile
Auth Required

Basic Authentication
Request Body

{
  "name": "Abhishek",
  "email": "dev@email.com",
  "education": "B.Tech",
  "github": "github.com/dev",
  "linkedin": "linkedin.com/in/dev",
  "portfolio": "dev.com"
}
Success Response

{
  "success": true,
  "message": "profile created",
  "data": { }
}
3. Update Profile
Update profile, skills, projects or experience.

Endpoint

PUT /api/profile
Request Body

{
  "name": "Updated Name",
  "education": "Updated Education"
}
Success Response

{
  "success": true,
  "message": "profile updated",
  "data": { }
}
🔍 Search & Discovery APIs
4. Get Projects by Skill
Returns projects filtered by skill with pagination.

Endpoint

GET /api/projects?skill=node&page=1&limit=10
Query Params

Param	Required	Description
skill	Yes	Skill name
page	No	Page number
limit	No	Records per page
Success Response

{
  "success": true,
  "page": 1,
  "count": 25,
  "data": [ ]
}
5. Top Skills
Returns most used skills across projects.

Endpoint

GET /api/skills/top
Success Response

{
  "success": true,
  "data": [ ]
}
6. Global Search
Search across profile, skills and projects.

Endpoint

GET /api/search?q=node&page=1&limit=10
Query Params

Param	Required	Description
q	Yes	Search keyword
page	No	Page number
limit	No	Records per page
Success Response

{
  "success": true,
  "page": 1,
  "count": 12,
  "data": [ ]
}
🌐 UI Route
Load Profile Page
Server-rendered profile UI.

Endpoint

GET /
Returns rendered developer portfolio page.

⚙️ Pagination Logic
Standard pagination supported on search endpoints.

Param	Default
page	1
limit	10
offset	calculated internally