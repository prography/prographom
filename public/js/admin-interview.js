$(document).ready(function() {
    $('.show4').hide(); 
});

function searchMemberByTime(){
    var date=$("#sel1 option:selected").val();
    var hour=$("#sel2 option:selected").val();
    var minute=$("#sel3 option:selected").val();
    
    $.ajax({
        type: 'POST',
        url: '/admin?filter=interviewTime',
        data: {
            date: date,
            hour: hour,
            minute: minute
        },
        dataType:"text",
        success: function(data) {
            applications = JSON.parse(data);
              
            for (var i = 1; i <= 3; i++) {
                $("#applicant_tab" + i).find(".tab").text("-");
            
                for (var j = 0; j < 11; j++) {
                    $("#applicant" + i).find(".output-box").eq(j).text("-");
                }
                
                for (var j = 1; j <= 7; j++) {
                    $("#applicant" + i).find("#q4-" + j).find(".output-box-table").eq(0).text("-");
                    $("#applicant" + i).find("#q4-" + j).find(".output-box-table").eq(1).text("-");
                    $("#applicant" + i).find("#q4-" + j).find(".output-box-table").eq(2).text("-");
                }
                
                document.forms["ot" + i]["ot_attend"].checked = false;
                document.forms["ot" + i]["ot_absent"].checked = false;
                document.forms["mt" + i]["mt_attend"].checked = false;
                document.forms["mt" + i]["mt_absent"].checked = false;
                
            }
              
            for (var i = 1; i <= applications.length; i++){
                application = applications[i - 1];
                $("#applicant_tab" + i).find(".tab").text(application["name"]);
                $("#applicant" + i).find(".output-box").eq(0).text(application["name"]);
                $("#applicant" + i).find(".output-box").eq(1).text(application["sex"]);
                $("#applicant" + i).find(".output-box").eq(2).text(application["DATE_FORMAT(birth, \'%y-%m-%d\')"]);
                $("#applicant" + i).find(".output-box").eq(3).text(application["phone"]);
                $("#applicant" + i).find(".output-box").eq(4).text(application["college"]);
                $("#applicant" + i).find(".output-box").eq(5).text(application["address"]);
                $("#applicant" + i).find(".output-box").eq(6).text(application["field"]);
                $("#applicant" + i).find(".output-box").eq(7).text(application["q1"]);
                $("#applicant" + i).find(".output-box").eq(8).text(application["q2"]);
                $("#applicant" + i).find(".output-box").eq(9).text(application["q3"]);
                $("#applicant" + i).find(".output-box").eq(10).text(application["q5"]);
                
                for (var j = 0; j < Object.keys(application["q4"]).length; j++) {
                    $("#applicant" + i).find("#q4-" + (j + 1)).find(".output-box-table").eq(0).text(application["q4"][j]["field"]);
                    $("#applicant" + i).find("#q4-" + (j + 1)).find(".output-box-table").eq(1).text(application["q4"][j]["term"]);
                    $("#applicant" + i).find("#q4-" + (j + 1)).find(".output-box-table").eq(2).text(application["q4"][j]["activity"]);
                }

                if (application["q6"] == 1) {
                    document.forms["ot" + i]["ot_attend"].checked = true;
                    document.forms["ot" + i]["ot_absent"].disabled = true;
                }
                else {
                    document.forms["ot" + i]["ot_absent"].checked = true;
                    document.forms["ot" + i]["ot_attend"].disabled = true;
                }

                if (application["q7"] == 1) {
                    document.forms["mt" + i]["mt_attend"].checked = true;
                    document.forms["mt" + i]["mt_absent"].disabled = true;
                }
                else {
                    document.forms["mt" + i]["mt_absent"].checked = true;
                    document.forms["mt" + i]["mt_attend"].disabled = true;
                }
            }
              
            $('.show4').show(); 
        }
    });
}
