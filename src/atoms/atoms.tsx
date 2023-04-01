import { atom } from "jotai";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";

export const flyAtom = atom(true);
export const takeOffPlanAtom = atom(false);
export const waypointPlanAtom = atom(false);
export const takeOffCoordinate = atom<any>(null);
export const landingCoordinate = atom<any>(null);
export const routesAtom = atom<any[]>([]);
export const featuresAtom = atom<any[]>([]);
export const stylesAtom = atom<any[]>([{
    'route': new Style({
      stroke: new Stroke({
        width: 6,
        color: [237, 212, 0, 0.8],
      }),
    })}]);
export const polylineAtom = atom((get)=>get(routesAtom).map(item => item.coordinate));

