import { PlusOutlined, EditOutlined, DeleteOutlined, SwapOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, message, Modal, Form, Input, Select, Space, Tag, Card, Row, Col, Divider, Tabs, Empty, Tooltip } from 'antd';
import { useState, useEffect } from 'react';
import { getTaskStatuses, getTransitionRules, createTransitionRule, updateTransitionRule, deleteTransitionRule } from '@/services/ant-design-pro/api';

const TRIGGER_TYPES = [
  { value: 'manual', label: '手动触发', desc: '用户手动操作转换状态' },
  { value: 'auto', label: '自动触发', desc: '满足条件时自动转换' },
  { value: 'time', label: '定时触发', desc: '达到设定时间后自动转换' },
];

const ASSIGNEE_RULES = [
  { value: 'none', label: '无限制', desc: '任何人都可以处理' },
  { value: 'same', label: '同一人', desc: '必须由原处理人继续处理' },
  { value: 'specify', label: '指定人员', desc: '指定特定人员处理' },
  { value: 'role', label: '指定角色', desc: '指定角色成员处理' },
];

const RulesPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [rules, setRules] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>('list');
  const [form] = Form.useForm();

  const fetchStatuses = async () => {
    try {
      const res = await getTaskStatuses();
      setStatuses(res.data || []);
    } catch (e) {
      console.error('获取状态列表失败', error);
    }
  };

  const fetchRules = async () => {
    setLoading(true);
    try {
      const res = await getTransitionRules();
      setRules(res.data || []);
    } catch (e) {
      message.error('获取流转规则失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatuses();
    fetchRules();
  }, []);

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({ trigger_type: 'manual', assignee_rule: 'none', is_active: true });
    setModalVisible(true);
  };

  const handleEdit = (record: any) => {
    setEditingId(record.id);
    form.setFieldsValue({
      ...record,
      is_active: record.is_active === 1,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个流转规则吗？',
      onOk: async () => {
        try {
          await deleteTransitionRule(id);
          message.success('删除成功');
          fetchRules();
        } catch (e) {
          message.error('删除失败');
        }
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const submitData = {
        ...values,
        is_active: values.is_active ? 1 : 0,
      };
      
      if (editingId) {
        await updateTransitionRule(editingId, submitData);
        message.success('更新成功');
      } else {
        await createTransitionRule(submitData);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchRules();
    } catch (e) {
      // 
    }
  };

  // 构建状态流转图数据
  const renderFlowChart = () => {
    if (statuses.length === 0 || rules.length === 0) {
      return <Empty description="暂无流转规则，请先创建状态和规则" />;
    }

    // 按起始状态分组
    const statusMap: Record<number, any> = {};
    statuses.forEach(s => statusMap[s.id] = s);

    const fromGroups: Record<number, any[]> = {};
    rules.forEach(rule => {
      if (!fromGroups[rule.from_status_id]) {
        fromGroups[rule.from_status_id] = [];
      }
      fromGroups[rule.from_status_id].push(rule);
    });

    return (
      <Row gutter={[16, 24]}>
        {statuses.map(status => (
          <Col span={24} key={status.id}>
            <Card 
              size="small"
              title={
                <Space>
                  <span style={{ 
                    display: 'inline-block', 
                    width: 12, 
                    height: 12, 
                    backgroundColor: status.color || '#1890ff',
                    borderRadius: 2
                  }} />
                  <span>{status.name}</span>
                </Space>
              }
              style={{ background: '#fafafa' }}
            >
              {fromGroups[status.id]?.length ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                  <span>可以流转到：</span>
                  {fromGroups[status.id].map((rule: any) => {
                    const toStatus = statusMap[rule.to_status_id];
                    return (
                      <Tag 
                        key={rule.id} 
                        color={toStatus?.color || 'blue'}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleEdit(rule)}
                      >
                        <Space>
                          <ArrowRightOutlined />
                          {toStatus?.name || '未知'}
                          <Tag color={rule.trigger_type === 'manual' ? 'blue' : rule.trigger_type === 'auto' ? 'green' : 'orange'}>
                            {rule.trigger_type === 'manual' ? '手动' : rule.trigger_type === 'auto' ? '自动' : '定时'}
                          </Tag>
                        </Space>
                      </Tag>
                    );
                  })}
                </div>
              ) : (
                <Empty description="暂无流转规则" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  const columns = [
    {
      title: '规则名称',
      dataIndex: 'name',
    },
    {
      title: '起始状态',
      dataIndex: 'from_status_id',
      render: (_: any, record: any) => (
        <Tag color={record.from_status?.color || 'blue'}>
          {record.from_status?.name || '-'}
        </Tag>
      ),
    },
    {
      title: '目标状态',
      dataIndex: 'to_status_id',
      render: (_: any, record: any) => (
        <Tag color={record.to_status?.color || 'green'}>
          {record.to_status?.name || '-'}
        </Tag>
      ),
    },
    {
      title: '触发方式',
      dataIndex: 'trigger_type',
      width: 100,
      render: (type: string) => {
        const item = TRIGGER_TYPES.find(t => t.value === type);
        return <Tooltip title={item?.desc}><Tag>{item?.label || type}</Tag></Tooltip>;
      },
    },
    {
      title: '处理人规则',
      dataIndex: 'assignee_rule',
      width: 100,
      render: (rule: string) => {
        const item = ASSIGNEE_RULES.find(r => r.value === rule);
        return <Tooltip title={item?.desc}><Tag>{item?.label || rule}</Tag></Tooltip>;
      },
    },
    {
      title: '启用',
      dataIndex: 'is_active',
      width: 60,
      render: (val: number) => val === 1 ? <Tag color="success">是</Tag> : <Tag>否</Tag>,
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
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        items={[
          {
            key: 'list',
            label: '规则列表',
            children: (
              <ProTable
                loading={loading}
                dataSource={rules}
                columns={columns}
                rowKey="id"
                toolBarRender={() => [
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    新增规则
                  </Button>,
                ]}
              />
            ),
          },
          {
            key: 'flow',
            label: '流转关系图',
            children: (
              <Card>
                <div style={{ minHeight: 400 }}>
                  {renderFlowChart()}
                </div>
              </Card>
            ),
          },
        ]}
      />

      <Modal
        title={editingId ? '编辑流转规则' : '新增流转规则'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="规则名称" rules={[{ required: true, message: '请输入规则名称' }]}>
            <Input placeholder="请输入规则名称" />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="from_status_id" label="起始状态" rules={[{ required: true, message: '请选择起始状态' }]}>
                <Select placeholder="请选择起始状态">
                  {statuses.map(s => (
                    <Select.Option key={s.id} value={s.id}>
                      <Space>
                        <span style={{ 
                          display: 'inline-block', 
                          width: 12, 
                          height: 12, 
                          backgroundColor: s.color,
                          borderRadius: 2
                        }} />
                        {s.name}
                      </Space>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="to_status_id" label="目标状态" rules={[{ required: true, message: '请选择目标状态' }]}>
                <Select placeholder="请选择目标状态">
                  {statuses.map(s => (
                    <Select.Option key={s.id} value={s.id}>
                      <Space>
                        <span style={{ 
                          display: 'inline-block', 
                          width: 12, 
                          height: 12, 
                          backgroundColor: s.color,
                          borderRadius: 2
                        }} />
                        {s.name}
                      </Space>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider>流转条件</Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="trigger_type" label="触发方式">
                <Select placeholder="请选择触发方式">
                  {TRIGGER_TYPES.map(t => (
                    <Select.Option key={t.value} value={t.value}>
                      <Tooltip title={t.desc}>{t.label}</Tooltip>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="assignee_rule" label="处理人规则">
                <Select placeholder="请选择处理人规则">
                  {ASSIGNEE_RULES.map(r => (
                    <Select.Option key={r.value} value={r.value}>
                      <Tooltip title={r.desc}>{r.label}</Tooltip>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="描述">
            <Input.TextArea placeholder="请输入规则描述，说明什么情况下会触发此流转" />
          </Form.Item>

          <Form.Item name="is_active" label="启用规则" valuePropName="checked" initialValue={true}>
            <SwapOutlined checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default RulesPage;
