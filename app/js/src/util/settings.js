(function(){
    var fs = window.require("fs");
    var os = window.require("os");

    var path = DIR + "/settings.json";
    var settings;

    var folderExists = fs.existsSync(DIR);
    var fileExists = fs.existsSync(path);

    if (folderExists && fileExists){
        settings = JSON.parse(fs.readFileSync(path, "utf8"));
    } else {
        if (!folderExists) fs.mkdirSync(DIR);
        settings = {};
    }

    module.exports = {
        set: function(key, value){
            settings[key] = value;
            fs.writeFileSync(path, JSON.stringify(settings), "utf8");
        },

        get: function(key){
            try {
                return settings[key];
            } catch(error){
                return null;
            }
        },
    };
})();
