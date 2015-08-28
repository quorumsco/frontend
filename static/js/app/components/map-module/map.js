module.exports = function() {
  var debug = false;

  /* styles par défaut des zones cliquables */

  var defaultStyle = {
    color: '#000000',
    weight: 1,
    fillOpacity: 0.2,
    className: ''
  };

  var highlightStyle = {
    color: '#000000',
    weight: 1,
    fillOpacity: 0.9,
    className: ''
  }

  var selectStyle = {
    color: '#000000',
    weight: 3,
    fillOpacity: 0.5
  };

  var disabledStyle = {
    weight: 1,
    fillColor: '#fff',
    fillOpacity: 0.8,
    className: ''
  };

  /* codes couleurs des partis politiques */
  var colors = {
    "BC-UD": "#00FFFF",
    "BC-UG": "#BB0000",
    "BC-UC": "#74C2C3",
    "BC-DVD": "#ADC1FD",
    "BC-DVG": "#FFC0C0",
    "BC-SOC": "#FF8080",
    "BC-UMP": "#0066CC",
    "BC-MDM": "#FF9900",
    "BC-UDI": "#00FFFF",
    "BC-DIV": "#F0F0F0",
    "BC-FG": "#DD0000",
    "BC-COM": "#DD0000",
    "BC-FN": "#C0C0C0",
    "BC-RDG": "#550000",
    "BC-VEC": "#16d94a",
    "BC-DLF" : "#f8ec89",
    "BC-EXG" : "#f8ec89",
    "BC-EXD" : "#f8ec89",
    "DEFAULT": "#f8ec89"
  };
  /* libellés des partis politiques */
  var labels = {
    "BC-UD": "Union de la droite",
    "BC-UG": "Union de la gauche",
    "BC-UC": "Union du centre",
    "BC-DVD": "Divers droite",
    "BC-DVG": "Divers gauche",
    "BC-SOC": "Parti socialiste",
    "BC-UMP": "Union pour un mouvement populaire",
    "BC-MDM": "Modem",
    "BC-UDI": "Union des démocrates indépendants",
    "BC-DIV": "Divers",
    "BC-FG": "Front de gauche",
    "BC-COM": "Parti communiste français",
    "BC-FN": "Front national",
    "BC-RDG": "Parti radical de gauche",
    "BC-VEC": "Europe écologie les Verts (EELV)",
    "BC-DLF" : "Debout la France",
    "BC-EXG" : "Extrême gauche",
    "BC-EXD" : "Extrême droite",
    "DEFAULT": "#f8ec89"
  };

  /* variables pour stockage des json chargés et conservation de l'etat courant */
  var subLayers_cache = [];
  var currentRegLayer = null;
  var currentDeptLayer = null;
  var currentCircoLayer = null;
  var currentComLayer = null;
  var currentViewType = 'france';

  /* fonctions globales */

  /* gestion du choix des donnes a affiche */
  var dataResultatsDirectory = 'dep_2015';
  $(function() {
    $("#select-data button").on('click', function(){
      $("#select-data ul").toggle();
    });

    $("#select-data ul li a").on('click', function(){
      dataResultatsDirectory =  $(this).attr('data-rel');
      $("#select-data h1").html($(this).html());
      $("#select-data ul li a.selected").removeClass('selected');
      $(this).addClass('selected');


      /* en vue region */
      if( currentViewType == 'france' ){
        map.removeLayer(regionsLayer);
        //regionsLayer.addTo(map);
        regionsLayer = new L.GeoJSON.AJAX(
          "data/contours/france-metropolitaine/regions-2015.geojson",
          {
            onEachFeature: onEachFeatureReg
          }
        ).addTo(map);
      }else if( currentViewType == 'reg2015' ){
        for( index in subLayers_cache ){
          if( index.indexOf('-dep-') >= 0  ){
            map.removeLayer(subLayers_cache[index]);
          }
        }
        var n = currentRegLayer.feature.properties.NUMERO + '-dep-' + dataResultatsDirectory;
        if( ! subLayers_cache[n] ){
          var subLayers = new L.GeoJSON.AJAX(
            'data/contours/regions-2015/'+currentRegLayer.feature.properties.NUMERO+'/departements.geojson',
            {
              onEachFeature: onEachFeatureDep
            }
          ).addTo(map);
          subLayers_cache[n] = subLayers;
        }else{
          subLayers_cache[n].addTo(map);
        }
        displayInfos(currentRegLayer.feature, currentViewType);
      }else if( currentViewType == 'dep' ){
        for( index in subLayers_cache ){
          if( index.indexOf('-'+dep_subview+'-') >= 0  ){
            map.removeLayer(subLayers_cache[index]);
          }

        }


        // load and display sub-layers
        var n = currentDeptLayer.feature.properties.NUMERO + '-'+dep_subview+'-' + dataResultatsDirectory;
        if( ! subLayers_cache[n] ){
          var subLayers = new L.GeoJSON.AJAX(
            'data/contours/departements/'+currentDeptLayer.feature.properties.NUMERO+'/'+dep_subview+'.geojson',
            {
              onEachFeature: (dep_subview=='communes' ? onEachFeatureCom : onEachFeatureCirco)
            }
          ).addTo(map);
          subLayers_cache[n] = subLayers;
        }else{
          subLayers_cache[n].addTo(map);
        }
        displayInfos(currentDeptLayer.feature, currentViewType);
      }



    });
  });

  /* gestion de la navigation departement */
  var dep_subview = 'circonscriptions'; // communes | circonscriptions
  $(function() {
    $("#select-subview input[type=radio]").on('change', function(){
      if( $(this).prop('checked') ){

        // remove current sublayer
        for( index in subLayers_cache ){
          if( index.indexOf('-'+dep_subview+'-') >= 0  ){
            map.removeLayer(subLayers_cache[index]);
          }

        }

        // change subview
        dep_subview = $(this).val() ;

        // load and display sub-layers
        var n = currentDeptLayer.feature.properties.NUMERO + '-'+dep_subview+'-' + dataResultatsDirectory;
        if( ! subLayers_cache[n] ){
          var subLayers = new L.GeoJSON.AJAX(
            'data/contours/departements/'+currentDeptLayer.feature.properties.NUMERO+'/'+dep_subview+'.geojson',
            {
              onEachFeature: (dep_subview=='communes' ? onEachFeatureCom : onEachFeatureCirco)
            }
          ).addTo(map);
          subLayers_cache[n] = subLayers;
        }else{
          subLayers_cache[n].addTo(map);
        }

      }

    });
  });

  /* affichage popin d'info au survol des zones*/
  function updatePopupPosition(e){

    // par défaut coin bas/gauche suit la souris
    var positionX = e.clientX+5;
    var positionY = e.clientY - 25 - $("#popupinfo").height();

    // si la popup deborde à droite, on met le coin droite
    if( (positionX + $("#popupinfo").width()) >= ($("#map").offset().left + $("#map").width()) ){
      positionX =   e.clientX - $("#popupinfo").width() - 25;
    }
    // si la popup deborde en haut, on met le coin haut
    if( (positionY ) < ($("#map").offset().top )) {
      positionY =   e.clientY + 25;
    }

    $("#popupinfo").css('top', positionY);//e.clientY);
    $("#popupinfo").css('left', positionX);//e.clientX);
  }
  function displayPopup(e, text){
    if( $('#popupinfo').length > 0 ){
      $('#popupinfo').html(text);
    }else{
      $('body').append('<div id="popupinfo">'+text+'</div>');
    }

    // par défaut coin bas/gauche suit la souris
    var positionX = e.originalEvent.clientX+5;
    var positionY = e.originalEvent.clientY - 25 - $("#popupinfo").height();

    // si la popup deborde à droite, on met le coin droite
    if( (positionX + $("#popupinfo").width()) >= ($("#map").offset().left + $("#map").width()) ){
      positionX =   e.originalEvent.clientX - $("#popupinfo").width() - 25;
    }
    // si la popup deborde en haut, on met le coin haut
    if( (positionY ) < ($("#map").offset().top )) {
      positionY =   e.originalEvent.clientY + 25;
    }

    $("#popupinfo").css('top', positionY);//e.clientY);
    $("#popupinfo").css('left', positionX);//e.clientX);

    window.addEventListener('mousemove', updatePopupPosition, false);
  }

  function hidePopup(e){
    $("#popupinfo").remove();
    window.removeEventListener('mousemove', updatePopupPosition, false);
  }
  /* centrage sur la zone cliquable */
  function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
  }

  /* mise en evidence d'une zone cliquable (au survol) */
  function highlightFeature(e) {
    var layer = e.target;

    if( layer.options && layer.options.className != 'active' ){
      layer.setStyle(highlightStyle);
    }else if(layer._layers){
      for(var key in layer._layers) {
        var sublayer = layer._layers[key];
        if( sublayer.options && sublayer.options.className != 'active' ){
          sublayer.setStyle(highlightStyle);
        }
      }
    }
  }
  /* mise en evidence d'une zone cliquable (au clic) */
  function highlightSelectedFeature(e) {
    var layer = e.target;

    layer.setStyle(selectStyle);
  }
  /* reset du style d'une zone cliquable */
  function resetHighlightOnFeature(e) {
    var layer = e.target;
    if( layer.options && layer.options.className != 'active' ){
      layer.setStyle(defaultStyle);
      layer.setStyle({fillColor:layer.bgcolor});
    }else if(layer._layers){
      for(var key in layer._layers) {
        var sublayer = layer._layers[key];
        if( sublayer.options && sublayer.options.className != 'active' ){
          sublayer.setStyle(defaultStyle);
          sublayer.setStyle({fillColor:layer.bgcolor});
        }
      }
    }
  }
  /* reset du style par défaut de toutes les zones cliquables */
  function resetAllLayerState(){

    // retour à la selection précédente
    //printDebug('back from current view ' + currentViewType, true);
    //printDebug('currentRegLayer= ' + currentRegLayer, true);
    //printDebug('currentDeptLayer= ' + currentDeptLayer, true);
    //printDebug('currentCircoLayer= ' + currentCircoLayer, true);
    //printDebug('currentComLayer= ' + currentComLayer, true);

    // si region selectionnée, affiche la carte des régions
    if( currentViewType == 'reg2015'){
      // suppression du decoupage dept
      for( index in subLayers_cache ){
        if( index.indexOf('-dep-') >= 0  ){
          map.removeLayer(subLayers_cache[index]);
        }
      }

      // re init des layer regions
      map.eachLayer(function(layer){
        if( layer.quorums_type == 'reg2015' ){
          onEachFeatureReg(layer.feature, layer)
        }
      });

      // retour du layer region selectionné
      currentRegLayer.addTo(map);

      currentRegLayer.setStyle(defaultStyle);
      currentRegLayer.setStyle({fillColor:currentRegLayer.bgcolor});

      printDebug('currentViewType : ' + currentViewType + ' -> france' , true);
      currentViewType = 'france';

      map.fitBounds(bounds);

      currentRegLayer = null;

      $('#infos').html('');

    }else if( currentViewType == 'dep'){
      // suppression du decoupage commune/circo
      for( index in subLayers_cache ){
        if( index.indexOf('-'+dep_subview+'-') >= 0  ){
          map.removeLayer(subLayers_cache[index]);
        }
      }

      // re init des layer dep
      map.eachLayer(function(layer){
        if( layer.quorums_type == 'dep' ){
          onEachFeatureDep(layer.feature, layer)
        }
      });

      // retour du layer dep selectionné
      currentDeptLayer.addTo(map);

      currentDeptLayer.setStyle(defaultStyle);
      currentDeptLayer.setStyle({fillColor:currentDeptLayer.bgcolor});

      printDebug('currentViewType : ' + currentViewType + ' -> reg2015' , true);
      currentViewType = 'reg2015';

      map.fitBounds(currentRegLayer);

      displayInfos(currentRegLayer.feature, currentViewType);

      currentDeptLayer = null;

      $('#select-subview').addClass('hide');

    }else if( currentViewType == 'com' || currentViewType == 'circo' ){
      // suppression des bv
      for( index in subLayers_cache ){
        if( index.indexOf('-com-bv-') >= 0  ){
          map.removeLayer(subLayers_cache[index]);
        }
      }

      // re init des layer communes/circo et suppression des bv
      map.eachLayer(function(layer){
        if( layer.quorums_type == 'com' ){
          onEachFeatureCom(layer.feature, layer)
        }else if( layer.quorums_type == 'circo' ){
          onEachFeatureCirco(layer.feature, layer)
        }
      });

      var currentParentLayer;
      if( currentCircoLayer != null ){
        currentParentLayer = currentCircoLayer;
      }else if ( currentComLayer != null ){
        currentParentLayer = currentComLayer;
      }
      // retour du layer com/circo selectionné
      currentParentLayer.addTo(map);

      currentParentLayer.setStyle(defaultStyle);
      currentParentLayer.setStyle({fillColor:currentParentLayer.bgcolor});

      printDebug('currentViewType : ' + currentViewType + ' -> dep' , true);
      currentViewType = 'dep';

      map.fitBounds(currentDeptLayer);

      displayInfos(currentDeptLayer.feature, currentViewType);

      currentCircoLayer = null;
      currentComLayer = null;

      $('#select-subview').removeClass('hide');
    }

  }
  /* selection d'une zone cliquable */
  function selectFeature(e, feature, layer, type){


    printDebug('selectFeature() : changement currentViewType ' + currentViewType + ' -> ' + type, true);
    //alert('selectFeature('+type+'). currentLayer : '+layer._leaflet_id+', regionLayer : ' + (currentRegLayer!=null?currentRegLayer._leaflet_id:'null'));

    if( type == 'reg2015' ){
      currentRegLayer = layer;
      map.removeLayer(layer);
    }else if( type == 'dep' ){
      currentDeptLayer = layer;
      map.removeLayer(layer);
    }else if( type == 'circo' ){
      currentCircoLayer = layer;
      //map.removeLayer(layer);
    }else if( type == 'com' ){
      currentComLayer = layer;
      map.removeLayer(layer);
    }

    // zoom sur la zone sélectionnée
    zoomToFeature(e);

    // mise en évidence de la zone
    //highlightSelectedFeature(e);

    // to delete if( type == 'reg2015' ){
    // désactivation des autres zones
    map.eachLayer(function(otherLayer){
      //alert('desactivation du layer ' + otherLayer._leaflet_id + ', (' + otherLayer.quorums_type + ')');
      if( otherLayer.feature && otherLayer != layer &&  otherLayer.quorums_type == type){
        otherLayer.setStyle(disabledStyle);
        otherLayer.off('mouseover');
        otherLayer.off('mouseout');
        otherLayer.off('click');
        otherLayer.on('click', function(e){
          resetAllLayerState();
        });
      }
    });
    // to delete }

    // display infos
    displayInfos(feature, type);

    // load sublayers
    if( type == 'reg2015' ){
      // load and display sub-layers
      var n = feature.properties.NUMERO + '-dep-' + dataResultatsDirectory;
      if( ! subLayers_cache[n] ){
        var subLayers = new L.GeoJSON.AJAX(
          'data/contours/regions-2015/'+feature.properties.NUMERO+'/departements.geojson',
          {
            onEachFeature: onEachFeatureDep
          }
        ).addTo(map);
        subLayers_cache[n] = subLayers;
      }else{
        subLayers_cache[n].addTo(map);
      }

      $('#select-subview').addClass('hide');


    } else if( type == 'dep' ){
      // load and display sub-layers
      var n = feature.properties.NUMERO + '-'+dep_subview+'-' + dataResultatsDirectory;
      if( ! subLayers_cache[n] ){
        var subLayers = new L.GeoJSON.AJAX(
          'data/contours/departements/'+feature.properties.NUMERO+'/'+dep_subview+'.geojson',
          {
            onEachFeature: (dep_subview=='communes' ? onEachFeatureCom : onEachFeatureCirco)
          }
        ).addTo(map);
        subLayers_cache[n] = subLayers;
      }else{
        subLayers_cache[n].addTo(map);
      }

      $('#select-subview').removeClass('hide');
    }else if( type == 'com' && feature.properties.REF_INSEE == '33063'){
      // load bv points
      var n = feature.properties.NUMERO + '-com-bv-' + dataResultatsDirectory;
      if( ! subLayers_cache[n] ){
        var subLayers = new L.GeoJSON.AJAX(
          'data/contours/communes/'+feature.properties.REF_INSEE.slice(0, 2) + "/" + feature.properties.REF_INSEE.slice(2)+'/bureaux.geojson',
          {
            pointToLayer: pointToLayerBV,
            onEachFeature : onEachFeatureBV
          }
        ).addTo(map);
        subLayers_cache[n] = subLayers;
      }else{
        subLayers_cache[n].addTo(map);
      }

      $('#select-subview').addClass('hide');
    }else{
      $('#select-subview').addClass('hide');
    }

    currentViewType = type;
    /*
    else if( type == 'circo' ){
    // load and display sub-layers
    var n = feature.properties.code_circo + '-com-' + dataResultatsDirectory;
    if( ! subLayers_cache[n] ){
    var subLayers = new L.GeoJSON.AJAX(
    'data/contours/circonscriptions/'+feature.properties.code_circo+'/communes.geojson',
    {
    onEachFeature: onEachFeatureCom
  }
).addTo(map);
subLayers_cache[n] = subLayers;
}else{
subLayers_cache[n].addTo(map);
}
}
*/

}
/* affichage des infos relatives à la zone sélectionnée */
function displayInfos(feature, type){
  var resultats_key = feature.properties.NUMERO;
  var infosContent = "";
  $('#infos').html('');

  if( type == 'reg2015' ){
    $('#infos').append("<h2>"+feature.properties.REGION + "</h2>");
  }else if( type == 'dep' ){
    $('#infos').append("<h2>"+feature.properties.NOM + "</h2>");
  }else if( type == 'circo' ){
    resultats_key = feature.properties.num_dep + "/" + feature.properties.num_circo;
  }else if( type == 'com' ){
    $('#infos').append("<h2>"+feature.properties.COMMUNE + "</h2>");
    resultats_key = feature.properties.REF_INSEE;
    resultats_key = resultats_key.slice(0, 2) + "/" + resultats_key.slice(2);
  }

  $.ajax({
    url: "data/resultats/"+dataResultatsDirectory+"/"+type+"/" + resultats_key + ".json",
    dataType: "json"
  })
  .done(function(data) {
    if( "success" == data.status ){
      if( type == 'circo' ){
        $('#infos').prepend("<h2>"+data.data.lib_dep + " " + data.data.lib_circo + "</h2>");
      }

      $('#infos').append('<h3 class="participation">Participation</h3>');

      $('#infos').append('<div class="participation"><i class="fa fa-circle color-DEFAULT"></i> Taux de participation sur '+data.data.inscrits+' inscrits<div class="bar"><span class="pourcent-fill pourcent-'+parseInt(100-data.data.pourcent_abs_ins)+' bgcolor-DEFAULT"></span></div><span class="pourcent-value">'+(100-data.data.pourcent_abs_ins)+' %</span></div>');

      $('#infos').append('<h3 class="resultats">Résultats</h3>');
      $('#infos').append('<div class="center"><canvas id="resultsPie" width="280" height="150" /></div>');


      if( data.data.resultats ){
        var resultats = data.data.resultats;

        resultats.sort(function(a,b){
          var sortResult = 0;
          sortResult = b.voix - a.voix;
          return sortResult;
        });

        var pieData = [];
        var pieLegend = '<ul class="legend">';
        var resultDetail = '<ul class="detail">';

        for ( var i in resultats ){
          var res = resultats[i];

          var label = labels[res.code_nuance];
          if (dataResultatsDirectory == 'pres_2012_t1'
          || dataResultatsDirectory == 'pres_2012_t2'){
            label = res.nom + ' ' + res.prenom;
          }
          pieData.push({value:res.voix,color:colors[res.code_nuance],highlight:colors[res.code_nuance],label: label});

          resultDetail += '<li><i class="fa fa-circle color-'+res.code_nuance+'"></i> '+label+'<span class="votes">'+res.voix+' votes</span><div class="bar"><span class="pourcent-fill pourcent-'+parseInt('0'+res.pourcent_voix_exp)+' bgcolor-'+res.code_nuance+'"></span></div><span class="pourcent-value">'+(res.pourcent_voix_exp.length<4?"0":"")+res.pourcent_voix_exp+' %</span></li>';
        }

        $('#infos').append(resultDetail);
      }
    }else{
      $('#infos').html("<p>Erreur lors du chargement des données</p>");
    }

    // generate pie

    Chart.defaults.global.tooltipTemplate= "<%if (label){%><%=label%>: <%}%><%= value %> voix";
    var ctx = document.getElementById("resultsPie").getContext("2d");
    window.resultsPie = new Chart(ctx).Pie(pieData);

  })
  .fail(function() {
    $('#infos').html('<p>Données non disponibles</p>');
  })
}


