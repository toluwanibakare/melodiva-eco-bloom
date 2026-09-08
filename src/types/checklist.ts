export type ChecklistTab = 'website' | 'social_media';

export type ChecklistStatus = 'todo' | 'in_progress' | 'pending_review' | 'done';

export type TeamMember = 'Favor' | 'TMB' | 'Mrs. Faith' | 'Melody';

export const TEAM_MEMBERS: TeamMember[] = ['Favor', 'TMB', 'Mrs. Faith', 'Melody'];

export const TEAM_ROLES: Record<TeamMember, { role: string; desc: string }> = {
  'Mrs. Faith': {
    role: 'Supervisor',
    desc: 'Overall project supervision, campaign review, and final quality signoffs',
  },
  'TMB': {
    role: 'Tech & Strategy Lead',
    desc: 'Website development, hosting, environment setup, and content strategy planning',
  },
  'Favor': {
    role: 'Social & QA Executive',
    desc: 'Social media posting, daily channel management, engagement, and website testing',
  },
  'Melody': {
    role: 'Website Assistant',
    desc: 'Provides state/city delivery pricing & content information to TMB under Mrs. Faith supervision',
  },
};

export interface ChecklistComment {
  id: string;
  item_id: string;
  author_name: string;
  comment_text: string;
  created_at: string;
}

export interface ChecklistItem {
  id: string;
  tab: ChecklistTab;
  title: string;
  description: string;
  category: string;
  status: ChecklistStatus;
  assigned_to: string;
  due_date?: string | null;
  order_index?: number;
  created_at?: string;
  updated_at?: string;
  comments?: ChecklistComment[];
}
