import { Coordinates } from "@dnd-kit/utilities";
import { IMonitorItem } from "../types";
import { getHeightAndWidth } from "./dimensions";

const getY = (monitors: IMonitorItem[], current: IMonitorItem) => {
  const { width : currentWidth } = getHeightAndWidth(current);
  let res = 0;
  for (const monitor of monitors){
    const { width, height } = getHeightAndWidth(monitor);
    if ((current.x <= monitor.x && current.x + currentWidth > monitor.x) ||
        (current.x < monitor.x + width && current.x + currentWidth >= monitor.x + width) ||
        (current.x > monitor.x && current.x + currentWidth < monitor.x + width)){
          if (res < monitor.y + height){
            res = monitor.y + height;
          }
        }
  }
  return res;
}

const getX = (monitors: IMonitorItem[], current: IMonitorItem, y: number) => {
  const { height : currentHeight } = getHeightAndWidth(current);
  let res = 0;
  for (const monitor of monitors){
    if (monitor.x > current.x) continue;
    const { width, height } = getHeightAndWidth(monitor);
    if ((y <= monitor.y && y + currentHeight > monitor.y) ||
        (y < monitor.y + height && y + currentHeight >= monitor.y + height) ||
        (y > monitor.y && y + currentHeight < monitor.y + height)){
          if (res < monitor.x + width){
            res = monitor.x + width;
          }
        }
  }
  return res;
}
/**
 * handle monitor positions
 *
 * @returns {IMonitorItem[]} return the monitors with new position
 */
export const rearrangeMonitors = ({
  selectedMonitor,
  monitors,
  coordinates,
}: {
  selectedMonitor: IMonitorItem;
  monitors: IMonitorItem[];
  coordinates: Coordinates;
}): IMonitorItem[] => {
  //console.log(coordinates, selectedMonitor, monitors);
  const originX = selectedMonitor.x;
  const originY = selectedMonitor.y;
  const updatedX = selectedMonitor.x + coordinates.x;
  const updatedY = selectedMonitor.y + coordinates.y;

  const {width: selectedWidth, height: selectedHeight} = getHeightAndWidth(selectedMonitor);

  selectedMonitor.x = updatedX;
  selectedMonitor.y = updatedY;

  const updatedmonitors: IMonitorItem[] = [];
  const othermonitors: IMonitorItem[] = [];

  for (const monitor of monitors) {
    if (monitor.connector !== selectedMonitor.connector && (monitor.x < originX + selectedWidth&& monitor.y < originY + selectedHeight))
      updatedmonitors.push(monitor);
    else if (monitor.connector !== selectedMonitor.connector){
      othermonitors.push(monitor);
    }
  }

  othermonitors.push(selectedMonitor);

  othermonitors.sort((a, b) => a.y - b.y);


  for (const monitor of othermonitors) {
    const newMonitor = {...monitor};

    const y = getY(updatedmonitors, newMonitor);
    const x = getX(updatedmonitors, newMonitor, y);

    updatedmonitors.push({...newMonitor, x, y});
  }

  return updatedmonitors
};

// // Adjust the selected monitor's position if necessary
// if (nearbyMonitors.right) {
//   // Adjust the X position of the selected monitor
//   selectedMonitor.x = nearbyMonitors.right.x - selectedMonitorDimensions.width;
// } else if (nearbyMonitors.left) {
//   selectedMonitor.x = nearbyMonitors.left.x + getHeightAndWidth(nearbyMonitors.left).width;
// }

// if (nearbyMonitors.bottom) {
//   // Adjust the Y position of the selected monitor
//   selectedMonitor.y = nearbyMonitors.bottom.y - selectedMonitorDimensions.height;
// } else if (nearbyMonitors.top) {
//   selectedMonitor.y = nearbyMonitors.top.y + getHeightAndWidth(nearbyMonitors.top).height;
// }

// // Return the updated monitors array
// return monitors.map((m) =>
//   m.connector === selectedMonitor.connector ? selectedMonitor : m
// );

// Return the updated monitors array


// // Check for collision with other monitors
// const collidingMonitor = monitors.find((m) =>
//   monitorOverlap(
//     {
//       ...monitor,
//       x: finalCoordinates.x,
//       y: finalCoordinates.y,
//     },
//     m
//   )
// );

// console.log(collidingMonitor)
// if (collidingMonitor) {
//   // Swap positions with the colliding monitor
//   const updatedMonitors = monitors.map((m) => {
//     if (m.productName === monitor.productName) {
//       return {
//         ...m,
//         x: collidingMonitor.x,
//         y: collidingMonitor.y,
//       };
//     } else if (m.productName === collidingMonitor.productName) {
//       return {
//         ...m,
//         x: monitor.x,
//         y: monitor.y,
//       };
//     }
//     return m;
//   });

//   const snappedMonitors = updatedMonitors.map(snapMonitorToGrid);
//   // const snappedMonitors = updatedMonitors.map((monitor) => snapMonitorToGrid(monitor, updatedMonitors));

//   return snappedMonitors;
// } else {
//   const updatedMonitors = monitors.map((m) => {
//     if (m.productName === monitor.productName) {
//       return {
//         ...m,
//         x: finalCoordinates.x,
//         y: finalCoordinates.y,
//       };
//     }
//     return m;
//   });

//   // const snappedMonitors = updatedMonitors.map((monitor) => snapMonitorToGrid(monitor, updatedMonitors));
//   const snappedMonitors = updatedMonitors.map(snapMonitorToGrid);
//   return snappedMonitors;
// }