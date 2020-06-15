//Show info popover

function toggleInfo() {
  $(".infolay").toggleClass("infoshow");
  $(".infopop").toggleClass("infoshow");
}


//LIST GENERATION

      //Setup function builds the gallery content, including a check for mobile
      var hoods = [];

      function initPage(){

        $.getJSON("/content.json", function(data) {
          var html = '';
          var i = 0;
          hoods = [{name: 'All', position: new google.maps.LatLng({lat: 32.801, lng: -96.827})}];
          var services = ['All'];
          var addresses = [];

          $.each(data, function(key, value){

          
            if (hoods.filter(hood => hood.name === value.rhood).length<1){
              var obj = {
                name : value.rhood,
                position: new google.maps.LatLng({lat: value.Latitude, lng:value.Longitude})
              };
              hoods.push(obj);
            }
          

            $.each(value.rserv.split(", "), function(){
              if (!services.includes(this.toString())){
                services.push(this.toString());
              }
            });

            //The entry has a uid - unique id in the data-uid tag
            html +='<div class="rlisting shown" data-servs="'+value.rserv+'" data-uid="'+i+'" onclick="openListing('+i+');">'
              html +='<div class="trow">'
                html +='<div class="rname">'+value.rname+'</div>'
                html +='<div class="rloc"><span class="rdist"></span>'+value.rhood+'</div>'
              html +='</div>'

              html +='<div class="row">'
                html +='<div class="rserv">'+value.rserv+'</div>'

                if (value.rloc !=='N/A'){
                  html +='<a class="rdir button" href="https://www.google.com/maps/dir/?api=1&destination='+value.rloc+'" target="_blank">Directions</a>'
                }
              html +='</div>'

              html +='<div class="row">'
                if (value.rnotes !=='N/A'){
                  html +='<div class="rserv">'+value.rnotes+'</div>'
                }
                if (value.rphone !=='N/A'){
                  html +='<a href="tel:'+value.rphone.replace("\\D+", "")+'" class="rphone button">'+value.rphone+'</a>'
                 }
              html +='</div>'

              html +='<div class="row">'
                if (value.fb !=='N/A'){
                  html +='<a class="social" href="'+value.fb+'" target="_blank"><i class="fa fa-facebook-square"></i></a>'
                }
                if (value.ig !=='N/A'){
                  html +='<a class="social" href="'+value.ig+'" target="_blank"><i class="fa fa-instagram"></i></a>'
                }
                if (value.rsite !=='N/A'){
                  html +='<a class="rsite button" href="'+value.rsite+'" target="_blank"><i style="font-size:1.2em" class="fa fa-globe"></i></a>'
                }
              html +='</div>'
            html +='</div>'

              //This is where we link each entry to an address marker
              //give it an ID that matches the uid - unique id
              addresses.push(
                {
                  position: new google.maps.LatLng(value.Latitude,value.Longitude),
                  type: 'restaurant'
                }
              );

              i++;

          });

          var nbhds = $('#locs').html();
          if (navigator.geolocation) {
            nbhds += 'Sort by Nearest<br/><br/><a id="locbut" class="myloc button" onclick="myLocation()">Use My Location</a>'
          }
          nbhds += 'Sort by Neighborhood<br/><br/><select id="nhbut" class="button">'
            $.each(hoods, function(index){
              nbhds +='<option value="'+index+'">'+hoods[index].name+'</div>'  
            });

          nbhds += '</select>'


          var svcs = $('#servs').html();
          svcs +="Services<br/><br/>"
          $.each(services, function(index){
            svcs +='<div class="filterbutton" onclick="filterList(\''+services[index].toString()+'\',true);">'+services[index]+'</div>'
          });

          //Set the HTML
          $('#servs').html(svcs);
          $('#locs').html(nbhds);
          $('#list').html(html);

          //Shuffle results for fairness
          $('#list').shuffleChildren();

          //Bind click events now that html is populated
          addClicks();
          initMap(addresses);
          loadurlstate();

        });
      }


//ADD CLICK EVENTS FOR ALL NEW LIST ITEMS

  //A variable for whether or not filters are opened
  var filtersOpened;

  //a collection of the html divs for the listings, used for animating them opened and closed
  var listings;

