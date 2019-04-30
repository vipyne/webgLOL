;(function(window, document, undefined){

// generate html list

  var daysHTML = document.getElementById('webglol'),
      docFrag  = document.createDocumentFragment(),
      // update this number as the chronicles continue.
      numberOfDoneSketches = 10;


  for (var row = 1; row <= 1; row++) {
    var ul     = document.createElement('ul'),
        tempArray = [];
    for (var column = 1 * row; column <= 10 * row; column++) {
      var liArray = [],
          markup;
      if (column <= numberOfDoneSketches) {
        markup  = '<li><a href="' + column + '/index.html">LOL <span>' + column + '</span></a></li>';
      } else {
        markup = '<li class="is-disabled"><a href="#">LOL <span>' + column + '</span></a></li>';
      }
      tempArray.push(markup);
      liArray = tempArray.slice(-10);
      ul.innerHTML = liArray.join('');
    }
    docFrag.appendChild(ul);
    ul = null;
  }

  daysHTML.appendChild(docFrag);

})(window, document);