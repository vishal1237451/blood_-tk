"use server";

import { createServerSupabaseClient } from "@/lib/supabase";

export async function submitDonorApplication(formData: FormData) {
  const supabase = await createServerSupabaseClient();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const bloodType = formData.get("bloodType") as string;
  const dateOfBirth = formData.get("dateOfBirth") as string;
  const weight = formData.get("weight") as string;
  const address = formData.get("address") as string;
  const medicalHistory = formData.get("medicalHistory") as string;

  if (!name || !email || !phone || !bloodType || !dateOfBirth || !weight || !address) {
    return { success: false, error: "Please fill in all required fields" };
  }

  const { error } = await supabase.from("donor_applications").insert({
    full_name: name,
    email,
    phone,
    blood_type: bloodType,
    date_of_birth: dateOfBirth,
    weight: parseFloat(weight),
    address,
    medical_conditions: medicalHistory || null,
    status: "pending",
  });

  if (error) {
    console.error("Error submitting donor application:", error);
    return { success: false, error: "Failed to submit application. Please try again." };
  }

  return { success: true };
}

export async function submitBloodTestRequest(formData: FormData) {
  const supabase = await createServerSupabaseClient();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const testType = formData.get("testType") as string;
  const dateOfBirth = formData.get("dateOfBirth") as string;
  const preferredDate = formData.get("preferredDate") as string;
  const preferredTime = formData.get("preferredTime") as string;
  const notes = formData.get("notes") as string;

  if (!name || !email || !phone || !testType || !dateOfBirth || !preferredDate || !preferredTime) {
    return { success: false, error: "Please fill in all required fields" };
  }

  const { error } = await supabase.from("blood_test_requests").insert({
    full_name: name,
    email,
    phone,
    test_type: testType,
    date_of_birth: dateOfBirth,
    preferred_date: preferredDate,
    preferred_time: preferredTime,
    notes: notes || null,
    status: "pending",
  });

  if (error) {
    console.error("Error submitting blood test request:", error);
    return { success: false, error: "Failed to submit request. Please try again." };
  }

  return { success: true };
}

export async function getBloodInventory() {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("blood_inventory")
    .select("*")
    .order("blood_type");

  if (error) {
    console.error("Error fetching blood inventory:", error);
    return [];
  }

  return data;
}

export async function getDashboardStats() {
  const supabase = await createServerSupabaseClient();

  const [inventoryResult, donorsResult, testsResult] = await Promise.all([
    supabase.from("blood_inventory").select("units_available"),
    supabase.from("donor_applications").select("id").eq("status", "pending"),
    supabase.from("blood_test_requests").select("id").eq("status", "pending"),
  ]);

  const totalUnits = inventoryResult.data?.reduce(
    (sum, item) => sum + item.units_available,
    0
  ) || 0;

  const criticalTypes = inventoryResult.data?.filter(
    (item) => item.units_available <= 5
  ).length || 0;

  return {
    totalUnits,
    totalDonors: donorsResult.data?.length || 0,
    pendingTests: testsResult.data?.length || 0,
    criticalTypes,
  };
}
