
(function() {

    var moveLeft = 0;
    var width;
    var play;


play = window.requestAnimationFrame(moveHeadLines);


function moveHeadLines() {


    $('#container').css({
        left: moveLeft + "px"
    });

    moveLeft = moveLeft - 2;

    width = $(".list").first().outerWidth();
    if($("#container").offset().left<=-width) {
        $("#container").append($(".list").first());
        moveLeft+=width + 2;
        $('#container').css({
            left: moveLeft + "px"
        });

    }

    play=window.requestAnimationFrame(moveHeadLines);
}

$("#container").on('mouseover',function(){
    cancelAnimationFrame(play);
    }).on('mouseout', function () {
        play=window.requestAnimationFrame(moveHeadLines);
    })

})();
