// @ts-ignore
import { request } from '@umijs/max';

// 行业管理
export async function getIndustries() {
  return request('/api/v1/dynamic/industries', { method: 'GET' });
}

export async function getIndustry(id: number) {
  return request(`/api/v1/dynamic/industries/${id}`, { method: 'GET' });
}

export async function createIndustry(data: any) {
  return request('/api/v1/dynamic/industries', { method: 'POST', data });
}

export async function updateIndustry(id: number, data: any) {
  return request(`/api/v1/dynamic/industries/${id}`, { method: 'PUT', data });
}

export async function deleteIndustry(id: number) {
  return request(`/api/v1/dynamic/industries/${id}`, { method: 'DELETE' });
}

// 模板管理
export async function getTemplates(industryId?: number) {
  const params = industryId ? `?industry_id=${industryId}` : '';
  return request(`/api/v1/dynamic/templates${params}`, { method: 'GET' });
}

export async function getTemplate(id: number) {
  return request(`/api/v1/dynamic/templates/${id}`, { method: 'GET' });
}

export async function createTemplate(data: any) {
  return request('/api/v1/dynamic/templates', { method: 'POST', data });
}

export async function updateTemplate(id: number, data: any) {
  return request(`/api/v1/dynamic/templates/${id}`, { method: 'PUT', data });
}

export async function deleteTemplate(id: number) {
  return request(`/api/v1/dynamic/templates/${id}`, { method: 'DELETE' });
}

// 工作流管理
export async function getWorkflows(templateId?: number) {
  const params = templateId ? `?template_id=${templateId}` : '';
  return request(`/api/v1/dynamic/workflows${params}`, { method: 'GET' });
}

export async function getWorkflow(id: number) {
  return request(`/api/v1/dynamic/workflows/${id}`, { method: 'GET' });
}

export async function createWorkflow(data: any) {
  return request('/api/v1/dynamic/workflows', { method: 'POST', data });
}

// 工作流步骤（拖拽排序）
export async function updateStepOrder(steps: { id: number; sort_order: number }[]) {
  return request('/api/v1/dynamic/workflows/:id/steps/order', { 
    method: 'PUT',
    data: { steps }
  });
}

export async function createStep(workflowId: number, data: any) {
  return request(`/api/v1/dynamic/workflows/${workflowId}/steps`, { method: 'POST', data });
}

export async function updateStep(id: number, data: any) {
  return request(`/api/v1/dynamic/steps/${id}`, { method: 'PUT', data });
}

export async function deleteStep(id: number) {
  return request(`/api/v1/dynamic/steps/${id}`, { method: 'DELETE' });
}
