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
      for(each in data.instances)
        mineList.push({
          name : data.instances[each].name,
          url : data.instances[each].url
        });
				for (each in mineList){
					$(".sInfo").append(
						'<div id="sInfo" class="choiceLst">\
							<div data-toggle="buttons" class="btn-group bizmoduleselect">\
								<label class="btn chbtn">\
									<div class="bizcontent">\
										<button id="choices">\
											<input type="checkbox" name="mines[]" value="'+ mineList[each].url+'|'+ mineList[each].name + '"/>\
											' + mineList[each].name +'\
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
