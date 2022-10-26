window.addEventListener('scroll', function(){
    let scroll = this.document.querySelector('.top');
    scroll.classList.toggle('active', window.scrollY > 500);
});

function scrollToTop() {
    window.scrollTo(0, 0);
}