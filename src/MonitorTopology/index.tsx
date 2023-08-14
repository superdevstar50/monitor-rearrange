/* eslint-disable react/prop-types */
import { DndContext, DragEndEvent, Modifier } from "@dnd-kit/core";
import { Box } from "@mui/material";
import React, { FC, useEffect, useRef, useState } from "react";
import { getContainerHeightAndWidth } from "./Helper/dimensions";
import { rearrangeMonitors } from "./Helper/rearrange";
import MonitorItem from "./MonitorItem";
import { IMonitorItem, IMonitorTopologyProps } from "./types";
import { Transform } from "@dnd-kit/utilities";
import { restrictToOverlapOtherRects } from "./Helper/restrict";
import { snapCenterToCursor } from "@dnd-kit/modifiers";

export const SCALE_FACTOR = 0.1;

/**
 * MonitorTopology
 *
 * @returns {FC} the monitor topology component
 */
const MonitorTopology: FC<IMonitorTopologyProps> = ({
  monitorTopologyData = [],
  onRearrange,
  onSelect,
  defaultSelectedMonitor,
  sx = {},
  testid = "",
}) => {
  const [monitors, setMonitors] = useState<IMonitorItem[]>([]);
  const [selectMonitor, setSelectMonitor] = useState<IMonitorItem["connector"]>(
    defaultSelectedMonitor || monitors[0].connector
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const { containerHeight, containerWidth } =
    getContainerHeightAndWidth(monitors);

  useEffect(() => {
    const updatedMonitors = monitorTopologyData.map((monitor) => ({
      ...monitor,
      x: monitor.x * SCALE_FACTOR,
      y: monitor.y * SCALE_FACTOR,
    }));

    setMonitors(updatedMonitors as IMonitorItem[]);
  }, [monitorTopologyData]);

  useEffect(() => {
    if (onRearrange) {
      onRearrange(monitors);
    }
  }, [monitors]);

  useEffect(() => {
    if (onSelect) {
      onSelect(selectMonitor);
    }
  }, [selectMonitor]);

  /**
   *
   */
  const handleSelect = (monitorId: IMonitorItem["connector"]) => {
    setSelectMonitor(monitorId);
  };

  const restrictModifiers: Modifier = (props) => {
    const { transform, active } = props;

    if (active) {
      return restrictToOverlapOtherRects({ transform, monitors, selectedMonitor: active.data.current as IMonitorItem });
    }
    return transform;
  };

  return (
    <Box
      sx={{
        alignItems: "center",
        backgroundColor: "#F8F8FB",
        border: "1px solid #E3E4E8",
        borderRadius: "8px",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        width: "100%",
        paddingTop: "5rem",
        ...sx,
      }}
      data-testid={testid}
    >
      <DndContext
        modifiers={[snapCenterToCursor, restrictModifiers]}
        onDragEnd={(props: DragEndEvent) => {
          const {
            delta,
            active: { data },
          } = props;
          const updatedMonitors = rearrangeMonitors({
            selectedMonitor: data.current as IMonitorItem,
            monitors,
            coordinates: delta,
          });

          setMonitors(updatedMonitors as IMonitorItem[]);
        }}
      >
        <Box
          ref={containerRef}
          sx={{
            // border: "1px red solid",
            position: "relative",
            height: containerHeight,
            width: containerWidth,
          }}
        >
          {monitors.map((monitor) => {
            return (
              <MonitorItem
                handleSelect={handleSelect}
                isSelected={monitor.connector === selectMonitor}
                key={monitor.connector}
                monitorId={`${monitor.connector}`}
                monitorItem={monitor}
                testid={`${testid}-monitor-${monitor.connector}`}
              />
            );
          })}
        </Box>
      </DndContext>
    </Box>
  );
};

export default MonitorTopology;
