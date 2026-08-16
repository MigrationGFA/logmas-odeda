"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WARDS } from "@/lib/mock-data";
import { OdedaService, getConfiguredFeeForService } from "@/config/odedaServices";
import { FormWizard, FormStep } from "./FormWizard";
import { DocumentUploadStep, DocumentSpec } from "./DocumentUploadStep";
import { ReviewSubmitStep, ReviewSection } from "./ReviewSubmitStep";

interface Props {
  service: OdedaService;
  onSubmit: (formData: Record<string, any>) => void;
  isSubmitting?: boolean;
}

const STEPS: FormStep[] = [
  {
    id: "applicant_info",
    title: "Applicant & Identity Information",
    shortTitle: "Applicant Info",
    description: "Provide personal information and Odeda LGA ward residency details.",
  },
  {
    id: "lineage_info",
    title: "Ancestral Lineage & Compounds",
    shortTitle: "Lineage & Roots",
    description: "Provide ancestral family compound, village, and traditional lineage information.",
  },
  {
    id: "documents",
    title: "Supporting Documents",
    shortTitle: "Documents",
    description: "Upload statutory proof of identity, lineage, and Baale identification letter.",
  },
  {
    id: "review",
    title: "Review & Submit",
    shortTitle: "Review",
    description: "Verify all details, sign statutory declaration, and proceed to payment.",
  },
];

const DOCUMENTS: DocumentSpec[] = [
  {
    id: "passport_photo",
    label: "Passport Photograph",
    description: "Recent color passport photograph (clear background).",
    required: true,
    acceptedFormats: ".jpg,.jpeg,.png",
  },
  {
    id: "nin_slip",
    label: "NIN Slip / National ID",
    description: "Official National Identity Management Commission (NIMC) slip or card.",
    required: true,
  },
  {
    id: "baale_letter",
    label: "Baale / Traditional Ruler Letter",
    description: "Official letter of indigene identification signed by Community Baale or Village Head.",
    required: true,
  },
  {
    id: "birth_certificate",
    label: "Birth Certificate / Age Declaration",
    description: "National Population Commission (NPC) Birth Certificate or High Court Sworn Declaration.",
    required: true,
  },
];

