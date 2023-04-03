import { useEffect } from 'react';
import {FaRegPaperPlane} from 'react-icons/fa';
import { transform } from 'ol/proj'
import { Coordinate } from 'ol/coordinate';
import {FiUpload,FiPlusCircle} from 'react-icons/fi';
import {AiOutlineCloudDownload} from 'react-icons/ai';
import {flyAtom,takeOffPlanAtom,waypointPlanAtom, routesAtom, poiPlanAtom, poisAtom} from "../atoms/atoms";
import {useAtom} from 'jotai';

function FlyPanel(){
    const [fly,setFly] = useAtom(flyAtom);
    const [takeOffPlan,setTakeOffPlan] = useAtom(takeOffPlanAtom);
    const [waypointPlan,setWaypointPlan] = useAtom(waypointPlanAtom);
    const [poiPlan,setPoiPlan] = useAtom(poiPlanAtom);
    const [routes,setRoutes] = useAtom(routesAtom);
    const [pois,setPois] = useAtom(poisAtom);

    function navigateToMain() {
        setFly(true);
        setTakeOffPlan(false);
        setWaypointPlan(false);
    }
    function handleTakeOff() {
        setTakeOffPlan(true);
        setWaypointPlan(false);
    }
    function handleWaypoint(){
        setTakeOffPlan(false);
        setWaypointPlan(true);
    }
    function handlePOI(){
        setPoiPlan(true);
        setTakeOffPlan(false);
        setWaypointPlan(false);
    }
    function downloadCSV(data: any[], filename: string) {
        const header = [["Route Names","Route Type","Longitude","Latitude"].join(","),""].join("\n");
        const csvContent = "data:text/csv;charset=utf-8," + header
        + data.map(row => { 
            let rowData = Object.values(row)
            let coordinates : Coordinate = rowData[2] as number[];
            rowData[2] = transform(coordinates, 'EPSG:3857', 'EPSG:4326')
            return rowData.join(",")
        }).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }


    return(
        <>
            {
                !fly && <div className="absolute bg-black top-5 left-5 z-10 rounded-xl p-2">
                    <div className="flex flex-col gap-4">
                        <div className="text-white flex flex-col items-center justify-center text-center">
                            <button className="flex flex-col items-center justify-center text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-xs px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 w-20"  onClick={navigateToMain}>
                                <FaRegPaperPlane className="text-xl"/> Fly 
                            </button>
                        </div>
                        <div className="text-white flex flex-col items-center justify-center text-center">
                            <button className="flex flex-col items-center justify-center text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-xs px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 w-20" onClick={handleTakeOff}>
                                <FiUpload className="text-xl"/> TakeOff
                            </button>
                        </div>
                        <div className="text-white flex flex-col items-center justify-center text-center">
                            <button className="flex flex-col items-center justify-center text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-xs px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 w-20" onClick={handleWaypoint}>
                                <FiPlusCircle className="text-xl"/> Waypoint
                            </button>
                        </div>
                        <div className="text-white flex flex-col items-center justify-center text-center">
                            <button className="flex flex-col items-center justify-center text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-xs px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 w-20" onClick={handlePOI}>
                                <FiPlusCircle className="text-xl"/> POI
                            </button>
                        </div>
                        <div className="text-white flex flex-col items-center justify-center text-center">
                            <button className="flex flex-col items-center justify-center text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-xs px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 w-20" onClick={()=>{downloadCSV([...routes,...pois],"routes")}}>
                                <AiOutlineCloudDownload className="text-xl"/> Download Routes
                            </button>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default FlyPanel;