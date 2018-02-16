
var app = {

   "init" : function( ){
       var rmvs = $(".context-item");
       
       rmvs.each(function(){
            var parent = this;
            $('.rmv', this).click(function(){
                parent.remove(); 
            });
       });

       
       $( ".add" ).keypress(function(e) {
	         
	   		if(e.which == 13) {
	      		var item = $(this).val();
	        	$(".list-group").append('<li class="context-item list-group-item justify-content-around">'
	        							+ item.toUpperCase() + 
	        							'<span class="rmv">remove</span></a></li>');
	    	}
	   });
	}
};

$(document).ready(function () {
     app.init();
})