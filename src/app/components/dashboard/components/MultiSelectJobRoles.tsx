"use client";

import React, { useEffect, useState, useMemo } from "react";
import { IoSearchOutline } from "react-icons/io5";
import useJobRoles from "../hooks/useJobRoles";
import styles from "../styles/MultiSelectJobRoles.module.css";

interface MultiSelectJobRolesProps {
  selectedRoles: string[];
  onChange: (roles: string[]) => void;
}

const MultiSelectJobRoles: React.FC<MultiSelectJobRolesProps> = ({
  selectedRoles,
  onChange,
}) => {
  const { jobRoles, loading, error, fetchJobRoles } = useJobRoles();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchJobRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  if (loading) {
    return <div className={styles.loading}>Loading job roles...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <label className={styles.label}>Select Job Roles:</label>

      <div className={styles.searchContainer}>
        <IoSearchOutline className={styles.searchIcon} />
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search job roles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={styles.optionsContainer}>
        {filteredAndSortedRoles.map((role) => (
          <div
            key={role}
            className={`${styles.option} ${
              selectedRoles.includes(role) ? styles.selected : ""
            }`}
            onClick={() => toggleRole(role)}
          >
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={selectedRoles.includes(role)}
              readOnly
            />
            {role}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiSelectJobRoles;
