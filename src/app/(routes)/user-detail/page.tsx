"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "./components/Header";
import { Tabs } from "./components/Tabs";
import { ProfileSection } from "./components/ProfileSection";
import { OrdersSection } from "./components/OrdersSection";
import { StatsSection } from "./components/StatsSection";
import { getUserDetailForProfile,updateUser } from "./service/userDetailService";
import { getCurrentUser, UserPayload } from "@/helper/helper";

import { 
  UserProfile, 
  OrderStatus, 
  statusStyles,
  Order 
} from "./service/userDetailService";

const UserProfilePage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"profile" | "orders">("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [orderFilter, setOrderFilter] = useState("all");
  const [toast, setToast] = useState<{ show: boolean; msg: string; type: "success" | "error" | "info" }>({
    show: false,
    msg: "",
    type: "success",
  });

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [saving, setSaving] = useState(false);

  const showToast = (msg: string, type: "success" | "error" | "info" = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: "", type }), 2500);
  };

  // Safely coerce incoming date to YYYY-MM-DD
  const toDateInput = (d?: string | null) => {
    if (!d) return new Date().toISOString().slice(0, 10);
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
    const iso = new Date(d).toISOString();
    return iso.slice(0, 10);
  };

  // Fetch & merge user data from API/service
  const refreshUserData = async (): Promise<void> => {
    try {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        router.replace("/authentication");
        return;
      }

      const resp = await getUserDetailForProfile();
      // Handle both { data: UserProfile } and direct UserProfile responses
      const payload = (resp && typeof resp === 'object' && 'data' in resp) 
        ? resp.data as Partial<UserProfile>
        : resp as Partial<UserProfile> | undefined;
      if (!payload) return;

      setUserProfile(prev => {
        const base: UserProfile =
          prev ??
          ({
            id: currentUser.id,
            firstName: "",
            lastName: "",
            email: currentUser.email ?? "",
            phone: "",
            dateOfBirth: toDateInput(),
            gender: "other",
            profileImage: "/default-avatar.png",
            joinedDate: new Date().toISOString(),
            totalOrders: 0,
            totalSpent: 0,
            loyaltyPoints: 0,
          } as UserProfile);

        return {
          ...base,
          ...payload,
          id: payload.id ?? base.id,
          email: payload.email ?? base.email,
          firstName: payload.firstName ?? base.firstName,
          lastName: payload.lastName ?? base.lastName,
          phone: payload.phone ?? base.phone,
          gender: (payload.gender as UserProfile["gender"]) ?? base.gender,
          dateOfBirth: toDateInput(payload.dateOfBirth ?? base.dateOfBirth),
          profileImage: payload.profileImage ?? base.profileImage,
          joinedDate: payload.joinedDate ?? base.joinedDate,
          totalOrders: payload.totalOrders ?? base.totalOrders,
          totalSpent: payload.totalSpent ?? base.totalSpent,
          loyaltyPoints: payload.loyaltyPoints ?? base.loyaltyPoints,
        };
      });
    } catch (error) {
      console.error("Error refreshing user data:", error);
      showToast(error instanceof Error ? error.message : "Failed to refresh user data", "error");
    }
  };

  useEffect(() => {
    const u = getCurrentUser() as UserPayload | null;
    if (!u) {
      router.replace("/authentication");
      return;
    }
    // Seed with token data first
    setUserProfile({
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      phone: "",
      dateOfBirth: "",
      gender: "other",
      profileImage: "/images/gym1.svg",
      joinedDate: new Date().toISOString().slice(0, 10),
      totalOrders: 0,
      totalSpent: 0,
      loyaltyPoints: 0,
    });
    // Then hydrate from API
    refreshUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const [orders] = useState<Order[]>([
    // … your sample orders unchanged …
  ]);

  const filteredOrders =
    orderFilter === "all" ? orders : orders.filter((o) => o.status === (orderFilter as OrderStatus));

  // Parent-owned save handler
  const handleSave = async (
    userData: Pick<UserProfile, "firstName" | "lastName" | "email" | "phone" | "dateOfBirth" | "gender">
  ) => {
    try {
      setSaving(true);

      if (!userData.firstName?.trim() || !userData.lastName?.trim()) {
        showToast("First and last name are required", "error");
        return false;
      }

      // Call updateUser service which already handles the response
      const result = await updateUser(userData);
      if (!result) {
        throw new Error("No data returned from server");
      }

      await refreshUserData();
      showToast("Profile updated successfully", "success");
      return true;
    } catch (e) {
      console.error("Update error:", e);
      showToast(e instanceof Error ? e.message : "Failed to update profile", "error");
      return false;
    } finally {
      setSaving(false);
    }
  };

  if (!userProfile) return null;

  return (
    <main className="pt-20 bg-white">
      <style jsx global>{`
        :root {
          --color-primary: #bee304;
        }
        .text-primary {
          color: var(--color-primary);
        }
        .bg-primary {
          background-color: var(--color-primary);
        }
        .border-primary {
          border-color: var(--color-primary);
        }
      `}</style>

      {toast.show && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow ${
            toast.type === "success"
              ? "bg-green-50 text-gray-800 border-l-4 border-primary"
              : toast.type === "error"
              ? "bg-red-50 text-red-700 border-l-4 border-red-500"
              : "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
          }`}
        >
          <div className="flex items-center">
            <span className="font-medium">{toast.msg}</span>
            <button
              onClick={() => setToast({ show: false, msg: "", type: toast.type })}
              className="ml-3 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <section className="px-4 sm:px-6 lg:px-8 xl:px-20 py-8 sm:py-12">
        <Header userProfile={userProfile} />
        <Tabs activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === "profile" && (
          <ProfileSection<UserProfile>
            userProfile={userProfile}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            setUserProfile={setUserProfile}
            showToast={showToast}
            onSave={handleSave}              // ✅ pass function, not result
            isSaving={saving}                // ✅ parent controls saving state
          />
        )}

        {activeTab === "orders" && (
          <OrdersSection
            filteredOrders={filteredOrders}
            orderFilter={orderFilter}
            setOrderFilter={setOrderFilter}
            statusStyles={statusStyles}
          />
        )}
      </section>

      <StatsSection
        joinedDate={userProfile.joinedDate}
        totalOrders={userProfile.totalOrders}
        totalSpent={userProfile.totalSpent}
        loyaltyPoints={userProfile.loyaltyPoints}
      />
    </main>
  );
};

export default UserProfilePage;
