import { PageContainer } from '@ant-design/pro-components';
import { Card, Table, Button, Modal, Form, Input, Space, Tag, message, Popconfirm } from 'antd';
import { useState, useEffect } from 'react';
import { request } from '@umijs/max';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const iconOptions = [
  { label: '代码', value: 'CodeOutlined' },
  { label: '构建', value: 'BuildOutlined' },
  { label: '房屋', value: 'HomeOutlined' },
  { label: '环境', value: 'EnvironmentOutlined' },
  { label: '通知', value: 'NotificationOutlined' },
  { label: '实验', value: 'ExperimentOutlined' },
  { label: '阅读', value: 'ReadOutlined' },
  { label: '日历', value: 'CalendarOutlined' },
];

export default function IndustryList() {
  const [industries, setIndustries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  useEffect(() => { loadIndustries(); }, []);

  const loadIndustries = async () => {
    setLoading(true);
    try {
      const res = await request<any>('/api/v1/dynamic/industries', { method: 'GET' });
      setIndustries(res.industries || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingId) {
        await request(`/api/v1/dynamic/industries/${editingId}`, { method: 'PUT', data: values });
        message.success('更新成功');
      } else {
        await request('/api/v1/dynamic/industries', { method: 'POST', data: values });
        message.success('创建成功');
      }
      setModalOpen(false);
      form.resetFields();
      setEditingId(null);
      loadIndustries();
    } catch (e) { message.error('操作失败'); }
  };

  const handleDelete = async (id: number) => {
    try {
      await request(`/api/v1/dynamic/industries/${id}`, { method: 'DELETE' });
      message.success('删除成功');
      loadIndustries();
    } catch (e) { message.error('删除失败'); }
  };

  const handleEdit = (record: any) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '行业名称', dataIndex: 'name', key: 'name' },
    { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
    { title: '图标', dataIndex: 'icon', key: 'icon', render: (icon: string) => <Tag>{icon}</Tag> },
    { title: '排序', dataIndex: 'sort_order', key: 'sort_order', width: 80 },
    { title: '状态', dataIndex: 'is_active', key: 'is_active', render: (v: number) => <Tag color={v === 1 ? 'green' : 'red'}>{v === 1 ? '启用' : '禁用'}</Tag> },
    { 
      title: '操作', 
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确认删除?" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      )
    },
  ];

  return (
    <PageContainer>
      <Card>
        <Table
          columns={columns}
          dataSource={industries}
          loading={loading}
          rowKey="id"
          toolBarRender={() => [
            <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingId(null); form.resetFields(); setModalOpen(true); }}>
              新增行业
            </Button>
          ]}
        />
      </Card>
      <Modal
        title={editingId ? '编辑行业' : '新增行业'}
        open={modalOpen}
        onCancel={() => { setModalOpen(false); form.resetFields(); setEditingId(null); }}
        onOk={handleSubmit}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="行业名称" rules={[{ required: true, message: '请输入行业名称' }]}>
            <Input placeholder="如：软件开发、制造业" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} placeholder="行业描述" />
          </Form.Item>
          <Form.Item name="icon" label="图标">
            <Input placeholder="图标名称，如：CodeOutlined" />
          </Form.Item>
          <Form.Item name="sort_order" label="排序">
            <Input type="number" placeholder="数字越小越靠前" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
}
