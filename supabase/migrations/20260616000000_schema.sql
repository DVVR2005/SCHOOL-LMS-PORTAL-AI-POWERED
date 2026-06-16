-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Users Table (Synced with auth.users)
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  email text unique not null,
  role text not null check (role in ('admin', 'teacher', 'student', 'parent')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for users
alter table public.users enable row level security;

-- 2. Classes Table (Independent/Teacher-led groups)
create table public.classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  section text not null,
  teacher_id uuid, -- updated once teachers table is created
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (name, section)
);

alter table public.classes enable row level security;

-- 3. Teachers Table (Details for teacher role)
create table public.teachers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade unique not null,
  department text not null,
  qualification text not null,
  joining_date date not null default current_date
);

alter table public.teachers enable row level security;

-- Add foreign key constraint to classes referencing teachers
alter table public.classes 
  add constraint fk_classes_teacher 
  foreign key (teacher_id) references public.teachers(id) on delete set null;

-- 4. Students Table (Details for student role)
create table public.students (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade unique not null,
  admission_number text unique not null,
  class_id uuid references public.classes(id) on delete set null,
  parent_name text not null,
  phone text not null,
  address text not null,
  parent_id uuid references public.users(id) on delete set null -- links to parent profile
);

alter table public.students enable row level security;

