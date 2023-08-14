import MonitorTopology from './MonitorTopology';
import { IMonitorItem } from './MonitorTopology/types';
import { monitors as ImmutableMonitors } from './data';
import { Box } from '@mui/system';

function App() {
  return <Box><MonitorTopology
    monitorTopologyData={ImmutableMonitors as IMonitorItem[]}
    onRearrange={(updatedMonitorTopologyData: IMonitorItem[]) => {
      // eslint-disable-next-line no-console
      // console.log("emitted data:", { updatedMonitorTopologyData });
    }}
    defaultSelectedMonitor={ImmutableMonitors[2].connector}
    onSelect={(selectedMonitor: IMonitorItem["connector"]) => {
      // eslint-disable-next-line no-console
      // console.log("selected monitor:", { selectedMonitor });
    }}
    testid="tui-monitor-topology-doc"
  /> </Box>
}

export default App
