"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { WARDS } from "@/lib/mock-data";
import { OdedaService, getConfiguredFeeForService } from "@/config/odedaServices";
import { FormWizard, FormStep } from "./FormWizard";
import { DocumentUploadStep, DocumentSpec, UploadedFileMeta } from "./DocumentUploadStep";
import { ReviewSubmitStep, ReviewSection, ReviewRepeatableSection } from "./ReviewSubmitStep";
import { ApplicantSelectionStep, ApplicantSnapshot } from "../ApplicantSelectionStep";
import { Plus, Trash2, Shield, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

interface CdaOfficer {
  role: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  occupation: string;
  nin: string;
}

interface CommunityStreet {
  streetName: string;
  estimatedHouses: string;
  zoneLeader: string;
  leaderPhone: string;
}

const STEPS: FormStep[] = [
  {
    id: "applicant_info",
    title: "Lead CDA Representative & Contact",
    shortTitle: "Representative",
    description: "Provide contact details for the submitting CDA Chairman / Secretary.",
  },
  {
    id: "cda_profile",
    title: "CDA Identity & Community Profile",
    shortTitle: "CDA Profile",
    description: "Enter community development association name, boundaries, and traditional leadership.",
  },
  {
    id: "projects_development",
    title: "Community Projects & Development Priorities",
    shortTitle: "Projects & Focus",
    description: "Outline community infrastructure projects (security, roads, electrification, water).",
  },
  {
    id: "executives_streets",
    title: "Executive Officers & Street Zones",
    shortTitle: "Officers & Zones",
    description: "Record CDA Chairman, Secretary, Treasurer, Security Officer, and street/zone leaders.",
  },
  {
    id: "documents",
    title: "Supporting Documents",
    shortTitle: "Documents",
    description: "Upload CDA constitution, Baale consent letter, minutes, and sketch map.",
  },
  {
    id: "review",
    title: "Review & Submit",
    shortTitle: "Review",
    description: "Review CDA data, officers, zones, and execute statutory declaration.",
  },
];

const DOCUMENTS: DocumentSpec[] = [
  {
    id: "cda_constitution",
    label: "CDA Constitution & Bye-laws",
    description: "Adopted constitution specifying governance, election tenure, and community security codes.",
    required: true,
  },
  {
    id: "baale_letter",
    label: "Baale / Traditional Council Consent Letter",
    description: "Letter of endorsement signed by the Village Head or Baale of the community.",
    required: true,
  },
  {
    id: "inaugural_minutes",
    label: "Inaugural Community Assembly Minutes",
    description: "Signed attendance and minutes of the general meeting where the CDA was formed.",
    required: true,
  },
  {
    id: "boundary_sketch",
    label: "Community Boundary Sketch / Map",
    description: "Sketch plan indicating major streets, landmarks, and contiguous borders.",
    required: true,
  },
  {
    id: "chairman_passport",
    label: "CDA Chairman Passport Photo",
    description: "Clear passport photograph of the presiding CDA Chairman.",
    required: true,
    acceptedFormats: ".jpg,.jpeg,.png",
  },
];

export default function CdaRegistrationForm({
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
    cdaName: "",
    cdaAcronym: "",
    ward: WARDS[0] || "Odeda",
    hostVillage: "",
    baaleName: "",
    baalePhone: "",
    estimatedPopulation: 3500,
    estimatedHouseholds: 420,
    primarySecurityArrangement: "Ogun State So-Safe Corps / Local Hunters Vigilante",
    securityPostLocation: "",
    primaryWaterSource: "Community Solar Boreholes & Hand Pumps",
    electricityStatus: "Connected to IBEDC 33KV Grid (With Community Transformer)",
    priorityProject1: "Grading and drainage construction of main spine road",
    priorityProject2: "Installation of 500KVA relief transformer",
    priorityProject3: "Community health post refurbishment",
    bankName: "",
    accountNumber: "",
  });

  const [officers, setOfficers] = useState<CdaOfficer[]>([
    {
      role: "CDA Chairman",
      fullName: "",
      phone: "",
      email: "",
      address: "",
      occupation: "",
      nin: "",
    },
    {
      role: "General Secretary",
      fullName: "",
      phone: "",
      email: "",
      address: "",
      occupation: "",
      nin: "",
    },
    {
      role: "Treasurer",
      fullName: "",
      phone: "",
      email: "",
      address: "",
      occupation: "",
      nin: "",
    },
    {
      role: "Chief Security Officer (CSO)",
      fullName: "",
      phone: "",
      email: "",
      address: "",
      occupation: "",
      nin: "",
    },
  ]);

  const [streets, setStreets] = useState<CommunityStreet[]>([
    { streetName: "", estimatedHouses: "35", zoneLeader: "", leaderPhone: "" },
    { streetName: "", estimatedHouses: "28", zoneLeader: "", leaderPhone: "" },
  ]);

  const handleFileUpload = (docId: string, meta: UploadedFileMeta | string, actualFile?: File) => {
    if (typeof meta === "string") {
      setUploadedFiles((prev) => ({ ...prev, [docId]: { name: meta, file: actualFile } }));
    } else {
      setUploadedFiles((prev) => ({ ...prev, [docId]: meta }));
    }
  };

  const handleFileRemove = (docId: string) => {
    setUploadedFiles((prev) => {
      const next = { ...prev };
      delete next[docId];
      return next;
    });
  };

  const addOfficer = () => {
    setOfficers((prev) => [
      ...prev,
      {
        role: "Executive Member (PRO / Welfare)",
        fullName: "",
        phone: "",
        email: "",
        address: "",
        occupation: "",
        nin: "",
      },
    ]);
  };

  const removeOfficer = (index: number) => {
    if (officers.length <= 4) return;
    setOfficers((prev) => prev.filter((_, i) => i !== index));
  };

  const updateOfficer = (index: number, field: keyof CdaOfficer, value: string) => {
    setOfficers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addStreet = () => {
    setStreets((prev) => [
      ...prev,
      {
        streetName: "",
        estimatedHouses: "20",
        zoneLeader: "",
        leaderPhone: "",
      },
    ]);
  };

  const removeStreet = (index: number) => {
    if (streets.length <= 1) return;
    setStreets((prev) => prev.filter((_, i) => i !== index));
  };

  const updateStreet = (index: number, field: keyof CommunityStreet, value: string) => {
    setStreets((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const validateStep = (index: number): boolean => {
    if (index === 0) {
      return !!applicant.fullName.trim() && !!applicant.phone.trim() && !!applicant.address.trim();
    }
    if (index === 1) {
      return !!formData.cdaName.trim() && !!formData.hostVillage.trim() && !!formData.baaleName.trim();
    }
    if (index === 2) {
      return !!formData.priorityProject1.trim() && !!formData.primarySecurityArrangement.trim();
    }
    if (index === 3) {
      return !!officers[0]?.fullName.trim() && !!officers[1]?.fullName.trim();
    }
    if (index === 4) {
      const missing = DOCUMENTS.filter((d) => d.required && !uploadedFiles[d.id]);
      return missing.length === 0;
    }
    if (index === 5) {
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

    const filesPayload: Record<string, any> = {};
    Object.entries(uploadedFiles).forEach(([k, meta]) => {
      if (meta.file) {
        filesPayload[k] = meta.file;
      } else {
        filesPayload[k] = { name: meta.name };
      }
    });

    const cleanOfficers = officers.filter((o) => o.fullName.trim().length > 0);
    const cleanStreets = streets.filter((s) => s.streetName.trim().length > 0);

    onSubmit({
      applicant,
      formData: {
        ...formData,
        officers: cleanOfficers,
        streets: cleanStreets,
        officerCount: cleanOfficers.length,
        streetCount: cleanStreets.length,
      },
      files: filesPayload,
    });
  };

  const currentFee = getConfiguredFeeForService(service.id) || service.defaultFee;

  const reviewSections: ReviewSection[] = [
    {
      title: "CDA Community Identity",
      items: [
        { label: "Full CDA Name", value: formData.cdaName },
        { label: "Acronym", value: formData.cdaAcronym || "N/A" },
        { label: "Host Ward", value: `${formData.ward} Ward` },
        { label: "Host Village / Area", value: formData.hostVillage },
        { label: "Traditional Baale / Head", value: formData.baaleName },
        { label: "Baale Contact Phone", value: formData.baalePhone || "N/A" },
        { label: "Est. Households / Population", value: `${formData.estimatedHouseholds} Houses / ~${Number(formData.estimatedPopulation).toLocaleString()} Residents` },
      ],
    },
    {
      title: "Community Infrastructure & Security",
      items: [
        { label: "Security Apparatus", value: formData.primarySecurityArrangement },
        { label: "Security Post Location", value: formData.securityPostLocation || "Central Junction" },
        { label: "Water Infrastructure", value: formData.primaryWaterSource },
        { label: "Electricity Infrastructure", value: formData.electricityStatus },
        { label: "Priority Project #1", value: formData.priorityProject1 },
        { label: "Priority Project #2", value: formData.priorityProject2 || "N/A" },
        { label: "Priority Project #3", value: formData.priorityProject3 || "N/A" },
      ],
    },
  ];

  const reviewRepeatables: ReviewRepeatableSection[] = [
    {
      title: "CDA Executive Committee",
      countLabel: "Executive Officers",
      items: officers
        .filter((o) => o.fullName.trim())
        .map((o) => ({
          role: o.role,
          name: o.fullName,
          phone: o.phone,
          email: o.email || "N/A",
          occupation: o.occupation || "N/A",
          nin: o.nin || "N/A",
        })),
    },
    {
      title: "Street & Zone Register",
      countLabel: "Streets Listed",
      items: streets
        .filter((s) => s.streetName.trim())
        .map((s) => ({
          streetName: s.streetName,
          estHouses: s.estimatedHouses,
          zoneLeader: s.zoneLeader || "N/A",
          leaderPhone: s.leaderPhone || "N/A",
        })),
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
      submitLabel="Submit CDA Registration Application"
    >
      {/* STEP 0: Applicant Selection */}
      {currentStepIndex === 0 && (
        <ApplicantSelectionStep
          mode={mode}
          value={applicant}
          onChange={setApplicant}
          serviceName={service.name}
          serviceCategory={service.category}
        />
      )}

      {/* STEP 1: CDA Profile */}
      {currentStepIndex === 1 && (
        <div className="space-y-4 text-xs">
          <div className="border-b pb-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary">
              CDA Identity & Traditional Domain
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Enter official Community Development Association particulars in Odeda Local Government.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="cdaName">Full Name of CDA *</Label>
              <Input
                id="cdaName"
                required
                value={formData.cdaName}
                onChange={(e) => setFormData({ ...formData, cdaName: e.target.value })}
                placeholder="e.g. Ifelodun Community Development Association, Itesi"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cdaAcronym">CDA Short Name / Acronym</Label>
              <Input
                id="cdaAcronym"
                value={formData.cdaAcronym}
                onChange={(e) => setFormData({ ...formData, cdaAcronym: e.target.value })}
                placeholder="e.g. IFELODUN CDA"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ward">Ward Location *</Label>
              <Select
                value={formData.ward}
                onValueChange={(val) => setFormData({ ...formData, ward: val })}
              >
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

            <div className="space-y-1.5">
              <Label htmlFor="hostVillage">Host Village / Quarter / Community *</Label>
              <Input
                id="hostVillage"
                required
                value={formData.hostVillage}
                onChange={(e) => setFormData({ ...formData, hostVillage: e.target.value })}
                placeholder="e.g. Camp Village / Alabata Road"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="baaleName">Community Baale / Traditional Ruler *</Label>
              <Input
                id="baaleName"
                required
                value={formData.baaleName}
                onChange={(e) => setFormData({ ...formData, baaleName: e.target.value })}
                placeholder="Chief / Baale of Community"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="baalePhone">Baale Contact Phone</Label>
              <Input
                id="baalePhone"
                value={formData.baalePhone}
                onChange={(e) => setFormData({ ...formData, baalePhone: e.target.value })}
                placeholder="080XXXXXXXX"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="estimatedHouseholds">Estimated Number of Buildings / Households</Label>
              <Input
                id="estimatedHouseholds"
                type="number"
                value={formData.estimatedHouseholds}
                onChange={(e) => setFormData({ ...formData, estimatedHouseholds: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Projects & Focus */}
      {currentStepIndex === 2 && (
        <div className="space-y-4 text-xs">
          <div className="border-b pb-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary">
              Security, Infrastructure & Development Priorities
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Specify the community security architecture, utilities, and development roadmap.
            </p>
          </div>

          <div className="space-y-3.5">
            <div className="space-y-1.5">
              <Label htmlFor="primarySecurityArrangement">Community Security / Vigilante System *</Label>
              <Select
                value={formData.primarySecurityArrangement}
                onValueChange={(val) => setFormData({ ...formData, primarySecurityArrangement: val })}
              >
                <SelectTrigger id="primarySecurityArrangement">
                  <SelectValue placeholder="Select Security Architecture" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ogun State So-Safe Corps / Local Hunters Vigilante">
                    Ogun State So-Safe Corps / Local Hunters Vigilante
                  </SelectItem>
                  <SelectItem value="Nigeria Police Force (Odeda Div) & Community Patrol">
                    Nigeria Police Force (Odeda Div) & Community Patrol
                  </SelectItem>
                  <SelectItem value="Licensed Private Security Guards">
                    Licensed Private Security Guards
                  </SelectItem>
                  <SelectItem value="Amotekun Corps / Joint Vigilante">
                    Amotekun Corps / Joint Vigilante
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="primaryWaterSource">Community Water Infrastructure</Label>
                <Input
                  id="primaryWaterSource"
                  value={formData.primaryWaterSource}
                  onChange={(e) => setFormData({ ...formData, primaryWaterSource: e.target.value })}
                  placeholder="e.g. Solar powered public boreholes"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="electricityStatus">Electricity / Grid Connection Status</Label>
                <Input
                  id="electricityStatus"
                  value={formData.electricityStatus}
                  onChange={(e) => setFormData({ ...formData, electricityStatus: e.target.value })}
                  placeholder="e.g. IBEDC 33KV line with 300KVA Transformer"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="priorityProject1">Priority Community Project #1 *</Label>
              <Input
                id="priorityProject1"
                required
                value={formData.priorityProject1}
                onChange={(e) => setFormData({ ...formData, priorityProject1: e.target.value })}
                placeholder="e.g. Culvert construction across Main Stream"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="priorityProject2">Priority Community Project #2</Label>
              <Input
                id="priorityProject2"
                value={formData.priorityProject2}
                onChange={(e) => setFormData({ ...formData, priorityProject2: e.target.value })}
                placeholder="e.g. Street numbering and solar street lighting"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Officers & Street Zones */}
      {currentStepIndex === 3 && (
        <div className="space-y-6">
          {/* Officers */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                  <Shield className="w-4 h-4" /> CDA Executive Committee
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  CDA Chairman, Secretary, Treasurer, and CSO details are required by Odeda LGA Community Dev Dept.
                </p>
              </div>
              <Button
                type="button"
                onClick={addOfficer}
                size="sm"
                variant="outline"
                className="text-xs gap-1 h-8"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Executive
              </Button>
            </div>

            <div className="space-y-3">
              {officers.map((officer, index) => (
                <div
                  key={index}
                  className="border rounded-xl p-4 bg-muted/20 space-y-3 shadow-2xs text-xs"
                >
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs font-semibold">
                        Officer #{index + 1}
                      </Badge>
                      <span className="font-bold text-xs text-foreground">{officer.role}</span>
                    </div>
                    {officers.length > 4 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOfficer(index)}
                        className="h-7 text-xs text-red-600 hover:text-red-700 px-2"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label>Executive Designation *</Label>
                      <Input
                        value={officer.role}
                        onChange={(e) => updateOfficer(index, "role", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <Label>Full Name *</Label>
                      <Input
                        required
                        value={officer.fullName}
                        onChange={(e) => updateOfficer(index, "fullName", e.target.value)}
                        placeholder="Legal Full Name"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Phone Number *</Label>
                      <Input
                        required
                        value={officer.phone}
                        onChange={(e) => updateOfficer(index, "phone", e.target.value)}
                        placeholder="080XXXXXXXX"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Email Address</Label>
                      <Input
                        type="email"
                        value={officer.email}
                        onChange={(e) => updateOfficer(index, "email", e.target.value)}
                        placeholder="officer@domain.com"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>National ID (NIN)</Label>
                      <Input
                        value={officer.nin}
                        onChange={(e) => updateOfficer(index, "nin", e.target.value)}
                        placeholder="11-digit NIN"
                        maxLength={11}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Streets */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Street / Zone Registry
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Record all streets/zones within this CDA boundary.
                </p>
              </div>
              <Button
                type="button"
                onClick={addStreet}
                size="sm"
                variant="outline"
                className="text-xs gap-1 h-8"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Street Zone
              </Button>
            </div>

            <div className="space-y-2.5">
              {streets.map((street, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-3 bg-muted/10 grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center text-xs"
                >
                  <div className="sm:col-span-4">
                    <Input
                      value={street.streetName}
                      onChange={(e) => updateStreet(index, "streetName", e.target.value)}
                      placeholder="Street / Close Name"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Input
                      value={street.estimatedHouses}
                      onChange={(e) => updateStreet(index, "estimatedHouses", e.target.value)}
                      placeholder="Est. Houses"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <Input
                      value={street.zoneLeader}
                      onChange={(e) => updateStreet(index, "zoneLeader", e.target.value)}
                      placeholder="Zone Leader Name"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Input
                      value={street.leaderPhone}
                      onChange={(e) => updateStreet(index, "leaderPhone", e.target.value)}
                      placeholder="Leader Phone"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="sm:col-span-1 flex justify-end">
                    {streets.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStreet(index)}
                        className="h-7 w-7 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Documents */}
      {currentStepIndex === 4 && (
        <DocumentUploadStep
          documents={DOCUMENTS}
          uploadedFiles={uploadedFiles}
          onFileUpload={handleFileUpload}
          onFileRemove={handleFileRemove}
          serviceName={service.name}
        />
      )}

      {/* STEP 5: Review & Submit */}
      {currentStepIndex === 5 && (
        <ReviewSubmitStep
          serviceName={service.name}
          revenueHead={service.revenueHead}
          feeAmount={currentFee}
          applicant={applicant}
          sections={reviewSections}
          repeatableSections={reviewRepeatables}
          documents={DOCUMENTS}
          uploadedFiles={uploadedFiles}
          declarationChecked={declaration}
          onDeclarationChange={setDeclaration}
          declarationText="We, the principal executive officers of this Community Development Association, swear that the bounds, officers, streets, and resolution submitted represent the collective decision of our residents. We pledge cooperation with Odeda Local Government Authority for peace, security, and orderly development."
        />
      )}
    </FormWizard>
  );
}
