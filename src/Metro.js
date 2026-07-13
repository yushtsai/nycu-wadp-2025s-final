/* Metro.js */
import './App.css';
import React, { useState, useEffect } from 'react';

import { Card, Text, Button, Grid, Blockquote, Flex, Box, Badge, Callout } from '@radix-ui/themes';
import { UpdateIcon, Crosshair2Icon, InfoCircledIcon, CaretDownIcon, CaretUpIcon } from '@radix-ui/react-icons'
import * as stationConfigs from './stationsConfig.js';
import { fetchRealtimeData, requestLocationPermission } from './utils.js';
import { BrandHeader } from './Header.js';
const api_url = "https://peggy-backend-7kg3x2vbyq-de.a.run.app/"

export function Metro({
  selectedRoute,
  setSelectedRoute,
  selectedStation,
  setSelectedStation,
  location,
  setLocation,
  handleStationChange,
  handleRouteChange,
  refreshLocation
}) {
  const [realtime_data, setRealTimeData] = useState([]);
  const [stations, setStations] = useState([]);
  const [panelVisibility, setPanel] = useState(true);
  const [countdown, setCountdown] = useState(10);

  const stationMap = {
    Red: stationConfigs.RedLine,
    Blue: stationConfigs.BlueLine,
    Green: stationConfigs.GreenLine,
    Orange: stationConfigs.OrangeLine,
    Brown: stationConfigs.BrownLine,
    Yellow: stationConfigs.YellowLine
  };

  const metroLines = [
    { name: 'Red', label: 'R', color: 'red' },
    { name: 'Blue', label: 'BL', color: 'blue' },
    { name: 'Green', label: 'G', color: 'green' },
    { name: 'Orange', label: 'O', color: 'orange' },
    { name: 'Brown', label: 'BR', color: 'brown' },
    { name: 'Yellow', label: 'Y', color: 'yellow' },
  ];


  useEffect(() => {
    setStations(stationMap[selectedRoute] || []);
    fetchRealTimeData();

    const timerId = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          fetchRealTimeData();
          return 10;
        }
        return prevCountdown - 1;
      });
    }, 1000);
    return () => clearInterval(timerId);

  }, [selectedRoute, selectedStation]);


  const handleRouteChangeLocal = (newValue) => {
    setPanel(true);
    handleRouteChange(newValue);
  };

  const fetchRealTimeData = () => {
    fetchRealtimeData(selectedStation, setRealTimeData);
    setCountdown(10);
  };

  const formatCountdown = (timeStr) => {
    const [minutes, seconds] = timeStr.split(":").map(Number);
    if (isNaN(minutes) || isNaN(seconds)) return timeStr;

    const paddedSeconds = seconds.toString().padStart(2, "0");

    if (minutes === 0) {
      return `${paddedSeconds}秒`;
    }
    return `${minutes}分 ${paddedSeconds}秒`;
  };




  return (

    <div className="App">
      <div className='New'>
        <Grid gap="2" className="grid-full">
          <Grid columns="6" gap="3" width="98%" className="grid-80-center">
            {metroLines.map((line) => (
              <Box key={line.name} style={{ position: "relative", width: "auto", display: "flex", justifyContent: "center" }}>
                <Button
                  className="circle-line-button"
                  color={line.color}
                  variant={selectedRoute === line.name ? 'solid' : 'soft'}
                  onClick={() => handleRouteChangeLocal(line.name)}
                >
                  {line.label}
                </Button>
              </Box>

            ))}
          </Grid>


          {
            panelVisibility &&
            <Grid
              columns="3"
              gap="2"
              className="grid-80-center grid-rows-3 overflow-y-auto"
              style={{ height: "calc(7.5 * 3rem)", minHeight: "0" }}
            >
              {stations.map((station, index) => (
                <Button
                  className="button-nowrap"
                  color="brown"
                  variant={station === selectedStation ? "surface" : "soft"}
                  key={index}
                  value={station}
                  onClick={() => handleStationChange(station)}
                >
                  {station}
                </Button>
              ))}

              {/* 補上透明按鈕直到總數為 27 個 */}
              {Array.from({ length: 28 - stations.length }).map((_, idx) => (
                <Button
                  key={`placeholder-${idx}`}
                  variant="ghost"
                  disabled
                  style={{ visibility: "hidden" }}
                >
                  空白
                </Button>
              ))}
            </Grid>
          }






          <Grid gap="3" className="grid-80-center">
            <Card>
              <Flex justify="between" align="center" mb="2">
                <Text size="4" weight="bold">{selectedStation}</Text>
                <Badge color="gray" size="1">更新倒數：{countdown}s</Badge>
              </Flex>

              {(realtime_data.length > 0) ? (
                realtime_data.map((item, index) => (
                  <Flex key={index} justify="between" align="center" style={{
                    background: item.CountDown === "列車進站" ? "rgba(160, 0, 0, 0.1)" : "",
                    borderRadius: "6px",
                    padding: "4px 8px",
                    marginBottom: "0px"
                  }}>
                    <Text>往 {item.DestinationName.replace(/(站)?$/, '')}</Text>
                    <Text
                      color={item.CountDown === "列車進站" ? "red" : "gray"}
                      style={{
                        fontFamily: "monospace",
                        minWidth: "100px", // 或依照你設計需求自行調整
                        textAlign: "right",
                        display: "inline-block"
                      }}
                    >
                      {item.CountDown === "列車進站"
                        ? item.CountDown
                        : formatCountdown(item.CountDown)}
                    </Text>

                  </Flex>
                ))
              ) : (
                <Text color="gray">載入中或無資料</Text>
              )}
            </Card>
          </Grid>


        </Grid>



      </div>
    </div >
  );
}
export default Metro;
