function send_email() {
    if ($('#email_to').val()) {
		$('#exampleModalCenter1').modal('show');
	} else {
		$('#mail_success_message').html('메일을 입력해주세요!');
		$('#exampleModalCenter1').modal('show');
		return;
	}
		
    $('#mail_success_message').html('메일을 전송 중입니다. 잠시만 기다려주세요.');
	$('.modal-footer').css('display', 'none');

    let email_to = $('#email_to').val();
    $.ajax({
        type: 'POST',
        url: '/send',
        timeout: 10000,
        data: {
            email_to: email_to
        },
        error: function(xhr, status, error) {
            $('#mail_success_message').html('메일 전송에 실패했습니다. 메일 주소를 확인해주세요.');
        },
        success: function(data) {
            $('#mail_success_message').html('이메일이 전송되었습니다.');
			$('.modal-footer').css('display', '');
        }
    });
}
