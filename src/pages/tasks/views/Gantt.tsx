import { useState, useEffect } from 'react';
import { useSearchParams } from '@umijs/max';
import { PageContainer, ProCard, ProTable } from '@ant-design/pro-components';
import { Card, Row, Col, Select, Space, Tag, Button, message, Tooltip } from 'antd';
import { getProject, getGanttData } from '@/services/ant-design-pro/api';
import { 
  PlusOutlined, 
  LeftOutlined, 
  RightOutlined, 
  ZoomInOutlined, 
  ZoomOutOutlined 
} from '@ant-design/icons';

const GanttPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectId = Number(searchParams.get('projectId')) || Number(searchParams.get('projectId')) || 1;
  
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [zoom, setZoom] = useState<number>(1); // 缩放级别

  useEffect(() => {
    if (projectId) {
      fetchData();
    }
  }, [projectId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [projectRes, ganttRes] = await Promise.all([
        getProject(projectId),
        getGanttData(projectId)
      ]);
      setProject(projectRes.project || projectRes);
      setTasks(ganttRes.data || ganttRes.tasks || []);
    } catch (e) {
      // 如果甘特图API失败任务，使用普通列表
      try {
        const projectRes = await getProject(projectId);
        setProject(projectRes.project || projectRes);
        // 使用项目任务作为甘特图数据
        const { getProjectTasks } = await import('@/services/ant-design-pro/api');
        const tasksRes = await getProjectTasks(projectId);
        setTasks(tasksRes.tasks || tasksRes.data || []);
      } catch (e) {
        message.error('获取数据失败');
      }
    } finally {
      setLoading(false);
    }
  };

  // 计算日期范围
  const getDateRange = () => {
    if (tasks.length === 0) {
      const today = new Date();
      return {
        start: new Date(today.getFullYear(), today.getMonth(), 1),
        end: new Date(today.getFullYear(), today.getMonth() + 2, 0)
      };
    }
    
    let minDate = new Date();
    let maxDate = new Date();
    
    tasks.forEach(task => {
      if (task.start_date) {
        const start = new Date(task.start_date);
        if (start < minDate) minDate = start;
      }
      if (task.end_date) {
        const end = new Date(task.end_date);
        if (end > maxDate) maxDate = end;
      }
    });
    
    // 扩展范围
    minDate = new Date(minDate.getFullYear(), minDate.getMonth() - 1, 1);
    maxDate = new Date(maxDate.getFullYear(), maxDate.getMonth() + 2, 0);
    
    return { start: minDate, end: maxDate };
  };

  const { start: dateStart, end: dateEnd } = getDateRange();
  const totalDays = Math.ceil((dateEnd.getTime() - dateStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  // 生成日期头部
  const generateDateHeaders = () => {
    const headers: { date: Date; isWeekend: boolean; isToday: boolean }[] = [];
    const current = new Date(dateStart);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    while (current <= dateEnd) {
      const isWeekend = current.getDay() === 0 || current.getDay() === 6;
      const isToday = current.getTime() === today.getTime();
      headers.push({
        date: new Date(current),
        isWeekend,
        isToday
      });
      current.setDate(current.getDate() + 1);
    }
    return headers;
  };

  const dateHeaders = generateDateHeaders();

  // 获取任务进度条位置
  const getTaskBarStyle = (task: any) => {
    if (!task.start_date || !task.end_date) {
      return { display: 'none' };
    }
    
    const taskStart = new Date(task.start_date);
    const taskEnd = new Date(task.end_date);
    
    const startDays = Math.max(0, Math.floor((taskStart.getTime() - dateStart.getTime()) / (1000 * 60 * 60 * 24)));
    const duration = Math.max(1, Math.ceil((taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    
    const dayWidth = 30 * zoom;
    
    return {
      left: startDays * dayWidth,
      width: duration * dayWidth,
      backgroundColor: task.status === 3 ? '#52c41a' : task.status === 2 ? '#1890ff' : '#d9d9d9',
    };
  };

  // 状态颜色
  const statusColors: Record<number, string> = {
    1: '#d9d9d9',
    2: '#1890ff',
    3: '#52c41a',
  };

  return (
    <PageContainer
      title="甘特图"
      subTitle={project?.name || '任务时间线视图'}
    >
      <ProCard>
        {/* 工具栏 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col flex="auto">
            <Space>
              <Select
                value={projectId}
                style={{ width: 200 }}
                disabled
                options={[{ value: projectId, label: project?.name || '当前项目' }]}
              />
              <Button icon={<ZoomOutOutlined />} onClick={() => setZoom(Math.max(0.5, zoom - 0.2))} />
              <span>{Math.round(zoom * 100)}%</span>
              <Button icon={<ZoomInOutlined />} onClick={() => setZoom(Math.min(2, zoom + 0.2))} />
            </Space>
          </Col>
          <Col>
            <Space>
              <Button>导出</Button>
              <Button type="primary" icon={<PlusOutlined />}>添加任务</Button>
            </Space>
          </Col>
        </Row>

        {/* 甘特图主体 */}
        <div style={{ overflowX: 'auto' }}>
          {/* 任务列表 + 时间轴 */}
          <Row gutter={0} style={{ minWidth: dateHeaders.length * 30 * zoom + 300 }}>
            {/* 左侧：任务列表 */}
            <div style={{ width: 250, flexShrink: 0, borderRight: '1px solid #f0f0f0' }}>
              <div style={{ 
                padding: '12px 16px', 
                fontWeight: 600, 
                borderBottom: '1px solid #f0f0f0',
                background: '#fafafa'
              }}>
                任务名称
              </div>
              {tasks.map((task, index) => (
                <div
                  key={task.id}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid #f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    height: 40,
                    background: index % 2 === 0 ? '#fff' : '#fafafa'
                  }}
                >
                  <Tooltip title={task.title}>
                    <span style={{ 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap',
                      flex: 1
                    }}>
                      {task.title}
                    </span>
                  </Tooltip>
                  <Tag color={task.status === 3 ? 'success' : task.status === 2 ? 'processing' : 'default'} style={{ marginLeft: 8 }}>
                    {task.status === 3 ? '完成' : task.status === 2 ? '进行中' : '待办'}
                  </Tag>
                </div>
              ))}
            </div>

            {/* 右侧：时间轴 */}
            <div style={{ flex: 1, overflowX: 'auto' }}>
              {/* 日期头部 */}
              <div style={{ 
                display: 'flex', 
                borderBottom: '1px solid #f0f0f0',
                background: '#fafafa',
                position: 'sticky',
                top: 0,
                zIndex: 10
              }}>
                {dateHeaders.map((header, index) => (
                  <div
                    key={index}
                    style={{
                      width: 30 * zoom,
                      flexShrink: 0,
                      padding: '8px 4px',
                      textAlign: 'center',
                      fontSize: 10,
                      color: header.isToday ? '#1890ff' : header.isWeekend ? '#ff4d4f' : '#666',
                      borderRight: '1px solid #f0f0f0',
                      background: header.isToday ? '#e6f7ff' : header.isWeekend ? '#fff1f0' : '#fafafa',
                      fontWeight: header.isToday ? 600 : 400
                    }}
                  >
                    <div>{header.date.getDate()}</div>
                    <div style={{ fontSize: 9 }}>
                      {['日', '一', '二', '三', '四', '五', '六'][header.date.getDay()]}
                    </div>
                  </div>
                ))}
              </div>

              {/* 任务进度条 */}
              {tasks.map((task, index) => (
                <div
                  key={task.id}
                  style={{
                    height: 40,
                    borderBottom: '1px solid #f0f0f0',
                    position: 'relative',
                    background: index % 2 === 0 ? '#fff' : '#fafafa'
                  }}
                >
                  {/* 进度条 */}
                  {task.start_date && task.end_date && (
                    <Tooltip title={`${task.title} (${task.start_date} ~ ${task.end_date})`}>
                      <div
                        style={{
                          position: 'absolute',
                          top: 10,
                          height: 20,
                          borderRadius: 4,
                          ...getTaskBarStyle(task),
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: 10,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      >
                        {task.progress > 0 && `${task.progress}%`}
                      </div>
                    </Tooltip>
                  )}
                  
                  {/* 网格线 */}
                  {dateHeaders.map((header, i) => (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        left: i * 30 * zoom,
                        top: 0,
                        bottom: 0,
                        width: 1,
                        background: header.isToday ? '#1890ff' : '#f0f0f0',
                        opacity: header.isWeekend ? 0.5 : 0.3
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </Row>
        </div>

        {tasks.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>
            暂无任务数据，请先添加项目任务
          </div>
        )}
      </ProCard>
    </PageContainer>
  );
};

export default GanttPage;
