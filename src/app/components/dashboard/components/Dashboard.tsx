"use client";

import PDFUploadForm from "./PDFUploadForm";
import Footer from "./Footer";
import styles from "../styles/Dashboard.module.css";
import { useUserFromStore } from "@/store";
import HeroSection from "./HeroSection";
import { useEffect } from "react";

const Dashboard = () => {
  const { user, isSignedIn, isLoading } = useUserFromStore();
  
  useEffect(() => {
  }, [user, isSignedIn, isLoading]);
  
  return (
    <div className={styles.dashboardContainer}>
      <main className={styles.mainContent}>
        {!isSignedIn ?
          <HeroSection />
         : 
          <PDFUploadForm />
        }
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
