var cartoQuorum = (function ($, L) {
var debug = true;


/* styles par défaut des zones cliquables */

var defaultStyle = {
    color: '#000000', 
    weight: 1,
    opacity: 0.5,
    fillOpacity: 0.9,
    className: ''
};

var highlightStyle = {
    color: '#000000', 
    weight: 1,
    opacity: 1,
    fillOpacity: 0.5,
    className: ''
}

var selectStyle = {
    color: '#000000', 
    weight: 5,
    fillOpacity: 0.5
};


// a adapter en f° du niveau de zoom, y compris sur les styles par defaut
// alignement de la liste deroulantes, du switch, du zoom et du titre
var disabledStyle = {
    weight: 1,
    fillColor: '#eeeeee',
    fillOpacity: 0.8,
    className: ''
};

/* codes couleurs des partis politiques */
var colors = {
    "BC-UD": "#008bcb",
    "BC-UG": "#f2a2d4",
    "BC-UC": "#74C2C3",
    "BC-DVD": "#3f6cc1",
    "BC-DVG": "#FFC0C0",
    "BC-SOC": "#e88ac4",
    "BC-UMP": "#0066CC",
    "BC-MDM": "#FF9900",
    "BC-UDI": "#00FFFF",
    "BC-DIV": "#F0F0F0",
    "BC-FG": "#DD0000",
    "BC-COM": "#DD0000",
    "BC-FN": "#032c79",
    "BC-RDG": "#550000",
    "BC-VEC": "#16d94a",
    "BC-DLF" : "#f8ec89",
    "BC-EXG" : "#f8ec89",
    "BC-EXD" : "#f8ec89",
    "DEFAULT": "#f8ec89",
    "sympathisants": "#60bc7a",
    "indecis": "#4fadab",
    "opposants": "#ca394f"
};

var shades = {
    "va_voter":  -0.5,
    "ne_va_pas": 0.5,
    "ne_sait_pas": 0
}

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
    "DEFAULT": "sans étiquettes",
    "sympathisants": "Sympathisants",
    "indecis": "Indécis",
    "opposants": "Opposants",
    "va_voter":  "Va voter",
    "ne_va_pas": "Ne vas pas voter",
    "ne_sait_pas": "Ne sait pas s'il va voter"
};

/* variables pour stockage des json chargés et conservation de l'etat courant */
var subLayers_cache = [];
var currentRegLayer = null;
var currentDeptLayer = null;
var currentCircoLayer = null;
var currentComLayer = null;
var currentViewType = 'france';
var currentIrisLayer = null;

/* fonctions globales */
function shadeColor2(color, percent) {   
    var f=parseInt(color.slice(1),16),
        t=percent<0?0:255,
        p=percent<0?percent*-1:percent,
        R=f>>16,
        G=f>>8&0x00FF,
        B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

/* gestion du choix des donnes a affiche */
var dataResultatsDirectory = 'dep_2015';

function hideSelectSubview(){
    $('#select-subview').addClass('hide');
    $('#select-subview').removeClass('com-circo insee');
}
function showSelectSubview(){
    $('#select-subview').removeClass('hide');
    
    if (dataResultatsDirectory == 'insee'){
        $('#select-subview').addClass('insee');
        $('#select-subview').removeClass('com-circo');
        $('#select-subview input.pauvrete').prop('checked', true);
        dep_subview ='communes_pauvrete';
    }else{
        $('#select-subview').addClass('com-circo');
        $('#select-subview').removeClass('insee');
        $('#select-subview input.circonscriptions').prop('checked', true);
        dep_subview = 'circonscriptions_elections';
    }

}

function gestionCacheRemove(variable1,variable2)
{

            for( var index in subLayers_cache ){
                if (variable2)
                {
                    if( index.indexOf(variable1) >= 0 || index.indexOf(variable2) >= 0 ){
                        map.removeLayer(subLayers_cache[index]);
                    }
                }else
                {
                    if( index.indexOf(variable1) >= 0 ){
                        map.removeLayer(subLayers_cache[index]);
                    }
                }
            }
}



function listen() {
    $(function() {
      $("#select-data button").on('click', function(){
          $("#select-data ul").toggle();
      });
        
      $("#select-data ul li a").on('click', function(event){
          event.preventDefault();
          
          // close dropdown
          $("#select-data ul").hide();
          
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
          }
          else if( currentViewType == 'reg2015' )
          {

                gestionCacheRemove("-dep-");

                var n = currentRegLayer.feature.properties.NUMERO + '-dep-' + dataResultatsDirectory;
                if( ! subLayers_cache[n] ){
                    var subLayers = new L.GeoJSON.AJAX(
                        'data/contours/regions-2015/'+currentRegLayer.feature.properties.NUMERO+'/departements.geojson',
                        {
                            onEachFeature: onEachFeatureDep
                        }
                    ).addTo(map);
                    printDebug("ajout cache n:"+n,true);
                    subLayers_cache[n] = subLayers;
                }else{
                    subLayers_cache[n].addTo(map);printDebug("utilisation cache n:"+n,true);
                }
                 displayInfos(currentRegLayer.feature, currentViewType);

          }
          else if( currentViewType == 'dep')
          {
                var previous_subview = dep_subview;   
                showSelectSubview();
                printDebug('previous subview layer ' + previous_subview  +', new on ' + dep_subview +" ->currentViewType:"+currentViewType, true);
                gestionCacheRemove('-'+previous_subview+'-');
                if (dep_subview.substring(0,8)!="iris2000")
                {          
                        // load and display sub-layers
                            var n = currentDeptLayer.feature.properties.NUMERO + '-'+dep_subview+'-' + dataResultatsDirectory;
                            if( ! subLayers_cache[n] ){
                                
                                    var subLayers = new L.GeoJSON.AJAX(
                                        'data/contours/departements/'+currentDeptLayer.feature.properties.NUMERO+'/'+dep_subview.substring(0,8)+'.geojson',
                                        {
                                            onEachFeature: (dep_subview.substring(0,8)=='communes' ? onEachFeatureCom : onEachFeatureCirco)
                                        }
                                    ).addTo(map);
                                printDebug("ajout cache n:"+n,true);
                                subLayers_cache[n] = subLayers;
                            }else{
                                subLayers_cache[n].addTo(map);printDebug("utilisation cache n:"+n,true);
                            } 
                }
                else
                {
                        // load and display sub-layers
                            var n = currentDeptLayer.feature.properties.NUMERO + '-'+dep_subview+'-' + dataResultatsDirectory;
                            if( ! subLayers_cache[n] ){
                                var subLayers = new L.GeoJSON.AJAX(
                                    'data/contours/departements/'+currentDeptLayer.feature.properties.NUMERO+'/'+dep_subview.substring(0,8)+'.geojson',
                                    {
                                        onEachFeature: onEachFeatureIris
                                    }
                                ).addTo(map);
                                printDebug("ajout cache n:"+n,true);
                                subLayers_cache[n] = subLayers;
                            }else{
                                subLayers_cache[n].addTo(map);printDebug("utilisation cache n:"+n,true);
                            } 
                }
                displayInfos(currentDeptLayer.feature, currentViewType);
          }
          else if (currentViewType == 'circo'||currentViewType == 'com'||currentViewType == 'iris')
          { 
                var previous_subview = dep_subview;   
                showSelectSubview();
                printDebug('previous subview layer ' + previous_subview  +', new on ' + dep_subview +" ->currentViewType:"+currentViewType, true);
                gestionCacheRemove('-'+previous_subview+'-');
                //gestionCacheRemove('-'+dep_subview+'-');
                //gestionCacheRemove('-'+currentViewType+'-');

                if (dep_subview.substring(0,8)!="iris2000")
                {          
                        // load and display sub-layers
                            var n = currentDeptLayer.feature.properties.NUMERO + '-'+dep_subview+'-' + dataResultatsDirectory;
                            printDebug("n:"+n,true);
                            //if( ! subLayers_cache[n] ){
                                
                                    var subLayers = new L.GeoJSON.AJAX(
                                        'data/contours/departements/'+currentDeptLayer.feature.properties.NUMERO+'/'+dep_subview.substring(0,8)+'.geojson',
                                        {
                                            onEachFeature: (dep_subview.substring(0,8)=='communes' ? onEachFeatureCom : onEachFeatureCirco)
                                        }
                                    ).addTo(map);
                                printDebug("ajout cache n:"+n,true);
                                subLayers_cache[n] = subLayers;
                            //}else{
                              //  subLayers_cache[n].addTo(map);printDebug("utilisation cache n:"+n,true);
                            //} 
                }
                else
                {
                        // load and display sub-layers
                            var n = currentDeptLayer.feature.properties.NUMERO + '-'+dep_subview+'-' + dataResultatsDirectory;
                            printDebug("n:"+n,true);
                            if( ! subLayers_cache[n] ){
                                var subLayers = new L.GeoJSON.AJAX(
                                    'data/contours/departements/'+currentDeptLayer.feature.properties.NUMERO+'/'+dep_subview.substring(0,8)+'.geojson',
                                    {
                                        onEachFeature: onEachFeatureIris
                                    }
                                ).addTo(map);
                                printDebug("ajout cache n:"+n,true);
                                subLayers_cache[n] = subLayers;
                            }else{
                                subLayers_cache[n].addTo(map);printDebug("utilisation cache n:"+n,true);
                            } 
                }
                displayInfos(currentDeptLayer.feature, currentViewType);
          }
      });
    });
}

/* gestion de la navigation departement */
var dep_subview ='';
if (dataResultatsDirectory!="insee"){dep_subview ='circonscriptions_elections';}else{dep_subview ='communes_pauvrete';} // communes | circonscriptions

function listen_switch() {
    $(function() {

        //if (dataResultatsDirectory!="insee")
    
          $("#select-subview input[type=radio]").on('change', function(){
              if( $(this).prop('checked') )
              {
              
                printDebug('change subview to display : from ' + dep_subview + ', to ' + $(this).val(), true);
                gestionCacheRemove('-'+dep_subview+'-');
                dep_subview = $(this).val() ;
                    // load and display sub-layers
                    var n = currentDeptLayer.feature.properties.NUMERO + '-'+dep_subview+'-' + dataResultatsDirectory;
                    printDebug("currentDeptLayer.feature.properties.NUMERO + '-'+dep_subview+'-' + dataResultatsDirectory:"+n,true);
                    
                    if (dep_subview.substring(0,8)!="iris2000")
                            {
                                    // load and display sub-layers
                                    if( ! subLayers_cache[n] )
                                    {
                                        
                                            if (dep_subview.substring(0,8)=='communes')
                                            {
                                                        var subLayers = new L.GeoJSON.AJAX(
                                            'data/contours/departements/'+currentDeptLayer.feature.properties.NUMERO+'/communes.geojson',
                                                {
                                                    onEachFeature:onEachFeatureCom
                                                }).addTo(map);
                                            }
                                            else if(dep_subview.substring(0,8)=='circonsc')
                                            {
                                                        var subLayers = new L.GeoJSON.AJAX(
                                            'data/contours/departements/'+currentDeptLayer.feature.properties.NUMERO+'/'+dep_subview.substring(0,8)+'.geojson',
                                                {
                                                    onEachFeature:onEachFeatureCirco
                                                }).addTo(map);
                                            }
                                                //onEachFeature: (dep_subview=='communes' ? onEachFeatureCom : onEachFeatureCirco)
                                        printDebug("ajout cache n:"+n,true);
                                        subLayers_cache[n] = subLayers;
                                    }else{
                                        subLayers_cache[n].addTo(map);printDebug("utilisation cache n:"+n,true);
                                    } 
                            }
                            else
                            {
                                        // load and display sub-layers
                                    if( ! subLayers_cache[n] ){
                                        var subLayers = new L.GeoJSON.AJAX(
                                            'data/contours/departements/'+currentDeptLayer.feature.properties.NUMERO+'/'+dep_subview.substring(0,8)+'.geojson',
                                            {
                                                onEachFeature: onEachFeatureIris
                                            }
                                        ).addTo(map);
                                        printDebug("ajout cache n:"+n,true);
                                      subLayers_cache[n] = subLayers;
                                    }else{
                                        subLayers_cache[n].addTo(map);printDebug("utilisation cache n:"+n,true);
                                    }  
                            }    

              }
              
            });
            
    });
}

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
printDebug("resetAllLayerState",true);
    // retour à la selection précédente
    // si region selectionnée, affiche la carte des régions
    if( currentViewType == 'reg2015'){

        // suppression du decoupage dept
        gestionCacheRemove('-dep-');
        
        // retour du layer region selectionné
        currentRegLayer.addTo(map);
        
        // re init des layer regions
        map.eachLayer(function(layer){
            if( layer.quorums_type == 'reg2015' ){
                onEachFeatureReg(layer.feature, layer) 
            }
        });
        
        //currentRegLayer.setStyle(defaultStyle);
        //currentRegLayer.setStyle({fillColor:currentRegLayer.bgcolor});
        
        printDebug('reset(reg) : currentViewType : ' + currentViewType + ' -> france' , true);
        currentViewType = 'france';
        
        map.fitBounds(bounds);
        
        currentRegLayer = null;
        
        $('#infos').html('');
        
    }else if( currentViewType == 'dep'){
        // suppression du decoupage commune/circo
        printDebug('reset(dep) : suppression sublayer type : ' + dep_subview , true);
        
        gestionCacheRemove('-'+dep_subview+'-');
        
        // retour du layer dep selectionné
        currentDeptLayer.addTo(map);
        
        // re init des layer dep
        map.eachLayer(function(layer){
            if( layer.quorums_type == 'dep' ){
                onEachFeatureDep(layer.feature, layer) 
            }
        });
        
        //currentDeptLayer.setStyle(defaultStyle);
        //currentDeptLayer.setStyle({fillColor:currentDeptLayer.bgcolor});
        
        printDebug('reset(dep) : currentViewType : ' + currentViewType + ' -> reg2015' , true);
        currentViewType = 'reg2015';
        
        map.fitBounds(currentRegLayer);
        
        displayInfos(currentRegLayer.feature, currentViewType);
        
        currentDeptLayer = null;
        
        hideSelectSubview(); 
        
    }else if( currentViewType == 'com' || currentViewType == 'circo' || currentViewType == 'iris'){
        // suppression des bv
        printDebug("current"+currentCircoLayer+"/"+currentComLayer,true);
        gestionCacheRemove('-com-bv-');
        
        var currentParentLayer;
        if( currentCircoLayer != null ){
            currentParentLayer = currentCircoLayer;
        }else if ( currentComLayer != null ){
            currentParentLayer = currentComLayer;
        }else if ( currentIrisLayer != null ){
            currentParentLayer = currentIrisLayer;
        }
        // retour du layer com/circo selectionné
        currentParentLayer.addTo(map);

        // re init des layer communes/circo et suppression des bv
        map.eachLayer(function(layer){
            if( layer.quorums_type == 'com' ){
                onEachFeatureCom(layer.feature, layer) 
            }else if( layer.quorums_type == 'circo' ){
                onEachFeatureCirco(layer.feature, layer) 
            }else if( layer.quorums_type == 'iris' ){
                onEachFeatureIris(layer.feature, layer) 
            }
        });
        
            
        //currentParentLayer.setStyle(defaultStyle);
        //currentParentLayer.setStyle({fillColor:currentParentLayer.bgcolor});
        
        printDebug('reset(com|circo|iris) : currentViewType : ' + currentViewType + ' -> dep' , true);
        currentViewType = 'dep';
        
        map.fitBounds(currentDeptLayer);
        
        displayInfos(currentDeptLayer.feature, currentViewType);
        
        currentCircoLayer = null;
        currentComLayer = null;
        currentIrisLayer = null;

        showSelectSubview();
    }
    
}

