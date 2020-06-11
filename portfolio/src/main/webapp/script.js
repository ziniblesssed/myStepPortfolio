
// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Adds a random greeting to the page.
 */
var map, popup, Popup;

function addMessage() {
  const messages = "Your respose has been received.";

  // Add it to the page.
  const responseContainer = document.getElementById('responseContainer');
  responseContainer.innerText = messages;
}

//Function to load when contact page is loaded
function getServerString (){
    fetch('/data').then(response => response.json()).then((res) => {
    const responseElement = document.getElementById("sentimentContainer");
    responseElement.innerHTML = '';
    for(let i=0; (i < res.length); i++){
        responseElement.appendChild(
            createListElement('First name: ' + res[i].firstName));
        responseElement.appendChild(
            createListElement('Last name: ' + res[i].lastName));
        responseElement.appendChild(
            createListElement('Country: ' + res[i].country));
        responseElement.appendChild(
            createListElement('Message: ' + res[i].subject));
        responseElement.appendChild(
            createListElement('Sentiment Score: ' + res[i].score));
    }
});
}   

//Function to load when max comment is changed
function loadComments() {
    const max = 1;
     fetch('/data?messageChoice='+max).then(response => response.json()).then((res) => {
         const responseElement = document.getElementById("sentimentContainer");
    responseElement.innerHTML = '';
    for(let i=0; (i <max) && (i < res.length); i++){
        responseElement.appendChild(
            createListElement('First name: ' + res[i].firstName));
        responseElement.appendChild(
            createListElement('Last name: ' + res[i].lastName));
        responseElement.appendChild(
            createListElement('Country: ' + res[i].country));
        responseElement.appendChild(
            createListElement('Message: ' + res[i].subject));
        responseElement.appendChild(
            createListElement('Sentiment Score: ' + res[i].score));
    }
});
}

function createListElement(text) {
    const liElement = document.createElement('li');
    liElement.innerText = text;
    return liElement;
}


//Function to load for maps
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 33.500550, lng: -90.327950},
    zoom: 13,
    mapTypeControl: false,
    heading: 90,
    tilt: 45
    });

    
    new AutocompleteDirectionsHandler(map);
}

function rotate90() {
    var heading = map.getHeading() || 0;
    map.setHeading(heading + 90);
}

function autoRotate() {
// Determine if we're showing aerial imagery.
    if (map.getTilt() !== 0) {
         window.setInterval(rotate90, 3000);
    }
}


function createPopupClass() {
  /**
   * A customized popup on the map.
   * @param {!google.maps.LatLng} position
   * @param {!Element} content The bubble div.
   * @constructor
   * @extends {google.maps.OverlayView}
   */
  function Popup(position, content) {
    this.position = position;

    content.classList.add('popup-bubble');

    // This zero-height div is positioned at the bottom of the bubble.
    var bubbleAnchor = document.createElement('div');
    bubbleAnchor.classList.add('popup-bubble-anchor');
    bubbleAnchor.appendChild(content);

    // This zero-height div is positioned at the bottom of the tip.
    this.containerDiv = document.createElement('div');
    this.containerDiv.classList.add('popup-container');
    this.containerDiv.appendChild(bubbleAnchor);

    // Optionally stop clicks, etc., from bubbling up to the map.
    google.maps.OverlayView.preventMapHitsAndGesturesFrom(this.containerDiv);
  }
  // ES5 magic to extend google.maps.OverlayView.
  Popup.prototype = Object.create(google.maps.OverlayView.prototype);

  /** Called when the popup is added to the map. */
  Popup.prototype.onAdd = function() {
        this.getPanes().floatPane.appendChild(this.containerDiv);
  };

  /** Called when the popup is removed from the map. */
  Popup.prototype.onRemove = function() {
        if (this.containerDiv.parentElement) {
            this.containerDiv.parentElement.removeChild(this.containerDiv);
        }
  };

  /** Called each frame when the popup needs to draw itself. */
  Popup.prototype.draw = function() {
        var divPosition = this.getProjection().fromLatLngToDivPixel(this.position);

    // Hide the popup when it is far out of view.
    var display =
        Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000 ?
        'block' :
        'none';

    if (display === 'block') {
        this.containerDiv.style.left = divPosition.x + 'px';
        this.containerDiv.style.top = divPosition.y + 'px';
    }
    if (this.containerDiv.style.display !== display) {
        this.containerDiv.style.display = display;
    }
  };

  return Popup;
}
function AutocompleteDirectionsHandler(map) {
    this.map = map;
    this.originPlaceId = null;
    this.destinationPlaceId = null;
    this.travelMode = 'WALKING';
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.directionsRenderer.setMap(map);

    var originInput = document.getElementById('origin-input');
    var destinationInput = document.getElementById('destination-input');
    var modeSelector = document.getElementById('mode-selector');

    var originAutocomplete = new google.maps.places.Autocomplete(originInput);
    // Specify just the place data fields that you need.
    originAutocomplete.setFields(['place_id']);

    var destinationAutocomplete =
        new google.maps.places.Autocomplete(destinationInput);
    // Specify just the place data fields that you need.
    destinationAutocomplete.setFields(['place_id']);

    this.setupClickListener('changemode-walking', 'WALKING');
    this.setupClickListener('changemode-transit', 'TRANSIT');
    this.setupClickListener('changemode-driving', 'DRIVING');

    this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
    this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');

    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(
        destinationInput);
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(modeSelector);
}

