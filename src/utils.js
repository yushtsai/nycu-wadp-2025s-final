import axios from 'axios';
import * as stationConfigs from "./stationsConfig.js"

const api_url = "https://peggy-backend-7kg3x2vbyq-de.a.run.app/"
export const fetchRealtimeData = (value, setRealTimeData) => {
    if (!value) return;
    axios.get(`${api_url}/api/metro/${encodeURIComponent(value)}`)
        .then(response => {
            setRealTimeData(response.data);
        })
        .catch(error => {
            console.log('Error fetching data:', error);
        });
};


const getToken = async () => {
    const clientId = process.env.REACT_APP_CLIENT_ID;
    const clientSecret = process.env.REACT_APP_CLIENT_SECRET;

    const data = new URLSearchParams();
    data.append('grant_type', 'client_credentials');
    data.append('client_id', clientId);
    data.append('client_secret', clientSecret);
    
    // console.log("data:",clientId,clientId);
    try {
        const response = await axios.post(
            'https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token',
            data,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        const token = response.data.access_token;
        return {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
        };
    } catch (error) {
        console.error('Error fetching token:', error);
        throw error;
    }
};



export const fetchBusData = async (busNumber, setRealTimeData) => {
    if (!busNumber) return;

    try {
        const tokenHeaders = await getToken();
        const response = await axios.get(
            `https://tdx.transportdata.tw/api/basic/v2/Bus/EstimatedTimeOfArrival/City/NewTaipei/${busNumber}?%24top=100&%24format=JSON`,
            tokenHeaders
        );
        setRealTimeData(response.data);
    } catch (error) {
        console.log('Error fetching data:', error);
    }
};

export const fetchBusInfo = (busNumber, setBusInfo) => {
    if (!busNumber) return;
    axios.get(`https://tdx.transportdata.tw/api/basic/v2/Bus/EstimatedTimeOfArrival/City/NewTaipei/${busNumber}?%24top=100&%24format=JSON`)
        .then(response => {
            setBusInfo(response.data[4].StopName.Zh_tw);
            
        })
        .catch(error => {
            console.log('Error fetching data:', error);
        });
};

export const findStationRoute = (stationName) => {
    if (stationConfigs.BlueLine.includes(stationName)) {
        return "Blue"
    }
    else if (stationConfigs.RedLine.includes(stationName)) {
        return "Red";
    }
    else if (stationConfigs.GreenLine.includes(stationName)) {
        return "Green";
    }
    else if (stationConfigs.OrangeLine.includes(stationName)) {
        return "Orange";
    }
    else if (stationConfigs.BrownLine.includes(stationName)) {
        return "Brown";
    } else if (stationConfigs.BrownLine.includes(stationName)) {
        return "Brown";
    }
    else if (stationConfigs.YellowLine.includes(stationName)) {
        return "Yellow";
    }
}

export const requestLocationPermission = (handleStationChange, handleRouteChange, setlocation, location) => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const currentLoc = `${position.coords.latitude},${position.coords.longitude}`;
                setlocation(currentLoc);
                localStorage.setItem('location', currentLoc);
                axios.get(`${api_url}/api/location/${encodeURIComponent(currentLoc)}`)
                    .then(response => {
                        handleStationChange(response.data);
                        handleRouteChange(findStationRoute(response.data));
                    })
                    .catch(error => {
                        console.log('Error fetching data:', error);
                    });
            },
            (error) => {
                console.error("Error obtaining location: ", error.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
};