document.addEventListener('DOMContentLoaded', () => {
    const editBtn = document.getElementById('editToggleBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const form = document.getElementById('editUserForm');

    editBtn.addEventListener('click', () => {
        form.querySelectorAll('input, textarea').forEach(input => {
            if (!['role', 'phone', 'aadhar_number', 'birthdate', 'gender'].includes(input.name)) {
                input.removeAttribute('readonly');
            }
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = Object.fromEntries(new FormData(form).entries());

        const res = await fetch('/admin/update-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await res.json();
        if (data.success) {
            Swal.fire('Updated!', data.message, 'success');
        } else {
            Swal.fire('Error!', data.message, 'error');
        }
    });

    deleteBtn.addEventListener('click', () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You are about to delete this user!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#0d92a7',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const id = form.querySelector('[name="id"]').value;
                const res = await fetch(`/admin/delete-user/${id}`, { method: 'DELETE' });
                const data = await res.json();
                if (data.success) {
                    Swal.fire('Deleted!', data.message, 'success');
                    document.getElementById('adminContent').innerHTML = '';
                } else {
                    Swal.fire('Error!', data.message, 'error');
                }
            }
        });
    });
});
