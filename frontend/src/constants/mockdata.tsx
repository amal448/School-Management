import { ROUTES } from '@/config/routes.config';
import {
  ArrowRight, Users, BookOpen, Calendar, Award,
  Bell, Download, MapPin, Contact, Medal, Star,
  Target, Zap, Flag, Trophy, ArrowUpRight,
  CalendarDays,
  Calculator,
  Beaker,
  Globe,
  Laptop
} from 'lucide-react';

// Mock Data
export const STATS = [
  { id: 1, label: 'Students Enrolled', value: '4,500+', icon: <Users className="w-6 h-6 text-primary" /> },
  { id: 2, label: 'Qualified Teachers', value: '320+', icon: <BookOpen className="w-6 h-6 text-primary" /> },
  { id: 3, label: 'Established', value: '1995', icon: <Award className="w-6 h-6 text-primary" /> },
];

export const ANNOUNCEMENTS = [
  { id: 1, title: 'Admissions Open for 2026-2027', date: 'April 5, 2026', type: 'Admissions', excerpt: 'We are now accepting applications for the upcoming academic year. Apply before May 15th to secure early consideration.', isNew: true },
  { id: 2, title: 'Annual Science Fair Finalists', date: 'April 2, 2026', type: 'Academics', excerpt: 'Congratulations to our High School students who made it to the state-level science fair. Check out their projects in the main hall.', isNew: false },
  { id: 3, title: 'Revised Exam Schedule Released', date: 'March 28, 2026', type: 'Exams', excerpt: 'The mid-term examination schedule has been revised. Please check the student portal for the updated timetable.', isNew: false },
];

export const UPCOMING_EVENTS = [
  { id: 1, title: 'Spring Art Exhibition', date: '15', month: 'APR', time: '10:00 AM - 4:00 PM', location: 'Main Campus Hall', category: 'Arts' },
  { id: 2, title: 'Inter-School Sports Meet', date: '22', month: 'APR', time: '08:00 AM - 5:00 PM', location: 'City Stadium', category: 'Sports' },
  { id: 3, title: 'Parent-Teacher Meeting', date: '05', month: 'MAY', time: '09:00 AM - 1:00 PM', location: 'Classrooms Block B', category: 'Academic' },
];

export const QUICK_LINKS = [
  { id: 'admissions', title: 'Admissions', icon: <Download className="w-6 h-6" />, desc: 'Apply now or download the prospectus.', path: '/admissions', color: 'bg-blue-50 text-blue-600' },
  { id: 'contact', title: 'Contact Support', icon: <Contact className="w-6 h-6" />, desc: 'Reach out for inquiries or assistance.', path: '/contact', color: 'bg-emerald-50 text-emerald-600' },
  { id: 'login', title: 'Portal Login', icon: <Users className="w-6 h-6" />, desc: 'Access your dedicated dashboard.', path: ROUTES.AUTH.ADMIN_MANAGER_LOGIN, color: 'bg-purple-50 text-purple-600' },
];

export const TOPPERS_12TH = [
  { id: 1, name: "Sarah Jenkins", stream: "Science", percentage: "98.5%", rank: 1, image: "https://i.pravatar.cc/150?u=sarah" },
  { id: 2, name: "Michael Chen", stream: "Commerce", percentage: "97.2%", rank: 2, image: "https://i.pravatar.cc/150?u=michael" },
  { id: 3, name: "Priya Sharma", stream: "Humanities", percentage: "96.8%", rank: 3, image: "https://i.pravatar.cc/150?u=priya" },
];

export const TOPPERS_10TH = [
  { id: 1, name: "Rahul Verma", percentage: "99.0%", rank: 1, image: "https://i.pravatar.cc/150?u=rahul" },
  { id: 2, name: "Emily Clark", percentage: "98.4%", rank: 2, image: "https://i.pravatar.cc/150?u=emily" },
  { id: 3, name: "David Kim", percentage: "97.9%", rank: 3, image: "https://i.pravatar.cc/150?u=david" },
];

