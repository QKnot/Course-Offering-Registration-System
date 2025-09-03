// Course data storage
let courseData = {};
let courseRowCount = 0;

// Form validation utilities
class FormUtils {
    static validateRequiredFields() {
        const requiredFields = [
            { id: 'program', name: 'Program' },
            { id: 'semester', name: 'Semester' },
            { id: 'studentName', name: 'Student Name' },
            { id: 'studentId', name: 'Student ID' },
            { id: 'semesterSection', name: 'Semester Section' },
            { id: 'advisorName', name: 'Advisor Name' },
            { id: 'guardianPhone', name: 'Guardian Contact' },
            { id: 'studentPhone', name: 'Student Contact' },
            { id: 'bloodGroup', name: 'Blood Group' }
        ];

        for (let field of requiredFields) {
            const element = document.getElementById(field.id);
            if (!element || !element.value.trim()) {
                alert(`Please fill in the ${field.name} field.`);
                if (element) element.focus();
                return false;
            }
        }

        // Check if at least one course is selected
        const selectedCourses = document.querySelectorAll('.course-select:checked');
        if (selectedCourses.length === 0) {
            alert('Please select at least one course.');
            return false;
        }

        return true;
    }
}

// Enhanced PDF Generator class
class PDFGenerator {
    constructor() {
        this.createLoadingSpinner();
    }

    createLoadingSpinner() {
        let spinner = document.getElementById('loadingSpinner');
        if (!spinner) {
            spinner = document.createElement('div');
            spinner.id = 'loadingSpinner';
            spinner.className = 'loading-overlay';
            spinner.innerHTML = `
                <div class="spinner"></div>
                <div>Generating PDF...</div>
            `;
            document.body.appendChild(spinner);
        }
        this.spinner = spinner;
    }

    async generatePDF() {
        if (!FormUtils.validateRequiredFields()) {
            return;
        }

        this.showSpinner();
        
        try {
            // Switch to preview section if not already there
            showSection('preview');
            
            // Wait for DOM to update
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const element = document.getElementById('a4Page');
            if (!element) {
                throw new Error('Preview element not found');
            }

            // Generate filename
            const studentId = document.getElementById('studentId')?.value?.trim() || 'student';
            const currentDate = new Date().toISOString().slice(0,10);
            const filename = `${studentId}_CourseRegistration_${currentDate}.pdf`;

            // PDF generation options
            const opt = {
                margin: [5, 5, 5, 5],
                filename: filename,
                image: { 
                    type: 'jpeg', 
                    quality: 0.98 
                },
                html2canvas: { 
                    scale: 2,
                    useCORS: true,
                    backgroundColor: '#ffffff',
                    logging: false,
                    allowTaint: false,
                    letterRendering: true,
                    width: element.scrollWidth,
                    height: element.scrollHeight
                },
                jsPDF: { 
                    unit: 'mm', 
                    format: 'a4', 
                    orientation: 'portrait'
                }
            };

            // Generate and download PDF
            await html2pdf().set(opt).from(element).save();
            
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
        } finally {
            this.hideSpinner();
        }
    }

    showSpinner() {
        if (this.spinner) {
            this.spinner.style.display = 'flex';
        }
    }

    hideSpinner() {
        if (this.spinner) {
            this.spinner.style.display = 'none';
        }
    }
}

// Initialize PDF generator
const pdfGenerator = new PDFGenerator();

// Course data loader with JSON fetch functionality
class CourseDataLoader {
    constructor() {
        this.dataDirectory = './data/courses/'; // Course JSON files directory
    }

    async loadCourseData() {
        const programs = ['CSE', 'EEE', 'BBA', 'English'];
        
        for (let program of programs) {
            courseData[program] = {};
            for (let sem = 1; sem <= 8; sem++) {
                try {
                    // Try to fetch from JSON files
                    const response = await fetch(`${this.dataDirectory}${program.toLowerCase()}_semester_${sem}.json`);
                    if (response.ok) {
                        courseData[program][sem] = await response.json();
                        console.log(`Loaded ${program} semester ${sem} from JSON`);
                    } else {
                        // Fallback to sample data
                        courseData[program][sem] = this.getSampleCourses(program, sem);
                        console.log(`Using sample data for ${program} semester ${sem}`);
                    }
                } catch (error) {
                    // Fallback to sample data on fetch error
                    courseData[program][sem] = this.getSampleCourses(program, sem);
                    console.log(`Fetch failed, using sample data for ${program} semester ${sem}`);
                }
            }
        }
    }

