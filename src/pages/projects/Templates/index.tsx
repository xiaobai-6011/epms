import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Card, Row, Col, Tag, Button, Progress, Avatar, Space } from 'antd';
import { UserOutlined, RocketOutlined, ArrowRightOutlined } from '@ant-design/icons';

const templates = [
  { 
    name: '软件开发', 
    industry: 'software', 
    desc: '适合软件研发项目', 
    color: 'blue',
    useCases: ['APP开发', '网站开发', '系统定制', '小程序开发'],
    features: ['任务管理', '代码评审', '版本控制', 'Bug追踪']
  },
  { 
    name: '制造业生产', 
    industry: 'manufacturing', 
    desc: '适合生产制造项目', 
    color: 'green',
    useCases: ['生产线管理', '设备维护', '质量管控', '供应链管理'],
    features: ['生产排程', '物料管理', '质检记录', '设备巡检']
  },
  { 
    name: '建筑工程', 
    industry: 'construction', 
    desc: '适合建筑施工项目', 
    color: 'orange',
    useCases: ['施工管理', '进度跟踪', '安全管理', '成本核算'],
    features: ['进度管理', '人员调度', '材料采购', '验收管理']
  },
  { 
    name: '现场项目', 
    industry: 'field', 
    desc: '适合现场跟进项目', 
    color: 'default',
    useCases: ['外派任务', '现场安装', '售后服务', '技术支持'],
    features: ['位置签到', '任务派发', '进度汇报', '客户确认']
  },
  { 
    name: '市场营销', 
    industry: 'marketing', 
    desc: '适合市场营销活动', 
    color: 'purple',
    useCases: ['活动策划', '广告投放', '品牌推广', '线下活动'],
    features: ['活动排期', '预算管理', '物料准备', '效果分析']
  },
  { 
    name: '科研项目', 
    industry: 'research', 
    desc: '适合科研课题管理', 
    color: 'red',
    useCases: ['课题研究', '实验管理', '论文撰写', '成果转化'],
    features: ['里程碑管理', '文献管理', '数据记录', '成果展示']
  },
  { 
    name: '教育培训', 
    industry: 'education', 
    desc: '适合教育培训项目', 
    color: 'cyan',
    useCases: ['课程开发', '培训实施', '学员管理', '效果评估'],
    features: ['课程排期', '学员进度', '作业管理', '成绩统计']
  },
  { 
    name: '活动策划', 
    industry: 'events', 
    desc: '适合各类活动项目管理', 
    color: 'magenta',
    useCases: ['年会策划', '展会活动', '会议组织', '庆典活动'],
    features: ['流程管理', '嘉宾邀请', '场地布置', '物料统筹']
  },
];

export default function Templates() {
  return (
    <PageContainer>
      <Row gutter={[16, 16]}>
        {templates.map((t, i) => (
          <Col span={12} key={i}>
            <ProCard hoverable bordered>
              <Card bordered={false}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Space>
                    <Tag color={t.color} icon={<RocketOutlined />}>{t.name}</Tag>
                  </Space>
                  <div style={{ fontSize: 14, color: '#666' }}>{t.desc}</div>
                  
                  <div>
                    <div style={{ fontWeight: 500, marginBottom: 8 }}>适用场景：</div>
                    <Space wrap>
                      {t.useCases.map((uc, idx) => (
                        <Tag key={idx}>{uc}</Tag>
                      ))}
                    </Space>
                  </div>
                  
                  <div>
                    <div style={{ fontWeight: 500, marginBottom: 8 }}>包含功能：</div>
                    <Space wrap>
                      {t.features.map((f, idx) => (
                        <Tag key={idx} color="blue">{f}</Tag>
                      ))}
                    </Space>
                  </div>
                  
                  <div style={{ marginTop: 16 }}>
                    <Button type="link" icon={<ArrowRightOutlined />}>
                      使用此模板创建项目
                    </Button>
                  </div>
                </Space>
              </Card>
            </ProCard>
          </Col>
        ))}
      </Row>
    </PageContainer>
  );
}
