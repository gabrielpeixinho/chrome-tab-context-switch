

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

               contexts: [
                   {
                       context_name: 'UX (mocked)',
                       urls: [{ index: 0, url: 'http://chrome.com' }]
                   },
                   {
                       context_name: 'Javascript (mocked)',
                       urls: [{ index: 0, url: 'http://chrome.com' }]
                   },
                   {
                       context_name: 'Café (mocked)',
                       urls: [{ index: 0, url: 'http://chrome.com' }]
                   }
               ]
           };

           callback(err, quertyResult);

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
