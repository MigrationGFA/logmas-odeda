"use client";

import React, { useState, use } from "react";
import { getOdedaServiceById, getConfiguredFeeForService } from "@/config/odedaServices";
import { PageHeader } from "@/components/dashboard/shared";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  FileBadge,
  Clock,
  ShieldCheck,
  Receipt,
  FileText,
  User,
  ExternalLink,
  Printer,
  Calendar,
} from "lucide-react";
import { tokenManager } from "@/services/apiAuth";
import { useSubmitApplication } from "@/hooks/queries/useApplications";
import { ApplicantSnapshot } from "@/components/services/ApplicantSelectionStep";
import { Application } from "@/types/application";

// Form Imports
import CertificateOfOriginForm from "@/components/services/forms/CertificateOfOriginForm";
import ClubRegistrationForm from "@/components/services/forms/ClubRegistrationForm";
import CdaRegistrationForm from "@/components/services/forms/CdaRegistrationForm";
import FarmersRegistrationForm from "@/components/services/forms/FarmersRegistrationForm";
import EnvironmentalSanitationForm from "@/components/services/forms/EnvironmentalSanitationForm";
import TenementRateForm from "@/components/services/forms/TenementRateForm";
import HaulageFeesForm from "@/components/services/forms/HaulageFeesForm";
import LiquorLicenceForm from "@/components/services/forms/LiquorLicenceForm";
import ViewingCentreLicenceForm from "@/components/services/forms/ViewingCentreLicenceForm";
import QuarryPermitForm from "@/components/services/forms/QuarryPermitForm";
import StreetNamingForm from "@/components/services/forms/StreetNamingForm";
import KioskLicenceForm from "@/components/services/forms/KioskLicenceForm";

interface PageProps {
  params: Promise<{ serviceId: string }>;
}

