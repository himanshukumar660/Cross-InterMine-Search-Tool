function removeActiveClass() {
	$(".rToolBtns.rToolBtnActive").each(function(index) {
		$(this).removeClass("rToolBtnActive");
	});
}

function addActiveClass(element) {
	element.addClass("rToolBtnActive");
}
(function showAll() {
	$(".showAll").click(function() {
		//Remove the active class from all the tool buttons
		removeActiveClass();
		//Add the active class to the save button
		addActiveClass($(this));
		//Show the details of the recent searches
		$("#recentSearch").show();
		//Hide the details of all the saved results
		$("#savedSearch").hide();
	});
})();
//Run this function to show the saved results
(function showSaved() {
	$(".rSaved").click(function() {
		//Remove the active class from all the tool buttons
		removeActiveClass();
		//Add the active class to the save button
		addActiveClass($(this));
		//This is done because the we are interating over the entir list and appending them one by one everytime we click saved button
		$(".sResultsSaved").html("");
		for (i = 0; i < localStorage.length; i++) {
			//Outer div is useful while deleting the saved result
			$(".sResultsSaved").append("<div class='outerDiv'>" + localStorage.getItem(localStorage.key(i)) + "</div>");
		}
		//Modify the dom a bit to replace the download button into a delete button
		$(".sResultsSaved .sResultBox").each(function() {
			$(this).find($(".mineNameHeader .rStats i.fa.fa-download")).remove();
			$(this).find($(".mineNameHeader .rStats")).append('<i class="ionicons ion-android-delete rDeleteBtn" data-toggle="tooltip" titile="Delete"></i>');
		});
		//Load the number of saved results
		$("#numberResultsSaved").html("Showing " + localStorage.length + " results");

		//Hide the details of the recent searches
		$("#recentSearch").hide();
		//Show the details of the saved searches
		$("#savedSearch").show();
		//Hide the mine Information
		$(".sResultsMine").hide();
		//Deletion of saved results
		$(".rDeleteBtn").click(function() {
			$(this).closest(".outerDiv").hide();
			$(this).closest($(".rStats")).append('<i class="fa fa-download rSavedBtn" data-toggle="tooltip" title="Save"></i>');
			var div = $(this).closest(".sResultBox");
			var divHTML = div[0].outerHTML;
			$(this).remove();
			var divHTML = div[0].outerHTML;
			localStorage.removeItem(divHTML);
			$("#numberResultsSaved").html("Showing " + localStorage.length + " results");
			$('.rToolBtns.rSaved .badge').text(localStorage.length);
		});
	});
})();
//function to close the modify searchbox
(function closeModifySearchBox() {
	$("#mClose").click(function(){
		removeActiveClass();
		addActiveClass($(".showAll"));
		$(".mMines").hide();
		//Show the details of the recent searches
		$("#recentSearch").show();
		//Hide the details of all the saved results
		$("#savedSearch").hide();
	});
})();

