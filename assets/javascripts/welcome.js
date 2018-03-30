//Function to submit the search form
function submitSForm() {
	document.getElementById("sForm").submit();
};
//Whenever the user clicks seachbtn or search input button, submit the query form
$("#sBtn").click(submitSForm);
$('button#sInptBtn').click(submitSForm);

//This checks if any mine is selected, if yes, changes the 'Search All' -> 'Search' and vice versa
setInterval(
	function() {
		if ($('.btn-group.bizmoduleselect').find($('.btn.chbtn.active')).length != 0) {
			$('#sInptBtn').html('Search')
		} else {
			$('#sInptBtn').html('Search All')
		}
}, 100);
