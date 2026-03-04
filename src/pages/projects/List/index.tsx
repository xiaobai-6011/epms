import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Modal, Form, Input, Select, Progress, message, Tag } from 'antd';
import { useState, useEffect } from 'react';
import { request } from '@umijs/max';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';

const industryOptions = [
  { label: '软件开发', value: 'software' },
  { label: '制造业', value: 'manufacturing' },
  { label: '建筑工程', value: 'construction' },
  { label: '现场项目', value: 'field' },
  { label: '市场营销', value: 'marketing' },
  { label: '科研项目', value: 'research' },
  { label: '教育培训', value: 'education' },
  { label: '活动策划', value: 'events' },
];

const statusColors: Record<string, { color: string; text: string }> = {
  '进行中': { color: '#52c41a', text: '进行中' },
  '已停止': { color: '#f5222d', text: '已停止' },
  '异常': { color: '#faad14', text: '异常' },
  '未启动': { color: '#d9d9d9', text: '未启动' },
};

export default function ProjectList() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => { loadProjects(); }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await request<any>('/api/v1/projects', { method: 'GET' });
      // 模拟数据
      const mockData = [
        { id: 1, name: '项目管理系统', description: '开发一套项目管理系统', status: '进行中', progress: 75, industry: 'software', members: 5 },
        { id: 2, name: '官网重构', description: '重新设计公司官网', status: '进行中', progress: 50, industry: 'marketing', members: 3 },
        { id: 3, name: '工厂流水线升级', description: '生产线自动化改造', status: '未启动', progress: 0, industry: 'manufacturing', members: 8 },
        { id: 4, name: '智慧园区项目', description: '园区智能化改造', status: '异常', progress: 30, industry: 'construction', members: 12 },
      ];
      setProjects(mockData);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      await request('/api/v1/projects', { method: 'POST', data: values });
      message.success('创建成功');
      setModalOpen(false);
      form.resetFields();
      loadProjects();
    } catch (e) { message.error('创建失败'); }
  };

  const columns = [
    { title: '项目名称', dataIndex: 'name', key: 'name', width: 200 },
    { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status', 
      width: 100,
      render: (status: string) => (
        <span>
          <span style={{ 
            display: 'inline-block', 
            width: 8, 
            height: 8, 
            borderRadius: '50%', 
            backgroundColor: statusColors[status]?.color || '#d9d9d9',
            marginRight: 8 
          }} />
          {statusColors[status]?.text || status}
        </span>
      )
    },
    { 
      title: '进度', 
      dataIndex: 'progress', 
      key: 'progress',
      width: 150,
      render: (progress: number) => (
        <Progress percent={progress} size="small" status={progress === 100 ? 'success' : undefined} />
      )
    },
    { 
      title: '板块', 
      dataIndex: 'industry', 
      key: 'industry',
      width: 120,
      render: (industry: string) => {
        const opt = industryOptions.find(o => o.value === industry);
        return <Tag color="blue">{opt?.label || industry}</Tag>;
      }
    },
    { 
      title: '人数', 
      dataIndex: 'members', 
      key: 'members',
      width: 80,
      render: (count: number) => (
        <span><UserOutlined /> {count}</span>
      )
    },
  ];

  return (
    <PageContainer>
      <ProTable
        columns={columns}
        dataSource={projects}
        loading={loading}
        rowKey="id"
        toolBarRender={() => [
          <Button type="primary" key="create" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
            新建项目
          </Button>
        ]}
      />
      <Modal 
        title="新建项目" 
        open={modalOpen} 
        onCancel={() => setModalOpen(false)} 
        onOk={handleCreate}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="项目名称" rules={[{ required: true, message: '请输入项目名称' }]}>
            <Input placeholder="请输入项目名称" />
          </Form.Item>
          <Form.Item name="description" label="项目描述">
            <Input.TextArea rows={3} placeholder="请输入项目描述" />
          </Form.Item>
          <Form.Item name="industry" label="所属板块" rules={[{ required: true, message: '请选择所属板块' }]}>
            <Select placeholder="请选择所属板块" options={industryOptions} />
          </Form.Item>
          <Form.Item name="status" label="状态" initialValue="未启动">
            <Select>
              <Select.Option value="未启动">未启动</Select.Option>
              <Select.Option value="进行中">进行中</Select.Option>
              <Select.Option value="已停止">已停止</Select.Option>
              <Select.Option value="异常">异常</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
}
