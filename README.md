Mini Project Management API

A simple Node.js + MySQL REST API for managing Users, Projects, Tasks, and Comments.

Tech Stack: Node.js (Express), MySQL (mysql2/promise), UUID, dotenv

Installation:
1. git clone https://github.com/Mayanks-01/Mini-Project-Management-API
2. cd Mini-Project-Management-API
3. npm install

Setup:

Create your .env file:

DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=projectdb
PORT=5000


Run SQL schema:

mysql -u root -p projectdb < sql/schema.sql

▶️ Run Server
npm run dev


Server will start at:http://localhost:3000

1. Create User
POST /users
Body:{ "name": "John Doe", "email": "john@example.com" }

2. Create Project
POST /projects
Body: { "name": "Project A", "description": "Test", "owner_id": "UUID" }

3. Create Task
POST /tasks
Body:
{
  "project_id": "UUID",
  "title": "Task title",
  "description": "Task description",
  "assigned_to": "UUID"
}

4. Add Comment
POST /tasks/:id/comments
Body:{ "user_id": "UUID", "message": "Comment text" }

5. List Tasks
GET /tasks?project_id=&status=&assigned_to=&page=1&limit=10

Returns task with:

Project name

Assigned user name

Latest comment
