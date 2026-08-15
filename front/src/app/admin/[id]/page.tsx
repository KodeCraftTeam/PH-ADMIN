'use client'

import { AdminDashboard } from "@/features/admin/AdminDashboard";
import { useParams } from "next/navigation";

export default function AdminPage() {
  const params = useParams();
  const propertyId = params.id as string;

  console.log(propertyId);

  if (!propertyId) {
    return <div>No se encontró la propiedad</div>;
  }


  return <AdminDashboard id={propertyId} />;
}