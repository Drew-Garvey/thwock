/*=============================================
 *
 * Get Device Data
 *
 *=============================================*/

// grab device data
var grabDevices = $.getJSON('../devices.json');
// device data successfully loaded
grabDevices.done(function(data) {
  devices = data.devices;
});
// there was a problem with async device call
grabDevices.fail(function() {
  console.log('no device data found');
});

/* =========================================
*
* Event Handlers
* ——————
* Need event handlers for:
* 1) Change Device
* 2) Change Device Orientation
* 3) Chnage Scroll Type
* 4) Change Screenview
* 5) Change Device Display Color
* 6) Change Page Background Color
* ---------
* To be added later:
* 7) Change Device Color
* 8) Change Device Border Color
* 
*==========================================*/
// 1) Change Device
$('#device-selector').change(function() {
    newDevice = this.value;
    //updateAppView.device(newDevice);
    appState.set('device', newDevice);
    // Determine if 
    if (devices[newDevice]['has-landscape'] === false) {
      var orientationToggle = $('#device-orientation');
      appUI.disableToggle(orientationToggle);
    } else if (devices[newDevice]['has-landscape'] === true) {
      var orientationToggle = $('#device-orientation');
      appUI.enableToggle(orientationToggle);
    }
   
});
// 2) Change Device Orientation
$('#device-orientation').change(function() {
  if ($(this).is(':checked')) {
    newOrientation = 'landscape';
  } else {
    newOrientation = 'portrait'
  }
  appState.set('orientation', newOrientation);
  console.log('new orientation is ' + newOrientation);
});
// 3) Change Scroll Type
$('#scroll-option').change(function() {
  if ($(this).is(':checked')) {
    newScrollType = 'overflow';
  } else {
    newScrollType = 'scroll';
  }
  appState.set('scrollType', newScrollType);
});
// 4) Change Screen View with External URL
$('#external-file__input').keyup(function(ev) {
  newURL = this.value;
  if (ev.keyCode === 13) {
    console.log('Enter URL Pressed');
    appState.set('isIframe', 'true');
    appState.set('screenLocation', newURL);
    var scrollToggle = $('#scroll-option');
    appUI.disableToggle(scrollToggle);
  }
});
// 4) Change Screen View with uploaded screenshot
$('#local-file__input').keyup(function(ev) {
  newScreenShot = URL.createObjectURL(ev.target.files[0]);
  if (ev.keyCode === 13) {
    console.log('Enter ScreenShot Pressed');
    appState.set('isIframe', 'false');
    appState.set('screenLocation', newScreenShot);
    var scrollToggle = $('#scroll-option');
    appUI.enableToggle(scrollToggle);
  }
});
// 5) Change Device Display Color
$('#device-background-color').change(function() {
  newColor = this.value;
  appState.set('deviceColor', newColor);
});
// 6) Page Background Color
$('#page-background-color').change(function() {
  newColor = this.value;
  appState.set('bgColor', newColor);
});

/* =========================================
 *
 * App State
 * —————— 
 *
 *==========================================*/