/* selection d'une zone cliquable */
function selectFeature(e, feature, layer, type){
    
    // force hidePopup, because when selectFeature, mouseout can't be called considering feature is removed
    hidePopup(e);
    
    printDebug('before selectFeature() : currentRegLayer='+currentRegLayer+', currentDeptLayer='+currentDeptLayer+', currentCircoLayer='+currentCircoLayer+', currentComLayer='+currentComLayer+', currentViewType='+currentViewType+', currentIrisLayer='+currentIrisLayer+', dataResultatsDirectory='+dataResultatsDirectory+', dep_subview='+dep_subview, true);
    $("#select-data ul").hide();
    
    //printDebug('selectFeature() : changement currentViewType ' + currentViewType + ' -> ' + type, true);
    //alert('selectFeature('+type+'). currentLayer : '+layer._leaflet_id+', regionLayer : ' + (currentRegLayer!=null?currentRegLayer._leaflet_id:'null'));
   
    if( type == 'reg2015' ){
        currentRegLayer = layer;
        map.removeLayer(layer);
    }else if( type == 'dep' ){
        currentDeptLayer = layer; 
        map.removeLayer(layer);
    }else if( type == 'circo' ){
        currentCircoLayer = layer; 
        map.removeLayer(layer);
    }else if( type == 'com' ){
        currentComLayer = layer; 
        map.removeLayer(layer);
    }else if( type == 'iris' ){
        currentIrisLayer = layer; 
        map.removeLayer(layer);
    }
    
    // zoom sur la zone sélectionnée
    zoomToFeature(e);
    
    // désactivation des autres zones
    map.eachLayer(function(otherLayer){
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
            printDebug("ajout cache n:"+n,true);
            subLayers_cache[n] = subLayers;
        }else{
            subLayers_cache[n].addTo(map);printDebug("utilisation cache n:"+n,true);
        }
            
    } else if( type == 'dep' )
    {
        showSelectSubview();
         // load and display sub-layers
        var n = feature.properties.NUMERO + '-'+dep_subview+'-' + dataResultatsDirectory;
        if (dep_subview.substring(0,8)!="iris2000")
        {
                     // load and display sub-layers
                    if( ! subLayers_cache[n] ){
                        
                            var subLayers = new L.GeoJSON.AJAX(
                                'data/contours/departements/'+feature.properties.NUMERO+'/'+(dep_subview.substring(0,8)=='communes' ? 'communes' : 'circonsc')+'.geojson',
                                {
                                    onEachFeature: (dep_subview.substring(0,8)=='communes' ? onEachFeatureCom : onEachFeatureCirco)
                                }
                            ).addTo(map);
                        printDebug("ajout cache n:"+n,true);
                        subLayers_cache[n] = subLayers;
                    }else{
                        subLayers_cache[n].addTo(map);printDebug("utilisation cache n:"+n,true);
                    } 
        }else
        {
                     // load and display sub-layers
                    if( ! subLayers_cache[n] ){
                        var subLayers = new L.GeoJSON.AJAX(
                            'data/contours/departements/'+feature.properties.NUMERO+'/'+dep_subview.substring(0,8)+'.geojson',
                            {
                                onEachFeature: onEachFeatureIris
                            }
                        ).addTo(map);
                        printDebug("ajout cache n:"+n,true);
                        subLayers_cache[n] = subLayers;
                    }else{
                        subLayers_cache[n].addTo(map);printDebug("utilisation cache n:"+n,true);
                    } 
        }
    }
    else if( type == 'com' && feature.properties.REF_INSEE == '33063' && dataResultatsDirectory!="insee")
    {
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
            printDebug("ajout cache n:"+n,true);
            subLayers_cache[n] = subLayers;
        }else{
            subLayers_cache[n].addTo(map);printDebug("utilisation cache n:"+n,true);
        }
        hideSelectSubview();
    }else
    {
        hideSelectSubview();
    }
    currentViewType = type;
    printDebug( 'after selectFeature() : currentRegLayer='+currentRegLayer+', currentDeptLayer='+currentDeptLayer+', currentCircoLayer='+currentCircoLayer+', currentComLayer='+currentComLayer+', currentViewType='+currentViewType+', currentIrisLayer='+currentIrisLayer+', dataResultatsDirectory='+dataResultatsDirectory+', dep_subview='+dep_subview, true);
}