    getSampleCourses(program, semester) {
        const sampleCourses = {
            CSE: {
                1: [
                    { code: "CSE 4101", title: "Data Structure", credits: 3 },
                    { code: "CSE 4102", title: "Computer Programming", credits: 3 },
                    { code: "CSE 4103", title: "Discrete Mathematics", credits: 3 },
                    { code: "CSE 4104", title: "Digital Logic Design", credits: 3 },
                    { code: "CSE 4105", title: "Physics I", credits: 3 },
                    { code: "CSE 4106", title: "Engineering Mathematics I", credits: 3 },
                    { code: "CSE 4107", title: "English", credits: 3 }
                ],
                2: [
                    { code: "CSE 4201", title: "Algorithms", credits: 3 },
                    { code: "CSE 4202", title: "Object Oriented Programming", credits: 3 },
                    { code: "CSE 4203", title: "Computer Organization", credits: 3 },
                    { code: "CSE 4204", title: "Database Management Systems", credits: 3 },
                    { code: "CSE 4205", title: "Statistics and Probability", credits: 3 },
                    { code: "CSE 4206", title: "Engineering Mathematics II", credits: 3 },
                    { code: "CSE 4207", title: "Physics II", credits: 3 }
                ],
                7: [
                    { code: "CSE 4701", title: "Software Engineering", credits: 3 },
                    { code: "CSE 4702", title: "Computer Networks", credits: 3 },
                    { code: "CSE 4703", title: "Artificial Intelligence", credits: 3 },
                    { code: "CSE 4704", title: "Machine Learning", credits: 3 },
                    { code: "CSE 4705", title: "Cyber Security", credits: 3 },
                    { code: "CSE 4706", title: "Web Technologies", credits: 3 },
                    { code: "CSE 4707", title: "Mobile App Development", credits: 3 },
                    { code: "CSE 4708", title: "Computer Graphics", credits: 3 }
                ]
            },
            EEE: {
                1: [
                    { code: "EEE 4101", title: "Circuit Analysis I", credits: 3 },
                    { code: "EEE 4102", title: "Basic Electronics", credits: 3 },
                    { code: "EEE 4103", title: "Engineering Mathematics I", credits: 3 },
                    { code: "EEE 4104", title: "Physics I", credits: 3 },
                    { code: "EEE 4105", title: "Programming Fundamentals", credits: 3 },
                    { code: "EEE 4106", title: "Engineering Drawing", credits: 2 },
                    { code: "EEE 4107", title: "English", credits: 3 }
                ],
                2: [
                    { code: "EEE 4201", title: "Circuit Analysis II", credits: 3 },
                    { code: "EEE 4202", title: "Electronic Devices", credits: 3 },
                    { code: "EEE 4203", title: "Engineering Mathematics II", credits: 3 },
                    { code: "EEE 4204", title: "Physics II", credits: 3 },
                    { code: "EEE 4205", title: "Digital Systems", credits: 3 }
                ]
            },
            BBA: {
                1: [
                    { code: "BBA 4101", title: "Principles of Management", credits: 3 },
                    { code: "BBA 4102", title: "Business Mathematics", credits: 3 },
                    { code: "BBA 4103", title: "Principles of Economics", credits: 3 },
                    { code: "BBA 4104", title: "Business Communication", credits: 3 },
                    { code: "BBA 4105", title: "Introduction to Business", credits: 3 },
                    { code: "BBA 4106", title: "Computer Applications", credits: 3 },
                    { code: "BBA 4107", title: "English", credits: 3 }
                ]
            },
            English: {
                1: [
                    { code: "ENG 4101", title: "Introduction to Literature", credits: 3 },
                    { code: "ENG 4102", title: "English Grammar and Composition", credits: 3 },
                    { code: "ENG 4103", title: "Phonetics and Phonology", credits: 3 },
                    { code: "ENG 4104", title: "History of English Literature", credits: 3 },
                    { code: "ENG 4105", title: "Reading Skills", credits: 3 },
                    { code: "ENG 4106", title: "Writing Skills", credits: 3 },
                    { code: "ENG 4107", title: "Computer Applications", credits: 3 }
                ]
            }
        };
        
        return sampleCourses[program]?.[semester] || [];
    }
}

// Initialize course data loader
const courseLoader = new CourseDataLoader();

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    courseLoader.loadCourseData();
    updatePreview();
    
    // Add event listeners to form inputs
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', updatePreview);
        input.addEventListener('change', updatePreview);
    });

    // Auto-update semester section when semester changes
    document.getElementById('semester').addEventListener('change', function() {
        const semesterSection = document.getElementById('semesterSection');
        if (this.value && !semesterSection.value) {
            semesterSection.value = this.value + 'B';
        }
    });
});

