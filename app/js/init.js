/* -------------------------------------
// 
// Init Landing Page
//
//------------------------------------*/



/* -----------------------------------------
** Event handlers
------------------------------------------*/

// 01) Url Location
$('#thwock_url').change(function() {
  newURL = this.value;
  if (newURL.indexOf('http://') === -1 && newURL.indexOf('https://') === -1) {
    protocolURL = 'http://' + newURL;
    appInit.set('screenLocation', protocolURL);
  } else {
    appInit.set('screenLocation', newURL);
  }
});


// 02) Device selection
var $selectDevice = $('.device__selector[name="deviceSelection"]');
$selectDevice.change(function() {
  newDevice = this.value;
  console.log(newDevice);
  appInit.set('device', newDevice);
  appInit.set('isIframe', 'true');
});

var appInit = (function() {
  // Default model values
  var model = {
    device: "macbook",
    deviceColor: "#fff",
    deviceScale: "1",
    orientation: "portait",
    scrollType: "scroll",
    isIframe: false,
    bGColor: "#fff",
    screenLocation: "/img/get-started.png"
  }
  // Decode JSON to URL string
  function jsonToURI(json) { 
    return encodeURIComponent(JSON.stringify(json)).replace(/%5B/g, '[').replace(/%5D/g, ']'); 
  }
  // Update url
  function updateURL(obj) {
    stringifiedObj = jsonToURI(obj);
    // Get Base Url Location
    var getURL = window.location;
    var baseURL = getURL.protocol + "//" + getURL.host + "/" + getURL.pathname.split('/')[0];
    // Create Init Link
    var initAppLink = baseURL + 'app.html#!' + stringifiedObj;
    // Update the Init Button
    var $initBtn = $('#getThwocking');
    $initBtn.attr('href', initAppLink);
  }
  // Update new paramater to the model
  function set(paramater, value) {
    model[paramater] = value;
    updateURL(model);
  }

  return {
    model: model,
    set: set
  };
})();
