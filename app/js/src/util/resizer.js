(function(){
    var Jimp = require("jimp");
    var os = require("os");
    var DIR = os.homedir() + "/.kabegami";

    self.onmessage = function(message){
        var url = message.data;

        Jimp.read(url, function(error1, img){
            if (error1) console.log(error1);

            img.resize(100, 67).quality(100);

            var name = url.split("/").join("-");
            var path = DIR + "/thumbs/" + name;

            img.write(path, function(error){
                if (error) console.error(error);
                self.postMessage(path);
            });
        });
    }
})();