//Bind click events for most non-map items
  function addClicks() {

    //Clicks for the Neighborhoods filter
    $('#nhbut').change(function(){ 
      //change the near label
      nearyou = ' Near '+hoods[$(this).val()].name;

      //sort the listings by distance
      sortDistance(hoods[$(this).val()].position, 1);
    });


    //Clicks for the filter section
    var filtersec = document.getElementById("filtersec");
    var filtertoggle = document.getElementById("filters");

    filtertoggle.addEventListener('click', event => {

      if (filtersOpened){
        filtersOpened = !filtersOpened;
        filtersec.classList.remove("filterexp");
        $("#plusbar").fadeIn("fast");
      } else {
        filtersOpened = !filtersOpened;
        filtersec.classList.add("filterexp");
        $("#plusbar").fadeOut("fast");
      }

      setTimeout(function(){ filtersec.scrollIntoView({behavior: 'smooth', block: 'center'}); }, 200);
    });

    var filterbuts = document.querySelectorAll('.filterbutton');


    //Clicks for the expandable listings
    listings = document.querySelectorAll('.rlisting');

    listings.forEach(el => function(index){
      el.addEventListener('click', event => {
        openListing(index);
      });
    });

  }

//The marker that is (or was just) selected, and its z-index
  var selectedMarker;
  var oldZ = 0;

//Function that opens the listing div when a map item is clicked
  function openListing(i){

    //reset any previously highlighted marker icons
    selectedMarker.setIcon({url:'fist1x.png', scaledSize: new google.maps.Size(45, 80)});
    //reset any z-indices
    selectedMarker.setZIndex(oldZ);

    //set the icon for the current listing to our active icon
    selectedMarker = allMarkers.find(x => x.id == i);
    oldZ = selectedMarker.getZIndex();
    selectedMarker.setIcon({url:'fistw1x.png', scaledSize: new google.maps.Size(45, 80)});
    //set the z-index higher so we can see it
    selectedMarker.setZIndex(google.maps.Marker.MAX_ZINDEX+1);

    //Pan to the right marker
    map.setZoom(16);
    map.panTo(selectedMarker.getPosition());

    //Expand the listing
    listings.forEach(el => el.classList.remove("expanded"));
    divr = $("#list").find("div[data-uid=" + i + "]")[0];
    divr.classList.add("expanded");
    setTimeout(function(){ divr.scrollIntoView({behavior: 'smooth', block: 'center'}); }, 200);
  };


//MAPPING FUNCTIONS

  var map;
  var geocoder;
  var allMarkers = [];
  function initMap(addresses) {

    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 32.801, lng: -96.827},
      zoom: 10,
      styles: [
        {
          "stylers": [
            {
              "color": "#000000"
            }
          ]
        },
        {
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#212121"
            }
          ]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "featureType": "administrative.country",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#9e9e9e"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "administrative.locality",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#bdbdbd"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [
            {
              "visibility": "on"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#757575"
            },
            {
              "weight": 1.5
            }
          ]
        },
        {
          "featureType": "poi.park",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#8a8a8a"
            },
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#616161"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#1b1b1b"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#2c2c2c"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#8a8a8a"
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#373737"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#3c3c3c"
            }
          ]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#4e4e4e"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#616161"
            }
          ]
        },
        {
          "featureType": "transit",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#383838"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#000000"
            }
          ]
        }
      ],
      disableDefaultUI: true
    });

    geocoder = new google.maps.Geocoder();


    //custom fist icon
    var icons = {
      restaurant: {
        icon: {url:'fist1x.png', scaledSize: new google.maps.Size(36, 64)}
      }
    };

    // Create markers.
    for (var i = 0; i < addresses.length; i++) {
      var marker = new google.maps.Marker({
        position: addresses[i].position,
        icon: icons[addresses[i].type].icon,
        map: map,
        id: i
      });

      marker.addListener('click', function() {
        openListing(this.id);
      });

      allMarkers.push(marker);

    };

    selectedMarker = allMarkers[0];

    //callback to hide the loader
      $(".loadericon").fadeOut(300,function(){$("#loader").fadeOut();});

  }

//RESTAURANT FILTER FUNCTIONS
var curfilt = 'All';
var nearyou = '';

//Lists the divs in the list that apply
//the value is the filter tag
//keephistory flags whether we add a history entry in the browser
function filterList(value,keephistory) {

  //Close the filter section
  if (filtersOpened){
    document.getElementById("filtersec").classList.remove("filterexp");
    $("#plusbar").fadeIn("fast");
    filtersOpened = !filtersOpened;
  }

  //Push a browser history API state for this choice with the filter value
  if (keephistory) {
      setFilterHistory('filter',value); 
  }

  var list = $("#list");

  if (value == "All") {

    //Show filter status in curfilter
    curfilt = 'All';
    $("#curfilt").html('Showing '+curfilt+nearyou);

    //show all divs
    listings.forEach(el => el.classList.add("shown"));

    //show all mapmarkers
    Array.from(allMarkers).forEach(el => el.setMap(map));

  } else {

    //Show filter status in curfilter
    curfilt = value;
    $("#curfilt").html('Showing '+curfilt+nearyou);

    //show the right divs
    //Notice this *=" <- This means that if the data-category contains multiple options, it will find them
    //Ex: data-filter="art, strategy"

    listings.forEach(el => el.classList.remove("shown"));
      listings.forEach(el => el.classList.remove("expanded"));
    divr = $("#list").find("div[data-servs*='" + value + "']");
    Array.from(divr).forEach(el => el.classList.add("shown"));
    setTimeout(function(){ filtersec.scrollIntoView({behavior: 'smooth', block: 'center'}); }, 200);

    //show the right markers

    Array.from(allMarkers).forEach(el => el.setMap(null));
    $(".shown").each(function(){
      allMarkers.find(x => x.id == this.getAttribute("data-uid")).setMap(map);
    });

  }
}

