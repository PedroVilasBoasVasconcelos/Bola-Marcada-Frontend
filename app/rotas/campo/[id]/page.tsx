"use client";

import FieldDetailsSection from "@/app/components/pages/field_details/index";

export default function FieldDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return <FieldDetailsSection fieldId={params.id} />;
}