/* affichage des infos relatives à la zone sélectionnée */
function displayInfos(feature, type){
    
    printDebug("displayInfo() : feature:"+feature+" type:"+type+" dataResultatsDirectory:"+dataResultatsDirectory, true);
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
    }else if( type == 'iris' ){
        $('#infos').append("<h2>"+feature.properties.NOM_IRIS +" ("+feature.properties.NOM_COM+")" + "</h2>");
        
        resultats_key = feature.properties.DEPCOM.slice(0, 2) +"/"+feature.properties.DCOMIRIS;
    }
    

    $.ajax({
        url: "data/resultats/"+dataResultatsDirectory+"/"+type+"/" + resultats_key + ".json",
        dataType: "json"
    })
    .done(function(data) 
    {
        //if( "success" == data.status ){
            if( type == 'circo' ){
                $('#infos').prepend("<h2>"+data.data.lib_dep + " " + data.data.lib_circo + "</h2>");
            }
            
            if( dataResultatsDirectory == 'opinion' )
            {
                        
                        /* niveau de participation */
                        var pie1Data = [];
                        var pie2Data = [];
                        
                        var resultats = data.data.opinions.participation;
                        resultats.sort(function(a,b){
                            var sortResult = 0;
                            sortResult = b.value - a.value;
                            return sortResult;
                        });
                        for ( var i in resultats ){
                            var res = resultats[i];

                            var label = labels[res.key];
                            var color = shadeColor2('#a3a3a3', shades[res.key]);
                                                    
                        pie1Data.push({value:res.value,color:color,highlight:color,label: label,key:'DEFAULT',pourcent:res.pourcent});

                        }
                        
                        resultats = data.data.opinions.soutien;
                        resultats.sort(function(a,b){
                            var sortResult = 0;
                            sortResult = b.value - a.value;
                            return sortResult;
                        });
                        for ( var i in resultats ){
                            var res = resultats[i];

                            var label = labels[res.key];
                            var color = colors[res.key];
                                                    
                        pie2Data.push({value:res.value,color:color,highlight:color,label: label,key:res.key,pourcent:res.pourcent});

                        }

                        $('#infos').append('<h3 class="resultats">Niveau de participation</h3>');
                        $('#infos').append('<div class="center"><canvas id="resultsPie1" width="280" height="150" /></div>');
                        $('#infos').append(buildDetailsBars(pie1Data, 'électeurs'));
                        
                        
                        // generate pie
                        var ctx1 = document.getElementById("resultsPie1").getContext("2d");
                        window.resultsPie = new Chart(ctx1).Pie(pie1Data, {
                            tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %> électeurs",
                            //segmentShowStroke : false, // default: true
                            segmentStrokeWidth : 1, // default: 2
                            animateRotate : false, // default: true
                            //animateScale : true // default: false
                        });
                        
                        $('#infos').append('<h3 class="resultats">Niveau de soutien</h3>');
                        $('#infos').append('<div class="center"><canvas id="resultsPie2" width="280" height="150" /></div>');
                        $('#infos').append(buildDetailsBars(pie2Data, 'électeurs'));
                        
                        // generate pie
                        var ctx2 = document.getElementById("resultsPie2").getContext("2d");
                        window.resultsPie = new Chart(ctx2).Pie(pie2Data, {
                            tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %> électeurs",
                            //segmentShowStroke : false, // default: true
                            segmentStrokeWidth : 1, // default: 2
                            animateRotate : false, // default: true
                            //animateScale : true // default: false
                        });                
            }else if (dataResultatsDirectory == 'insee' )
            {
                        if( data.data[0])
                        {
                                //var res = data.data[0].NbFamilles;

                                var res=Math.round((parseInt(data.data[0].NbFamilles)/parseInt(data.data[0].NbMenages))*100);
                            printDebug('ajax call done() : res = ' + res, true);
                            $('#infos').append('<h3 class="participation">Participation</h3>');
                            $('#infos').append('<div class="participation"><i class="fa fa-circle color-DEFAULT"></i> Taux de familles sur '+data.data[0].NbMenages+' ménages<div class="bar"><span class="pourcent-fill pourcent-'+res+' bgcolor-DEFAULT"></span></div><span class="pourcent-value">'+res+' %</span></div>');
                            $('#infos').append('<h3 class="resultats">Résultats</h3>');
                            $('#infos').append('<div class="center"><canvas id="resultsPie" width="280" height="150" /></div>');


                            
                                //var res = data.data[0].NbFamilles;
                                //var res=(parseInt(data.data[0].NbFamilles)/parseInt(data.data[0].NbMenages))*100;
                                 /*
                                resultats.sort(function(a,b){
                                    var sortResult = 0;
                                    sortResult = b.voix - a.voix;
                                    return sortResult;
                                });
                                 */
                                var pieData = [];
                                var pieLegend = '<ul class="legend">';
                                //var resultDetail = '<ul class="detail">';

                                var label = "label!";
                                    
                                //pieData.push({value:res.voix,color:colors[res.code_nuance],highlight:colors[res.code_nuance],label: label,key:res.code_nuance,pourcent:res.pourcent_voix_exp});
                                pieData.push({value:res,color:colors["BC-UD"],highlight:colors["BC-UD"],label: label,key:res,pourcent:res});
                                }

                                $('#infos').append(buildDetailsBars(pieData, 'votes'));        
                                
                                // generate pie
                                var ctx = document.getElementById("resultsPie").getContext("2d");
                                window.resultsPie = new Chart(ctx).Pie(pieData, {
                                    tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %> voix",
                                    //segmentShowStroke : false, // default: true
                                    segmentStrokeWidth : 1, // default: 2
                                    animateRotate : false, // default: true
                                    //animateScale : true // default: false
                                });
                            
                            
                        }else
                        {
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
                                //var resultDetail = '<ul class="detail">';

                                for ( var i in resultats ){
                                    var res = resultats[i];

                                    var label = labels[res.code_nuance];
                                    if (dataResultatsDirectory == 'pres_2012_t1'
                                              || dataResultatsDirectory == 'pres_2012_t2'){
                                         label = res.nom + ' ' + res.prenom;
                                    }
                                    pieData.push({value:res.voix,color:colors[res.code_nuance],highlight:colors[res.code_nuance],label: label,key:res.code_nuance,pourcent:res.pourcent_voix_exp});

                                }

                                $('#infos').append(buildDetailsBars(pieData, 'votes'));        
                                
                                // generate pie
                                var ctx = document.getElementById("resultsPie").getContext("2d");
                                window.resultsPie = new Chart(ctx).Pie(pieData, {
                                    tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %> voix",
                                    //segmentShowStroke : false, // default: true
                                    segmentStrokeWidth : 1, // default: 2
                                    animateRotate : false, // default: true
                                    //animateScale : true // default: false
                                });
                            
                            }
                        }
        //}else{
        //  $('#infos').html("<p>Erreur lors du chargement des données</p>");
        //}
            
    })
    .fail(function() {
        $('#infos').html('<p>Données non disponibles</p>');
    })
}

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
        
    printDebug('ajax call(reg)...', true);
    
    if( dataResultatsDirectory != 'insee' )
    {
        $.ajax({
            url: "data/resultats/"+dataResultatsDirectory+"/reg2015/" + feature.properties.NUMERO + ".json",
            dataType: "json"
        })
        .done(function(data) {
            printDebug('ajax call(reg)... done. status : ' + data.status, true);
            if( "success" == data.status ){
                printDebug('success : opinions ?  ' + data.data.opinions, true);

                if( data.data.resultats ){
                    var resultats = data.data.resultats;
                    resultats.sort(function(a,b){
                        return b.voix - a.voix;
                    });
                    var res = resultats[0];
                    layer.bgcolor = colors[res.code_nuance];
                    layer.setStyle({fillColor:layer.bgcolor});
                    layer.quorums_type = 'reg2015';
                }else if(data.data.opinions) {
                    var participation = data.data.opinions.participation;
                    participation.sort(function(a,b){
                        return b.value - a.value;
                    });

                    var shade = shades[participation[0].key];

                    var soutien = data.data.opinions.soutien;
                    soutien.sort(function(a,b){
                        return b.value - a.value;
                    });

                    layer.quorums_type = 'reg2015';

                    layer.bgcolor = shadeColor2(colors[soutien[0].key], shade);
                    layer.setStyle({fillColor:layer.bgcolor});
                    //alert('bgcolor is ' + layer.bgcolor);
                }

            }else{
                alert('unexpected status' + data.status);
            }
        });
    }else{
        layer.bgcolor = '#f9ffb3';
        layer.setStyle({fillColor:layer.bgcolor});
        layer.quorums_type = 'reg2015';
    }
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
    
    if( dataResultatsDirectory != 'insee' ){
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
                }else if(data.data.opinions) {
                    var participation = data.data.opinions.participation;
                    participation.sort(function(a,b){
                        return b.value - a.value;
                    });

                    var shade = shades[participation[0].key];

                    var soutien = data.data.opinions.soutien;
                    soutien.sort(function(a,b){
                        return b.value - a.value;
                    });

                    layer.quorums_type = 'dep';

                    layer.bgcolor = shadeColor2(colors[soutien[0].key], shade);
                    layer.setStyle({fillColor:layer.bgcolor});
                    //alert('bgcolor is ' + layer.bgcolor);
                }
            }
        });
    }else{
        layer.bgcolor = '#ffff00';
        layer.setStyle({fillColor:layer.bgcolor});
        layer.quorums_type = 'dep';
    }

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

