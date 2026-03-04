import { PlusOutlined, EditOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined, ReloadOutlined } from '@ant-design/icons';
import { PageContainer, ProList } from '@ant-design/pro-components';
import { Button, Card, message, Modal, Form, Input, Select, Space, Tag, Steps, Empty, Row, Col, Divider, Tabs } from 'antd';
import { useState, useEffect } from 'react';
import { getWorkflows, createWorkflow, getWorkflow, createWorkflowStep, updateWorkflowStep, deleteWorkflowStep, updateStepOrder } from '@/services/ant-design-pro/api';

const { Step } = Steps;
const { TabPane } = Tabs;

// 模拟行业数据（实际应该从API获取）
const industries = [
  { id: 1, name: '软件开发', icon: 'code' },
  { id: 2, name: '建筑装修', icon: 'build' },
  { id: 3, name: '市场营销', icon: 'campaign' },
  { id: 4, name: '教育培训', icon: 'school' },
  { id: 5, name: '电商运营', icon: 'shop' },
  { id: 6, name: '咨询服务', icon: 'consult' },
];

const DesignerPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<number>(1);
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [stepModalVisible, setStepModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [stepForm] = Form.useForm();

  // 按行业加载工作流
  const fetchWorkflows = async (industryId: number) => {
    setLoading(true);
    try {
      const res = await getWorkflows({ industry_id: industryId });
      const workflowList = res.workflows || [];
      setWorkflows(workflowList);
      // 默认选中第一个
      if (workflowList.length > 0 && !selectedWorkflow) {
        setSelectedWorkflow(workflowList[0]);
      }
    } catch (e) {
      setWorkflows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows(selectedIndustry);
  }, [selectedIndustry]);

  const handleSelectIndustry = (id: number) => {
    setSelectedIndustry(id);
    setSelectedWorkflow(null);
  };

  const handleSelectWorkflow = async (workflow: any) => {
    try {
      const res = await getWorkflow(workflow.id);
      setSelectedWorkflow(res.workflow);
    } catch (e) {
      message.error('获取工作流详情失败');
    }
  };

  const handleAddWorkflow = () => {
    form.resetFields();
    form.setFieldsValue({ industry_id: selectedIndustry, is_linear: 1 });
    setModalVisible(true);
  };

  const handleSubmitWorkflow = async () => {
    try {
      const values = await form.validateFields();
      await createWorkflow(values);
      message.success('创建成功');
      setModalVisible(false);
      fetchWorkflows(selectedIndustry);
    } catch (e) {
      // 
    }
  };

  const handleAddStep = () => {
    if (!selectedWorkflow) {
      message.warning('请先选择一个工作流');
      return;
    }
    stepForm.resetFields();
    stepForm.setFieldsValue({ 
      sort_order: (selectedWorkflow.steps?.length || 0) + 1,
      required: 0
    });
    setStepModalVisible(true);
  };

  const handleSubmitStep = async () => {
    try {
      const values = await stepForm.validateFields();
      await createWorkflowStep(selectedWorkflow.id, values);
      message.success('步骤创建成功');
      setStepModalVisible(false);
      // 刷新当前工作流
      const res = await getWorkflow(selectedWorkflow.id);
      setSelectedWorkflow(res.workflow);
    } catch (e) {
      message.error('创建步骤失败');
    }
  };

  const handleMoveStep = async (stepId: number, direction: 'up' | 'down') => {
    if (!selectedWorkflow || !selectedWorkflow.steps) return;
    
    const steps = [...selectedWorkflow.steps];
    const index = steps.findIndex(s => s.id === stepId);
    if (index === -1) return;
    
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === steps.length - 1) return;
    
    // 交换排序
    const newSteps = [...steps];
    const temp = newSteps[index].sort_order;
    newSteps[index].sort_order = newSteps[index + (direction === 'up' ? -1 : 1)].sort_order;
    newSteps[index + (direction === 'up' ? -1 : 1)].sort_order = temp;
    
    try {
      await updateStepOrder(selectedWorkflow.id, {
        steps: newSteps.map((s, i) => ({ id: s.id, sort_order: i + 1 }))
      });
      const res = await getWorkflow(selectedWorkflow.id);
      setSelectedWorkflow(res.workflow);
      message.success('排序更新成功');
    } catch (e) {
      message.error('排序更新失败');
    }
  };

  const handleDeleteStep = async (stepId: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个步骤吗？',
      onOk: async () => {
        try {
          await deleteWorkflowStep(stepId);
          message.success('删除成功');
          const res = await getWorkflow(selectedWorkflow.id);
          setSelectedWorkflow(res.workflow);
        } catch (e) {
          message.error('删除失败');
        }
      },
    });
  };

  return (
    <PageContainer>
      <Row gutter={16}>
        {/* 左侧：行业列表 */}
        <Col span={5}>
          <Card 
            title="行业选择" 
            extra={<ReloadOutlined onClick={() => fetchWorkflows(selectedIndustry)} />}
            bodyStyle={{ padding: 0 }}
          >
            <div style={{ height: 500, overflow: 'auto' }}>
              {industries.map((industry) => (
                <div
                  key={industry.id}
                  onClick={() => handleSelectIndustry(industry.id)}
                  style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    background: selectedIndustry === industry.id ? '#e6f7ff' : 'transparent',
                    borderLeft: selectedIndustry === industry.id ? '3px solid #1890ff' : '3px solid transparent',
                  }}
                >
                  <Space>
                    <span>{industry.name}</span>
                    {selectedIndustry === industry.id && <Tag color="blue">当前</Tag>}
                  </Space>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* 中间：工作流列表 */}
        <Col span={5}>
          <Card 
            title={`${industries.find(i => i.id === selectedIndustry)?.name} - 工作流`}
            extra={<Button type="primary" size="small" icon={<PlusOutlined />} onClick={handleAddWorkflow}>
              新增工作流
            </Button>}
            bodyStyle={{ padding: 0 }}
          >
            <div style={{ height: 500, overflow: 'auto' }}>
              {workflows.length === 0 ? (
                <Empty description="暂无工作流" style={{ marginTop: 100 }} />
              ) : (
                workflows.map((workflow) => (
                  <div
                    key={workflow.id}
                    onClick={() => handleSelectWorkflow(workflow)}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      background: selectedWorkflow?.id === workflow.id ? '#e6f7ff' : 'transparent',
                      borderLeft: selectedWorkflow?.id === workflow.id ? '3px solid #1890ff' : '3px solid transparent',
                    }}
                  >
                    <div style={{ fontWeight: 500 }}>{workflow.name}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>
                      {workflow.steps?.length || 0} 个步骤 | {workflow.is_linear === 1 ? '线性' : '可跳过'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </Col>

        {/* 右侧：步骤详情 */}
        <Col span={14}>
          <Card 
            title={selectedWorkflow ? `${selectedWorkflow.name} - 步骤配置` : '请选择工作流'}
            extra={selectedWorkflow && (
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAddStep}>
                新增步骤
              </Button>
            )}
          >
            {selectedWorkflow ? (
              <div style={{ minHeight: 400 }}>
                <Steps direction="vertical" current={-1}>
                  {selectedWorkflow.steps?.map((step: any, index: number) => (
                    <Step
                      key={step.id}
                      title={
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Space>
                            <Tag color="blue">{index + 1}</Tag>
                            <span style={{ fontWeight: 500 }}>{step.name}</span>
                            {step.required === 1 && <Tag color="red">必填</Tag>}
                          </Space>
                          <Space>
                            <Button 
                              type="text" 
                              size="small" 
                              icon={<ArrowUpOutlined />} 
                              disabled={index === 0}
                              onClick={(e) => { e.stopPropagation(); handleMoveStep(step.id, 'up'); }}
                            />
                            <Button 
                              type="text" 
                              size="small" 
                              icon={<ArrowDownOutlined />} 
                              disabled={index === (selectedWorkflow.steps?.length || 1) - 1}
                              onClick={(e) => { e.stopPropagation(); handleMoveStep(step.id, 'down'); }}
                            />
                            <Button 
                              type="text" 
                              danger 
                              size="small" 
                              icon={<DeleteOutlined />}
                              onClick={(e) => { e.stopPropagation(); handleDeleteStep(step.id); }}
                            />
                          </Space>
                        </div>
                      }
                      description={
                        <div style={{ color: '#666' }}>
                          {step.description || '无描述'}
                          {step.deadline_days > 0 && (
                            <Tag color="orange" style={{ marginLeft: 8 }}>期限: {step.deadline_days}天</Tag>
                          )}
                        </div>
                      }
                    />
                  ))}
                </Steps>
                {(!selectedWorkflow.steps || selectedWorkflow.steps.length === 0) && (
                  <Empty description="暂无步骤，点击右上角新增步骤" style={{ marginTop: 50 }} />
                )}
              </div>
            ) : (
              <Empty description="请从左侧选择行业和工作流" style={{ marginTop: 100 }} />
            )}
          </Card>
        </Col>
      </Row>

      {/* 新增工作流弹窗 */}
      <Modal
        title="新增工作流"
        open={modalVisible}
        onOk={handleSubmitWorkflow}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="industry_id" label="所属行业" rules={[{ required: true }]}>
            <Select disabled>
              {industries.map(i => <Select.Option key={i.id} value={i.id}>{i.name}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="name" label="工作流名称" rules={[{ required: true, message: '请输入工作流名称' }]}>
            <Input placeholder="例如：软件开发流程" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea placeholder="请输入描述" />
          </Form.Item>
          <Form.Item name="is_linear" label="流程类型" initialValue={1}>
            <Select>
              <Select.Option value={1}>线性流程（必须按顺序完成）</Select.Option>
              <Select.Option value={0}>可跳过（可以跳过某些步骤）</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 新增步骤弹窗 */}
      <Modal
        title="新增步骤"
        open={stepModalVisible}
        onOk={handleSubmitStep}
        onCancel={() => setStepModalVisible(false)}
      >
        <Form form={stepForm} layout="vertical">
          <Form.Item name="name" label="步骤名称" rules={[{ required: true, message: '请输入步骤名称' }]}>
            <Input placeholder="例如：需求分析" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea placeholder="请输入步骤描述" />
          </Form.Item>
          <Form.Item name="sort_order" label="排序">
            <Input type="number" placeholder="数字越小越靠前" />
          </Form.Item>
          <Form.Item name="required" label="是否必填" initialValue={0}>
            <Select>
              <Select.Option value={0}>可选</Select.Option>
              <Select.Option value={1}>必填</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="deadline_days" label="处理期限(天)">
            <Input type="number" placeholder="0表示不限" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default DesignerPage;
