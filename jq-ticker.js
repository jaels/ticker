
(function() {

    $.ajax({
        url: 'http://127.0.0.1:8080/jq-ticker.JSON',
        method: 'GET',
        success: function(data) {
            var arr = data;
            for (var i=0;i<arr.length;i++){

                $("<a href='"+arr[i].link+"' class='list'></a>").html(arr[i].text).appendTo($('#container'));

            //    var newLink = document.createElement('a');
            //    newLink.innerHTML = arr[i].text;
            //    newLink.href = arr[i].link;
            //    $(newLink).appendTo($('#container')).addClass("list");


            }
            play = window.requestAnimationFrame(moveHeadLines);
        }
    });

    var moveLeft = 0;
    var width;
    var play;
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
