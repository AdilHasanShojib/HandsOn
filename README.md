HandsOn - Community-Driven Social Volunteering Platform



📌 About the Project

HandsOn is a community-driven social volunteering platform that allows users to join events, create help requests, form teams, and track their impact. Built with React.js, Node.js (Express.js), MySQL, and JWT authentication, the platform aims to encourage community participation and volunteering efforts.

🚀 Features Implemented

✅ User Authentication

Signup & Login with JWT authentication

Secure password handling with bcrypt

Authorization checks for protected routes

✅ Dashboard

Displays user statistics:

Total Events Joined (from event_attendees table)

Teams Participated (from team_invites table, status: accepted)

Requests Created (from help_requests table)

List of upcoming events (latest 5 events)

Edit Profile button for updating user information

✅ Event Management

View all events

Create new events

Join and leave events

Browse upcoming events

✅ Help Requests

Users can create and manage help requests

Others can browse and offer help

✅ Teams & Group Initiatives

Create and manage teams

Public and private team membership

Team dashboard displaying team activities

Leaderboard showcasing top teams

✅ Messaging System

Users can send messages related to help requests

Secure communication with sender & receiver authentication

🛠️ Tech Stack

Frontend: React.js, Tailwind CSS

Backend: Node.js (Express.js)

Authentication: JWT, bcrypt

Database Management: MySQL



📂 Project Structure

HandsOn/
│── hands-on-backend/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   ├── db.js
│── hands-on-frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.js
│   │   ├── index.js
│── README.md

🔧 Installation & Setup

Backend Setup

Clone the repository:

git clone https://github.com/your-username/hands-on.git
cd hands-on/hands-on-backend

Install dependencies:

npm install

Set up environment variables (.env file):

DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
JWT_SECRET=your_jwt_secret

Run the backend server:

npm start

Frontend Setup

Navigate to the frontend folder:

cd ../hands-on-frontend

Install dependencies:

npm install

Start the development server:
