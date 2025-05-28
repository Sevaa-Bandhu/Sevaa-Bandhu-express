// /js/help.js
const accordians = document.querySelectorAll('.accordian');

accordians.forEach(accordian => {
    const icon = accordian.querySelector('.icon');
    const answer = accordian.querySelector('.answer');

    accordian.addEventListener('click', () => {
        if (icon.classList.contains('active')) {
            icon.classList.remove('active');
            answer.style.maxHeight = null;
            answer.style.padding = '0';
        } else {
            icon.classList.add('active');
            answer.style.maxHeight = '100%';
            answer.style.padding = '5%';
        }

    })
});

document.getElementById('helpForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message'),
    };

    try {
        const response = await fetch('/help', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok || result.success) {
            Swal.fire({
                icon: 'success',
                title: 'Sent!',
                text: result.message || 'Your message has been sent.',
                confirmButtonColor: '#39ac6b'
            });
            this.reset(); // optionally clear the form
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: result.error || 'Something went wrong.',
                confirmButtonColor: '#cd5c5c'
            });
        }
    } catch (err) {
        console.error(err);
        Swal.fire({
            icon: 'error',
            title: 'Server error',
            text: 'Please try again later.',
            confirmButtonColor: '#cd5c5c'
        });
    }
});

