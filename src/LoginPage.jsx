import React, { useState } from 'react';
import { Card, Text, TextField, Button, Flex } from '@radix-ui/themes';

const LoginPage = ({ onLogin, goToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // 防止頁面重新載入
  
    try {
      const response = await fetch('https://oracle.yushtsai.com/users');
      const users = await response.json();
  
      const matchedUser = users.find(user => user.username === username);
      if (matchedUser) {
        localStorage.setItem('user', username);
        localStorage.setItem('userId', matchedUser.id.toString());
        onLogin(username);
      } else {
        alert('使用者不存在');
      }
    } catch (error) {
      console.error('登入時發生錯誤:', error);
      alert('無法連接伺服器');
    }
  };
  

  return (
    <Flex direction="column" align="center" justify="center" className="h-screen">
      <Card style={{ width: '300px', padding: '20px' }}>
        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="3">
            <Text size="4" weight="bold" align="center">登入</Text>
            <TextField.Root>
              <TextField.Input
                placeholder="帳號"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </TextField.Root>
            <TextField.Root>
              <TextField.Input
                type="password"
                placeholder="密碼"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </TextField.Root>
            <Button type="submit" className="w-full">登入</Button>
            <Button variant="ghost" onClick={goToRegister}>沒有帳號？註冊</Button>
          </Flex>
        </form>
      </Card>
    </Flex>
  );
};

export default LoginPage;
