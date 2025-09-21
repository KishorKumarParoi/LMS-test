# Learning Management System

A basic Learning Management System built with Node.js, Express, MongoDB, and vanilla JavaScript. This system allows you to perform CRUD operations on 5 main entities: Courses, Students, Teachers, Lessons, and Feedback.

## Features

- **Courses Management**: Create, read, update, and delete courses
- **Students Management**: Manage student information and enrollment
- **Teachers Management**: Handle teacher profiles and specializations
- **Lessons Management**: Organize lessons within courses
- **Feedback System**: Collect and manage student feedback on courses

## Database Schema

The system uses MongoDB with the following collections:

### Courses

- title, description, instructor (ref to Teacher), duration, price, category

### Students

- firstName, lastName, email, phone, enrolledCourses (array of Course refs), dateOfBirth

### Teachers

- firstName, lastName, email, phone, specialization, experience, bio

### Lessons

- title, content, course (ref to Course), duration, order, videoUrl

### Feedback

- student (ref to Student), course (ref to Course), rating (1-5), comment

## Setup Instructions

### Prerequisites

- Node.js (version 14 or higher)
- MongoDB database (local or cloud-based like MongoDB Atlas)

### Installation

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Configure MongoDB Connection**

   - Open `server.js` file
   - Replace the `MONGODB_URI` variable (line 11) with your actual MongoDB connection string:

   ```javascript
   const MONGODB_URI = "your_mongodb_uri_here"; // Replace with your MongoDB URI
   ```

   Example MongoDB connection strings:

   - Local MongoDB: `mongodb://localhost:27017/learning_management_system`
   - MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/learning_management_system?retryWrites=true&w=majority`

3. **Start the Server**

   ```bash
   # For development (with auto-restart)
   npm run dev

   # For production
   npm start
   ```

4. **Access the Application**
   - Open your browser and go to: `http://localhost:3000`

## File Structure

```
├── server.js          # Express server with MongoDB connection and API routes
├── index.html         # Frontend HTML with forms and tables
├── script.js          # Client-side JavaScript for API calls and UI interactions
├── package.json       # Node.js dependencies and scripts
└── README.md          # This file
```

## API Endpoints

### Courses

- GET `/api/courses` - Get all courses
- POST `/api/courses` - Create a new course
- PUT `/api/courses/:id` - Update a course
- DELETE `/api/courses/:id` - Delete a course

### Students

- GET `/api/students` - Get all students
- POST `/api/students` - Create a new student
- PUT `/api/students/:id` - Update a student
- DELETE `/api/students/:id` - Delete a student

### Teachers

- GET `/api/teachers` - Get all teachers
- POST `/api/teachers` - Create a new teacher
- PUT `/api/teachers/:id` - Update a teacher
- DELETE `/api/teachers/:id` - Delete a teacher

### Lessons

- GET `/api/lessons` - Get all lessons
- POST `/api/lessons` - Create a new lesson
- PUT `/api/lessons/:id` - Update a lesson
- DELETE `/api/lessons/:id` - Delete a lesson

### Feedback

- GET `/api/feedback` - Get all feedback
- POST `/api/feedback` - Create new feedback
- PUT `/api/feedback/:id` - Update feedback
- DELETE `/api/feedback/:id` - Delete feedback

## Usage

1. **Start with Teachers**: Create teacher profiles first as they are referenced in courses
2. **Create Courses**: Add courses and assign them to teachers
3. **Add Students**: Register students in the system
4. **Create Lessons**: Add lessons to existing courses
5. **Collect Feedback**: Students can provide feedback on courses they've taken

## Technologies Used

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Database**: MongoDB

## Development

To run in development mode with automatic restart on file changes:

```bash
npm run dev
```

