document.addEventListener("DOMContentLoaded", () => {
    const menuBtn = document.getElementById("menu-btn");
    const closeBtn = document.getElementById("close-btn");
    const sidebar = document.getElementById("sidebar");
    const body = document.body;

    // Open sidebar without moving the page
    menuBtn.addEventListener("click", () => {
        sidebar.classList.add("active");
        body.classList.add("no-scroll"); // Prevent scrolling
    });

    // Close sidebar
    closeBtn.addEventListener("click", () => {
        sidebar.classList.remove("active");
        body.classList.remove("no-scroll"); // Restore scrolling
    });

    // Close sidebar when clicking outside
    document.addEventListener("click", (event) => {
        if (!sidebar.contains(event.target) && !menuBtn.contains(event.target)) {
            sidebar.classList.remove("active");
            body.classList.remove("no-scroll"); // Restore scrolling
        }
    });

    // Identity Fields Toggle
    const revealIdentityYes = document.getElementById('revealIdentityYes');
    const revealIdentityNo = document.getElementById('revealIdentityNo');
    const identityFields = document.getElementById('identityFields');

    revealIdentityYes.addEventListener('change', () => {
        identityFields.style.display = 'block';
    });

    revealIdentityNo.addEventListener('change', () => {
        identityFields.style.display = 'none';
    });

    // Handle Complaint Form Submission
    document.getElementById('complaintForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const category = document.getElementById('category').value;
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;

        let userInfo = {};
        if (revealIdentityYes.checked) {
            const name = document.getElementById('name').value;
            const branch = document.getElementById('branch').value;
            const year = document.getElementById('year').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;

            userInfo = { name, branch, year, email, phone };
        }

        if (!category || !title || !description) {
            alert("Please fill in all the fields.");
            return;
        }

        // Create a new complaint element
        const complaintItem = document.createElement('div');
        complaintItem.classList.add('complaint-item');

        const complaintCategory = document.createElement('p');
        complaintCategory.textContent = `Category: ${category}`;
        complaintCategory.style.fontWeight = 'bold';

        const complaintTitle = document.createElement('h3');
        complaintTitle.textContent = title;

        const complaintDescription = document.createElement('p');
        complaintDescription.textContent = description;

        if (revealIdentityYes.checked) {
            const userInfoText = document.createElement('p');
            userInfoText.textContent = `Name: ${userInfo.name}, Branch: ${userInfo.branch}, Year: ${userInfo.year}, Email: ${userInfo.email}, Phone: ${userInfo.phone}`;
            complaintItem.appendChild(userInfoText);
        }

        // Add Edit and Delete buttons
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-btn');

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-btn');

        complaintItem.appendChild(complaintCategory);
        complaintItem.appendChild(complaintTitle);
        complaintItem.appendChild(complaintDescription);
        complaintItem.appendChild(editButton);
        complaintItem.appendChild(deleteButton);

        // Add to complaints list
        document.getElementById('complaintsList').appendChild(complaintItem);

        // Clear form
        document.getElementById('category').value = '';
        document.getElementById('title').value = '';
        document.getElementById('description').value = '';
        if (revealIdentityYes.checked) {
            document.getElementById('name').value = '';
            document.getElementById('branch').value = '';
            document.getElementById('year').value = '';
            document.getElementById('email').value = '';
            document.getElementById('phone').value = '';
        }

        // Edit functionality
        editButton.addEventListener('click', () => {
            document.getElementById('category').value = category;
            document.getElementById('title').value = title;
            document.getElementById('description').value = description;
            if (revealIdentityYes.checked) {
                document.getElementById('name').value = userInfo.name;
                document.getElementById('branch').value = userInfo.branch;
                document.getElementById('year').value = userInfo.year;
                document.getElementById('email').value = userInfo.email;
                document.getElementById('phone').value = userInfo.phone;
            }
            complaintItem.remove();
        });

        // Delete functionality
        deleteButton.addEventListener('click', () => {
            complaintItem.remove();
        });
    });
});
