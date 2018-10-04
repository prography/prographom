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

                $("#result-after-fail-1").css('display', 'none');
                $("#result-after-select-1").css('display', 'block');
                var highlightname = $('.highlightname');
                highlightname.text(name);

                map = new naver.maps.Map('map');
                var myaddress = '';
                var url = '';
                myaddress = '서울특별시 강남구 역삼로 180';
                url = 'https://map.naver.com/local/siteview.nhn?code=34284482';
                
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


            } else {
                $("#result-after-fail-1").css('display', 'block');
                $("#result-after-select-1").css('display', 'none');
                var highlightname = $('.highlightname');
                highlightname.text(name);
            }
        }
    });
}

function enterkey() {
    if (window.event.keyCode == 13) checkValue(); 
}
