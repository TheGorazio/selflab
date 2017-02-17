window.onload = function () {
    console.log('loaded');
    var boxes = document.getElementsByClassName('box');
    var cutBox = null;
    var gallery = document.getElementsByClassName('right')[0];

    for (var i = 0; i < boxes.length; i++) {
        boxes[i].addEventListener('click', function(i, e) {
            showBoxById(i);
        }.bind(this, i));
    }
    gallery.addEventListener('click', function(e) {
        if (e.target.classList.value !== 'box chosen' && cutBox !== null) {
            gallery.classList = 'right';
            cutBox.classList = 'box'; 
            cutBox = null;
        }    
    });
    function showBoxById(id) {
        cutBox = boxes[id];
        gallery.classList = 'right choosing';
        cutBox.classList = 'box chosen';
    }
};