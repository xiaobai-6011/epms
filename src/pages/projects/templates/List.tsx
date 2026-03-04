import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Card, Row, Col, Tabs, Table, Button, Modal, Form, Input, Select, Space, Tag, message, Progress } from 'antd';
import { useState, useEffect } from 'react';
import { request } from '@umijs/max';
import { PlusOutlined, DragOutlined } from '@ant-design/icons';

const industryOptions = [
  { label: '软件开发', value: 1 },
  { label: '制造业', value: 2 },
  { label: '建筑工程', value: 3 },
  { label: '现场项目', value: 4 },
  { label: '市场营销', value: 5 },
  { label: '科研项目', value: 6 },
  { label: '教育培训', value: 7 },
  { label: '活动策划', value: 8 },
];

export default function TemplateList() {
  const [industries, setIndustries] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  useEffect(() => { loadIndustries(); }, []);
  useEffect(() => { loadTemplates(); }, [selectedIndustry]);

  const loadIndustries = async () => {
    try {
      const res = await request<any>('/api/v1/dynamic/industries', { method: 'GET' });
      setIndustries(res.industries || []);
    } catch (e) { console.error(e); }
  };

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const res = await request<any>('/api/v1/dynamic/templates', { 
        method: 'GET',
        params: { industry_id: selectedIndustry }
      });
      setTemplates(res.templates || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await request('/api/v1/dynamic/industries', { method: 'POST', data: values });
      message.success('创建成功');
      setModalOpen(false);
      form.resetFields();
      loadIndustries();
    } catch (e) { message.error('创建失败'); }
  };

  const handleTemplateSubmit = async () => {
    try {
      const values = await form.validateFields();
      values.industry_id = selectedIndustry;
      await request('/api/v1/dynamic/templates', { method: 'POST', data: values });
      message.success('创建成功');
      setTemplateModalOpen(false);
      form.resetFields();
      loadTemplates();
    } catch (e) { message.error('创建失败'); }
  };

  const templateColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '模板名称', dataIndex: 'name', key: 'name' },
    { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
    { title: '图标', dataIndex: 'icon', key: 'icon', render: (icon: string) => <Tag>{icon}</Tag> },
    { title: '默认', dataIndex: 'is_default', key: 'is_default', render: (v: number) => v === 1 ? <Tag color="blue">默认</Tag> : '-' },
    { title: '操作', key: 'action', render: (_: any, record: any) => (
      <Space>
        <Button type="link" onClick={() => { setSelectedTemplate(record); setFormValues(record); setTemplateModalOpen(true); }}>编辑</Button>
      </Space>
    )},
  ];

  const setFormValues = (record: any) => {
    form.setFieldsValue(record);
  };

  const industryTabs = industries.map(i => ({
    key: String(i.id),
    label: i.name,
  }));

  return (
    <PageContainer>
      <Card>
        <Tabs 
          activeKey={String(selectedIndustry)} 
          onChange={(key) => setSelectedIndustry(Number(key))}
          items={industryTabs}
        />
        <Table
          columns={templateColumns}
          dataSource={templates}
          loading={loading}
          rowKey="id"
          toolBarRender={() => [
            <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setTemplateModalOpen(true); }}>
              新增模板
            </Button>
          ]}
        />
      </Card>

      <Modal
        title="新增模板"
        open={templateModalOpen}
        onCancel={() => { setTemplateModalOpen(false); form.resetFields(); }}
        onOk={handleTemplateSubmit}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="模板名称" rules={[{ required: true }]}>
            <Input placeholder="如：软件开发标准模板" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="icon" label="图标">
            <Input placeholder="如：CodeOutlined" />
          </Form.Item>
          <Form.Item name="is_default" label="设为默认">
            <Select>
              <Select.Option value={1}>是</Select.Option>
              <Select.Option value={0}>否</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
}
