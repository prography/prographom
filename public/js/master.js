/*
  index
  -하단에서 상단으로 스크롤 부드럽게
  -아코디언
  -#id 지점으로 부드럽게 이동
  -admin 페이지 menu
  -모달 표시하기
  -admin 조회하기 누르면 나오기
  -application alert, confirm 모달뜨게하기
  -portfolio filtering
  -
*/

/* 하단에서 상단으로 스크롤 부드럽게 */
$('.top').click(function() {
    $('html, body').animate({
        scrollTop: 0
    }, 500);
    return false;
});

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
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
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

/*application alert, confirm 모달뜨게하기*/
function btn_js_alert_click() {
    /* alert(문자열) */
    alert("저장되었습니다!\n9월1일까지 최종제출을 하셔야 지원 완료됩니다!");
}

function btn_js_confirm_click() {
    /* confirm(문자열, 초기값) */
    var check = confirm("제출하시면 더 이상 수정이 불가능합니다!\n제출하시겠습니까?");
    /* if(check == true) else false */
    if (check) alert("지원서 제출 완료");
    else alert("지원서 제출 취소");
}