🗺️ Database Schema Relationship Mindmap

                    📚 LEARNING MANAGEMENT SYSTEM
                              │
                              ├─────────────────────────────────────────────┐
                              │                                             │
                    🎓 CORE ENTITIES                              🔗 RELATIONSHIPS
                              │                                             │
                ┌─────────────┼─────────────┐                              │
                │             │             │                              │
          👨‍🏫 TEACHERS    📚 COURSES    👨‍🎓 STUDENTS                    │
                │             │             │                              │
                │             │             │                              │
          ┌─────────┐   ┌─────────────┐   ┌──────────────┐                │
          │ _id     │   │ _id         │   │ _id          │                │
          │ name    │   │ title       │   │ name         │                │
          │ email   │   │ description │   │ email        │                │
          │ phone   │   │ duration    │   │ phone        │                │
          │ subject │   │ price       │   │ age          │                │
          └─────────┘   │ teacherId ──┼───│ enrollments[]│                │
                        └─────────────┘   └──────────────┘                │
                              │                   │                       │
                              │                   │                       │
                        📖 LESSONS          📝 FEEDBACK                   │
                              │                   │                       │
                    ┌─────────────────┐   ┌─────────────────┐             │
                    │ _id             │   │ _id             │             │
                    │ title           │   │ studentId ──────┼─────────────┤
                    │ content         │   │ courseId ───────┼─────────────┤
                    │ duration        │   │ teacherId ──────┼─────────────┤
                    │ courseId ───────┼───│ rating          │             │
                    │ order           │   │ comment         │             │
                    └─────────────────┘   │ createdAt       │             │
                                          └─────────────────┘             │
                                                                          │
                              RELATIONSHIP DETAILS                        │
                                    │                                     │
            ┌───────────────────────┼───────────────────────┐             │
            │                       │                       │             │
    🔗 ONE-TO-MANY           🔗 MANY-TO-MANY        🔗 ONE-TO-MANY       │
            │                       │                       │             │
    ┌───────────────┐       ┌───────────────┐       ┌───────────────┐     │
    │ Teacher → ∞   │       │ Student ↔ ∞   │       │ Course → ∞    │     │
    │ Courses       │       │ Courses       │       │ Lessons       │     │
    │               │       │ (Enrollments) │       │               │     │
    │ Teacher → ∞   │       │               │       │ Course → ∞    │     │
    │ Feedback      │       │ Student → ∞   │       │ Feedback      │     │
    └───────────────┘       │ Feedback      │       └───────────────┘     │
                            └───────────────┘                             │
                                                                          │
                              📊 ENROLLMENT SYSTEM                        │
                                    │                                     │
                    ┌───────────────┼───────────────┐                     │
                    │               │               │                     │
            🎯 ENROLLMENT      📈 TRACKING     🎪 FEATURES               │
                    │               │               │                     │
            ┌───────────────┐ ┌─────────────┐ ┌─────────────┐             │
            │ Students have │ │ Who teaches │ │ Course has  │             │
            │ enrollments[] │ │ what course │ │ multiple    │             │
            │ array with    │ │             │ │ lessons in  │             │
            │ courseId      │ │ Which       │ │ specific    │             │
            │ references    │ │ students    │ │ order       │             │
            │               │ │ enrolled    │ │             │             │
            └───────────────┘ └─────────────┘ └─────────────┘             │
                                                                          │
                              🔍 DATA FLOW                                 │
                                    │                                     │
                    ┌───────────────┼───────────────┐                     │
                    │               │               │                     │
              📝 CREATE        🔄 UPDATE      🗑️ DELETE               │
                    │               │               │                     │
            ┌───────────────┐ ┌─────────────┐ ┌─────────────┐             │
            │ • New Teacher │ │ • Enroll    │ │ • Remove    │             │
            │ • New Course  │ │   Student   │ │   Student   │             │
            │ • New Student │ │ • Update    │ │ • Delete    │             │
            │ • New Lesson  │ │   Profile   │ │   Course    │             │
            │ • New Review  │ │ • Edit Info │ │ • Clean Up  │             │
            └───────────────┘ └─────────────┘ └─────────────┘             │
                                                                          │

## Notes

- Make sure MongoDB is running and accessible with your connection string
- The application uses CORS to allow cross-origin requests
- All forms include client-side validation
- The UI is responsive and works on both desktop and mobile devices
- Data relationships are maintained using MongoDB ObjectIds and Mongoose populate

## Troubleshooting

1. **Connection Error**: Ensure your MongoDB URI is correct and the database is accessible
2. **Port Already in Use**: Change the PORT variable in server.js if port 3000 is occupied
3. **Dependencies Issues**: Delete `node_modules` and run `npm install` again

For any issues or questions, please check the console logs in both the browser and the terminal where the server is running.
