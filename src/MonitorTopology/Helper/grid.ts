import { getHeightAndWidth } from "./dimensions";
import { IMonitorItem } from "../types";

/**
 * make grid of monitors
 *
 * @returns {number} returns the grid size
 */
export const snapToGrid = (value: number, gridSize: number): number => {
  return Math.round(value / gridSize) * gridSize;
};

/**
 * Adjust the monitor position to the grid
 *
 * @returns {IMonitorItem} return the monitor with the adjusted position
 */
export const snapMonitorToGrid = (monitor: IMonitorItem): IMonitorItem => {
  const { width, height } = getHeightAndWidth(monitor);
  const snappedX = snapToGrid(monitor.x, width);
  const snappedY = snapToGrid(monitor.y, height);
  return { ...monitor, x: snappedX, y: snappedY };
};

/**
 * Closest value
 *
 * @returns {IMonitorItem} return the closest value
 */
export const getClosestValue = (target: number, values: number[]): number => {
  return values.reduce((prevValue, currValue) => {
    return Math.abs(currValue - target) < Math.abs(prevValue - target)
      ? currValue
      : prevValue;
  });
};
