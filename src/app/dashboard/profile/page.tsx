"use client";

import React from "react";
import "./profile.css";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Navbar from "@/app/styled_components/Navbar";

export default function ProfileDashboard() {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="profile-dashboard flex items-center justify-center">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-dashboard">
      <Navbar />
      <div className="flex justify-center p-8">
        <div className="w-full max-w-3xl space-y-8 ">
          <Card className="profile-card">
            <CardContent className="p-0">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20 border-4 border-yellow-100">
                    <AvatarImage
                      src={user.imageUrl}
                      alt={user.fullName || "User"}
                    />
                    <AvatarFallback>
                      {user.firstName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {user.fullName}
                    </h2>
                    <p className="text-gray-500">Product Designer</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="icon-button">
                    <Mail className="h-5 w-5" />
                  </div>
                  <span>{user.primaryEmailAddress?.emailAddress}</span>
                </div>
                {user.primaryPhoneNumber && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="icon-button">
                      <Phone className="h-5 w-5" />
                    </div>
                    <span>{user.primaryPhoneNumber.phoneNumber}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Resumes Section */}
          <div className="profile-card">
            <h3 className="section-title">YOUR RESUMES</h3>
            {/* Placeholder for resumes content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Content will go here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
