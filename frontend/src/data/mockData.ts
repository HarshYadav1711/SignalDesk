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
  activity: ActivityItem[];
  priorityQueueIds: string[];
};

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

function buildDashboardMetrics(): DashboardMetric[] {
  const openCount = enquiries.items.filter((e) => e.status !== 'closed').length;
  const escalationCount = enquiries.items.filter(
    (e) => e.conversationStatus === 'escalated' || e.status === 'escalated'
  ).length;
  const matchedCount = enquiries.items.filter((e) => e.status === 'matched').length;
  const followUpsDue = followUps.items.filter(
    (f) => f.status === 'overdue' || f.status === 'due_today'
  ).length;
  const overdueCount = followUps.items.filter((f) => f.status === 'overdue').length;

  return [
    {
      id: 'metric-open',
      label: 'Open enquiries',
      value: openCount,
      trend: { direction: 'neutral', label: `${openCount} active` },
      accentKey: 'primary',
    },
    {
      id: 'metric-escalations',
      label: 'Escalations',
      value: escalationCount,
      trend: {
        direction: escalationCount > 0 ? 'up' : 'neutral',
        label: escalationCount > 0 ? 'Needs attention' : 'Queue clear',
      },
      accentKey: 'danger',
    },
    {
      id: 'metric-matched',
      label: 'SOP matched',
      value: matchedCount,
      trend: { direction: 'neutral', label: 'Ready to send' },
      accentKey: 'success',
    },
    {
      id: 'metric-followups',
      label: 'Follow-ups due',
      value: followUpsDue,
      trend: {
        direction: overdueCount > 0 ? 'down' : 'neutral',
        label: overdueCount > 0 ? `${overdueCount} overdue` : 'On schedule',
      },
      accentKey: 'warning',
    },
  ];
}

export function getDashboard(): DashboardResponse {
  const priorityQueue = dashboard.priorityQueueIds
    .map((id) => enquiries.items.find((e) => e.id === id))
    .filter((e): e is Enquiry => e !== undefined);

  return {
    metrics: buildDashboardMetrics(),
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
