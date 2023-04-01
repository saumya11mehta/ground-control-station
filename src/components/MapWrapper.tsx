// react
import React, { useState, useEffect, useRef, useCallback } from 'react';

// openlayers
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import OSM,{ ATTRIBUTION } from 'ol/source/OSM'
import { transform } from 'ol/proj'
import { Coordinate } from 'ol/coordinate';
import Geometry from 'ol/geom/Geometry';
import { takeOffPlanAtom , waypointPlanAtom , routesAtom, stylesAtom, featuresAtom} from "../atoms/atoms";
import { useAtom, useAtomValue } from 'jotai';

function MapWrapper() {

  // set intial state
  const [ map, setMap ] = useState<Map>()
  const [center, setCenter] = useState([-8836997.589082308,5412152.494365218]);
  const [ featuresLayer, setFeaturesLayer ] = useState<VectorLayer<VectorSource<Geometry>>>()
  const [ selectedCoord , setSelectedCoord ] = useState<Coordinate>()
  const takeOffPlan = useAtomValue(takeOffPlanAtom);
  const waypointPlan = useAtomValue(waypointPlanAtom);
  const [routes, setRoutes] = useAtom(routesAtom);
  const features = useAtomValue(featuresAtom);
  const styles = useAtomValue(stylesAtom);

  // pull refs
  const mapElement = useRef<HTMLDivElement>()
  
  // create state ref that can be accessed in OpenLayers onclick callback function
  const mapRef = useRef<Map>()
  mapRef.current = map

  //add to route data 
  const  addRouteElement = useCallback((data:{id: string, routeType: string, coordinate: Coordinate}) => {
      setRoutes((prevRoutes) => [...prevRoutes, data]);    
  },[setRoutes]);


  //add to take off data to routes
  const  addTakeOffData = useCallback((coordinate: Coordinate ) => {
    let routeData = {
      id: 'T',
      routeType: 'takeoff',
      coordinate: coordinate,
    };
    addRouteElement(routeData);
  },[addRouteElement]);

  //add to waypoint data to routes
  const  addWaypointData = useCallback((coordinate: Coordinate ) => {
    const existingWaypoints = routes.filter((data) => data.routeType === "waypoint");

    let newId;
    if (existingWaypoints.length > 0) {
      const lastWaypoint = existingWaypoints[existingWaypoints.length - 1];
      newId =  parseInt(lastWaypoint.id as string, 10) + 1;
    } else {
      newId = "1";
    }
    let routeData = {
      id: newId.toString(),
      routeType: "waypoint",
      coordinate: coordinate,
    };
    if(routeData.id !== "0"){
      addRouteElement(routeData);
    }
  },[addRouteElement, routes]);

  const hasTakeoffRoute = useCallback(() => {
    return routes.some(obj => obj.routeType === 'takeoff');
  },[routes]);

  const hasWaypointId = useCallback((id: string ) => {
    return routes.some(obj => obj.id === id);
  },[routes]);

  // map click handler
  const handleMapClick = useCallback((event : any) => {
    // get clicked coordinate using mapRef to access current React state inside OpenLayers callback
    //  https://stackoverflow.com/a/60643670
    const clickedCoord = mapRef.current?.getCoordinateFromPixel(event.pixel);

    // transform coord to EPSG 4326 standard Lat Long
    const transformedCoord = transform(clickedCoord!, 'EPSG:3857', 'EPSG:4326')

    // set React state
    setSelectedCoord( transformedCoord )

    if (takeOffPlan) {
      if(!hasTakeoffRoute()){
        addTakeOffData(clickedCoord!)
      }
    } else if (waypointPlan) {
      if(!hasTakeoffRoute()){
        addTakeOffData(clickedCoord!);
      }else{
        addWaypointData(clickedCoord!);
      }
    }
  }, [addTakeOffData, addWaypointData, hasTakeoffRoute, takeOffPlan, waypointPlan]);

  // initialize map on first render - logic formerly put into componentDidMount
  useEffect( () => {
    // create and add vector source layer
    let initalFeaturesLayer :any;
    
    let source =  new VectorSource()
    
    initalFeaturesLayer = new VectorLayer({
      source: source,
    })
    
    // create map
    const initialMap = new Map({
      target: mapElement.current,
      layers: [
        
        // USGS Topo
        new TileLayer({
          source: new OSM({
            attributions: [
                ATTRIBUTION,
                'Tiles courtesy of ' +
                '<a href="http://openstreetmap.org">' +
                'OpenStreetMap' +
                '</a>'
              ],
          })
        }),

        initalFeaturesLayer
        
      ],
      view: new View({
        projection: 'EPSG:3857',
        center: center,
        zoom: 12
      }),
      controls: []
    })
    
    // set map onclick handler
    initialMap.on('click', handleMapClick)

    // save map and vector layer references to state
    setMap(initialMap)
    setFeaturesLayer(initalFeaturesLayer)

    return () => {
      initialMap.setTarget(undefined);
      initialMap.un('click', handleMapClick);
    };
  },[center, features, handleMapClick, styles]);

  useEffect(() => {
    // Create the VectorLayer and add it to the map only once
    let featureLayer = new VectorLayer();
    let vectorSource = new VectorSource();
    featureLayer.setSource(vectorSource);

    // Define the style function as a callback function
    const getFeatureStyle = (feature : any) => {
      return styles[feature.get('type')];
    };
    featureLayer.setStyle(getFeatureStyle);

    if (map) {
      map.addLayer(featureLayer);
    }
    // Whenever you need to update the features, clear the existing features from the VectorSource and add the new features
    if (features.length > 0) {
      vectorSource.clear();
      vectorSource.addFeatures(features);
    }

    // Update the style function whenever the styles variable changes
    featureLayer.setStyle(getFeatureStyle);
  }, [features, map, styles]);

  // render component
  return (      
    <div ref={mapElement as React.RefObject<HTMLDivElement>} className="map-container w-full h-full"></div>
  ) 

}

export default MapWrapper;