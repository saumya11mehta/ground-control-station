import Head from 'next/head';
import MapWrapper  from '../../components/MapWrapper';
import MainPanel  from '../../components/MainPanel';
import FlyPanel  from '../../components/FlyPanel';
import { useCallback, useEffect, useState } from 'react';
import Feature from 'ol/Feature';
import { Geometry, Point } from 'ol/geom';
import Polyline from 'ol/format/Polyline';
import { routesAtom,featuresAtom,stylesAtom, polylineAtom } from "../../atoms/atoms";
import { useAtom, useAtomValue } from 'jotai';
import Style from 'ol/style/Style';
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Text from 'ol/style/Text';


export default function MapPage() {
    const routes = useAtomValue(routesAtom);
    const [features, setFeatures] = useAtom(featuresAtom);
    const [styles, setStyles] = useAtom(stylesAtom);
    const [polyline] = useAtom(polylineAtom);
    
    //add to feature data 
    const addFeatureElement= useCallback((data: Feature<Point>) => {
      setFeatures((prevFeatures)=>[...prevFeatures, data])
    },[setFeatures])

    const removePolylineFeatureElement = (feature: Feature<Geometry | Point>[])=>{
      return feature.filter(item => item.get("type") !== 'route');
    }

    //add to feature data 
    const addPolylineFeatureElement = useCallback((data: Feature<Geometry>) => {
      setFeatures((prevFeatures)=>{
        let prevFeat = removePolylineFeatureElement(prevFeatures)
        return [...prevFeat,data];
      })
    },[setFeatures])

    //add to style data 
    const addStyleElement = useCallback((data: {}) => {
      setStyles((prevStyles) => {
        // If prevStyles is not an array, initialize it as an empty array
        if (!Array.isArray(prevStyles)) {
          prevStyles = [prevStyles];
        }
        // Create a new object by reducing the array of styles
        const newStyles = prevStyles.reduce((acc, curr) => {
          // Get the key and value of the current style object
          Object.entries(curr).forEach((val) => {
            const [key, value] = val;
            // Add the style object to the accumulator object with the key as the property name
            acc[key] = value;
          });
          
          return acc;
        }, {});
        // Add the new style object to the accumulator object with the key as the property name
        Object.entries(data).forEach((val) => {
          const [key,value] = val;
          newStyles[key] = value;
        })
        return newStyles;
      });
    }, [setStyles]);

    useEffect(()=>{
        const path = new Polyline({
          factor: 1e6,
        }).readGeometry(polyline, {
          dataProjection: 'EPSG:3857',
          featureProjection: 'EPSG:3857',
        });

        const routeFeature = new Feature({
          type: 'route',
          geometry: path,
        });
        addPolylineFeatureElement(routeFeature) 
    },[addPolylineFeatureElement, polyline])


    useEffect( () => {    
      const data = routes[routes.length-1];
      if(data !== undefined){
        const style = { 
          ['icon_'+data.id]: new Style({
            image: new CircleStyle({
              radius: 10,
              fill: new Fill({color: 'black'}),
              stroke: new Stroke({
                color: 'white',
                width: 2,
              }),
            }),
            text: new Text({
              textAlign: "center",
              textBaseline: "middle",
              font: 'Normal 12px Arial',
              text: data.id,
              fill: new Fill({
                color: '#ffa500'
              }),
              stroke: new Stroke({
                color: '#000000',
                width: 3
              }),
              
            })
          }),
        };
        addStyleElement(style);
        const feature = new Feature({ 
          type: "icon_"+data.id,
          geometry: new Point(data.coordinate),
        });
        addFeatureElement(feature);
      }


  },[addFeatureElement, addStyleElement, routes]);

  return (
    <>
      <Head>
        <title>Ground Control Station - Map</title>
      </Head>
      <div className="flex flex-col h-screen">
        <MainPanel/>
        <FlyPanel/>
        <MapWrapper />
      </div>
    </>
  )
}