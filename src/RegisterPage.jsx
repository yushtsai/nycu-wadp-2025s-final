// src/RegisterPage.jsx
import React, { useState } from 'react';
import { Card, Text, TextField, Button, Flex } from '@radix-ui/themes';

const RegisterPage = ({ onRegister, goToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('https://oracle.yushtsai.me/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: name,
          email: email,
        }),
      });
  
      const text = await response.text(); // 先接收純文字
      try {
        const data = JSON.parse(text); // 嘗試轉為 JSON
        if (data.error) {
          throw new Error(data.error);
        }
  
        const user = data.user || data;
        localStorage.setItem('user', user.username);
        localStorage.setItem('userId', user.id);
        onRegister({ name: user.username, email: user.email, id: user.id });
      } catch (jsonError) {
        throw new Error(text); // 如果不是 JSON，就當作錯誤訊息
      }
  
    } catch (error) {
      console.error('註冊錯誤：', error.message);
      alert(`❌ 註冊失敗：${error.message}`);
    }
  };
  


  return (
    <Flex direction="column" align="center" justify="center" className="h-screen">
      <Card style={{ width: '300px', padding: '20px' }}>
        <form onSubmit={handleRegister}>
          <Flex direction="column" gap="3">
            <Text size="4" weight="bold" align="center">註冊</Text>
            <TextField.Input
              placeholder="使用者名稱"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField.Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField.Input
              type="password"
              placeholder="密碼"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" className="w-full">建立帳號</Button>
            <Button variant="ghost" onClick={goToLogin}>已有帳號？登入</Button>
          </Flex>
        </form>
      </Card>
    </Flex>
  );
};

export default RegisterPage;
