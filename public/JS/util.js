
// function to parse cookie on client side
// Taken from: https://stackoverflow.com/questions/10730362/get-cookie-by-name
function getCookie(name) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2)
        return parts.pop().split(";").shift();
  }

  /*
  FROM HEDDY:

  getCookie didn't work for me :(

  Found another way on https://github.com/js-cookie/js-cookie :

  Include <script src="https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js"></script>

    Example: Cookies.get(); // => { name: '{"foo":"bar"}' }


   */