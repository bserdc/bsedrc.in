/**
 * Centralized BSEDRC API Client Service
 * Encapsulates all communication between the React Frontend and Express Backend.
 */

import { 
  Student, 
  ExamResult, 
  BoardNotification, 
  GalleryItem, 
  CustomForm, 
  FormSubmission, 
  CertificateRecord 
} from '../types';

class ApiClient {
  private getAuthHeader(): Record<string, string> {
    if (typeof window === 'undefined') return {};
    const token = sessionStorage.getItem('bsedrc_admin_token') || localStorage.getItem('bsedrc_admin_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...this.getAuthHeader(),
      ...((options.headers as Record<string, string>) || {})
    };

    const res = await fetch(`/api${endpoint}`, {
      ...options,
      headers
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || `API error ${res.status}: ${res.statusText}`);
    }

    return data as T;
  }

  // ==========================================
  // CONFIG & HEALTH
  // ==========================================
  public async getHealth() {
    return this.request<{ status: string; board: string; offlineMode: boolean }>('/health');
  }

  public async getConfig() {
    return this.request<{
      boardName: string;
      boardHindi: string;
      officeAddress: string;
      helplinePhone: string;
      helplineEmail: string;
      razorpayKeyId: string;
      currency: string;
    }>('/config');
  }

