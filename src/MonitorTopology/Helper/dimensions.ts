import { IMonitorItem } from "../types";

import {state} from './utils';

export const getHeightAndWidth = (monitor: IMonitorItem) => {
  const [width, height] = monitor.currentMode.split("@")[0].split("x").map(Number);
  if (monitor.orientation === "portrait") {
    return { width: height * state.scale, height: width * state.scale };
  } else {
    return { width: width * state.scale, height: height * state.scale };
  }
};

/**
 *
 */
export const getContainerHeightAndWidth = (monitors: IMonitorItem[]) => {
  let containerHeight = 0;
  let containerWidth = 0;

  monitors.forEach((monitor) => {
    const { width, height } = getHeightAndWidth(monitor);
    containerHeight = containerHeight + height;
    containerWidth = containerWidth + width;
  });
  return { containerHeight, containerWidth };
};


// /**
//  * get Height And Width
//  *
//  * @returns {{ width: number, height: number }} dimensions of the monitor
//  */
// export const getHeightAndWidth = (monitor: IMonitorItem) => {
//   const [width, height] = monitor.currentMode
//     .split("@")[0]
//     .split("x")
//     .map(Number);
//   return { width: width * SCALE_FACTOR, height: height * SCALE_FACTOR };
// };