/* creation de la carte */
var map = L.map('map', {zoomControl: false}).setView([46.49839, 2.76855]);

map.addControl( L.control.zoom({position: 'topright'}) )

/* zoom auto en fonction de la taille de la zone */
var southWest = L.latLng(40.36329, -5.00977);
var northEast = L.latLng(51.49506, 10.06348);
var bounds = L.latLngBounds(southWest, northEast);
map.fitBounds(bounds);

/* affichage fond osm */
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors | &copy; <a href="http://www.quorums.co">Quorums.co</a>'
}).addTo(map);

/* reset des styles et zoom par défaut si on clique hors de la carte */
map.on('click', function(){
  resetAllLayerState();
  $("#select-data ul").hide();
});




/* Régions */
var regionsLayer = new L.GeoJSON.AJAX(
  "data/contours/france-metropolitaine/regions-2015.geojson",
  {
    onEachFeature: onEachFeatureReg
  }
).addTo(map);

function onEachFeatureReg(feature, layer) {

  layer.setStyle(defaultStyle);
  layer.on('mouseover', function(e){
    displayPopup(e, 'Région ' + feature.properties.REGION);
    highlightFeature(e);
  });
  layer.on('mouseout', function(e){
    hidePopup(e);
    resetHighlightOnFeature(e);
  });

  layer.off('click');
  layer.on('click', function(e){
    selectFeature(e, feature, layer, 'reg2015');
  });

  layer.setStyle({fillColor:layer.bgcolor});

  $.ajax({
    url: "data/resultats/"+dataResultatsDirectory+"/reg2015/" + feature.properties.NUMERO + ".json",
    dataType: "json"
  })
  .done(function(data) {
    if( "success" == data.status ){
      if( data.data.resultats ){
        var resultats = data.data.resultats;
        resultats.sort(function(a,b){
          return b.voix - a.voix;
        });
        var res = resultats[0];
        layer.bgcolor = colors[res.code_nuance];
        layer.setStyle({fillColor:layer.bgcolor});
        layer.quorums_type = 'reg2015';
      }
    }
  });

}

