export interface Classroom {
  classId: string;
  ownerId: string;
  name: string;
  description: string;
}

export interface TimeTableCell {
  uuid: string;
  classId: string;
  dayweek: number;
  period: number;
  subject: string;
  teacher: string;
}

export interface Notice {
  noticeId: string;
  classId: string;
  title: string;
  content: string;
  writerId: string;
  created_at: string;
}

export interface Debate {
  debateId: string;
  classId: string;
  name: string;
  description: string;
  status: 'open' | 'closed';
  subject: string;
  created_by: string;
  created_at: string;
}
