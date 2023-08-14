import { useDraggable } from "@dnd-kit/core";
import StarIcon from "@mui/icons-material/Star";
import { Box } from "@mui/material";
// import MonitorIcon from "../../assets/monitor-icon.svg";
import React, { FC } from "react";
import Typography from "../../Typography";
import { getHeightAndWidth } from "../Helper/dimensions";
import { IMonitorItemProps } from "../types";
/**
 * MonitorItem
 *
 * @returns {FC} the monitor item component
 */
const MonitorItem: FC<IMonitorItemProps> = ({
  isSelected = false,
  monitorItem,
  monitorId,
  sx = {},
  testid = "",
  handleSelect,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: monitorId,
    data: monitorItem,
  });

  const { height, width } = getHeightAndWidth(monitorItem);

  return (
    <Box
      data-testid={`${testid}`}
      component={"span"}
      sx={{
        cursor: "grab",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        left: monitorItem.x,
        top: monitorItem.y,
        position: "absolute",
        "--translate-x": `${transform?.x ?? 0}px`,
        "--translate-y": `${transform?.y ?? 0}px`,
        transform:
          "translate3d(var(--translate-x, 0), var(--translate-y, 0), 0) scale(var(--scale, 1))",
        transition: "box-shadow 300ms ease",
        ...sx,
      }}
      {...attributes}
      {...listeners}
      ref={setNodeRef}
    >
      <Box
        data-testid={`${testid}-item`}
        sx={{
          alignItems: "center",
          backgroundColor: isSelected ? "#01838B" : "white",
          border: `solid 1px ${isSelected ? "#16484E" : "#C7C9D1"}`,
          borderRadius: "4px",
          color: "#C7C9D1",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: `${height}px`,
          width: `${width}px`,
          zIndex: 1,
        }}
        onClick={() => handleSelect && handleSelect(monitorItem.connector)}
      >
        "MonitorIcon"
        <Box>
          <Typography
            // variant={"body.small.bold"}
            data-testid={`${testid}-name`}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: isSelected ? "#C7C9D1" : "#101112",
              paddingTop: "4px",
            }}
          >
            {monitorItem.isPrimary && <StarIcon sx={{ fontSize: "small" }} />}
            {monitorItem.productName}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default MonitorItem;
