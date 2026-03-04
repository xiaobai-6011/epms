/**
 * @name umi 的路由配置 - 三级菜单
 */
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { name: '登录', path: '/user/login', component: './user/login' },
    ],
  },
  // 首页/仪表盘 (一级)
  {
    path: '/dashboard',
    name: '首页',
    icon: 'DashboardOutlined',
    routes: [
      // 二级：工作台
      {
        path: '/dashboard/workplace',
        name: '工作台',
        routes: [
          { name: '待办事项', path: '/dashboard/workplace/todos', component: './dashboard/workplace/Todos' },
          { name: '我的任务', path: '/dashboard/workplace/my-tasks', component: './dashboard/workplace/MyTasks' },
          { name: '审批列表', path: '/dashboard/workplace/approvals', component: './dashboard/workplace/Approvals' },
        ],
      },
      // 二级：项目概览
      {
        path: '/dashboard/overview',
        name: '项目概览',
        routes: [
          { name: '项目进度', path: '/dashboard/overview/progress', component: './dashboard/overview/Progress' },
          { name: '近期动态', path: '/dashboard/overview/activity', component: './dashboard/overview/Activity' },
          { name: '关键指标', path: '/dashboard/overview/metrics', component: './dashboard/overview/Metrics' },
        ],
      },
      // 二级：个人设置
      {
        path: '/dashboard/settings',
        name: '个人设置',
        routes: [
          { name: '个人信息', path: '/dashboard/settings/profile', component: './dashboard/settings/Profile' },
          { name: '通知设置', path: '/dashboard/settings/notifications', component: './dashboard/settings/Notifications' },
          { name: '快捷入口', path: '/dashboard/settings/quick-entry', component: './dashboard/settings/QuickEntry' },
        ],
      },
    ],
  },
  // 项目管理 (一级)
  {
    path: '/projects',
    name: '项目管理',
    icon: 'ProjectOutlined',
    routes: [
      // 二级：所有项目
      {
        path: '/projects/all',
        name: '所有项目',
        routes: [
          { name: '项目列表', path: '/projects/all/list', component: './projects/all/List' },
          { name: '项目看板', path: '/projects/all/board', component: './projects/all/Board' },
          { name: '项目日历', path: '/projects/all/calendar', component: './projects/all/Calendar' },
        ],
      },
      // 项目详情（不在菜单显示）
      {
        path: '/projects/detail',
        name: '项目详情',
        hideInMenu: true,
        component: './projects/ProjectDetail',
      },
      // 二级：项目模板
      {
        path: '/projects/templates',
        name: '项目模板',
        routes: [
          { name: '模板库', path: '/projects/templates/list', component: './projects/templates/List' },
        ],
      },
      // 二级：项目组合
      {
        path: '/projects/portfolio',
        name: '项目组合',
        routes: [
          { name: '组合概览', path: '/projects/portfolio/overview', component: './projects/portfolio/Overview' },
          { name: '组合分析', path: '/projects/portfolio/analysis', component: './projects/portfolio/Analysis' },
          { name: '组合优先级', path: '/projects/portfolio/priority', component: './projects/portfolio/Priority' },
        ],
      },
      // 二级：项目归档
      {
        path: '/projects/archived',
        name: '项目归档',
        routes: [
          { name: '已归档项目', path: '/projects/archived/list', component: './projects/archived/List' },
          { name: '回收站', path: '/projects/archived/recycle', component: './projects/archived/Recycle' },
        ],
      },
    ],
  },
  // 任务与进度 (一级)
  {
    path: '/tasks',
    name: '任务与进度',
    icon: 'TaskOutlined',
    routes: [
      // 二级：任务视图
      {
        path: '/tasks/views',
        name: '任务视图',
        routes: [
          { name: '列表视图', path: '/tasks/views/list', component: './tasks/views/List' },
          { name: '看板视图', path: '/tasks/views/kanban', component: './tasks/views/Kanban' },
          { name: '甘特图', path: '/tasks/views/gantt', component: './tasks/views/Gantt' },
          { name: '日历视图', path: '/tasks/views/calendar', component: './tasks/views/Calendar' },
        ],
      },
      // 二级：我的任务
      {
        path: '/tasks/my',
        name: '我的任务',
        routes: [
          { name: '我负责的', path: '/tasks/my/responsible', component: './tasks/my/Responsible' },
          { name: '我参与的', path: '/tasks/my/joined', component: './tasks/my/Joined' },
          { name: '我创建的', path: '/tasks/my/created', component: './tasks/my/Created' },
        ],
      },
      // 二级：任务依赖
      {
        path: '/tasks/deps',
        name: '任务依赖',
        routes: [
          { name: '依赖关系图', path: '/tasks/deps/graph', component: './tasks/deps/Graph' },
          { name: '关键路径', path: '/tasks/deps/critical', component: './tasks/deps/Critical' },
        ],
      },
      // 二级：里程碑
      {
        path: '/tasks/milestones',
        name: '里程碑',
        routes: [
          { name: '里程碑列表', path: '/tasks/milestones/list', component: './tasks/milestones/List' },
          { name: '里程碑进度', path: '/tasks/milestones/progress', component: './tasks/milestones/Progress' },
        ],
      },
    ],
  },
  // 团队与资源 (一级)
  {
    path: '/team',
    name: '团队与资源',
    icon: 'TeamOutlined',
    routes: [
      // 二级：成员管理
      {
        path: '/team/members',
        name: '成员管理',
        routes: [
          { name: '成员列表', path: '/team/members/list', component: './team/members/List' },
          { name: '团队结构', path: '/team/members/structure', component: './team/members/Structure' },
          { name: '角色权限', path: '/team/members/roles', component: './team/members/Roles' },
        ],
      },
      // 二级：资源分配
      {
        path: '/team/resources',
        name: '资源分配',
        routes: [
          { name: '资源池', path: '/team/resources/pool', component: './team/resources/Pool' },
          { name: '分配情况', path: '/team/resources/allocation', component: './team/resources/Allocation' },
          { name: '资源日历', path: '/team/resources/calendar', component: './team/resources/Calendar' },
        ],
      },
      // 二级：团队日程
      {
        path: '/team/schedule',
        name: '团队日程',
        routes: [
          { name: '团队日历', path: '/team/schedule/calendar', component: './team/schedule/Calendar' },
          { name: '休假管理', path: '/team/schedule/leave', component: './team/schedule/Leave' },
          { name: '加班申请', path: '/team/schedule/overtime', component: './team/schedule/Overtime' },
        ],
      },
      // 二级：沟通协作
      {
        path: '/team/communication',
        name: '沟通协作',
        routes: [
          { name: '即时消息', path: '/team/communication/messages', component: './team/communication/Messages' },
          { name: '团队动态', path: '/team/communication/activity', component: './team/communication/Activity' },
          { name: '公告通知', path: '/team/communication/notices', component: './team/communication/Notices' },
        ],
      },
    ],
  },
  // 财务与成本 (一级)
  {
    path: '/finance',
    name: '财务与成本',
    icon: 'AccountBookOutlined',
    routes: [
      // 二级：预算管理
      {
        path: '/finance/budget',
        name: '预算管理',
        routes: [
          { name: '项目预算', path: '/finance/budget/project', component: './finance/budget/Project' },
          { name: '预算调整', path: '/finance/budget/adjust', component: './finance/budget/Adjust' },
          { name: '预算预警', path: '/finance/budget/warning', component: './finance/budget/Warning' },
        ],
      },
      // 二级：成本跟踪
      {
        path: '/finance/cost',
        name: '成本跟踪',
        routes: [
          { name: '实际成本', path: '/finance/cost/actual', component: './finance/cost/Actual' },
          { name: '成本对比', path: '/finance/cost/comparison', component: './finance/cost/Comparison' },
          { name: '成本明细', path: '/finance/cost/detail', component: './finance/cost/Detail' },
        ],
      },
      // 二级：支出管理
      {
        path: '/finance/expense',
        name: '支出管理',
        routes: [
          { name: '支出记录', path: '/finance/expense/record', component: './finance/expense/Record' },
          { name: '报销审批', path: '/finance/expense/reimburse', component: './finance/expense/Reimburse' },
          { name: '采购订单', path: '/finance/expense/purchase', component: './finance/expense/Purchase' },
        ],
      },
      // 二级：发票与合同
      {
        path: '/finance/contracts',
        name: '发票与合同',
        routes: [
          { name: '发票管理', path: '/finance/contracts/invoice', component: './finance/contracts/Invoice' },
          { name: '合同台账', path: '/finance/contracts/list', component: './finance/contracts/List' },
          { name: '收付款计划', path: '/finance/contracts/payment', component: './finance/contracts/Payment' },
        ],
      },
    ],
  },
  // 风险与问题 (一级)
  {
    path: '/risk',
    name: '风险与问题',
    icon: 'WarningOutlined',
    routes: [
      // 二级：风险登记册
      {
        path: '/risk/register',
        name: '风险登记册',
        routes: [
          { name: '风险列表', path: '/risk/register/list', component: './risk/register/List' },
          { name: '风险评估', path: '/risk/register/assessment', component: './risk/register/Assessment' },
          { name: '应对措施', path: '/risk/register/mitigation', component: './risk/register/Mitigation' },
        ],
      },
      // 二级：问题跟踪
      {
        path: '/risk/issues',
        name: '问题跟踪',
        routes: [
          { name: '问题列表', path: '/risk/issues/list', component: './risk/issues/List' },
          { name: '问题状态', path: '/risk/issues/status', component: './risk/issues/Status' },
          { name: '解决方案', path: '/risk/issues/solutions', component: './risk/issues/Solutions' },
        ],
      },
      // 二级：变更管理
      {
        path: '/risk/changes',
        name: '变更管理',
        routes: [
          { name: '变更请求', path: '/risk/changes/request', component: './risk/changes/Request' },
          { name: '变更日志', path: '/risk/changes/log', component: './risk/changes/Log' },
          { name: '变更审批', path: '/risk/changes/approval', component: './risk/changes/Approval' },
        ],
      },
    ],
  },
  // 文档与知识 (一级)
  {
    path: '/docs',
    name: '文档与知识',
    icon: 'FileTextOutlined',
    routes: [
      // 二级：文档中心
      {
        path: '/docs/center',
        name: '文档中心',
        routes: [
          { name: '项目文档', path: '/docs/center/project', component: './docs/center/Project' },
          { name: '文档库', path: '/docs/center/library', component: './docs/center/Library' },
          { name: '版本管理', path: '/docs/center/versions', component: './docs/center/Versions' },
        ],
      },
      // 二级：知识库
      {
        path: '/docs/knowledge',
        name: '知识库',
        routes: [
          { name: '知识文章', path: '/docs/knowledge/articles', component: './docs/knowledge/Articles' },
          { name: '最佳实践', path: '/docs/knowledge/practices', component: './docs/knowledge/Practices' },
          { name: '经验教训', path: '/docs/knowledge/lessons', component: './docs/knowledge/Lessons' },
        ],
      },
      // 二级：文件模板
      {
        path: '/docs/templates',
        name: '文件模板',
        routes: [
          { name: '模板库', path: '/docs/templates/list', component: './docs/templates/List' },
          { name: '上传模板', path: '/docs/templates/upload', component: './docs/templates/Upload' },
          { name: '模板分类', path: '/docs/templates/category', component: './docs/templates/Category' },
        ],
      },
      // 二级：回收站
      {
        path: '/docs/trash',
        name: '回收站',
        routes: [
          { name: '已删除文件', path: '/docs/trash/deleted', component: './docs/trash/Deleted' },
          { name: '恢复记录', path: '/docs/trash/recovery', component: './docs/trash/Recovery' },
        ],
      },
    ],
  },
  // 报表与分析 (一级)
  {
    path: '/reports',
    name: '报表与分析',
    icon: 'BarChartOutlined',
    routes: [
      // 二级：标准报表
      {
        path: '/reports/standard',
        name: '标准报表',
        routes: [
          { name: '项目进度报表', path: '/reports/standard/progress', component: './reports/standard/Progress' },
          { name: '人员工时报表', path: '/reports/standard/labor', component: './reports/standard/Labor' },
          { name: '成本报表', path: '/reports/standard/cost', component: './reports/standard/Cost' },
        ],
      },
      // 二级：自定义报表
      {
        path: '/reports/custom',
        name: '自定义报表',
        routes: [
          { name: '报表设计器', path: '/reports/custom/designer', component: './reports/custom/Designer' },
          { name: '保存的报表', path: '/reports/custom/saved', component: './reports/custom/Saved' },
          { name: '定时发送', path: '/reports/custom/schedule', component: './reports/custom/Schedule' },
        ],
      },
      // 二级：仪表盘配置
      {
        path: '/reports/dashboard',
        name: '仪表盘配置',
        routes: [
          { name: '新建仪表盘', path: '/reports/dashboard/new', component: './reports/dashboard/New' },
          { name: '图表库', path: '/reports/dashboard/charts', component: './reports/dashboard/Charts' },
          { name: '分享仪表盘', path: '/reports/dashboard/share', component: './reports/dashboard/Share' },
        ],
      },
      // 二级：数据透视
      {
        path: '/reports/pivot',
        name: '数据透视',
        routes: [
          { name: '多维分析', path: '/reports/pivot/analysis', component: './reports/pivot/Analysis' },
          { name: '导出数据', path: '/reports/pivot/export', component: './reports/pivot/Export' },
        ],
      },
    ],
  },
  // 系统设置 (一级)
  {
    path: '/settings',
    name: '系统设置',
    icon: 'SettingOutlined',
    routes: [
      // 二级：组织管理
      {
        path: '/settings/org',
        name: '组织管理',
        routes: [
          { name: '部门结构', path: '/settings/org/department', component: './settings/org/Department' },
          { name: '职位管理', path: '/settings/org/positions', component: './settings/org/Positions' },
          { name: '用户管理', path: '/settings/org/users', component: './settings/org/Users' },
        ],
      },
      // 二级：权限配置
      {
        path: '/settings/permissions',
        name: '权限配置',
        routes: [
          { name: '角色管理', path: '/settings/permissions/roles', component: './settings/permissions/Roles' },
          { name: '权限模板', path: '/settings/permissions/templates', component: './settings/permissions/Templates' },
          { name: '数据权限', path: '/settings/permissions/data', component: './settings/permissions/Data' },
        ],
      },
      // 二级：工作流配置
      {
        path: '/settings/workflow',
        name: '工作流配置',
        routes: [
          { name: '流程设计器', path: '/settings/workflow/designer', component: './settings/workflow/Designer' },
          { name: '状态管理', path: '/settings/workflow/status', component: './settings/workflow/Status' },
          { name: '流转规则', path: '/settings/workflow/rules', component: './settings/workflow/Rules' },
        ],
      },
      // 二级：集成中心
      {
        path: '/settings/integration',
        name: '集成中心',
        routes: [
          { name: '第三方应用', path: '/settings/integration/apps', component: './settings/integration/Apps' },
          { name: 'API管理', path: '/settings/integration/api', component: './settings/integration/API' },
          { name: 'Webhook配置', path: '/settings/integration/webhooks', component: './settings/integration/Webhooks' },
        ],
      },
      // 二级：系统日志
      {
        path: '/settings/logs',
        name: '系统日志',
        routes: [
          { name: '操作日志', path: '/settings/logs/operation', component: './settings/logs/Operation' },
          { name: '登录日志', path: '/settings/logs/login', component: './settings/logs/Login' },
          { name: '审计记录', path: '/settings/logs/audit', component: './settings/logs/Audit' },
        ],
      },
    ],
  },
  {
    path: '/',
    redirect: '/dashboard/workplace',
  },
  { component: '404', layout: false, path: './*' },
];
