  var pointLocation_store = require('../../../../models/pointLocation_store.js'),
  _ = require('lodash'),
  upsert = function (arr, key, newval) {
    var match = _.find(arr, key);
    if(match){
        var index = _.findIndex(arr, key);
        arr.splice(index, 1, newval);
    } else if (arr) {
        arr.push(newval);
    }
};

module.exports = {
  props: {
    territory: {
      type: Object,
      required: true,
      twoWay: true
    },
    id: {
      type: Number,
      required: true
    }
  },
  data: function() {
    return {
      focus: false,
      url: this.$root.path("territories:list"),
      pointLocation: {},
      carto:Object,
      myIcon:Object,
      polygone:Object,
      circle:Object,
      poly:Object,
      geojsonMarkerOptions:Object,
      lat:51,
      lon:0
    }
  },
  ready:function(){
    this.carto=L.map('carte').setView([51.508, -0.11], 12);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(this.carto);
    /*
    this.myIcon = L.icon({
      iconUrl: 'https://image.freepik.com/icones-gratuites/carte-de-localisation_318-28579.png',
      iconSize: [38, 95],
      iconAnchor: [22, 94],
      popupAnchor: [-3, -76],
    });
    */
    this.geojsonMarkerOptions = {
        radius: 3,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
  this.poly = this.territory.polygon;
  
/*
    L.circleMarker([this.poly[0].longitude, this.poly[0].latitude], this.geojsonMarkerOptions).addTo(this.carto);
    L.circleMarker([this.poly[1].longitude, this.poly[1].latitude], this.geojsonMarkerOptions).addTo(this.carto);
    L.circleMarker([this.poly[2].longitude, this.poly[2].latitude], this.geojsonMarkerOptions).addTo(this.carto);    
    
    this.circle = L.circle([51.508, -0.11], 5000, {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5
    }).addTo(this.carto);

    this.polygone=L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(this.carto);
*/
    this.polygone = L.polygon([
    [parseFloat(this.poly[0].longitude), parseFloat(this.poly[0].latitude)],
    [parseFloat(this.poly[1].longitude), parseFloat(this.poly[1].latitude)],
    [parseFloat(this.poly[2].longitude), parseFloat(this.poly[2].latitude)]
]).addTo(this.carto);

  },

  created: function() {
    console.log("created: function - details-polygon")
    this.$dispatch("details:created");
  },
  template: require('./template.jade')(),
  methods: {
    deletePointLocation: function(e) {
      e.preventDefault();
      var remove = function (arr, key) {
        var match = _.find(arr, key);
        if (match) {
          var index = _.findIndex(arr, key);
          arr.splice(index, 1);
        }
      };
      pointLocation_store.delete(this.$root, this.territory.id, this.pointLocation.id, () => {
        remove(this.territory.polygon, {id: this.pointLocation.id});
        this.$root.$emit("territories:hidePointLocation", this.id);
        this.$root.navigate('territories:showPolygon', undefined, this.id);
      });
    },
    showPointLocation: function(e, pointLocation) {
      e.preventDefault();
      this.$root.navigate('territories:showPointLocation', e, this.id, pointLocation.id);
    },
    updateNote: function(e) {
      e.preventDefault();
      note_store.update(this.$root, this.contact.id,  this.note, (res) => {
        upsert(this.contact.notes, {id: this.note.id}, this.note);
      });
    },
    prevFunc: function(e) {
      e.preventDefault();
      this.$dispatch("territories:hidePointLocation", this.id);
      this.$root.navigate('territories:showPolygon', undefined, this.id);
    }
  },
  events: {
    'territories:showPointLocation': function(id, pointLocationID) {
      this.$set("focus", false);
      this.$set("pointLocation", _.cloneDeep(_.find(this.territory.polygon, {id: pointLocationID})));
      this.$dispatch("tabs:hide");
      this.$dispatch('header:title', "PointLocation");
      this.$dispatch('header:hideAdd');
      this.id = id;
    },
    'territories:hidePointLocation': function(id) {
      this.$set("focus", false);
      this.$dispatch("tabs:show");
      this.$dispatch('tabs:nb', this.territory.polygon ? this.territory.polygon.length : 0);
      this.$dispatch('header:title', `${this.territory.name} ${this.territory.id}`);
    }
  }
};
