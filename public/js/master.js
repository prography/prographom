/* 하단에서 상단으로 스크롤 부드럽게 */
$( '.top' ).click( function() {
  $( 'html, body' ).animate( { scrollTop : 0 }, 100 );
  return false;
} );


/* nav 스크롤 효과 */

var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
  var currentScrollPos = window.pageYOffset;
  if (prevScrollpos > currentScrollPos) {
    document.getElementById("navbar").style.top = "0";
  } else {
    document.getElementById("navbar").style.top = "-45px";
  }
  prevScrollpos = currentScrollPos;
}


/* nav 내리면 활성화 *//*
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    document.getElementById("navbar").style.top = "0";
  } else {
    document.getElementById("navbar").style.top = "-50px";
  }
}
*/

/* 아코디언 */
function myFunction(accordion1) {
    var x = document.getElementById(accordion1);
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    } else {
        x.className = x.className.replace(" w3-show", "");
    }
}
function myFunction(accordion2) {
    var x = document.getElementById(accordion2);
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    } else {
        x.className = x.className.replace(" w3-show", "");
    }
}








/* #id 지점으로 부드럽게 이동 */
$(function() {
$('.scroll').click(function() {
if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
var target = $(this.hash);
target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
if (target.length) {
$('html, body').animate({
scrollTop: target.offset().top
}, 200);
return false;
}
}
});
});



/* admin 페이지 menu */
function w3_open() {
    document.getElementById("mySidebar").style.display = "block";
}
function w3_close() {
    document.getElementById("mySidebar").style.display = "none";
}












/**/
