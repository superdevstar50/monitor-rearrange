import { Coordinates } from "@dnd-kit/utilities";
import { IMonitorItem } from "../types";
import { getHeightAndWidth } from "./dimensions";
import { monitorOverlap } from "./overlap";


const detectNearbyMonitors = (selectedMonitor: IMonitorItem, listOfMonitors: IMonitorItem[]) => {
  const nearbyMonitors = {
    top: null as IMonitorItem | null,
    bottom: null as IMonitorItem | null,
    left: null as IMonitorItem | null,
    right: null as IMonitorItem | null,
  };

  for (const monitor of listOfMonitors) {
    if (monitor.connector !== selectedMonitor.connector) {
      const distanceX = Math.abs(monitor.x - selectedMonitor.x);
      const distanceY = Math.abs(monitor.y - selectedMonitor.y);

      // console.log({ distanceX, distanceY })

      //sample output
      // { distanceX: 449.4765625, distanceY: 115.27734375 }
      // { distanceX: 257.4765625, distanceY: 115.27734375 }
      // { distanceX: 65.4765625, distanceY: 115.27734375 }

      if (monitor.x < selectedMonitor.x) {
        if (!nearbyMonitors.left || distanceX < Math.abs(nearbyMonitors.left.x - selectedMonitor.x)) {
          nearbyMonitors.left = monitor;
        }
      } else if (monitor.x > selectedMonitor.x) {
        if (!nearbyMonitors.right || distanceX < Math.abs(nearbyMonitors.right.x - selectedMonitor.x)) {
          nearbyMonitors.right = monitor;
        }
      }

      if (monitor.y < selectedMonitor.y) {
        if (!nearbyMonitors.top || distanceY < Math.abs(nearbyMonitors.top.y - selectedMonitor.y)) {
          nearbyMonitors.top = monitor;
        }
      } else if (monitor.y > selectedMonitor.y) {
        if (!nearbyMonitors.bottom || distanceY < Math.abs(nearbyMonitors.bottom.y - selectedMonitor.y)) {
          nearbyMonitors.bottom = monitor;
        }
      }

    }
  }

  return nearbyMonitors;
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
  const selectedMonitorDimensions = getHeightAndWidth(selectedMonitor);
  const updatedX = selectedMonitor.x + coordinates.x;
  const updatedY = selectedMonitor.y + coordinates.y;

  selectedMonitor.x = updatedX;
  selectedMonitor.y = updatedY;

  // for (const monitor of monitors) {
  //   if (monitor.connector !== selectedMonitor.connector) {
  //     const overlap = monitorOverlap(selectedMonitor, monitor);
  //     if (overlap) {
  //       // console.log({ overlap, monitor })
  //     }
  //   }
  // }


  const nearbyMonitors = detectNearbyMonitors(selectedMonitor, monitors);

  // console.log({ nearbyMonitors, selectedMonitor, selectedMonitorDimensions })

  // Adjust the selected monitor's position if necessary
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


  return monitors
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