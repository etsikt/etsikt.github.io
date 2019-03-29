# jsodemo

A demo of the https://github.com/andreassolberg/jso library. In short, this is a library for oauth authentication with javascript.

## Live demo
Try it out here: https://etsikt.github.io/jsodemo/index.html

## Setup
Specify oauth parameters in the jsodemo.js file. Example:

```
    var dataportenCallback = 'http://localhost:8880/jsodemo/index.html';
    var dataportenClientId = 'ae8d7e75-5065-4694-a7fd-92d9bc47a090';
    var request = ['openid', 'profile'];
    var userinfoEndpoint = "https://auth.dataporten.no/userinfo";
```


## How to

1. Open index.html
2. Login with one of the methods.
3. index.html will be called back by oauth.
4. main.js decides what kind of login has been used and calls the appropriate jso callback.
