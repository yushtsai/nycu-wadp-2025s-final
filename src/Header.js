/* Header.js */
import React from 'react';
import  { useState, useEffect } from 'react';

import { Avatar, Flex, Text, Button } from '@radix-ui/themes';
import { Crosshair2Icon } from '@radix-ui/react-icons';

import { fetchRealtimeData, requestLocationPermission } from './utils.js';

export const BrandHeader = ({ user, onLoginClick, onLogout, refreshLocation }) => {

    return (
    <Flex
      justify="between"
      align="center"
      style={{
        paddingInline: '5%',
        paddingBlock: '10px'
      }}
    >
      <Text weight="bold">
        <Avatar
          size="1"
          src="https://wadp-final.vercel.app/logo512.png"
          radius="full"
          fallback="T"
        /> 捷運即時通
      </Text>

      <Flex align="center" gap="2" style={{ marginLeft: 'auto' }}>
        <Button onClick={refreshLocation} color="gray">
          <Crosshair2Icon />
        </Button>

        {!user ? (
          <Button onClick={onLoginClick}>登入</Button>
        ) : (
          <>
            <Text>{user}</Text>
            <Button
              variant="soft"
              color="red"
              onClick={onLogout}
            >
              登出
            </Button>
          </>
        )}
      </Flex>
    </Flex>
  );
};