// Sets a listener on a radio button to change the filter type on Places
// Autocomplete.
AutocompleteDirectionsHandler.prototype.setupClickListener = function(
    id, mode) {
    var radioButton = document.getElementById(id);
    var me = this;

    radioButton.addEventListener('click', function() {
        me.travelMode = mode;
        me.route();
    });
};

AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(
    autocomplete, mode) {
    var me = this;
    autocomplete.bindTo('bounds', this.map);

    autocomplete.addListener('place_changed', function() {
        var place = autocomplete.getPlace();

        if (!place.place_id) {
        window.alert('Please select an option from the dropdown list.');
        return;
        }
        if (mode === 'ORIG') {
        me.originPlaceId = place.place_id;
        } else {
        me.destinationPlaceId = place.place_id;
        }
        me.route();
    });
};

AutocompleteDirectionsHandler.prototype.route = function() {
  if (!this.originPlaceId || !this.destinationPlaceId) {
    return;
  }
    var me = this;

    this.directionsService.route(
        {
            origin: {'placeId': this.originPlaceId},
            destination: {'placeId': this.destinationPlaceId},
            travelMode: this.travelMode
        },
        function(response, status) {
            if (status === 'OK') {
            me.directionsRenderer.setDirections(response);
            } else {
            window.alert('Directions request failed due to ' + status);
            }
        });
};


function initMap2() {
    // Create the map.
    var lagos = {lat: 6.458985, lng: 3.601521};
    map = new google.maps.Map(document.getElementById('map'), {
        center: lagos,
        zoom: 1
    });

    // Create the places service.
    var service = new google.maps.places.PlacesService(map);
    var getNextPage = null;
    var moreButton = document.getElementById('more');
    moreButton.onclick = function() {
        moreButton.disabled = true;
        if (getNextPage) getNextPage();
    };

    // Perform a nearby search.
    service.nearbySearch(
        {location: lagos, radius: 2000, type: ['store']},
        function(results, status, pagination) {
            if (status !== 'OK') return;

            createMarkers(results);
            moreButton.disabled = !pagination.hasNextPage;
            getNextPage = pagination.hasNextPage && function() {
            pagination.nextPage();
            };
        });
}

function createMarkers(places) {
    var bounds = new google.maps.LatLngBounds();
    var placesList = document.getElementById('places');

    for (var i = 0, place; place = places[i]; i++) {
        var image = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
        };

        var marker = new google.maps.Marker({
            map: map,
            icon: image,
            title: place.name,
            position: place.geometry.location
        });

        var li = document.createElement('li');
        li.textContent = place.name;
        placesList.appendChild(li);

        bounds.extend(place.geometry.location);
    }
    map.fitBounds(bounds);
}