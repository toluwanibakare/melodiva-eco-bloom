import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import {
  ChecklistItem,
  ChecklistComment,
  ChecklistStatus,
  ChecklistTab,
  TeamMember,
  TEAM_MEMBERS,
  TEAM_ROLES,
} from '@/types/checklist';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  MessageSquare,
  User,
  Calendar,
  Filter,
  Search,
  LayoutGrid,
  List,
  Globe,
  Share2,
  Send,
  UserCheck,
  ShieldCheck,
  Lock,
  RefreshCw,
} from 'lucide-react';
import melodivaLogo from '/public/melodiva-logo.png';

const LOCAL_STORAGE_USER_KEY = 'melodiva_checklist_user';
const LOCAL_STORAGE_TAB_KEY = 'melodiva_checklist_active_tab';

const STATUS_CONFIG: Record<
  ChecklistStatus,
  { label: string; bg: string; text: string; border: string; icon: any }
> = {
  todo: {
    label: 'To Do',
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-200 dark:border-slate-700',
    icon: Clock,
  },
  in_progress: {
    label: 'In Progress',
    bg: 'bg-blue-50 dark:bg-blue-950/50',
    text: 'text-blue-700 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
    icon: Clock,
  },
  pending_review: {
    label: 'Pending Review',
    bg: 'bg-amber-50 dark:bg-amber-950/50',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800',
    icon: AlertCircle,
  },
  done: {
    label: 'Done',
    bg: 'bg-emerald-50 dark:bg-emerald-950/50',
    text: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800',
    icon: CheckCircle2,
  },
};

