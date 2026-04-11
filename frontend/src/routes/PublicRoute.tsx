// src/routes/PublicRoutes.tsx
import { Routes, Route } from 'react-router-dom'
import PublicLayout from '@/layouts/PublicLayout'
import LandingPage from '@/pages/public/LandingPage'
import AboutPage from '@/pages/public/AboutPage'
import AcademicsPage from '@/pages/public/AcademicsPage'
import AdmissionsPage from '@/pages/public/AdmissionsPage'
import EventsPage from '@/pages/public/EventsPage'
import ContactPage from '@/pages/public/ContactPage'

export default function PublicRoutes() {
    return (
        <Routes>
            <Route element={<PublicLayout />}>
                <Route index element={<LandingPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="academics" element={<AcademicsPage />} />
                <Route path="admissions" element={<AdmissionsPage />} />
                <Route path="events" element={<EventsPage />} />
                <Route path="contact" element={<ContactPage />} />
            </Route>
        </Routes>
    )
}