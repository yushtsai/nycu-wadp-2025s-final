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


  const fetchRealTimeData = () => {
    fetchRealtimeData(selectedStation, setRealTimeData);
    setCountdown(10);
  };

  return (

    <div className="App h-screen flex justify-center items-center">
      <div className='New'>
        <Grid gap="4" className="grid-full">

          {/* <Grid columns="3" gap="2" className="grid-80-center">
            <Button onClick={() => setPanel(!panelVisibility)}>
              {panelVisibility ? <CaretUpIcon></CaretUpIcon> : <CaretDownIcon></CaretDownIcon>}
            </Button>
            <Button onClick={fetchRealTimeData} color='iris'> <UpdateIcon></UpdateIcon> </Button>
            <Button onClick={refreshLocation} color='gray'> <Crosshair2Icon> </Crosshair2Icon></Button>

          </Grid> */}






          <Grid columns="1" gap="1" className="grid-80-center">
            <Button onClick={refreshLocation} color='gray'> <Crosshair2Icon> </Crosshair2Icon></Button>
          </Grid>

          <Grid gap="3" className="grid-80-center">
            <Card>
              <Flex justify="between" align="center" mb="2">
                <Text size="4" weight="bold">{selectedStation}</Text>
                <Badge color="gray" size="1">更新倒數：{countdown}s</Badge>
              </Flex>

              {realtime_data.length > 0 ? (
                realtime_data.map((item, index) => (
                  <Flex
                    key={index}
                    justify="between"
                    align="center"
                    style={{
                      background: item.CountDown === "列車進站" ? "rgba(160, 0, 0, 0.1)" : "transparent",
                      borderRadius: "6px",
                      padding: "6px 10px",
                      marginBottom: "4px",
                    }}
                  >
                    <Text size="2">往 {item.DestinationName.replace(/(站)?$/, '')}</Text>
                    <Text size="2" color={item.CountDown === "列車進站" ? "red" : "gray"}>
                      {item.CountDown}
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