-- 5. Subjects Table
create table public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  class_id uuid references public.classes(id) on delete cascade not null,
  teacher_id uuid references public.teachers(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.subjects enable row level security;

-- 6. Attendance Table
create table public.attendance (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.students(id) on delete cascade not null,
  date date not null default current_date,
  status text not null check (status in ('present', 'absent', 'late', 'excused')),
  marked_by uuid references public.users(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (student_id, date)
);

alter table public.attendance enable row level security;

-- 7. Assignments Table
create table public.assignments (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  class_id uuid references public.classes(id) on delete cascade not null,
  teacher_id uuid references public.teachers(id) on delete set null,
  due_date timestamp with time zone not null,
  file_url text, -- Storage link for worksheet PDFs
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.assignments enable row level security;

-- 8. Submissions Table
create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid references public.assignments(id) on delete cascade not null,
  student_id uuid references public.students(id) on delete cascade not null,
  file_url text not null, -- Student's uploaded homework
  submitted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  grade text,
  feedback text,
  graded_by uuid references public.teachers(id) on delete set null,
  unique (assignment_id, student_id)
);

alter table public.submissions enable row level security;

-- 9. Exams Table
create table public.exams (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  class_id uuid references public.classes(id) on delete cascade not null,
  exam_date date not null,
  duration_minutes integer default 60 not null,
  questions jsonb default '[]'::jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.exams enable row level security;

-- 10. Results Table
create table public.results (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid references public.exams(id) on delete cascade not null,
  student_id uuid references public.students(id) on delete cascade not null,
  marks numeric not null check (marks >= 0),
  grade text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (exam_id, student_id)
);

alter table public.results enable row level security;

-- 11. Fees Table
create table public.fees (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.students(id) on delete cascade not null,
  amount numeric not null check (amount > 0),
  due_date date not null,
  status text not null check (status in ('pending', 'paid', 'overdue')),
  tx_ref text unique,
  paid_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.fees enable row level security;

-- 12. Notifications Table
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  user_id uuid references public.users(id) on delete cascade not null,
  read boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.notifications enable row level security;

-- 13. Messages Table (Internal Chat)
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references public.users(id) on delete cascade not null,
  receiver_id uuid references public.users(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.messages enable row level security;

-- 14. Audit Logs Table
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  action text not null,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.audit_logs enable row level security;


-- ==========================================
-- INDEXES FOR PERFORMANCE
-- ==========================================
create index idx_users_role on public.users(role);
create index idx_students_class on public.students(class_id);
create index idx_students_parent on public.students(parent_id);
create index idx_attendance_student_date on public.attendance(student_id, date);
create index idx_assignments_class on public.assignments(class_id);
create index idx_submissions_assignment on public.submissions(assignment_id);
create index idx_results_student on public.results(student_id);
create index idx_fees_student on public.fees(student_id);
create index idx_messages_conversation on public.messages(sender_id, receiver_id);


-- ==========================================
-- AUTHENTICATION SYNC TRIGGER
-- ==========================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'New User'),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'student')
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Helper function to check role in session metadata or user table
create or replace function public.get_user_role(user_id uuid)
returns text as $$
  select role from public.users where id = user_id;
$$ language sql security definer;

-- USERS POLICIES
create policy "Allow read access to anyone authenticated"
  on public.users for select
  to authenticated
  using (true);

create policy "Allow admins complete control over users"
  on public.users for all
  to authenticated
  using (public.get_user_role(auth.uid()) = 'admin');

-- STUDENTS POLICIES
create policy "Students can view their own profile"
  on public.students for select
  to authenticated
  using (user_id = auth.uid());

create policy "Parents can view their child's profile"
  on public.students for select
  to authenticated
  using (parent_id = auth.uid());

create policy "Teachers can view all student profiles"
  on public.students for select
  to authenticated
  using (public.get_user_role(auth.uid()) = 'teacher');

create policy "Admins have full access to students"
  on public.students for all
  to authenticated
  using (public.get_user_role(auth.uid()) = 'admin');

-- TEACHERS POLICIES
create policy "Anyone authenticated can view teachers"
  on public.teachers for select
  to authenticated
  using (true);

create policy "Teachers can edit their own details"
  on public.teachers for update
  to authenticated
  using (user_id = auth.uid());

create policy "Admins have full access to teachers"
  on public.teachers for all
  to authenticated
  using (public.get_user_role(auth.uid()) = 'admin');

-- CLASSES POLICIES
create policy "Anyone authenticated can view classes"
  on public.classes for select
  to authenticated
  using (true);

create policy "Admins have full access to classes"
  on public.classes for all
  to authenticated
  using (public.get_user_role(auth.uid()) = 'admin');

-- ATTENDANCE POLICIES
create policy "Teachers can manage attendance"
  on public.attendance for all
  to authenticated
  using (public.get_user_role(auth.uid()) in ('teacher', 'admin'));

create policy "Students can view their own attendance"
  on public.attendance for select
  to authenticated
  using (student_id in (select id from public.students where user_id = auth.uid()));

create policy "Parents can view child attendance"
  on public.attendance for select
  to authenticated
  using (student_id in (select id from public.students where parent_id = auth.uid()));

-- ASSIGNMENTS POLICIES
create policy "Anyone authenticated can view assignments"
  on public.assignments for select
  to authenticated
  using (true);

create policy "Teachers can manage assignments"
  on public.assignments for all
  to authenticated
  using (public.get_user_role(auth.uid()) in ('teacher', 'admin'));

-- SUBMISSIONS POLICIES
create policy "Students can manage their own submissions"
  on public.submissions for all
  to authenticated
  using (student_id in (select id from public.students where user_id = auth.uid()));

create policy "Teachers can view and grade all submissions"
  on public.submissions for all
  to authenticated
  using (public.get_user_role(auth.uid()) in ('teacher', 'admin'));

create policy "Parents can view their child's submissions"
  on public.submissions for select
  to authenticated
  using (student_id in (select id from public.students where parent_id = auth.uid()));

-- EXAMS POLICIES
create policy "Anyone authenticated can view exams"
  on public.exams for select
  to authenticated
  using (true);

create policy "Teachers can manage exams"
  on public.exams for all
  to authenticated
  using (public.get_user_role(auth.uid()) in ('teacher', 'admin'));

-- RESULTS POLICIES
create policy "Students can view their own results"
  on public.results for select
  to authenticated
  using (student_id in (select id from public.students where user_id = auth.uid()));

create policy "Parents can view their child's results"
  on public.results for select
  to authenticated
  using (student_id in (select id from public.students where parent_id = auth.uid()));

create policy "Teachers and Admins can manage results"
  on public.results for all
  to authenticated
  using (public.get_user_role(auth.uid()) in ('teacher', 'admin'));

-- FEES POLICIES
create policy "Students can view their own fees"
  on public.fees for select
  to authenticated
  using (student_id in (select id from public.students where user_id = auth.uid()));

create policy "Parents can view their child's fees"
  on public.fees for select
  to authenticated
  using (student_id in (select id from public.students where parent_id = auth.uid()));

-- Admins can manage all fees
create policy "Admins can manage all fees"
  on public.fees for all
  to authenticated
  using (public.get_user_role(auth.uid()) = 'admin');

-- MESSAGES POLICIES
create policy "Users can view their own conversation messages"
  on public.messages for select
  to authenticated
  using (sender_id = auth.uid() or receiver_id = auth.uid());

create policy "Users can send messages"
  on public.messages for insert
  to authenticated
  with check (sender_id = auth.uid());

-- NOTIFICATIONS POLICIES
create policy "Users can view and update their own notifications"
  on public.notifications for all
  to authenticated
  using (user_id = auth.uid());

-- AUDIT LOGS POLICIES
create policy "Admins can view audit logs"
  on public.audit_logs for select
  to authenticated
  using (public.get_user_role(auth.uid()) = 'admin');
