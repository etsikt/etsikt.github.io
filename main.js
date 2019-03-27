jQuery(function($) {
    console.log("href:" + document.location.href);
    if (document.location.href.includes('#access_token')) {
        if(window.opener) {
            if (window.opener.loginType == "popupLogin")
            {
                window.opener.popupCompleted();
                console.log("popupCompleted");
                $("#menu").html('You are now logged in and. Press OK to close this window.<button id="ok">OK</button>');
                $(document).on("click","#ok",function(e) {
                    window.close();
                });
            } 
            else
            {
                console.log("Window loginType: " + window.loginType);
                console.log("Parent window loginType: " + window.loginType);
            }
        } else {
            console.log("oauth callback");
            jsodemo.oauthCallback();
            jsodemo.process();
        }

    } 
    else if (document.location.href.includes('#error')) {
        alert(document.location.href);
    }
    else {
        console.log("No #access_token.");
        jsodemo.process();
    }
});