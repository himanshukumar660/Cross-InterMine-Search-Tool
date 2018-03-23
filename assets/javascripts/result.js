//The following function returns all the parameters from the url
(function () {
  //Get the parameters from the Url
  var query = decodeURIComponent(location.search.substr(1));
  var result = [];
  var parameters = query.split("&");
  var queryType = new Set();
  var queries = {};
  var regEndPnt = "https://registry.intermine.org/service/instances";

  //We use set to be safe from duplicate entries of the mines
  queries["mines"] = new Set();
  queries["sQuery"] = new Array();
  queries["neighbours"] = new Set();

  for(each in parameters)
    {
      var tempParameter = parameters[each].split("=");
      if(tempParameter[0]=="mines"||tempParameter[0]=="neighbours"){
        queries[tempParameter[0]].add(tempParameter[1]);
      }
      else if(tempParameter[0]=="sQuery"){
          queries["sQuery"].push(tempParameter[1]);
      }
    }
    $.getJSON(regEndPnt, function(data){
      if(data.statusCode==200){

        var mineList = {};
        
        //Now we add those mines whose neighbours are in the neighbours set, also we make a dictinary of {mineName:[Url,logo,neighbours]} to access later
        for(each in data.instances){
          for(everyN in data.instances[each].neighbours){
            //if the neighbours of the mine is present in the query["neighbours"], we add that mine to search result
            if(queries["neighbours"].has(data.instances[each].neighbours[everyN]))
            {
              queries["mines"].add(data.instances[each].name);
            }
          }
          mineList[data.instances[each].name] = {};
          mineList[data.instances[each].name] = {
            name : data.instances[each].name,
            url : data.instances[each].url,
            logo_url : data.instances[each].images,
            neighbours : data.instances[each].neighbours
          };
        }

        //The following selects all the mines if the user has not selected any mine
        if(queries["mines"].size==0){
          for(each in data.instances){
            queries["mines"].add(data.instances[each].name);
          }
        }

        var apiSearchEndPoint = "/service/search?q=" + queries["sQuery"] + "&size=10";

        $.each(Array.from(queries["mines"]), function(index, item) {
          $.ajax({
        		type: 'get',
        		dataType: 'json',
        		url: mineList[item].url + apiSearchEndPoint,
        		success: searchCallback,
        		error: errorAPICall
        	});

        	function searchCallback(data) {
            var maxRelevance = Number.MIN_VALUE;
        		for (var ech in data.results) {
        			maxRelevance = Math.max(maxRelevance, data.results[ech].relevance);
        		}
        		for (var ech in data.results) {
        			var all = "";
        			for (var echProp in data.results[ech].fields) {
        				all = all + "<b>" + echProp.replace(/([A-Z][a-z])/g, ' $1').replace(/^./, function(str) {
        					return str.toUpperCase();
        				}) + "</b>  : " + JSON.stringify(data.results[ech].fields[echProp]).replace(/^"(.*)"$/, '$1') + "<br>";
        			}
              //Set the image for the particular mine
              var logoMine = Object.keys(mineList[item].logo_url)[0].toString();
              var neighboursStr = "";
              for(each in mineList[item].neighbours){
                if(each==mineList[item].neighbours.length-1){
                  neighboursStr = neighboursStr + mineList[item].neighbours[each].replace(" ","").toString();
                }
                else {
                  neighboursStr = neighboursStr + mineList[item].neighbours[each].replace(" ","").toString()+", ";
                }
              }

              //This corresponds to the div for displaying the neighbours of the mine
              var neighboursDisplay = "";
              if(neighboursStr.length!=0)
               neighboursDisplay = '\
               <div style="float:right;display:inline-flex">\
                <i class="ionicons ion-ios-play-outline" style="padding-top:10px"></i>\
                <p style="margin:10px">' +neighboursStr+ '</p>\
               </div>';


              $(".sResults").append(
        				'<div id="sResultBox">\
        							<div id="mineNameHeader">\
        								<div style="display:inline-flex">\
                          <img src="'+mineList[item].logo_url[logoMine]+'" style="padding:5px;width:40px;height:40px">\
        									<p style="margin:10px"><b>' + mineList[item].name + '</b></p>\
        								</div>\
                        '+neighboursDisplay+'\
        							</div>\
        							<table style="width:100%;">\
        								<tr style="width:25%">\
        									<td><p style="font-size:18px">' + data.results[ech].type.replace(/([A-Z][a-z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); }) + '</p></td>\
        								</tr>\
        								<tr style="width:55%">\
        							    <td><p style="max-width:332px;overflow-wrap: break-word;">' + all + '</p></td>\
        							  </tr>\
        							  <tr style="width:20%">\
        							    <td>\
        										<div class="star-ratings-css">\
        											<div class="star-ratings-css-top" style="width: '+ (data.results[ech].relevance/maxRelevance)*100+'%"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>\
        											<div class="star-ratings-css-bottom"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>\
        										</div>\
        									</td>\
        							  </tr>\
        							</table>\
        						</div>'
        			);
        		}
        	}

        	function errorAPICall(xhr, textStatus, errorThrown) {
        		$(".error").append('Error calling API for ' + item + "<br>");
        		$(".error").css({
        			"display": "block"
        		})
        	}
        });
      }
      else{
        console.log("API called but status Code is"+data.statusCode);
      }
    })
    .fail(function() {
      console.log("Could not connect to Registry end ponit")
    });
}());