//The following function is used for modifying the search parameters like mines, number of results to be fetched etc
(function modifySearch() {
	$(".mSearch").click(function() {
		removeActiveClass();
		addActiveClass($(this));
		$(".mMines").show();
	});
})();
//The following function returns all the parameters from the url
(function main() {
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

	for (each in parameters) {
		var tempParameter = parameters[each].split("=");
		if (tempParameter[0] == "mines" || tempParameter[0] == "neighbours") {
			queries[tempParameter[0]].add(tempParameter[1]);
		} else if (tempParameter[0] == "sQuery") {
			queries["sQuery"].push(tempParameter[1]);
		}
	}
	$("#sBar").attr("value", queries["sQuery"][0]);
	$.getJSON(regEndPnt, function(data) {
			if (data.statusCode == 200) {
				var mineInfo = {};
				var mineList = {};

				//Now we add those mines whose neighbours are in the neighbours set, also we make a dictinary of {mineName:[Url,logo,neighbours]} to access later
				for (each in data.instances) {

					for (everyN in data.instances[each].neighbours) {
						//if the neighbours of the mine is present in the query["neighbours"], we add that mine to search result
						if (queries["neighbours"].has(data.instances[each].neighbours[everyN])) {
							queries["mines"].add(data.instances[each].name);
						}
					}

					//there are certain entries in mines registry, that contains twitter handle along with @, thus remove it if its there, else ignore
					var twitter = data.instances[each].twitter;
					if (twitter.toString()[0] == "@")
						twitter = twitter.substr(1);

					mineInfo[data.instances[each].name] = {};
					mineInfo[data.instances[each].name] = {
						name: data.instances[each].name,
						url: data.instances[each].url,
						logo_url: data.instances[each].images,
						neighbours: data.instances[each].neighbours,
						description: data.instances[each].description,
						organisms: data.instances[each].organisms,
						twitter: twitter,
						latitude: data.instances[each].location.latitude,
						longitude: data.instances[each].location.longitude
					};

					mineList[data.instances[each].name] = {};
					mineList[data.instances[each].name] = {
						name: data.instances[each].name,
						url: data.instances[each].url,
						logo_url: data.instances[each].images,
						neighbours: data.instances[each].neighbours
					};
				}

				//The following selects all the mines if the user has not selected any mine
				if (queries["mines"].size == 0) {
					for (each in data.instances) {
						queries["mines"].add(data.instances[each].name);
					}
				}

				var apiSearchEndPoint = "/service/search?q=" + queries["sQuery"] + "&size=10";
				var failAPICalls = 0,
					totalResults = 0;
				$.each(Array.from(queries["mines"]), function(index, item) {
					$.ajax({
						type: 'get',
						dataType: 'json',
						url: mineList[item].url + apiSearchEndPoint,
						success: searchCallback,
						error: errorAPICall
					});

					function searchCallback(data) {
						totalResults += data.results.length;
						var maxRelevance = Number.MIN_VALUE;
						for (var ech in data.results) {
							maxRelevance = Math.max(maxRelevance, data.results[ech].relevance);
						}
						for (var ech in data.results) {
							var all = "";
							for (var echProp in data.results[ech].fields) {
								all = all + "<span style='font-weight:500'>" + echProp.replace(/([A-Z][a-z])/g, ' $1').replace(/^./, function(str) {
									return str.toUpperCase();
								}) + "</span>: " + JSON.stringify(data.results[ech].fields[echProp]).replace(/^"(.*)"$/, '$1') + "<br>";
							}
							//Set the image for the particular mine
							var logoMine = Object.keys(mineList[item].logo_url)[0].toString();
							var neighboursStr = "";
							for (each in mineList[item].neighbours) {
								if (each == mineList[item].neighbours.length - 1) {
									neighboursStr = neighboursStr + mineList[item].neighbours[each].replace(" ", "").toString();
								} else {
									neighboursStr = neighboursStr + mineList[item].neighbours[each].replace(" ", "").toString() + ", ";
								}
							}

							//This corresponds to the div for displaying the neighbours of the mine
							var neighboursDisplay = "";
							if (neighboursStr.length != 0)
								neighboursDisplay = '\
             <div style="float:right;display:inline-flex">\
              <i class="ionicons ion-ios-play-outline" style="padding-top:12px"></i>\
              <p style="padding:12px;padding-left:5px;padding-bottom:0px">' + neighboursStr + '</p>\
             </div>';


							$(".sResults .sResultsMain").append(
								'<div class="sResultBox">\
      							<div class="mineNameHeader">\
      								<div style="display:inline-flex;float:left">\
                        <img alt="Logo" src="' + mineList[item].logo_url[logoMine] + '" style="font-size:8px;padding:5px;width:40px;height:40px">\
      									<p style="margin:10px;font-weight:500">' + mineList[item].name + '</b></p>\
      								</div>\
                      <div class="rStats" style="float:right;display:inline-flex;padding:8px;transform:scale(0.7)">\
                        <div class="star-ratings-css" >\
                          <div class="star-ratings-css-top" style="width: ' + (data.results[ech].relevance / maxRelevance) * 100 + '%"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>\
                          <div class="star-ratings-css-bottom"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>\
                        </div>\
                        <i class="fa fa-download rSavedBtn" data-toggle="tooltip" title="Save"></i></div>\
      							</div>\
      							<table style="width:100%;">\
      								<tr style="float:left;margin:0px">\
      							    <td>\
                        <p class="rClassType">' + data.results[ech].type.replace(/([A-Z][a-z])/g, ' $1').replace(/^./, function(str) {
									return str.toUpperCase();
								}) + '</p>\
                        <hr style="margin-top:0px;margin-bottom:0px">\
						<p class="rDetails">' + all + '</p></td>\
      							  </tr>\
      							</table>\
      						</div>'
							);
						}

						$("#numberResults").css({
							"display": "block"
						});
						//var numOfResultsPrev = parseInt($(".sResults").find($("#numberResults")).text());
						$("#numberResults").text("Showing " + totalResults + " results");

						//To unbind the effect of all the previous made event listeners on the result box
						$(".sResults .sResultBox .mineNameHeader .rSavedBtn").unbind();

						//Add the script to save the result to local Storage, the key and value are kept same so that there may not ne duplicate entries
						var s = document.createElement("script");
						s.innerHTML = '\
              $(".sResults .sResultBox .mineNameHeader .rSavedBtn").click(function() {\
				var divDetails = $(this).closest($(".sResultBox"))[0].outerHTML;\
				localStorage.setItem(divDetails,divDetails);\
				$(".rToolBtns.rSaved .badge").text(localStorage.length);\
              });'
						$("body").append(s);

						$(".sResults .sResultBox ").hover(function() {
							var mineName = $(this).find($(".mineNameHeader p")).text();
							var mineOrganisms = "",
								mineNeighbours = "";
							//Get the list of all organisms in that mine
							for (each in mineInfo[mineName].organisms) {
								if (each == mineInfo[mineName].organisms.length - 1) {
									mineOrganisms += mineInfo[mineName].organisms[each];
								} else {
									mineOrganisms += mineInfo[mineName].organisms[each] + ", ";
								}
							}
							//Get the list of all the neighbours in the mine
							for (each in mineInfo[mineName].neighbours) {
								if (each == mineInfo[mineName].neighbours.length - 1) {
									mineNeighbours += mineInfo[mineName].neighbours;
								} else {
									mineNeighbours += mineInfo[mineName].neighbours + ", ";
								}
							}
							var logoMine = Object.keys(mineInfo[mineName].logo_url)[0].toString();

							$(".sResultsMine").html('\
              <div class="mineInfoHeader">\
                <div class="mineInfoName">\
                    <h2><a href="\
                    ' + mineInfo[mineName].url + '" style="color:black">\
                    ' + mineInfo[mineName].name + '</a>\
                    <a href="' + mineInfo[mineName].url + '"><i class="fa fa-external-link" style="color:lightgray;font-size:20px" title="official Website"></i></a>\
                    </h2>\
                </div>\
                <div class="mineInfoLogo">\
                  <a href="\
                  ' + mineInfo[mineName].url +
								'" style="color:black">\
                    <img  src="\
                    ' + mineInfo[mineName].logo_url[logoMine] +
								'" alt="Intermine"\
                    height="100px"/>\
                  </a>\
                </div>\
              </div>\
              <hr />\
              <div class="mineInfoDetails">\
                <p>' + mineInfo[mineName].description + '</p>\
                <p class="organisms">\
                  <span style="font-weight:500">Organisms: </span>' + mineOrganisms + '\
                </p>\
                <p class="neighbours">\
                  <span style="font-weight:500">Neighbours: </span>' +
								mineNeighbours +
								'</p>\
                <p class="location">\
                  <span style="font-weight:500">Location: </span>\
                  ' + mineInfo[mineName].latitude + ', ' + mineInfo[mineName].longitude + '\
                </p>\
                <p class="twitter">\
                    <a href="https://twitter.com/' + mineInfo[mineName].twitter + '">\
                      <i class="ionicons ion-social-twitter" style="color:#2caae1;font-size:18px"></i>\
					<span style="color:black;font-size:13px;font-weight:500;text-decoration:none">@' + mineInfo[mineName].twitter + '</span>\
                    </a>\
                </p>\
                <p style="text-align:right;font-size:12px"><em>Mine Information</em></p>\
              </div>\
              </div>\
              ');
							if (mineNeighbours == "")
								$(".sResultsMine").find($("p.neighbours")).css({
									"display": "none"
								});
							if (mineOrganisms == "")
								$(".sResultsMine").find($("p.organisms")).css({
									"display": "none"
								});
							if (mineInfo[mineName].twitter == "")
								$(".sResultsMine").find($("p.twitter")).css({
									"display": "none"
								})
							if (mineInfo[mineName].longitude == "" || mineInfo[mineName].longitude == "")
								$(".sResultsMine").find($("p.location")).css({
									"display": "none"
								})
							$(".sResultsMine").css({
								"display": "block"
							})
						});
					}

					function errorAPICall(xhr, textStatus, errorThrown) {
						// $(".error").append('Error calling API for ' + item + "<br>");
						// $(".error").css({
						// 	"display": "block"
						// })
						$("#failAPIMines").css({
							"display": "block"
						});
						failAPICalls++;
						if (failAPICalls == 1) {
							$("#failAPIMines").append("<a href='" + mineInfo[item].url + "'>" + item + "</a>");
						} else {
							$("#failAPIMines").append(", <a href='" + mineInfo[item].url + "'>" + item + "</a>");
						}
					}
				});
			} else {
				console.log("API called but status Code is" + data.statusCode);
			}
		})
		.fail(function() {
			console.log("Could not connect to Registry end ponit")
		});
}());
