import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Card, Row, Col, List, Button, Modal, Form, Input, Select, Space, Tag, message, Empty, Progress } from 'antd';
import { useState, useEffect } from 'react';
import { request } from '@umijs/max';
import { PlusOutlined, DragOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

// 默认流程步骤（不同行业）
const defaultWorkflows: Record<number, { name: string; icon: string }[]> = {
  1: [ // 软件开发
    { name: '需求分析', icon: 'FileTextOutlined' },
    { name: 'UI设计', icon: 'PictureOutlined' },
    { name: '开发', icon: 'CodeOutlined' },
    { name: '测试', icon: 'BugOutlined' },
    { name: '部署', icon: 'CloudUploadOutlined' },
    { name: '验收', icon: 'CheckCircleOutlined' },
  ],
  2: [ // 制造业
    { name: '需求确认', icon: 'FileTextOutlined' },
    { name: '方案设计', icon: 'BuildOutlined' },
    { name: '生产准备', icon: 'ToolOutlined' },
    { name: '生产加工', icon: 'SettingOutlined' },
    { name: '质检', icon: 'SafetyCertificateOutlined' },
    { name: '出货', icon: 'RocketOutlined' },
  ],
  3: [ // 建筑工程
    { name: '立项', icon: 'FileTextOutlined' },
    { name: '设计', icon: 'BuildOutlined' },
    { name: '招投标', icon: 'AuditOutlined' },
    { name: '施工', icon: 'ToolOutlined' },
    { name: '监理', icon: 'SafetyCertificateOutlined' },
    { name: '验收', icon: 'CheckCircleOutlined' },
    { name: '结算', icon: 'AccountBookOutlined' },
  ],
  5: [ // 市场营销
    { name: '策划', icon: 'FileTextOutlined' },
    { name: '准备', icon: 'ToolOutlined' },
    { name: '执行', icon: 'PlayCircleOutlined' },
    { name: '复盘', icon: 'BarChartOutlined' },
  ],
};

export default function WorkflowConfig() {
  const [industries, setIndustries] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<number>(1);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [steps, setSteps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => { loadIndustries(); }, []);
  useEffect(() => { if (industries.length) loadTemplates(); }, [selectedIndustry]);

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
      const list = res.templates || [];
      setTemplates(list);
      if (list.length > 0) {
        setSelectedTemplate(list[0]);
        loadWorkflowSteps(list[0].id);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const loadWorkflowSteps = async (templateId: number) => {
    try {
      const res = await request<any>(`/api/v1/dynamic/templates/${templateId}`, { method: 'GET' });
      // 如果没有工作流，使用默认步骤
      if (res.template?.workflows?.[0]?.steps) {
        setSteps(res.template.workflows[0].steps);
      } else {
        // 使用默认步骤
        const defaultSteps = defaultWorkflows[selectedIndustry] || defaultWorkflows[1];
        setSteps(defaultSteps.map((s, i) => ({
          id: -1 - i,
          name: s.name,
          icon: s.icon,
          sort_order: i,
          required: 1,
        })));
      }
    } catch (e) {
      // 使用默认步骤
      const defaultSteps = defaultWorkflows[selectedIndustry] || defaultWorkflows[1];
      setSteps(defaultSteps.map((s, i) => ({
        id: -1 - i,
        name: s.name,
        icon: s.icon,
        sort_order: i,
        required: 1,
      })));
    }
  };

  const handleStepUp = (index: number) => {
    if (index === 0) return;
    const newSteps = [...steps];
    [newSteps[index - 1], newSteps[index]] = [newSteps[index], newSteps[index - 1]];
    newSteps.forEach((s, i) => s.sort_order = i);
    setSteps(newSteps);
  };

  const handleStepDown = (index: number) => {
    if (index === steps.length - 1) return;
    const newSteps = [...steps];
    [newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]];
    newSteps.forEach((s, i) => s.sort_order = i);
    setSteps(newSteps);
  };

  const handleAddStep = async () => {
    try {
      const values = await form.validateFields();
      const newStep = {
        ...values,
        id: Date.now(),
        sort_order: steps.length,
      };
      setSteps([...steps, newStep]);
      setModalOpen(false);
      form.resetFields();
      message.success('添加成功');
    } catch (e) {}
  };

  const handleDeleteStep = (id: number) => {
    setSteps(steps.filter(s => s.id !== id));
    message.success('删除成功');
  };

  const industryColors: Record<number, string> = {
    1: 'blue', 2: 'green', 3: 'orange', 4: 'default',
    5: 'purple', 6: 'red', 7: 'cyan', 8: 'magenta',
  };

  return (
    <PageContainer>
      <Row gutter={16}>
        <Col span={6}>
          <ProCard title="选择行业">
            <List
              size="small"
              dataSource={industries}
              renderItem={item => (
                <List.Item 
                  style={{ 
                    cursor: 'pointer', 
                    background: selectedIndustry === item.id ? '#e6f7ff' : 'transparent',
                    padding: '8px 12px'
                  }}
                  onClick={() => { setSelectedIndustry(item.id); }}
                >
                  <Tag color={industryColors[item.id]}>{item.name}</Tag>
                </List.Item>
              )}
            />
          </ProCard>
        </Col>
        <Col span={6}>
          <ProCard title="选择模板">
            <List
              size="small"
              dataSource={templates}
              renderItem={item => (
                <List.Item 
                  style={{ 
                    cursor: 'pointer', 
                    background: selectedTemplate?.id === item.id ? '#e6f7ff' : 'transparent',
                    padding: '8px 12px'
                  }}
                  onClick={() => { setSelectedTemplate(item); loadWorkflowSteps(item.id); }}
                >
                  {item.name}
                  {item.is_default === 1 && <Tag color="blue" style={{ marginLeft: 8 }}>默认</Tag>}
                </List.Item>
              )}
            />
          </ProCard>
        </Col>
        <Col span={12}>
          <ProCard 
            title="工作流步骤（拖拽调整顺序）"
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
                添加步骤
              </Button>
            }
          >
            {steps.length === 0 ? (
              <Empty description="暂无步骤，请添加" />
            ) : (
              <List
                size="small"
                dataSource={steps}
                renderItem={(item, index) => (
                  <List.Item
                    style={{ 
                      background: '#fafafa', 
                      marginBottom: 8, 
                      borderRadius: 4,
                      padding: '12px 16px'
                    }}
                    actions={[
                      <Button 
                        type="text" 
                        size="small" 
                        icon={<DeleteOutlined />} 
                        onClick={() => handleDeleteStep(item.id)}
                      />,
                    ]}
                  >
                    <Space>
                      <Button 
                        type="text" 
                        size="small" 
                        icon={<DragOutlined />} 
                        disabled={index === 0}
                        onClick={() => handleStepUp(index)}
                      />
                      <Button 
                        type="text" 
                        size="small" 
                        disabled={index === steps.length - 1}
                        onClick={() => handleStepDown(index)}
                      >
                        ↓
                      </Button>
                      <Tag color="blue">{index + 1}</Tag>
                      <Tag icon={<DragOutlined />}>{item.name}</Tag>
                      {item.required === 1 && <Tag color="red">必填</Tag>}
                    </Space>
                  </List.Item>
                )}
              />
            )}
            <div style={{ marginTop: 16 }}>
              <Progress percent={Math.round((steps.filter(s => s.id > 0).length / steps.length) * 100)} status="active" />
              <div style={{ marginTop: 8, color: '#666' }}>
                共 {steps.length} 个步骤，已保存 {steps.filter(s => s.id > 0).length} 个
              </div>
            </div>
          </ProCard>
        </Col>
      </Row>

      <Modal
        title="添加步骤"
        open={modalOpen}
        onCancel={() => { setModalOpen(false); form.resetFields(); }}
        onOk={handleAddStep}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="步骤名称" rules={[{ required: true }]}>
            <Input placeholder="如：需求分析、开发、测试" />
          </Form.Item>
          <Form.Item name="icon" label="图标">
            <Input placeholder="如：CodeOutlined" />
          </Form.Item>
          <Form.Item name="required" label="是否必填" initialValue={1}>
            <Select>
              <Select.Option value={1}>是</Select.Option>
              <Select.Option value={0}>否</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={2} placeholder="步骤描述" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
}
