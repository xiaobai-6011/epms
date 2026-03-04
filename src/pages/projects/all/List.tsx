import { PlusOutlined, EditOutlined, DeleteOutlined, ProjectOutlined, TeamOutlined, CalendarOutlined } from '@ant-design/icons';
import { PageContainer, ProTable, ProCard } from '@ant-design/pro-components';
import { Button, message, Modal, Form, Input, Select, Space, Tag, Avatar, Tooltip, Row, Col, Statistic, Progress } from 'antd';
import { useState, useEffect } from 'react';
import { getProjects, createProject, updateProject, deleteProject, getProjectMembers } from '@/services/ant-design-pro/api';

const statusMap: Record<number, { text: string; color: string }> = {
  1: { text: '进行中', color: 'processing' },
  2: { text: '已完成', color: 'success' },
  3: { text: '已暂停', color: 'warning' },
  4: { text: '已归档', color: 'default' },
};

const ProjectListPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getProjects();
      const projects = res.projects || res.data || [];
      setDataSource(projects);
    } catch (e) {
      message.error('获取项目列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({ status: 1 });
    setModalVisible(true);
  };

  const handleEdit = (record: any) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个项目吗？此操作不可恢复！',
      onOk: async () => {
        try {
          await deleteProject(id);
          message.success('删除成功');
          fetchData();
        } catch (e) {
          message.error('删除失败');
        }
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingId) {
        await updateProject(editingId, values);
        message.success('更新成功');
      } else {
        await createProject(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchData();
    } catch (e) {
      // 
    }
  };

  const columns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      render: (_: any, record: any) => (
        <Space>
          <ProjectOutlined style={{ color: '#1890ff' }} />
          <a>{record.name}</a>
        </Space>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      ellipsis: true,
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (status: number) => {
        const item = statusMap[status] || statusMap[1];
        return <Tag color={item.color}>{item.text}</Tag>;
      },
    },
    {
      title: '成员',
      dataIndex: 'member_count',
      width: 80,
      render: (_: any, record: any) => (
        <Tooltip title="点击查看成员">
          <Avatar.Group maxCount={3}>
            <Avatar style={{ backgroundColor: '#1890ff' }}>A</Avatar>
            <Avatar style={{ backgroundColor: '#52c41a' }}>B</Avatar>
          </Avatar.Group>
        </Tooltip>
      ),
    },
    {
      title: '进度',
      dataIndex: 'progress',
      width: 100,
      render: (progress: number) => (
        <Progress percent={progress || 0} size="small" />
      ),
    },
    {
      title: '开始日期',
      dataIndex: 'start_date',
      width: 120,
      render: (val: string) => val ? new Date(val).toLocaleDateString() : '-',
    },
    {
      title: '截止日期',
      dataIndex: 'end_date',
      width: 120,
      render: (val: string) => val ? new Date(val).toLocaleDateString() : '-',
    },
    {
      title: '操作',
      width: 150,
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProCard>
        <ProTable
          loading={loading}
          dataSource={dataSource}
          columns={columns}
          rowKey="id"
          search={{
            filterType: 'light',
          }}
          toolBarRender={() => [
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新建项目
            </Button>,
          ]}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
          }}
        />
      </ProCard>

      <Modal
        title={editingId ? '编辑项目' : '新建项目'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="项目名称" rules={[{ required: true, message: '请输入项目名称' }]}>
            <Input placeholder="请输入项目名称" />
          </Form.Item>
          <Form.Item name="description" label="项目描述">
            <Input.TextArea placeholder="请输入项目描述" rows={3} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="status" label="状态" initialValue={1}>
                <Select>
                  <Select.Option value={1}>进行中</Select.Option>
                  <Select.Option value={2}>已完成</Select.Option>
                  <Select.Option value={3}>已暂停</Select.Option>
                  <Select.Option value={4}>已归档</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="priority" label="优先级" initialValue={2}>
                <Select>
                  <Select.Option value={1}>紧急</Select.Option>
                  <Select.Option value={2}>高</Select.Option>
                  <Select.Option value={3}>中</Select.Option>
                  <Select.Option value={4}>低</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="start_date" label="开始日期">
                <Input type="date" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="end_date" label="结束日期">
                <Input type="date" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="progress" label="进度" initialValue={0}>
            <Input type="number" min={0} max={100} placeholder="0-100" addonAfter="%" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default ProjectListPage;
