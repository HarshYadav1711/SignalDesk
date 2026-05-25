import type {
  Enquiry,
  EnquiryEvent,
  EnquiryStatus,
  FollowUp,
  ActivityItem,
} from '../types';

/** Short operational line for list cards and headers. */
export function getOperationalLabel(enquiry: Enquiry): string {
  if (enquiry.operationalLabel) return enquiry.operationalLabel;

  if (enquiry.status === 'processing') return 'SOP matching in progress';
  if (enquiry.status === 'closed') return 'Archived';

  if (enquiry.message.includes('--- follow-up ---')) return 'Reopened enquiry';

  if (enquiry.conversationStatus === 'escalated' || enquiry.status === 'escalated') {
    return getEscalationOperationalLabel(enquiry);
  }

  if (enquiry.conversationStatus === 'awaiting_reply') return 'Awaiting customer reply';
  if (enquiry.conversationStatus === 'new' || enquiry.status === 'received') {
    return 'Awaiting triage';
  }
  if (enquiry.status === 'matched' && enquiry.suggestedResponse) {
    return enquiry.unread ? 'Response pending' : 'Suggested reply ready';
  }

  return statusLabelsFallback[enquiry.status] ?? 'In queue';
}

function getEscalationOperationalLabel(enquiry: Enquiry): string {
  const reason = (enquiry.escalationReason ?? '').toLowerCase();
  if (reason.includes('manager')) return 'Awaiting manager review';
  if (enquiry.escalationSource === 'auto') {
    return enquiry.matchedSopId
      ? 'Escalated after SOP match'
      : 'Escalated by SOP fallback';
  }
  if (enquiry.escalationSource === 'manual') return 'Manual escalation';
  if (reason.includes('finance') || reason.includes('refund')) {
    return 'Awaiting finance review';
  }
  if (reason.includes('dispatch') || reason.includes('tech')) {
    return 'Dispatch review required';
  }
  return 'Requires operator action';
}

const statusLabelsFallback: Partial<Record<EnquiryStatus, string>> = {
  received: 'Awaiting triage',
  processing: 'SOP matching in progress',
  matched: 'Response pending',
  escalated: 'Requires operator action',
  closed: 'Archived',
};

/** Urgency line for escalation cards. */
export function getEscalationUrgency(enquiry: Enquiry): string {
  if (enquiry.priority === 'high') {
    if (enquiry.escalationSource === 'auto') return 'High urgency · auto-escalated';
    return 'High urgency · needs same-day action';
  }
  if (enquiry.priority === 'medium') return 'Standard queue · review today';
  return 'Low urgency · when capacity allows';
}

/** Secondary meta for lead / queue cards (channel + queue hints). */
export function getLeadMetaLine(enquiry: Enquiry, queueIndex?: number): string {
  const parts: string[] = [];
  if (queueIndex !== undefined) {
    parts.push(`#${queueIndex + 1} in queue`);
  }
  parts.push(getOperationalLabel(enquiry));
  return parts.join(' · ');
}

export function getActivityContextLabel(item: ActivityItem): string {
  switch (item.eventType) {
    case 'enquiry_created':
      return 'New inbound';
    case 'task_started':
      return 'Processing';
    case 'sop_matched':
      return 'Playbook matched';
    case 'auto_escalated':
      return 'SOP fallback';
    case 'manual_escalated':
      return 'Operator action';
    case 'follow_up':
      return 'Customer message';
    case 'follow_up_due':
      return 'Reminder';
    default:
      return 'Update';
  }
}

export function getTimelineOperationalHint(event: EnquiryEvent): string | null {
  switch (event.eventType) {
    case 'response_suggested':
      return 'Response pending operator send';
    case 'auto_escalated':
      return 'Escalated by SOP fallback';
    case 'manual_escalated':
      return 'Awaiting manager review';
    case 'follow_up':
      return 'Reopened enquiry';
    case 'task_started':
      return 'Queue processing';
    default:
      return null;
  }
}

export function getFollowUpOperationalLabel(followUp: FollowUp): string {
  switch (followUp.status) {
    case 'overdue':
      return 'Follow-up overdue';
    case 'due_today':
      return 'Due today';
    case 'upcoming':
      return 'Scheduled callback';
    default:
      return 'Follow-up';
  }
}

export function getSectionQueueHint(
  kind: 'priority' | 'leads' | 'escalations' | 'followups',
  counts: Record<string, number>
): string {
  switch (kind) {
    case 'priority': {
      const n = counts.total ?? 0;
      const urgent = counts.high ?? 0;
      if (n === 0) return 'Queue clear';
      return urgent > 0 ? `${n} items · ${urgent} urgent` : `${n} items`;
    }
    case 'leads': {
      const open = counts.open ?? 0;
      const unread = counts.unread ?? 0;
      return unread > 0 ? `${open} open · ${unread} unread` : `${open} open`;
    }
    case 'escalations': {
      const n = counts.total ?? 0;
      const manager = counts.manager ?? 0;
      return manager > 0 ? `${n} open · ${manager} awaiting manager` : `${n} open`;
    }
    case 'followups': {
      const due = counts.due ?? 0;
      const overdue = counts.overdue ?? 0;
      if (overdue > 0) return `${overdue} overdue · ${due} due today`;
      return due > 0 ? `${due} due today` : `${counts.total ?? 0} scheduled`;
    }
    default:
      return '';
  }
}
