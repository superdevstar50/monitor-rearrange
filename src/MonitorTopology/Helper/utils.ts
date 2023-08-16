import { IMonitorItem } from "../types";
import { getHeightAndWidth } from "./dimensions";

export const state = {
    scale: 0.1
}

export const isOverLapping = (monitors:IMonitorItem[], finalCoordinates: {x:number, y:number}, selectedMonitor: IMonitorItem) => {

  return monitors.some((m) => {
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
      const isOverlappingX =
        finalCoordinates.x + selectedMonitorDimensions.width > expandedBoundingBox.left &&
        finalCoordinates.x < expandedBoundingBox.right;
      // Check for overlap along the Y-axis
      const isOverlappingY =
        finalCoordinates.y + selectedMonitorDimensions.height > expandedBoundingBox.top &&
        finalCoordinates.y < expandedBoundingBox.bottom;

      //console.log(isOverlappingX, isOverlappingY)
      return isOverlappingX && isOverlappingY; //rectanglesIntersect(expandedBoundingBox, selectedBox);
    }

    return false;
  });

}

export interface Rect{
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export const isInRect = (rect: Rect, x: number, y: number) => {
  if (x >= rect.left && x < rect.right && y >= rect.top && y < rect.bottom) return true;
  return false;
}

export const InRect = (rect: Rect, x: number, y: number) => {
if (x >= rect.left - 1 && x <= rect.right + 1 && y >= rect.top - 1 && y <= rect.bottom + 1) return true;
return false;
}

export const isIntersect = (a: IMonitorItem, b: IMonitorItem) => {
  const aDimension = getHeightAndWidth(a);
  const bDimension = getHeightAndWidth(b);

  const aRect = {
    left: a.x,
    top: a.y,
    right: a.x + aDimension.width,
    bottom: a.y + aDimension.height
  }
  const bRect = {
    left: b.x,
    top: b.y,
    right: b.x + bDimension.width,
    bottom: b.y + bDimension.height
  }

  if (InRect(aRect, bRect.left, bRect.top)
  || InRect(aRect, bRect.left, bRect.bottom)
  || InRect(aRect, bRect.right, bRect.bottom)
  || InRect(aRect, bRect.right, bRect.top)){
    return true;
  }
  if (InRect(bRect, aRect.left, aRect.top)
  || InRect(bRect, aRect.left, aRect.bottom)
  || InRect(bRect, aRect.right, aRect.bottom)
  || InRect(bRect, aRect.right, aRect.top)){
    return true;
  }
  return false;
}