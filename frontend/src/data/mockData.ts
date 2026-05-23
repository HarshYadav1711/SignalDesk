import enquiriesData from '../../mock/enquiries.json';
import eventsData from '../../mock/events.json';
import followUpsData from '../../mock/followUps.json';
import dashboardData from '../../mock/dashboard.json';
import type {
  Enquiry,
  EnquiryEvent,
  EnquiryHistoryResponse,
  EnquiriesListResponse,
  FollowUp,
  FollowUpsListResponse,
  DashboardResponse,
  ActivityItem,
  DashboardMetric,
} from '../types';

const enquiries = enquiriesData as EnquiriesListResponse;
const events = (eventsData as { events: EnquiryEvent[] }).events;
const followUps = followUpsData as FollowUpsListResponse;
const dashboard = dashboardData as {
  metrics: DashboardMetric[];
  activity: ActivityItem[];
  priorityQueueIds: string[];
};

export function getAllEnquiries(): Enquiry[] {
  return enquiries.items;
}

export function getLeads(): Enquiry[] {
  return enquiries.items.filter(
    (e) => e.conversationStatus !== 'escalated' && e.status !== 'closed'
  );
}

export function getEscalations(): Enquiry[] {
  return enquiries.items.filter(
    (e) => e.conversationStatus === 'escalated' || e.status === 'escalated'
  );
}

export function getFollowUps(): FollowUp[] {
  return followUps.items;
}

export function getDashboard(): DashboardResponse {
  const priorityQueue = dashboard.priorityQueueIds
    .map((id) => enquiries.items.find((e) => e.id === id))
    .filter((e): e is Enquiry => e !== undefined);

  return {
    metrics: dashboard.metrics,
    activity: dashboard.activity,
    priorityQueue,
  };
}

export function getEnquiryById(id: string): Enquiry | undefined {
  return enquiries.items.find((e) => e.id === id);
}

export function getEnquiryHistory(id: string): EnquiryHistoryResponse | null {
  const enquiry = getEnquiryById(id);
  if (!enquiry) return null;

  const enquiryEvents = events
    .filter((e) => e.enquiryId === id)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  return { enquiry, events: enquiryEvents };
}

export function getFollowUpByEnquiryId(enquiryId: string): FollowUp | undefined {
  return followUps.items.find((f) => f.enquiryId === enquiryId);
}
