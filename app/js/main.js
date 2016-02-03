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
  appState.init();
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
  $('.external-url-sub').click(function() {
    console.log('url clicked');
    appState.set('isIframe', 'true');
    appState.set('screenLocation', newURL);
    var scrollToggle = $('#scroll-option');
    appUI.disableToggle(scrollToggle);
  });
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
  $('.local-file-sub').click(function() {
    console.log('click ScreenShot Pressed');
    appState.set('isIframe', 'false');
    appState.set('screenLocation', newScreenShot);
    var scrollToggle = $('#scroll-option');
    appUI.enableToggle(scrollToggle);
  });
});
// 5) Change Device Display Color
$('#device-background-color').change(function() {
  newColor = this.value;
  appState.set('deviceColor', newColor);
});
// 6) Page Background Color
$('#page-background-color').change(function() {
  newColor = this.value;
  appState.set('bGColor', newColor);
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
    device: "macbook",
    deviceColor: "#fff",
    orientation: "portait",
    scrollType: "scroll",
    //screenshotWidth: null,
    isIframe: false,
    bGColor: "#fff",
    screenLocation: "/img/get-started.png"
  }


  function initApp() {
    // currentModelbyURL
    // if thats not valid, than model stays the same (aka default)
    // otherwise, set the model to parsed state
    // init app with sets
    if (currentModelbyURL() !== false) {
      console.log("Im not a default version of app!");
      //
      model = currentModelbyURL();
      console.log(model);
    } 
    // initialize app view by kicking off each paramater
    for (var paramater in model) {
      if (model.hasOwnProperty(paramater)) {
        set(paramater, model[paramater]);
      }
    }
  }
  // Decode json to URL string
  function jsonToURI(json) { 
    return encodeURIComponent(JSON.stringify(json)).replace(/%5B/g, '[').replace(/%5D/g, ']'); 
  }
  // Encode URL string to json object
  function uriToJSON(urijson) { 
    return JSON.parse(decodeURIComponent(urijson)); 
  }
  // Get the current model based on the url query string
  function currentModelbyURL() {
    url = window.location.hash;
    queryParam = url.substr(2);
    if (queryParam !== "") {
      return uriToJSON(queryParam);
    } else {
      return false;
    }
  }
  // Push object to url
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
    model[paramater] = value;

    // eg - parameter is scrollType
    // eg - value is landscape
    // Updates AppView based on naming functions after their respective paramater name
    var updateParamater = updateAppView[paramater];
    if (updateParamater) {
      updateParamater(value);
      //console.log(value);
    }
  }
  // if the parameter/value pair passed to this function has a value different than the current model,
  // than update the URL. 
  function updateModel(paramater,value) {
    currentModel = model;
    URLModel = currentModelbyURL();
    if(model[paramater] === URLModel[paramater]) {
      //console.log('paramater value is equal');
    } else {
      currentModel = currentModelbyURL();
      updateURL(model);
      // Update URL Share when screen view URL is changed
      document.getElementById("share-URL").value = window.location;
    }
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
  function deviceColor(color) {
    appState.updateModel('deviceColor', color);
  }
  // Sets the active device orientation in the UI
  function orientation(currentOrientation) {
    appState.updateModel('orientation', currentOrientation);

    if (currentOrientation === 'landscape') {
      $('.marvel-device').addClass('landscape');
      $('#device-orientation').prop('checked', true);

    } else {
      $('.marvel-device').removeClass('landscape');
      $('#device-orientation').prop('checked', false);
    }
  }
  // Sets the scroll type on active device in the UI
  function scrollType(currentScrollType) {
    appState.updateModel('scrollType', currentScrollType);

    if (currentScrollType === 'overflow') {
      $('.screen').removeClass('scroll');
      $('#scroll-option').prop('checked', true);

    } else {
      $('.screen').addClass('scroll');
      $('#scroll-option').prop('checked', false);
    }
  }
  // Sets the page background color in the UI
  function bGColor(color) {
    appState.updateModel('bGColor', color);
    $('body').css('background-color', color);
  }
  function isIframe(value) {
    appState.updateModel('isIframe', value);
  }
  // Sets URL for the location of the iFrame/screenshot
  function screenLocation(screenViewURL) {
    var screenContainer = $('.screen');
    var screenShot = $('.screenshot').length;
    var iframe = $('.frame').length;
    // If screen view is from an external url, display it in an iframe
    if(appState.currentModelbyURL().isIframe === "true") {
      // Check if user included http prefix, if not add it
      if (screenViewURL.indexOf('http://') === -1 && screenViewURL.indexOf('https://') === -1) {
        screenViewURL = 'http://' + screenViewURL;
        console.log('new screen location is ==> ' + screenViewURL);
      }
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
    // Update the current model
    appState.updateModel('screenLocation', screenViewURL);
  }

  // Return methods so they can be used
  return {
    device: device,
    deviceColor: deviceColor,
    orientation: orientation,
    scrollType: scrollType,
    bGColor: bGColor,
    isIframe: isIframe,
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
          appUI.copyBtnRestore();
        });
        $(document).keyup(function(ev) {
          if (ev.which === 27 || ev.which === 13) {
            removeModalHandler();
            appUI.copyBtnRestore();
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
  // Tabs
  var accordionTabs = (function() {
    $('.accordion-tabs-minimal').each(function(index) {
      $(this).children('li').first().children('a').addClass('is-active').next().addClass('is-open').show();
    });
    $('.accordion-tabs-minimal').on('click', 'li > a.tab-link', function(event) {
      if (!$(this).hasClass('is-active')) {
        event.preventDefault();
        var accordionTabs = $(this).closest('.accordion-tabs-minimal');
        accordionTabs.find('.is-open').removeClass('is-open').hide();

        $(this).next().toggleClass('is-open').toggle();
        accordionTabs.find('.is-active').removeClass('is-active');
        $(this).addClass('is-active');
      } else {
        event.preventDefault();
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
  // Change copy button to show success
  function copyBtnSuccess() {
    var copyBtn = $('.copy-url');
    var msg = 'Copied!';
    copyBtn.html(msg);
    copyBtn.addClass('copy-success');
    if (copyBtn.hasClass('copy-error')) {
      copyBtn.removeClass('copy-error');
    }
  }
  // Chnage copy button to show error
  function copyBtnError() {
    var copyBtn = $('.copy-url');
    var msg = 'Copy Failed';
    copyBtn.html(msg);
    copyBtn.addClass('copy-error');
    if (copyBtn.hasClass('copy-success')) {
      copyBtn.removeClass('copy-success');
    }
  }
  // Restore copy button to original state
  function copyBtnRestore() {
    var copyBtn = $('.copy-url');
    var restoredMsg = 'Copy to Clipboard';
    if (copyBtn.hasClass('copy-success')) {
      copyBtn.removeClass('copy-success');
      copyBtn.html(restoredMsg);
    } else if (copyBtn.hasClass('copy-error')) {
      copyBtn.removeClass('copy-error');
      copyBtn.html(restoredMsg);
    }
  }
  // Clipboard
  var clipboard = (function() {
    var copyURL = new Clipboard('.copy-url');
    copyURL.on('success', function(e) {
      console.info('Text:', e.text);
      copyBtnSuccess();
    });
    copyURL.on('error', function(e) {
      console.error('Action:', e.action);
      copyBtnError();
    });
  })();
  // Return methods so they can be used
  return {
    copyBtnRestore: copyBtnRestore,
    enableToggle: enableToggle,
    disableToggle: disableToggle
  }
})();