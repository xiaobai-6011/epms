import { PlusOutlined, EditOutlined, DeleteOutlined, HolderOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, message, Modal, Form, Input, Select, ColorPicker, Switch, Card, Row, Col, Tag, Empty, Tooltip, Space } from 'antd';
import { useState, useEffect } from 'react';
import { getTaskStatuses, createTaskStatus, updateTaskStatus, deleteTaskStatus } from '@/services/ant-design-pro/api';

const STATUS_CATEGORIES = [
  { value: 'todo', label: '待办', color: '#d9d9d9' },
  { value: 'inprogress', label: '进行中', color: '#1890ff' },
  { value: 'review', label: '审核中', color: '#faad14' },
  { value: 'done', label: '已完成', color: '#52c41a' },
  { value: 'cancelled', label: '已取消', color: '#ff4d4f' },
];

const StatusPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getTaskStatuses();
      setDataSource(res.data || []);
    } catch (error) {
      message.error('获取状态列表失败');
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
    form.setFieldsValue({ color: '#1890ff', category: 'todo', is_default: false, is_active: true });
    setModalVisible(true);
  };

  const handleEdit = (record: any) => {
    setEditingId(record.id);
    form.setFieldsValue({
      ...record,
      is_default: record.is_default === 1,
      is_active: record.is_active === 1,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个状态吗？删除后使用该状态的任务将需要重新选择状态。',
      onOk: async () => {
        try {
          await deleteTaskStatus(id);
          message.success('删除成功');
          fetchData();
        } catch (error: any) {
          message.error(error.response?.data?.error || '删除失败');
        }
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const submitData = {
        ...values,
        is_default: values.is_default ? 1 : 0,
        is_active: values.is_active ? 1 : 0,
      };
      
      if (editingId) {
        await updateTaskStatus(editingId, submitData);
        message.success('更新成功');
      } else {
        await createTaskStatus(submitData);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchData();
    } catch (error) {
      // 
    }
  };

  // 按类别分组显示
  const groupedData = STATUS_CATEGORIES.map(cat => ({
    category: cat.value,
    label: cat.label,
    color: cat.color,
    statuses: dataSource.filter(s => s.category === cat.value),
  }));

  const columns = [
    {
      title: '排序',
      dataIndex: 'sort_order',
      width: 80,
    },
    {
      title: '状态名称',
      dataIndex: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: '颜色',
      dataIndex: 'color',
      width: 100,
      render: (color: string) => (
        <Space>
          <span style={{ 
            display: 'inline-block', 
            width: 16, 
            height: 16, 
            backgroundColor: color || '#1890ff',
            borderRadius: 4,
            border: '1px solid #d9d9d9'
          }} />
          <span style={{ fontSize: 12 }}>{color}</span>
        </Space>
      ),
    },
    {
      title: '默认',
      dataIndex: 'is_default',
      width: 60,
      render: (val: number) => val === 1 ? <Tag color="gold">默认</Tag> : '-',
    },
    {
      title: '启用',
      dataIndex: 'is_active',
      width: 60,
      render: (val: number) => val === 1 ? <Tag color="success">是</Tag> : <Tag color="default">否</Tag>,
    },
    {
      title: '操作',
      width: 120,
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
      <Card 
        title="任务状态管理" 
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增状态
          </Button>
        }
      >
        {/* 分类展示 */}
        <Row gutter={[16, 16]}>
          {groupedData.map(group => (
            <Col span={24} key={group.category}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: 8,
                padding: '8px 12px',
                background: group.color + '15',
                borderRadius: 4,
                borderLeft: `4px solid ${group.color}`
              }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{group.label}</span>
                <span style={{ marginLeft: 8, color: '#888', fontSize: 12 }}>
                  ({group.statuses.length} 个状态)
                </span>
              </div>
              
              {group.statuses.length === 0 ? (
                <Empty description={`暂无${group.label}状态`} style={{ margin: '16px 0' }} />
              ) : (
                <ProTable
                  loading={loading}
                  dataSource={group.statuses}
                  columns={columns}
                  rowKey="id"
                  pagination={false}
                  size="small"
                  search={false}
                  options={false}
                />
              )}
            </Col>
          ))}
        </Row>
      </Card>

      <Modal
        title={editingId ? '编辑状态' : '新增状态'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="状态名称" rules={[{ required: true, message: '请输入状态名称' }]}>
            <Input placeholder="例如：待处理、处理中、已完成等" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea placeholder="请输入描述，说明这个状态的用途" />
          </Form.Item>
          <Form.Item name="category" label="状态类别" rules={[{ required: true }]}>
            <Select placeholder="请选择状态类别">
              {STATUS_CATEGORIES.map(cat => (
                <Select.Option key={cat.value} value={cat.value}>
                  <Space>
                    <span style={{ 
                      display: 'inline-block', 
                      width: 12, 
                      height: 12, 
                      backgroundColor: cat.color,
                      borderRadius: 2
                    }} />
                    {cat.label}
                  </Space>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="color" label="状态颜色" initialValue="#1890ff">
            <ColorPicker format="hex" />
          </Form.Item>
          <Form.Item name="sort_order" label="排序" initialValue={0}>
            <Input type="number" placeholder="数字越小越靠前显示" />
          </Form.Item>
          <Form.Item name="icon" label="图标">
            <Input placeholder="可选，输入图标名称如 CheckCircleOutlined" />
          </Form.Item>
          <Form.Item name="is_default" label="设为默认状态" valuePropName="checked" initialValue={false}>
            <Switch checkedChildren="是" unCheckedChildren="否" />
          </Form.Item>
          <Form.Item name="is_active" label="启用状态" valuePropName="checked" initialValue={true}>
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default StatusPage;