const DEFAULT_ITEMS: ChecklistItem[] = [
  // Website Tab - Logical Sequence (Pricing -> Backend -> Audit -> Assets -> Policies -> Hosting -> QA -> Launch)
  {
    id: 'def-web-1',
    tab: 'website',
    title: '1. Provide State & City Delivery Pricing Data',
    description: 'Gather and provide complete delivery fee information for all Nigerian states and Lagos LGAs/cities to TMB for database setup.',
    category: 'Delivery Pricing',
    status: 'in_progress',
    assigned_to: 'Melody',
    due_date: '2026-09-13',
    order_index: 1,
    comments: [],
  },
  {
    id: 'def-web-2',
    tab: 'website',
    title: '2. Run Backend Setup & Environment Verification',
    description: 'Start local/production backend server, connect database endpoints, and integrate state/city delivery pricing tables provided by Melody.',
    category: 'Backend & Infra',
    status: 'todo',
    assigned_to: 'TMB',
    due_date: '2026-09-15',
    order_index: 2,
    comments: [],
  },
  {
    id: 'def-web-3',
    tab: 'website',
    title: '3. Fix Missing Footer Links & Page Routes',
    description: 'Ensure /shipping, /returns, and legal policy links in Footer navigate properly to existing content pages.',
    category: 'Website Audit',
    status: 'todo',
    assigned_to: 'TMB',
    due_date: '2026-09-18',
    order_index: 3,
    comments: [],
  },
  {
    id: 'def-web-4',
    tab: 'website',
    title: '4. Source & Update High-Res Product & Hero Imagery',
    description: 'Gather high-resolution studio photos for homepage hero banner, Black Soap variants (Exquisite/Perfume/Natural), and Kernel Oil sizes.',
    category: 'Media & Assets',
    status: 'todo',
    assigned_to: 'Favor',
    due_date: '2026-09-20',
    order_index: 4,
    comments: [],
  },
  {
    id: 'def-web-5',
    tab: 'website',
    title: '5. Draft & Publish Privacy, Shipping & Return Policies',
    description: 'Write and publish Privacy Policy, Terms & Conditions, Shipping Info, and Returns/Refund Policy pages on the website.',
    category: 'Legal & Policies',
    status: 'todo',
    assigned_to: 'Favor',
    due_date: '2026-09-22',
    order_index: 5,
    comments: [],
  },
  {
    id: 'def-web-6',
    tab: 'website',
    title: '6. Hosting Setup & Custom Domain SSL Deployment',
    description: 'Deploy frontend to Vercel/Netlify, set custom domain mapping, configure SSL certificate, and verify live API endpoints before final testing.',
    category: 'Deployment',
    status: 'todo',
    assigned_to: 'TMB',
    due_date: '2026-09-26',
    order_index: 6,
    comments: [],
  },
  {
    id: 'def-web-7',
    tab: 'website',
    title: '7. Final End-to-End Cart & Checkout QA Testing',
    description: 'Execute comprehensive live QA tests on deployed domain for shopping cart, checkout flow, WhatsApp order link generation, and delivery fee calculations.',
    category: 'QA & Testing',
    status: 'todo',
    assigned_to: 'Favor',
    due_date: '2026-09-28',
    order_index: 7,
    comments: [],
  },
  {
    id: 'def-web-8',
    tab: 'website',
    title: '8. Website Launch Release & Technical Signoff',
    description: 'Supervisory final review of website security, legal compliance, order routing, and production deployment readiness.',
    category: 'Supervision',
    status: 'todo',
    assigned_to: 'Mrs. Faith',
    due_date: '2026-09-29',
    order_index: 8,
    comments: [],
  },

  // Social Media Tab - 2-Month Timeline (Weeks 1 - 8)
  {
    id: 'def-soc-1',
    tab: 'social_media',
    title: '1. Provide Official Email & Social Media Credentials to TMB',
    description: 'Mrs. Faith (Supervisor) provides official Melodiva email accounts, domain registrar access, and existing social media login credentials to TMB for environment & channel setup.',
    category: 'Phase 1: Setup',
    status: 'todo',
    assigned_to: 'Mrs. Faith',
    due_date: '2026-09-10',
    order_index: 1,
    comments: [],
  },
  {
    id: 'def-soc-2',
    tab: 'social_media',
    title: '2. Grant Favor Admin & Manager Access to Social Media Channels',
    description: 'TMB configures security settings, 2FA, and grants Favor admin/manager access across Instagram, TikTok, Facebook, and Meta Business Suite for daily channel operations.',
    category: 'Phase 1: Setup',
    status: 'todo',
    assigned_to: 'TMB',
    due_date: '2026-09-11',
    order_index: 2,
    comments: [],
  },
  {
    id: 'def-soc-3',
    tab: 'social_media',
    title: '3. Reactivate & Optimize Official Social Media Channels',
    description: 'Re-establish and configure accounts, bio links, tracking pixels, profile graphics, and business profiles for Facebook, Instagram, and TikTok.',
    category: 'Phase 1: Setup',
    status: 'todo',
    assigned_to: 'TMB',
    due_date: '2026-09-13',
    order_index: 3,
    comments: [],
  },
  {
    id: 'def-soc-4',
    tab: 'social_media',
    title: '4. Formulate 60-Day Content Strategy & Editorial Calendar',
    description: 'Formulate overarching content strategy, weekly theme pillars, educational topics, and 60-day posting calendar to guide Favor.',
    category: 'Phase 1: Setup',
    status: 'todo',
    assigned_to: 'TMB',
    due_date: '2026-09-18',
    order_index: 4,
    comments: [],
  },
  {
    id: 'def-soc-5',
    tab: 'social_media',
    title: '5. Design Social Media Graphic Templates & Branding Assets',
    description: 'Create reusable Canva/Photoshop graphics, story templates, carousel slides, and reel covers based on TMB strategy guidelines.',
    category: 'Phase 1: Setup',
    status: 'todo',
    assigned_to: 'Favor',
    due_date: '2026-09-22',
    order_index: 5,
    comments: [],
  },
  {
    id: 'def-soc-6',
    tab: 'social_media',
    title: '6. Configure WhatsApp Business Quick Replies & Link-in-Bio',
    description: 'Set up Linktree/bio page connecting website shop, WhatsApp order chat, affiliate registration, and customer FAQs.',
    category: 'Phase 1: Setup',
    status: 'todo',
    assigned_to: 'TMB',
    due_date: '2026-09-22',
    order_index: 6,
    comments: [],
  },
  {
    id: 'def-soc-7',
    tab: 'social_media',
    title: '7. Publish Melodiva Brand Story & Ingredients Series',
    description: 'Schedule and post introductory brand series highlighting Melodiva inception (Nov 2023), natural African Black Soap heritage, and Kernel Oil benefits.',
    category: 'Phase 2: Launch',
    status: 'todo',
    assigned_to: 'Favor',
    due_date: '2026-09-29',
    order_index: 7,
    comments: [],
  },
  {
    id: 'def-soc-8',
    tab: 'social_media',
    title: '8. Kickstart Affiliate Marketing Campaign Strategy & Collateral',
    description: 'Design campaign structure, commission rate promotions (10%), and affiliate onboarding collateral to recruit micro-influencers and ambassadors.',
    category: 'Phase 2: Launch',
    status: 'todo',
    assigned_to: 'TMB',
    due_date: '2026-10-03',
    order_index: 8,
    comments: [],
  },
  {
    id: 'def-soc-9',
    tab: 'social_media',
    title: '9. Launch Affiliate Recruitment Posts & DM Outreach',
    description: 'Publish promotional posts and stories inviting beauty creators to join the Melodiva affiliate program with unique tracking links.',
    category: 'Phase 2: Launch',
    status: 'todo',
    assigned_to: 'Favor',
    due_date: '2026-10-06',
    order_index: 9,
    comments: [],
  },
  {
    id: 'def-soc-10',
    tab: 'social_media',
    title: '10. Roll Out Black Soap & Kernel Oil Product Spotlights',
    description: 'Publish weekly product highlight videos and carousels showcasing Black Soap (Exquisite, Perfume, Natural) and Kernel Oil (250ml, 500ml, 1000ml).',
    category: 'Phase 3: Spotlights',
    status: 'todo',
    assigned_to: 'Favor',
    due_date: '2026-10-13',
    order_index: 10,
    comments: [],
  },
  {
    id: 'def-soc-11',
    tab: 'social_media',
    title: '11. Launch Customer Testimonials & Before/After UGC Series',
    description: 'Share genuine customer reviews, video unboxings, and skin transformation stories with purchase call-to-actions.',
    category: 'Phase 3: Spotlights',
    status: 'todo',
    assigned_to: 'Favor',
    due_date: '2026-10-20',
    order_index: 11,
    comments: [],
  },
  {
    id: 'def-soc-12',
    tab: 'social_media',
    title: '12. Host 2-Month Campaign Anniversary Giveaway',
    description: 'Host interactive Instagram/TikTok giveaway encouraging tags, shares, and website cart visits to boost engagement and follower growth.',
    category: 'Phase 4: Sales Push',
    status: 'todo',
    assigned_to: 'Favor',
    due_date: '2026-10-27',
    order_index: 12,
    comments: [],
  },
  {
    id: 'def-soc-13',
    tab: 'social_media',
    title: '13. Execute Retargeting & Daily Follower Engagement Push',
    description: 'Actively engage in comments, reply to direct messages, send exclusive coupon codes to loyal customers, and drive final 60-day sales conversions.',
    category: 'Phase 4: Sales Push',
    status: 'todo',
    assigned_to: 'Favor',
    due_date: '2026-11-03',
    order_index: 13,
    comments: [],
  },
  {
    id: 'def-soc-14',
    tab: 'social_media',
    title: '14. Social Media 2-Month Campaign Milestone Review',
    description: 'Supervisory audit of 60-day follower growth, conversion metrics, affiliate payouts, and content quality signoff.',
    category: 'Phase 4: Supervision',
    status: 'todo',
    assigned_to: 'Mrs. Faith',
    due_date: '2026-11-08',
    order_index: 14,
    comments: [],
  },
];