export default function ServiceDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const serviceId = resolvedParams.serviceId;
  const router = useRouter();
  const service = getOdedaServiceById(serviceId);

  const currentUser = tokenManager.getUser();
  const userRole = currentUser?.role || "citizen";
  const isFieldOfficer = userRole === "field_officer";

  const submitApplicationMutation = useSubmitApplication();
  const [submittedApp, setSubmittedApp] = useState<Application | null>(null);

  // Initialize applicant profile snapshot based on role
  const initialApplicant: ApplicantSnapshot = {
    fullName: currentUser
      ? `${currentUser.firstName || ""} ${currentUser.lastName || ""}`.trim() ||
        currentUser.name ||
        currentUser.businessName ||
        ""
      : "",
    phone: currentUser?.phone || "",
    email: currentUser?.email || "",
    address: currentUser?.address || "",
    ward: currentUser?.ward || "Ward 7 (Itesi / Camp)",
    nin: currentUser?.nin || "",
    cacNumber: currentUser?.cacNumber || "",
    applicantId: currentUser?.id || null,
    isRegistered: !!currentUser?.id,
  };

  if (!service) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto py-6 px-4">
        <PageHeader
          title="Service Not Found"
          subtitle="The requested Odeda LGA service could not be found."
        />
        <Button asChild variant="outline">
          <Link href="/dashboard/services">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Services Catalogue
          </Link>
        </Button>
      </div>
    );
  }

  const handleSubmit = async (payload: any) => {
    let applicant: ApplicantSnapshot = initialApplicant;
    let formData: Record<string, any> = {};
    let files: Record<string, any> = {};

    // Check if unified payload structure is passed
    if (payload && (payload.applicant || payload.files || payload.formData)) {
      applicant = payload.applicant || initialApplicant;
      formData = payload.formData || {};
      files = payload.files || {};
    } else {
      // Legacy dictionary fallback
      formData = payload || {};
      const fallbackName =
        formData.fullName ||
        formData.clubName ||
        formData.cdaName ||
        formData.farmerName ||
        formData.businessName ||
        formData.ownerName ||
        formData.companyName ||
        formData.applicantName ||
        formData.kioskName ||
        initialApplicant.fullName ||
        "Odeda Citizen / Business";

      applicant = {
        fullName: fallbackName,
        phone: formData.phone || formData.phoneNo || initialApplicant.phone || "08012345678",
        email: formData.email || initialApplicant.email || "",
        address:
          formData.address ||
          formData.farmLocation ||
          formData.siteAddress ||
          initialApplicant.address ||
          "Odeda LGA, Ogun State",
        ward: formData.ward || initialApplicant.ward || "Ward 7 (Itesi / Camp)",
        nin: formData.nin || initialApplicant.nin || "",
        cacNumber: formData.cacNumber || initialApplicant.cacNumber || "",
        applicantId: initialApplicant.applicantId || null,
        isRegistered: !!initialApplicant.applicantId,
      };
    }

    try {
      // Construct clean submission data without sending feeAmount!
      const res = await submitApplicationMutation.mutateAsync({
        serviceId: service.id,
        fullName: applicant.fullName || "Applicant",
        phone: applicant.phone || "08012345678",
        email: applicant.email || undefined,
        address: applicant.address || "Odeda Local Government Area",
        ward: applicant.ward || "Ward 7 (Itesi / Camp)",
        nin: applicant.nin || undefined,
        cacNumber: applicant.cacNumber || undefined,
        applicantId: applicant.applicantId || undefined,
        formData,
        files,
      });

      setSubmittedApp(res);
    } catch (err) {
      console.error("Submission failed:", err);
    }
  };

  const currentFee = getConfiguredFeeForService(service.id) || service.defaultFee;

  const renderForm = () => {
    const commonProps = {
      service,
      onSubmit: handleSubmit,
      isSubmitting: submitApplicationMutation.isPending,
      mode: (isFieldOfficer ? "field_officer" : userRole === "business_owner" ? "business_owner" : "citizen") as any,
      initialApplicant,
    };

    switch (service.id) {
      case "certificate_of_origin":
        return <CertificateOfOriginForm {...commonProps} />;
      case "club_registration":
        return <ClubRegistrationForm {...commonProps} />;
      case "cda_registration":
        return <CdaRegistrationForm {...commonProps} />;
      case "farmers_registration":
        return <FarmersRegistrationForm {...commonProps} />;
      case "environmental_sanitation":
        return <EnvironmentalSanitationForm {...commonProps} />;
      case "tenement_rate":
        return <TenementRateForm {...commonProps} />;
      case "haulage_fees":
        return <HaulageFeesForm {...commonProps} />;
      case "liquor_licence":
        return <LiquorLicenceForm {...commonProps} />;
      case "viewing_centre_licence":
        return <ViewingCentreLicenceForm {...commonProps} />;
      case "quarry_permit":
        return <QuarryPermitForm {...commonProps} />;
      case "street_naming":
        return <StreetNamingForm {...commonProps} />;
      case "kiosk_licence":
        return <KioskLicenceForm {...commonProps} />;
      default:
        return <CertificateOfOriginForm {...commonProps} />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4 sm:py-6 px-3 sm:px-6">
      {/* Top Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <Link
              href="/dashboard/services"
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="h-3 w-3" /> Services Catalogue
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">{service.category}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
            {service.name}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 max-w-2xl">
            {service.description}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block">
              Statutory Fee
            </span>
            <span className="text-base sm:text-lg font-black text-primary">
              ₦{currentFee.toLocaleString()}
            </span>
          </div>
          <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
            {service.timeline}
          </Badge>
        </div>
      </div>

      {/* SUCCESS CONFIRMATION STATE */}
      {submittedApp ? (
        <Card className="border-2 border-emerald-500/30 bg-emerald-500/5 shadow-md">
          <CardHeader className="text-center pb-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <CardTitle className="text-xl sm:text-2xl font-black text-foreground">
              Statutory Application Submitted!
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm max-w-lg mx-auto">
              Your application for <strong>{service.name}</strong> has been transmitted to Odeda Local Government Authority.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 max-w-2xl mx-auto">
            {/* Reference Box */}
            <div className="bg-background border rounded-xl p-4 sm:p-5 space-y-4 shadow-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Application Number:</span>
                  <span className="font-mono font-bold text-sm text-primary">
                    {submittedApp.applicationNo}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Status:</span>
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-700 text-xs border-amber-300 font-semibold mt-0.5">
                    {submittedApp.status}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Applicant Name:</span>
                  <span className="font-semibold text-foreground">{submittedApp.fullName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Ward of Application:</span>
                  <span className="font-semibold text-foreground">{submittedApp.ward || "Ward 7"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Revenue Head:</span>
                  <span className="font-semibold text-foreground">{submittedApp.revenueHead}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Calculated Statutory Fee:</span>
                  <span className="font-bold text-foreground">₦{submittedApp.amount?.toLocaleString()}</span>
                </div>
              </div>

              <div className="border-t pt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(submittedApp.createdAt).toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className="font-mono text-[11px]">Ref: {submittedApp.id}</span>
              </div>
            </div>

            {/* Next Steps Guidance */}
            <div className="bg-muted/30 border rounded-xl p-4 text-xs space-y-2">
              <h5 className="font-bold text-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" /> What happens next?
              </h5>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground leading-relaxed pl-1">
                <li>Odeda LGA Desk Officers will examine your documents against traditional council and departmental records.</li>
                <li>You will receive SMS/dashboard updates if any additional inspections or verification are required.</li>
                <li>Upon approval by the Executive Chairman, your official statutory certificate/licence will be generated.</li>
              </ol>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button asChild className="gap-2 bg-primary text-primary-foreground font-semibold">
                <Link href="/dashboard/applications">
                  <FileText className="h-4 w-4" /> View in My Applications
                </Link>
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <Link href="/dashboard/receipts">
                  <Receipt className="h-4 w-4" /> View Payment Receipts
                </Link>
              </Button>
              <Button
                variant="ghost"
                onClick={() => setSubmittedApp(null)}
                className="text-xs text-muted-foreground"
              >
                Submit Another Application
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* SERVICE FORM WIZARD */
        <div>{renderForm()}</div>
      )}
    </div>
  );
}