// Section navigation
function showSection(section) {
    const inputSection = document.getElementById('inputSection');
    const previewSection = document.getElementById('previewSection');
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    
    toggleButtons.forEach(btn => btn.classList.remove('active'));
    
    if (section === 'input') {
        inputSection.style.display = 'block';
        previewSection.style.display = 'none';
        toggleButtons[0].classList.add('active');
    } else {
        inputSection.style.display = 'none';
        previewSection.style.display = 'block';
        toggleButtons[1].classList.add('active');
        updatePreview();
    }
}

// Course loading and management
function loadCourses() {
    const program = document.getElementById('program').value;
    const semester = document.getElementById('semester').value;
    const courseTableBody = document.getElementById('courseTableBody');
    
    courseTableBody.innerHTML = '';
    courseRowCount = 0;
    
    if (program && semester && courseData[program] && courseData[program][semester]) {
        const courses = courseData[program][semester];
        courses.forEach((course, index) => {
            addCourseRow(course);
        });
    }
    
    updatePreview();
    calculateTotalCredits();
}

function addCourseRow(courseInfo = null) {
    const courseTableBody = document.getElementById('courseTableBody');
    const semesterSection = document.getElementById('semesterSection').value || 'B';
    courseRowCount++;
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${courseRowCount}</td>
        <td><input type="text" class="course-code" value="${courseInfo ? courseInfo.code : ''}" onblur="updateCourseTitle(this)" onchange="updatePreview()"></td>
        <td><input type="text" class="course-title" value="${courseInfo ? courseInfo.title : ''}" onchange="updatePreview()"></td>
        <td><input type="checkbox" class="course-select" onchange="updatePreview(); calculateTotalCredits();"></td>
        <td><input type="number" class="course-credit" value="${courseInfo ? courseInfo.credits : ''}" min="0" max="4" onchange="updatePreview(); calculateTotalCredits();"></td>
        <td><input type="text" class="course-section" value="${semesterSection}" onchange="updatePreview()"></td>
        <td><button type="button" class="delete-btn" onclick="deleteCourseRow(this)">Delete</button></td>
    `;
    
    courseTableBody.appendChild(row);
    calculateTotalCredits();
    updatePreview();
}

function deleteCourseRow(button) {
    const row = button.closest('tr');
    row.remove();
    updateRowNumbers();
    calculateTotalCredits();
    updatePreview();
}

function updateRowNumbers() {
    const rows = document.querySelectorAll('#courseTableBody tr');
    rows.forEach((row, index) => {
        row.querySelector('td:first-child').textContent = index + 1;
    });
    courseRowCount = rows.length;
}

function updateCourseTitle(input) {
    const courseCode = input.value.trim().toUpperCase();
    const program = document.getElementById('program').value;
    const semester = document.getElementById('semester').value;
    const titleInput = input.closest('tr').querySelector('.course-title');
    const creditInput = input.closest('tr').querySelector('.course-credit');
    
    if (program && semester && courseData[program] && courseData[program][semester]) {
        const course = courseData[program][semester].find(c => c.code.toUpperCase() === courseCode);
        if (course) {
            titleInput.value = course.title;
            creditInput.value = course.credits;
        }
    }
    
    updatePreview();
    calculateTotalCredits();
}

function calculateTotalCredits() {
    const creditInputs = document.querySelectorAll('.course-credit');
    const selectInputs = document.querySelectorAll('.course-select');
    let total = 0;
    
    creditInputs.forEach((input, index) => {
        if (selectInputs[index] && selectInputs[index].checked) {
            total += parseInt(input.value) || 0;
        }
    });
    
    document.getElementById('totalCredits').textContent = total;
    
    const warningDiv = document.getElementById('creditWarning');
    if (total > 22) {
        warningDiv.style.display = 'block';
    } else {
        warningDiv.style.display = 'none';
    }
    
    // Update preview total credits
    const previewTotal1 = document.getElementById('previewTotalCredits1');
    const previewTotal2 = document.getElementById('previewTotalCredits2');
    if (previewTotal1) previewTotal1.textContent = total;
    if (previewTotal2) previewTotal2.textContent = total;
}

function updatePreview() {
    // Update basic info for both copies
    const fields = [
        'program', 'studentName', 'studentId', 'advisorName', 
        'guardianPhone', 'studentPhone', 'bloodGroup', 'semesterSection'
    ];
    
    fields.forEach(field => {
        const value = document.getElementById(field)?.value || '';
        const element1 = document.getElementById(`preview${field.charAt(0).toUpperCase() + field.slice(1)}1`);
        const element2 = document.getElementById(`preview${field.charAt(0).toUpperCase() + field.slice(1)}2`);
        if (element1) element1.textContent = value;
        if (element2) element2.textContent = value;
    });
    
    // Update semester display
    const semester = document.getElementById('semester').value;
    const semesterText = semester ? `Spring 2025` : 'Spring 2025';
    const semesterElement1 = document.getElementById('previewSemester1');
    const semesterElement2 = document.getElementById('previewSemester2');
    if (semesterElement1) semesterElement1.textContent = semesterText;
    if (semesterElement2) semesterElement2.textContent = semesterText;
    
    // Update course tables for both copies
    updatePreviewCourseTable('previewCourseTable1');
    updatePreviewCourseTable('previewCourseTable2');
}

function updatePreviewCourseTable(tableId) {
    const previewTable = document.getElementById(tableId);
    if (!previewTable) return;
    
    previewTable.innerHTML = '';
    
    const rows = document.querySelectorAll('#courseTableBody tr');
    rows.forEach((row, index) => {
        const courseCode = row.querySelector('.course-code')?.value || '';
        const courseTitle = row.querySelector('.course-title')?.value || '';
        const isSelected = row.querySelector('.course-select')?.checked || false;
        const credit = row.querySelector('.course-credit')?.value || '';
        const section = row.querySelector('.course-section')?.value || '';
        
        const previewRow = document.createElement('tr');
        previewRow.innerHTML = `
            <td>${index + 1}</td>
            <td>${courseCode}</td>
            <td>${courseTitle}</td>
            <td>${isSelected ? '✓' : '✗'}</td>
            <td>${credit}</td>
            <td>${section}</td>
        `;
        previewTable.appendChild(previewRow);
    });
}

function getOrdinal(num) {
    const ordinals = {
        1: '1st', 2: '2nd', 3: '3rd', 4: '4th',
        5: '5th', 6: '6th', 7: '7th', 8: '8th'
    };
    return ordinals[num] || `${num}th`;
}

// PDF download function
function downloadPDF() {
    pdfGenerator.generatePDF();
}

// Additional utility functions
function clearForm() {
    if (confirm('Are you sure you want to clear the form? This action cannot be undone.')) {
        document.getElementById('registrationForm').reset();
        document.getElementById('courseTableBody').innerHTML = '';
        courseRowCount = 0;
        updatePreview();
        calculateTotalCredits();
    }
}

function printForm() {
    const printWindow = window.open('', '_blank');
    const content = document.getElementById('a4Page').cloneNode(true);
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Course Registration Form</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                table { border-collapse: collapse; width: 100%; margin: 10px 0; }
                th, td { border: 1px solid #000; padding: 4px; text-align: center; font-size: 11px; }
                th { background: #f0f0f0; font-weight: bold; }
                .university-header { text-align: center; margin-bottom: 20px; }
                .university-header h2 { font-size: 18px; margin-bottom: 5px; }
                .university-header h3 { font-size: 14px; margin-bottom: 15px; }
                .info-section { display: flex; justify-content: space-between; margin-bottom: 20px; }
                .info-left, .info-right { width: 48%; }
                .info-item { margin-bottom: 8px; display: flex; }
                .info-label { min-width: 120px; font-weight: bold; }
                .signatures { display: flex; justify-content: space-between; margin-top: 30px; }
                .signature-box { text-align: center; width: 30%; }
                .signature-line { border-top: 1px solid #000; margin-bottom: 5px; height: 40px; }
                .copy-label { text-align: right; font-weight: bold; margin-bottom: 15px; }
                .office-copy, .student-copy { page-break-after: always; }
                @media print { .office-copy, .student-copy { page-break-after: always; } }
            </style>
        </head>
        <body>
            ${content.innerHTML}
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
}

// Export functionality
function exportToJSON() {
    const data = {
        studentInfo: {
            program: document.getElementById('program').value,
            semester: document.getElementById('semester').value,
            studentName: document.getElementById('studentName').value,
            studentId: document.getElementById('studentId').value,
            semesterSection: document.getElementById('semesterSection').value,
            advisorName: document.getElementById('advisorName').value,
            guardianPhone: document.getElementById('guardianPhone').value,
            studentPhone: document.getElementById('studentPhone').value,
            bloodGroup: document.getElementById('bloodGroup').value
        },
        courses: [],
        totalCredits: parseInt(document.getElementById('totalCredits').textContent) || 0,
        timestamp: new Date().toISOString()
    };
    
    const rows = document.querySelectorAll('#courseTableBody tr');
    rows.forEach(row => {
        const course = {
            code: row.querySelector('.course-code').value,
            title: row.querySelector('.course-title').value,
            selected: row.querySelector('.course-select').checked,
            credits: parseInt(row.querySelector('.course-credit').value) || 0,
            section: row.querySelector('.course-section').value
        };
        data.courses.push(course);
    });
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.studentInfo.studentId || 'registration'}_data.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Mobile responsiveness
function handleResize() {
    if (window.innerWidth <= 768) {
        showSection('input');
    }
}

// Event listeners
window.addEventListener('resize', handleResize);