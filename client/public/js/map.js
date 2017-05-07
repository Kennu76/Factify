 var map;
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 7,
          center: {lat: 58.594344, lng: 25.5423},
          mapTypeId: 'terrain'
        });


        var latLng = new google.maps.LatLng(58.594344, 25.5452);
       /* 
        var marker = new google.maps.Marker({
          position: latLng,
          map: map
        });
        */

    

        loadMap(function(data){
           data.visitors.forEach(function(elem){
                var latLng = new google.maps.LatLng(elem.lat, elem.lng); 
                new google.maps.Marker({
                    position : latLng,
                    map:map,
                    icon : getCircle(elem.count),
                    label : String(elem.count)
                });               
           });
        });
      }


      function getCircle(count) {
        return {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: '#22A7F0',
          fillOpacity: .1,
          scale: count * 5,
          strokeColor: 'black',
          strokeWeight: .5
        };
      }

        function loadMap(callback){
            var res = {};
            $.ajax({
                url : "factify.xml",
                method : "GET",
                dataType : "XML",
                success : function(data){
                    res.visitors = [];
                    $(data).find("visitor").each(function(id, elem){
                        res.visitors.push({
                            lat : $(elem).children('lat').text(),
                            lng : $(elem).children('lng').text(),
                            count : $(elem).children('count').text(),
                        });

                        callback(res);
                    });
                }
            });
       }