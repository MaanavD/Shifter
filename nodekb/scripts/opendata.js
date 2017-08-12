function httpGetAsync(url, callback, reference_item){
  var xmlHttp = new XMLHttpRequest();

  xmlHttp.onreadystatechange = function(){
    if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
      callback(xmlHttp.responseText, reference_item);
    }
  }
  xmlHttp.open("GET", url, true);
  xmlHttp.send(null);
}

function callback(responseText, reference_item){
  result = JSON.parse(responseText).features;
  if(result.length > 0){
    var title = reference_item.text();
    reference_item.html("");
    var maps_url = "https://www.google.ca/maps/place/" + result[0].attributes.BUSINESS_FULL_ADDRESS
    reference_item.append("<a target='_blank' href='" + maps_url + "'>"+ title +"</a>");
  }

}

function businessPathEscape(full_business_path){

}

$(document).ready(function(){
  base_path = "https://services3.arcgis.com/rl7ACuZkiFsmDA2g/arcgis/rest/services/Economic_Development/FeatureServer/0/query?where=";

  google_maps_url = "https://www.google.ca/maps/place/2770+Westbury+Ct,+Mississauga,+ON+L5M+6B4";
  google_maps_url2 = "https://www.google.ca/maps/place/" + "211-50 PEEL CENTRE DR";

  names = [];
  $('.shift .title').each(function(){
    names.push([$(this).text(), $(this)]);
  });

  for(var i = 0; i < names.length; i++){
    request = "COMPANY_NAME LIKE '%" + names[i][0] + "%'&f=json&outFields=BUSINESS_FULL_ADDRESS";
    httpGetAsync(base_path + request, callback, names[i][1]);
  }


});