//printDebug("enter oneachfeaturecom->dataResultatsDirectory:"+dataResultatsDirectory);
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


  if (dataResultatsDirectory!="insee")
    {
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
}else 
{ // sinon résultats de type INSEE
    // selection des datas selon le radio bouton INSEE sélectionné
    //printDebug("dep_subview==pauvrete"+type,true);
    //printDebug(dep_subview);
            if (dep_subview=="communes_pauvrete")
                {
                    $.ajax({
                            url: "data/resultats/"+dataResultatsDirectory+"/txpauvrete/" + feature.properties.REF_INSEE.slice(0, 2) + "/" + feature.properties.REF_INSEE+ ".json",
                            dataType: "json"
                        })
                        .done(function(data) {
                                if( data.data[0].CODGEO){

                                        if (data.data[0].TxPauvrete)
                                            {
                                                var resul=data.data[0].TxPauvrete;
                                                if (parseInt(resul)>=10)
                                                {layer.bgcolor = '#15702e';}
                                                else{layer.bgcolor = '#77c6a4';}
                                            }else{
                                                layer.bgcolor = '#f2f1f0';
                                            }
                                        layer.setStyle({fillColor:layer.bgcolor});
                                        layer.quorums_type = 'com';
                                        return resul;
                                        }
                        });
           } else
           {
                $.ajax({
                            url: "data/resultats/"+dataResultatsDirectory+"/txchomage/" + feature.properties.REF_INSEE.slice(0, 2) + "/" + feature.properties.REF_INSEE+ ".json",
                            dataType: "json"
                        })
                        .done(function(data) {
                                if( data.data[0].CODGEO){
                                        if (data.data[0].TxChomage)
                                            {
                                                var resul=data.data[0].TxChomage;
                                                if (parseInt(resul)>=10)
                                                {layer.bgcolor = '#60bc7a';}
                                                else{layer.bgcolor = '#aff2d5';}
                                            }else{
                                                layer.bgcolor = '#f2f1f0';
                                            }
                                        layer.setStyle({fillColor:layer.bgcolor});
                                        layer.quorums_type = 'com';
                                        return resul;
                                        }
                        });
           }
}   
}

