"use client";

import React, { useState, useMemo } from "react";
import { IoSearchOutline, IoClose } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import useJobRoles from "../hooks/useJobRoles";
import styles from "../styles/MultiSelectJobRoles.module.css";

interface MultiSelectJobRolesProps {
  selectedRoles: string[];
  onChange: (roles: string[]) => void;
}

/**
 * Formats a job role string for display:
 * - Removes special characters (except '/')
 * - Capitalizes each word
 * - Removes leading and trailing spaces
 */
const formatJobRole = (role: string): string => {
  if (!role) return "";
  
  // Remove leading and trailing spaces
  let formatted = role.trim();
  
  // Remove special characters except '/' and spaces
  // Keep: letters, numbers, spaces, and forward slashes
  formatted = formatted.replace(/[^a-zA-Z0-9\s/]/g, "");
  
  // Capitalize each word (title case)
  formatted = formatted
    .toLowerCase()
    .split(/\s+/)
    .map((word) => {
      // Handle words with '/' - capitalize each part
      if (word.includes("/")) {
        return word
          .split("/")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join("/");
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
  
  // Remove any extra spaces
  formatted = formatted.replace(/\s+/g, " ").trim();
  
  return formatted;
};

const MultiSelectJobRoles: React.FC<MultiSelectJobRolesProps> = ({
  selectedRoles,
  onChange,
}) => {
  const { jobRoles, loading, error } = useJobRoles();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAndSortedRoles = useMemo(() => {
    let roles = [...jobRoles];

    // Filter by search term
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      roles = roles.filter((role) => role.toLowerCase().includes(lowerSearch));
    }

    // Sort: Selected items first
    roles.sort((a, b) => {
      const aSelected = selectedRoles.includes(a);
      const bSelected = selectedRoles.includes(b);
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return 0; // Keep original order otherwise
    });

    return roles;
  }, [jobRoles, searchTerm, selectedRoles]);

  const toggleRole = (role: string) => {
    if (selectedRoles.includes(role)) {
      onChange(selectedRoles.filter((r) => r !== role));
    } else {
      onChange([...selectedRoles, role]);
    }
  };

  const clearSelection = () => {
    onChange([]);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner} />
          <span className={styles.loadingText}>Loading job roles...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <span className={styles.errorText}>⚠️ {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <HiSparkles className={styles.sparkleIcon} />
          <label className={styles.label}>
            Select Related Job Roles {selectedRoles.length > 0 && `(${selectedRoles.length} selected)`}
          </label>
        </div>
        {selectedRoles.length > 0 && (
          <button className={styles.clearButton} onClick={clearSelection}>
            Clear all
          </button>
        )}
      </div>

      <div className={styles.searchContainer}>
        <IoSearchOutline className={styles.searchIcon} />
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search for job roles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            className={styles.clearSearchButton}
            onClick={() => setSearchTerm("")}
          >
            <IoClose />
          </button>
        )}
      </div>

      <div className={styles.chipsContainer}>
        {filteredAndSortedRoles.length > 0 ? (
          filteredAndSortedRoles.map((role) => {
            const isSelected = selectedRoles.includes(role);
            const formattedRole = formatJobRole(role);
            return (
              <div
                key={role}
                className={`${styles.chip} ${
                  isSelected ? styles.chipSelected : ""
                }`}
                onClick={() => toggleRole(role)}
              >
                {isSelected && <FaCheckCircle className={styles.chipCheckIcon} />}
                <span className={styles.chipText}>{formattedRole}</span>
                {isSelected && (
                  <IoClose className={styles.chipRemoveIcon} />
                )}
              </div>
            );
          })
        ) : (
          <div className={styles.noResults}>
            <span>🔍 No job roles found matching &quot;{searchTerm}&quot;</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelectJobRoles;
