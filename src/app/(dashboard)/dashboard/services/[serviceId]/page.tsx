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
import { ArrowLeft, CheckCircle2, FileBadge, Clock, Shield, Receipt } from "lucide-react";
import { genId, genQRToken, genReceiptNumber, genVerificationCode } from "@/lib/store";

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

import { createOdedaApplication } from "@/lib/odedaApplications";

interface PageProps {
  params: Promise<{ serviceId: string }>;
}

export default function ServiceDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const serviceId = resolvedParams.serviceId;
  const router = useRouter();

  const service = getOdedaServiceById(serviceId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<any | null>(null);

  if (!service) {
    return (
      <div className="space-y-6">
        <PageHeader title="Service Not Found" subtitle="The requested Odeda LGA service could not be found." />
        <Button asChild variant="outline">
          <Link href="/dashboard/services"><ArrowLeft className="h-4 w-4 mr-2" /> Back to Services Catalogue</Link>
        </Button>
      </div>
    );
  }

  const handleSubmit = (formData: Record<string, any>) => {
    setIsSubmitting(true);

    setTimeout(() => {
      const applicantName =
        formData.fullName ||
        formData.clubName ||
        formData.cdaName ||
        formData.farmerName ||
        formData.businessName ||
        formData.ownerName ||
        formData.companyName ||
        formData.applicantName ||
        formData.kioskName ||
        "Odeda Citizen / Business";

      const newApp = createOdedaApplication({
        serviceId: service.id,
        serviceName: service.name,
        category: service.category,
        applicant: applicantName,
        phone: formData.phone || formData.phoneNo || "08012345678",
        email: formData.email,
        address: formData.address || formData.farmLocation || formData.siteAddress || "Odeda LGA",
        ward: formData.ward || "Ward 7 (Itesi / Camp)",
        nin: formData.nin,
        cacNumber: formData.cacNumber,
        revenueHead: service.revenueHead,
        amount: formData.amount || getConfiguredFeeForService(service.id) || service.defaultFee,
        details: formData,
        isDraft: false,
      });

      setSubmittedApp(newApp);
      setIsSubmitting(false);
    }, 1000);
  };

  const renderForm = () => {
    switch (service.id) {
      case "certificate_of_origin":
        return <CertificateOfOriginForm service={service} onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
      case "club_registration":
        return <ClubRegistrationForm service={service} onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
      case "cda_registration":
        return <CdaRegistrationForm service={service} onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
      case "farmers_registration":
        return <FarmersRegistrationForm service={service} onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
      case "environmental_sanitation":
        return <EnvironmentalSanitationForm service={service} onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
      case "tenement_rate":
        return <TenementRateForm service={service} onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
      case "haulage_fees":
        return <HaulageFeesForm service={service} onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
      case "liquor_licence":
        return <LiquorLicenceForm service={service} onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
      case "viewing_centre_licence":
        return <ViewingCentreLicenceForm service={service} onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
      case "quarry_permit":
        return <QuarryPermitForm service={service} onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
      case "street_naming":
        return <StreetNamingForm service={service} onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
      case "kiosk_licence":
        return <KioskLicenceForm service={service} onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
      default:
        return <CertificateOfOriginForm service={service} onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm" className="gap-1 text-xs">
          <Link href="/dashboard/services"><ArrowLeft className="h-4 w-4" /> Back to Services</Link>
        </Button>
      </div>

      <PageHeader
        title={service.name}
        subtitle={`${service.description} — Official Odeda Local Government Portal.`}
      />

      {submittedApp ? (
        <Card className="border-success/30 bg-success/5 p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-success/20 text-success rounded-full shrink-0">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <Badge variant="outline" className="border-success/40 text-success text-xs">Application Submitted & Paid</Badge>
              <h3 className="text-xl font-bold">Application Received successfully!</h3>
              <p className="text-xs text-muted-foreground">
                Your application reference is <strong className="text-foreground">{submittedApp.id}</strong>.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-background p-4 rounded-lg border">
            <div>
              <span className="text-muted-foreground block">Applicant Name:</span>
              <span className="font-semibold">{submittedApp.applicant}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Ward:</span>
              <span className="font-semibold">{submittedApp.ward} Ward</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Amount Paid:</span>
              <span className="font-semibold text-success">₦{submittedApp.amount.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Digital Receipt:</span>
              <span className="font-mono">{submittedApp.receiptNumber}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Verification Code:</span>
              <span className="font-mono">{submittedApp.verificationCode}</span>
            </div>
            <div>
              <span className="text-muted-foreground block">Status:</span>
              <Badge variant="outline" className="border-amber-500/30 text-amber-600 dark:text-amber-400">
                Pending LGA Review
              </Badge>
            </div>
          </div>

          <Alert className="bg-primary/5 border-primary/20 text-xs">
            <Shield className="h-4 w-4 text-primary" />
            <AlertTitle className="font-semibold">Next Steps</AlertTitle>
            <AlertDescription className="text-xs">
              Your application has been logged into the Odeda LGA approval queue. You can monitor progress, view history, or download your official document once approved from your Applications dashboard.
            </AlertDescription>
          </Alert>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild className="gap-2 text-xs">
              <Link href="/dashboard/applications">
                <FileBadge className="h-4 w-4" /> Go to My Applications
              </Link>
            </Button>

            <Button asChild variant="outline" className="gap-2 text-xs">
              <Link href="/dashboard/receipts">
                <Receipt className="h-4 w-4" /> View Payment Receipts
              </Link>
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <Card className="lg:col-span-2 p-6 bg-gradient-card">
            {renderForm()}
          </Card>

          {/* Sidebar Guidelines */}
          <div className="space-y-4">
            <Card className="p-4 bg-muted/20 border-border/60 space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" /> Statutory Timeline
              </h4>
              <p className="text-xs text-muted-foreground">
                Average processing duration for {service.name} is <strong>{service.processingTime}</strong> upon fee confirmation and inspection clearance.
              </p>
            </Card>

            <Card className="p-4 bg-muted/20 border-border/60 space-y-3">
              <h4 className="font-semibold text-sm">Revenue Code & Head</h4>
              <div className="text-xs space-y-1">
                <p className="text-muted-foreground">Revenue Head: <span className="font-mono font-medium text-foreground">{service.revenueHead}</span></p>
                <p className="text-muted-foreground">Service Category: <span className="font-medium text-foreground">{service.category}</span></p>
              </div>
            </Card>

            <Card className="p-4 bg-muted/20 border-border/60 space-y-3">
              <h4 className="font-semibold text-sm">Document Requirements</h4>
              <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-4">
                {service.requiredDocuments.map((doc, i) => (
                  <li key={i}>{doc}</li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
