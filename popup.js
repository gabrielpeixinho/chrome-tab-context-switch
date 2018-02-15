


var app = {

   "init" : function( ){
       var rmvs = $(".context-item");
       
       rmvs.each(function(){
            var parent = this;
            $('.rmv', this).click(function(){
                parent.remove(); 
            });
       });


   }
};

$(document).ready(function () {
     app.init();
})