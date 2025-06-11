// js/adminLogin.js
document.addEventListener('DOMContentLoaded', () => {
    // Toggle menu on small screens
    const toggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');

    toggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

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
    
});
