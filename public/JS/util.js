

// function to parse cookie on client side
// Taken from: https://stackoverflow.com/questions/10730362/get-cookie-by-name
function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
  }