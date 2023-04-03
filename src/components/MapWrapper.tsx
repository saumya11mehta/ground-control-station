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
import { takeOffPlanAtom , waypointPlanAtom , routesAtom, stylesAtom, featuresAtom, poiPlanAtom, poisAtom} from "../atoms/atoms";
import { useAtom, useAtomValue } from 'jotai';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import Icon from 'ol/style/Icon';
import Style from 'ol/style/Style';

function MapWrapper() {

  // set intial state
  const [ map, setMap ] = useState<Map>()
  const [center, setCenter] = useState([-8836997.589082308,5412152.494365218]);
  const [ featuresLayer, setFeaturesLayer ] = useState<VectorLayer<VectorSource<Geometry>>>()
  const takeOffPlan = useAtomValue(takeOffPlanAtom);
  const waypointPlan = useAtomValue(waypointPlanAtom);
  const poiPlan = useAtomValue(poiPlanAtom);
  const [routes, setRoutes] = useAtom(routesAtom);
  const [pois, setPois] = useAtom(poisAtom);
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

  //add to poi data 
  const  addPoiElement = useCallback((data:{id: string, routeType: string, coordinate: Coordinate}) => {
    setPois((prevPois) => [...prevPois, data]);    
  },[setPois]);

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

  //add to poi data to pois
  const  addPoiData = useCallback((coordinate: Coordinate ) => {
    const existingPois = pois.filter((data) => data.routeType === "POI");

    let newId;
    if (existingPois.length > 0) {
      const lastWaypoint = existingPois[existingPois.length - 1];
      newId =  parseInt(lastWaypoint.id as string, 10) + 1;
    } else {
      newId = "1";
    }
    let routeData = {
      id: newId.toString(),
      routeType: 'POI',
      coordinate: coordinate,
    };
    addPoiElement(routeData);
  },[addPoiElement, pois]);

  const hasTakeoffRoute = useCallback(() => {
    return routes.some(obj => obj.routeType === 'takeoff');
  },[routes]);

  const hasWaypointId = useCallback((id: string ) => {
    return routes.some(obj => obj.id === id);
  },[routes]);

  // map click handler
  const handleMapClick = useCallback((event : any) => {
    // get clicked coordinate using mapRef to access current React state inside OpenLayers callback
    const clickedCoord = mapRef.current?.getCoordinateFromPixel(event.pixel);

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
    }else if (poiPlan){
      addPoiData(clickedCoord!);
    }
  }, [addPoiData, addTakeOffData, addWaypointData, hasTakeoffRoute, poiPlan, takeOffPlan, waypointPlan]);

  // initialize map on first render - logic formerly put into componentDidMount
  useEffect( () => {
    // create and add vector source layer
    let initialFeaturesLayer :any;
    
    let source =  new VectorSource({features:[
      new Feature({
        geometry: new Point([-8836997.589082308,5412152.494365218]),
        type:"drone"
      })]})
    
      initialFeaturesLayer = new VectorLayer({
        source: source,
        style: new Style({
          image: new Icon({
            src: '/drone/drone-image.png',
            scale: 0.10
          })
        })
      });
    
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

        initialFeaturesLayer
        
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
    setFeaturesLayer(initialFeaturesLayer)

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
      console.log(styles[feature.get('type')]);
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