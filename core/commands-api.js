
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
            var context = this.getByName(key)       

            if(context != null)
               contexts.push(context);
        }

        return contexts;
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
               contexts: contextRepository.listAll()
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
