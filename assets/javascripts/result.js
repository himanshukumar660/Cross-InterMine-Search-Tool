//The following function returns all the parameters from the url
function getJsonFromUrl() {
  var query = location.search.substr(1);
  var result = [];
  query.split("&").forEach(function(part) {
    var item = part.split("=");
		var linkName = decodeURIComponent(item[1]).split("|");
		result.push([linkName[0],linkName[1]]);
  });
  return result;
}
console.log(getJsonFromUrl());

var mineListObj = getJsonFromUrl();
var i = 0;
var apiSearchEndPoint = "/service/search?q=" + "" + "&size=10";
var mapUrlName = {};
var mineListUrl = [];
for (each in mineListObj){
	mapUrlName[mineListObj[each][0]] = mineListObj[each][1];
	mineListUrl.push(mineListObj[each][0]);
}
$.each(mineListUrl, function(index, item) {
	$.ajax({
		type: 'get',
		dataType: 'json',
		url: item + apiSearchEndPoint,
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
			$(".sResults").append(
				'<div id="sResultBox">\
							<div id="mineNameHeader">\
								<div>\
									<p style="margin:10px"><b>' + mapUrlName[item] + '</b></p>\
								</div>\
							</div>\
							<table style="width:100%;">\
								<tr style="width:25%">\
									<td><p style="font-size:18px">' + data.results[ech].type.replace(/([A-Z][a-z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); }) + '</p></td>\
								</tr>\
								<tr style="width:55%">\
							    <td><p style="max-width:332px">' + all + '</p></td>\
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
