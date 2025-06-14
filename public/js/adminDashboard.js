// js/adminLogin.js
document.addEventListener('DOMContentLoaded', () => {
    // Toggle menu on small screens
    const toggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');

    toggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Pie chart
    const canvas = document.getElementById('workerPieChart');
    const ctx = canvas.getContext('2d');

    const dataAttr = canvas.getAttribute('data-categories');
    const data = JSON.parse(dataAttr || '{}');
    const labels = Object.keys(data);
    const values = Object.values(data);

    if (labels.length && values.length) {
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels,
                datasets: [{
                    data: values,
                    backgroundColor: [
                        '#066471', '#C84754', '#0D92A7', '#FFA500', '#6A5ACD', '#2E8B57'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { font: { size: 14 } }
                    }
                }
            }
        });
    } else {
        ctx.font = "16px Arial";
        ctx.fillText("No data available", 100, 150);
    }

    // Dynamic content loading
    function renderTable(data, type) {
        if (!data.length) return '<p>No records found.</p>';

        let headers = '';
        let rows = '';

        if (type === 'Workers') {
            headers = `
            <tr><th>#</th><th>Full Name</th><th>Birth Date</th><th>Age</th><th>Gender</th><th>Aadhar No.</th><th>Skill</th><th>City / Pincode</th><th>Phone</th></tr>
        `;
            rows = data.map((w, i) => `
            <tr>
                <td>${i + 1}</td>
                <td>${w.firstname} ${w.lastname}</td>
                <td>${w.birthdate}</td>
                <td>${w.age}</td>
                <td>${w.gender}</td>
                <td>${w.aadhar_number}</td>
                <td>${w.skillset || 'N/A'}</td>
                <td>${w.city}, ${w.pincode}</td>
                <td>+91 ${w.phone}</td>
            </tr>
        `).join('');
        } else if (type === 'Clients') {
            headers = `
            <tr><th>#</th><th>Full Name</th><th>Birth Date</th><th>Age</th><th>Gender</th><th>Aadhar No.</th><th>Email</th><th>City / Pincode</th><th>Phone</th></tr>
        `;
            rows = data.map((c, i) => `
            <tr>
                <td>${i + 1}</td>
                <td>${c.firstname} ${c.lastname}</td>
                <td>${c.birthdate}</td>
                <td>${c.age}</td>
                <td>${c.gender}</td>
                <td>${c.aadhar_number}</td>
                <td>${c.email || 'N/A'}</td>
                <td>${c.city}, ${c.pincode}</td>
                <td>+91 ${c.phone}</td>
            </tr>
        `).join('');
        } else if (type === 'Admins') {
            headers = `
            <tr><th>#</th><th>Name</th><th>Birth Date</th><th>Gender</th><th>Mobile</th><th>Aadhar</th><th>Email</th><th>City / Pincode</th></tr>
        `;
            rows = data.map((a, i) => `
            <tr>
                <td>${i + 1}</td>
                <td>${a.name}</td>
                <td>${a.birthdate}</td>
                <td>${a.gender}</td>
                <td>${a.mobile}</td>
                <td>${a.aadhar_number}</td>
                <td>${a.email}</td>
                <td>${a.city}, ${a.pincode}</td>
            </tr>
        `).join('');
        }

        return `
        <div class="table-wrapper">
        <h2>${type} Details</h2>
            <table class="styled-table">
                <thead>${headers}</thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    `;
    }

    // Smooth scrolling
    function scrollToContent() {
        const section = document.getElementById('adminContent');
        if (section) section.scrollIntoView({ behavior: 'smooth' });
    }

    // Event listener for view all types
    document.querySelector('#viewAllWorkersBtn').addEventListener('click', () => {
        fetch('/admin/api/workers')
            .then(res => res.json())
            .then(data => {
                document.getElementById('adminContent').innerHTML = renderTable(data, 'Workers');
                scrollToContent();
            });
    });

    document.querySelector('#viewAllClientsBtn').addEventListener('click', () => {
        fetch('/admin/api/clients')
            .then(res => res.json())
            .then(data => {
                document.getElementById('adminContent').innerHTML = renderTable(data, 'Clients');
                scrollToContent();
            });
    });

    document.querySelector('#viewAllAdminsBtn').addEventListener('click', () => {
        fetch('/admin/api/admins')
            .then(res => res.json())
            .then(data => {
                document.getElementById('adminContent').innerHTML = renderTable(data, 'Admins');
                scrollToContent();
            });
    });

    const adminContent = document.getElementById('adminContent');

    const loadSearchForm = async (role) => {
        const res = await fetch(`/admin/search-form/${role}`);
        const html = await res.text();
        adminContent.innerHTML = html;
        attachSearchFormSubmit();
    };

    const attachSearchFormSubmit = () => {
        const form = document.getElementById('searchForm');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const keyword = form.keyword.value.trim();
            const role = form.getAttribute('data-role');

            if (!keyword || !role) return;

            const response = await fetch(`/admin/search-users?role=${role}&q=${encodeURIComponent(keyword)}`);
            const resultHTML = await response.text();
            adminContent.innerHTML = resultHTML;
            adminContent.scrollIntoView({ behavior: 'smooth' });
        });
    };

    // Button event listeners
    document.getElementById('searchWorkerBtn')?.addEventListener('click', () => loadSearchForm('worker'));
    document.getElementById('searchClientBtn')?.addEventListener('click', () => loadSearchForm('client'));

});
