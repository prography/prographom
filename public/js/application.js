$("#saveButton").click(function() {
    var email = $("#email").val();
    var sex = $("#sex").val();
    var birth = $("#birth").val();
    var college = $("#college").val();
    var address = $("#address").val();
    var field = $("#field").val();
    var name = $("#name").val();
    var phone = $("#phone").val();
    var q1 = $("#q1").val();
    var q2 = $("#q2").val();
    var q3 = $("#q3").val();
    var q5 = $("#q5").val();
    var q4_length = $("input[name='q4_field']").length;
    var q4_field = new Array(q4_length);
    var term = new Array(q4_length);
    var activity = new Array(q4_length);
    for (var i = 0; i < 7; i++) {
        q4_field[i] = $("input[name='q4_field']").eq(i).val();
        term[i] = $("input[name='term']").eq(i).val();
        activity[i] = $("input[name='activity']").eq(i).val();
    }
    var q6 = $(":input:radio[name='radio1']:checked").val();
    var q7 = $(":input:radio[name='radio2']:checked").val();
    var isSubmit = 0;

    $.ajax({
        type: "POST",
        url: 'application',
        data: {
            email: email,
            sex: sex,
            birth: birth,
            college: college,
            address: address,
            field: field,
            name: name,
            phone: phone,
            q1: q1,
            q2: q2,
            q3: q3,
            q5: q5,
            q4_field: q4_field,
            term: term,
            activity: activity,
            q6: q6,
            q7: q7,
            isSubmit: isSubmit
        },
        dataType: "json"
    });
});

$("#submitButton").click(function() {
    var email = $("#email").val();
    var sex = $("#sex").val();
    var birth = $("#birth").val();
    var college = $("#college").val();
    var address = $("#address").val();
    var field = $("#field").val();
    var name = $("#name").val();
    var phone = $("#phone").val();
    var q1 = $("#q1").val();
    var q2 = $("#q2").val();
    var q3 = $("#q3").val();
    var q5 = $("#q5").val();
    var q4_length = $("input[name='q4_field']").length;
    var q4_field = new Array(q4_length);
    var term = new Array(q4_length);
    var activity = new Array(q4_length);
    for (var i = 0; i < 7; i++) {
        q4_field[i] = $("input[name='q4_field']").eq(i).val();
        term[i] = $("input[name='term']").eq(i).val();
        activity[i] = $("input[name='activity']").eq(i).val();
    }
    var q6 = $(":input:radio[name='radio1']:checked").val();
    var q7 = $(":input:radio[name='radio2']:checked").val();
    var isSubmit = 1;

    if (email == '' || sex == '' || birth == '' || college == '' || address == '' || field == '' || name == '' || phone == ''
            || q1 == '' || q2 == '' || q3 == '' || q5 == '' || q4_field.length == 0 || term.length == 0 || activity.length == 0 
            || !q6 || !q7) {
        $("#submitapplication-modal-body").text('폼을 모두 작성해주세요!');
        return;
    }
    $("#submitapplication-modal-body").text('제출 완료!');
    $("#complete_submit").attr("onclick", "location.href='/'");
    $.ajax({
        type: "POST",
        url: 'application',
        data: {
            email: email,
            sex: sex,
            birth: birth,
            college: college,
            address: address,
            field: field,
            name: name,
            phone: phone,
            q1: q1,
            q2: q2,
            q3: q3,
            q5: q5,
            q4_field: q4_field,
            term: term,
            activity: activity,
            q6: q6,
            q7: q7,
            isSubmit: isSubmit
        },
        dataType: "json",
    });
});
