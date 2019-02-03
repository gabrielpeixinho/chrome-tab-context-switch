
var commandBuilder = {

   changeCurrentContext: function(context){
       var command = {
           commandName: 'changeCurrentContext',
           commandPayload: {
                changeContextTo: context
            }
      };

      return command;
   },

   deleteContext: function(contextToDelete){
       var command = {
           commandName: 'deleteContext',
           commandPayload: {
                contextToDelete: contextToDelete
            }
      };

      return command;
   },

   createNewContext: function(contextName){
       var command = {
           commandName: 'createNewContext',
           commandPayload: {
                contextName: contextName
            }
      };

      return command;
   },

   queryAllContexts: function(){
       var command = {
           commandName: 'queryAllContexts',
           commandPayload: { }
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
}

var app = {

   "init" : function( ){

        var source   = document.getElementById("main-template").innerHTML;
        var template = Handlebars.compile(source);
        var self = this;


        const listAllViewModel = function(queryResult){
            var contexts = queryResult.contexts;
            var currentContext = queryResult.currentContext;

            var contextViewModels = _.map(contexts, function(context){

                var currentContextName = currentContext.name;
                var contextName = context.name;
                var isCurrent = currentContextName == contextName;

                return {
                    name: context.name,
                    isCurrent: isCurrent
                }
            });

            return {
                contexts: contextViewModels,
                currentContext: currentContext
            }

        }

       commandBus.send(commandBuilder.queryAllContexts(), function(err, queryResult){

            if(err != null){
                console.log(err);
                return;
            }

            console.log('queryAllContexts result is:');
            console.log(queryResult);

            var viewModel = listAllViewModel(queryResult);
            var html    = template(viewModel);

            $('#main-container').html(html);

            self.bindEventsToElements();
       });

	},

    bindEventsToElements: function(){

       var contextListItems = $(".context-item");
       
       contextListItems.each(function(){
            var contextItem = this;
            var contextName = $(contextItem).data('name');

            
            $('.change-context-button', this).click(function(){

                var changeContextCommand = commandBuilder.changeCurrentContext(contextName);

                commandBus.send(changeContextCommand, function(err, response){

                    if(err != null){
                        console.log(err);
                        return;
                    }

                    app.init();

                });

            });

            $('.rmv', this).click(function(){
                var deleteContextCommnad = commandBuilder.deleteContext(contextName);

                commandBus.send(deleteContextCommnad, function(err, response){

                    if(err != null){
                        console.log(err);
                        return;
                    }

                    contextItem.remove(); 

                });
            });


       });

       
       $( "#addContextInput" ).keyup(function(e) {
           var ENTER = 13;
           var pressedKey = e.which;



	   		if(pressedKey == ENTER) {
	      		var contextName = $(this).val();
                
                var createNewContextCommand = commandBuilder.createNewContext(contextName);

                commandBus.send(createNewContextCommand, function(err, response){


                    if(err != null){
                        console.log(err);
                        return;
                    }

                    app.init();

                });

	    	}
	   });
    }
};

$(document).ready(function () {
     app.init();
})