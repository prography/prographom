window.onscroll = function() {
    scrollFunction()
};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        $("#navbar").css("background-color", "#d81d45");
    } else {
        $("#navbar").css("background-color", "transparent");
    }
}