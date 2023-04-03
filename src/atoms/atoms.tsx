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
export const stylesAtom = atom<any[]>([]);
export const polylineAtom = atom((get)=>get(routesAtom).map(item => item.coordinate));

