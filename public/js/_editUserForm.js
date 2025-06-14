document.addEventListener('DOMContentLoaded', () => {
    const editToggleBtn = document.getElementById('editToggleBtn');
    const updateBtn = document.getElementById('updateBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const editUserForm = document.getElementById('editUserForm');
    const searchBtn = document.getElementById('searchUserBtn');
    const searchInput = document.getElementById('userSearchKey');

    if (editToggleBtn) {
        editToggleBtn.addEventListener('click', () => {
            const inputs = editUserForm.querySelectorAll('input:not([name=role]):not([readonly]), textarea');
            inputs.forEach(input => {
                input.removeAttribute('readonly');
            });
            updateBtn.style.display = 'inline-block';
            editToggleBtn.style.display = 'none';
        });
    }

    if (editUserForm) {
        editUserForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(editUserForm);
            const payload = Object.fromEntries(formData.entries());

            try {
                const res = await fetch('/admin/update-user', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await res.json();
                if (data.success) {
                    Swal.fire('Success', data.message, 'success').then(() => window.location.reload());
                } else {
                    Swal.fire('Error', data.message || 'Failed to update.', 'error');
                }
            } catch (err) {
                console.error(err);
                Swal.fire('Error', 'Server error.', 'error');
            }
        });
    }

    if (deleteBtn) {
        deleteBtn.addEventListener('click', async () => {
            const result = await Swal.fire({
                title: 'Confirm Deletion',
                text: 'This action is irreversible!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'Cancel'
            });

            if (result.isConfirmed) {
                const id = document.querySelector('input[name="id"]').value;

                try {
                    const res = await fetch(`/admin/delete-user/${id}`, {
                        method: 'DELETE'
                    });
                    const data = await res.json();
                    if (data.success) {
                        Swal.fire('Deleted!', 'User removed.', 'success').then(() => window.location.reload());
                    } else {
                        Swal.fire('Error', data.message || 'Delete failed.', 'error');
                    }
                } catch (err) {
                    console.error(err);
                    Swal.fire('Error', 'Server error while deleting.', 'error');
                }
            }
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', async () => {
            const key = searchInput.value.trim();
            if (!key || key.length < 6) {
                Swal.fire('Warning', 'Enter valid Aadhar or Phone number.', 'warning');
                return;
            }

            try {
                const res = await fetch(`/admin/search-user?key=${key}`);
                const html = await res.text();
                document.getElementById('adminContent').innerHTML = html;
                window.scrollTo({ top: document.getElementById('adminContent').offsetTop - 60, behavior: 'smooth' });
            } catch (err) {
                console.error(err);
                Swal.fire('Error', 'Failed to load user data.', 'error');
            }
        });
    }
});