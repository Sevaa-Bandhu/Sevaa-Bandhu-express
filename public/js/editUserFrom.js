document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchUserForm');
    const userForm = document.getElementById('editUserForm');
    const updateBtn = document.getElementById('updateBtn');
    const editBtn = document.getElementById('editToggleBtn');
    const deleteBtn = document.getElementById('deleteBtn');

    if (!searchForm || !userForm) return;

    // Initially hide the form
    userForm.style.display = 'none';

    // Handle search
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const keyword = searchForm.keyword.value.trim();
        const role = searchForm.getAttribute('data-role');

        if (!keyword || !role) return;

        try {
            const res = await fetch(`/admin/edit-fetch?role=${role}&keyword=${encodeURIComponent(keyword)}`);
            const user = await res.json();

            if (!user || !user._id) {
                alert("User not found.");
                userForm.style.display = 'none';
                return;
            }

            populateForm(user, role);
        } catch (err) {
            console.error("Error fetching user:", err);
            alert("Error fetching user data.");
        }
    });

    function populateForm(user, role) {
        userForm.style.display = 'block';
        userForm.reset();

        const setField = (name, value) => {
            if (userForm[name]) userForm[name].value = value || '';
        };

        setField('id', user._id);
        setField('firstname', user.firstname);
        setField('lastname', user.lastname);
        setField('gender', user.gender);
        setField('birthdate', user.birthdate);
        setField('age', user.age);
        setField('phone', user.phone);
        setField('aadhar_number', user.aadhar_number);
        setField('email', user.email);
        setField('city', user.city);
        setField('state', user.state);
        setField('pincode', user.pincode);
        setField('address', user.address);
        setField('role', user.role);

        // Worker-specific fields
        if (role === 'worker') {
            setField('skillset', user.skillset);
            setField('experience', user.experience);
            setField('wages', user.wages);

            // Certificate link
            const certLink = document.querySelector('#editUserForm a[href^="/uploads"]');
            if (certLink && user.certificate) {
                certLink.href = user.certificate;
                certLink.textContent = 'View Certificate';
            }

            // Photo
            const photo = document.querySelector('#editUserForm img');
            if (photo && user.userphoto) {
                photo.src = user.userphoto;
                photo.alt = 'User Photo';
            }
        }

        // Make fields readonly initially
        [...userForm.elements].forEach(input => {
            if (input.name && !['role', 'id'].includes(input.name)) {
                input.setAttribute('readonly', true);
            }
        });

        updateBtn.style.display = 'none';
    }

    // Enable edit mode
    editBtn?.addEventListener('click', () => {
        [...userForm.elements].forEach(input => {
            if (!['role', 'id'].includes(input.name)) {
                input.removeAttribute('readonly');
            }
        });
        updateBtn.style.display = 'inline-block';
    });

    // Handle form submit (update)
    userForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(userForm);
        const payload = Object.fromEntries(formData.entries());

        try {
            const res = await fetch('/admin/update-user', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await res.json();
            alert(result.message);
        } catch (err) {
            console.error("Update failed", err);
            alert("Update failed.");
        }
    });

    // Handle delete
    deleteBtn?.addEventListener('click', async () => {
        if (!confirm("Are you sure you want to delete this user?")) return;

        const role = userForm.role.value;
        const id = userForm.id.value;

        try {
            const res = await fetch('/admin/delete-user', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, role })
            });

            const result = await res.json();
            alert(result.message);
            userForm.reset();
            userForm.style.display = 'none';
        } catch (err) {
            console.error("Delete failed", err);
            alert("Delete failed.");
        }
    });
});
