
var commandBuilder = {

   changeCurrentContext: function(newContext){
       var command = {
           commandName: 'changeCurrentContext',
           commandPayload: {
                newContext: newContext
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

   createNewContext: function(contextToCreate){
       var command = {
           commandName: 'createNewContext',
           commandPayload: {
                contextToCreate: contextToCreate
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

       commandBus.send(commandBuilder.queryAllContexts(), function(err, queryResult){

            if(err == null)
              console.log(queryResult);
            else
              console.log(err);
       });

       var rmvs = $(".context-item");
       
       rmvs.each(function(){
            var contextItem = this;
            var contextName = $(contextItem).data('tcsContext');

            $('.change-context-button', this).click(function(){
                var changeContextCommand = commandBuilder.changeCurrentContext(contextName);

                commandBus.send(changeContextCommand, function(err, response){
                });

            });

            $('.rmv', this).click(function(){
                var deleteContextCommnad = commandBuilder.deleteContext(contextName);

                commandBus.send(deleteContextCommnad, function(err, response){

                    if(err == null)
                        contextItem.remove(); 

                });
            });


       });

       
       $( ".add" ).keypress(function(e) {
           var ENTER = 13;
           var pressedKey = e.which;

	   		if(pressedKey == ENTER) {
	      		var contextName = $(this).val();
                
                var createNewContextCommand = commandBuilder.createNewContext(contextName);

                commandBus.send(createNewContextCommand, function(err, response){

                    if(err == null){

                        var newContextItem = $('<li class="context-item list-group-item justify-content-around">'
	        							+ contextName.toUpperCase() + 
	        							'<span class="rmv">remove</span></a></li>');
                        
                        newContextItem.insertBefore($('.scroll-down-button'));
                        
                    }

                });

	    	}
	   });
	}
};

$(document).ready(function () {
     app.init();
})