

var commandsApi = {

    updateCurrentContext: function(callback){

    },

    commandMessageHandler: function(request, sender, sendResponse){
        var commandName = request.commandName; 
        var isCommand = commandName != null ? true : false;

        if (isCommand){
            console.log(request);
            var command = commandsApi.commands[commandName]
            var commandExists = command !=  null;
            var commandToExecute = commandExists ? command : commandsApi.commands.commandNotFound;
            var commandProperties = request.commandPayload;

            commandToExecute(commandProperties, function(err, response){
                sendResponse({err: err, payload: response});
            });
        }

        return true;
    },

    commands: {
       'queryAllContexts' : function(properties, callback){

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
       'commandNotFound' : function(properties, callback){
           var err = {message: 'command "'+commandName+'" not found. see commands-api'};
           var payload = null; 

           callback(err, payload);
       }
    }
};


var queryApi = {
    listAllContexts: function(callback){

        var mockedResult = {
           contexts: [
               {
                context_name: 'UX (mocked)', 
                urls: [ { index: 0, url: 'http://chrome.com' } ]
               },
               {
                context_name: 'Javascript (mocked)', 
                urls: [ { index: 0, url: 'http://chrome.com' } ]
               },
               {
                context_name: 'Café (mocked)', 
                urls: [ { index: 0, url: 'http://chrome.com' } ]
               }
           ]
        };

        var err = null;
        callback(err, mockedResult);
    }
}


chrome.runtime.onMessage.addListener(commandsApi.commandMessageHandler);
