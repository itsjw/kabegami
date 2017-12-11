(function(){
    var electron = require("electron");
    var app = electron.app;
    var BrowserWindow = electron.BrowserWindow;
    var path = require("path");
    var url = require("url");

    var win;

    function setup(){
        win = new BrowserWindow({width: 800, height: 600});

        win.loadURL(url.format({
            pathname: path.join(__dirname, "index.html"),
            protocol: "file:",
            slashes: true,
        }));

        win.on("closed", function(){
            win = null;
        });
    }

    app.on("ready", setup);
    app.on("activate", function(){
        if (win === null) setup();
    });
})();
