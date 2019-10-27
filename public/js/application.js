$('#saveButton').click(function() {
    const email = $('#email').val();
    const sex = $('#sex').val();
    const birth = $('#birth').val();
    const college = $('#college').val();
    const address = $('#address').val();
    const field = $('input[name="field"]:checked').val();
    const name = $('#name').val();
    const phone = $('#phone').val();
    const github = $('#github').val();
    const q1 = $('#q1').val();
    const q2 = $('#q2').val();
    const q3 = $('#q3').val();
    const q3_1 = $('#q3_1').val();
    const q3_2 = $('#q3_2').val();
    const q5 = $('#q5').val();
    const q4_length = $('input[name="q4_field"]').length;
    let q4_field = new Array(q4_length);
    let term = new Array(q4_length);
    let activity = new Array(q4_length);
    for (let i = 0; i < 7; i++) {
        q4_field[i] = $('input[name="q4_field"]').eq(i).val();
        term[i] = $('input[name="term"]').eq(i).val();
        activity[i] = $('input[name="activity"]').eq(i).val();
    }
    const q6 = $(':input:radio[name="radio1"]:checked').val();
    const q7 = $(':input:radio[name="radio2"]:checked').val();
    const isSubmit = 0;

    $.ajax({
        type: 'POST',
        url: 'application',
        data: {
            email: email,
            sex: sex,
            birth: birth,
            college: college,
            address: address,
            field: field,
            github: github,
            name: name,
            phone: phone,
            q1: q1,
            q2: q2,
            q3: q3,
            q3_1: q3_1,
            q3_2: q3_2,
            q5: q5,
            q4_field: q4_field,
            term: term,
            activity: activity,
            q6: q6,
            q7: q7,
            isSubmit: isSubmit
        },
        dataType: 'json'
    });
});

$('#submitButton').click(function() {
    const email = $('#email').val();
    const sex = $('#sex').val();
    const birth = $('#birth').val();
    const college = $('#college').val();
    const address = $('#address').val();
    const field = $('input[name="field"]:checked').val();
    const github = $('#github').val();
    const name = $('#name').val();
    const phone = $('#phone').val();
    const q1 = $('#q1').val();
    const q2 = $('#q2').val();
    const q3 = $('#q3').val();
    const q3_1 = $('#q3_1').val();
    const q3_2 = $('#q3_2').val();
    const q5 = $('#q5').val();
    const q4_length = $('input[name="q4_field"]').length;
    let q4_field = new Array(q4_length);
    let term = new Array(q4_length);
    let activity = new Array(q4_length);
    for (let i = 0; i < 7; i++) {
        q4_field[i] = $('input[name="q4_field"]').eq(i).val();
        term[i] = $('input[name="term"]').eq(i).val();
        activity[i] = $('input[name="activity"]').eq(i).val();
    }
    const q6 = $(':input:radio[name="radio1"]:checked').val();
    const q7 = $(':input:radio[name="radio2"]:checked').val();
    const isSubmit = 1;

    if (email == '' || sex == '' || birth == '' || college == '' || address == '' || field == '' || name == '' || phone == ''
            || q1 == '' || q2 == '' || q3 == '' || q5 == '' || q4_field.length == 0 || term.length == 0 || activity.length == 0 
            || !q6 || !q7) {
        $('#submitapplication-modal-body').text('폼을 모두 작성해주세요!');
        return;
    }
    $('#submitapplication-modal-body').text('제출 완료!');
    $('#complete_submit').attr('onclick', 'location.href="/"');
    $.ajax({
        type: 'POST',
        url: 'application',
        data: {
            email: email,
            sex: sex,
            birth: birth,
            college: college,
            address: address,
            field: field,
            github: github,
            name: name,
            phone: phone,
            q1: q1,
            q2: q2,
            q3: q3,
            q3_1: q3_1,
            q3_2: q3_2,
            q5: q5,
            q4_field: q4_field,
            term: term,
            activity: activity,
            q6: q6,
            q7: q7,
            isSubmit: isSubmit
        },
        dataType: 'json',
    });
});
