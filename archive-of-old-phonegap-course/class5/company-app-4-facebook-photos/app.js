// Internal News Module
(function(){ 
  var News = (function(){
    
    function News() {
      this.news = [];

    }

    // params: element: the DOM element that the news is going to append
    News.prototype.fetch = function(element) {
      $.ajax({
        url: "http://makzan-temp.s3.amazonaws.com/news.json",
        // url: "http://localhost:8888/news.json",
        type: "GET",
        crossDomain: true,
        dataType: "jsonp",   
        jsonpCallback: 'callback',
        success: (function (data) {
          this.news = data.news;

          $(element).empty();
          for (var i=0, len=data.news.length; i<len; i++)
          {
            var news = data.news[i];
            var listItem = ["<li><a data-news-id=", i, " href='#news-detail'>", news.title, "</a></li>"].join('');            
            $(element).append(listItem);
          }           
          $(element).listview('refresh');
        }).bind(this),          
      });
    
    }
    
    return News;
  })();

  // define it in global scope.
  if (!this.greatLtd) this.greatLtd = {}
  this.greatLtd.News = News;

}).call(this);

// Facebook Page Photo Module
(function() {
  var FacebookPhotos = (function(){
    function FacebookPhotos(){}

    FacebookPhotos.prototype.fetch = function(){
      $.ajax({
        url: 'http://graph.facebook.com/159679440710689/photos',
        type: 'GET',
        crossDomain: true,
        jsonp: 'callback',
        jsonpCallback: 'callback',
        dataType: 'jsonp',
        success: function (data) {
          console.log('from fb: ', data);  
          for(var i=0, len=data.data.length; i<len; i++)
          {
            var image = data.data[i];
            $('#photos').append(["<div class='photo' style='background-image:url(", image.picture, ")'></div>"].join(''));
          }          
        }
      })      
    }

    return FacebookPhotos;
  })();

  // export it in global scope.
  if (!this.greatLtd) this.greatLtd = {}
  this.greatLtd.FacebookPhotos = FacebookPhotos;

}).call(this);

// Twitter Search Module
(function() {

  var TwitterQuery = (function(){
    function TwitterQuery(query) {
      this.query = query;
      this.twitterURL = "http://search.twitter.com/search.json?q=" + this.query + "&rpp=10&callback=?";      
    }

    TwitterQuery.prototype.fetch = function(element) {
      $.getJSON(this.twitterURL, function(data) {        
        $(element).empty();
        for (var i=0, len=data.results.length; i < len; i++) {
          var tweet = data.results[i];
          $(element).append("<li><img src='images/empty.png' style='background-image:url(" + tweet.profile_image_url + ")'><h1>" + tweet.from_user + "</h1> <p>" + tweet.text + "</p> </li>");
        }
        $(element).listview('refresh');
      });
    }

    return TwitterQuery;
  })();

  // export the TwitterQuery to global scope
  if (!this.greatLtd) this.greatLtd = {}
  this.greatLtd.TwitterQuery = TwitterQuery;


}).call(this);

(function(){  

  // alias the Classes
  var TwitterQuery   = greatLtd.TwitterQuery,
      News           = greatLtd.News,
      Utils          = greatLtd.Utils;
      FacebookPhotos = greatLtd.FacebookPhotos;

  var news; // store the news instance.


  // jQuery Ready
  $(function(){

    // default transition: slide
    $.mobile.defaultPageTransition = 'slide';

    // append footer to each page
    $("[data-role='page']").each(function() {    
      var footer = $(".footer-template").html();
      $(this).append(footer);  


      // footer active state
      var target = 'footer .first-page a';
      switch ($(this).attr('id')) {
        case 'twitter'  : target = 'footer .second-page a'; break;
        case 'about'    : 
        case 'map-page' :   target = 'footer .second-page a'; break;        
        case 'facebook' : target = 'footer .facebook-page a'; break;
      }      

      $(this).find(target).addClass('ui-state-persist').addClass('ui-btn-active');      

    });

    // listen to the a href=#news-detail link to get the news ID.
    $("a[href='#news-detail']").live('vclick', function(event){      
      var newsId = $(this).data('newsId');

      // load the news.
      var contentElement = $("#news-detail > section[data-role='content']"); // cache the content element.
      var newsData = news.news[newsId];
      if (newsData === undefined)
      {
        contentElement.html('Error loading news content.');
      }
      else
      {
        var newsText = "<h2>" + newsData.title + "</h2>";
        newsText    += "<strong>" + newsData.date + "</strong>";
        newsText    += "<small> (" + moment(newsData.date, 'YYYY-MM-DD hh:mm:ss').fromNow() + ") </small>";
        if (newsData.image != undefined)
          newsText  += "<p><img src='" + newsData.image + "'></p>";
        newsText    += "<p>" + newsData.content + "</p>";
        contentElement.html(newsText);
      }
    });


    // listen to the pageBeforeShow event
    $(document).bind('pagebeforeshow', function(event, ui) {  
      switch ($(event.target).attr('id')) {
        case 'main':
          news = new News();
          news.fetch($('#news-list'));
          break;        
        case 'twitter':
          var twitter = new TwitterQuery("Great Limited");
          twitter.fetch($("#tweet-list"));
          break;
        case 'map-page':
          $('#map').gmap('addMarker', {
            'position': '22.192362,113.54206',
            'bounds': true
          });
          break;
        case 'facebook':
          (new FacebookPhotos()).fetch();
          break;    
      }
      
    });

    // let the jQuery Mobile initialize the page.
    $.mobile.initializePage();      

  })
  

}).call(this);

