let map

const checkValue = () => {
    const email = document.getElementById('email').value
    if (email === '') {
        alert('이메일을 적어주세요!')
        return
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
            const results = data.uresult
            if (results.length === 0) {
                alert('잘못된 이메일입니다!')
                return;
            }
            survived = JSON.stringify(results[0]['survived'])
            name = JSON.stringify(results[0]['name'])

            if (survived == '1') {
                $("#result-after-fail-1").css('display', 'none');
                $("#result-after-select-1").css('display', 'block');
                var highlightname = $('.highlightname');
                highlightname.text(name);

                map = new naver.maps.Map('map');
                let url = '';
                let x = 0
                let y = 0;
                url = 'https://map.naver.com/local/siteview.nhn?code=34284482';
                x = 127.0366522;
                y = 37.495422;

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
                $("#result-after-fail-1").css('display', 'block')
                $("#result-after-select-1").css('display', 'none')
                let highlightname = $('.highlightname')
                highlightname.text(name)
            }
        }
    })
}

const enterkey = () => {
    if (window.event.keyCode === 13) checkValue()
}