/* ---------------------------------- onEachFeatureIris ----------------------------------*/
function onEachFeatureIris(feature, layer) {

    layer.setStyle(defaultStyle);
    layer.on('mouseover', function(e){
        displayPopup(e, 'Iris : '+ feature.properties.NOM_IRIS +" ("+feature.properties.NOM_COM+")" );
        highlightFeature(e);
    });
    layer.on('mouseout', function(e){
        hidePopup(e);
        resetHighlightOnFeature(e);
    });
    layer.off('click');
    layer.on('click', function(e){
        selectFeature(e, feature, layer, 'iris');
    });
                    
            $.ajax({
                //url: "data/resultats/INSEE/"+ feature.properties.COD_COM.slice(0, 2) +"/IRIS_CUB_chomeurs.json",
                url: "data/resultats/insee/iris/"+ feature.properties.DEPCOM.slice(0, 2) +"/"+feature.properties.DCOMIRIS+".json",
                dataType: "json"
            })
            .done(function(data) 
            {
                    if(data.data){
                        var resul=(parseInt(data.data[0].NbFamilles)/parseInt(data.data[0].NbMenages))*100;
                        printDebug("@"+resul, true);
                        if (parseInt(resul)>=90)
                            {layer.bgcolor = '#17734b';}
                        else if (parseInt(resul)>=80)
                            {layer.bgcolor = '#1a8053';}
                        else if (parseInt(resul)>=75)
                            {layer.bgcolor = '#1d8c5c';}
                        else if (parseInt(resul)>=70)
                            {layer.bgcolor = '#1f9964';}
                        else if (parseInt(resul)>=65)
                            {layer.bgcolor = '#22a66c';}
                        else if (parseInt(resul)>=60)
                            {layer.bgcolor = '#24b375';}
                        else if (parseInt(resul)>=55)
                            {layer.bgcolor = '#27bf7d';}
                        else if (parseInt(resul)>=45)
                            {layer.bgcolor = '#2acc86';}
                        else if (parseInt(resul)>=35)
                            {layer.bgcolor = '#2cd98e';}
                        else if (parseInt(resul)>=25)
                            {layer.bgcolor = '#2fe696';}
                        else{layer.bgcolor = '#31f29f';}

                        layer.setStyle({fillColor:layer.bgcolor});
                        layer.quorums_type = 'iris';
                        return resul;

                        }else{
                            layer.bgcolor = '#f2f1f0';
                            layer.setStyle({fillColor:layer.bgcolor});
                            layer.quorums_type = 'iris';
                        }
            });
            layer.bgcolor = '#f2f1f0';
            layer.setStyle({fillColor:layer.bgcolor});
            layer.quorums_type = 'iris';
 }

