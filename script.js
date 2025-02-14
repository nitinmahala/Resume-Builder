let resumeData = {
    personalInfo: {},
    education: [],
    experience: [],
    certificates: [],
    achievements: [],
    skills: []
};

// Initialize skills autocomplete
const skills = ['JavaScript', 'HTML5', 'CSS3', 'React', 'Node.js', 'Python', 'Git', 
              'SQL', 'MongoDB', 'AWS', 'Docker', 'REST APIs', 'TypeScript'];
const skillsList = document.getElementById('skillsList');
skills.forEach(skill => {
    const option = document.createElement('option');
    option.value = skill;
    skillsList.appendChild(option);
});

// Event Listeners
document.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', updateResume);
});

// Add Section
function addSection(type) {
    const containerMap = {
        education: '#educationContainer',
        experience: '#experienceContainer',
        certificate: '#certificatesContainer',
        achievement: '#achievementsContainer'
    };

    const container = document.querySelector(containerMap[type]);
    const template = container.querySelector(`.${type}-group`).cloneNode(true);
    template.querySelectorAll('input, textarea').forEach(field => field.value = '');
    container.appendChild(template);
    addRemoveListeners();
    updateResume();
}

// Remove Section
function addRemoveListeners() {
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.input-group').remove();
            updateResume();
        });
    });
}

// Skill Tag System
document.getElementById('skillsInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const skill = e.target.value.trim();
        if (skill && !resumeData.skills.includes(skill)) {
            const tag = document.createElement('span');
            tag.className = 'skill-tag';
            tag.innerHTML = `${skill} <span class="remove-tag" onclick="removeSkill('${skill}')">×</span>`;
            document.getElementById('skillsContainer').appendChild(tag);
            resumeData.skills.push(skill);
            e.target.value = '';
            updateResume();
        }
    }
});

function removeSkill(skill) {
    resumeData.skills = resumeData.skills.filter(s => s !== skill);
    document.querySelectorAll('.skill-tag').forEach(tag => {
        if (tag.textContent.includes(skill)) tag.remove();
    });
    updateResume();
}

// Update Resume Preview
function updateResume() {
    // Update Data Model
    resumeData.personalInfo = {
        name: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        linkedin: document.getElementById('linkedin').value,
        github: document.getElementById('github').value
    };

    resumeData.education = Array.from(document.querySelectorAll('.education-group')).map(edu => ({
        degree: edu.querySelector('.edu-degree').value,
        institution: edu.querySelector('.edu-institution').value,
        start: edu.querySelector('.edu-start').value,
        end: edu.querySelector('.edu-end').value
    }));

    resumeData.experience = Array.from(document.querySelectorAll('.experience-group')).map(exp => ({
        title: exp.querySelector('.work-title').value,
        company: exp.querySelector('.work-company').value,
        start: exp.querySelector('.work-start').value,
        end: exp.querySelector('.work-end').value,
        responsibilities: exp.querySelector('.work-responsibilities').value
    }));

    resumeData.certificates = Array.from(document.querySelectorAll('.certificate-group')).map(cert => ({
        name: cert.querySelector('.cert-name').value,
        organization: cert.querySelector('.cert-org').value,
        date: cert.querySelector('.cert-date').value
    }));

    resumeData.achievements = Array.from(document.querySelectorAll('.achievement-group')).map(ach => ({
        description: ach.querySelector('.achievement-desc').value
    }));

    // Update Preview
    document.getElementById('previewName').textContent = resumeData.personalInfo.name || 'Your Name';
    updateContactInfo();
    updateSocialLinks();
    updatePreviewContent();
}

function updateContactInfo() {
    const contact = [];
    if (resumeData.personalInfo.email) contact.push(resumeData.personalInfo.email);
    if (resumeData.personalInfo.phone) contact.push(resumeData.personalInfo.phone);
    document.getElementById('previewContact').textContent = contact.join(' | ');
}

