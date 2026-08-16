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
import { DocumentUploadStep, DocumentSpec } from "./DocumentUploadStep";
import { ReviewSubmitStep, ReviewSection, ReviewRepeatableSection } from "./ReviewSubmitStep";
import { Plus, Trash2, MapPin, Building, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Props {
  service: OdedaService;
  onSubmit: (formData: Record<string, any>) => void;
  isSubmitting?: boolean;
}

interface PropertyNumbering {
  plotHouseNumber: string;
  buildingType: string;
  ownerName: string;
  ownerPhone: string;
}

interface SignpostSpec {
  junctionLocation: string;
  postType: string;
  quantity: string;
}

interface ElderEndorsement {
  elderName: string;
  titleRole: string;
  phone: string;
}

const STEPS: FormStep[] = [
  {
    id: "applicant_sponsor",
    title: "Applicant & Sponsor Identity",
    shortTitle: "Applicant Identity",
    description: "Enter sponsoring CDA, family representative, or estate developer details.",
  },
  {
    id: "street_justification",
    title: "Street Nomenclature & Historical Justification",
    shortTitle: "Street Name & Justification",
    description: "Provide proposed street nomenclature, alternative names, route length, and public significance.",
  },
  {
    id: "properties_signposts_elders",
    title: "Properties Schedule, Signposts & Endorsements",
    shortTitle: "Properties & Plaque",
    description: "Itemize consecutive property numbers, reflective signposts, and community elder signatories.",
  },
  {
    id: "documents",
    title: "Supporting Documents",
    shortTitle: "Documents",
    description: "Upload cadastral survey layout, CDA resolution minutes, and Baale's endorsement letter.",
  },
  {
    id: "review",
    title: "Review & Submit",
    shortTitle: "Review",
    description: "Review street naming proposal and submit for Odeda LGA Statutory Gazette approval.",
  },
];

const DOCUMENTS: DocumentSpec[] = [
  {
    id: "survey_layout_plan",
    label: "Approved Cadastral Survey / Street Layout Plan",
    description: "Survey plan showing exact street coordinates, junctions, connecting roads, and plot layout.",
    required: true,
  },
  {
    id: "cda_resolution",
    label: "CDA General Meeting Resolution / Minutes",
    description: "Signed minutes of the community meeting approving the proposed street naming.",
    required: true,
  },
  {
    id: "traditional_ruler_letter",
    label: "Traditional Ruler / Baale Endorsement Letter",
    description: "Letter from the recognized Baale, Kabiyesi, or Village Head supporting the nomenclature.",
    required: true,
  },
  {
    id: "applicant_id",
    label: "Applicant / Sponsor Means of ID",
    description: "National ID Card (NIN), Voter's Card, or International Passport.",
    required: true,
  },
];

export default function StreetNamingForm({ service, onSubmit, isSubmitting }: Props) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});
  const [declaration, setDeclaration] = useState(false);

  // Form Basic Info
  const [formData, setFormData] = useState({
    applicantName: "",
    applicantType: "Community Development Association (CDA)",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    ward: WARDS[0] || "Odeda",
    proposedStreetName: "Chief Obafemi Awolowo Crescent",
    alternativeStreetName: "Unity Crescent",
    streetLength: "650 Metres",
    justification: "Named in honor of pioneering community elder and educational benefactor in the community.",
    cdaEndorsement: "Unanimous approval passed at CDA Congress with 94 resident signatures",
  });

  // Repeatable: Properties along the street
  const [properties, setProperties] = useState<PropertyNumbering[]>([
    { plotHouseNumber: "No. 1", buildingType: "Detached 4-Bedroom Bungalow", ownerName: "Pa Amos Ogundele", ownerPhone: "08033300112" },
    { plotHouseNumber: "No. 2", buildingType: "Block of 4 Flats", ownerName: "Alhaji R. Sanni", ownerPhone: "08055500223" },
    { plotHouseNumber: "No. 3", buildingType: "Commercial Shopping Plaza", ownerName: "Mrs. Folashade Adeyemi", ownerPhone: "08077700334" },
  ]);

  // Repeatable: Signposts
  const [signposts, setSignposts] = useState<SignpostSpec[]>([
    { junctionLocation: "Main Expressway Junction / Street Entrance", postType: "Galvanized Steel Pole with Reflective Aluminum Blade", quantity: "1" },
    { junctionLocation: "T-Junction Intersection with Peace Avenue", postType: "Dual-Faced Reflective Steel Signpost", quantity: "1" },
  ]);

  // Repeatable: Elders
  const [elders, setElders] = useState<ElderEndorsement[]>([
    { elderName: "Chief Samuel Adegbenro", titleRole: "Baale of Community", phone: "08022211100" },
    { elderName: "Elder David Ojo", titleRole: "CDA Chairman", phone: "08033322211" },
  ]);

  // Handlers for Properties
  const addProperty = () => {
    setProperties((prev) => [
      ...prev,
      {
        plotHouseNumber: `No. ${prev.length + 1}`,
        buildingType: "Residential Building",
        ownerName: "",
        ownerPhone: "",
      },
    ]);
  };

  const removeProperty = (idx: number) => {
    setProperties((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateProperty = (idx: number, field: keyof PropertyNumbering, val: string) => {
    setProperties((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });
  };

  // Handlers for Signposts
  const addSignpost = () => {
    setSignposts((prev) => [
      ...prev,
      {
        junctionLocation: "",
        postType: "Reflective Steel Pole",
        quantity: "1",
      },
    ]);
  };

  const removeSignpost = (idx: number) => {
    setSignposts((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateSignpost = (idx: number, field: keyof SignpostSpec, val: string) => {
    setSignposts((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });
  };

  // Handlers for Elders
  const addElder = () => {
    setElders((prev) => [
      ...prev,
      {
        elderName: "",
        titleRole: "Community Elder / Executive",
        phone: "",
      },
    ]);
  };

  const removeElder = (idx: number) => {
    setElders((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateElder = (idx: number, field: keyof ElderEndorsement, val: string) => {
    setElders((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });
  };

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
        !!formData.applicantName.trim() &&
        !!formData.contactPerson.trim() &&
        !!formData.phone.trim() &&
        !!formData.address.trim() &&
        !!formData.ward
      );
    }
    if (index === 1) {
      return !!formData.proposedStreetName.trim() && !!formData.justification.trim();
    }
    if (index === 2) {
      return properties.length > 0 && !!properties[0].plotHouseNumber.trim() && elders.length > 0;
    }
    if (index === 3) {
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

  const currentFee = getConfiguredFeeForService(service.id) || service.defaultFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!declaration) return;

    onSubmit({
      ...formData,
      properties: properties.filter((p) => p.plotHouseNumber.trim()),
      signposts: signposts.filter((s) => s.junctionLocation.trim()),
      elders: elders.filter((el) => el.elderName.trim()),
      uploadedFiles,
      amount: currentFee,
      revenueHead: service.revenueHead,
      serviceName: service.name,
      applicant: formData.applicantName,
    });
  };

  const reviewSections: ReviewSection[] = [
    {
      title: "Applicant & Sponsoring Entity",
      items: [
        { label: "Sponsoring Body Name", value: formData.applicantName },
        { label: "Applicant Category", value: formData.applicantType },
        { label: "Lead Representative", value: formData.contactPerson },
        { label: "Contact Phone Number", value: formData.phone },
        { label: "Email Address", value: formData.email },
        { label: "Physical Address", value: formData.address },
        { label: "Ward in Odeda LGA", value: formData.ward },
      ],
    },
    {
      title: "Street Nomenclature & Public Justification",
      items: [
        { label: "Proposed Primary Street Name", value: formData.proposedStreetName },
        { label: "Alternative Backup Name", value: formData.alternativeStreetName },
        { label: "Estimated Street Route Length", value: formData.streetLength },
        { label: "Historical / Civic Justification", value: formData.justification },
        { label: "Community Consensus", value: formData.cdaEndorsement },
      ],
    },
  ];

  const reviewRepeatableSections: ReviewRepeatableSection[] = [
    {
      title: "Properties & House Numbering Schedule",
      countLabel: "Properties Numbered",
      items: properties
        .filter((p) => p.plotHouseNumber.trim())
        .map((p) => ({
          "Assigned House Number": p.plotHouseNumber,
          "Building Type": p.buildingType,
          "Property Owner": p.ownerName,
          "Owner Contact Phone": p.ownerPhone,
        })),
    },
    {
      title: "Reflective Signpost / Plaque Installation",
      countLabel: "Signposts",
      items: signposts
        .filter((s) => s.junctionLocation.trim())
        .map((s) => ({
          "Junction / Location": s.junctionLocation,
          "Plaque Hardware Specification": s.postType,
          Quantity: `${s.quantity} Units`,
        })),
    },
    {
      title: "Community Elders & Baale Endorsements",
      countLabel: "Signatories",
      items: elders
        .filter((el) => el.elderName.trim())
        .map((el) => ({
          "Elder / Signatory Name": el.elderName,
          "Title / Traditional Office": el.titleRole,
          "Phone Number": el.phone,
        })),
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
      submitDisabled={!declaration || !validateStep(0) || !validateStep(1) || !validateStep(2) || !validateStep(3)}
    >
      {/* STEP 1: Applicant & Sponsor */}
      {currentStepIndex === 0 && (
        <div className="space-y-4">
          <div className="border-b pb-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary">
              Applicant & Sponsor Identity
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Enter sponsoring CDA, family council, or estate developer details for statutory street naming in Odeda LGA.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="applicantName">Sponsoring Body / Applicant Name *</Label>
              <Input
                id="applicantName"
                required
                value={formData.applicantName}
                onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                placeholder="e.g. Obantoko Peace Community Development Association (CDA)"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="applicantType">Applicant Category *</Label>
              <Select value={formData.applicantType} onValueChange={(val) => setFormData({ ...formData, applicantType: val })}>
                <SelectTrigger id="applicantType">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Community Development Association (CDA)">Community Development Association (CDA)</SelectItem>
                  <SelectItem value="Private Residential Estate Developer">Private Residential Estate Developer</SelectItem>
                  <SelectItem value="Family / Descendants Heritage Council">Family / Descendants Heritage Council</SelectItem>
                  <SelectItem value="Corporate / Institutional Sponsor">Corporate / Institutional Sponsor</SelectItem>
                  <SelectItem value="Individual Philanthropist / Sponsor">Individual Philanthropist / Sponsor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contactPerson">Lead Representative / Chairman *</Label>
              <Input
                id="contactPerson"
                required
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="e.g. Elder David Ojo"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Contact Phone Number *</Label>
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
                placeholder="cda@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ward">Ward in Odeda LGA *</Label>
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
              <Label htmlFor="address">Applicant / Secretariat Address *</Label>
              <Input
                id="address"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Secretariat or residential address in Odeda LGA"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Street Name & Justification */}
      {currentStepIndex === 1 && (
        <div className="space-y-4">
          <div className="border-b pb-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary">
              Street Nomenclature & Historical Justification
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Specify proposed street name, alternative choice, estimated road length, and historical justification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="proposedStreetName">Proposed Primary Street Name *</Label>
              <Input
                id="proposedStreetName"
                required
                value={formData.proposedStreetName}
                onChange={(e) => setFormData({ ...formData, proposedStreetName: e.target.value })}
                placeholder="e.g. Chief Obafemi Awolowo Crescent"
                className="font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="alternativeStreetName">Alternative Backup Street Name</Label>
              <Input
                id="alternativeStreetName"
                value={formData.alternativeStreetName}
                onChange={(e) => setFormData({ ...formData, alternativeStreetName: e.target.value })}
                placeholder="e.g. Unity Crescent"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="streetLength">Estimated Street Length (Metres / Km)</Label>
              <Input
                id="streetLength"
                value={formData.streetLength}
                onChange={(e) => setFormData({ ...formData, streetLength: e.target.value })}
                placeholder="e.g. 750 Metres"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cdaEndorsement">Community Consensus Status</Label>
              <Input
                id="cdaEndorsement"
                value={formData.cdaEndorsement}
                onChange={(e) => setFormData({ ...formData, cdaEndorsement: e.target.value })}
                placeholder="e.g. Unanimously ratified at general congress"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="justification">Historical / Civic Justification *</Label>
              <Textarea
                id="justification"
                required
                rows={3}
                value={formData.justification}
                onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
                placeholder="Provide biographical or civic background justifying the honour of naming this public thoroughfare..."
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Properties, Signposts & Elders (REPEATABLE UI) */}
      {currentStepIndex === 2 && (
        <div className="space-y-6">
          <div className="border-b pb-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary">
              Properties Schedule, Signposts & Endorsements
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Itemize all properties and buildings along the street for numbering, plus signpost specifications.
            </p>
          </div>

          {/* REPEATABLE SECTION: Properties */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-primary" /> Properties & House Numbering Schedule *
                </h5>
                <p className="text-[11px] text-muted-foreground">
                  Record all consecutive plots and houses along the street corridor.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addProperty}
                className="gap-1 text-xs h-8"
              >
                <Plus className="w-3.5 h-3.5" /> Add Property
              </Button>
            </div>

            {properties.map((prop, idx) => (
              <div key={idx} className="bg-muted/10 border rounded-xl p-4 space-y-3 relative group">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-bold text-xs text-foreground">Property #{idx + 1}: {prop.plotHouseNumber} ({prop.buildingType})</span>
                  {properties.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeProperty(idx)}
                      className="text-red-500 hover:text-red-700 h-7 px-2 text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Assigned House No *</Label>
                    <Input
                      value={prop.plotHouseNumber}
                      onChange={(e) => updateProperty(idx, "plotHouseNumber", e.target.value)}
                      placeholder="e.g. No. 1 / Plot 14"
                      className="font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Building Typology</Label>
                    <Input
                      value={prop.buildingType}
                      onChange={(e) => updateProperty(idx, "buildingType", e.target.value)}
                      placeholder="e.g. Bungalow / 4-Flat Block"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Landlord / Owner Name</Label>
                    <Input
                      value={prop.ownerName}
                      onChange={(e) => updateProperty(idx, "ownerName", e.target.value)}
                      placeholder="Landlord Name"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Owner Phone</Label>
                    <Input
                      value={prop.ownerPhone}
                      onChange={(e) => updateProperty(idx, "ownerPhone", e.target.value)}
                      placeholder="080..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* REPEATABLE SECTION: Signposts */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-primary" /> Reflective Signposts & Plaque Specifications
                </h5>
                <p className="text-[11px] text-muted-foreground">
                  Record junction locations and hardware specifications for street nameplates.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSignpost}
                className="gap-1 text-xs h-8"
              >
                <Plus className="w-3.5 h-3.5" /> Add Signpost
              </Button>
            </div>

            <div className="space-y-2.5">
              {signposts.map((sp, idx) => (
                <div key={idx} className="bg-card border rounded-lg p-3 grid grid-cols-1 sm:grid-cols-5 gap-2.5 items-end">
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-[11px]">Junction / Intersection Location</Label>
                    <Input
                      value={sp.junctionLocation}
                      onChange={(e) => updateSignpost(idx, "junctionLocation", e.target.value)}
                      placeholder="e.g. Main Road Entry Junction"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-[11px]">Plaque Specification</Label>
                    <Input
                      value={sp.postType}
                      onChange={(e) => updateSignpost(idx, "postType", e.target.value)}
                      placeholder="e.g. Reflective Aluminum Blade on Steel Pole"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSignpost(idx)}
                      className="text-red-500 hover:text-red-700 h-8 px-2 text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* REPEATABLE SECTION: Elders */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-primary" /> Community Elders & Baale Endorsements
                </h5>
                <p className="text-[11px] text-muted-foreground">
                  Record endorsing traditional rulers and community council signatories.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addElder}
                className="gap-1 text-xs h-8"
              >
                <Plus className="w-3.5 h-3.5" /> Add Endorser
              </Button>
            </div>

            <div className="space-y-2.5">
              {elders.map((el, idx) => (
                <div key={idx} className="bg-card border rounded-lg p-3 grid grid-cols-1 sm:grid-cols-5 gap-2.5 items-end">
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-[11px]">Elder / Ruler Full Name</Label>
                    <Input
                      value={el.elderName}
                      onChange={(e) => updateElder(idx, "elderName", e.target.value)}
                      placeholder="Chief / Elder Name"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">Title / Role</Label>
                    <Input
                      value={el.titleRole}
                      onChange={(e) => updateElder(idx, "titleRole", e.target.value)}
                      placeholder="Baale / Chairman"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">Phone Number</Label>
                    <Input
                      value={el.phone}
                      onChange={(e) => updateElder(idx, "phone", e.target.value)}
                      placeholder="080..."
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeElder(idx)}
                      className="text-red-500 hover:text-red-700 h-8 px-2 text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Documents Upload */}
      {currentStepIndex === 3 && (
        <DocumentUploadStep
          documents={DOCUMENTS}
          uploadedFiles={uploadedFiles}
          onFileUpload={handleFileUpload}
          onFileRemove={handleFileRemove}
          serviceName={service.name}
        />
      )}

      {/* STEP 5: Review & Submit */}
      {currentStepIndex === 4 && (
        <ReviewSubmitStep
          serviceName={service.name}
          revenueHead={service.revenueHead}
          feeAmount={currentFee}
          sections={reviewSections}
          repeatableSections={reviewRepeatableSections}
          documents={DOCUMENTS}
          uploadedFiles={uploadedFiles}
          declarationChecked={declaration}
          onDeclarationChange={setDeclaration}
          declarationText="I solemnly declare that the street layout plan, property numbering schedule, community endorsements, and historical justification submitted herein represent the authentic consensus of the community and comply with Odeda Local Government Street Naming Bye-laws."
        />
      )}
    </FormWizard>
  );
}
