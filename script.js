// Sidebar Toggle
const menuBtn = document.getElementById('menu-btn');
const sidebar = document.getElementById('sidebar');
const closeBtn = document.getElementById('close-btn');

menuBtn.addEventListener('click', () => {
  sidebar.classList.toggle('active');
});

closeBtn.addEventListener('click', () => {
  sidebar.classList.remove('active');
});

// Handle Identity Reveal Radio Buttons
const revealIdentityYes = document.getElementById('revealIdentityYes');
const revealIdentityNo = document.getElementById('revealIdentityNo');
const identityFields = document.getElementById('identityFields');

revealIdentityYes.addEventListener('change', () => {
  identityFields.style.display = 'block';
});

revealIdentityNo.addEventListener('change', () => {
  identityFields.style.display = 'none';
});

// Ensure Register Button Works After Page Load
document.addEventListener("DOMContentLoaded", function () {
    const registerButton = document.getElementById('registerButton');
    if (registerButton) {
        registerButton.addEventListener('click', registerUser);
    }
});

// Handle User Registration (Phone Number Required)
function registerUser() {
    const phone = prompt("Enter your phone number:");

    if (!phone) {
        alert("Phone number is required for registration.");
        return;
    }

    localStorage.setItem('phone', phone);
    alert("Registration successful! Your phone number has been saved.");
}

// Handle Complaint Form Submission with Unique Complaint ID
document.getElementById('complaintForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const phone = localStorage.getItem('phone');
    if (!phone) {
        alert("You must register with a phone number before submitting a complaint.");
        return;
    }

    const complaintId = 'CMP-' + Date.now().toString(); // Generate Unique Complaint ID
    const complaint = {
        id: complaintId,
        category: document.getElementById('category').value,
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        identity: revealIdentityYes.checked ? {
            name: document.getElementById('name').value,
            branch: document.getElementById('branch').value,
            year: document.getElementById('year').value,
            email: document.getElementById('email').value,
            phone: phone
        } : "Anonymous"
    };

    fetch('http://localhost:5000/submit-complaint', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Send token for authentication
        },
        body: JSON.stringify(complaint)
    })
    .then(response => response.json())
    .then(data => {
        if (data.complaintId) {
            alert(`✅ Your complaint is successfully registered! \n\n📌 Complaint ID: ${data.complaintId} \n\nPlease copy this Complaint ID to track your complaint.`);
        } else {
            alert("❌ Failed to submit complaint. Please try again.");
        }
        document.getElementById('complaintForm').reset();
    })
    .catch(error => {
        console.error('Error:', error);
        alert("❌ Error submitting complaint. Please try again.");
    });
});

// Track Complaint by ID
function trackComplaint() {
    const complaintId = document.getElementById('complaintId').value;

    if (!complaintId) {
        alert("Please enter a Complaint ID.");
        return;
    }

    fetch(`http://localhost:5000/complaint/${complaintId}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert("❌ Complaint not found!");
        } else {
            document.getElementById('complaintDetails').innerHTML = `
                <h3>Complaint Details</h3>
                <p><strong>ID:</strong> ${data.id}</p>
                <p><strong>Category:</strong> ${data.category}</p>
                <p><strong>Title:</strong> ${data.title}</p>
                <p><strong>Description:</strong> ${data.description}</p>
                <p><strong>Status:</strong> ${data.status}</p>
            `;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("❌ Error tracking complaint. Please try again.");
    });
}
