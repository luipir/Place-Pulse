function validate_study_name(){var e=$("#study_name").val(),t=/^(?:\b\w+\b[\s\r\n]*){1,10}$/;if(t.test(e)){study_name_cg.removeClass("error");study_name_error.addClass("hidden");study_name_cg.addClass("success");return!0}study_name_cg.addClass("error");study_name_cg.removeClass("success");study_name_error.removeClass("hidden");return!1}function validate_study_question(){var e=$("#study_question").val(),t=/^(?:\b\w+\b[\s\r\n]*){1,3}$/;if(t.test(e)){study_question_cg.removeClass("error");study_question_error.addClass("hidden");study_question_cg.addClass("success");return!0}study_question_cg.addClass("error");study_question_cg.removeClass("success");study_question_error.removeClass("hidden");return!1}function validateStudyForm(){return validate_study_name()&validate_study_question()?!0:!1}function setupUI(){$("#clearCurrentSelection").click(clearOverlays);$("#finishStudyForm").click(function(){if(!mapReady){alert("ERROR: Couldn't initialize Google Maps!");return}if(validateStudyForm()){$("#selectPlaces").show();$("#mapInterface").show();$("#createStudyForm").hide();$("#info-alert").html("Select an area you want to study by drawing polygon on the map. To start, click any three places on the map.");$("#info").replaceWith('<li id="info"><a href="/admin/studies/"><i class="icon-book"></i> Study Information</a></li>');$("#define").replaceWith('<li id="define" class="active"><a href="/admin/studies/"><i class="icon-book icon-white"></i> Select Places</a></li>');startMap()}});$("#submitPolygon").click(function(){if(area>0)if(area<500){var e=poly.getPath().getArray(),t=[];for(var n=0;n<e.length;n++){t.push(e[n].lng());t.push(e[n].lat())}updateDB()}else alert("Please limit your polygon to less than 500 square miles in area.");else alert("Please make a selection.")});addValues()}function initialize(){mapReady=!0}function startMap(){markers=[];path=new google.maps.MVCArray;var e=10;panMap(e);red=new google.maps.MarkerImage("/static/img/marker-images/red.png",new google.maps.Size(16,26),new google.maps.Point(0,0),new google.maps.Point(8,26));green=new google.maps.MarkerImage("/static/img/marker-images/green.png",new google.maps.Size(16,26),new google.maps.Point(0,0),new google.maps.Point(8,26));shadow=new google.maps.MarkerImage("/static/img/marker-images/shadow.png",new google.maps.Size(32,26),new google.maps.Point(0,0),new google.maps.Point(8,26));shape={coord:[11,0,13,1,14,2,15,3,15,4,15,5,15,6,15,7,15,8,15,9,15,10,15,11,15,12,14,13,14,14,13,15,13,16,12,17,12,18,11,19,11,20,10,21,10,22,9,23,9,24,8,25,7,25,6,24,6,23,5,22,5,21,4,20,4,19,3,18,3,17,2,16,2,15,1,14,1,13,0,12,0,11,0,10,0,9,0,8,0,7,0,6,0,5,0,4,0,3,1,2,2,1,4,0,11,0],type:"poly"}}function panMap(e){map=new google.maps.Map($("#map").get()[0],{zoom:e,draggableCursor:"crosshair",mapTypeId:google.maps.MapTypeId.HYBRID});poly=new google.maps.Polygon({strokeWeight:2,strokeOpacity:1,strokeColor:"#4aea39",fillColor:"#4aea39"});map.fitBounds(new google.maps.LatLngBounds(new google.maps.LatLng(7.188100871179058,-129.39241035029778),new google.maps.LatLng(55.07836723201517,-50.64241035029778)));poly.setMap(map);poly.setPaths(new google.maps.MVCArray([path]));google.maps.event.addListener(map,"click",addPoint);google.maps.event.addListener(poly,"click",addPoint)}function addPointLatLng(e,t){var n=new google.maps.LatLng(e,t),r=new google.maps.Marker({draggable:!0,raiseOnDrag:!1,icon:green,shadow:shadow,shape:shape,map:map,animation:google.maps.Animation.DROP,position:n});markers.push(r);google.maps.event.addListener(r,"click",function(){r.setMap(null);for(var e=0,t=markers.length;e<t&&markers[e]!=r;++e);markers.splice(e,1);path.removeAt(e);updateArea()});google.maps.event.addListener(r,"dragend",function(){for(var e=0,t=markers.length;e<t&&markers[e]!=r;++e);path.setAt(e,r.getPosition());updateArea()})}function clearOverlays(){for(var e=0;e<markers.length;e)google.maps.event.trigger(markers[0],"click");poly.setOptions({strokeWeight:2,strokeOpacity:1,strokeColor:"#4aea39",fillColor:"#4aea39"});$("#selectionarea").hide()}function removeMarker(e){if(markers.length>0)if(e!=markers.length){markers[e].setMap(null);markers.splice(e,1)}else{markers[e-1].setMap(null);markers.splice(e-1,1)}e=null}function addPoint(e){var t=0,n,r=[];for(var i=0,s=markers.length;i<s;++i){currPos=markers[i].getPosition();nextPt=i+1<s?i+1:0;nextPos=markers[nextPt].getPosition();r[i]=new google.maps.LatLng((currPos.lat()+nextPos.lat())/2,(currPos.lng()+nextPos.lng())/2);var o=getDistance(e.latLng,r[i]);if(t==0||o<t){t=o;n=i}}var u=new google.maps.Marker({draggable:!0,raiseOnDrag:!1,icon:green,shadow:shadow,shape:shape,map:map,position:e.latLng}),a=n+1;markers.splice(a,0,u);path.insertAt(a,e.latLng);updateArea();google.maps.event.addListener(u,"click",function(){u.setMap(null);for(var e=0,t=markers.length;e<t&&markers[e]!=u;++e);markers.splice(e,1);path.removeAt(e);updateArea()});google.maps.event.addListener(u,"dragend",function(){for(var e=0,t=markers.length;e<t&&markers[e]!=u;++e);path.setAt(e,u.getPosition());updateArea()})}function populateDropDownMenu(e){for(var t=0;t<e.length;t++){var n=document.createElement("option");document.getElementById("dropDownList").options.add(n);n.text=""+e[t];n.value=""+e[t]}}function saveCity(){var e=document.getElementById("dropDownList").selectedIndex;if(e==0){var t=prompt("What is the name of the city?");t!=null&&t!=""?updateDB(t):alert("Please enter a name or choose one from the list.")}else updateDB(cityList[e-1])}function updateDB(){var e=poly.getPath().getArray(),t=[];for(var n=0;n<e.length;n++){t.push(e[n].lng());t.push(e[n].lat())}$.ajax({url:"/study/create/",dataType:"json",data:{polygon:t.toString(),study_name:$("#study_name").val(),study_question:$("#study_question").val(),study_public:$("input:radio[name=study_public]:checked").val(),place_name:$("#place_name").val(),data_resolution:$("#data_resolution").val(),location_distribution:$("#location_distribution").val()},type:"POST",success:function(e){window.location.replace(window.location.protocol+"//"+window.location.host+"/place/populate/"+e.placeID)}})}function updateArea(){if(poly.getPath().length>2){var e=Math.pow(1609.344,2);area=google.maps.geometry.spherical.computeArea(poly.getPath())/e;updateOptions();if(area>500){$("#area").html(area.toFixed(3)+" square miles is above the limit of 500 ");poly.setOptions({strokeColor:"#ea4839",fillColor:"#ea4839"});toggleMarkers(red);$("#selectionarea").html("<strong>Selection Too Large</strong><br />Your current selection area is "+area.toFixed(0)+" square miles. Please reduce the area of your selection to under 500 square miles.");$("#selectionarea").show()}else{poly.setOptions({strokeColor:"#4aea39",fillColor:"#4aea39"});toggleMarkers(green);$("#selectionarea").hide()}}else{area=0;updateOptions();$("#area").html(area)}}function addValues(){var e=[100,250,500,1e3,1500,2e3,2500],t=document.getElementById("data_resolution"),n=Math.pow(1609.344,2);for(var r=0;r<e.length;r++)area*n/Math.pow(e[r]*2,2)<maxPointsPerStudy&&(t.options[t.options.length]=new Option(e[r]+" meters",e[r],!1,!1))}function updateOptions(){var e=!0,t=[100,250,500,1e3,1500,2e3,2500],n=document.getElementById("data_resolution"),r=Math.pow(1609.344,2);for(var i=0;i<t.length;i++){n.options[i].selected=!1;n.options[i].disabled=!0;if(area*r/Math.pow(t[i]*2,2)<maxPointsPerStudy){n.options[i].disabled=!1;if(e){n.options[i].selected=!0;e=!1}}}}function toggleMarkers(e){for(var t=0;t<markers.length;t++)markers[t].setIcon(e)}function rad(e){return e*Math.PI/180}function getDistance(e,t){return 13462*Math.asin(Math.sqrt(Math.pow(Math.sin((e.lat()-t.lat())*Math.PI/180/2),2)+Math.cos(e.lat()*Math.PI/180)*Math.cos(t.lat()*Math.PI/180)*Math.pow(Math.sin((e.lng()-t.lng())*Math.PI/180/2),2)))}var poly,map,markers,path,area=0,cityList,mapReady=!1,red,green,shadow,shape,maxPointsPerStudy=350;$(document).ready(function(){function e(){var e=document.createElement("script");e.type="text/javascript";e.src="http://maps.google.com/maps/api/js?sensor=false&callback=initialize&libraries=geometry";document.body.appendChild(e)}setupUI();$("#selectPlaces").hide();$("#selectionarea").hide();e()});var study_name=$("#study_name"),study_name_cg=$("#study_name_cg"),study_name_error=$("#study_name_error"),study_question=$("#study_question"),study_question_cg=$("#study_question_cg"),study_question_error=$("#study_question_error");study_name.blur(validate_study_name);study_question.blur(validate_study_question);