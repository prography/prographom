var map;

function checkValue() {
    var email = document.getElementById("email").value;
    if (email == '') {
        alert('이메일을 적어주세요!');
        return;
    }

    $.ajax({
        type: "GET",
        url: "/recruit?filter=checkSurvived",
        data: {
            email: email
        },
        error: function() {
            alert('통신실패');
        },
        success: function(results) {
            if (results.length == 0) {
                alert('잘못된 이메일입니다!');
                return;
            }
            survived = JSON.stringify(results[0]['survived']);
            name = JSON.stringify(results[0]['name']);

            result = {}
            result.day = JSON.stringify(results[0]['interview_date']);
            result.hour = JSON.stringify(results[0]['interview_hour']);
            result.min = JSON.stringify(results[0]['interview_min']);

            if (survived == '1') {

                if (result.day != null && result.day != 0) {

                    $("#result-after-fail-1").css('display', 'none');
                    $("#result-after-pass-1").css('display', 'none');
                    $("#result-after-select-1").css('display', 'block');
                    var highlightname = $('.highlightname');
                    highlightname.text(name);

                    map = new naver.maps.Map('map');
                    var myaddress = '';
                    var url = '';
                    if (result.day == 26) {
                        myaddress = '서울특별시 강남구 역삼로 180';
                        url = 'https://map.naver.com/local/siteview.nhn?code=34284482';
                    } else {
                        myaddress = '서울특별시 서대문구 이화여대길 52';
                        url = 'https://map.naver.com/local/siteview.nhn?code=19558721';
                    }
                    
                    naver.maps.Service.geocode({address: myaddress}, function(status, response) {
                        if (status !== naver.maps.Service.Status.OK) {
                            return alert(myaddress + '의 검색 결과가 없거나 기타 네트워크 에러');
                        }
                        var result = response.result;
                        var myaddr = new naver.maps.Point(result.items[0].point.x, result.items[0].point.y);
                        map.setCenter(myaddr); 
                        var marker = new naver.maps.Marker({
                            position: myaddr,
                            map: map
                        });
                        naver.maps.Event.addListener(marker, "click", function(e) {
                            location.href = url;
                        });
                    });

                    var message = '8월 ' + result.day + '일 ';
                    if (result.hour == 11) {
                        message += '오전 ';
                    } else {
                        message += '오후 ';
                    }
                    message += result.hour + '시';
                    if (result.min == 20 || result.min == 40) {
                        message += ' ' + result.min + '분';
                    }

                    if (result.day == 26) {
                        message += ', 마루 180 지하 1층 이벤트홀';
                    } else {
                        message += ', 이화여자대학교 ECC 강의실 B156호';
                    }

                    message += '에서 20분간 진행됩니다.';

                    $("#message").text(message);


                } else {
                    $("#result-after-pass-1").css('display', 'block');
                    $("#result-after-fail-1").css('display', 'none');
                    $("#result-after-select-1").css('display', 'none');
                    var highlightname = $('.highlightname');
                    highlightname.text(name);
                }
            } else {
                $("#result-after-pass-1").css('display', 'none');
                $("#result-after-fail-1").css('display', 'block');
                $("#result-after-select-1").css('display', 'none');
                var highlightname = $('.highlightname');
                highlightname.text(name);
            }
        }
    });
}

function schedule_submit() {
    
    var day = null;
    var hour = null;
    var min = null;

    $("input:radio").each( function () { 
        if ($(this)[0].checked) {
            time = $(this)[0].value.split(",");
            day = time[0];
            hour = time[1];
            min = time[2];
        } 
    });
    
    var email = document.getElementById("email").value;
    
    if (!(day && hour && min)) {
        alert('면접 일정을 선택해주세요!');
        return;
    }

    $.ajax({
        type: "POST",
        url: "/recruit/update",
        data: {
            day: day,
            hour: hour,
            min: min,
            email: email
        },
        error: function() {
            alert('통신실패');
        },
        success: function(result) {
            if (result.full) {
                alert('신청 하는 동안 해당 시간 면접정원이 모두 찼습니다!');
                return;
            } 

            $("#result-after-pass-1").css('display', 'none');
            $("#result-after-fail-1").css('display', 'none');
            $("#result-after-select-1").css('display', 'block');

            map = new naver.maps.Map('map');
            var myaddress = '';
            var url = '';
            if (result.day == 26) {
                myaddress = '서울특별시 강남구 역삼로 180';
                url = 'https://map.naver.com/local/siteview.nhn?code=34284482';
            } else {
                myaddress = '서울특별시 서대문구 이화여대길 52';
                url = 'https://map.naver.com/local/siteview.nhn?code=19558721';
            }

            naver.maps.Service.geocode({address: myaddress}, function(status, response) {
                if (status !== naver.maps.Service.Status.OK) {
                    return alert(myaddress + '의 검색 결과가 없거나 기타 네트워크 에러');
                }
                var result = response.result;
                var myaddr = new naver.maps.Point(result.items[0].point.x, result.items[0].point.y);
                map.setCenter(myaddr); 
                var marker = new naver.maps.Marker({
                    position: myaddr,
                    map: map
                });
                naver.maps.Event.addListener(marker, "click", function(e) {
                    location.href = url;
                });
            });

            var message = '8월 ' + result.day + '일 ';
            if (result.hour == 11) {
                message += '오전 ';
            } else {
                message += '오후 ';
            }
            message += result.hour + '시';
            if (result.min == 20 || result.min == 40) {
                message += ' ' + result.min + '분';
            }

            if (result.day == 26) {
                message += ', 마루 180 지하 1층 이벤트홀';
            } else {
                message += ', 이화여자대학교 ECC 강의실 B156호';
            }

            message += '에서 진행됩니다.';

            $("#message").text(message);

        }
    });
}

function resubmit() {
    var email = document.getElementById("email").value;

    $.ajax({
        type: "GET",
        url: "/recruit?filter=checkSurvived",
        data: {
            email: email
        },
        error: function() {
            alert('통신실패');
        },
        success: function(results) {
            interview_day = JSON.stringify(results[0]['interview_date']);
            interview_hour = JSON.stringify(results[0]['interview_hour']);

            var day_arr = [25, 26];
            var hour_arr = [11, 12, 1, 2, 3, 4];

            count = 0;
            for (var hour in hour_arr) {
                for (var day in day_arr) {
                    if (interview_day == day_arr[day] && interview_hour == hour_arr[hour] && $("input:radio")[count].disabled) {
                        $("input:radio")[count].disabled = false;
                    }
                    count += 1;
                }
            }

            $.ajax({
                type: "POST",
                url: "/recruit/init",
                data: {
                    day: 0,
                    hour: 0,
                    min: 0,
                    email: email
                },
                error: function() {
                    alert('통신실패');
                },
                success: function(result) {
                    map.destroy();
                    $("#result-after-select-1").css('display', 'none');
                    $("#result-after-fail-1").css('display', 'none');
                    $("#result-after-pass-1").css('display', 'block');
                }
            });

        }
    });

}

function enterkey() {
    if (window.event.keyCode == 13) checkValue(); 
}
