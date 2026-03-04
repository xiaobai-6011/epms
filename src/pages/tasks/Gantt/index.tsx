import { PageContainer } from '@ant-design/pro-components';
import { Card, Table } from 'antd';

const ganttData = [
  { id: 1, name: '任务A', start: '2026-03-01', end: '2026-03-05', progress: 80 },
  { id: 2, name: '任务B', start: '2026-03-03', end: '2026-03-10', progress: 50 },
  { id: 3, name: '任务C', start: '2026-03-05', end: '2026-03-15', progress: 30 },
];

export default function Gantt() {
  const columns = [
    { title: '任务', dataIndex: 'name', key: 'name' },
    { title: '开始日期', dataIndex: 'start', key: 'start' },
    { title: '结束日期', dataIndex: 'end', key: 'end' },
    { title: '进度', dataIndex: 'progress', key: 'progress', render: (p: number) => `${p}%` },
  ];

  return (
    <PageContainer>
      <Card title="甘特图">
        <Table columns={columns} dataSource={ganttData} rowKey="id" pagination={false} />
      </Card>
    </PageContainer>
  );
}