var appState = (function() {

  // Default model values
  var model = {
    device: "iPhone",
    deviceColor: "#fff",
    orientation: "portait",
    scrollType: "scroll",
    screenshotWidth: null,
    isIframe: true,
    bgColor: "#fff",
    screenLocation: "http://globaldocs.us"
  }


  function initApp() {
    //currentModelbyURL
    //if thats not valid, than model stays the same (aka default)
    // otherwise, set the model to parsed state
    // init app with sets
    if (currentModelbyURL() !== false) {
      console.log("Im not a default version of app!");
      //updateURL(model);
      model = currentModelbyURL();
    } 

    console.log(model);
    // initialize app view by kicking off each paramater
   // console.log('initializing with: ');
    for (var paramater in model) {
      //console.log(paramater);
        if (model.hasOwnProperty(paramater)) {
          //console.log('paramter: ' + paramater);
          //console.log('value: ' + model[paramater]);
          set(paramater, model[paramater]);
          //console.log(paramater + ' , ' + model[paramater]);
        }
      }
    //console.log(currentModel);

  }

   // Decode json to URL string
  function jsonToURI(json) { 
    return encodeURIComponent(JSON.stringify(json)).replace(/%5B/g, '[').replace(/%5D/g, ']'); 
  }

  // Encode URL string to json object
  function uriToJSON(urijson) { 
    return JSON.parse(decodeURIComponent(urijson)); 
  }
  
  // Defualt urlString
  urlString = jsonToURI(model);
  //console.log(urlString);

  function currentModelbyURL() {
    url = window.location.hash;
    queryParam = url.substr(2);
    //console.log('current url model = '+ queryParam);
    if (queryParam !== "") {
      return uriToJSON(queryParam);
    } else {
      return false;
    }
  }

  function updateURL(obj) {
    stringifiedObj = jsonToURI(obj);
    window.location.hash = '#!' + stringifiedObj;
  }

  // Checks if app state paramater exist and pushes if yes
  function get(value) {
    for (var paramater in model) {
      if (paramater === value) {
        return paramater;
      }
    }
  }

  // Functions sets new appState
  function set(paramater, value) {
    //console.log('paramter: ' + paramater);
    //console.log('value: ' + value);
    model[paramater] = value; 
    // eg - parameter is scrollType
    // eg - value is landscape
    // Updates AppView based on naming functions after their respective paramater name
    var updateParamater = updateAppView[paramater];
    if (updateParamater) {
      updateParamater(value); // updateView
                              // updateObject

      //updateQueryStringParameter(urlString, paramater, value); // updateURL (+push to history) 
    }
  }

  // if the parameter/value pair passed to this function has a value different than the current model,
  // than update the URL. 
  function updateModel(paramater,value) {
    currentModel = model;

    if(value === currentModel[paramater]) {
      console.log(paramater + " value is same as current value");
    } else {
      console.log(paramater + " value is differnt as current value");
      currentModel[paramater] = value;
    }
      
      //model = currentModelbyURL();
      //model[paramater] = value;
      //updateURL(model);
   
  }
  // Return methods so they can be used
  return {
    currentModel: model,
    currentModelbyURL: currentModelbyURL,
    get: get,
    set: set,
    updateURL: updateURL,
    updateModel: updateModel,
    init: initApp
  }
})();

// whatchu look like baby??
//console.log(appState.currentModel);
/* =========================================
 *
 * Update App View
 * ——————  
 *
 *==========================================*/
