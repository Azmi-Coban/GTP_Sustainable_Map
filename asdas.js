var map, datasource, popup;

function GetMap() {
  
           var layers = [
            new atlas.layer.PolygonLayer(datasource, null, {
                filter: ['any', ['==', ['geometry-type'], 'Polygon'], ['==', ['geometry-type'], 'MultiPolygon']]	//Only render Polygon or MultiPolygon in this layer.
            }),
            new atlas.layer.LineLayer(datasource, null, {
                strokeColor: 'white',
                strokeWidth: 2,
                filter: ['any', ['==', ['geometry-type'], 'Polygon'], ['==', ['geometry-type'], 'MultiPolygon']]	//Only render Polygon or MultiPolygon in this layer.
            }),
            new atlas.layer.LineLayer(datasource, null, {
                strokeColor: 'red',
                filter: ['any', ['==', ['geometry-type'], 'LineString'], ['==', ['geometry-type'], 'MultiLineString']]	//Only render LineString or MultiLineString in this layer.
            }),
            new atlas.layer.BubbleLayer(datasource, null, {
                filter: ['any', ['==', ['geometry-type'], 'Point'], ['==', ['geometry-type'], 'MultiPoint']] //Only render Point or MultiPoints in this layer.
            })
        ];

        map.layers.add(layers, 'labels');

        //Add a click event to the layers to show a popup of what the user clicked on.
        map.events.add('click', layers, featureClicked);
 }

function loadShapeFile(url) {
    popup.close();

    shp(url).then(function (data) {
        //Load the shapefile into the data source and overwrite any existing data. 
        datasource.setShapes(data);

        //Bring the data into view on the map.
        map.setCamera({
            bounds: atlas.data.BoundingBox.fromData(data),
            padding: 50
        });
    });
}

function featureClicked(e) {
    //Make sure the event occurred on a shape feature.
    if (e.shapes && e.shapes.length > 0) {
        //By default, show the popup where the mouse event occurred.
        var pos = e.position;
        var offset = [0, 0];
        var properties;

        if (e.shapes[0] instanceof atlas.Shape) {
            properties = e.shapes[0].getProperties();

            //If the shape is a point feature, show the popup at the points coordinate.
            if (e.shapes[0].getType() === 'Point') {
                pos = e.shapes[0].getCoordinates();
                offset = [0, -18];
            }
        } else {
            properties = e.shapes[0].properties;

            //If the shape is a point feature, show the popup at the points coordinate.
            if (e.shapes[0].type === 'Point') {
                pos = e.shapes[0].geometry.coordinates;
                offset = [0, -18];
            }
        }

        //Update the content and position of the popup.
        popup.setOptions({
            //Create a table from the properties in the feature.
            content: atlas.PopupTemplate.applyTemplate(properties),
            position: pos,
            pixelOffset: offset
        });

        //Open the popup.
        popup.open(map);
    }
}