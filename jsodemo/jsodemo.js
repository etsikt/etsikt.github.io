this.jsodemo = (function() {
    var token = null;
    window.loginType = "unset";
    var dataportenCallback = "";
    if (document.location.hostname == "localhost") {
        dataportenCallback = 'http://localhost:8880/etsikt.github.io/jsodemo/index.html';
    } else {
        dataportenCallback = 'https://etsikt.github.io/jsodemo/index.html';
    }
    
    var dataportenClientId = 'ae8d7e75-5065-4694-a7fd-92d9bc47a090';
    var request = ['openid', 'profile'];
    var userinfoEndpoint = "https://auth.dataporten.no/userinfo";
    var opts = {
        scopes: {
            request: request
        },
        response_type: 'id_token token'
    }
        
    var client = new jso.JSO({
                providerID: "Dataporten",
                client_id: dataportenClientId,
                redirect_uri: dataportenCallback, 
                authorization: "https://auth.dataporten.no/oauth/authorization"
            });
            

    return {
        oauthCallback : function() {
            client.callback();
        },
        getSilentOpts : function() {
            var silent_opts = JSON.parse(JSON.stringify(opts));
            silent_opts.request = {prompt: "none"};
            return silent_opts;
        },
        process: function() {
            var silent_opts = this.getSilentOpts();
            jsodemo.updateStatus("Checking token...");
            this.token = client.checkToken(silent_opts);
            if(this.token) {
                this.updateStatus("Token is valid: " + this.token.access_token);
                jsodemo.validToken();
                console.log(this.token.access_token);
            } else {
                jsodemo.clearStatus();
                this.printLoginOptions();
            }
        },
        printLogoutOptions : function() {
            var html = "<button id='logout'>Logout</button>";
            jsodemo.updateMenu(html);
            $(document).off('click', "#logout");
            $(document).on ("click", "#logout",function(e) {jsodemo.logout()});
        },
        printLoginOptions : function() {
            var html = "<button id='login'>Login</button>";
            html += "<button id='popupLogin'>Popup login</button>";
            html += "<button id='iframeLogin'>Iframe login</button>";
            
            jsodemo.updateMenu(html);

            $(document).off('click', "#login");
            $(document).on ("click", "#login",function(e) {jsodemo.login()});
            $(document).off('click', "#popupLogin");
            $(document).on ("click", "#popupLogin",function(e) {jsodemo.popupLogin()});
            $(document).off('click', "#iframeLogin");
            $(document).on ("click", "#iframeLogin",function(e) {jsodemo.hiddenIframeLogin()});
        },
        validToken: function() {
            jsodemo.printLogoutOptions();
            jsodemo.getUserInfo(function(data) {
                jsodemo.updateContent(JSON.stringify(data));
            });
        },
        _get : function(url, callback) {
            var self = this;
            $.ajax({
                    url: url,
                    beforeSend: function(xhr) {
                         xhr.setRequestHeader("Authorization", "Bearer " + self.token.access_token)
                    }, success: function(data){
                        callback(data)
                    }, error: function(XMLHttpRequest, textStatus, errorThrown) {
                        let errMsg = '_get error:' + errorThrown;
                        alert(errMsg);
                        console.log(errMsg);
                }});
        },
        _post : function(url, data, callback) {
            var self = this;
            $.ajax({
                type: "POST",
                url: url,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + self.token.access_token)
                }, 
                data: data,
                success: function(result) {
                    callback(result)
                },
                error(XMLHttpRequest, textStatus, errorThrown) {
                    let errMsg = '_post error:' + errorThrown;
                    alert(errMsg);
                    console.log(errMsg);
                }
            });
        },
        getUserInfo : function(callback) {
            let url = userinfoEndpoint;
            this._get(url, callback);
        },

        logout: function()  {
            client.wipeTokens()
            this.clearStatus();
            this.clearContent();
            jsodemo.printLoginOptions();
        },
        login : function() {
            window.loginType = "login";
            let token = client.getToken(opts);
            client.setLoader(jso.HTTPRedirect)
            client.getToken(opts)
                .then((token) => {
                    dashboard.dataporten.valideToken();
                    console.log("I got the token: ", token)
                })
        },
        popupLogin : function()  {
            var self = this;
            window.loginType = "popupLogin";
            client.setLoader(jso.Popup)
            client.getToken(opts)
                .then((token) => {
                    console.log("I got the token: " + token.access_token);
                    self.token = token;
                    self.validToken();
                })
                .catch((err) => {
                    alert(err);
                    console.error("Error from popup loader", err)
                })
        }, 
        hiddenIframeLogin : function()
        {
            window.loginType = "iframeLogin";
            var self = this;
            var silent_opts = this.getSilentOpts();
            client.setLoader(jso.IFramePassive)
            client.getToken(silent_opts)
                .then((token) => {
                    console.log("I got the token: ", token)
                    self.token = token;
                    self.validToken();
                })
                .catch((err) => {
                    console.error("Error from passive loader", err)
                    alert("iframe passive login only works if you are already logged in:" + err);
                })
        },
        updateMenu : function(s) {
            $("#menu").html(s);
        },
        updateStatus : function(s) {
            $("#status").html(s);
        },
        clearStatus : function() {
            $("#status").html("");
        },
        updateContent : function(s) {
            $("#content").html(s);
        },
        appendContent : function(s){
            $("#content").append(s);
        },
        clearContent : function() {
            $("#content").html("");
        }
    }
})();