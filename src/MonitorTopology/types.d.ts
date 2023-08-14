import { SxProps } from "@mui/system";

export interface IMonitorItem {
  availableModes: string[];
  connector: string;
  currentMode: string;
  id: number;
  isPrimary: boolean;
  orientation: "landscape" | "portrait";
  productName: string;
  serial: string;
  vendor: string;
  x: number;
  y: number;
}

export interface IMonitorItemProps {
  isSelected: boolean;
  monitorItem: IMonitorItem;
  monitorId: string;
  sx?: SxProps;
  testid?: string;
  handleSelect?: (monitorId: IMonitorItem["connector"]) => void;
}

interface IMonitorTopologyProps {
  monitorTopologyData: IMonitorItem[];
  onRearrange?: (updatedMonitorTopologyData: IMonitorItem[]) => void;
  onSelect?: (selectedMonitor: IMonitorItem["connector"]) => void;
  sx?: SxProps;
  testid?: string;
  defaultSelectedMonitor?: IMonitorItem["connector"];
}
