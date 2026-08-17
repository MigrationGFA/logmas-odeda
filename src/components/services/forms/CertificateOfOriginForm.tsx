"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WARDS } from "@/lib/mock-data";
import { OdedaService, getConfiguredFeeForService } from "@/config/odedaServices";
import { FormWizard, FormStep } from "./FormWizard";
import { DocumentUploadStep, DocumentSpec, UploadedFileMeta } from "./DocumentUploadStep";
import { ReviewSubmitStep, ReviewSection } from "./ReviewSubmitStep";
import { ApplicantSelectionStep, ApplicantSnapshot } from "../ApplicantSelectionStep";

interface Props {
  service: OdedaService;
  onSubmit: (payload: {
    applicant: ApplicantSnapshot;
    formData: Record<string, any>;
    files: Record<string, any>;
  }) => void;
  isSubmitting?: boolean;
  mode?: "citizen" | "business_owner" | "field_officer" | "admin";
  initialApplicant?: ApplicantSnapshot;
}

const STEPS: FormStep[] = [
  {
    id: "applicant_info",
    title: "Applicant & Identity Information",
    shortTitle: "Applicant Info",
    description: "Provide personal contact details and Odeda LGA ward residency details.",
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
    description: "Verify all details, sign statutory declaration, and proceed to submission.",
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

export default function CertificateOfOriginForm({
  service,
  onSubmit,
  isSubmitting = false,
  mode = "citizen",
  initialApplicant,
}: Props) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFileMeta>>({});
  const [declaration, setDeclaration] = useState(false);

  const [applicant, setApplicant] = useState<ApplicantSnapshot>(
    initialApplicant || {
      fullName: "",
      phone: "",
      email: "",
      address: "",
      ward: "Ward 7 (Itesi / Camp)",
      nin: "",
      cacNumber: "",
      applicantId: null,
      isRegistered: false,
    }
  );

  const [formData, setFormData] = useState({
    dob: "",
    gender: "Male",
    maritalStatus: "Single",
    occupation: "",
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

  const handleFileUpload = (docId: string, meta: UploadedFileMeta | string, actualFile?: File) => {
    if (typeof meta === "string") {
      setUploadedFiles((prev) => ({
        ...prev,
        [docId]: { name: meta, file: actualFile },
      }));
    } else {
      setUploadedFiles((prev) => ({
        ...prev,
        [docId]: meta,
      }));
    }
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
        !!applicant.fullName.trim() &&
        !!applicant.phone.trim() &&
        !!applicant.address.trim() &&
        !!applicant.ward &&
        !!formData.dob
      );
    }
    if (index === 1) {
      return (
        !!formData.fatherName.trim() &&
        !!formData.fatherCompound.trim() &&
        !!formData.motherName.trim() &&
        !!formData.motherCompound.trim() &&
        !!formData.purpose
      );
    }
    if (index === 2) {
      const missing = DOCUMENTS.filter((d) => d.required && !uploadedFiles[d.id]);
      return missing.length === 0;
    }
    if (index === 3) {
      return declaration;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStepIndex)) {
      setCurrentStepIndex((prev) => Math.min(STEPS.length - 1, prev + 1));
    }
  };

  const handlePrev = () => {
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!declaration) return;

    // Collect actual files mapped by machine-readable requirement keys
    const filesPayload: Record<string, any> = {};
    Object.entries(uploadedFiles).forEach(([k, meta]) => {
      if (meta.file) {
        filesPayload[k] = meta.file;
      } else {
        filesPayload[k] = { name: meta.name };
      }
    });

    onSubmit({
      applicant,
      formData: {
        ...formData,
        fullName: applicant.fullName,
        phone: applicant.phone,
        email: applicant.email,
        address: applicant.address,
        ward: applicant.ward,
        nin: applicant.nin,
      },
      files: filesPayload,
    });
  };

  const currentFee = getConfiguredFeeForService(service.id) || service.defaultFee;

  const reviewSections: ReviewSection[] = [
    {
      title: "Personal Demographics & Identity",
      items: [
        { label: "Full Legal Name", value: applicant.fullName },
        { label: "Date of Birth", value: formData.dob },
        { label: "Gender", value: formData.gender },
        { label: "Marital Status", value: formData.maritalStatus },
        { label: "Occupation / Profession", value: formData.occupation || "N/A" },
        { label: "National ID (NIN)", value: applicant.nin || "Not Provided" },
      ],
    },
    {
      title: "Contact & Ward Residency",
      items: [
        { label: "Phone Number", value: applicant.phone },
        { label: "Email Address", value: applicant.email || "N/A" },
        { label: "Ward of Origin in Odeda", value: `${applicant.ward} Ward` },
        { label: "Residential Address", value: applicant.address },
      ],
    },
    {
      title: "Ancestral & Traditional Lineage",
      items: [
        { label: "Father's Name", value: formData.fatherName },
        { label: "Father's Compound (Agbo-Ile)", value: formData.fatherCompound },
        { label: "Father's Ancestral Village", value: formData.fatherVillage || "Odeda LGA" },
        { label: "Mother's Maiden Name", value: formData.motherName },
        { label: "Mother's Compound", value: formData.motherCompound },
        { label: "Mother's Ancestral Village", value: formData.motherVillage || "Odeda LGA" },
        { label: "Quarter Chief / Baale Title", value: formData.familyBaale || "N/A" },
        { label: "Purpose of Certificate", value: formData.purpose },
      ],
    },
  ];

  return (
    <FormWizard
      service={service}
      steps={STEPS}
      currentStepIndex={currentStepIndex}
      onStepChange={setCurrentStepIndex}
      onNext={handleNext}
      onPrev={handlePrev}
      onSubmit={handleFormSubmit}
      isSubmitting={isSubmitting}
      isStepValid={validateStep(currentStepIndex)}
      currentFee={currentFee}
      submitDisabled={!declaration}
      submitLabel="Submit Certificate Application"
    >
      {/* STEP 1: Applicant & Identity Info */}
      {currentStepIndex === 0 && (
        <div className="space-y-6">
          <ApplicantSelectionStep
            mode={mode}
            value={applicant}
            onChange={setApplicant}
            serviceName={service.name}
            serviceCategory={service.category}
          />

          <div className="border-t pt-4 space-y-4">
            <h5 className="font-bold text-xs uppercase tracking-wider text-primary">
              Personal Demographics
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
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
                <Select
                  value={formData.gender}
                  onValueChange={(val) => setFormData({ ...formData, gender: val })}
                >
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
                <Select
                  value={formData.maritalStatus}
                  onValueChange={(val) => setFormData({ ...formData, maritalStatus: val })}
                >
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

              <div className="space-y-1.5 md:col-span-3">
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
                Paternal Ancestral Lineage (Father&apos;s Side)
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="fatherName">Father&apos;s Full Name *</Label>
                  <Input
                    id="fatherName"
                    required
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    placeholder="Father's full name"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="fatherCompound">Father&apos;s Compound / Agbo-Ile *</Label>
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
                Maternal Ancestral Lineage (Mother&apos;s Side)
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="motherName">Mother&apos;s Maiden Name *</Label>
                  <Input
                    id="motherName"
                    required
                    value={formData.motherName}
                    onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                    placeholder="Mother's maiden name"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="motherCompound">Mother&apos;s Compound *</Label>
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
                <Select
                  value={formData.purpose}
                  onValueChange={(val) => setFormData({ ...formData, purpose: val })}
                >
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
          applicant={applicant}
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
