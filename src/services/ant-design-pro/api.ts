// @ts-ignore
import { request } from '@umijs/max';

/** 获取当前的用户 GET /api/v1/auth/me */
export async function currentUser(options?: { [key: string]: any }) {
  const res = await request('/api/v1/auth/me', {
    method: 'GET',
    ...(options || {}),
  });
  // 后端直接返回用户数据，需要包装成 {data: ...} 格式
  return { data: res };
}

/** 退出登录接口 POST /api/v1/auth/logout */
export async function outLogin(options?: { [key: string]: any }) {
  return request('/api/v1/auth/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/v1/auth/login */
export async function login(body: any, options?: { [key: string]: any }) {
  const loginBody = {
    email: body.username || body.email,
    password: body.password,
  };
  return request('/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: loginBody,
    ...(options || {}),
  });
}

/** 注册接口 POST /api/v1/auth/register */
export async function register(body: any, options?: { [key: string]: any }) {
  return request('/api/v1/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// ========== 项目 API ==========

// 获取项目列表
export async function getProjects(params?: any, options?: { [key: string]: any }) {
  return request('/api/v1/projects', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

// 获取单个项目
export async function getProject(id: number, options?: { [key: string]: any }) {
  return request(`/api/v1/projects/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

// 创建项目
export async function createProject(body: any, options?: { [key: string]: any }) {
  return request('/api/v1/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 更新项目
export async function updateProject(id: number, body: any, options?: { [key: string]: any }) {
  return request(`/api/v1/projects/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 删除项目
export async function deleteProject(id: number, options?: { [key: string]: any }) {
  return request(`/api/v1/projects/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

// 获取项目成员
export async function getProjectMembers(projectId: number, options?: { [key: string]: any }) {
  return request(`/api/v1/projects/${projectId}/members`, {
    method: 'GET',
    ...(options || {}),
  });
}

// 添加项目成员
export async function addProjectMember(projectId: number, body: any, options?: { [key: string]: any }) {
  return request(`/api/v1/projects/${projectId}/members`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 移除项目成员
export async function removeProjectMember(projectId: number, userId: number, options?: { [key: string]: any }) {
  return request(`/api/v1/projects/${projectId}/members/${userId}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

// ========== 任务 API ==========

// 获取项目任务列表
export async function getProjectTasks(projectId: number, params?: any, options?: { [key: string]: any }) {
  return request(`/api/v1/projects/${projectId}/tasks`, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

// 获取甘特图数据
export async function getGanttData(projectId: number, options?: { [key: string]: any }) {
  return request(`/api/v1/projects/${projectId}/gantt`, {
    method: 'GET',
    ...(options || {}),
  });
}

// 获取单个任务
export async function getTask(id: number, options?: { [key: string]: any }) {
  return request(`/api/v1/tasks/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

// 创建任务
export async function createTask(projectId: number, body: any, options?: { [key: string]: any }) {
  return request(`/api/v1/projects/${projectId}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 更新任务
export async function updateTask(id: number, body: any, options?: { [key: string]: any }) {
  return request(`/api/v1/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 删除任务
export async function deleteTask(id: number, options?: { [key: string]: any }) {
  return request(`/api/v1/tasks/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

// 更新甘特图任务
export async function updateGanttTask(id: number, body: any, options?: { [key: string]: any }) {
  return request(`/api/v1/tasks/${id}/gantt`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 获取任务评论
export async function getTaskComments(taskId: number, options?: { [key: string]: any }) {
  return request(`/api/v1/tasks/${taskId}/comments`, {
    method: 'GET',
    ...(options || {}),
  });
}

// 添加任务评论
export async function addTaskComment(taskId: number, body: any, options?: { [key: string]: any }) {
  return request(`/api/v1/tasks/${taskId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 获取任务标签
export async function getTaskTags(taskId: number, options?: { [key: string]: any }) {
  return request(`/api/v1/tasks/${taskId}/tags`, {
    method: 'GET',
    ...(options || {}),
  });
}

// 获取项目标签
export async function getProjectTags(projectId: number, options?: { [key: string]: any }) {
  return request(`/api/v1/projects/${projectId}/tags`, {
    method: 'GET',
    ...(options || {}),
  });
}

// 获取工作流列表
export async function getWorkflows(params?: any, options?: { [key: string]: any }) {
  return request('/api/v1/workflows', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

// 获取单个工作流
export async function getWorkflow(id: number, options?: { [key: string]: any }) {
  return request(`/api/v1/workflows/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

// 创建工作流
export async function createWorkflow(body: any, options?: { [key: string]: any }) {
  return request('/api/v1/workflows', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 更新工作流步骤顺序
export async function updateStepOrder(workflowId: number, body: any, options?: { [key: string]: any }) {
  return request(`/api/v1/workflows/${workflowId}/steps/order`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 创建工作流步骤
export async function createWorkflowStep(workflowId: number, body: any, options?: { [key: string]: any }) {
  return request(`/api/v1/workflows/${workflowId}/steps`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 更新工作流步骤
export async function updateWorkflowStep(id: number, body: any, options?: { [key: string]: any }) {
  return request(`/api/v1/steps/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 删除工作流步骤
export async function deleteWorkflowStep(id: number, options?: { [key: string]: any }) {
  return request(`/api/v1/steps/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

// ========== 任务状态 API ==========

// 获取所有状态
export async function getTaskStatuses(params?: any, options?: { [key: string]: any }) {
  return request('/api/v1/task-statuses', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

// 获取单个状态
export async function getTaskStatus(id: number, options?: { [key: string]: any }) {
  return request(`/api/v1/task-statuses/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

// 创建状态
export async function createTaskStatus(body: any, options?: { [key: string]: any }) {
  return request('/api/v1/task-statuses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 更新状态
export async function updateTaskStatus(id: number, body: any, options?: { [key: string]: any }) {
  return request(`/api/v1/task-statuses/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 删除状态
export async function deleteTaskStatus(id: number, options?: { [key: string]: any }) {
  return request(`/api/v1/task-statuses/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

// ========== 流转规则 API ==========

// 获取所有流转规则
export async function getTransitionRules(params?: any, options?: { [key: string]: any }) {
  return request('/api/v1/transition-rules', {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

// 获取单个流转规则
export async function getTransitionRule(id: number, options?: { [key: string]: any }) {
  return request(`/api/v1/transition-rules/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

// 创建流转规则
export async function createTransitionRule(body: any, options?: { [key: string]: any }) {
  return request('/api/v1/transition-rules', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 更新流转规则
export async function updateTransitionRule(id: number, body: any, options?: { [key: string]: any }) {
  return request(`/api/v1/transition-rules/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

// 删除流转规则
export async function deleteTransitionRule(id: number, options?: { [key: string]: any }) {
  return request(`/api/v1/transition-rules/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
