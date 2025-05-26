const accordians = document.querySelectorAll('.accordian');

accordians.forEach(accordian => {
    const icon = accordian.querySelector('.icon');
    const answer = accordian.querySelector('.answer');

    accordian.addEventListener('click', () => {
        if(icon.classList.contains('active')) {
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