/* Bureaux de votes */
// tester contour blanc + grossissement et halo blanc
var bvMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#fff",
    weight: 1,
    opacity: .8,
    fillOpacity: 0.8,
    className: ''
};
var bvMarkerHighlightOptions = {
    radius: 16,
    weight: 4,
    opacity: .8,
    className: ''
}
var bvMarkerSelectedOptions = {
    className: 'active'
}

function pointToLayerBV(feature, latlng) {
    return L.circleMarker(latlng, bvMarkerOptions);
}
function onEachFeatureBV(feature, layer) {
    layer.on('mouseover', function(e){
        displayPopup(e, feature.properties.lib_commune + ', bureau ' + feature.properties.code_bv);
        //highlightFeature(e);
        layer.setStyle(bvMarkerHighlightOptions);
    });
    layer.on('mouseout', function(e){
        hidePopup(e);
        //resetHighlightOnFeature(e);
        if( layer.options.className != 'active' ){
            layer.setStyle(bvMarkerOptions);
            layer.setStyle({fillColor:layer.bgcolor});
        }
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
        layer.setStyle(bvMarkerHighlightOptions);
        layer.setStyle(bvMarkerSelectedOptions);
        // désactivation des autres zones
        map.eachLayer(function(otherLayer){
            if( otherLayer.feature && otherLayer != layer &&  otherLayer.quorums_type == 'bv'){
                otherLayer.setStyle(bvMarkerOptions);
              otherLayer.setStyle({fillColor:otherLayer.bgcolor});
            }
        });
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
    var current_time = new Date(); 
    if( debug ){
        if( append ){
            $('#debug').prepend( current_time.toJSON() + ' : ' + message+'<br/>');
        }else{
            $('#debug').html( current_time.toJSON() + ' : ' + message+'<br/>');
        }
    }
}   

if( debug ){
  $('body').append('<div id="debug"></div>');
}


function buildDetailsBars(datas, unity){
    var res = '';
    if( datas && datas.length > 0 ){
        res += '<ul class="detail">';
        for( var i in datas){
            var data = datas[i];
            res += '<li><i class="fa fa-circle color-'+data.key+'"></i> '+data.label+'<span class="votes">'+data.value+' '+unity+'</span><div class="bar"><span class="pourcent-fill pourcent-'+parseInt('0'+data.pourcent)+' bgcolor-'+data.key+'"></span></div><span class="pourcent-value">'+(data.pourcent<1?'0':'')+data.pourcent+' %</span></li>';
        }
        res += '</ul>';
    }
    return res;
}

return {
    createMap: function() {
        printDebug('init : currentRegLayer='+currentRegLayer+', currentDeptLayer='+currentDeptLayer+', currentCircoLayer='+currentCircoLayer+', currentComLayer='+currentComLayer+', currentViewType='+currentViewType+', currentIrisLayer='+currentIrisLayer+', dataResultatsDirectory='+dataResultatsDirectory+', dep_subview='+dep_subview, true);
        /* creation de la carte */
        listen();
        listen_switch();
        map = L.map('map', {zoomControl: false}).setView([46.49839, 2.76855]);

        map.addControl( L.control.zoom({position: 'topright'}) )

        /* zoom auto en fonction de la taille de la zone */
        southWest = L.latLng(40.36329, -5.00977);
        northEast = L.latLng(51.49506, 10.06348);
        bounds = L.latLngBounds(southWest, northEast);
        map.fitBounds(bounds);

        /* affichage fond osm */
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors | &copy; <a href="http://www.quorumapps.com">Quorum</a>'
        }).addTo(map);

        /* reset des styles et zoom par défaut si on clique hors de la carte */
        map.on('click', function(){
            $("#select-data ul").hide();
            resetAllLayerState();
        });


        /* Régions */
        regionsLayer = new L.GeoJSON.AJAX(
            "data/contours/france-metropolitaine/regions-2015.geojson",
            {
                onEachFeature: onEachFeatureReg
            }
        ).addTo(map);
    }
}
// contour blanc sur zone taux de cuverture deja visitée + attention à la légende, rajouter fond gris
// bilan d'opinion : couleur de base = ne sait pas, + foncé va voter, + clair, ne va pas voter
// bv selectioné: grossissement supplémentaire par rapport au survol + reduire l'opacité des autres pour la mise en évidence
// si bv selectionné, clic ailleurs doit déselectionner le bv, pas de retour vue dep
// si aucun bv selectionné, et clic dans la zone, aucune action
// pourcentage : gras + virgule à la place du point
// camembert : enlever les separations blanches, voir pour le survol et l'effet (cf. psd) au pire, mettre la bordure blanche.
})($, L);