/* eslint-disable react/prop-types */
import { DndContext, DragEndEvent, DragOverlay, Modifier } from "@dnd-kit/core";
import { Box } from "@mui/material";
import { FC, useEffect, useRef, useState } from "react";
import { getContainerHeightAndWidth } from "./Helper/dimensions";
import { rearrangeMonitors } from "./Helper/rearrange";
import MonitorItem from "./MonitorItem";
import { IMonitorItem, IMonitorTopologyProps } from "./types";
import { restrictToOverlapOtherRects } from "./Helper/restrict";

import {state, isOverLapping, isIntersect} from "./Helper/utils";

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
  const [draggingMonitor, setDraggingMonitor] = useState<IMonitorItem | undefined>();

  const [isOver, setIsOver] = useState<boolean>(false);
  const [isOver1, setIsOver1] = useState<boolean>(false);

  const [scale, setScale] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const { containerHeight, containerWidth } =
    getContainerHeightAndWidth(monitors);

  useEffect(() => {
    function handleResize() {
      setScale(state.scale);    
      state.scale = window.innerWidth / 7 / 1920;
    }

    window.addEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const updatedMonitors = monitors.map((monitor) => ({
      ...monitor,
      x: monitor.scale && monitor.x * state.scale / monitor.scale,
      y: monitor.scale && monitor.y * state.scale / monitor.scale,
      scale: state.scale
    }));

    setMonitors(updatedMonitors as IMonitorItem[]);
  }, [scale]);

  useEffect(() => {
    const updatedMonitors = monitorTopologyData.map((monitor) => ({
      ...monitor,
      x: monitor.x * state.scale,
      y: monitor.y * state.scale,
      scale: state.scale
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
        modifiers={[/*snapCenterToCursor, */restrictModifiers]}
        onDragStart={(event) => {
          setDraggingMonitor({...event.active.data.current} as IMonitorItem);
        }} 
        onDragMove={(event) => {
          setIsOver(!!draggingMonitor && isOverLapping(monitors, {x: draggingMonitor.x + event.delta.x, y: draggingMonitor.y + event.delta.y}, draggingMonitor));

          if (draggingMonitor){
            const linked:IMonitorItem[] = [];
            linked.push({...draggingMonitor, x: draggingMonitor.x + event.delta.x, y: draggingMonitor.y + event.delta.y});

            for (const tm of linked){
              for (const monitor of monitors){
                if (linked.filter(item => item.connector === monitor.connector).length) continue;

                if (isIntersect(tm, monitor)) linked.push(monitor);
              }
            }

            setIsOver1(linked.length !== monitors.length);
          }
        }}
        onDragEnd={(props: DragEndEvent) => {
          const {
            delta,
            active: { data },
          } = props;
          const selectedMonitor =  data.current as IMonitorItem;
          //if (selectedMonitor.x + delta.x <= 0 || selectedMonitor.y + delta.y <= 0) return;

          const finalCoordinates = {
            x: selectedMonitor.x + delta.x,
            y: selectedMonitor.y + delta.y
          };


          if (isOverLapping(monitors, finalCoordinates, selectedMonitor)) return;
          if (isOver1) return;

          const updatedMonitors = rearrangeMonitors({
            selectedMonitor: data.current as IMonitorItem,
            monitors,
            coordinates: delta,
          });

          console.log(updatedMonitors);

          //setMonitors(updatedMonitors as IMonitorItem[]);
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
           <DragOverlay>
              {draggingMonitor && <MonitorItem
                isSelected={draggingMonitor.connector === selectMonitor}
                key={draggingMonitor.connector}
                monitorId={`${draggingMonitor.connector}`}
                monitorItem={draggingMonitor}
                status = {isOver || isOver1}
              />
              }
          </DragOverlay>
        </Box>
      </DndContext>
    </Box>
  );
};

export default MonitorTopology;