/* Départements */
function onEachFeatureDep(feature, layer) {

  layer.setStyle(defaultStyle);
  layer.on('mouseover', function(e){
    displayPopup(e, feature.properties.NOM + '('+feature.properties.NUMERO+')');
    highlightFeature(e);
  });
  layer.on('mouseout', function(e){
    hidePopup(e);
    resetHighlightOnFeature(e);
  });
  layer.off('click');
  layer.on('click', function(e){
    selectFeature(e, feature, layer, 'dep');
  });

  layer.setStyle({fillColor:layer.bgcolor});

  $.ajax({
    url: "data/resultats/"+dataResultatsDirectory+"/dep/" + feature.properties.NUMERO + ".json",
    dataType: "json"
  })
  .done(function(data) {
    if( "success" == data.status ){
      if( data.data.resultats ){
        var resultats = data.data.resultats;
        resultats.sort(function(a,b){
          return b.voix - a.voix;
        });
        var res = resultats[0];
        layer.bgcolor = colors[res.code_nuance];
        layer.setStyle({fillColor:layer.bgcolor});
        layer.quorums_type = 'dep';
      }
    }
  });

}

/* Circonscriptions législatives */
function onEachFeatureCirco(feature, layer) {

  layer.setStyle(defaultStyle);
  layer.on('mouseover', function(e){
    displayPopup(e, parseInt(feature.properties.num_circo) + '<sup>e</sup> circonscription');
    highlightFeature(e);
  });
  layer.on('mouseout', function(e){
    hidePopup(e);
    resetHighlightOnFeature(e);
  });
  layer.off('click');
  layer.on('click', function(e){
    selectFeature(e, feature, layer, 'circo');
  });

  layer.setStyle({fillColor:layer.bgcolor});


  $.ajax({
    url: "data/resultats/"+dataResultatsDirectory+"/circo/" + feature.properties.num_dep + "/" + feature.properties.num_circo+ ".json",
    dataType: "json"
  })
  .done(function(data) {
    if( "success" == data.status ){
      if( data.data.resultats ){
        var resultats = data.data.resultats;
        resultats.sort(function(a,b){
          return b.voix - a.voix;
        });
        var res = resultats[0];
        layer.bgcolor = colors[res.code_nuance];
        layer.setStyle({fillColor:layer.bgcolor});
        layer.quorums_type = 'circo';
      }
    }
  });

}

