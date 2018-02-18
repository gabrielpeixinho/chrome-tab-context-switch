

var commandsApi = {

    updateCurrentContext: function(callback){

    },

    commandMessageHandler: function(request, sender, sendResponse){
        var isCommand = request.commandName != null ? true : false;

        if (isCommand){
            console.log(request);
            sendResponse({err: null, payload: {farewell: "goodbye" }});
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
