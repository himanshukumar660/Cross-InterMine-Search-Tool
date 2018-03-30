//The following block of code displays the page only when the ajax to get the list of mines completes

//The following code fetches all the mine list
var fetchMineList = (function () {
	var regEndPnt = "https://registry.intermine.org/service/instances";
	$.ajax({
		type: 'get',
		url: regEndPnt,
		success: searchCallback,
		error: errorAPICall
	});

	function searchCallback(data) {
		if(data.statusCode==200){
      var mineList = [];
	  var mineColor = {};
	  var neighbours = new Set();
      for(each in data.instances){
		  var mineName = data.instances[each].name;
		  var backgroundColor = Object.is(data.instances[each].colors, undefined) ? "#595455" : 
		  	Object.is(data.instances[each].colors.header, undefined) ? "#595455" : 
		  	Object.is(data.instances[each].colors.header.main, undefined) ? "#595455" : data.instances[each].colors.header.main;
			mineColor[mineName] = backgroundColor;
		  var textColor = Object.is(data.instances[each].colors, undefined) ? "#fff" : 
		  	Object.is(data.instances[each].colors.header, undefined) ? "#fff" : 
		  	Object.is(data.instances[each].colors.header.text, undefined) ? "#fff" : data.instances[each].colors.header.text;
			mineColor[mineName] = backgroundColor;
		  //var backgroundColor = (typeof data.instances[each].colors.header.main === "undefined") ? "#595455" : data.instances[each].colors.header.main;
		  mineList.push([mineName,backgroundColor,textColor]);
				//Iterate over all the neighbours of each mine and add them to the set, replacement of spaces is necessary because the in some cases neighbours are "Plants" and " Plants"
				for(all in data.instances[each].neighbours)
					neighbours.add(data.instances[each].neighbours[all].replace(" ",""));
			}
			
			//Add the different neighbours list in the front end
			var neighbours = Array.from(neighbours);
			for (item in neighbours){
				$(".sInfoNeighbours").append(
					'<div id="sInfo" class="choiceLst">\
						<div data-toggle="buttons" class="btn-group bizmoduleselect">\
							<label class="btn chbtn">\
								<div class="bizcontent">\
									<button id="choices">\
										<input type="checkbox" name="neighbours" value="'
										+ neighbours[item] + '"/>\
										' + neighbours[item] +'\
									</button>\
								</div>\
							</label>\
						</div>\
					</div>'
				);
				var css =  document.createElement("style");
				css.innerHTML = "."+neighbours[item]+"{"+"background-color:#bed73b!important;\
			    color: black!important;\
			    font-weight: 500;\
				}";
				$("head").append(css);
			};
			
				for (each in mineList){
					$(".sInfoMines").append(
						'<div id="sInfo" class="choiceLst">\
							<div data-toggle="buttons" class="btn-group bizmoduleselect">\
								<label class="btn chbtn">\
									<div class="bizcontent">\
										<button id="choices">\
											<input type="checkbox" name="mines" value="'
											+ mineList[each][0] + '"/>\
											' + mineList[each][0] +'\
										</button>\
									</div>\
								</label>\
							</div>\
						</div>'
					);
					var css =  document.createElement("style");
					css.innerHTML = "."+mineList[each][0]+"{"+"background-color:"+mineList[each][1]+"!important;\
				    color: "+mineList[each][2]+"!important;\
				    font-weight: 500;\
					}";
					$("head").append(css); 
				}
				
				var s = document.createElement("script");
				s.innerHTML = '\
				$(".btn.chbtn").click(function() {\
					var mineName = $(this).find($(".bizcontent button#choices")).text();\
					$(this).find($(".bizcontent button#choices")).toggleClass(mineName)\
				});'
				$("head").append(s);
		}
	}

	function errorAPICall(xhr, textStatus, errorThrown) {

	}
}());
