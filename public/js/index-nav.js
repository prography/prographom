let navbarDOM = $('#navbar');
let disableScroll = false;

scrollFunction();

window.onscroll = function () {
  scrollFunction()
};

function toggleNav(){
  disableScroll = !disableScroll;
  if (!navbarDOM.hasClass('opened')){
    navbarDOM.addClass('opened');
    navbarDOM.css('background-color', '#d81d45');
  }
  else{
    navbarDOM.removeClass('opened');
    scrollFunction();
  }
}

function scrollFunction() {
  if (!disableScroll) {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      navbarDOM.css('background-color', '#d81d45');
      navbarDOM.addClass('colored');
    } else {
      navbarDOM.css('background-color', 'transparent');
      navbarDOM.removeClass('colored');
    }
  }
}