//Variable filteredset contains the UIDs of all the markers we want to map
//We can remove UIDs from it and redraw the map to

function fnIgnoreEnter(thisEvent) {
      if (event.key === "Enter") {
        tryLocation();
        return false;
      }
    };

//Tries to geocode an input address - disabled as geocoding is expensive -- function may not be usable
/*function tryLocation() {
  geocoder.geocode({'address': $("#myloc").val().toString()}, function(results, status) {
      if (status === 'OK') {
        inloc = new google.maps.LatLng({
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        });
        $("#locbut").html("Sorting Listings...");
        sortDistance(inloc);
      } else {
        console.log('Geocode was not successful for the following reason: ' + status);
      }
  });
}
*/

//Tries to sort by your current sensor location
function myLocation() {
  //change the button to indicate that we're retrieving Location
        $("#locbut").html("Getting Location...");
  //get the geolocation
  navigator.geolocation.getCurrentPosition(function(position){
    myloc = new google.maps.LatLng({lat: position.coords.latitude, lng: position.coords.longitude});
    sortDistance(myloc,0);}
    );
}

//Distance sort function
//loc is the position around which we want to sort 
//mode 0 is sort by device location
//mode 1 is sort by neighborhood
//Third parameter is for neighborhood label
function sortDistance(loc,mode) {
  
  //save the distance between your location and each marker as a value within the marker
  for (i=0;i<allMarkers.length;i++){
    allMarkers[i].distanceTo = google.maps.geometry.spherical.computeDistanceBetween(loc, allMarkers[i].position);
  }

  //sort all markers by distance from the value, this order will be used later
  allMarkers.sort(function(a,b){
    return a.distanceTo-b.distanceTo;
  });

  //write the distance to our html
  for (i=0;i<allMarkers.length;i++){
    $("#list").find("div[data-uid=" + allMarkers[i].id + "]").children(".trow").children(".rloc").children(".rdist").html((allMarkers[i].distanceTo*0.000621371192).toFixed(1)+'mi&nbsp;&nbsp;&nbsp;')
  }

  //reorder the divs
  for (i=1;i<allMarkers.length;i++){
    $("#list").find("div[data-uid=" + allMarkers[i].id + "]").insertAfter($("#list").find("div[data-uid=" + allMarkers[i-1].id + "]")[0]);
  }

  //close any open listings
  listings[selectedMarker.id].classList.remove("expanded");

  //close the filters
  if (filtersOpened){
    document.getElementById("filtersec").classList.remove("filterexp");
    $("#plusbar").fadeIn("fast");
    filtersOpened = !filtersOpened;
  }

  //scroll to the filter top
  setTimeout(function(){ filtersec.scrollIntoView({behavior: 'smooth', block: 'center'}); }, 200);

  //reset the icon of the previously selected listing
  selectedMarker.setIcon({url:'fist1x.png', scaledSize: new google.maps.Size(45, 80)});
  //reset the Z-index of this marker
  selectedMarker.setZIndex(oldZ);

  //pan the map to the value
  map.setZoom(14);
  map.panTo(loc);

  //Show filter status in curfilter
  if (mode==0){
    nearyou = ' Nearby';
    $("#curfilt").html('Showing '+curfilt+nearyou);
  }
  if (mode==1){
    $("#curfilt").html('Showing '+curfilt+nearyou);
  }

  //Reset button status
  $("#locbut").html("Use My Location");

}


//A utility function for shuffling the listings on page load
$.fn.shuffleChildren = function() {
    $.each(this.get(), function(index, el) {
        var $el = $(el);
        var $find = $el.children();

        $find.sort(function() {
            return 0.5 - Math.random();
        });

        $el.empty();
        $find.appendTo($el);
    });
};


//Utility functions for handling history on page load
const
  queryString = window.location.search,
  urlParams = new URLSearchParams(queryString);

function loadurlstate(event) {
  if (event && event.state.filter){
    filterList(event.state.filter,false);
  } else {
    window.history.replaceState({'filter':'All'}, "", '/');
  }
}

function setFilterHistory(name, value) {
    urlParams.set(name, value);
    window.history.pushState({'filter':value}, "", '/');
}

window.onpopstate = function(event) {
  loadurlstate(event);
}