import type { Transform } from "@dnd-kit/utilities";
import { IMonitorItem } from "../types";
import { getHeightAndWidth } from "./dimensions";


export const restrictToOverlapOtherRects = ({
  transform,
  selectedMonitor,
  monitors
}: {
  transform: Transform;
  selectedMonitor: IMonitorItem;
  monitors: IMonitorItem[];
}): Transform => {
  const finalCoordinates = {
    x: selectedMonitor.x + transform.x,
    y: selectedMonitor.y + transform.y
  };
  const adjustedTransform = { ...transform, x: transform.x, y: transform.y };
  let isOverlappingX, isOverlappingY;

  // Determine if the selected monitor is overlapping with any other monitor
  const isOverlapping = monitors.some((m) => {
    if (m.connector !== selectedMonitor.connector) {
      const mDimensions = getHeightAndWidth(m);
      const selectedMonitorDimensions = getHeightAndWidth(selectedMonitor);

      // Expand the bounding box of the other monitor by the dimensions of the selected monitor
      const expandedBoundingBox = {
        top: m.y,
        bottom: m.y + mDimensions.height,
        left: m.x,
        right: m.x + mDimensions.width
      };
      // Check for overlap along the X-axis
      isOverlappingX =
        finalCoordinates.x + selectedMonitorDimensions.width > expandedBoundingBox.left &&
        finalCoordinates.x < expandedBoundingBox.right;
      // Check for overlap along the Y-axis
      isOverlappingY =
        finalCoordinates.y + selectedMonitorDimensions.height > expandedBoundingBox.top &&
        finalCoordinates.y < expandedBoundingBox.bottom;

      console.log(isOverlappingX, isOverlappingY)
      return isOverlappingX && isOverlappingY;
    }

    return false;
  });

  if (isOverlapping) {

    if (isOverlappingX) {
      adjustedTransform.x = 0;
    } else if (isOverlappingY) {
      adjustedTransform.y = 0;
    }

    return adjustedTransform;
  }

  return transform;
};