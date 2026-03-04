import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Card, Row, Col, Statistic, Progress, List, Tag, Avatar } from 'antd';
import { 
  ProjectOutlined, 
  TaskOutlined, 
  UserOutlined, 
  RiseOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';

export default function Welcome() {
  const projectStats = [
    { title: '总项目', value: 12, icon: <ProjectOutlined />, color: '#1890ff' },
    { title: '进行中', value: 8, icon: <ClockCircleOutlined />, color: '#faad14' },
    { title: '已完成', value: 4, icon: <CheckCircleOutlined />, color: '#52c41a' },
    { title: '团队成员', value: 24, icon: <UserOutlined />, color: '#722ed1' },
  ];

  const recentTasks = [
    { id: 1, title: '完成用户登录功能', project: '项目管理系统', priority: '高', status: '进行中' },
    { id: 2, title: '设计数据库架构', project: '项目管理系统', priority: '中', status: '已完成' },
    { id: 3, title: '前端页面开发', project: '官网重构', priority: '高', status: '待处理' },
    { id: 4, title: 'API接口联调', project: '移动端App', priority: '中', status: '进行中' },
  ];

  const priorityColors: Record<string, string> = { '高': 'red', '中': 'orange', '低': 'blue' };

  return (
    <PageContainer>
      <Row gutter={[16, 16]}>
        {projectStats.map((stat, index) => (
          <Col span={6} key={index}>
            <ProCard>
              <Statistic 
                title={stat.title} 
                value={stat.value} 
                prefix={stat.icon}
                valueStyle={{ color: stat.color }}
              />
            </ProCard>
          </Col>
        ))}
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={16}>
          <ProCard title="最近任务" extra="更多">
            <List
              itemLayout="horizontal"
              dataSource={recentTasks}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<TaskOutlined />} style={{ backgroundColor: '#1890ff' }} />}
                    title={item.title}
                    description={
                      <span>
                        <Tag color="blue">{item.project}</Tag>
                        <Tag color={priorityColors[item.priority]}>{item.priority}</Tag>
                      </span>
                    }
                  />
                  <Tag color={item.status === '已完成' ? 'success' : item.status === '进行中' ? 'processing' : 'default'}>
                    {item.status}
                  </Tag>
                </List.Item>
              )}
            />
          </ProCard>
        </Col>
        <Col span={8}>
          <ProCard title="项目进度">
            <div style={{ marginBottom: 16 }}>
              <span>项目管理系统的</span>
              <Progress percent={75} status="active" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <span>官网重构</span>
              <Progress percent={50} status="active" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <span>移动端App</span>
              <Progress percent={30} />
            </div>
            <div>
              <span>数据分析平台</span>
              <Progress percent={90} status="exception" />
            </div>
          </ProCard>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={8}>
          <ProCard title="本周完成任务">
            <Statistic title="完成数" value={12} prefix={<RiseOutlined />} />
            <Statistic title="完成率" value={85} suffix="%" prefix={<CheckCircleOutlined />} />
          </ProCard>
        </Col>
        <Col span={8}>
          <ProCard title="待办任务">
            <Statistic title="待处理" value={5} valueStyle={{ color: '#faad14' }} />
            <Statistic title="进行中" value={8} valueStyle={{ color: '#1890ff' }} />
          </ProCard>
        </Col>
        <Col span={8}>
          <ProCard title="团队活跃度">
            <Statistic title="活跃成员" value={18} suffix="/ 24" />
            <Statistic title="在线率" value={75} suffix="%" />
          </ProCard>
        </Col>
      </Row>
    </PageContainer>
  );
}
