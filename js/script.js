
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', ' + cityStr;

    $greeting.text("So, you want to live at " + address + "?");

    var imageURL = "https://maps.googleapis.com/maps/api/streetview?size=600x400&location=" 
    + address + '';

    $('body').append('<img class="bgimg" src="' + imageURL + '">');

    NYT_URL = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' +
        cityStr + '&sort=newest&fl=web_url,snippet,abstract,headline&' +
        'api-key=3a1a0759ad5b9cece24f5fbcfad29552:0:74938298';

    $.getJSON(NYT_URL)
        .fail(function(){
            $nytHeaderElem.text('New York Times Articles could not be loaded');
        })
        .done(function(data){
        $nytHeaderElem.text('New York Times Articles About ' + cityStr);
        for(var item = 0; item < data.response.docs.length; item++){
            var snippetStr = data.response.docs[item].snippet;
            var headlineStr = data.response.docs[item].headline.main;
            var article_URL = data.response.docs[item].web_url;
            $nytElem.append('<li class="article">' +
                '<p><a href="' + article_URL +
                '">' + headlineStr + '</a></p>' +
                '<p>' + snippetStr + '</p></li>');
        }
    });

    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text('Failed to get wikipedia resources');
    }, 8000);

    $.ajax({
        url: 'https://en.wikipedia.org/w/api.php',
        data: {action: 'opensearch', search: cityStr, prop: 'info', inprop: 'url', format: 'json'},
        dataType: 'jsonp',
        success: function(x, y, z){
            for(var entry = 0; entry < x[1].length; entry++){
                $wikiElem.append('<li><p><a href="' + 
                x[3][entry] + '">' + 
                x[1][entry] + '</a></p></li>');
            }
            clearTimeout(wikiRequestTimeout);
        }
    });

    return false;
};

$('#form-container').submit(loadData);

