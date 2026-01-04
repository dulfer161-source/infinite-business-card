export interface TeamMember {
  id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  status: 'active' | 'pending' | 'inactive';
  lastActive: string;
  views: number;
}

export interface TeamStats {
  totalMembers: number;
  activeMembers: number;
  totalViews: number;
  availableSlots: number;
}
