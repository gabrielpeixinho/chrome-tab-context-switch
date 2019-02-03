
var contextRepository = {
    save: function(context){
        localStorage.setItem(context.name, JSON.stringify(context));
    },
    getByName: function(name){
        
        var json = localStorage.getItem(name);

        var context = json != null ? JSON.parse(json) : null;

        return context;

    },
    listAll: function(){

        var contexts = [];

        for(var key in localStorage){

            var re = /^_/;
            var isContext = !re.test(key);

            if(!isContext)
                continue;

            var context = this.getByName(key)       
            if(context != null)
               contexts.push(context);
        }

        return contexts;
    }
}

const SETTINGS = '_settings';

var settingsRepositoy = {
    save: function(settings){
        localStorage.setItem(SETTINGS, JSON.stringify(settings));
    },
    get: function(){
        var json = localStorage.getItem(SETTINGS);

        var settings = json != null ? JSON.parse(json) : {};

        return settings;
    }
}

var settingsService = {
    set : function(key, value){
        var settings = settingsRepositoy.get();
        settings[key] = value;
        settingsRepositoy.save(settings);
        console.log('setting ' + key + ' changed:' + settings)
    },
    get : function(key){
        var settings = settingsRepositoy.get();
        return settings[key];
    },
    getCurrentContext : function(){
        return this.get('currentContext');
    },
    setCurrentContext: function(context){
        this.set('currentContext', context)
        return this;
    }
}

var commandsApi = {

    updateCurrentContext: function(callback){

    },

    commandMessageHandler: function(request, sender, sendResponse){
        var commandName = request.commandName; 
        var isCommand = commandName != null ? true : false;

        if (isCommand){
            console.log(request);

            var commandToExecute = commandsApi.getCommandBy(commandName);
            var commandProperties = request.commandPayload;

            commandToExecute(commandProperties, function(err, response){
                sendResponse({err: err, payload: response});
            });
        }

        return true;
    },

    getCommandBy: function(commandName){
        var command = commandsApi.commands[commandName]
        var commandExists = command !=  null;
        var commandToExecute = commandExists ? command : commandsApi.commands.commandNotFoundFactory(commandName);
         return commandToExecute;

    },

    commands: {
       'queryAllContexts' : function(payload, callback){


           var err = null;
           var quertyResult = {
               contexts: contextRepository.listAll(),
               currentContext: settingsService.getCurrentContext()
           };

           callback(err, quertyResult);

       },
       'createNewContext': function(payload, callback){

             var context = {
                 name: payload.contextName,
                 urls: [{ index: 0, url: 'http://chrome.com' }]
             };

             contextRepository.save(context);

       },
       'changeCurrentContext' : function(changeCurrentContextCommand, callback){

           var contextToBeCurrent = contextRepository.getByName(changeCurrentContextCommand.changeContextTo);

           settingsService.setCurrentContext(contextToBeCurrent);

           var err = null;
           var result = null;

           callback(err, result);

       },
       'commandNotFoundFactory' : function(commandName){
           return function(payload, callback){
                var err = {message: 'command "'+commandName+'" not found. see commands-api'};
                var payload  = null;
                callback(err, null);
           }
       }
    }
};



chrome.runtime.onMessage.addListener(commandsApi.commandMessageHandler);
