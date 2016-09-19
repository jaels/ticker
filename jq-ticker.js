
(function() {
    var container = document.getElementById('container');
    var counter = 0;
    var headlinesRequest = new XMLHttpRequest;
    var headlinesArray = [];

    headlinesRequest.open('GET', 'http://127.0.0.1:8080/jq-ticker.JSON');

    headlinesRequest.send();

    headlinesRequest.addEventListener('readystatechange', function() {
        if (headlinesRequest.readyState == XMLHttpRequest.DONE) {
            var arr = JSON.parse(headlinesRequest.response);
            for (var i=0;i<arr.length;i++){
                var newLink = document.createElement('newLink');
                newLink.innerHTML = arr[i].text;
                newLink.href = arr[i].link;
                newLink.classList.add("list");
                container.appendChild(newLink);

            }
            play = window.requestAnimationFrame(moveHeadLines);

        }
    });




    var headlines = document.getElementsByClassName('list');
    var moveLeft = 0;
    var width;
    var play;
    function moveHeadLines() {

        container.style.left = moveLeft + "px";

        moveLeft = moveLeft - 2;


        width = headlines[0].offsetWidth;

        if(container.offsetLeft<= -width){
            container.appendChild(headlines[0]);
            moveLeft+=width + 2;
            container.style.left = moveLeft + "px";

        }


        play=window.requestAnimationFrame(moveHeadLines);
    }

    container.addEventListener('mouseover', function() {
        cancelAnimationFrame(play);

    });

    container.addEventListener('mouseout', function() {
        play=window.requestAnimationFrame(moveHeadLines);
    });



})();
