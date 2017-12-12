(function(){
    var Jimp = require("jimp");

    self.onmessage = function(message){
        var url = message.data;

        Jimp.read(url, function(error1, img){
            if (error1) console.log(error1);

            img.resize(100, 67).quality(100);

            img.getBase64(img.getMIME(), function(error2, data){
                self.postMessage(data);
            });
        });
    }
})();
