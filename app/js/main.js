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
  //console.log(appState.current);
  //default_device = appState.device;
  //initApp();
  //  Init does:
       // getURLvars
        // updateApp();  

  // defaults = parseURL
  //initApp(defaults);
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
    appState.set('device',newDevice);
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
$('#device-background-color').change();
// 6) Page Background Color
$('#page-background-color').change(function() {
  newColor = this.value;
  appState.set('bgColor', newColor);
});


/* =========================================
 *
 * Initialize App
 * ——————  
 *
 *==========================================*/

var initApp = (function() {
  // Gets Variables from url and pushes them to the appState object
  function getUrlVars() {
    var urlVars = {}, hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    // Loop through all Variables and push each paramater + value
    for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split('=');
      //urlvars.push(hash[0]);
      urlVars[hash[0]] = hash[1];
      paramater = appState.get(hash[0]);
      // Check to see if paramater exsist in appState object before pushing to it
      if (paramater) {
        appState.set(hash[0], hash[1]);
      }
    }
  }
  
  return {
    getUrlVars: getUrlVars
  }
})();

/* =========================================
 *
 * App State
 * —————— 
 *
 *==========================================*/

var appState = (function() {
  // Default model values
  var model = {
    device: "browser",
    deviceColor: null,
    orientation: null,
    scrollType: "scroll",
    screenshotWidth: null,
    isIframe: null,
    bgColor: "#fff",
    screenLocation: null
  }

  function init() {
    for (var key in model) {
      //console.log(model[key]);
    }
    // decode hash
    // set defaults (state change with the parameters from has)
    
    // set:
    // updateAppView.device()
    // updateAppView.orientation();
    // updateAppView.settings();
    //
  }

  function decode() {
    
  }

  // Checks if app state paramater exist and pushes if yes
  function get(value) {
    for (var paramater in model) {
      if (paramater === value) {
        return paramater;
      }
    }
  }

  function set(paramater, value) {
    model[paramater] = value;
    console.log(model);
    // eg - parameter is scrollType
    // eg - value is landscape
    // Updates AppView based on naming functions after their respective paramater name
    var updateParamater = updateAppView[paramater];
    if (updateParamater) {
      updateParamater(value); // updateView
                              // updateObject
      url = window.location.href;
      updateQueryStringParameter(url, paramater, value);                      // updateURL (+push to history) 
    }
    // [device:'ipad'],[orientation:'landscape'], 
    function urlVars() {
      // foreach
        if(get(paramater)) {
            // updateURL
            // push to history
        }
    }
  }
  // Return methods so they can be used
  return {
    currentModel: model,
    init: init,
    get: get,
    set: set
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
    //console.log(device);
    var deviceDetails = $('.selected-device__details');
    $('.device__wrap').find('.current--device').removeClass('current--device');
    // Find device info from selcted device
    for (var this_device in devices) {
      if(this_device === device) {
        new_device = devices[device];
        $(new_device['selector']).parent().addClass('current--device');
        var html = '<h4 class="selected-device__name">'+ new_device['name'] +'</h4>';
        deviceDetails.html(html);
        //return new_device;
      }
    }
  }
  
  // Sets the device color in the UI
  function deviceColor(value) {
    console.log(value);
  }

  // Sets the active device orientation in the UI
  function orientation(currentOrientation) {
    if (currentOrientation === 'landscape') {
      $('.marvel-device').addClass('landscape');
    } else {
      $('.marvel-device').removeClass('landscape');
    }
  }

  // Sets the scroll type on active device in the UI
  function scrollType(currentScrollType) {
    console.log(currentScrollType);
    if (currentScrollType === 'overflow') {
      $('.screen').removeClass('scroll');
    } else {
      $('.screen').addClass('scroll');
    }
  }

  // Sets the page background color in the UI
  function bGColor(color) {
    $('body').css('background-color', color);
    console.log('new background color is ' + color);
  }
  // Sets URL for the location of the iFrame/screenshot
  function screenLocation(screenViewURL) {
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


// testing 1 2 3
var serialize = function(obj) {
  var str = [];
  for(var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

function updateQueryStringParameter(uri, key, value) {
  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  var separator = uri.indexOf('?') !== -1 ? "&" : "?";
  console.log('uri= ' + uri);
  console.log('key= ' + key);
  console.log('value= ' + value);
  if (uri.match(re)) {
    return uri.replace(re, '$1' + key + "=" + value + '$2');
    console.log(re, '$1' + key + "=" + value + '$2');
  }
  else {
    return uri + separator + key + "=" + value;
    console.log(uri + separator + key + "=" + value);
  }
}


//console.log(serialize(appState.currentModel));


$(window).load(function() {
  initApp.getUrlVars();
});
