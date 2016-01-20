/*=============================================================
 *
 *
 *
 *===========================================================*/

  function getQueryVariable(variable) {
    var query = window.location.search.substring(1); // remove the leading "?" from query string, 
                                                     // return just parameters and args 
    var vars = query.split('&'); // split by each parameter

    // loop through the parameters, separate out arguments, decode arguments into clean strings for display
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('='); // delimiter based on URL query string
        if (decodeURIComponent(pair[0]) == variable) {
            /* replace "+" with "%20" before we decode the string so we don't overwrite
            "+" that the user actually wants.  At this point true "+" are encoded as %2B. */
            rawString = pair[1].split("+").join("%20")
            cleanString = decodeURIComponent(rawString);
            return cleanString;
        }
    }
    console.log('Query variable %s not found', variable);
  }

  // return as simple variable names so its easy to read the next code blocks
  var name = getQueryVariable('name'); 
  var title = getQueryVariable('title'); 
  var company = getQueryVariable('company');
  var phone = getQueryVariable('phone'); 
  var url = getQueryVariable('url');  


  // update the DOM with data
  // make sure to test for its existence so you don't break it if field is blank
  if(name) { document.getElementById("name").innerHTML = name; }
  if(title) { document.getElementById("title").innerHTML = title; }
  if(company) { document.getElementById("company").innerHTML = company; }
  if(phone) { 
    phoneEl = document.getElementById("phone");
    phoneEl.innerHTML = phone; 
    phoneEl.setAttribute('href','tel:' + phone);
  }
  if(url) {
     urlEL = document.getElementById("url");
    urlEL.innerHTML = url;
    urlEL.setAttribute('href', '//' + url);
  }

/*=============================================================
 *
 *
 *
 *===========================================================*/


 /*=========================
     * Test
     *=========================*/
     function parseURL(url) {
      var parser = document.createElement('a'),
          searchObject = {},
          queries, split, i;
      // Let the browser do the work
      parser.href = url;
      // Convert query string to object
      queries = parser.search.replace(/^\?/, '').split('&');
      for( i = 0; i < queries.length; i++ ) {
          split = queries[i].split('=');
          searchObject[split[0]] = split[1];
      }

      return {
          protocol: parser.protocol,
          host: parser.host,
          hostname: parser.hostname,
          port: parser.port,
          pathname: parser.pathname,
          search: parser.search,
          searchObject: searchObject,
          hash: parser.hash
      };
    }

    var parsedurl = parseURL(externalPath);
    console.log(parsedurl);
    /*=========================
     * Test
     *=========================*/

/*=============================================================
 *
 * 
 *
 *===========================================================*/

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


$(window).load(function() {
  initApp.getUrlVars();
});
