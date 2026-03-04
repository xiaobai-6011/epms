import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Modal, Form, Input, Select, DatePicker, message } from 'antd';
import { useState, useEffect } from 'react';
import { request } from '@umijs/max';
import dayjs from 'dayjs';

export default function MyTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [form] = Form.useForm();

  useEffect(() => { loadTasks(); loadProjects(); }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const res = await request<any>('/api/v1/tasks', { method: 'GET' });
      setTasks(res.tasks || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const loadProjects = async () => {
    try {
      const res = await request<any>('/api/v1/projects', { method: 'GET' });
      setProjects(res.projects || []);
    } catch (e) { console.error(e); }
  };

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      await request('/api/v1/tasks', { method: 'POST', data: values });
      message.success('创建成功');
      setModalOpen(false);
      form.resetFields();
      loadTasks();
    } catch (e) { message.error('创建失败'); }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '任务名称', dataIndex: 'title', key: 'title' },
    { title: '项目', dataIndex: ['project', 'name'], key: 'project_name' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (status: number) => ['待处理', '进行中', '已完成'][status] || '未知' },
    { title: '优先级', dataIndex: 'priority', key: 'priority', render: (p: number) => ['低', '中', '高'][p] || '低' },
    { title: '截止日期', dataIndex: 'due_date', key: 'due_date' },
  ];

  return (
    <PageContainer>
      <ProTable
        columns={columns}
        dataSource={tasks}
        loading={loading}
        rowKey="id"
        toolBarRender={() => [
          <Button type="primary" key="create" onClick={() => setModalOpen(true)}>新建任务</Button>
        ]}
      />
      <Modal title="新建任务" open={modalOpen} onCancel={() => setModalOpen(false)} onOk={handleCreate} width={600}>
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="任务名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="project_id" label="项目" rules={[{ required: true }]}>
            <Select>
              {projects.map(p => <Select.Option key={p.id} value={p.id}>{p.name}</Select.Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="priority" label="优先级" initialValue={1}>
            <Select>
              <Select.Option value={0}>低</Select.Option>
              <Select.Option value={1}>中</Select.Option>
              <Select.Option value={2}>高</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
}
