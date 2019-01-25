chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      if ( request.action == "startLightbox" ) {
  
  background = document.createElement('div');
  background.id = "lightbox_background";
  lightbox = document.createElement('div');
  lightbox.id = "lightbox_extension";
  
  
  lightbox.innerHTML = '<h1>Hello, world.</h1>';
         
      
  document.body.appendChild(background);
  background.appendChild( lightbox );
  closeScriptureLightbox = function() {
      
      var lb = document.getElementById('lightbox_background');
      lb.parentNode.removeChild( lb );
      
  }
  button = document.createElement('button');
  button.onclick=closeScriptureLightbox;
  button.textContent='Close';
  lightbox.appendChild(button);
  sendResponse({farewell: "goodbye"});
  
      }
  });