export const CAMPUS_LIFE = [
  { id: 1, title: 'State-of-the-art Library', desc: 'Curated space for deep and focused learning.', image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80' },
  { id: 2, title: 'Modern Science Labs', desc: 'Fully equipped for hands-on experiments.', image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80' },
  { id: 3, title: 'Interactive Classrooms', desc: 'Smart boards and dynamic setups.', image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80' },
];

export const SPORTS = [
  { id: 1, title: 'Basketball Circuit', desc: 'Championship-winning team with professional coaching. Join the high-energy environment of our indoor basketball court.', image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&q=80', icon: <Target className="w-5 h-5" /> },
  { id: 2, title: 'Olympic Pool', desc: 'All-weather indoor swimming facility. Perfect for professional training and recreational laps.', image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1200&q=80', icon: <Zap className="w-5 h-5" /> },
  { id: 3, title: 'Football Turf', desc: 'Sprawling grounds for daily practice and matches. Home to our state champion football team.', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200&q=80', icon: <Flag className="w-5 h-5" /> },
  { id: 4, title: 'Athletics Track', desc: 'Standard 400m track for sprints and marathons. Build your stamina and speed on our world-class track.', image: 'https://images.unsplash.com/photo-1552674605-15c2145efa38?w=1200&q=80', icon: <Trophy className="w-5 h-5" /> },
];


// Extended Mock Data for Events/Announcements
export const ALL_ANNOUNCEMENTS = [
  { id: 1, title: 'Admissions Open for 2026-2027', category: 'Notice', date: 'April 5, 2026', content: 'We are now accepting applications for the upcoming academic year. Apply before May 15th to secure early consideration.', icon: <Bell className="w-5 h-5" /> },
  { id: 2, title: 'Annual Science Fair Finalists', category: 'Results', date: 'April 2, 2026', content: 'Congratulations to our High School students who made it to the state-level science fair. Check out their projects in the main hall.', icon: <Trophy className="w-5 h-5" /> },
  { id: 3, title: 'Inter-School Sports Meet', category: 'Event', date: 'April 22, 2026', content: 'Our school will be hosting the regional sports meet at the City Stadium. All students are encouraged to attend and support our teams.', icon: <CalendarDays className="w-5 h-5" /> },
  { id: 4, title: 'Revised Exam Schedule Released', category: 'Notice', date: 'March 28, 2026', content: 'The mid-term examination schedule has been revised. Please check the student portal for the updated timetable.', icon: <BookOpen className="w-5 h-5" /> },
  { id: 5, title: 'Spring Art Exhibition', category: 'Event', date: 'April 15, 2026', content: 'Join us for a display of magnificent artworks created by our talented middle and high school students in the Main Campus Hall.', icon: <CalendarDays className="w-5 h-5" /> },
  { id: 6, title: 'Math Olympiad Winners Announced', category: 'Results', date: 'March 20, 2026', content: 'We are thrilled to announce the medalists for this year\'s National Math Olympiad. Medals will be distributed in Thursday\'s assembly.', icon: <Trophy className="w-5 h-5" /> },
  { id: 7, title: 'Parent-Teacher Meeting', category: 'Event', date: 'May 5, 2026', content: 'The quarterly PTM will be held from 9:00 AM to 1:00 PM. Parents are requested to book their time slots via the portal.', icon: <CalendarDays className="w-5 h-5" /> },
  { id: 8, title: 'Library Book Return Policy Updated', category: 'Notice', date: 'March 15, 2026', content: 'The late fee for unreturned library books has been revised. Please ensure all borrowed books are returned within 14 days.', icon: <Bell className="w-5 h-5" /> },
  { id: 9, title: 'Robotics Club Orientation', category: 'Event', date: 'April 28, 2026', content: 'Interested in building robots? Attend the orientation session in Lab 3 to learn about the exciting projects planned for this term.', icon: <CalendarDays className="w-5 h-5" /> },
];

export const CATEGORIES = ['All', 'Event', 'Notice', 'Results'];
export const ITEMS_PER_PAGE = 5;


// Mock Data (To be replaced with DB data)
export const DEPARTMENTS = [
  { id: 1, name: 'Science & Core', icon: <Beaker className="w-8 h-8" />, desc: 'Physics, Chemistry, Biology, Environmental Sciences.', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 2, name: 'Mathematics', icon: <Calculator className="w-8 h-8" />, desc: 'Algebra, Geometry, Calculus, Statistics.', color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 3, name: 'Humanities', icon: <Globe className="w-8 h-8" />, desc: 'History, Geography, Political Science.', color: 'text-amber-500', bg: 'bg-amber-50' },
  { id: 4, name: 'Computer Science', icon: <Laptop className="w-8 h-8" />, desc: 'Programming, Web Development, AI Basics.', color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 5, name: 'Languages', icon: <BookOpen className="w-8 h-8" />, desc: 'English Literature, Spanish, French, Regional.', color: 'text-rose-500', bg: 'bg-rose-50' },
];

export const SUBJECTS_OFFERED = [
  { level: 'Middle School (Grades 6-8)', subjects: ['Mathematics', 'Integrated Science', 'Social Studies', 'English', 'Second Language', 'Intro to Computing', 'Art & Design'] },
  { level: 'High School (Grades 9-10)', subjects: ['Advanced Math', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'English Lit', 'Computer Applications', 'Physical Ed'] },
  { level: 'Senior Secondary (Grades 11-12)', subjects: ['Calculus', 'Applied Physics', 'Organic Chemistry', 'Computer Science (Java/Python)', 'Economics', 'Business Studies', 'Psychology'] },
];

export const EXAM_STRUCTURE = [
  { term: 'Term 1 / Mid-Year', duration: 'April - September', details: 'Focuses on formative assessments, project work, and a mid-term examination accounting for 40% of the final grade.', weightage: '40%' },
  { term: 'Pre-Boards (Seniors)', duration: 'January', details: 'Mock examinations simulating the final board exams to prepare senior grades effectively.', weightage: 'N/A' },
  { term: 'Term 2 / Final', duration: 'October - March', details: 'Summative assessments and the final comprehensive examination accounting for 60% of the final grade.', weightage: '60%' },
];


export const APPLICATON_STEPS = [
  { id: 1, title: 'Submit Application', desc: 'Fill out the online application form and pay the non-refundable registration fee.' },
  { id: 2, title: 'Document Verification', desc: 'Upload previous academic records, birth certificate, and identification documents.' },
  { id: 3, title: 'Entrance Assessment', desc: 'Candidates may be invited for a brief assessment or interview to understand their proficiency.' },
  { id: 4, title: 'Admission Offer', desc: 'Successful candidates receive an offer letter and instructions to finalize enrollment.' },
];

export const FEE_STRUCTURE = [
  { grade: 'Middle School (Grades 6-8)', tuition: '$4,500', term: 'per year', color: 'bg-blue-50' },
  { grade: 'High School (Grades 9-10)', tuition: '$5,200', term: 'per year', color: 'bg-emerald-50' },
  { grade: 'Senior Secondary (Grades 11-12)', tuition: '$6,000', term: 'per year', color: 'bg-purple-50' },
];

export const IMPORTANT_DATES = [
  { event: 'Applications Open (2026-2027)', date: 'April 1, 2026' },
  { event: 'Early Bird Registration Deadline', date: 'May 15, 2026' },
  { event: 'Entrance Assessments', date: 'June 10-15, 2026' },
  { event: 'Final Admission List Published', date: 'July 5, 2026' },
  { event: 'Academic Year Begins', date: 'August 18, 2026' },
];

// ── Type ──────────────────────────────────────────────
export type Student = {
  id:         string
  name:       string
  email:      string
  class:      string
  attendance: number
  status:     'active' | 'inactive' | 'suspended'
}

// ── Mock data (replace with API) ──────────────────────
export const students: Student[] = [
  { id: '1',  name: 'Arjun Menon',     email: 'arjun@school.com',   class: '10-A', attendance: 92, status: 'active' },
  { id: '2',  name: 'Priya Nair',      email: 'priya@school.com',   class: '10-B', attendance: 78, status: 'active' },
  { id: '3',  name: 'Rahul Das',       email: 'rahul@school.com',   class: '9-A',  attendance: 65, status: 'suspended' },
  { id: '4',  name: 'Sneha Pillai',    email: 'sneha@school.com',   class: '11-A', attendance: 88, status: 'active' },
  { id: '5',  name: 'Aditya Kumar',    email: 'aditya@school.com',  class: '9-B',  attendance: 95, status: 'active' },
  { id: '6',  name: 'Meera Krishnan',  email: 'meera@school.com',   class: '10-A', attendance: 72, status: 'inactive' },
  { id: '7',  name: 'Vishnu Raj',      email: 'vishnu@school.com',  class: '11-B', attendance: 89, status: 'active' },
  { id: '8',  name: 'Lakshmi Varma',   email: 'lakshmi@school.com', class: '10-B', attendance: 91, status: 'active' },
  { id: '9',  name: 'Kiran Thomas',    email: 'kiran@school.com',   class: '9-A',  attendance: 60, status: 'suspended' },
  { id: '10', name: 'Divya Suresh',    email: 'divya@school.com',   class: '11-A', attendance: 97, status: 'active' },
  { id: '11', name: 'Ravi Chandran',   email: 'ravi@school.com',    class: '9-B',  attendance: 83, status: 'active' },
  { id: '12', name: 'Ananya George',   email: 'ananya@school.com',  class: '10-A', attendance: 76, status: 'inactive' },
]