import { PageContainer } from '@ant-design/pro-components';
import { Card, Col, Row, Tag } from 'antd';

const kanbanData = {
  todo: [{ id: 1, title: '任务1' }, { id: 2, title: '任务2' }],
  inProgress: [{ id: 3, title: '任务3' }],
  done: [{ id: 4, title: '任务4' }],
};

export default function Kanban() {
  const columns = [
    { title: '待处理', key: 'todo', color: 'default' },
    { title: '进行中', key: 'inProgress', color: 'processing' },
    { title: '已完成', key: 'done', color: 'success' },
  ];

  return (
    <PageContainer>
      <Row gutter={16}>
        {columns.map(col => (
          <Col span={8} key={col.key}>
            <Card title={col.title} bordered={false} style={{ background: '#f5f5f5' }}>
              {kanbanData[col.key as keyof typeof kanbanData]?.map(task => (
                <Card key={task.id} size="small" style={{ marginBottom: 8 }}>
                  {task.title}
                </Card>
              ))}
            </Card>
          </Col>
        ))}
      </Row>
    </PageContainer>
  );
}
