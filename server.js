const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Load environment variables
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Schema Definitions
const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    duration: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const studentSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    dateOfBirth: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now }
});

const teacherSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    bio: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const lessonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    duration: { type: String, required: true },
    order: { type: Number, required: true },
    videoUrl: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const feedbackSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Models
const Course = mongoose.model('Course', courseSchema);
const Student = mongoose.model('Student', studentSchema);
const Teacher = mongoose.model('Teacher', teacherSchema);
const Lesson = mongoose.model('Lesson', lessonSchema);
const Feedback = mongoose.model('Feedback', feedbackSchema);

// Routes for Courses
app.get('/api/courses', async (req, res) => {
    try {
        const courses = await Course.find().populate('instructor');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/courses', async (req, res) => {
    try {
        const course = new Course(req.body);
        await course.save();
        res.status(201).json(course);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/courses/:id', async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(course);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/api/courses/:id', async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        res.json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Routes for Students
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find().populate('enrolledCourses');
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/students', async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/students/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(student);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/api/students/:id', async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Routes for Teachers
app.get('/api/teachers', async (req, res) => {
    try {
        const teachers = await Teacher.find();
        res.json(teachers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/teachers', async (req, res) => {
    try {
        const teacher = new Teacher(req.body);
        await teacher.save();
        res.status(201).json(teacher);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/teachers/:id', async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(teacher);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/api/teachers/:id', async (req, res) => {
    try {
        await Teacher.findByIdAndDelete(req.params.id);
        res.json({ message: 'Teacher deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Routes for Lessons
app.get('/api/lessons', async (req, res) => {
    try {
        const lessons = await Lesson.find().populate('course');
        res.json(lessons);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/lessons', async (req, res) => {
    try {
        const lesson = new Lesson(req.body);
        await lesson.save();
        res.status(201).json(lesson);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/lessons/:id', async (req, res) => {
    try {
        const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(lesson);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/api/lessons/:id', async (req, res) => {
    try {
        await Lesson.findByIdAndDelete(req.params.id);
        res.json({ message: 'Lesson deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Routes for Feedback
app.get('/api/feedback', async (req, res) => {
    try {
        const feedback = await Feedback.find().populate('student').populate('course');
        res.json(feedback);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/feedback', async (req, res) => {
    try {
        const feedback = new Feedback(req.body);
        await feedback.save();
        res.status(201).json(feedback);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/feedback/:id', async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(feedback);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/api/feedback/:id', async (req, res) => {
    try {
        await Feedback.findByIdAndDelete(req.params.id);
        res.json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Enrollment Routes - Connect Students with Courses
app.post('/api/students/:studentId/enroll/:courseId', async (req, res) => {
    try {
        const student = await Student.findById(req.params.studentId);
        const course = await Course.findById(req.params.courseId);

        if (!student || !course) {
            return res.status(404).json({ error: 'Student or course not found' });
        }

        if (!student.enrolledCourses.includes(req.params.courseId)) {
            student.enrolledCourses.push(req.params.courseId);
            await student.save();
        }

        res.json({ message: 'Student enrolled successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/students/:studentId/unenroll/:courseId', async (req, res) => {
    try {
        const student = await Student.findById(req.params.studentId);

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        student.enrolledCourses = student.enrolledCourses.filter(
            courseId => courseId.toString() !== req.params.courseId
        );
        await student.save();

        res.json({ message: 'Student unenrolled successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/students/:studentId/courses', async (req, res) => {
    try {
        const student = await Student.findById(req.params.studentId).populate('enrolledCourses');

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json(student.enrolledCourses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});