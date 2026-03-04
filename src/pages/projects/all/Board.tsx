import { useState, useEffect } from 'react';
import { useSearchParams } from '@umijs/max';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Row, Col, Card, Tag, Avatar, Button, Space, message, Empty } from 'antd';
import { PlusOutlined, MoreOutlined, UserOutlined } from '@ant-design/icons';
import { getProject, getProjectTasks } from '@/services/ant-design-pro/api';

// 看板列配置
const BOARD_COLUMNS = [
  { id: 1, title: '待办', color: '#d9d9d9' },
  { id: 2, title: '进行中', color: '#1890ff' },
  { id: 3, title: '已完成', color: '#52c41a' },
];

const ProjectBoardPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectId = Number(searchParams.get('id')) || Number(searchParams.get('projectId'));
  
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    if (projectId) {
      fetchData();
    }
  }, [projectId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [projectRes, tasksRes] = await Promise.all([
        getProject(projectId),
        getProjectTasks(projectId)
      ]);
      setProject(projectRes.project || projectRes);
      setTasks(tasksRes.tasks || tasksRes.data || []);
    } catch (error) {
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 按状态分组任务
  const getTasksByStatus = (status: number) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <PageContainer
      title={project?.name || '项目看板'}
      subTitle="拖拽卡片调整任务状态"
    >
      <Row gutter={16} style={{ minHeight: 500 }}>
        {BOARD_COLUMNS.map(column => (
          <Col span={8} key={column.id}>
            <Card
              title={
                <Space>
                  <span style={{ 
                    display: 'inline-block', 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    backgroundColor: column.color 
                  }} />
                  {column.title}
                  <Tag>{getTasksByStatus(column.id).length}</Tag>
                </Space>
              }
              extra={<MoreOutlined style={{ cursor: 'pointer' }} />}
              bodyStyle={{ padding: 12, minHeight: 400 }}
              hoverable
            >
              <Space direction="vertical" style={{ width: '100%' }} size={12}>
                {getTasksByStatus(column.id).map(task => (
                  <Card
                    key={task.id}
                    size="small"
                    hoverable
                    style={{ 
                      borderLeft: `3px solid ${column.color}`,
                      cursor: 'grab'
                    }}
                  >
                    <div style={{ fontWeight: 500, marginBottom: 8 }}>{task.title}</div>
                    <Space size={4}>
                      {task.tags?.map((tag: any) => (
                        <Tag key={tag.id} color={tag.color} style={{ fontSize: 10 }}>
                          {tag.name}
                        </Tag>
                      ))}
                    </Space>
                    <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Space size={4}>
                        {task.priority === 1 && <Tag color="red" style={{ fontSize: 10 }}>紧急</Tag>}
                        {task.priority === 2 && <Tag color="orange" style={{ fontSize: 10 }}>高</Tag>}
                      </Space>
                      {task.assignee_name && (
                        <Avatar size="small" style={{ backgroundColor: '#1890ff' }}>
                          {task.assignee_name.charAt(0)}
                        </Avatar>
                      )}
                    </div>
                    {task.end_date && (
                      <div style={{ marginTop: 8, fontSize: 12, color: '#888' }}>
                        截止: {new Date(task.end_date).toLocaleDateString()}
                      </div>
                    )}
                  </Card>
                ))}
                
                {getTasksByStatus(column.id).length === 0 && (
                  <Empty 
                    description="暂无任务" 
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    style={{ margin: '20px 0' }}
                  />
                )}
                
                <Button 
                  type="dashed" 
                  icon={<PlusOutlined />} 
                  block
                  style={{ opacity: 0.6 }}
                >
                  添加任务
                </Button>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </PageContainer>
  );
};

export default ProjectBoardPage;
