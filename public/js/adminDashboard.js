document.addEventListener('DOMContentLoaded', () => {
    // ✅ Capitalize helper
    function capitalize(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // ✅ Toggle menu for mobile
    const toggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    toggle.addEventListener('click', () => sidebar.classList.toggle('active'));

    const canvas = document.getElementById('workerPieChart');
    const ctx = canvas.getContext('2d');

    // ✅ Pie Chart
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

    const adminContent = document.getElementById('adminContent');

    function scrollToContent() {
        if (adminContent) adminContent.scrollIntoView({ behavior: 'smooth' });
    }

    // ✅ Renders HTML Table
    function renderTable(data, type) {
        if (!data.length) return `<p>No records found.</p>`;

        let headers = '';
        let rows = '';

        if (type === 'Workers') {
            headers = `<tr><th>#</th><th>Full Name</th><th>Birth Date</th><th>Age</th><th>Gender</th><th>Aadhar No.</th><th>Skill</th><th>City / Pincode</th><th>Phone</th></tr>`;
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
            headers = `<tr><th>#</th><th>Full Name</th><th>Birth Date</th><th>Age</th><th>Gender</th><th>Aadhar No.</th><th>Email</th><th>City / Pincode</th><th>Phone</th></tr>`;
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
            headers = `<tr><th>#</th><th>Name</th><th>Birth Date</th><th>Gender</th><th>Mobile</th><th>Aadhar</th><th>Email</th><th>City / Pincode</th></tr>`;
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

    // ✅ Pagination
    function renderPagination(total, currentPage, type) {
        const totalPages = Math.ceil(total / 10);
        if (totalPages <= 1) return '';

        let buttons = '';
        for (let i = 1; i <= totalPages; i++) {
            buttons += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}" data-type="${type}">${i}</button>`;
        }

        return `<div class="pagination">${buttons}</div>`;
    }

    function loadAndRender(type, page = 1) {
        const singular = type.toLowerCase().replace(/s$/, ''); // removes trailing 's' if exists

        fetch(`/admin/api/${singular}s?page=${page}`)
            .then(res => res.json())
            .then(({ data, total }) => {
                const table = renderTable(data, capitalize(type));
                const pagination = renderPagination(total, page, capitalize(type));
                adminContent.innerHTML = table + pagination;
                scrollToContent();
            })
            .catch(err => {
                adminContent.innerHTML = `<p>Error loading data.</p>`;
                console.error(err);
            });
    }

    // ✅ Handle pagination click
    adminContent.addEventListener('click', (e) => {
        if (e.target.classList.contains('page-btn')) {
            const page = parseInt(e.target.dataset.page);
            const type = e.target.dataset.type;
            loadAndRender(type, page);
        }
    });

    // ✅ View all buttons
    document.getElementById('viewAllWorkersBtn')?.addEventListener('click', () => loadAndRender('Workers', 1));
    document.getElementById('viewAllClientsBtn')?.addEventListener('click', () => loadAndRender('Clients', 1));
    document.getElementById('viewAllAdminsBtn')?.addEventListener('click', () => loadAndRender('Admins', 1));

    // ✅ Search dynamic form
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
            scrollToContent();
        });
    };

    document.getElementById('searchWorkerBtn')?.addEventListener('click', () => loadSearchForm('worker'));
    document.getElementById('searchClientBtn')?.addEventListener('click', () => loadSearchForm('client'));

    // Load Edit Form for Worker
    document.getElementById('openEditWorker')?.addEventListener('click', async () => {
        const res = await fetch(`/admin/edit/worker`);
        const html = await res.text();
        document.getElementById('adminContent').innerHTML = html;
        const script = document.createElement('script');
        script.src = '/js/editUserForm.js';
        script.defer = true;
        document.body.appendChild(script);
    });

    // Load Edit Form for Client
    document.querySelector('#openEditClient')?.addEventListener('click', async () => {
        const res = await fetch('/admin/edit/client');
        const html = await res.text();
        document.getElementById('adminContent').innerHTML = html;
        const script = document.createElement('script');
        script.src = '/js/editUserForm.js';
        script.defer = true;
        document.body.appendChild(script);
    });

    // VIEW DOCUMENTS POPUP
    const viewBtn = document.getElementById('viewDocumentsBtn');
    const modal = document.getElementById('viewDocsModal');
    const closeBtn = document.getElementById('closeViewDocs');
    const docForm = document.getElementById('viewDocsForm');
    const docResult = document.getElementById('docResult');

    viewBtn?.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    closeBtn?.addEventListener('click', () => {
        modal.style.display = 'none';
        docForm.reset();
        docResult.innerHTML = '';
    });

    docForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const keyword = document.getElementById('docSearchInput').value.trim();
        if (!keyword) return;

        try {
            const res = await fetch(`/admin/api/worker-docs?keyword=${encodeURIComponent(keyword)}`);
            if (!res.ok) throw new Error('Worker not found');
            const data = await res.json();

            docResult.innerHTML = `
      <p><strong>Name:</strong> ${data.firstname} ${data.lastname}</p>
      <p><strong>Aadhar Number:</strong> ${data.aadhar_number}</p>
      <p><strong>Certificate:</strong><br>
        ${data.certificate ? `<a href="${data.certificate}" target="_blank">View Certificate</a>` : 'N/A'}
      </p>
      <p><strong>User Photo:</strong><br>
        ${data.userphoto ? `<img src="${data.userphoto}" alt="User Photo">` : 'N/A'}
      </p>
    `;
        } catch (err) {
            docResult.innerHTML = `<p style="color: red;">Worker not found or error occurred.</p>`;
        }
    });

    // New Admin registration
    document.getElementById('registerAdminBtn')?.addEventListener('click', async () => {
        const res = await fetch('/admin/register-form');
        const html = await res.text();
        document.getElementById('adminContent').innerHTML = html;
        scrollToContent();
    });


});
