# Monitor topology like MacOs

- Arranging monitor can be Landscape or Portrait
- Monitor can be placed on any Axism X, Y, -X, -Y
- Monitor cant overlap eachother
- There should be no space in between although there should be a freeflow like MacOS
- If Monitor from middle is moved to Y all the monitors from X axis should rearrange and no space should be left in between monitors

Tips:
- Modify src/MonitorTopology/Helper/rearrange.ts: rearrangeMonitors
- Modigy  src/MonitorTopology/Helper/restrict.ts: restrictToOverlapOtherRects

