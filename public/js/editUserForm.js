document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchUserForm');
    const userForm = document.getElementById('editUserForm');
    const updateBtn = document.getElementById('updateBtn');
    const editBtn = document.getElementById('editToggleBtn');
    const deleteBtn = document.getElementById('deleteBtn');

    if (!searchForm || !userForm) return;

    function populateForm(user, role) {
        userForm.reset();

        const set = (name, value) => {
            const el = userForm.querySelector(`[name="${name}"]`);
            if (el) el.value = value || '';
        };

        set('id', user._id);
        set('firstname', user.firstname);
        set('lastname', user.lastname);
        set('gender', user.gender);
        set('birthdate', user.birthdate);
        set('age', user.age);
        set('phone', user.phone);
        set('aadhar_number', user.aadhar_number);
        set('email', user.email);
        set('city', user.city);
        set('state', user.state);
        set('pincode', user.pincode);
        set('address', user.address);
        set('role', user.role);

        if (role === 'worker') {
            set('skillset', user.skillset);
            set('experience', user.experience);
            set('wages', user.wages);

            const certLink = userForm.querySelector('a[href^="/uploads"], a[href^="http"]');
            if (certLink && user.certificate) {
                certLink.href = user.certificate;
                certLink.textContent = 'View Certificate';
            }

            const photo = userForm.querySelector('img');
            if (photo && user.userphoto) {
                photo.src = user.userphoto;
            }
        }

        // Make all fields readonly initially (except ID and role)
        [...userForm.elements].forEach(el => {
            if (el.name && !['role', 'id'].includes(el.name)) {
                el.setAttribute('readonly', true);
            }
        });

        updateBtn.style.display = 'none';
    }

    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log("Onsubmit");

        const keywordInput = searchForm.querySelector('[name="keyword"]');
        const keyword = keywordInput.value.trim();
        const role = searchForm.getAttribute('data-role');

        if (!keyword || !role) return;
        try {
            const res = await fetch(`/admin/edit-fetch?role=${role}&keyword=${encodeURIComponent(keyword)}`);
            if (!res.ok) {
                alert("User not found.");
                userForm.reset(); // clear form
                return;
            }

            const user = await res.json();
            populateForm(user, role);
        } catch (err) {
            console.error("Fetch Error:", err);
        }
    });

    editBtn?.addEventListener('click', () => {
        [...userForm.elements].forEach(el => {
            if (el.name && !['role', 'id'].includes(el.name)) {
                el.removeAttribute('readonly');
            }
        });
        updateBtn.style.display = 'inline-block';
    });

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
        }
    });

    deleteBtn?.addEventListener('click', async () => {
        if (!confirm("Are you sure you want to delete this user?")) return;

        const role = userForm.querySelector('[name="role"]').value;
        const id = userForm.querySelector('[name="id"]').value;

        try {
            const res = await fetch('/admin/delete-user', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, role })
            });

            const result = await res.json();
            alert(result.message);
            userForm.reset(); // form stays visible but is cleared
        } catch (err) {
            console.error("Delete failed", err);
        }
    });
});
