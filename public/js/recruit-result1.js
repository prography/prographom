var map;

function checkValue() {
    var email = document.getElementById('email').value;
    if (email == '') {
        alert('이메일을 적어주세요!');
        return;
    }

    $.ajax({
        type: 'GET',
        url: '/recruit?filter=checkSurvived',
        data: {
            email: email
        },
        error: () => {
            alert('통신실패');
        },
        success: (data) => {
            let results = data.uresult
            let full_flags = data.full_flags

            if (results.length == 0) {
                alert('잘못된 이메일입니다!');
                return;
            }
            let survived = JSON.stringify(results[0]['survived']);
            let name = JSON.stringify(results[0]['name']);
            let field = results[0]['field'];
            
            for (let f in full_flags) {
                if (f == field) {
                    for (let i = 0; i < $("input:radio").length; i++) { 
                        if (full_flags[f][i]) $("input:radio")[i].disabled = true; 
                    } 
                }
            }

            let result = {}
            result.day = JSON.stringify(results[0]['interview_date']);
            result.hour = JSON.stringify(results[0]['interview_hour']);
            result.min = JSON.stringify(results[0]['interview_min']);

            if (survived == '1') {
                if (result.day != 'null' && result.day != 0) {
                    $('#result-after-fail-1').css('display', 'none');
                    $('#result-after-pass-1').css('display', 'none');
                    $('#result-after-select-1').css('display', 'block');
                    let highlightname = $('.highlightname');
                    highlightname.text(name);

                    let message = '9월 ' + result.day + '일 ';
                    if (result.hour == 11) {
                        message += '오전 ';
                    } else {
                        message += '오후 ';
                    }
                    message += result.hour + '시';
                    if (result.min == 30) {
                        message += ' ' + result.min + '분';
                    }

                    if (result.day == 7) {
                        message += ', 디캠프 6층 세미나실';
                    } else {
                        message += ', 중앙대학교 310관 617호';
                    }

                    message += '에서 20분간 진행됩니다.';

                    $('#message').text(message);

                    map = new naver.maps.Map('map');
                    let url = '';
                    let x = 0
                    let y = 0;
                    if (result.day == 7) {
                        url = 'https://map.naver.com/local/siteview.nhn?code=32811758';
                        x = 127.0449704;
                        y = 37.5079601;
                    } else {
                        url = 'https://map.naver.com/local/siteview.nhn?code=805915694';
                        x = 126.9559211;
                        y = 37.5035806;
                    }

                    let myaddr = new naver.maps.Point(x, y);
                    map.setCenter(myaddr); 
                    let marker = new naver.maps.Marker({
                        position: myaddr,
                        map: map
                    });
                    naver.maps.Event.addListener(marker, 'click', (e) => {
                        location.href = url;
                    });

                } else {
                    $('#result-after-pass-1').css('display', 'block');
                    $('#result-after-fail-1').css('display', 'none');
                    $('#result-after-select-1').css('display', 'none');
                    let highlightname = $('.highlightname');
                    highlightname.text(name);
                }
            } else {
                $('#result-after-pass-1').css('display', 'none');
                $('#result-after-fail-1').css('display', 'block');
                $('#result-after-select-1').css('display', 'none');
                let highlightname = $('.highlightname');
                highlightname.text(name);
            }
        }
    });
}

function schedule_submit() {
    
    let day = null;
    let hour = null;
    let min = null;

    $('input:radio').each(function () { 
        if ($(this)[0].checked) {
            time = $(this)[0].value.split(',');
            day = time[0];
            hour = time[1];
            min = time[2];
        } 
    });
    
    let email = document.getElementById('email').value;
    
    if (!(day && hour && min)) {
        alert('면접 일정을 선택해주세요!');
        return;
    }

    $.ajax({
        type: 'POST',
        url: '/recruit/update',
        data: {
            day: day,
            hour: hour,
            min: min,
            email: email
        },
        error: () => {
            alert('통신실패');
        },
        success: (result) => {
            if (result.full) {
                alert('신청 하는 동안 해당 시간 면접정원이 모두 찼습니다!');
                return;
            } 

            $('#result-after-pass-1').css('display', 'none');
            $('#result-after-fail-1').css('display', 'none');
            $('#result-after-select-1').css('display', 'block');

            let message = '9월 ' + result.day + '일 ';
            if (result.hour == 11) {
                message += '오전 ';
            } else {
                message += '오후 ';
            }
            message += result.hour + '시';
            if (result.min == 30) {
                message += ' ' + result.min + '분';
            }

            if (result.day == 7) {
                message += ', 디캠프 6층 세미나실';
            } else {
                message += ', 중앙대학교 310관 617호';
            }

            message += '에서 진행됩니다.';

            $('#message').text(message);

            map = new naver.maps.Map('map');
            let url = '';
            let x = 0
            let y = 0;
            if (result.day == 7) {
                url = 'https://map.naver.com/local/siteview.nhn?code=32811758';
                x = 127.0449704;
                y = 37.5079601;
            } else {
                url = 'https://map.naver.com/local/siteview.nhn?code=805915694';
                x = 126.9559211;
                y = 37.5035806;
            }

            let myaddr = new naver.maps.Point(x, y);
            map.setCenter(myaddr); 
            let marker = new naver.maps.Marker({
                position: myaddr,
                map: map
            });
            naver.maps.Event.addListener(marker, 'click', (e) => {
                location.href = url;
            });
        }
    });
}

function resubmit() {
    let email = document.getElementById('email').value;

    $.ajax({
        type: 'GET',
        url: '/recruit?filter=checkSurvived',
        data: {
            email: email
        },
        error: () => {
            alert('통신실패');
        },
        success: (data) => {
            results = data.uresult
            interview_day = JSON.stringify(results[0]['interview_date']);
            interview_hour = JSON.stringify(results[0]['interview_hour']);

            let day_arr = [7, 8];
            let hour_arr = [1, 2, 3, 4];

            count = 0;
            for (let hour in hour_arr) {
                for (let day in day_arr) {
                    if (interview_day == day_arr[day] && interview_hour == hour_arr[hour] && $('input:radio')[count].disabled) {
                        $('input:radio')[count].disabled = false;
                    }
                    count += 1;
                }
            }

            $.ajax({
                type: 'POST',
                url: '/recruit/init',
                data: {
                    day: 0,
                    hour: 0,
                    min: 0,
                    email: email
                },
                error: () => {
                    alert('통신실패');
                },
                success: (result) => {
                    map.destroy();
                    $('#result-after-select-1').css('display', 'none');
                    $('#result-after-fail-1').css('display', 'none');
                    $('#result-after-pass-1').css('display', 'block');
                }
            });

        }
    });

}

function enterkey() {
    if (window.event.keyCode == 13) checkValue(); 
}
