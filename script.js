// Global variables
let currentEditId = null;
let currentEditType = null;

// API base URL
const API_BASE_URL = '/api';

// Show/hide tabs
function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));

    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Show selected tab content
    document.getElementById(tabName).classList.add('active');

    // Add active class to clicked tab
    event.target.classList.add('active');

    // Load data for the selected tab
    loadData(tabName);
}

// Utility functions
function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = type;
    messageDiv.textContent = message;

    const container = document.querySelector('.container');
    container.insertBefore(messageDiv, container.firstChild);

    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

function resetForm(formId) {
    document.getElementById(formId).reset();
    currentEditId = null;
    currentEditType = null;

    // Reset submit button text
    const submitBtn = document.querySelector(`#${formId} button[type="submit"]`);
    if (submitBtn) {
        submitBtn.textContent = submitBtn.textContent.replace('Update', 'Save');
    }
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}

// API calls
async function apiCall(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API call error:', error);
        showMessage(`Error: ${error.message}`, 'error');
        throw error;
    }
}

// Load data functions
async function loadData(type) {
    switch (type) {
        case 'courses':
            await Promise.all([loadCourses(), loadTeachersForSelect()]);
            break;
        case 'students':
            await Promise.all([loadStudents(), loadStudentsForEnrollment(), loadCoursesForEnrollment()]);
            break;
        case 'teachers':
            await loadTeachers();
            break;
        case 'lessons':
            await Promise.all([loadLessons(), loadCoursesForSelect()]);
            break;
        case 'feedback':
            await Promise.all([loadFeedback(), loadStudentsForSelect(), loadCoursesForSelect('feedbackCourse')]);
            break;
    }
}

// Course functions
async function loadCourses() {
    try {
        const courses = await apiCall('/courses');
        const tbody = document.querySelector('#coursesTable tbody');

        if (courses.length === 0) {
            tbody.innerHTML = '<tr class="no-data"><td colspan="6">No courses found</td></tr>';
            return;
        }

        tbody.innerHTML = courses.map(course => `
            <tr>
                <td>${course.title}</td>
                <td>${course.category}</td>
                <td>${course.duration}</td>
                <td>$${course.price}</td>
                <td>${course.instructor ? `${course.instructor.firstName} ${course.instructor.lastName}` : 'Not assigned'}</td>
                <td class="actions">
                    <button class="btn btn-small" onclick="editCourse('${course._id}')">Edit</button>
                    <button class="btn btn-danger btn-small" onclick="deleteCourse('${course._id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

async function loadTeachersForSelect() {
    try {
        const teachers = await apiCall('/teachers');
        const select = document.getElementById('courseInstructor');

        select.innerHTML = '<option value="">Select Instructor</option>' +
            teachers.map(teacher => `
                <option value="${teacher._id}">${teacher.firstName} ${teacher.lastName}</option>
            `).join('');
    } catch (error) {
        console.error('Error loading teachers for select:', error);
    }
}

async function editCourse(id) {
    try {
        const courses = await apiCall('/courses');
        const course = courses.find(c => c._id === id);

        if (course) {
            document.getElementById('courseTitle').value = course.title;
            document.getElementById('courseCategory').value = course.category;
            document.getElementById('courseDuration').value = course.duration;
            document.getElementById('coursePrice').value = course.price;
            document.getElementById('courseDescription').value = course.description;
            document.getElementById('courseInstructor').value = course.instructor?._id || '';

            currentEditId = id;
            currentEditType = 'course';

            document.querySelector('#courseForm button[type="submit"]').textContent = 'Update Course';
        }
    } catch (error) {
        console.error('Error editing course:', error);
    }
}

async function deleteCourse(id) {
    if (confirm('Are you sure you want to delete this course?')) {
        try {
            await apiCall(`/courses/${id}`, 'DELETE');
            showMessage('Course deleted successfully');
            loadCourses();
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    }
}

// Student functions
async function loadStudents() {
    try {
        const students = await apiCall('/students');
        const tbody = document.querySelector('#studentsTable tbody');

        if (students.length === 0) {
            tbody.innerHTML = '<tr class="no-data"><td colspan="6">No students found</td></tr>';
            return;
        }

        tbody.innerHTML = students.map(student => `
            <tr>
                <td>${student.firstName} ${student.lastName}</td>
                <td>${student.email}</td>
                <td>${student.phone}</td>
                <td>${formatDate(student.dateOfBirth)}</td>
                <td>
                    <span class="badge">${student.enrolledCourses?.length || 0} courses</span>
                </td>
                <td class="actions">
                    <button class="btn btn-small" onclick="editStudent('${student._id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-small" onclick="deleteStudent('${student._id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading students:', error);
    }
}

async function editStudent(id) {
    try {
        const students = await apiCall('/students');
        const student = students.find(s => s._id === id);

        if (student) {
            document.getElementById('studentFirstName').value = student.firstName;
            document.getElementById('studentLastName').value = student.lastName;
            document.getElementById('studentEmail').value = student.email;
            document.getElementById('studentPhone').value = student.phone;
            document.getElementById('studentDOB').value = student.dateOfBirth.split('T')[0];

            currentEditId = id;
            currentEditType = 'student';

            document.querySelector('#studentForm button[type="submit"]').textContent = 'Update Student';
        }
    } catch (error) {
        console.error('Error editing student:', error);
    }
}

async function deleteStudent(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        try {
            await apiCall(`/students/${id}`, 'DELETE');
            showMessage('Student deleted successfully');
            loadStudents();
        } catch (error) {
            console.error('Error deleting student:', error);
        }
    }
}

