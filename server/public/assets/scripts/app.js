$(document).ready(function(){

   $("#search").submit(function(event){
      event.preventDefault();
      var values = {};

      $.each($(this).serializeArray(), function(i, field){
         values[field.name] = field.value;
      });
      if(values){
         findPerson(values);
      }
      else{
         getData();
      }


   });

   $("#addSomeone").submit(addSomeone);
   $("#peopleContainer").on('click', '.delete', function(){
      deletePerson($(this).data("id"));
      $(this).parent().remove();
   });
   getData();
});


function findPerson(values){
   $.ajax({
      type: "GET",
      url: "/find",
      data: values,
      beforeSend: function(){
         console.log(values);
      },
      success: function(data){

         updateDOM(data);
      }
   })
}


function getData(values){
   $.ajax({
      type: "GET",
      url: "/data",
      data: values,
      success: function(data){
         updateDOM(data);
      }
   })
}

function addSomeone(){
   event.preventDefault();
   var values = {};

   $.each($(this).serializeArray(), function(i, field){
      values[field.name] = field.value;
   });

   $.ajax({
      type: "POST",
      url: "/data",
      data: values,
      success: function(data){
         getData();
      }
   });
}

function deletePerson(id){
   var deletedId = {"id": id};

   console.log("Meaningful Log: ", deletedId);

   $.ajax({
      type: "DELETE",
      url: "/data",
      data: deletedId,
      success: function (data) {
         console.log("This is the Delete Call: ", data);

      }

   });
}

function updateDOM(data){
   $("#peopleContainer").empty();

   for(var i = 0; i < data.length; i++){
      var el = "<div class='well col-md-3'>" +
                  "<p>" + data[i].name + "</p>" +
                  "<p>" + data[i].location + "</p>" +
                  "<button class='delete btn btn-danger' data-id='" +
                     data[i].id + "'>Delete</button>" +
               "</div>";

      $("#peopleContainer").append(el);
   }
}
