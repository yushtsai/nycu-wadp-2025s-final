import React, { useEffect, useState } from 'react';
import { Card, Text, Button, Flex, Select, Dialog, Grid } from '@radix-ui/themes';
import { Plus } from 'lucide-react';
import { fetchRealtimeData } from './utils';

const API_BASE_URL = 'https://oracle.yushtsai.com'; // ✅ 共用 API 網址變數

const FavoritePage = ({ user }) => {
  const [routes, setRoutes] = useState([]);
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [selectedStationId, setSelectedStationId] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [favoriteData, setFavoriteData] = useState({});

  useEffect(() => {
    fetch(`${API_BASE_URL}/routes`)
      .then(res => res.json())
      .then(data => setRoutes(data))
      .catch(err => console.error("載入路線失敗", err));
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    fetch(`${API_BASE_URL}/users/${userId}/favorites`)
      .then(res => res.json())
      .then(data => {
        setFavorites(data);
        data.forEach(station => {
          fetchRealtimeData(station.name, (realData) => {
            setFavoriteData(prev => ({
              ...prev,
              [station.name]: realData
            }));
          });
        });
      })
      .catch(err => console.error("載入收藏站牌失敗", err));
  }, []);

  const handleAddFavorite = () => {
    const userId = localStorage.getItem('userId');
    if (!userId || !selectedStationId) return alert("請先選擇路線與站牌");

    fetch(`${API_BASE_URL}/users/${userId}/favorites/${selectedStationId}`, {
      method: 'POST',
    })
      .then(res => {
        if (res.ok) {
          alert("已加入常用站牌！");
          setShowDialog(false);
          return fetch(`${API_BASE_URL}/users/${userId}/favorites`)
            .then(res => res.json())
            .then(data => {
              setFavorites(data);
              data.forEach(station => {
                fetchRealtimeData(station.name, (realData) => {
                  setFavoriteData(prev => ({
                    ...prev,
                    [station.name]: realData
                  }));
                });
              });
            });
        } else {
          throw new Error("新增失敗");
        }
      })
      .catch(() => alert("無法新增，請稍後再試"));
  };

  const handleDeleteFavorite = (stationId) => {
    const userId = localStorage.getItem('userId');
    if (!userId) return alert("請先登入");

    fetch(`${API_BASE_URL}/users/${userId}/favorites/${stationId}`, {
      method: 'DELETE',
    })
      .then(res => {
        if (res.ok) {
          alert("已移除常用站牌！");
          setFavorites(prev => prev.filter(f => f.id !== stationId));
          setFavoriteData(prev => {
            const updated = { ...prev };
            const deletedName = favorites.find(f => f.id === stationId)?.name;
            if (deletedName) delete updated[deletedName];
            return updated;
          });
        } else {
          throw new Error("刪除失敗");
        }
      })
      .catch(() => alert("無法刪除，請稍後再試"));
  };

  const selectedRoute = routes.find(route => route.id === Number(selectedRouteId));

  return (
    <Flex direction="column" gap="4" p="4">
      <Flex justify="between" align="center">
        <Text size="5" weight="bold">我的常用站牌</Text>
        <Button variant="soft" onClick={() => setShowDialog(true)}>
          <Plus size={16} /> 加入
        </Button>
      </Flex>

      <Grid gap="3">
        {favorites.map(fav => (
          <Card key={fav.id}>
            <Flex justify="between" align="center" mb="2">
              <Text size="4" weight="bold">{fav.name}</Text>
              <Button
                variant="ghost"
                color="red"
                onClick={() => handleDeleteFavorite(fav.id)}
                size="1"
              >
                移除
              </Button>
            </Flex>
            {(favoriteData[fav.name]?.length > 0) ? (
              favoriteData[fav.name].map((item, index) => (
                <Flex key={index} justify="between">
                  <Text>往 {item.DestinationName.replace(/(站)?$/, '')}</Text>
                  <Text color="gray">{item.CountDown}</Text>
                </Flex>
              ))
            ) : (
              <Text color="gray">載入中或無資料</Text>
            )}
          </Card>
        ))}
      </Grid>

      {showDialog && (
        <Card>
          <Flex direction="column" gap="3">
            <Text weight="bold">選擇路線</Text>
            <Select.Root onValueChange={setSelectedRouteId}>
              <Select.Trigger placeholder="請選擇路線" />
              <Select.Content>
                {routes.map(route => (
                  <Select.Item key={route.id} value={String(route.id)}>
                    {route.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>

            {selectedRoute && (
              <>
                <Text weight="bold">選擇站牌</Text>
                <Select.Root onValueChange={setSelectedStationId}>
                  <Select.Trigger placeholder="請選擇站牌" />
                  <Select.Content>
                    {selectedRoute.stations.map(station => (
                      <Select.Item key={station.id} value={String(station.id)}>
                        {station.name}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </>
            )}

            <Flex justify="end" gap="2" mt="3">
              <Button variant="soft" color="gray" onClick={() => setShowDialog(false)}>取消</Button>
              <Button variant="solid" color="green" onClick={handleAddFavorite}>加入</Button>
            </Flex>
          </Flex>
        </Card>
      )}
    </Flex>
  );
};

export default FavoritePage;