  // ==========================================
  // AUTHENTICATION
  // ==========================================
  public async login(credentials: { username: string; password: string }) {
    const data = await this.request<{
      success: boolean;
      token: string;
      user: { username: string; email: string; role: string; organization: string };
      message?: string;
    }>('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });

    if (data.token && typeof window !== 'undefined') {
      sessionStorage.setItem('bsedrc_admin_token', data.token);
      sessionStorage.setItem('bsedrc_admin_auth', 'true');
    }

    return data;
  }

  public async registerCandidate(payload: {
    name: string;
    email?: string;
    phone?: string;
    course: string;
    dob?: string;
    fatherName?: string;
    motherName?: string;
    gender?: string;
    category?: string;
    stream?: string;
    address?: string;
  }) {
    return this.request<{
      success: boolean;
      message: string;
      regNo: string;
      rollNo: string;
      token?: string;
      student: Student;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  public async candidateLogin(credentials: { identifier: string; dob?: string }) {
    const data = await this.request<{
      success: boolean;
      token: string;
      student: Student;
      message: string;
    }>('/auth/candidate-login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });

    if (data.token && typeof window !== 'undefined') {
      sessionStorage.setItem('bsedrc_candidate_token', data.token);
      sessionStorage.setItem('bsedrc_candidate_auth', 'true');
    }

    return data;
  }

  public async forgotPassword(email: string) {
    return this.request<{ success: boolean; message: string }>('/admin/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }

  public async resetPassword(payload: { email: string; newPassword: string; securityPin: string }) {
    return this.request<{ success: boolean; message: string }>('/admin/reset-password', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  public async getProfile() {
    return this.request<{ success: boolean; user: any }>('/admin/me');
  }

  public logout() {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('bsedrc_admin_token');
      sessionStorage.removeItem('bsedrc_admin_auth');
    }
  }

  // ==========================================
  // STUDENTS
  // ==========================================
  public async getStudents(params?: { search?: string; course?: string }) {
    const qs = new URLSearchParams();
    if (params?.search) qs.set('search', params.search);
    if (params?.course) qs.set('course', params.course);
    const queryStr = qs.toString() ? `?${qs.toString()}` : '';
    return this.request<{ success: boolean; count: number; students: Student[] }>(`/students${queryStr}`);
  }

  public async getStudentByRegNo(regNo: string) {
    return this.request<{ success: boolean; student: Student }>(`/students/${encodeURIComponent(regNo)}`);
  }

  public async saveStudent(student: Partial<Student>) {
    return this.request<{ success: boolean; student: Student; message: string }>('/students', {
      method: 'POST',
      body: JSON.stringify(student)
    });
  }

  public async deleteStudent(id: string) {
    return this.request<{ success: boolean; message: string }>(`/students/${id}`, {
      method: 'DELETE'
    });
  }

  // ==========================================
  // RESULTS
  // ==========================================
  public async getResults() {
    return this.request<{ success: boolean; count: number; results: ExamResult[] }>('/results');
  }

  public async searchResult(params: { rollNumber?: string; regNumber?: string }) {
    const qs = new URLSearchParams();
    if (params.rollNumber) qs.set('rollNumber', params.rollNumber);
    if (params.regNumber) qs.set('regNumber', params.regNumber);
    return this.request<{ success: boolean; result: ExamResult }>(`/results/search?${qs.toString()}`);
  }

  public async saveResult(result: ExamResult) {
    return this.request<{ success: boolean; result: ExamResult; message: string }>('/results', {
      method: 'POST',
      body: JSON.stringify(result)
    });
  }

  // ==========================================
  // PAYMENTS & RAZORPAY GATEWAY
  // ==========================================
  public async getPaymentGatewayStatus() {
    return this.request<{
      success: boolean;
      gateway: string;
      provider: string;
      apiEndpoint: string;
      isConfigured: boolean;
      hasKeyId: boolean;
      keyId: string;
      currency: string;
      supportedModes: string[];
      compliance: string;
    }>('/payments/gateway-status');
  }

  public async createPaymentOrder(payload: {
    amount: number;
    serviceType: string;
    candidateName: string;
    regNumber?: string;
    email?: string;
    phone?: string;
  }) {
    return this.request<{ success: boolean; order: any }>('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  public async verifyPayment(payload: {
    orderId?: string;
    transactionId?: string;
    paymentMethod?: string;
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
  }) {
    return this.request<{ success: boolean; payment: any; message: string }>('/payments/verify', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  public async getPaymentReceipt(txnId: string) {
    return this.request<{ success: boolean; receipt: any }>(`/payments/receipt/${encodeURIComponent(txnId)}`);
  }

  // ==========================================
  // NOTIFICATIONS
  // ==========================================
  public async getNotifications() {
    return this.request<{ success: boolean; count: number; notifications: BoardNotification[] }>('/notifications');
  }

  public async saveNotification(notification: BoardNotification) {
    return this.request<{ success: boolean; notification: BoardNotification }>('/notifications', {
      method: 'POST',
      body: JSON.stringify(notification)
    });
  }

  public async deleteNotification(id: string) {
    return this.request<{ success: boolean; message: string }>(`/notifications/${id}`, {
      method: 'DELETE'
    });
  }

  // ==========================================
  // GALLERY
  // ==========================================
  public async getGallery() {
    return this.request<{ success: boolean; count: number; gallery: GalleryItem[] }>('/gallery');
  }

  public async saveGalleryItem(item: GalleryItem) {
    return this.request<{ success: boolean; item: GalleryItem }>('/gallery', {
      method: 'POST',
      body: JSON.stringify(item)
    });
  }

  public async deleteGalleryItem(id: string) {
    return this.request<{ success: boolean; message: string }>(`/gallery/${id}`, {
      method: 'DELETE'
    });
  }

  // ==========================================
  // ONLINE FORMS
  // ==========================================
  public async getForms() {
    return this.request<{ success: boolean; count: number; forms: CustomForm[] }>('/forms');
  }

  public async getFormById(id: string) {
    return this.request<{ success: boolean; form: CustomForm }>(`/forms/${id}`);
  }

  public async submitForm(formId: string, payload: { applicantName: string; email?: string; phone?: string; data: Record<string, any> }) {
    return this.request<{ success: boolean; submission: FormSubmission; message: string }>(`/forms/${formId}/submit`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  public async getFormSubmissions(formId?: string) {
    const qs = formId ? `?formId=${formId}` : '';
    return this.request<{ success: boolean; count: number; submissions: FormSubmission[] }>(`/forms/submissions${qs}`);
  }

  // ==========================================
  // CERTIFICATES
  // ==========================================
  public async verifyCertificate(serialNo: string) {
    return this.request<{ success: boolean; verified: boolean; certificate: CertificateRecord }>(`/certificates/verify/${encodeURIComponent(serialNo)}`);
  }

  // ==========================================
  // AI ASSISTANT
  // ==========================================
  public async askAIAssistant(prompt: string, context?: string) {
    return this.request<{ success: boolean; reply: string; source: string }>('/ai/assistant', {
      method: 'POST',
      body: JSON.stringify({ prompt, context })
    });
  }
}

export const api = new ApiClient();
export const apiService = api;
