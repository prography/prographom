function send_email(){
  var email_to=$("#email_to").val();
  console.log(email_to);
  $.ajax({
				type: 'GET',
				url: '/send',
				data: {
          email_to: email_to
        },
        error: function(xhr, status, error){
					//alert(xhr.responseText);
					alert('잘못된/중복된 이메일입니다.');
				},
        success: function() {
          $("#mail_success_message").html("이메일이 전송되었습니다.");
        }
    });
}
