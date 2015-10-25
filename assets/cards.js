// An object that will eventually let us look up movies by a unique ID.
var moviesDictionary = {};

function fetchData() {
  var rawTemplate = $('#thumbnail-template').html();

  $.get('https://glowing-torch-8403.firebaseio.com/posts.json', function(posts) {
    // Stamp out cards and append them into <div id="cards-container"></div>
    for (var i = 0; i < posts.length; i++) {
      var currentMovie = posts[i];
      var stampedTemplate = Mustache.render(rawTemplate, currentMovie);
      $('#cards-container').append(stampedTemplate);
    };

    // Our "pre-processing" step where we take the movies array we got from
    // our database and creates an object out of it.
    buildDictionary(posts);
    bindEventListeners();
  });

}

function bindEventListeners() {
  // Whenever any card gets clicked, show the lightbox.
  $('.card').click(function(e) {
    // e.target is the <div> that got clicked. The ID of that div holds a key
    // we can use to "look up" movie info in our moviesDictionary. Tricky.
    var targetId = e.target.id;
    var info = moviesDictionary[targetId];

    // Hack to make it so cast members are comma + space separated.
    if (Array.isArray(info.cast)) {
      info.cast = info.cast.join(', ');
    }

    // Now that we have our info, simply stamp out our lightbox template.
    var rawTemplate = $('#lightbox-template').html();
    var stampedTemplate = Mustache.render(rawTemplate, info);
    $('#lightbox-container').html(stampedTemplate);
    $('#lightbox-container').fadeIn();
    $('#mask').fadeIn();
  });

  // Fade out the lightbox and dimmer mask when the mask is clicked.
  $('#mask').click(function() {
    $('#lightbox-container').fadeOut();
    $('#mask').fadeOut();
    $('#music')[0].pause();
  });
}

function buildDictionary(posts) {
  // Take the movies array and convert it into an object.
  // moviesDictionary holds that object and we can use it to do lookups.
  for (var i = 0; i < posts.length; i++) {
    var currentMovie = posts[i];
    moviesDictionary[currentMovie.id] = currentMovie;
  }
}

fetchData();