export default function Checklist() {
  const { toast } = useToast();

  // Active Team Member Identity
  const [currentUser, setCurrentUser] = useState<string>('');
  const [showIdentityModal, setShowIdentityModal] = useState<boolean>(false);
  const [identityInput, setIdentityInput] = useState<string>('TMB');

  // Check Supervisor Authority
  const isSupervisor = currentUser === 'Mrs. Faith';

  // Tab State Persisted in Local Storage (Default is social_media)
  const [activeTab, setActiveTab] = useState<ChecklistTab>(() => {
    const savedTab = localStorage.getItem(LOCAL_STORAGE_TAB_KEY);
    return savedTab === 'website' || savedTab === 'social_media' ? savedTab : 'social_media';
  });

  const [viewMode, setViewMode] = useState<'board' | 'list'>('list');
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [usingSupabase, setUsingSupabase] = useState<boolean>(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterAssignee, setFilterAssignee] = useState<string>('all');

  // Selected item modal & details
  const [selectedItem, setSelectedItem] = useState<ChecklistItem | null>(null);
  const [comments, setComments] = useState<ChecklistComment[]>([]);
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [isSubmittingComment, setIsSubmittingComment] = useState<boolean>(false);

  // Create Task Modal
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newTargetTab, setNewTargetTab] = useState<ChecklistTab>('social_media');
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('Phase 1: Setup');
  const [newAssignee, setNewAssignee] = useState<string>('Favor');
  const [newDueDate, setNewDueDate] = useState<string>('');
  const [newStatus, setNewStatus] = useState<ChecklistStatus>('todo');

  // Handle Tab Switch & Save Choice to Local Storage
  const handleTabChange = (tab: ChecklistTab) => {
    setActiveTab(tab);
    localStorage.setItem(LOCAL_STORAGE_TAB_KEY, tab);
  };

  // Initialize active user
  useEffect(() => {
    const savedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (savedUser) {
      const cleanedUser = savedUser === 'MTMB' ? 'TMB' : savedUser;
      setCurrentUser(cleanedUser);
      if (savedUser === 'MTMB') {
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, 'TMB');
      }
    } else {
      setShowIdentityModal(true);
    }
  }, []);

  // Save Identity
  const handleSaveIdentity = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast({ title: 'Please select or enter your name', variant: 'destructive' });
      return;
    }
    const finalName = trimmed === 'MTMB' ? 'TMB' : trimmed;
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, finalName);
    setCurrentUser(finalName);
    setShowIdentityModal(false);
    toast({
      title: `Welcome, ${finalName}!`,
      description: `Logged in as ${finalName} (${TEAM_ROLES[finalName as TeamMember]?.role || 'Team Member'}).`,
    });
  };

  // Initial Fetch Items from Supabase (or fallback to defaults) - ONLY ON MOUNT
  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data: dbItems, error } = await supabase
        .from('checklist_items')
        .select('*')
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: true });

      if (error || !dbItems || dbItems.length === 0) {
        setUsingSupabase(false);
        const localSaved = localStorage.getItem('melodiva_local_checklist_items');
        if (localSaved) {
          try {
            setItems(JSON.parse(localSaved));
          } catch {
            setItems(DEFAULT_ITEMS);
          }
        } else {
          setItems(DEFAULT_ITEMS);
        }
      } else {
        setUsingSupabase(true);
        const sanitized = (dbItems as ChecklistItem[]).map((i) => ({
          ...i,
          assigned_to: i.assigned_to === 'MTMB' ? 'TMB' : i.assigned_to,
        }));
        setItems(sanitized);
      }
    } catch {
      setUsingSupabase(false);
      setItems(DEFAULT_ITEMS);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncLatestData = async () => {
    localStorage.removeItem('melodiva_local_checklist_items');
    await fetchItems();
    toast({
      title: 'Checklist Synchronized',
      description: 'Loaded latest website and social media tasks from live database.',
    });
  };

  useEffect(() => {
    const currentVer = localStorage.getItem('melodiva_checklist_version');
    if (currentVer !== 'v6_mrs_faith_credentials') {
      localStorage.removeItem('melodiva_local_checklist_items');
      localStorage.setItem('melodiva_checklist_version', 'v6_mrs_faith_credentials');
    }
    fetchItems();
  }, []);

  useEffect(() => {
    if (showCreateModal) {
      setNewTargetTab(activeTab);
      setNewCategory(activeTab === 'website' ? 'Delivery Pricing' : 'Phase 1: Setup');
    }
  }, [showCreateModal, activeTab]);

  // Fetch Comments for Selected Item
  const fetchComments = async (itemId: string) => {
    if (usingSupabase) {
      const { data, error } = await supabase
        .from('checklist_comments')
        .select('*')
        .eq('item_id', itemId)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setComments(data as ChecklistComment[]);
        return;
      }
    }

    const targetItem = items.find((i) => i.id === itemId);
    setComments(targetItem?.comments || []);
  };

  const handleOpenItemDetails = (item: ChecklistItem) => {
    setSelectedItem(item);
    fetchComments(item.id);
  };

  // Smooth, Instant Status Update - NO Page Reloads
  const handleUpdateStatus = async (itemId: string, newStatus: ChecklistStatus) => {
    setItems((prevItems) => {
      const updated = prevItems.map((i) => (i.id === itemId ? { ...i, status: newStatus } : i));
      if (!usingSupabase) {
        localStorage.setItem('melodiva_local_checklist_items', JSON.stringify(updated));
      }
      return updated;
    });

    if (selectedItem && selectedItem.id === itemId) {
      setSelectedItem((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    if (usingSupabase) {
      const { error } = await supabase
        .from('checklist_items')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', itemId);

      if (error) {
        toast({ title: 'Error saving to database', description: error.message, variant: 'destructive' });
      }
    }

    toast({ title: 'Status updated', description: `Task moved to ${STATUS_CONFIG[newStatus].label}` });
  };

  // Smooth Assignee Update
  const handleUpdateAssignee = async (itemId: string, newAssignee: string) => {
    setItems((prevItems) => {
      const updated = prevItems.map((i) => (i.id === itemId ? { ...i, assigned_to: newAssignee } : i));
      if (!usingSupabase) {
        localStorage.setItem('melodiva_local_checklist_items', JSON.stringify(updated));
      }
      return updated;
    });

    if (selectedItem && selectedItem.id === itemId) {
      setSelectedItem((prev) => (prev ? { ...prev, assigned_to: newAssignee } : null));
    }

    if (usingSupabase) {
      await supabase.from('checklist_items').update({ assigned_to: newAssignee }).eq('id', itemId);
    }
    toast({ title: 'Assignee updated', description: `Assigned to ${newAssignee}` });
  };

  // SUPERVISOR ONLY: Update Target Due Date
  const handleUpdateDueDate = async (itemId: string, newDate: string) => {
    if (!isSupervisor) {
      toast({
        title: 'Supervisor Authority Required',
        description: 'Only Mrs. Faith (Supervisor) can edit task timeframes and due dates.',
        variant: 'destructive',
      });
      return;
    }

    setItems((prevItems) => {
      const updated = prevItems.map((i) => (i.id === itemId ? { ...i, due_date: newDate } : i));
      if (!usingSupabase) {
        localStorage.setItem('melodiva_local_checklist_items', JSON.stringify(updated));
      }
      return updated;
    });

    if (selectedItem && selectedItem.id === itemId) {
      setSelectedItem((prev) => (prev ? { ...prev, due_date: newDate } : null));
    }

    if (usingSupabase) {
      await supabase.from('checklist_items').update({ due_date: newDate }).eq('id', itemId);
    }
    toast({ title: 'Timeframe updated', description: `Target date set to ${newDate}` });
  };

  // Add Comment
  const handleAddComment = async () => {
    if (!newCommentText.trim() || !selectedItem) return;

    if (!currentUser) {
      setShowIdentityModal(true);
      return;
    }

    setIsSubmittingComment(true);
    const commentPayload = {
      id: `comment-${Date.now()}`,
      item_id: selectedItem.id,
      author_name: currentUser,
      comment_text: newCommentText.trim(),
      created_at: new Date().toISOString(),
    };

    if (usingSupabase) {
      const { data, error } = await supabase
        .from('checklist_comments')
        .insert([{
          item_id: selectedItem.id,
          author_name: currentUser,
          comment_text: newCommentText.trim(),
        }])
        .select()
        .single();

      if (error) {
        toast({ title: 'Failed to add comment', description: error.message, variant: 'destructive' });
      } else if (data) {
        setComments((prev) => [...prev, data as ChecklistComment]);
        setNewCommentText('');
        toast({ title: 'Comment added' });
      }
    } else {
      setComments((prev) => [...prev, commentPayload]);
      setItems((prevItems) => {
        const updated = prevItems.map((i) => {
          if (i.id === selectedItem.id) {
            const itemComments = i.comments || [];
            return { ...i, comments: [...itemComments, commentPayload] };
          }
          return i;
        });
        localStorage.setItem('melodiva_local_checklist_items', JSON.stringify(updated));
        return updated;
      });
      setNewCommentText('');
      toast({ title: 'Comment added' });
    }

    setIsSubmittingComment(false);
  };

  // Create Task
  const handleCreateTask = async () => {
    if (!newTitle.trim()) {
      toast({ title: 'Title is required', variant: 'destructive' });
      return;
    }

    const newTaskPayload = {
      id: `task-${Date.now()}`,
      tab: newTargetTab,
      title: newTitle.trim(),
      description: newDescription.trim(),
      category: newCategory.trim() || 'General',
      status: newStatus,
      assigned_to: newAssignee,
      due_date: newDueDate || null,
      order_index: items.length + 1,
      created_at: new Date().toISOString(),
    };

    if (usingSupabase) {
      const { data, error } = await supabase
        .from('checklist_items')
        .insert([{
          tab: newTargetTab,
          title: newTitle.trim(),
          description: newDescription.trim(),
          category: newCategory.trim() || 'General',
          status: newStatus,
          assigned_to: newAssignee,
          due_date: newDueDate || null,
          order_index: items.length + 1,
        }])
        .select()
        .single();

      if (error) {
        toast({ title: 'Error creating task', description: error.message, variant: 'destructive' });
      } else if (data) {
        setItems((prev) => [...prev, data as ChecklistItem]);
        toast({ title: 'Task created successfully' });
      }
    } else {
      setItems((prev) => {
        const updated = [...prev, newTaskPayload as ChecklistItem];
        localStorage.setItem('melodiva_local_checklist_items', JSON.stringify(updated));
        return updated;
      });
      toast({ title: 'Task created successfully' });
    }

    setNewTitle('');
    setNewDescription('');
    setNewCategory('General');
    setNewDueDate('');
    setShowCreateModal(false);
  };

  // Filtered Items (Preserves order_index order)
  const tabItems = useMemo(() => {
    return items
      .filter((item) => item.tab === activeTab)
      .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
  }, [items, activeTab]);

  const filteredItems = useMemo(() => {
    return tabItems.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesAssignee =
        filterAssignee === 'all' || item.assigned_to.toLowerCase() === filterAssignee.toLowerCase();

      return matchesSearch && matchesAssignee;
    });
  }, [tabItems, searchQuery, filterAssignee]);

  // Statistics per tab
  const websiteItems = useMemo(() => items.filter((i) => i.tab === 'website'), [items]);
  const socialItems = useMemo(() => items.filter((i) => i.tab === 'social_media'), [items]);

  const websiteDone = websiteItems.filter((i) => i.status === 'done').length;
  const websitePct = websiteItems.length > 0 ? Math.round((websiteDone / websiteItems.length) * 100) : 0;

  const socialDone = socialItems.filter((i) => i.status === 'done').length;
  const socialPct = socialItems.length > 0 ? Math.round((socialDone / socialItems.length) * 100) : 0;

  const currentTabDoneCount = tabItems.filter((i) => i.status === 'done').length;
  const currentTabInProgressCount = tabItems.filter((i) => i.status === 'in_progress').length;
  const currentTabPendingCount = tabItems.filter((i) => i.status === 'pending_review').length;
  const currentTabTodoCount = tabItems.filter((i) => i.status === 'todo').length;

  const userRole = TEAM_ROLES[currentUser as TeamMember]?.role || 'Team Member';

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Branding Bar - Logo and Name only */}
        <div className="flex items-center space-x-3 pb-4 border-b border-border/40">
          <img src={melodivaLogo} alt="Melodiva Logo" className="h-10 w-auto object-contain" />
          <span className="text-2xl font-bold text-foreground">Melodiva Skin Care</span>
        </div>

        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border p-6 rounded-2xl shadow-xs">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Melodiva Master Checklist & Roadmap
            </h1>
            <p className="text-sm text-muted-foreground">
              Supervised by <strong>Mrs. Faith</strong> • Tech & Strategy by <strong>TMB</strong> • Website Data by <strong>Melody</strong> • Social Operations & Testing by <strong>Favor</strong>
            </p>
          </div>

          {/* User Identity Pill & Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-3.5 py-1.5 rounded-full text-sm whitespace-nowrap shrink-0">
              <UserCheck className="h-4 w-4 text-primary shrink-0" />
              <span className="text-xs text-muted-foreground whitespace-nowrap">User:</span>
              <span className="font-semibold text-primary whitespace-nowrap">{currentUser || 'Not set'}</span>
              <Badge variant="outline" className="text-[10px] ml-1 bg-background text-primary border-primary/30 whitespace-nowrap">
                {userRole}
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowIdentityModal(true)}
              className="text-xs h-9"
            >
              Switch User
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSyncLatestData}
              className="text-xs h-9 gap-1.5"
              title="Sync latest tasks from database"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Sync Items
            </Button>
            <Button onClick={() => setShowCreateModal(true)} className="gap-2 shadow-xs h-9">
              <Plus className="h-4 w-4" /> Add Task
            </Button>
          </div>
        </div>

        {/* TEAM ROLES OVERVIEW CARDS (4 TEAM MEMBERS - ALL ON ONE LINE ON DESKTOP/TABLET) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TEAM_MEMBERS.map((member) => {
            const roleInfo = TEAM_ROLES[member];
            const isCurrent = currentUser === member;
            return (
              <Card
                key={member}
                className={`bg-card border-border shadow-xs transition-all ${isCurrent ? 'ring-2 ring-primary' : ''}`}
              >
                <CardContent className="p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {member === 'Mrs. Faith' ? (
                        <ShieldCheck className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                      ) : (
                        <User className="h-4 w-4 shrink-0 text-primary" />
                      )}
                      <span className="font-bold text-xs sm:text-sm text-foreground truncate">{member}</span>
                    </div>
                    <Badge
                      variant={member === 'Mrs. Faith' ? 'default' : 'secondary'}
                      className="text-[9px] uppercase font-semibold shrink-0 px-1.5 py-0.5"
                    >
                      {roleInfo.role.split(' ')[0]}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">{roleInfo.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* DUAL PROGRESS BARS FOR WEBSITE & SOCIAL MEDIA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Social Media Campaign Progress */}
          <Card className={`bg-card border-border shadow-xs transition-all ${activeTab === 'social_media' ? 'ring-2 ring-primary/40' : ''}`}>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-primary" />
                  <span className="font-bold text-sm text-foreground">Social Media Campaign Progress (2 Months)</span>
                </div>
                <span className="font-bold text-sm text-primary">{socialPct}%</span>
              </div>
              <Progress value={socialPct} className="h-2.5 bg-muted" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{socialDone} of {socialItems.length} completed</span>
                <span className="font-medium text-foreground">{socialItems.length - socialDone} remaining</span>
              </div>
            </CardContent>
          </Card>

          {/* Website Launch Progress */}
          <Card className={`bg-card border-border shadow-xs transition-all ${activeTab === 'website' ? 'ring-2 ring-primary/40' : ''}`}>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  <span className="font-bold text-sm text-foreground">Website Launch Progress</span>
                </div>
                <span className="font-bold text-sm text-primary">{websitePct}%</span>
              </div>
              <Progress value={websitePct} className="h-2.5 bg-muted" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{websiteDone} of {websiteItems.length} completed</span>
                <span className="font-medium text-foreground">{websiteItems.length - websiteDone} remaining</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* MAIN TABS WITH PERSISTED TAB STATE */}
        <Tabs value={activeTab} onValueChange={(v) => handleTabChange(v as ChecklistTab)}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <TabsList className="grid grid-cols-2 w-full sm:w-auto">
              <TabsTrigger value="social_media" className="gap-2 px-6">
                <Share2 className="h-4 w-4" /> Social Media (2 Months) ({socialItems.length})
              </TabsTrigger>
              <TabsTrigger value="website" className="gap-2 px-6">
                <Globe className="h-4 w-4" /> Website Checklist ({websiteItems.length})
              </TabsTrigger>
            </TabsList>

            {/* View Mode & Filter Controls */}
            <div className="flex items-center gap-3">
              <div className="relative max-w-xs w-full sm:w-64">
                <Search className="h-4 w-4 absolute left-3 top-2.5 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-xs"
                />
              </div>

              <Select value={filterAssignee} onValueChange={setFilterAssignee}>
                <SelectTrigger className="w-36 h-9 text-xs">
                  <Filter className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  <SelectValue placeholder="Assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assignees</SelectItem>
                  {TEAM_MEMBERS.map((member) => (
                    <SelectItem key={member} value={member}>
                      {member} ({TEAM_ROLES[member].role.split(' ')[0]})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* View Switcher */}
              <div className="flex items-center border border-border rounded-lg p-0.5 bg-muted/30">
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="h-8 px-2.5 text-xs"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-3.5 w-3.5 mr-1" /> List
                </Button>
                <Button
                  variant={viewMode === 'board' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="h-8 px-2.5 text-xs"
                  onClick={() => setViewMode('board')}
                >
                  <LayoutGrid className="h-3.5 w-3.5 mr-1" /> Board
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Counters Row for Current Tab */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
            <div className="bg-slate-100 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="text-muted-foreground font-medium">To Do</span>
              <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">{currentTabTodoCount}</span>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/40 p-3 rounded-xl border border-blue-200 dark:border-blue-800/60 flex items-center justify-between">
              <span className="text-blue-700 dark:text-blue-400 font-medium">In Progress</span>
              <span className="font-bold text-blue-700 dark:text-blue-400 text-sm">{currentTabInProgressCount}</span>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200 dark:border-amber-800/60 flex items-center justify-between">
              <span className="text-amber-700 dark:text-amber-400 font-medium">Pending Review</span>
              <span className="font-bold text-amber-700 dark:text-amber-400 text-sm">{currentTabPendingCount}</span>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">Completed</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">{currentTabDoneCount}</span>
            </div>
          </div>

          {/* TAB CONTENTS */}
          {(['social_media', 'website'] as ChecklistTab[]).map((tabKey) => (
            <TabsContent key={tabKey} value={tabKey} className="mt-6 space-y-6">
              {loading ? (
                <div className="py-16 text-center text-muted-foreground">Loading roadmap checklist items...</div>
              ) : filteredItems.length === 0 ? (
                <div className="py-16 text-center border-2 border-dashed border-border rounded-2xl bg-muted/10 space-y-3">
                  <p className="text-muted-foreground">No tasks found matching your filter.</p>
                  <Button variant="outline" size="sm" onClick={() => { setSearchQuery(''); setFilterAssignee('all'); }}>
                    Clear Filters
                  </Button>
                </div>
              ) : viewMode === 'list' ? (
                /* DEFAULT CHRONOLOGICAL LIST VIEW */
                <Card className="bg-card border-border shadow-xs">
                  <CardContent className="p-0 divide-y divide-border/60">
                    {filteredItems.map((item) => {
                      const statusConfig = STATUS_CONFIG[item.status];
                      const isSupervisorItem = item.assigned_to === 'Mrs. Faith';

                      return (
                        <div
                          key={item.id}
                          onClick={() => handleOpenItemDetails(item)}
                          className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/40 transition-all cursor-pointer group"
                        >
                          {/* Title & Info */}
                          <div className="space-y-1.5 flex-1 pr-4">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="secondary" className="text-[10px] uppercase font-semibold">
                                {item.category}
                              </Badge>
                              {isSupervisorItem && (
                                <Badge className="text-[10px] uppercase font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 gap-1">
                                  <ShieldCheck className="h-3 w-3" /> Supervisor Signoff
                                </Badge>
                              )}
                              <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                                {item.title}
                              </h4>
                            </div>
                            {item.description && (
                              <p className="text-xs text-muted-foreground line-clamp-1 leading-relaxed">
                                {item.description}
                              </p>
                            )}
                          </div>

                          {/* Quick Controls */}
                          <div className="flex items-center gap-3 text-xs shrink-0" onClick={(e) => e.stopPropagation()}>
                            {/* Assignee Badge */}
                            <div className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1 rounded-md text-foreground/80 font-medium border border-border/50">
                              <User className="h-3.5 w-3.5 text-primary" />
                              <span>{item.assigned_to}</span>
                            </div>

                            {/* Target Date Badge */}
                            {item.due_date && (
                              <div className="hidden lg:flex items-center gap-1 text-muted-foreground bg-muted/30 px-2.5 py-1 rounded-md border border-border/40">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>{new Date(item.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                              </div>
                            )}

                            {/* Status Quick Dropdown */}
                            <Select
                              value={item.status}
                              onValueChange={(val) => handleUpdateStatus(item.id, val as ChecklistStatus)}
                            >
                              <SelectTrigger className={`h-8 text-xs w-36 font-semibold border ${statusConfig.border} ${statusConfig.bg} ${statusConfig.text}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="todo">To Do</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="pending_review">Pending Review</SelectItem>
                                <SelectItem value="done">Done</SelectItem>
                              </SelectContent>
                            </Select>

                            {/* View/Comment Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2.5 text-xs text-muted-foreground hover:text-primary"
                              onClick={() => handleOpenItemDetails(item)}
                            >
                              <MessageSquare className="h-3.5 w-3.5 mr-1" />
                              Details
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              ) : (
                /* BOARD VIEW */
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {(['todo', 'in_progress', 'pending_review', 'done'] as ChecklistStatus[]).map((statusKey) => {
                    const statusConfig = STATUS_CONFIG[statusKey];
                    const columnItems = filteredItems.filter((i) => i.status === statusKey);
                    const StatusIcon = statusConfig.icon;

                    return (
                      <div
                        key={statusKey}
                        className={`rounded-2xl p-4 border ${statusConfig.border} ${statusConfig.bg} flex flex-col space-y-3 min-h-[480px]`}
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-border/50">
                          <div className="flex items-center gap-2">
                            <StatusIcon className={`h-4 w-4 ${statusConfig.text}`} />
                            <h3 className={`font-semibold text-sm ${statusConfig.text}`}>{statusConfig.label}</h3>
                          </div>
                          <Badge variant="outline" className="text-xs bg-background/80">
                            {columnItems.length}
                          </Badge>
                        </div>

                        <div className="space-y-3 flex-1 overflow-y-auto max-h-[700px] pr-1">
                          {columnItems.map((item) => (
                            <Card
                              key={item.id}
                              className="bg-card border-border hover:shadow-md transition-all duration-200 cursor-pointer group"
                              onClick={() => handleOpenItemDetails(item)}
                            >
                              <CardHeader className="p-4 pb-2 space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <Badge variant="secondary" className="text-[10px] uppercase font-semibold">
                                    {item.category}
                                  </Badge>
                                  <div onClick={(e) => e.stopPropagation()}>
                                    <Select
                                      value={item.status}
                                      onValueChange={(val) => handleUpdateStatus(item.id, val as ChecklistStatus)}
                                    >
                                      <SelectTrigger className="h-6 text-[11px] px-2 w-28 bg-background">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="todo">To Do</SelectItem>
                                        <SelectItem value="in_progress">In Progress</SelectItem>
                                        <SelectItem value="pending_review">Pending Review</SelectItem>
                                        <SelectItem value="done">Done</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <CardTitle className="text-sm font-semibold group-hover:text-primary transition-colors line-clamp-2">
                                  {item.title}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="p-4 pt-0 space-y-3">
                                {item.description && (
                                  <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                                )}
                                <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
                                  <div className="flex items-center gap-1 font-medium text-foreground/80">
                                    <User className="h-3.5 w-3.5 text-primary" />
                                    <span>{item.assigned_to}</span>
                                  </div>
                                  {item.due_date && (
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      <span>{new Date(item.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}

                          {columnItems.length === 0 && (
                            <div className="text-center py-8 text-xs text-muted-foreground/60 border border-dashed rounded-xl">
                              No items
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* IDENTITY SELECTION MODAL */}
        <Dialog open={showIdentityModal} onOpenChange={setShowIdentityModal}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" /> Select Team Identity
              </DialogTitle>
              <DialogDescription>
                Choose your identity among the team members (<strong>Mrs. Faith</strong>, <strong>TMB</strong>, <strong>Favor</strong>, or <strong>Melody</strong>).
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TEAM_MEMBERS.map((member) => {
                  const roleInfo = TEAM_ROLES[member];
                  return (
                    <Button
                      key={member}
                      type="button"
                      variant={identityInput === member ? 'default' : 'outline'}
                      className="flex flex-col items-start justify-between p-3.5 h-auto space-y-2 text-left"
                      onClick={() => setIdentityInput(member)}
                    >
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-xs">
                          <User className="h-3.5 w-3.5" /> {member}
                        </div>
                        <span className="text-[10px] opacity-80 block font-medium mt-0.5">{roleInfo.role}</span>
                      </div>
                    </Button>
                  );
                })}
              </div>

              <div className="space-y-2 pt-2 border-t">
                <label className="text-xs font-medium text-muted-foreground">Or Write In Name:</label>
                <Input
                  placeholder="e.g. Melody"
                  value={identityInput}
                  onChange={(e) => setIdentityInput(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button onClick={() => handleSaveIdentity(identityInput)} className="w-full">
                Confirm Identity
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* TASK DETAILS & COMMENTS MODAL */}
        {selectedItem && (
          <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
            <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
              <DialogHeader className="space-y-3">
                <div className="flex items-center justify-between gap-2 pr-8">
                  <Badge variant="outline" className="text-xs">
                    {selectedItem.category}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Status:</span>
                    <Select
                      value={selectedItem.status}
                      onValueChange={(val) => handleUpdateStatus(selectedItem.id, val as ChecklistStatus)}
                    >
                      <SelectTrigger className="h-7 text-xs w-36 font-semibold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="pending_review">Pending Review</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogTitle className="text-xl font-bold leading-snug">{selectedItem.title}</DialogTitle>
                {selectedItem.description && (
                  <DialogDescription className="text-sm text-foreground/80 leading-relaxed bg-muted/30 p-3 rounded-lg border border-border">
                    {selectedItem.description}
                  </DialogDescription>
                )}
              </DialogHeader>

              {/* Task Meta Information & Supervisor-Only Timeframe Editing */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-3 border-y border-border text-xs">
                <div>
                  <span className="text-muted-foreground block mb-1">Assignee</span>
                  <Select
                    value={selectedItem.assigned_to}
                    onValueChange={(val) => handleUpdateAssignee(selectedItem.id, val)}
                  >
                    <SelectTrigger className="h-7 text-xs font-semibold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TEAM_MEMBERS.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m} ({TEAM_ROLES[m].role.split(' ')[0]})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <span className="text-muted-foreground block mb-1">Tab Roadmap</span>
                  <span className="font-semibold capitalize text-foreground">{selectedItem.tab.replace('_', ' ')}</span>
                </div>

                {/* Target Date: Editable ONLY by Supervisor Mrs. Faith */}
                <div>
                  <span className="text-muted-foreground flex items-center gap-1 mb-1">
                    Target Due Date
                    {!isSupervisor && <Lock className="h-3 w-3 text-muted-foreground/70" />}
                  </span>
                  {isSupervisor ? (
                    <Input
                      type="date"
                      value={selectedItem.due_date || ''}
                      onChange={(e) => handleUpdateDueDate(selectedItem.id, e.target.value)}
                      className="h-7 text-xs font-semibold"
                    />
                  ) : (
                    <div className="flex items-center gap-1.5 py-1 text-foreground font-semibold">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      <span>
                        {selectedItem.due_date
                          ? new Date(selectedItem.due_date).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : 'No deadline'}
                      </span>
                    </div>
                  )}
                  {!isSupervisor && (
                    <span className="text-[10px] text-muted-foreground italic block mt-0.5">
                      Managed by Supervisor (Mrs. Faith)
                    </span>
                  )}
                </div>
              </div>

              {/* Comments Section */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <span>Team Comments ({comments.length})</span>
                </div>

                {/* List of Comments */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-muted/40 p-3 rounded-xl border border-border/60 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-primary" />
                          <span className="font-bold text-foreground">{comment.author_name}</span>
                          {comment.author_name in TEAM_ROLES && (
                            <Badge variant="outline" className="text-[9px] px-1 py-0 bg-background text-muted-foreground">
                              {TEAM_ROLES[comment.author_name as TeamMember].role}
                            </Badge>
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(comment.created_at).toLocaleString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-foreground/90 leading-relaxed pl-5">{comment.comment_text}</p>
                    </div>
                  ))}

                  {comments.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-4 italic">
                      No comments yet. Share updates or notes!
                    </p>
                  )}
                </div>

                {/* Add Comment Input */}
                <div className="space-y-2 pt-2 border-t border-border">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Commenting as <strong className="text-primary">{currentUser || 'Guest'}</strong></span>
                  </div>
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Add a comment or progress update..."
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      rows={2}
                      className="text-xs min-h-[60px]"
                    />
                    <Button
                      onClick={handleAddComment}
                      disabled={isSubmittingComment || !newCommentText.trim()}
                      className="self-end gap-1.5 h-10 px-4"
                    >
                      <Send className="h-3.5 w-3.5" /> Post
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* CREATE TASK MODAL */}
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" /> Create New Task
              </DialogTitle>
              <DialogDescription>
                Select roadmap target (Social Media or Website) and category for your new task.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              {/* Target Roadmap Dropdown: Social Media vs Website */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Roadmap Target *</label>
                  <Select
                    value={newTargetTab}
                    onValueChange={(val) => {
                      const tabVal = val as ChecklistTab;
                      setNewTargetTab(tabVal);
                      setNewCategory(tabVal === 'website' ? 'Delivery Pricing' : 'Phase 1: Setup');
                    }}
                  >
                    <SelectTrigger className="h-9 font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="social_media">Social Media (2 Months)</SelectItem>
                      <SelectItem value="website">Website Checklist</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Category *</label>
                  <Select value={newCategory} onValueChange={setNewCategory}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {newTargetTab === 'website' ? (
                        <>
                          <SelectItem value="Delivery Pricing">Delivery Pricing</SelectItem>
                          <SelectItem value="Backend & Infra">Backend & Infra</SelectItem>
                          <SelectItem value="Website Audit">Website Audit</SelectItem>
                          <SelectItem value="Media & Assets">Media & Assets</SelectItem>
                          <SelectItem value="Legal & Policies">Legal & Policies</SelectItem>
                          <SelectItem value="Deployment">Deployment</SelectItem>
                          <SelectItem value="QA & Testing">QA & Testing</SelectItem>
                          <SelectItem value="Supervision">Supervision</SelectItem>
                          <SelectItem value="General">General</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="Phase 1: Setup">Phase 1: Setup</SelectItem>
                          <SelectItem value="Phase 2: Launch">Phase 2: Launch</SelectItem>
                          <SelectItem value="Phase 3: Spotlights">Phase 3: Spotlights</SelectItem>
                          <SelectItem value="Phase 4: Sales Push">Phase 4: Sales Push</SelectItem>
                          <SelectItem value="Phase 4: Supervision">Phase 4: Supervision</SelectItem>
                          <SelectItem value="General">General</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Task Title *</label>
                <Input
                  placeholder="e.g. Post Product Spotlight Video on Instagram"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Description</label>
                <Textarea
                  placeholder="Detailed task description..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Assigned To</label>
                <Select value={newAssignee} onValueChange={setNewAssignee}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TEAM_MEMBERS.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m} ({TEAM_ROLES[m].role.split(' ')[0]})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Initial Status</label>
                  <Select value={newStatus} onValueChange={(v) => setNewStatus(v as ChecklistStatus)}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="pending_review">Pending Review</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Target Date</label>
                  <Input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTask}>Create Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
