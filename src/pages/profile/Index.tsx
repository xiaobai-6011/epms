import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Card, Avatar, Typography, Space } from 'antd';
import { UserOutlined, MailOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function Index() {
  return (
    <PageContainer>
      <Card>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Avatar size={80} icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
          <Title level={3}>test</Title>
          <Text><MailOutlined /> test@test.com</Text>
          <Text>状态: 正常</Text>
        </Space>
      </Card>
    </PageContainer>
  );
}
