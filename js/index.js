var year;
var dataSet;
var apvMode;
var subsystem;
var runFrom = -1;
var runTo = -1;
var colors = [];

var collections = {}; //contains file names for each dataset
var chart_list = null; //global ref to ChartList instance

function load_dataset(name) {
    var need_refresh = false;
    var need_update = update_range();
    
    console.log("index.js -> dataset name = ", name);
    console.log("index.js -> chart_list = ", chart_list);
    //console.log("index.js -> need_update = ", need_update);
    //console.log("index.js -> need_refresh = ", need_refresh);   
    if (chart_list == null) {
        need_refresh = true;
	console.log("index.js -> chart_list == null -> put need_refresh = true");
    }
    else {
        console.log("index.js -> chart_list != null");
        if (name != chart_list.dataset) {
//        if (name != chart_list.dataset || need_update) { // Aris
	    console.log("index.js -> name != chart_list.dataset -> destroy all charts and create new ones");
            need_refresh = true;
            chart_list.charts.forEach(function(c) {
                c.destroy();
            });
        	$("#body").html("");
        }
    }
    if (need_refresh) {
	console.log("index.js ->  chart_list.dataset = ", name);  
	console.log(collections);
        chart_list = new ChartList(name, collections[name]);
	//console.log("index.js -> need_refresh = true");
	//console.log("index.js -> new chart_list = ", chart_list);
	console.log("index.js ->  chart_list.dataset = ", chart_list.dataset);  
    }
    else {
        if (need_update) {
	    console.log("index.js -> need_update == true ");
            chart_list.update();
        }
    }
}

function is_num(x) {
    return !isNaN(parseFloat(x))
}

//Checks range inputs for changes and updates runFrom and runTo if needed.
//Returns true if the the range has changed.
function update_range() {
    var result = false;
    var from = $("#runFrom").val();
    var to = $("#runTo").val();
    if (!is_num(from) && !is_num(to))
        return false;
    if (from === runFrom && to === runTo)
        return false;
    if (is_num(from)) {
        var tmp = parseInt(from, 10);
        if (tmp !== runFrom) {
            runFrom = tmp;
            result = true;
        }
    }
    if (is_num(to)) {
        var tmp = parseInt(to, 10);
        if (tmp !== runTo) {
            runTo = tmp;
            result = true;
        }
    }
    if (runFrom == -1 && runTo == -1) {
        type = 0;
        console.log("type : " + type);
    } else if (runFrom >= 0 || runTo >= 0) {
        type = 1;
        console.log("type : " + type);
    }
    return result;
}

function update_url() {
	urlLink = "/" + year + "/" + dataSet + "/";
    console.log("urlLink : " + urlLink);
}

function update_subsystem() {
        if ($("#subsystem").val() == "Pixel" || $("#subsystem").val() == "PixelPhase1" || $("#subsystem").val() == "DT") {
		$("#apvMode").prop("disabled", true);
		$("#apvMode").val("No Selection");
	} else {
		$("#apvMode").prop("disabled", false);
		if ($("#apvMode").val() == null) {
			$("#apvMode").val("");
		}	
	}
}

function update_collections() {

    collec_file = "collections_"+$("#year").val()+".json";
    console.log("collection file  : " + collec_file);
    
    $.getJSON(collec_file, function (data) {
	    //$.getJSON(collec_file, function (data) {
	    collections = data;
    });
    console.log(collections);
}


$(document).ready(
	function() {
		colors.push("#669999");
		colors.push("#FF6600");
		colors.push("#669900");
		colors.push("#002E00");
		colors.push("#CC3300");
		colors.push("#996633");
		colors.push("#000099");
		colors.push("#9900CC");
		colors.push("#FF0066");
		colors.push("#8D1919");
                
		collec_file = "collections_"+$("#year").val()+".json";
		console.log("collection file  : " + collec_file);
		
		$.getJSON("collections_2016.json", function (data) {
		//$.getJSON(collec_file, function (data) {
			collections = data;
		});
		console.log(collections);

		$('<ul id="list" style="white-space:nowrap;overflow-x:auto"></ul>').appendTo('#list-container');

		$("#search").click(
			function() {
				year = $("#year").val();
				dataSet = $("#dataSet").val();

				if (year == "" || dataSet == "") {
					alert("Please Make Selection");
				} else {
					update_url(dataSet, year);
					console.log("update_url executed.............");
					load_dataset("test");
		}
		});
});
