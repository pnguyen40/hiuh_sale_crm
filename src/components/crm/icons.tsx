import {
  Home, FileText, Stethoscope, UserCheck, UserPlus, Building2, Search, SlidersHorizontal, Columns3,
  Download, Save, X, Info, AlertTriangle, CheckCircle2, CalendarCheck, Link, Lock, FlaskConical,
  ListChecks, ChevronLeft, ChevronRight, ChevronDown, ArrowLeft, ArrowRight, FilterX, GripVertical,
  BookmarkPlus, SearchX, CornerDownRight, LayoutDashboard, Users, Contact, History, Filter, Upload,
  Phone, MessageSquare, Mail, Pencil, NotebookPen, Ban, CheckSquare, Square, CircleDot, Circle,
  RotateCcw, ArrowLeftRight, Handshake, Megaphone, Zap, CalendarPlus, BadgeCheck, ShieldCheck,
  Award, Menu, Sparkles, MousePointerClick, UserCog, Briefcase, Check, type LucideIcon,
} from "lucide-react";

/** Maps the prototype's legacy icon names to Lucide icons. */
const MAP: Record<string, LucideIcon> = {
  home: Home, article: FileText, stethoscope: Stethoscope, how_to_reg: UserCheck, person_add: UserPlus,
  apartment: Building2, search: Search, tune: SlidersHorizontal, view_column: Columns3, download: Download,
  save: Save, close: X, info: Info, warning: AlertTriangle, check_circle: CheckCircle2,
  event_available: CalendarCheck, link: Link, lock: Lock, science: FlaskConical, checklist: ListChecks,
  chevron_left: ChevronLeft, chevron_right: ChevronRight, expand_more: ChevronDown, arrow_back: ArrowLeft,
  arrow_forward: ArrowRight, filter_alt_off: FilterX, drag_indicator: GripVertical, bookmark_add: BookmarkPlus,
  search_off: SearchX, subdirectory_arrow_right: CornerDownRight, dashboard: LayoutDashboard,
  space_dashboard: LayoutDashboard, groups: Users, contacts: Contact, history: History, filter_alt: Filter,
  upload_file: Upload, call: Phone, chat: MessageSquare, sms: MessageSquare, mail: Mail, edit: Pencil,
  edit_note: NotebookPen, cancel: Ban, check_box: CheckSquare, check_box_outline_blank: Square,
  radio_button_checked: CircleDot, radio_button_unchecked: Circle, restart_alt: RotateCcw,
  swap_horiz: ArrowLeftRight, handshake: Handshake, campaign: Megaphone, bolt: Zap,
  calendar_add_on: CalendarPlus, verified: BadgeCheck, verified_user: ShieldCheck, workspace_premium: Award,
  fiber_new: Sparkles, touch_app: MousePointerClick, manage_accounts: UserCog, assignment_ind: Briefcase,
  menu: Menu, add_business: Building2, domain_add: Building2, done: Check,
};

export function Ic({ n, className, style }: { n?: string; className?: string; style?: React.CSSProperties }) {
  const C = (n && MAP[n]) || Circle;
  return <C aria-hidden="true" className={className} style={style} strokeWidth={1.5} />;
}
