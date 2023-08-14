import { getHeightAndWidth } from "./dimensions";
import { IMonitorItem } from "../types";

/**
 * Check if two monitors overlap
 *
 * @returns {boolean} returns true if the monitors overlap else false
 */
export const monitorOverlap = (
  monitorA: IMonitorItem,
  monitorB: IMonitorItem
): boolean => {
  const rectA = {
    x: monitorA.x,
    y: monitorA.y,
    width: getHeightAndWidth(monitorA).width,
    height: getHeightAndWidth(monitorA).height,
  };

  const rectB = {
    x: monitorB.x,
    y: monitorB.y,
    width: getHeightAndWidth(monitorB).width,
    height: getHeightAndWidth(monitorB).height,
  };

  // Calculate the overlapping areas for both landscape and portrait orientations
  const landscapeOverlapX =
    Math.max(
      0,
      Math.min(rectA.x + rectA.width, rectB.x + rectB.width) -
      Math.max(rectA.x, rectB.x)
    ) / Math.min(rectA.width, rectB.width);

  const landscapeOverlapY =
    Math.max(
      0,
      Math.min(rectA.y + rectA.height, rectB.y + rectB.height) -
      Math.max(rectA.y, rectB.y)
    ) / Math.min(rectA.height, rectB.height);

  const portraitOverlapX =
    Math.max(
      0,
      Math.min(rectA.x + rectA.height, rectB.x + rectB.height) -
      Math.max(rectA.x, rectB.x)
    ) / Math.min(rectA.height, rectB.height);

  const portraitOverlapY =
    Math.max(
      0,
      Math.min(rectA.y + rectA.width, rectB.y + rectB.width) -
      Math.max(rectA.y, rectB.y)
    ) / Math.min(rectA.width, rectB.width);


  // console.log(landscapeOverlapX, landscapeOverlapY, portraitOverlapX, portraitOverlapY)
  // Check if either landscape overlap or portrait overlap meets the condition
  const landscapeOverlap = landscapeOverlapX > 0 && landscapeOverlapY > 0;
  const portraitOverlap = portraitOverlapX > 0 && portraitOverlapY > 0;

  return landscapeOverlap && portraitOverlap;
};