function updateSocialLinks() {
    const socialLinks = document.getElementById('socialLinks');
    socialLinks.innerHTML = '';
    
    if (resumeData.personalInfo.linkedin) {
        const li = document.createElement('a');
        li.href = resumeData.personalInfo.linkedin;
        li.textContent = 'LinkedIn';
        socialLinks.appendChild(li);
    }
    
    if (resumeData.personalInfo.github) {
        const gh = document.createElement('a');
        gh.href = resumeData.personalInfo.github;
        gh.textContent = 'GitHub';
        socialLinks.appendChild(gh);
    }
}

function updatePreviewContent() {
    const content = document.getElementById('previewContent');
    content.innerHTML = '';

    // Education
    if (resumeData.education.length > 0) {
        const eduSection = document.createElement('section');
        eduSection.innerHTML = `
            <h2 class="section-title">Education</h2>
            ${resumeData.education.map(edu => `
                <div class="education-item">
                    <h3>${edu.degree}</h3>
                    <p>${edu.institution}</p>
                    <p>${formatDate(edu.start)} - ${formatDate(edu.end) || 'Present'}</p>
                </div>
            `).join('')}
        `;
        content.appendChild(eduSection);
    }

    // Experience
    if (resumeData.experience.length > 0) {
        const expSection = document.createElement('section');
        expSection.innerHTML = `
            <h2 class="section-title">Experience</h2>
            ${resumeData.experience.map(exp => `
                <div class="experience-item">
                    <h3>${exp.title}</h3>
                    <p>${exp.company}</p>
                    <p>${formatDate(exp.start)} - ${formatDate(exp.end) || 'Present'}</p>
                    <p>${exp.responsibilities}</p>
                </div>
            `).join('')}
        `;
        content.appendChild(expSection);
    }

    // Certificates
    if (resumeData.certificates.length > 0) {
        const certSection = document.createElement('section');
        certSection.innerHTML = `
            <h2 class="section-title">Certifications</h2>
            ${resumeData.certificates.map(cert => `
                <div class="certificate-item">
                    <h3>${cert.name}</h3>
                    <p>${cert.organization}</p>
                    <p>Issued: ${formatDate(cert.date)}</p>
                </div>
            `).join('')}
        `;
        content.appendChild(certSection);
    }

    // Achievements
    if (resumeData.achievements.length > 0) {
        const achSection = document.createElement('section');
        achSection.innerHTML = `
            <h2 class="section-title">Achievements</h2>
            ${resumeData.achievements.map(ach => `
                <div class="achievement-item">
                    <p>• ${ach.description}</p>
                </div>
            `).join('')}
        `;
        content.appendChild(achSection);
    }

    // Skills
    if (resumeData.skills.length > 0) {
        const skillsSection = document.createElement('section');
        skillsSection.innerHTML = `
            <h2 class="section-title">Skills</h2>
            <div class="skills-list">
                ${resumeData.skills.map(skill => `
                    <span class="skill-tag">${skill}</span>
                `).join('')}
            </div>
        `;
        content.appendChild(skillsSection);
    }
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
}

// Local Storage
function saveData() {
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
    alert('Progress saved successfully!');
}

function loadData() {
    const savedData = localStorage.getItem('resumeData');
    if (savedData) {
        resumeData = JSON.parse(savedData);
        document.getElementById('fullName').value = resumeData.personalInfo.name || '';
        document.getElementById('email').value = resumeData.personalInfo.email || '';
        document.getElementById('phone').value = resumeData.personalInfo.phone || '';
        document.getElementById('linkedin').value = resumeData.personalInfo.linkedin || '';
        document.getElementById('github').value = resumeData.personalInfo.github || '';
        updateResume();
    }
}

function resetForm() {
    if (confirm('Are you sure you want to reset all data?')) {
        localStorage.removeItem('resumeData');
        location.reload();
    }
}

// PDF Export
function exportPDF() {
    window.print();
}

// Initialize
loadData();
addRemoveListeners();
updateResume();