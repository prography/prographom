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
        success: function(result) {
            if (result.length == 0) {
                alert('잘못된 이메일입니다!');
                return;
            }
            survived = JSON.stringify(result[0]['survived']);
            name = JSON.stringify(result[0]['name']);

            if (survived == '1') {
                $("#result-after-pass-1").css('display', 'block');
                $("#result-after-fail-1").css('display', 'none');
                var highlightname = $('.highlightname');
                highlightname.text(name);

            } else {
                $("#result-after-fail-1").css('display', 'block');
                $("#result-after-pass-1").css('display', 'none');
                var highlightname = $('.highlightname');
                highlightname.text(name);
            }
        }
    });
}

function inputTime(d, h, m) {
    $("#day").val(d);
    $("#hour").val(h);
    $("#min").val(m);
}

function result() {
    alert($("#day").val() + " " + $("#hour").val() + "" + $("#min").val() + "에 면접이 있습니다.");

    var day = $("#day").val();
    var hour = $("#hour").val();
    var min = $("#min").val();
    var email = document.getElementById("email").value;

    $.ajax({
        type: "POST",
        url: "/recruit",
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
            alert('통신성공');
        }
    });
}
