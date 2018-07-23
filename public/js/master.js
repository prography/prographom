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






/*

$(function () {
$("[id=apply]").hide();

// 클래스가 일치하는 버튼을 가지지만, float_l 클래스가 아닌 요소
$(".button:not(.float_l)").click(function (e) {
e.stopPropagation();

// index가 클릭한 것과 일치하는 요소를 찾음
$("[id^=apply]").eq($(this).index()).toggle();
});
});


*/
/*모달 표시하기*/
$(document).ready(function() {
$('.show1').show(); //페이지를 로드할 때 표시할 요소
$('.show2').hide(); //페이지를 로드할 때 숨길 요소
$('.show1').click(function(){
$ ('.show1').show(); //클릭 시 두 번째 요소 표시
$ ('.show2').show(); //클릭 시 두 번째 요소 표시
return false;
});
});


/*admin 조회하기 누르면 나오기*/
$(document).ready(function() {
$('.show3').show(); //페이지를 로드할 때 표시할 요소
$('.show4').hide(); //페이지를 로드할 때 숨길 요소
$('.show3').click(function(){
$ ('.show4').show(); //클릭 시 두 번째 요소 표시
return false;
});
});




/*application alert, confirm*/
function btn_js_alert_click(){
  /* alert(문자열) */
  alert("저장되었습니다!\n9월1일까지 최종제출을 하셔야 지원 완료됩니다!");
}
function btn_js_confirm_click(){
  /* confirm(문자열, 초기값) */
  var check = confirm("제출하시면 더 이상 수정이 불가능합니다!\n제출하시겠습니까?");
  /* if(check == true) else false */
  if(check) alert("지원서 제출 완료");
  else alert("지원서 제출 취소");
}




/*
html

<form name="input_type" id="input_type" method="post" >


  <input type="button" name="btn_js_alert" id="btn_js_alert" onclick="btn_js_alert_click();" value="알림창" />
  <br />
  <input type="button" name="btn_js_confirm" id="btn_js_confirm" onclick="btn_js_confirm_click();" value="확인창" />
  <br />

</form>



*/














































/**/
