import type { Transform } from "@dnd-kit/utilities";
import { IMonitorItem } from "../types";
import { getHeightAndWidth } from "./dimensions";
import { isInRect, Rect } from "./utils";

export const restrictToOverlapOtherRects = ({
  transform,
  selectedMonitor,
  monitors
}: {
  transform: Transform;
  selectedMonitor: IMonitorItem;
  monitors: IMonitorItem[];
}): Transform => {
  const selectedDimension = getHeightAndWidth(selectedMonitor);
  const selectedRect = {
    left: selectedMonitor.x + transform.x,
    top: selectedMonitor.y + transform.y,
    right: selectedMonitor.x + transform.x + selectedDimension.width,
    bottom: selectedMonitor.y + transform.y + selectedDimension.height
  };
  const adjustedTransform = { ...transform, x: transform.x, y: transform.y };

  let flag = 0;

  for (const monitor of monitors){
    if (monitor.connector === selectedMonitor.connector) continue;
    const dimension = getHeightAndWidth(monitor);
    const monitorRect = {
      left: monitor.x,
      top: monitor.y,
      right: monitor.x + dimension.width,
      bottom: monitor.y + dimension.height
    }

    if (isInRect(monitorRect, selectedRect.left, selectedRect.top)){
      const width = Math.min((monitorRect.right - selectedRect.left), (selectedRect.right - selectedRect.left));
      const height = Math.min((monitorRect.bottom - selectedRect.top), (selectedRect.bottom - selectedRect.top));
      if (width < height) adjustedTransform.x = monitor.x + dimension.width - selectedMonitor.x;
      if (width > height) adjustedTransform.y = monitor.y + dimension.height - selectedMonitor.y;
      flag = 1;
    }
    if (isInRect(monitorRect, selectedRect.left, selectedRect.bottom)){
      const width = Math.min((monitorRect.right - selectedRect.left), (selectedRect.right - selectedRect.left));
      const height = Math.min((selectedRect.bottom - monitorRect.top), (selectedRect.bottom - selectedRect.top));
      if (width < height) adjustedTransform.x = monitor.x + dimension.width - selectedMonitor.x;
      if (width > height) adjustedTransform.y = monitor.y - selectedDimension.height - selectedMonitor.y;
      flag = 1;
    }
    if (isInRect(monitorRect, selectedRect.right, selectedRect.top)){
      const width = Math.min((selectedRect.right - monitorRect.left), (selectedRect.right - selectedRect.left));
      const height = Math.min((monitorRect.bottom - selectedRect.top), (selectedRect.bottom - selectedRect.top));
      if (width < height) adjustedTransform.x = monitor.x - selectedDimension.width - selectedMonitor.x;
      if (width > height) adjustedTransform.y = monitor.y + dimension.height - selectedMonitor.y;
      flag = 1;
    }
    if (isInRect(monitorRect, selectedRect.right, selectedRect.bottom)){
      const width = Math.min((selectedRect.right - monitorRect.left), (selectedRect.right - selectedRect.left));
      const height = Math.min((selectedRect.bottom - monitorRect.top), (selectedRect.bottom - selectedRect.top));
      if (width < height) adjustedTransform.x = monitor.x - selectedDimension.width - selectedMonitor.x;
      if (width > height) adjustedTransform.y = monitor.y - selectedDimension.height - selectedMonitor.y;
      flag = 1;
    }
    //adjustedTransform.x = monitor.x;
  }

  if (flag == 0){
    const distance = monitors.reduce((res: Rect, item: IMonitorItem) => {
      if (item.connector === selectedMonitor.connector) return res;
      const dimension = getHeightAndWidth(item);
      if (item.x + dimension.width <= selectedRect.left){
        if (item.y >= selectedRect.top && item.y < selectedRect.bottom
          || item.y + dimension.height > selectedRect.top && item.y + dimension.height <= selectedRect.bottom
          || item.y <= selectedRect.top && item.y + dimension.height >= selectedRect.bottom){
            if (res.left > selectedRect.left - (item.x + dimension.width)) res.left = selectedRect.left - (item.x + dimension.width);
          }
      }
      else if (item.y + dimension.height <= selectedRect.top){
        if (item.x >= selectedRect.left && item.x < selectedRect.right
          || item.x + dimension.width > selectedRect.left && item.x + dimension.width <= selectedRect.right
          || item.x <= selectedRect.left && item.x + dimension.width >= selectedRect.right){
            if (res.top > selectedRect.top - (item.y + dimension.height)) res.top = selectedRect.top - (item.y + dimension.height);
          }
      }
      else if (item.x >= selectedRect.right){
        if (item.y >= selectedRect.top && item.y < selectedRect.bottom
          || item.y + dimension.height > selectedRect.top && item.y + dimension.height <= selectedRect.bottom
          || item.y <= selectedRect.top && item.y + dimension.height >= selectedRect.bottom){
            if (res.right > item.x - selectedRect.right) res.right = item.x - selectedRect.right;
          }
      }
      else if (item.y >= selectedRect.bottom){
        if (item.x >= selectedRect.left && item.x < selectedRect.right
          || item.x + dimension.width > selectedRect.left && item.x + dimension.width <= selectedRect.right
          || item.x <= selectedRect.left && item.x + dimension.width >= selectedRect.right){
            if (res.bottom > item.y - selectedRect.bottom) res.bottom = item.y - selectedRect.bottom;
          }
      }
      return res;
    }, {left: Number.MAX_VALUE, top: Number.MAX_VALUE, right: Number.MAX_VALUE, bottom: Number.MAX_VALUE});

    if (distance.left <= distance.top && distance.left <= distance.right && distance.left <= distance.bottom){
      adjustedTransform.x = transform.x - distance.left;
    }
    else if (distance.top <= distance.left && distance.top <= distance.right && distance.top <= distance.bottom){
      adjustedTransform.y = transform.y  - distance.top;
    }
    else if (distance.right <= distance.top && distance.right <= distance.left && distance.right <= distance.bottom){
      adjustedTransform.x = transform.x + distance.right;
    }
    else if (distance.bottom <= distance.top && distance.bottom <= distance.left && distance.bottom <= distance.right){
      adjustedTransform.y = transform.y + distance.bottom;
    }
  }

  return adjustedTransform;
};