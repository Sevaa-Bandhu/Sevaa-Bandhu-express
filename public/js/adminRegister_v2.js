document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('adminRegisterForm');
    const msg = document.getElementById('adminRegisterMsg');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const payload = Object.fromEntries(formData.entries());

        console.log("Submitting Admin Registration:", payload);  // ✅ Debug log
        try {
            const res = await fetch('/admin/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await res.json();
            console.log("Server response:", result);  // ✅ Debug response
            
            msg.textContent = result.message;
            msg.style.color = result.success ? 'green' : 'red';

            if (result.success) form.reset();
        } catch (err) {
            msg.textContent = 'Something went wrong';
            msg.style.color = 'red';
        }
    });
});
