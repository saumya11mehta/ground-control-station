import {FaRegPaperPlane} from 'react-icons/fa';
import {FiUpload,FiPlusCircle} from 'react-icons/fi';
import {flyAtom,takeOffPlanAtom,waypointPlanAtom} from "../atoms/atoms";
import {useAtom} from 'jotai';
import { useEffect } from 'react';

function FlyPanel(){
    const [fly,setFly] = useAtom(flyAtom);
    const [takeOffPlan,setTakeOffPlan] = useAtom(takeOffPlanAtom);
    const [waypointPlan,setWaypointPlan] = useAtom(waypointPlanAtom);

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
                    </div>
                </div>
            }
        </>
    )
}

export default FlyPanel;