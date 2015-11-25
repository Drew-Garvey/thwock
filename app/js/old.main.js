function screenShotTool() {

  // grab device data
  var grabDevices = $.getJSON('../devices.json');
  // device data successfully loaded
  grabDevices.done(function(data) {
    devices = data.devices;
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
 * 4) Change Screenshot
 * 5) Change Device Display Color
 * 6) Change Page Background Color
 * ---------
 * To be added later:
 * 7) Change Device Color
 * 8) Change Device Border Color
 * 
 *==========================================*/

  $('#device-selector').change(function() {
      newDevice = this.value;
      updateAppView.device(newDevice);
  });

  $('#device-orientation').change(function() {
    //setOrientation();
  });





  /* =========================================
   *
   * App State Object
   * ——————
   * Object that defines all paramaters in the apps view
   *
   *==========================================*/
// This is the default app state
  var appState = {
    device: null,
    deviceColor: null,
    orientation: null,
    scrollType: null,
    screenshotWidth: null,
    bgColor: null,
    screenLocation: null
  }


  // Checks if app state paramater exist and pushes if yes
  function getAppStateParameter(value) {
    for (var paramater in appState) {
      if (paramater === value) {
        return paramater;
      }
    }
  }

  function setAppState(paramater, value) {
    appState[paramater] = value;
    //console.log(appState);
    // eg - parameter is scrollType
    // eg - value is landscape
    var updateParamater = updateAppView[paramater];
    if (updateParamater) {
      updateParamater(value); //updateView
                              // updateObject
                              // updateURL (+push to history) 
    }
    
  }

 /* =========================================
   *
   * Update App View
   * ——————  

   *
   *==========================================*/
  var updateAppView = (function() {

    // Sets the active device in the UI
    function device(device) {
      console.log(device);
      var deviceDetails = $('.selected-device__details');
      $('.device__wrap').find('.current--device').removeClass('current--device');
      // Find device info from selcted device
      for ( var this_device in devices) {
        console.log(devices);
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
    function orientation(value) {
      console.log(value);
    }

    // Sets the scroll type on active device in the UI
    function scrollType(value) {
      console.log(value);
    }

    // Sets the page background color in the UI
    function bGColor(value) {
      console.log(value);
    }

    // Return methods so they can be used
    return {
      device: device,
      deviceColor: deviceColor,
      orientation: orientation,
      scrollType: scrollType,
      bgColor: bGColor
    }
  })();

  /* =========================================
   *
   * Get URL Pramaters
   * ——————
   * Function determines what orientations the device has and if it has multiple 
   * orientations, it activates toggle switch and updates optimal screen dimension label
   * 
   *
   *==========================================*/
// add update urlvars function:
  // take parameter + value 
  // call set app state
  // push to history

  //
  function getUrlVars() {
    var urlVars = {}, hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    
    for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split('=');
      //urlvars.push(hash[0]);
      urlVars[hash[0]] = hash[1];
      paramater = getAppStateParameter(hash[0]);

      if (paramater) {
        setAppState(hash[0], hash[1]);
      }
      
    }
  } getUrlVars();

  //console.log(appState);

  /* =========================================
   *
   * Device Orientation
   * ——————
   * Function determines what orientations the device has and if it has multiple 
   * orientations, it activates toggle switch and updates optimal screen dimension label
   * 
   *
   *==========================================*/

  // Change Device orientation
  function deviceOrientation() {

    function getOrientationOption() {
    
    var selectedDevice = $('#device-selector').val();

    if (selectedDevice === 'browser') {
      hasLandscape = false;
    } 
    else if (selectedDevice === 'macbook') {
      hasLandscape = false;
    } 
    else if (selectedDevice === 'iPad') {
      hasLandscape = true;
    }
    else if (selectedDevice === 'iPhone') {
      hasLandscape = true;
    }
    else if (selectedDevice === 'samsung-galaxy') {
      hasLandscape = true;
    }
    

    // Function disables toggle button if it dosent have landscape mode
    
    function disableOrientation(new_device) {
      var toggle = $('#device-orientation');
      var labelA = $('.orientation-toggle .label-a');
      var labelB = $('.orientation-toggle .label-b');
      
      if (hasLandscape === false) {
        toggle.attr('checked', false);
        toggle.attr('disabled', 'true');
        toggle.addClass('disabled');
        labelA.removeClass('active');
        labelB.removeClass('active');
        
      } else {

        toggle.removeAttr('disabled');
        toggle.removeClass('disabled');
      }
    } disableOrientation();
    
    
    function applyOrientation() {
      var toggle = $('#device-orientation');
      var labelA = $('.orientation-toggle .label-a');
      var labelB = $('.orientation-toggle .label-b');
      var widthDetails = $('.selected-device__opt-width');
  
      // If toggle is checked remove scroll and show full screenshot
      if (hasLandscape === true) {
        if (toggle.is(':checked')) {
          $('.marvel-device').addClass('landscape');
          labelA.removeClass('active');
          labelB.addClass('active');
          
          if (selectedDevice ==='iPad') {
            widthDetails.empty();
            widthDetails.text('Width: 1024px');
          }
          else if (selectedDevice === 'samsung-galaxy') {
            widthDetails.empty();
            widthDetails.text('Width: 960px');
          }
          
        } else {
          $('.marvel-device').removeClass('landscape');
          labelB.removeClass('active');
          labelA.addClass('active');
          
          if (selectedDevice ==='iPad') {
            widthDetails.empty();
            widthDetails.text('Width: 768px');
          }
          else if (selectedDevice === 'samsung-galaxy') {
            widthDetails.empty();
            widthDetails.text('Width: 540px');
          }
          
        }
      }
    } applyOrientation();
    
    }

    // Update when device is changed
    $('#device-selector').change(getOrientationOption);

    // Update orientation when changed
    $('#device-orientation').change(getOrientationOption);
    //getOrientationOption();
  
  }
  deviceOrientation();
  
  /* =========================================
   *
   * Scroll Options
   * ——————
   * Function gives the user ability to toggle between two options for height handling
   * 1) Hide overflow with scroll or 2) show overflow with no scroll
   * 
   *
   *==========================================*/
  
  // Change Scroll option
  function deviceScrollOption() {

    function getScrollOption() {
      var toggle = $('#scroll-option');
      var labelA = $('.scroll-toggle .label-a');
      var labelB = $('.scroll-toggle .label-b');
      // If toggle is checked remove scroll and show full screenshot
      if (toggle.is(':checked')) {
        $('.screen').removeClass('scroll');
        labelA.removeClass('active');
        labelB.addClass('active');
      } else {
        $('.screen').addClass('scroll');
        labelB.removeClass('active');
        labelA.addClass('active');
      }
    }
    // Update scroll settings when changed
    $('#scroll-option').change(getScrollOption);
    getScrollOption();
  }
  deviceScrollOption();
  
  /* =========================================
   *
   * File Upload/external URL iframe
   * ——————
   * These two functions handle two things:
   * 1) if a user uploads a file from their local machine, it creates a temp url and applies it to img src
   * 2) if a user inputs an external URL, it creates an iframe and embeds site in iframe
   *
   * NOTE: I would like to rewright this and improve it
   *
   *==========================================*/
  
  // Add option to upload external image
  function externalFileSubmission() {
    function getFileUrl() {
      var externalPath = $('#external-file__input').val().trim();
      var screenContainer = $('.screen');
      var screenShot = $('.screenshot').length;
      var iframe = $('.frame').length;

      //$(".screenshot").attr('src', externalPath);

      if (screenShot) {
        $('.screenshot').remove();
        screenContainer.addClass('has--iframe');
        screenContainer.append('<iframe class="frame" src="'+ externalPath +'"></iframe>');
      } else if (iframe) {
        $('.frame').attr('src', externalPath);
      } else {
        screenContainer.addClass('has--iframe');
        screenContainer.append('<iframe class="frame" src="'+ externalPath +'"></iframe>');
      }
    }
    // Update file path if changed
    $('#external-file__input').change(getFileUrl);
    //$('.view-screengrab').click(getFileUrl);
  }
  externalFileSubmission();
  
  // Add option to upload local image
  function localFileSubmission() {
    $('#local-file__input').change( function(event) {
      var localPath = URL.createObjectURL(event.target.files[0]);
      var screenContainer = $('.screen');
      var screenShot = $('.screenshot').length;
      var iframe = $('.frame').length;

      if (screenShot && iframe) {
        $('.frame').remove();
        screenContainer.removeClass('has--iframe');
        $('.screenshot').attr('src', localPath);
      } else if (iframe) {
        $('.frame').remove();
        screenContainer.removeClass('has--iframe');
        screenContainer.append('<img class="screenshot" src="'+ localPath +'" />');
      } else if (screenShot) {
        $('.screenshot').attr('src', localPath);
      } else {
        screenContainer.append('<img class="screenshot" src="'+ localPath +'" />');
      }

      console.log(localPath);
      console.log(screenShot);
    });
  }
  localFileSubmission();
  
  /* =========================================
   *
   * Get Current Device HTML
   *
   *==========================================*/
  
  function grabHTML() {

    var selectedDevice = $('#device-selector').val();

    function getCurrentDeviceHTML() {
      var currentDeviceHTML = $('.current--device').html();
      var trimmed = $.trim(currentDeviceHTML);
      var contentContainer = $('#current-device-code');
      contentContainer.text(trimmed);
    }

    $('#device-selector').change(getCurrentDeviceHTML);
    getCurrentDeviceHTML();
  
  }
  grabHTML();

  /* =========================================
   *
   * Color Pickers
   * ——————
   * Function that handles dropdown select to choose which device
   * user would like to display
   *
   *==========================================*/
  
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
  
  // Add Option to change background color of page
  function pageBackgroundColor() {

    function getBackgroundColor() {
    //var backgroundColor = $('#page-background-color').val().trim();
    var backgroundColor = $("#page-background-color").spectrum('get').toHexString();
    if(backgroundColor === "") {
      $('body').css('background-color','#fff');
    } else {
      $('body').css('background-color', backgroundColor);
    }
    }
    // Update background color if changed
    $('#page-background-color').change(getBackgroundColor);
    getBackgroundColor();
  }
  pageBackgroundColor();
  
  // Add Option to change background color of page
  function deviceBackgroundColor() {

    function getBackgroundColor() {
    var backgroundColor =$("#device-background-color").spectrum('get').toHexString();
    if(backgroundColor === "") {
      $('.screen').css('background-color','#fff');
    } else {
      $('.screen').css('background-color', backgroundColor);
    }
    }
    // Update background color if changed
    $('#device-background-color').change(getBackgroundColor);
    getBackgroundColor();
  }
  deviceBackgroundColor();
  
  
  /**
   * modalEffects.js v1.0.0
   * http://www.codrops.com
   *
   * Licensed under the MIT license.
   * http://www.opensource.org/licenses/mit-license.php
   * 
   * Copyright 2013, Codrops
   * http://www.codrops.com
   */
  
   // DEPENDENCY = CLASSIE (https://github.com/ded/bonzo)
  var ModalEffects = (function() {

    function init() {

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
          if (ev.which === 27) {
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
    }
    init();
  })();
}
screenShotTool();