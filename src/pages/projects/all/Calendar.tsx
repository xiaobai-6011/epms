import { useState, useEffect } from 'react';
import { useSearchParams } from '@umijs/max';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Calendar, Badge, Card, Tag, Space, message, Select, Row, Col } from 'antd';
import { getProject, getProjectTasks } from '@/services/ant-design-pro/api';

const ProjectCalendarPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectId = Number(searchParams.get('id')) || Number(searchParams.get('projectId'));
  
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  useEffect(() => {
    if (projectId) {
      fetchData();
    }
  }, [projectId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [projectRes, tasksRes] = await Promise.all([
        getProject(projectId),
        getProjectTasks(projectId)
      ]);
      setProject(projectRes.project || projectRes);
      setTasks(tasksRes.tasks || tasksRes.data || []);
    } catch (error) {
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取某日期的任务
  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      if (!task.start_date && !task.end_date) return false;
      const taskStart = task.start_date ? new Date(task.start_date) : null;
      const taskEnd = task.end_date ? new Date(task.end_date) : date;
      const current = date;
      
      if (taskStart && taskEnd) {
        return current >= taskStart && current <= taskEnd;
      } else if (taskStart) {
        return current.toDateString() === taskStart.toDateString();
      }
      return false;
    });
  };

  // 状态颜色映射
  const statusColors: Record<number, string> = {
    1: '#d9d9d9',  // 待办
    2: '#1890ff',  // 进行中
    3: '#52c41a',  // 已完成
  };

  // 日期单元格渲染
  const dateCellRender = (date: Date) => {
    const dayTasks = getTasksForDate(date);
    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {dayTasks.slice(0, 3).map(task => (
          <li key={task.id} style={{ marginBottom: 2 }}>
            <Badge 
              color={statusColors[task.status] || '#1890ff'} 
              text={
                <span style={{ fontSize: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {task.title}
                </span>
              }
            />
          </li>
        ))}
        {dayTasks.length > 3 && (
          <li style={{ fontSize: 10, color: '#888' }}>+{dayTasks.length - 3} 更多</li>
        )}
      </ul>
    );
  };

  // 选中日期显示的任务列表
  const selectedDateTasks = getTasksForDate(selectedDate);

  return (
    <PageContainer
      title={project?.name || '项目日历'}
      subTitle="查看项目任务的日程安排"
    >
      <Row gutter={16}>
        <Col span={18}>
          <ProCard>
            <Calendar
              value={selectedDate}
              onChange={setSelectedDate}
              cellRender={(current, info) => {
                if (info.type === 'date') {
                  return dateCellRender(current);
                }
                return info.originNode;
              }}
              headerRender={({ value, onChange }) => {
                const year = value.year();
                const month = value.month();
                return (
                  <div style={{ padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space>
                      <Select
                        value={viewMode}
                        onChange={setViewMode}
                        style={{ width: 100 }}
                        options={[
                          { value: 'month', label: '月视图' },
                          { value: 'week', label: '周视图' },
                        ]}
                      />
                      <Select
                        value={year}
                        onChange={(val) => {
                          const newDate = value.clone().year(val);
                          onChange(newDate);
                        }}
                        style={{ width: 80 }}
                        options={Array.from({ length: 5 }, (_, i) => ({
                          value: year - 2 + i,
                          label: `${year - 2 + i}年`
                        }))}
                      />
                      <Select
                        value={month}
                        onChange={(val) => {
                          const newDate = value.clone().month(val);
                          onChange(newDate);
                        }}
                        style={{ width: 80 }}
                        options={Array.from({ length: 12 }, (_, i) => ({
                          value: i,
                          label: `${i + 1}月`
                        }))}
                      />
                    </Space>
                    <Space>
                      <a onClick={() => {
                        const newDate = new Date();
                        onChange(newDate);
                        setSelectedDate(newDate);
                      }}>今天</a>
                    </Space>
                  </div>
                );
              }}
            />
          </ProCard>
        </Col>
        <Col span={6}>
          <ProCard
            title={
              <Space>
                <span>{selectedDate.toLocaleDateString()}</span>
                <Tag>{selectedDateTasks.length} 个任务</Tag>
              </Space>
            }
          >
            <Space direction="vertical" style={{ width: '100%' }} size={12}>
              {selectedDateTasks.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#888', padding: 20 }}>
                  暂无任务
                </div>
              ) : (
                selectedDateTasks.map(task => (
                  <Card key={task.id} size="small" hoverable>
                    <Space>
                      <div 
                        style={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%', 
                          backgroundColor: statusColors[task.status] || '#1890ff' 
                        }} 
                      />
                      <div>
                        <div style={{ fontWeight: 500 }}>{task.title}</div>
                        {task.assignee_name && (
                          <div style={{ fontSize: 12, color: '#888' }}>负责人: {task.assignee_name}</div>
                        )}
                      </div>
                    </Space>
                  </Card>
                ))
              )}
            </Space>
          </ProCard>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default ProjectCalendarPage;
