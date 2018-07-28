function send_email() {
    // $("#mail_success_message").css('display', '');
    $("#mail_success_message").html("메일을 전송 중입니다. 잠시만 기다려주세요.");

    var email_to = $("#email_to").val();
    console.log(email_to);
    $.ajax({
        type: 'POST',
        url: '/send',
        timeout: 10000,
        data: {
            email_to: email_to
        },
        error: function(xhr, status, error) {

            // $("#mail_success_message").css('display', '');
            $("#mail_success_message").html("메일 전송에 실패했습니다. 메일 주소를 확인해주세요.");
        },
        success: function(data) {
            console.log(data);
            // $("#mail_success_message").css('display', '');
            $("#mail_success_message").html("이메일이 전송되었습니다.");
        }
    });
}
