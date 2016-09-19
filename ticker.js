
var headlines = document.getElementsByClassName('list');
var container = document.getElementById('container');
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


play = window.requestAnimationFrame(moveHeadLines);
