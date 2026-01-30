"use client";

import styles from "@/app/components/dashboard/styles/Reviews.module.css";

export default function ReviewsPage() {
  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Software Engineer",
      rating: 5,
      comment: "Resume.ai helped me land my dream job at Google! The ATS optimization was spot-on and my resume passed through their system perfectly. Highly recommend!",
      date: "2 weeks ago",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Product Manager",
      rating: 5,
      comment: "I was struggling to get callbacks, but after using Resume.ai, I got 3 interviews in the first week. The keyword optimization really makes a difference.",
      date: "1 month ago",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Data Scientist",
      rating: 5,
      comment: "The interface is so easy to use and the results are amazing. My resume looks professional and gets noticed. Worth every penny!",
      date: "3 weeks ago",
    },
    {
      id: 4,
      name: "David Thompson",
      role: "Marketing Director",
      rating: 5,
      comment: "As someone who reviews resumes, I can tell you this tool creates ATS-friendly resumes that actually get read. Game changer!",
      date: "1 week ago",
    },
    {
      id: 5,
      name: "Jessica Martinez",
      role: "UX Designer",
      rating: 5,
      comment: "I tried multiple resume services, but Resume.ai is by far the best. Fast, accurate, and affordable. Got my new job within 2 weeks!",
      date: "2 months ago",
    },
    {
      id: 6,
      name: "Robert Kim",
      role: "DevOps Engineer",
      rating: 5,
      comment: "The AI really understands what recruiters are looking for. My resume went from getting no responses to multiple interview requests.",
      date: "3 weeks ago",
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? styles.starFilled : styles.starEmpty}>
        ★
      </span>
    ));
  };

  return (
    <div className={styles.reviewsContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>What Our Users Say</h1>
        <p className={styles.subtitle}>
          Join thousands of professionals who have successfully optimized their resumes and landed their dream jobs
        </p>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>4.9/5</div>
            <div className={styles.statLabel}>Average Rating</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>10K+</div>
            <div className={styles.statLabel}>Happy Users</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>95%</div>
            <div className={styles.statLabel}>Success Rate</div>
          </div>
        </div>
      </div>

      <div className={styles.reviewsGrid}>
        {reviews.map((review) => (
          <div key={review.id} className={styles.reviewCard}>
            <div className={styles.reviewHeader}>
              <div className={styles.userInfo}>
                <div className={styles.avatar}>
                  {review.name.charAt(0)}
                </div>
                <div className={styles.userDetails}>
                  <h3 className={styles.userName}>{review.name}</h3>
                  <p className={styles.userRole}>{review.role}</p>
                </div>
              </div>
              <div className={styles.rating}>
                {renderStars(review.rating)}
              </div>
            </div>
            <p className={styles.reviewComment}>{review.comment}</p>
            <div className={styles.reviewFooter}>
              <span className={styles.reviewDate}>{review.date}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Ready to Transform Your Resume?</h2>
        <p className={styles.ctaText}>
          Join thousands of professionals who have successfully optimized their resumes
        </p>
        <button className={styles.ctaButton}>Get Started Free</button>
      </div>
    </div>
  );
}