/* Communes */
function onEachFeatureCom(feature, layer) {

  layer.setStyle(defaultStyle);
  layer.on('mouseover', function(e){
    displayPopup(e, feature.properties.COMMUNE);
    highlightFeature(e);
  });
  layer.on('mouseout', function(e){
    hidePopup(e);
    resetHighlightOnFeature(e);
  });
  layer.off('click');
  layer.on('click', function(e){
    selectFeature(e, feature, layer, 'com');
  });

  layer.setStyle({fillColor:layer.bgcolor});

  $.ajax({
    url: "data/resultats/"+dataResultatsDirectory+"/com/" + feature.properties.REF_INSEE.slice(0, 2) + "/" + feature.properties.REF_INSEE.slice(2)+ ".json",
    dataType: "json"
  })
  .done(function(data) {
    if( "success" == data.status ){
      if( data.data.resultats ){
        var resultats = data.data.resultats;
        resultats.sort(function(a,b){
          return b.voix - a.voix;
        });
        var res = resultats[0];
        layer.bgcolor = colors[res.code_nuance];
        layer.setStyle({fillColor:layer.bgcolor});
        layer.quorums_type = 'com';
      }
    }
  });
}

/* Bureaux de votes */
var bvMarkerOptions = {
  radius: 8,
  fillColor: "#ff7800",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
};
function pointToLayerBV(feature, latlng) {
  return L.circleMarker(latlng, bvMarkerOptions);
}
function onEachFeatureBV(feature, layer) {
  layer.on('mouseover', function(e){
    displayPopup(e, feature.properties.lib_commune + ', bureau ' + feature.properties.code_bv);
    highlightFeature(e);
  });
  layer.on('mouseout', function(e){
    hidePopup(e);
    resetHighlightOnFeature(e);
  });
  $.ajax({
    url: "data/resultats/"+dataResultatsDirectory+"/bv/" + feature.properties.code_dpt + "/" + feature.properties.code_commune + "/"+ feature.properties.code_bv + ".json",
    dataType: "json"
  })
  .done(function(data) {
    if( "success" == data.status ){
      if( data.data.resultats ){
        var resultats = data.data.resultats;
        resultats.sort(function(a,b){
          return b.voix - a.voix;
        });
        var res = resultats[0];
        layer.bgcolor = colors[res.code_nuance];
        layer.setStyle({fillColor:layer.bgcolor});
        layer.quorums_type = 'bv';
        feature.datas = data.data;
      }
    }
  });

  layer.on('click', function(e){
    $('#infos').html('');
    $('#infos').append("<h2>"+feature.properties.lib_commune + " - Bureau " + feature.properties.code_bv+ "</h2>");

    $('#infos').append('<h3 class="participation">Participation</h3>');

    $('#infos').append('<div class="participation"><i class="fa fa-circle color-DEFAULT"></i> Taux de participation sur '+feature.datas.nb_inscrits+' inscrits<div class="bar"><span class="pourcent-fill pourcent-'+parseInt(feature.datas.nb_exprimes*100/feature.datas.nb_inscrits)+' bgcolor-DEFAULT"></span></div><span class="pourcent-value">'+(feature.datas.nb_exprimes*100/feature.datas.nb_inscrits).toFixed(2)+' %</span></div>');

    $('#infos').append('<h3 class="resultats">Résultats</h3>');

    $('#infos').append('<div class="center"><canvas id="resultsPie" width="280" height="150" /></div>');
    var resultats = feature.datas.resultats;

    resultats.sort(function(a,b){
      var sortResult = 0;
      sortResult = b.voix - a.voix;
      return sortResult;
    });

    var pieData = [];
    var resultDetail = '<ul class="detail">';

    for ( var i in resultats ){
      var res = resultats[i];

      var label = labels[res.code_nuance];
      if (dataResultatsDirectory == 'pres_2012_t1'
      || dataResultatsDirectory == 'pres_2012_t2'){
        label = res.nom + ' ' + res.prenom;
      }
      pieData.push({value:res.voix,color:colors[res.code_nuance],highlight:colors[res.code_nuance],label: label});

      resultDetail += '<li><i class="fa fa-circle color-'+res.code_nuance+'"></i> '+label+'<span class="votes">'+res.voix+' votes</span><div class="bar"><span class="pourcent-fill pourcent-'+parseInt('0'+res.pourcent_voix_exp)+' bgcolor-'+res.code_nuance+'"></span></div><span class="pourcent-value">'+res.pourcent_voix_exp+' %</span></li>';
    }

    $('#infos').append(resultDetail);

    // generate pie

    Chart.defaults.global.tooltipTemplate= "<%if (label){%><%=label%>: <%}%><%= value %> voix";
    var ctx = document.getElementById("resultsPie").getContext("2d");
    window.resultsPie = new Chart(ctx).Pie(pieData);

  });
}

/* pour le debug */
function displayObjProperties(obj){
  var message = 'displayObjProperties : \r\n';
  for(var key in obj) {
    var value = obj[key];
    message += key + ' => ' + value + '\r\n';
  }
  message += '\r\nend.';
  alert(message);
}

function printDebug(message, append){
  if( debug ){
    if( append ){
      $('#debug').prepend(message+'<br/>');
    }else{
      $('#debug').html(message+'</p>');
    }
  }
}

if( debug ){
  $('body').append('<div id="debug"></div>');
}
}