var updateAppView = (function() {
  // Sets the active device in the UI
  function device(device) {
    appState.updateModel('device', device);
    //console.log(device);
    var deviceDetails = $('.selected-device__details');
    $('.device__wrap').find('.current--device').removeClass('current--device');
    // Find device info from selcted device
    /*
    for (var this_device in devices) {
      if(this_device === device) {
        new_device = devices[device];
        $(new_device['selector']).parent().addClass('current--device');
        var html = '<h4 class="selected-device__name">'+ new_device['name'] +'</h4>';
        deviceDetails.html(html);
        //return new_device;
      }
    }
    */
  }

  // Sets the device color in the UI
  function deviceColor(color) {
    appState.updateModel('deviceColor', color);
    //console.log(value);
  }
  // Sets the active device orientation in the UI
  function orientation(currentOrientation) {
    appState.updateModel('orientation', currentOrientation);

    if (currentOrientation === 'landscape') {
      $('.marvel-device').addClass('landscape');
    } else {
      $('.marvel-device').removeClass('landscape');
    }
  }
  // Sets the scroll type on active device in the UI
  function scrollType(currentScrollType) {
    appState.updateModel('scrollType', currentScrollType);
    
    if (currentScrollType === 'overflow') {
      $('.screen').removeClass('scroll');
    } else {
      $('.screen').addClass('scroll');
    }
  }
  // Sets the page background color in the UI
  function bGColor(color) {
    appState.updateModel('bGColor', color);
    $('body').css('background-color', color);
    console.log('new background color is ' + color);
  }
  // Sets URL for the location of the iFrame/screenshot
  function screenLocation(screenViewURL) {
    appState.updateModel('screenLocation', screenViewURL);
    var screenContainer = $('.screen');
    var screenShot = $('.screenshot').length;
    var iframe = $('.frame').length;
    // If screen view is from an external url, display it in an iframe
    if(appState.currentModel.isIframe === 'true') {
      // If a screenshot already exsist, delete it before adding iframe
      if (screenShot) {
        $('.screenshot').remove();
        screenContainer.append('<iframe class="frame" src="'+ screenViewURL +'"></iframe>');
      // if iframe already exsist, just update the url
      } else if (iframe) {
        $('.frame').attr('src', screenViewURL);
      }
      screenContainer.addClass('has--iframe');
    // If screen view is from a local file, display as image
    } else {
      // If a iframe already exsist, delete it before adding screenshot
      if (iframe) {
        $('.frame').remove();
        screenContainer.removeClass('has--iframe');
        screenContainer.append('<img class="screenshot" src="'+ screenViewURL +'" />');
      // if screenshot already exsist, just update the url
      } else if (screenShot) {
        $('.screenshot').attr('src', screenViewURL);
      }
    }
    console.log(screenViewURL);
  }

  // Return methods so they can be used
  return {
    device: device,
    deviceColor: deviceColor,
    orientation: orientation,
    scrollType: scrollType,
    bgColor: bGColor,
    screenLocation: screenLocation
  }
})();

var appUI = (function() {
  // Model Window Functionality
  var modelWindow = (function() {
    var overlay = document.querySelector( '.md-overlay' );
    [].slice.call( document.querySelectorAll( '.md-trigger' ) ).forEach( function( el, i ) {
        var modal = document.querySelector( '#' + el.getAttribute( 'data-modal' ) ),
            close = modal.querySelector( '.md-close' ),
            view = modal.querySelector('.view-screengrab');
        function removeModal( hasPerspective ) {
          classie.remove( modal, 'md-show' );
          if( hasPerspective ) {
            classie.remove( document.documentElement, 'md-perspective' );
          }
        }
        function removeModalHandler() {
          removeModal( classie.has( el, 'md-setperspective' ) ); 
        }
        el.addEventListener( 'click', function( ev ) {
          classie.add( modal, 'md-show' );
          overlay.removeEventListener( 'click', removeModalHandler );
          overlay.addEventListener( 'click', removeModalHandler );
          if( classie.has( el, 'md-setperspective' ) ) {
            setTimeout( function() {
              classie.add( document.documentElement, 'md-perspective' );
            }, 25 );
          }
        });
        close.addEventListener( 'click', function( ev ) {
          ev.stopPropagation();
          removeModalHandler();
        });
        $(document).keyup(function(ev) {
          if (ev.which === 27 || ev.which === 13) {
            removeModalHandler();
          }
        });
        if (view) {
          view.addEventListener('click', function( ev ) {
            ev.stopPropagation();
            removeModalHandler();
          });
        }
    });   
  })();
  // Color Picker UI
  var colorPickers = (function() {
    // Page Background Picker
    $("#page-background-color").spectrum({
      color: "#fff",
      showInput: true,
      preferredFormat: "hex"
    });
    // Device Background Picker
    $("#device-background-color").spectrum({
      color: "#fff",
      showInput: true,
      preferredFormat: "hex"
    });
  })();
  // Enable Toggle Switch
  function enableToggle(selector) {
    selector.removeAttr('disabled');
    selector.removeClass('disabled');
  }
  // Disable Toggle Switch
  function disableToggle(selector) {
    selector.attr('checked', false);
    selector.attr('disabled', 'true');
    selector.addClass('disabled');
  }
  // Return methods so they can be used
  return {
    enableToggle: enableToggle,
    disableToggle: disableToggle
  }
})();

appState.init();
