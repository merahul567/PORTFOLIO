import React, { lazy, Suspense, useEffect } from "react";
import { useLocation, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import ReactGA from 'react-ga4';
import PageFallback from "./layout/PageFallback";

const HomePage = lazy(() => import("./pages/HomePage/HomePage"));
const MarketsPage = lazy(() => import("./pages/MarketsPage/MarketsPage"));
const TodayPage = lazy(() => import("./pages/TodayPage/TodayPage"));
const ToolsPage = lazy(() => import("./pages/ToolsPage/ToolsPage"));
const ToolDetailPage = lazy(() => import("./pages/ToolDetailPage/ToolDetailPage"));
const AiPage = lazy(() => import("./pages/AiPage/AiPage"));
const InsightsPage = lazy(() => import("./pages/InsightsPage/InsightsPage"));
const AboutPage = lazy(() => import("./pages/AboutPage/AboutPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage/NotFoundPage"));

export default function App() {
  const location = useLocation();

  useEffect(() => {
    // Track page views on route change
    ReactGA.send({ hitType: 'pageview', page: location.pathname });
  }, [location]);

  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/today" element={<TodayPage />} />
          <Route path="/markets" element={<MarketsPage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/tools/:slug" element={<ToolDetailPage />} />
          <Route path="/ai" element={<AiPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<Navigate to="/insights" replace />} />
          <Route path="/contact" element={<Navigate to="/about#contact" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