// Teacher functions
async function loadTeachers() {
    try {
        const teachers = await apiCall('/teachers');
        const tbody = document.querySelector('#teachersTable tbody');

        if (teachers.length === 0) {
            tbody.innerHTML = '<tr class="no-data"><td colspan="6">No teachers found</td></tr>';
            return;
        }

        tbody.innerHTML = teachers.map(teacher => `
            <tr>
                <td>${teacher.firstName} ${teacher.lastName}</td>
                <td>${teacher.email}</td>
                <td>${teacher.phone}</td>
                <td>${teacher.specialization}</td>
                <td>${teacher.experience} years</td>
                <td class="actions">
                    <button class="btn btn-small" onclick="editTeacher('${teacher._id}')">Edit</button>
                    <button class="btn btn-danger btn-small" onclick="deleteTeacher('${teacher._id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading teachers:', error);
    }
}

async function editTeacher(id) {
    try {
        const teachers = await apiCall('/teachers');
        const teacher = teachers.find(t => t._id === id);

        if (teacher) {
            document.getElementById('teacherFirstName').value = teacher.firstName;
            document.getElementById('teacherLastName').value = teacher.lastName;
            document.getElementById('teacherEmail').value = teacher.email;
            document.getElementById('teacherPhone').value = teacher.phone;
            document.getElementById('teacherSpecialization').value = teacher.specialization;
            document.getElementById('teacherExperience').value = teacher.experience;
            document.getElementById('teacherBio').value = teacher.bio || '';

            currentEditId = id;
            currentEditType = 'teacher';

            document.querySelector('#teacherForm button[type="submit"]').textContent = 'Update Teacher';
        }
    } catch (error) {
        console.error('Error editing teacher:', error);
    }
}

async function deleteTeacher(id) {
    if (confirm('Are you sure you want to delete this teacher?')) {
        try {
            await apiCall(`/teachers/${id}`, 'DELETE');
            showMessage('Teacher deleted successfully');
            loadTeachers();
        } catch (error) {
            console.error('Error deleting teacher:', error);
        }
    }
}

// Lesson functions
async function loadLessons() {
    try {
        const lessons = await apiCall('/lessons');
        const tbody = document.querySelector('#lessonsTable tbody');

        if (lessons.length === 0) {
            tbody.innerHTML = '<tr class="no-data"><td colspan="6">No lessons found</td></tr>';
            return;
        }

        tbody.innerHTML = lessons.map(lesson => `
            <tr>
                <td>${lesson.title}</td>
                <td>${lesson.course ? lesson.course.title : 'Course not found'}</td>
                <td>${lesson.duration}</td>
                <td>${lesson.order}</td>
                <td>${lesson.videoUrl ? `<a href="${lesson.videoUrl}" target="_blank">View</a>` : 'N/A'}</td>
                <td class="actions">
                    <button class="btn btn-small" onclick="editLesson('${lesson._id}')">Edit</button>
                    <button class="btn btn-danger btn-small" onclick="deleteLesson('${lesson._id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading lessons:', error);
    }
}

async function loadCoursesForSelect(selectId = 'lessonCourse') {
    try {
        const courses = await apiCall('/courses');
        const select = document.getElementById(selectId);

        select.innerHTML = '<option value="">Select Course</option>' +
            courses.map(course => `
                <option value="${course._id}">${course.title}</option>
            `).join('');
    } catch (error) {
        console.error('Error loading courses for select:', error);
    }
}

async function editLesson(id) {
    try {
        const lessons = await apiCall('/lessons');
        const lesson = lessons.find(l => l._id === id);

        if (lesson) {
            document.getElementById('lessonTitle').value = lesson.title;
            document.getElementById('lessonContent').value = lesson.content;
            document.getElementById('lessonCourse').value = lesson.course?._id || '';
            document.getElementById('lessonDuration').value = lesson.duration;
            document.getElementById('lessonOrder').value = lesson.order;
            document.getElementById('lessonVideoUrl').value = lesson.videoUrl || '';

            currentEditId = id;
            currentEditType = 'lesson';

            document.querySelector('#lessonForm button[type="submit"]').textContent = 'Update Lesson';
        }
    } catch (error) {
        console.error('Error editing lesson:', error);
    }
}

async function deleteLesson(id) {
    if (confirm('Are you sure you want to delete this lesson?')) {
        try {
            await apiCall(`/lessons/${id}`, 'DELETE');
            showMessage('Lesson deleted successfully');
            loadLessons();
        } catch (error) {
            console.error('Error deleting lesson:', error);
        }
    }
}

// Feedback functions
async function loadFeedback() {
    try {
        const feedback = await apiCall('/feedback');
        const tbody = document.querySelector('#feedbackTable tbody');

        if (feedback.length === 0) {
            tbody.innerHTML = '<tr class="no-data"><td colspan="6">No feedback found</td></tr>';
            return;
        }

        tbody.innerHTML = feedback.map(fb => `
            <tr>
                <td>${fb.student ? `${fb.student.firstName} ${fb.student.lastName}` : 'Student not found'}</td>
                <td>${fb.course ? fb.course.title : 'Course not found'}</td>
                <td>${'★'.repeat(fb.rating)}${'☆'.repeat(5 - fb.rating)} (${fb.rating})</td>
                <td>${fb.comment}</td>
                <td>${formatDate(fb.createdAt)}</td>
                <td class="actions">
                    <button class="btn btn-small" onclick="editFeedback('${fb._id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger btn-small" onclick="deleteFeedback('${fb._id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading feedback:', error);
    }
}

async function loadStudentsForSelect() {
    try {
        const students = await apiCall('/students');
        const select = document.getElementById('feedbackStudent');

        select.innerHTML = '<option value="">Select Student</option>' +
            students.map(student => `
                <option value="${student._id}">${student.firstName} ${student.lastName}</option>
            `).join('');
    } catch (error) {
        console.error('Error loading students for select:', error);
    }
}

async function editFeedback(id) {
    try {
        const feedback = await apiCall('/feedback');
        const fb = feedback.find(f => f._id === id);

        if (fb) {
            document.getElementById('feedbackStudent').value = fb.student?._id || '';
            document.getElementById('feedbackCourse').value = fb.course?._id || '';
            document.getElementById('feedbackRating').value = fb.rating;
            document.getElementById('feedbackComment').value = fb.comment;

            currentEditId = id;
            currentEditType = 'feedback';

            document.querySelector('#feedbackForm button[type="submit"]').textContent = 'Update Feedback';
        }
    } catch (error) {
        console.error('Error editing feedback:', error);
    }
}

async function deleteFeedback(id) {
    if (confirm('Are you sure you want to delete this feedback?')) {
        try {
            await apiCall(`/feedback/${id}`, 'DELETE');
            showMessage('Feedback deleted successfully');
            loadFeedback();
        } catch (error) {
            console.error('Error deleting feedback:', error);
        }
    }
}

// Form submission handlers
document.addEventListener('DOMContentLoaded', function () {
    // Course form
    document.getElementById('courseForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());

        try {
            if (currentEditId && currentEditType === 'course') {
                await apiCall(`/courses/${currentEditId}`, 'PUT', data);
                showMessage('Course updated successfully');
            } else {
                await apiCall('/courses', 'POST', data);
                showMessage('Course created successfully');
            }

            resetForm('courseForm');
            loadCourses();
        } catch (error) {
            console.error('Error saving course:', error);
        }
    });

    // Student form
    document.getElementById('studentForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());

        try {
            if (currentEditId && currentEditType === 'student') {
                await apiCall(`/students/${currentEditId}`, 'PUT', data);
                showMessage('Student updated successfully');
            } else {
                await apiCall('/students', 'POST', data);
                showMessage('Student created successfully');
            }

            resetForm('studentForm');
            loadStudents();
        } catch (error) {
            console.error('Error saving student:', error);
        }
    });

    // Teacher form
    document.getElementById('teacherForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());

        try {
            if (currentEditId && currentEditType === 'teacher') {
                await apiCall(`/teachers/${currentEditId}`, 'PUT', data);
                showMessage('Teacher updated successfully');
            } else {
                await apiCall('/teachers', 'POST', data);
                showMessage('Teacher created successfully');
            }

            resetForm('teacherForm');
            loadTeachers();
        } catch (error) {
            console.error('Error saving teacher:', error);
        }
    });

    // Lesson form
    document.getElementById('lessonForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());

        try {
            if (currentEditId && currentEditType === 'lesson') {
                await apiCall(`/lessons/${currentEditId}`, 'PUT', data);
                showMessage('Lesson updated successfully');
            } else {
                await apiCall('/lessons', 'POST', data);
                showMessage('Lesson created successfully');
            }

            resetForm('lessonForm');
            loadLessons();
        } catch (error) {
            console.error('Error saving lesson:', error);
        }
    });

    // Feedback form
    document.getElementById('feedbackForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());

        try {
            if (currentEditId && currentEditType === 'feedback') {
                await apiCall(`/feedback/${currentEditId}`, 'PUT', data);
                showMessage('Feedback updated successfully');
            } else {
                await apiCall('/feedback', 'POST', data);
                showMessage('Feedback created successfully');
            }

            resetForm('feedbackForm');
            loadFeedback();
        } catch (error) {
            console.error('Error saving feedback:', error);
        }
    });

    // Load initial data
    loadData('courses');
});

// Enrollment Functions
async function loadStudentsForEnrollment() {
    try {
        const students = await apiCall('/students');
        const select = document.getElementById('enrollStudent');

        select.innerHTML = '<option value="">Choose a student</option>' +
            students.map(student => `
                <option value="${student._id}">${student.firstName} ${student.lastName}</option>
            `).join('');
    } catch (error) {
        console.error('Error loading students for enrollment:', error);
    }
}

async function loadCoursesForEnrollment() {
    try {
        const courses = await apiCall('/courses');
        const select = document.getElementById('enrollCourse');

        select.innerHTML = '<option value="">Choose a course</option>' +
            courses.map(course => `
                <option value="${course._id}">${course.title}</option>
            `).join('');
    } catch (error) {
        console.error('Error loading courses for enrollment:', error);
    }
}

async function enrollStudent() {
    const studentId = document.getElementById('enrollStudent').value;
    const courseId = document.getElementById('enrollCourse').value;

    if (!studentId || !courseId) {
        showMessage('Please select both a student and a course', 'error');
        return;
    }

    try {
        await apiCall(`/students/${studentId}/enroll/${courseId}`, 'POST');
        showMessage('Student enrolled successfully!');

        // Reset the form
        document.getElementById('enrollStudent').value = '';
        document.getElementById('enrollCourse').value = '';

        // Reload students data to show updated enrollments
        loadStudents();
    } catch (error) {
        console.error('Error enrolling student:', error);
    }
}

async function unenrollStudent() {
    const studentId = document.getElementById('enrollStudent').value;
    const courseId = document.getElementById('enrollCourse').value;

    if (!studentId || !courseId) {
        showMessage('Please select both a student and a course', 'error');
        return;
    }

    if (!confirm('Are you sure you want to unenroll this student from the course?')) {
        return;
    }

    try {
        await apiCall(`/students/${studentId}/unenroll/${courseId}`, 'DELETE');
        showMessage('Student unenrolled successfully!');

        // Reset the form
        document.getElementById('enrollStudent').value = '';
        document.getElementById('enrollCourse').value = '';

        // Reload students data to show updated enrollments
        loadStudents();
    } catch (error) {
        console.error('Error unenrolling student:', error);
    }
}