export default function CertificateOfOriginForm({ service, onSubmit, isSubmitting }: Props) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});
  const [declaration, setDeclaration] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1: Personal
    fullName: "",
    dob: "",
    gender: "Male",
    maritalStatus: "Single",
    phone: "",
    email: "",
    nin: "",
    address: "",
    ward: WARDS[0] || "Odeda",
    occupation: "",

    // Step 2: Lineage
    fatherName: "",
    fatherCompound: "",
    fatherVillage: "",
    motherName: "",
    motherCompound: "",
    motherVillage: "",
    familyBaale: "",
    purpose: "Employment / NYSC / Admission",
    previousApplication: "No",
  });

  const handleFileUpload = (docId: string, fileName: string) => {
    setUploadedFiles((prev) => ({ ...prev, [docId]: fileName }));
  };

  const handleFileRemove = (docId: string) => {
    setUploadedFiles((prev) => {
      const next = { ...prev };
      delete next[docId];
      return next;
    });
  };

  const validateStep = (index: number): boolean => {
    if (index === 0) {
      return (
        !!formData.fullName.trim() &&
        !!formData.dob &&
        !!formData.phone.trim() &&
        !!formData.address.trim() &&
        !!formData.ward &&
        !!formData.nin.trim()
      );
    }
    if (index === 1) {
      return (
        !!formData.fatherName.trim() &&
        !!formData.fatherCompound.trim() &&
        !!formData.motherName.trim() &&
        !!formData.motherCompound.trim() &&
        !!formData.purpose.trim()
      );
    }
    if (index === 2) {
      const missing = DOCUMENTS.filter((d) => d.required && !uploadedFiles[d.id]);
      return missing.length === 0;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStepIndex)) {
      setCurrentStepIndex((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const handlePrev = () => {
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!declaration) return;

    const currentFee = getConfiguredFeeForService(service.id) || service.defaultFee;
    onSubmit({
      ...formData,
      uploadedFiles,
      amount: currentFee,
      revenueHead: service.revenueHead,
      serviceName: service.name,
      applicant: formData.fullName,
    });
  };

  const currentFee = getConfiguredFeeForService(service.id) || service.defaultFee;

  const reviewSections: ReviewSection[] = [
    {
      title: "Applicant & Identity Data",
      items: [
        { label: "Full Legal Name", value: formData.fullName },
        { label: "Date of Birth", value: formData.dob },
        { label: "Gender", value: formData.gender },
        { label: "Marital Status", value: formData.maritalStatus },
        { label: "Phone Number", value: formData.phone },
        { label: "Email Address", value: formData.email },
        { label: "NIN", value: formData.nin },
        { label: "Residential Address", value: formData.address },
        { label: "Ward in Odeda LGA", value: formData.ward },
        { label: "Occupation", value: formData.occupation },
      ],
    },
    {
      title: "Ancestral Lineage & Traditional Compounds",
      items: [
        { label: "Father's Full Name", value: formData.fatherName },
        { label: "Father's Compound", value: formData.fatherCompound },
        { label: "Father's Ancestral Village", value: formData.fatherVillage },
        { label: "Mother's Full Name", value: formData.motherName },
        { label: "Mother's Compound", value: formData.motherCompound },
        { label: "Mother's Ancestral Village", value: formData.motherVillage },
        { label: "Family Baale / Chief", value: formData.familyBaale },
        { label: "Application Purpose", value: formData.purpose },
      ],
    },
  ];

  return (
    <FormWizard
      service={service}
      steps={STEPS}
      currentStepIndex={currentStepIndex}
      onStepChange={(idx) => setCurrentStepIndex(idx)}
      onNext={handleNext}
      onPrev={handlePrev}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      isStepValid={validateStep(currentStepIndex)}
      currentFee={currentFee}
      submitDisabled={!declaration || !validateStep(0) || !validateStep(1) || !validateStep(2)}
    >
      {/* STEP 1: Applicant Info */}
      {currentStepIndex === 0 && (
        <div className="space-y-4">
          <div className="border-b pb-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary">
              Personal & Indigene Information
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Enter the exact name and details as they appear on your National Identity Slip.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full Name (Surname First) *</Label>
              <Input
                id="fullName"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Adebayo Olusegun Emmanuel"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dob">Date of Birth *</Label>
              <Input
                id="dob"
                type="date"
                required
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="gender">Gender *</Label>
              <Select value={formData.gender} onValueChange={(val) => setFormData({ ...formData, gender: val })}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="maritalStatus">Marital Status</Label>
              <Select value={formData.maritalStatus} onValueChange={(val) => setFormData({ ...formData, maritalStatus: val })}>
                <SelectTrigger id="maritalStatus">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Single">Single</SelectItem>
                  <SelectItem value="Married">Married</SelectItem>
                  <SelectItem value="Divorced">Divorced</SelectItem>
                  <SelectItem value="Widowed">Widowed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+234 800 000 0000"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="applicant@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="nin">National Identity Number (NIN) *</Label>
              <Input
                id="nin"
                required
                maxLength={11}
                value={formData.nin}
                onChange={(e) => setFormData({ ...formData, nin: e.target.value })}
                placeholder="11-digit NIN"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ward">Ward of Origin in Odeda LGA *</Label>
              <Select value={formData.ward} onValueChange={(val) => setFormData({ ...formData, ward: val })}>
                <SelectTrigger id="ward">
                  <SelectValue placeholder="Select Ward" />
                </SelectTrigger>
                <SelectContent>
                  {WARDS.map((w) => (
                    <SelectItem key={w} value={w}>
                      {w} Ward
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="address">Current Residential Address *</Label>
              <Input
                id="address"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Street address, Town/Area in Ogun State or elsewhere"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="occupation">Occupation / Profession</Label>
              <Input
                id="occupation"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                placeholder="e.g. Civil Servant, Student, Trader, Engineer"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Lineage Info */}
      {currentStepIndex === 1 && (
        <div className="space-y-5">
          <div className="border-b pb-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary">
              Ancestral Lineage & Compounds
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Odeda LGA verification officers cross-examine parental compound names with Traditional Council records.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-muted/30 p-4 rounded-xl border space-y-3">
              <h5 className="font-bold text-xs text-foreground uppercase tracking-wide">
                Paternal Ancestral Lineage (Father's Side)
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="fatherName">Father's Full Name *</Label>
                  <Input
                    id="fatherName"
                    required
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    placeholder="Father's full name"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="fatherCompound">Father's Compound / Agbo-Ile *</Label>
                  <Input
                    id="fatherCompound"
                    required
                    value={formData.fatherCompound}
                    onChange={(e) => setFormData({ ...formData, fatherCompound: e.target.value })}
                    placeholder="e.g. Agbo Compound, Odeda"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="fatherVillage">Ancestral Village / Quarter</Label>
                  <Input
                    id="fatherVillage"
                    value={formData.fatherVillage}
                    onChange={(e) => setFormData({ ...formData, fatherVillage: e.target.value })}
                    placeholder="e.g. Olodo, Obantoko, Ilugun"
                  />
                </div>
              </div>
            </div>

            <div className="bg-muted/30 p-4 rounded-xl border space-y-3">
              <h5 className="font-bold text-xs text-foreground uppercase tracking-wide">
                Maternal Ancestral Lineage (Mother's Side)
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="motherName">Mother's Maiden Name *</Label>
                  <Input
                    id="motherName"
                    required
                    value={formData.motherName}
                    onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                    placeholder="Mother's maiden name"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="motherCompound">Mother's Compound *</Label>
                  <Input
                    id="motherCompound"
                    required
                    value={formData.motherCompound}
                    onChange={(e) => setFormData({ ...formData, motherCompound: e.target.value })}
                    placeholder="e.g. Alagbagba Compound"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="motherVillage">Ancestral Village / Quarter</Label>
                  <Input
                    id="motherVillage"
                    value={formData.motherVillage}
                    onChange={(e) => setFormData({ ...formData, motherVillage: e.target.value })}
                    placeholder="e.g. Osiele, Itesi"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="familyBaale">Family Baale / Quarter Chief Title & Name</Label>
                <Input
                  id="familyBaale"
                  value={formData.familyBaale}
                  onChange={(e) => setFormData({ ...formData, familyBaale: e.target.value })}
                  placeholder="e.g. Baale Adeyemi of Camp"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="purpose">Purpose of Application *</Label>
                <Select value={formData.purpose} onValueChange={(val) => setFormData({ ...formData, purpose: val })}>
                  <SelectTrigger id="purpose">
                    <SelectValue placeholder="Select Purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Employment / NYSC / Admission">Employment / NYSC / Admission</SelectItem>
                    <SelectItem value="Military / Police Recruitment">Military / Police Recruitment</SelectItem>
                    <SelectItem value="Scholarship / Bursary">Scholarship / Bursary</SelectItem>
                    <SelectItem value="Visa / International Travel">Visa / International Travel</SelectItem>
                    <SelectItem value="Political / Public Office">Political / Public Office</SelectItem>
                    <SelectItem value="General Identification">General Identification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Documents Upload */}
      {currentStepIndex === 2 && (
        <DocumentUploadStep
          documents={DOCUMENTS}
          uploadedFiles={uploadedFiles}
          onFileUpload={handleFileUpload}
          onFileRemove={handleFileRemove}
          serviceName={service.name}
        />
      )}

      {/* STEP 4: Review & Submit */}
      {currentStepIndex === 3 && (
        <ReviewSubmitStep
          serviceName={service.name}
          revenueHead={service.revenueHead}
          feeAmount={currentFee}
          sections={reviewSections}
          documents={DOCUMENTS}
          uploadedFiles={uploadedFiles}
          declarationChecked={declaration}
          onDeclarationChange={setDeclaration}
          declarationText="I solemnly declare that I am a bonafide indigene of Odeda Local Government, Ogun State, and that all personal, parental, and compound lineage details provided in this statutory application are authentic and true. I understand that fraudulent claims carry legal consequences under the laws of Ogun State."
        />
      )}
    </FormWizard>
  );
}
