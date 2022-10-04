let map: google.maps.Map;
let service: google.maps.places.PlacesService;
let infowindow: google.maps.InfoWindow;

// Initialize and add the map
function initMap(): void {
  const directionsRenderer = new google.maps.DirectionsRenderer();
  const directionsService = new google.maps.DirectionsService();
  const map = new google.maps.Map(
    document.getElementById('map') as HTMLElement,
    {
      zoom: 10,
      center: { lat: 10.256404467729576, lng: 123.83206510130182 },
    }
  );

  // No. 4 - Customers can get directions to the restaurant from the current location.
  directionsRenderer.setMap(map);
  directionsRenderer.setPanel(
    document.getElementById('sidebar') as HTMLElement
  );

  const control = document.getElementById('floating-panel') as HTMLElement;

  map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);

  const onChangeHandler = function () {
    calculateAndDisplayRoute(directionsService, directionsRenderer);
  };

  (document.getElementById('start') as HTMLElement).addEventListener(
    'change',
    onChangeHandler
  );
  (document.getElementById('end') as HTMLElement).addEventListener(
    'change',
    onChangeHandler
  );

  //No. 1 - Plot restaurants across Cebu.
  setMarkers(map);

  //Draw a circle or rectangle on the map and show the number of restaurants within the circle or rectangle
  const rectangleCoords = [
    { lat: 10.176028872566052, lng: 123.72136843910634 },
    { lat: 10.194763113150376, lng: 123.6962393047991 },
    { lat: 10.287104977130502, lng: 123.85173478977663 },
    { lat: 10.267197816144588, lng: 123.8792885128273 },
  ];

  // Construct the polygon.
  const rectangleVicinity = new google.maps.Polygon({
    paths: rectangleCoords,
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
  });

  rectangleVicinity.setMap(map);
}

/**
 *  Data for the markers consisting of a name, a LatLng and a zIndex for the
 *  order in which these markers should display on top of each other.
 */
const restaurants = [
  [
    'Filipino Restaurant - MINGLANILLA PH',
    10.23794026353493,
    123.77741290290393,
    1,
  ],
  ['Korean Restaurant - NAGA PH', 10.21008564641697, 123.75901429758628, 2],
  [
    'Japanese Restaurant - TALISAY PH',
    10.256404467729576,
    123.83206510130182,
    3,
  ],
];

/**
 * Set markers
 */
function setMarkers(map) {
  const shape = {
    coords: [1, 1, 1, 20, 18, 20, 18, 1],
    type: 'poly',
  };

  for (let i = 0; i < restaurants.length; i++) {
    const resto = restaurants[i];

    new google.maps.Marker({
      position: { lat: resto[1], lng: resto[2] },
      map,
      shape: shape,
      title: resto[0],
      zIndex: resto[3],
    });
  }
}

/**
 * Calculate and display route.
 */
function calculateAndDisplayRoute(
  directionsService: google.maps.DirectionsService,
  directionsRenderer: google.maps.DirectionsRenderer
) {
  const start = (document.getElementById('start') as HTMLInputElement).value;
  const end = (document.getElementById('end') as HTMLInputElement).value;

  directionsService
    .route({
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING,
    })
    .then((response) => {
      directionsRenderer.setDirections(response);
    })
    .catch((e) => window.alert('Directions request failed due to ' + status));
}

declare global {
  interface Window {
    initMap: () => void;
  }
}

window.initMap = initMap;
export {};
