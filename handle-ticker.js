
(function() {

    var templates = document.querySelectorAll('script[type="text/handlebars"]');

    Handlebars.templates = Handlebars.templates || {};

    Handlebars.partials = Handlebars.templates;

    Array.prototype.slice.call(templates).forEach(function(script) {
        Handlebars.templates[script.id] = Handlebars.compile(script.innerHTML);
    });



    document.getElementById("container").innerHTML = Handlebars.templates.headlines({
        "headlines": [
            {"text":"nuclear weapons were sold to russia...", "link":"http://www.w3schools.com/html/html_links.asp"},
            {"text":"US started war with Mexico...", "link":"http://www.w3schools.com/html/html_links.asp"},
            {"text":"Massive emigration to Canada...", "link":"Doe"},
            {"text":"Canada builds a wall...", "link":"http://www.w3schools.com/html/html_links.asp"},
            {"text":"Melania Trump wins Pulitzer...", "link":"http://www.w3schools.com/html/html_links.asp"},
            {"text":"Trump divorces Melania...", "link":"http://www.w3schools.com/html/html_links.asp"}

        ]}

);


    play = window.requestAnimationFrame(moveHeadLines);


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
