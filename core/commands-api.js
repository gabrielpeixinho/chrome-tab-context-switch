

var commandsApi = {
    updateCurrentContext: function(callback){

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