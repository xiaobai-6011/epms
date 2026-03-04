import { useState, useEffect } from 'react';
import { useSearchParams } from '@umijs/max';
import { PageContainer, ProCard, ProTable, Tabs, Statistic, Row, Col, Tag, Avatar, Space, Button, message, Empty } from '@ant-design/pro-components';
import { PlusOutlined, CheckCircleOutlined, ClockCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { getProject, getProjectTasks, createTask, updateTask, deleteTask, getProjectMembers, getProjectTags } from '@/services/ant-design-pro/api';

const ProjectDetailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectId = Number(searchParams.get('id')) || Number(searchParams.get('projectId'));
  
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('tasks');

  useEffect(() => {
    if (projectId) {
      fetchProject();
      fetchTasks();
      fetchMembers();
      fetchTags();
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const res = await getProject(projectId);
      setProject(res.project || res);
    } catch (error) {
      message.error('获取项目详情失败');
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await getProjectTasks(projectId);
      setTasks(res.tasks || res.data || []);
    } catch (error) {
      message.error('获取任务列表失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await getProjectMembers(projectId);
      setMembers(res.members || res.data || []);
    } catch (error) {
      console.error('获取成员失败', error);
    }
  };

  const fetchTags = async () => {
    try {
      const res = await getProjectTags(projectId);
      setTags(res.tags || res.data || []);
    } catch (error) {
      console.error('获取标签失败', error);
    }
  };

  // 统计任务
  const todoCount = tasks.filter(t => t.status === 1).length;
  const inProgressCount = tasks.filter(t => t.status === 2).length;
  const doneCount = tasks.filter(t => t.status === 3).length;

  const columns = [
    {
      title: '任务名称',
      dataIndex: 'title',
      render: (_: any, record: any) => (
        <Space>
          {record.status === 3 ? <CheckCircleOutlined style={{ color: '#52c41a' }} /> : 
           record.status === 2 ? <SyncOutlined spin style={{ color: '#1890ff' }} /> :
           <ClockCircleOutlined style={{ color: '#d9d9d9' }} />}
          <a>{record.title}</a>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: number) => {
        const map: Record<number, { text: string; color: string }> = {
          1: { text: '待办', color: 'default' },
          2: { text: '进行中', color: 'processing' },
          3: { text: '已完成', color: 'success' },
        };
        const item = map[status] || map[1];
        return <Tag color={item.color}>{item.text}</Tag>;
      },
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      width: 80,
      render: (priority: number) => {
        const map: Record<number, string> = { 1: '紧急', 2: '高', 3: '中', 4: '低' };
        const colorMap: Record<number, string> = { 1: 'red', 2: 'orange', 3: 'blue', 4: 'default' };
        return <Tag color={colorMap[priority] || 'default'}>{map[priority] || '-'}</Tag>;
      },
    },
    {
      title: '负责人',
      dataIndex: 'assignee_name',
      width: 100,
      render: (name: string) => name || '-',
    },
    {
      title: '截止日期',
      dataIndex: 'end_date',
      width: 120,
      render: (val: string) => val ? new Date(val).toLocaleDateString() : '-',
    },
    {
      title: '标签',
      dataIndex: 'tags',
      width: 150,
      render: (_: any, record: any) => (
        <Space wrap>
          {record.tags?.map((tag: any) => (
            <Tag key={tag.id} color={tag.color}>{tag.name}</Tag>
          ))}
        </Space>
      ),
    },
  ];

  const tabItems = [
    {
      key: 'tasks',
      label: '任务列表',
      children: (
        <ProTable
          loading={loading}
          dataSource={tasks}
          columns={columns}
          rowKey="id"
          search={false}
          toolBarRender={() => [
            <Button type="primary" icon={<PlusOutlined />} key="add">
              新建任务
            </Button>,
          ]}
          pagination={{ pageSize: 10 }}
        />
      ),
    },
    {
      key: 'members',
      label: '项目成员',
      children: (
        <Row gutter={16}>
          {members.map((member: any) => (
            <Col span={6} key={member.id}>
              <ProCard hoverable>
                <Avatar size={48} style={{ backgroundColor: '#1890ff' }}>
                  {member.name?.charAt(0) || 'U'}
                </Avatar>
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontWeight: 500 }}>{member.name || member.username}</div>
                  <div style={{ color: '#888', fontSize: 12 }}>{member.role || '成员'}</div>
                </div>
              </ProCard>
            </Col>
          ))}
          {members.length === 0 && <Col span={24}><Empty description="暂无成员" /></Col>}
        </Row>
      ),
    },
    {
      key: 'tags',
      label: '标签管理',
      children: (
        <Space wrap>
          {tags.map((tag: any) => (
            <Tag key={tag.id} color={tag.color} style={{ padding: '4px 12px' }}>
              {tag.name}
            </Tag>
          ))}
          {tags.length === 0 && <Empty description="暂无标签" />}
        </Space>
      ),
    },
    {
      key: 'settings',
      label: '项目设置',
      children: <div>项目设置内容...</div>,
    },
  ];

  return (
    <PageContainer
      title={project?.name || '项目详情'}
      subTitle={project?.description || '项目描述'}
      extra={[
        <Button key="edit">编辑项目</Button>,
        <Button key="more">更多</Button>,
      ]}
    >
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <ProCard>
            <Statistic
              title="待办任务"
              value={todoCount}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#d9d9d9' }}
            />
          </ProCard>
        </Col>
        <Col span={6}>
          <ProCard>
            <Statistic
              title="进行中"
              value={inProgressCount}
              prefix={<SyncOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </ProCard>
        </Col>
        <Col span={6}>
          <ProCard>
            <Statistic
              title="已完成"
              value={doneCount}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </ProCard>
        </Col>
        <Col span={6}>
          <ProCard>
            <Statistic
              title="总任务"
              value={tasks.length}
            />
          </ProCard>
        </Col>
      </Row>

      <ProCard>
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
      </ProCard>
    </PageContainer>
  );
};

export default ProjectDetailPage;
