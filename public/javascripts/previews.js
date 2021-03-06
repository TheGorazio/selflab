'use strict';
var page = location.pathname.split("/")[1];

function deletePreview(id) {
    var headers = new Headers();
    var data = JSON.stringify({
            id: id
        });
    var fetchOptions = { 
        method: 'POST',
        body: JSON.stringify({
            id: id
        }),
        headers: headers,
        mode: 'cors'
    };
    $.post('/previews/delete', {
        id: id
    })
    .done((data) => {
        location.href = '/previews';
    })
    .fail((err) => {
        document.getElementsByTagName('h1')[0].innerHTML = 'Error';
        document.getElementsByTagName('h1')[0].style.color = 'red';
    });
}

function deletePhotoset(id) {
    var headers = new Headers();
    var data = JSON.stringify({
            id: id
        });
    var fetchOptions = { 
        method: 'POST',
        body: JSON.stringify({
            id: id
        }),
        headers: headers,
        mode: 'cors'
    };
    $.post('/photosets/delete', {
        id: id
    })
    .done((data) => {
        location.href = '/photosets';
    })
    .fail((err) => {
        document.getElementsByTagName('h1')[0].innerHTML = 'Error';
        document.getElementsByTagName('h1')[0].style.color = 'red';
    });
}

$(window).load(function() {
    console.log('Document is ready', location.href);
    var images = Array.from(document.getElementsByClassName('gallery__el')).map((img) => img.src);;
    
    var selectedImages = [];
    var deleteImagesBtn = $('#deleteImagesBtn');

    var galleryDOM = $('.gallery');
    var photoDOM = $('#photo_img')[0];
    $('#editPreviewForm').submit((e) => {
        e.preventDefault();
        images = Array.from(document.getElementsByClassName('gallery__el')).map((img) => img.src);
        $.post('/previews/edit', {
            id: location.href.split('/')[5],
            name: e.target.previewName.value,
            photoUrl: photoDOM.src,
            gallery: images
        })
        .done((data) => {
            location.href = '/previews';
        })
        .fail((err) => {
            document.getElementsByTagName('h1')[0].innerHTML = 'Error';
            document.getElementsByTagName('h1')[0].style.color = 'red';
        });
    });
    $('#newPreviewForm').submit((e) => {
        e.preventDefault();        
        images = Array.from(document.getElementsByClassName('gallery__el')).map((img) => img.src);
        $.post('/previews/create', {
            name: e.target.previewName.value,
            photoUrl: photoDOM.src,
            gallery: images
        })
        .done((data) => {
            location.href = '/previews';
        })
        .fail((err) => {
            console.log(err);
            document.getElementsByTagName('h1')[0].innerHTML = 'Error';
            document.getElementsByTagName('h1')[0].style.color = 'red';
        });
    });
    $('#photoLoader').on('click', function(e) {
        $(this).val('');
    });
    $('#photoLoader').on('change', function (e) {
        console.log('Upload photo...');
        uploadPhoto('photo', e.target.files[0], photoLoaderCallback.bind(null, photoDOM));
    });
    $('#imgLoader').on('click', function(e) {
        $(this).val('');
    });
    $('#imgLoader').on('change', function (e) {
        console.log('Upload image...');
        if (page === 'photosets') 
            uploadPhoto('image', e.target.files[0], imgLoaderCallback.bind(null, $('.photoset__gallery .gallery__imgs'), images, imgClickHandler.bind(null, selectedImages, deleteImagesBtn)));
        else
            uploadPhoto('image', e.target.files[0], imgLoaderCallback.bind(null, galleryDOM, images, imgClickHandler.bind(null, selectedImages, deleteImagesBtn)));
         
        $(this).value = null;
    });
    $('.gallery__el').on('click', imgClickHandler.bind(null, selectedImages, deleteImagesBtn));

    $('#deleteImagesBtn').on('click', function(e) {
        e.preventDefault();
        console.log(selectedImages);
        $.post('/photo/delete', {
            photos: selectedImages.map((img) => $(img)[0].src)
        })
        .done((res) => {
                selectedImages.map((image) => {
                    image.remove();
                });
            selectedImages = [];
            deleteImagesBtn.addClass('hide');
        })
        .fail((error) => console.error('error'));
    });

    $('#newPhotosetForm').submit((e) => {
        e.preventDefault();        
        images = Array.from(document.getElementsByClassName('gallery__el')).map((img) => img.src);
        $.post('/photosets/create', {
            name: e.target.photosetName.value,
            description: e.target.photosetDescription.value,
            gallery: images
        })
        .done((data) => {
            location.href = '/photosets';
        })
        .fail((err) => {
            console.log(err);
            document.getElementsByTagName('h1')[0].innerHTML = 'Error';
            document.getElementsByTagName('h1')[0].style.color = 'red';
        });
    });
});

function imgClickHandler(selectedImages, deleteImagesBtn, img) {
    var _this = $(img.target)
    if (_this.hasClass('chosen')) {
        selectedImages.splice(selectedImages.indexOf($(this), 1));
        _this.removeClass('chosen');
    } else {
        deleteImagesBtn.removeClass('hide');
        selectedImages.push(_this);
        _this.addClass('chosen');
    }
    if (selectedImages.length == 0) {
        deleteImagesBtn.addClass('hide');
    }
};

function imgLoaderCallback(galleryDOM, images, handler, img) {
    var newImage = $('<img>');
        newImage.attr('src', img);
        newImage.addClass('gallery__el');
        newImage.on('click', handler);
    galleryDOM.prepend(newImage);
    images.push(img);
};

function photoLoaderCallback(photoDOM, img) {
    photoDOM.src = img;
};

function uploadPhoto(dest, photo, callback) {
    var loader;
    
    var loadWrapper = $('<div>');
        loadWrapper.addClass('loadWrapper');
        loadWrapper.addClass('gallery__el');

        if (dest === 'image') {
            if (page === 'photosets')
                $('.photoset__gallery .gallery__imgs').prepend(loadWrapper);                    
            else {
                $('.gallery').prepend(loadWrapper);        
            }
        } else if (dest === 'photo') {
            $('#photo_img').toggleClass('hide');
            $('.photo_place').prepend(loadWrapper);
        }
        loader = $('<div>');
        loader.addClass('loader');
        loader.addClass('load');
        loadWrapper.append(loader);
        loader = $('.loader');



    var formData = new FormData();
    formData.append("photo", photo, photo.name);
    $.ajax({
        url: '/photo/upload',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data) {
            console.log('upload successful');
            loader.removeClass('load');
            loader.addClass('success');
            loader.text('✓');
            setTimeout(() => {
                loadWrapper.remove();
                if (dest === 'photo') 
                    $('#photo_img').toggleClass('hide');
                return callback(data);
            }, 3000);
        },
        error: function(err) {
            console.error('upload error');            
            loader.removeClass('load');
            loader.addClass('error');
            loader.text('❌')
            setTimeout(() => {
                loadWrapper.remove();
                if (dest === 'photo') 
                    $('#photo_img').toggleClass('hide');                
            }, 3000);
        }
    });
};