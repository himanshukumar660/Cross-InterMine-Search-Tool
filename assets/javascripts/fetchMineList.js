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
			var neighbours = new Set();
      for(each in data.instances){
				mineList.push(data.instances[each].name);
				//Iterate over all the neighbours of each mine and add them to the set, replacement of spaces is necessary because the in some cases neighbours are "Plants" and " Plants"
				for(all in data.instances[each].neighbours)
					neighbours.add(data.instances[each].neighbours[all].replace(" ",""));
			}
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
			};

				for (each in mineList){
					$(".sInfoMines").append(
						'<div id="sInfo" class="choiceLst">\
							<div data-toggle="buttons" class="btn-group bizmoduleselect">\
								<label class="btn chbtn">\
									<div class="bizcontent">\
										<button id="choices">\
											<input type="checkbox" name="mines" value="'
											+ mineList[each] + '"/>\
											' + mineList[each] +'\
										</button>\
									</div>\
								</label>\
							</div>\
						</div>'
					);
				}
				var s = document.createElement("script");
				s.innerHTML = '\
				$("button#choices").click(function() {\
					$(this).toggleClass("clicked");\
				});';
				$("head").append(s);
		}
	}

	function errorAPICall(xhr, textStatus, errorThrown) {

	}
}());
