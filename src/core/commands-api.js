

var commandBuilder = {

   updateContext: function(){
       var command = {
           commandName: 'updateContext',
      };

      return command;
   }
};

var commandBus = {
   send:  function(command, callback) {
        chrome.runtime.sendMessage(command, function(response) {
            callback(response.err, response.payload);
        });
   }
};

var contextRepository = {
    save: function(context){
        localStorage.setItem(context.name, JSON.stringify(context));
    },
    delete: function(contextName){
        localStorage.removeItem(contextName);
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
const AUTO_UPDATE_KEY = 'contextAutoUpdate';

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
    },

    enableContextAutoUpdate: function(){
        this.set(AUTO_UPDATE_KEY, true);
    },

    disableContextAutoUpdate: function(){
        this.set(AUTO_UPDATE_KEY, false);
    },

    contextAutoUpdateIsEnabled: function(){
        const autoUpdateEnabled = this.get(AUTO_UPDATE_KEY);
        return autoUpdateEnabled == 'true' ? true : false;
    }
}

var browserAcl = {
    getTabs: function (callback /*(tabs)*/) {
        chrome.tabs.query({ pinned: false }, callback);
    },
    replaceTabsFor: function(tabs, callback){

        var openedTabs = this.getTabs(function(currentTabs){

            var newTabs = tabs;

            for(var i=0 ; i < newTabs.length; i++){
                var tab = newTabs[i];
                chrome.tabs.create({'url': tab.url, 'active': false});
            }

            for(var i=0 ; i < currentTabs.length; i++){
                var tabToClose = currentTabs[i];
                chrome.tabs.remove(tabToClose.id);
            }


        });

        //TODO implementar fechamento das abas
    },
    onUrlTabChange: function (eventHandler /*()*/) {

        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

            if (changeInfo.url) {
                eventHandler();
            }

        });

        chrome.tabs.onRemoved.addListener((tab) => {
            eventHandler();
        });
    }
};


var commandsApi = {

    updateCurrentContext: function(callback){
        console.log('updateCurrentContext fired.');

        const context = settingsService.getCurrentContext();

        if (context == null) {
            return;
        }

        browserAcl.getTabs(function (tabs) {
            context.tabs = tabs;
            contextRepository.save(context);
        })
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
               name: payload.contextName
           };

           contextRepository.save(context);

           settingsService.setCurrentContext(context);

           commandsApi.updateCurrentContext();

           var err = null;
           var result = null;

           callback(err, result);
       },
       'deleteContext' : function(deleteContextCommand, callback){

           const contextName = deleteContextCommand.contextToDelete;

           contextRepository.delete(contextName);


           var err = null;
           var result = null;

           callback(err, result);

       },
       'changeCurrentContext' : function(changeCurrentContextCommand, callback){


           var currentContext = settingsService.getCurrentContext();
           var contextToBeCurrent = contextRepository.getByName(changeCurrentContextCommand.changeContextTo);

           var contextChanged = currentContext.name != contextToBeCurrent.name;

           if (contextChanged && confirm("deseja realmente troca de contexto?")) {
               settingsService.setCurrentContext(contextToBeCurrent);

               settingsService.disableContextAutoUpdate();

               browserAcl.replaceTabsFor(contextToBeCurrent.tabs, function(){
                   console.log("abas substituidas...");
                    settingsService.enableContextAutoUpdate();
               });
           }

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

browserAcl.onUrlTabChange(function(){

    if (settingsService.contextAutoUpdateIsEnabled())
        commandsApi.updateCurrentContext();

})

