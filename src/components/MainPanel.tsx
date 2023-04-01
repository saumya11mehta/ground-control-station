import {FaMapMarkerAlt} from 'react-icons/fa';
import {FiUpload,FiDownload} from 'react-icons/fi';
import {flyAtom} from "../atoms/atoms";
import { useAtom } from 'jotai';

function MainPanel(){
    const [fly,setFly] = useAtom(flyAtom)

    function navigateToPlan() {
        setFly(false);
    }

    return(
        <>
            {
                fly && <div className="absolute bg-black top-5 left-5 z-10 rounded-xl p-2">
                    <div className="flex flex-col gap-4">
                        <div className="text-white flex flex-col items-center justify-center text-center">
                            <button className="flex flex-col items-center justify-center text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-xs px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 w-20" onClick={navigateToPlan}>
                                <FaMapMarkerAlt className="text-xl"/> Plan 
                            </button>
                        </div>
                        <div className="text-white flex flex-col items-center justify-center text-center">
                            <button className="flex flex-col items-center justify-center text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-xs px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 w-20">
                                <FiUpload className="text-xl"/> TakeOff
                            </button>
                        </div>
                        <div className="text-white flex flex-col items-center justify-center text-center">
                            <button className="flex flex-col items-center justify-center text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-xs px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 w-20">
                                <FiDownload className="text-xl"/> Return
                            </button>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}

export default MainPanel;