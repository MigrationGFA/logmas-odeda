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
import { Plus, Trash2, User, Users, Shield } from "lucide-react";
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

interface OfficerRecord {
  role: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  occupation: string;
  nin: string;
}

interface MemberRecord {
  fullName: string;
  phone: string;
  address: string;
  membershipNo?: string;
  joinedYear?: string;
}

const STEPS: FormStep[] = [
  // {
  //   id: "applicant_info",
  //   title: "Lead Applicant & Contact Details",
  //   shortTitle: "Applicant",
  //   description: "Provide contact details for the submitting officer / club representative.",
  // },
  {
    id: "club_profile",
    title: "Club / Association Profile",
    shortTitle: "Club Profile",
    description: "Enter basic club identity, registration category, and secretariat contact details.",
  },
  {
    id: "aims_operations",
    title: "Aims, Objectives & Operations",
    shortTitle: "Aims & Operations",
    description: "Outline the association's core objectives, meeting schedules, and funding sources.",
  },
  {
    id: "executives_members",
    title: "Executive Officers & Members Roster",
    shortTitle: "Officers & Members",
    description: "Provide complete officer details (President, Secretary, Treasurer, Welfare, and other executives) and members list.",
  },
  {
    id: "documents",
    title: "Supporting Documents",
    shortTitle: "Documents",
    description: "Upload club constitution, inaugural minutes, and executive photographs.",
  },
  {
    id: "review",
    title: "Review & Submit",
    shortTitle: "Review",
    description: "Review all club data, officers, roster, and execute statutory declaration.",
  },
];

const DOCUMENTS: DocumentSpec[] = [
  {
    id: "club_constitution",
    label: "Club Constitution & By-Laws",
    description: "Copy of the adopted constitution outlining governance, elections, and disciplinary procedures.",
    required: true,
  },
  {
    id: "inaugural_minutes",
    label: "Minutes of Inaugural Meeting",
    description: "Official signed minutes of the meeting where the club was founded/inaugurated.",
    required: true,
  },
  {
    id: "executives_list_signed",
    label: "Signed Executive Council Roster",
    description: "List of executive members with passport photos, contacts, and authentic signatures.",
    required: true,
  },
  {
    id: "president_passport",
    label: "President / Chairman Passport Photo",
    description: "Clear passport photograph of the presiding officer.",
    required: true,
    acceptedFormats: ".jpg,.jpeg,.png",
  },
  {
    id: "secretariat_proof",
    label: "Secretariat Utility / Tenancy Proof",
    description: "Proof of address for club physical meeting venue or registered secretariat in Odeda LGA.",
    required: false,
  },
];

export default function ClubRegistrationForm({
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
    clubName: "",
    clubAcronym: "",
    category: "Social & Cultural Club",
    dateFounded: "",
    secretariatAddress: "",
    ward: WARDS[0] || "Odeda",
    phone: "",
    email: "",
    patronName: "",
    patronPhone: "",
    patronAddress: "",
    primaryAims: "",
    communityProjects: "",
    meetingFrequency: "Monthly",
    meetingVenue: "",
    membershipCriteria: "Open to indigenes and residents above 18 years with good moral standing.",
    annualDuesAmount: 12000,
    bankName: "",
    accountNumber: "",
    accountSignatories: "President and Treasurer mandatory",
  });

  const [officers, setOfficers] = useState<OfficerRecord[]>([
    {
      role: "President / Chairman",
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
      role: "Treasurer / Financial Secretary",
      fullName: "",
      phone: "",
      email: "",
      address: "",
      occupation: "",
      nin: "",
    },
  ]);

  const [members, setMembers] = useState<MemberRecord[]>([
    { fullName: "", phone: "", address: "", membershipNo: "001", joinedYear: "2024" },
    { fullName: "", phone: "", address: "", membershipNo: "002", joinedYear: "2024" },
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
        role: "Executive Committee Member",
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
    if (officers.length <= 3) return;
    setOfficers((prev) => prev.filter((_, i) => i !== index));
  };

  const updateOfficer = (index: number, field: keyof OfficerRecord, value: string) => {
    setOfficers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addMember = () => {
    setMembers((prev) => [
      ...prev,
      {
        fullName: "",
        phone: "",
        address: "",
        membershipNo: String(prev.length + 1).padStart(3, "0"),
        joinedYear: new Date().getFullYear().toString(),
      },
    ]);
  };

  const removeMember = (index: number) => {
    if (members.length <= 1) return;
    setMembers((prev) => prev.filter((_, i) => i !== index));
  };

  const updateMember = (index: number, field: keyof MemberRecord, value: string) => {
    setMembers((prev) => {
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
      return (
        !!formData.clubName.trim() &&
        !!formData.dateFounded &&
        !!formData.secretariatAddress.trim() &&
        !!formData.phone.trim()
      );
    }
    if (index === 2) {
      return !!formData.primaryAims.trim() && !!formData.meetingVenue.trim();
    }
    if (index === 3) {
      const presidentValid = !!officers[0]?.fullName.trim() && !!officers[0]?.phone.trim();
      const secValid = !!officers[1]?.fullName.trim() && !!officers[1]?.phone.trim();
      return presidentValid && secValid;
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
    const cleanMembers = members.filter((m) => m.fullName.trim().length > 0);

    onSubmit({
      applicant,
      formData: {
        ...formData,
        officers: cleanOfficers,
        members: cleanMembers,
        officerCount: cleanOfficers.length,
        memberCount: cleanMembers.length,
      },
      files: filesPayload,
    });
  };

  const currentFee = service.feeConfig.amount

  const reviewSections: ReviewSection[] = [
    {
      title: "Club Identity & Secretariat",
      items: [
        { label: "Full Association Name", value: formData.clubName },
        { label: "Acronym / Short Name", value: formData.clubAcronym || "N/A" },
        { label: "Registration Category", value: formData.category },
        { label: "Date Established", value: formData.dateFounded },
        { label: "Secretariat Address", value: formData.secretariatAddress },
        { label: "Host Ward", value: `${formData.ward} Ward` },
        { label: "Official Club Phone", value: formData.phone },
        { label: "Official Email", value: formData.email || "N/A" },
      ],
    },
    {
      title: "Governance & Operations",
      items: [
        { label: "Primary Aims & Objectives", value: formData.primaryAims },
        { label: "Community Dev Projects", value: formData.communityProjects || "N/A" },
        { label: "Meeting Schedule", value: `${formData.meetingFrequency} at ${formData.meetingVenue}` },
        { label: "Grand Patron / Matron", value: formData.patronName || "N/A" },
        { label: "Annual Dues per Member", value: `₦${Number(formData.annualDuesAmount || 0).toLocaleString()}` },
        { label: "Bank & Account Info", value: formData.bankName ? `${formData.bankName} (${formData.accountNumber})` : "Under Setup" },
      ],
    },
  ];

  const reviewRepeatables: ReviewRepeatableSection[] = [
    {
      title: "Executive Officers Roster",
      countLabel: "Officers Registered",
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
      title: "General Membership Roster",
      countLabel: "Members Recorded",
      items: members
        .filter((m) => m.fullName.trim())
        .map((m) => ({
          membershipNo: m.membershipNo || "N/A",
          fullName: m.fullName,
          phone: m.phone || "N/A",
          address: m.address || "Odeda LGA",
          joinedYear: m.joinedYear || "2024",
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
      submitLabel="Submit Club Registration Application"
    >
      {/* STEP 0: Applicant Selection */}
      {/* {currentStepIndex === 0 && (
        <ApplicantSelectionStep
          mode={mode}
          value={applicant}
          onChange={setApplicant}
          serviceName={service.name}
          serviceCategory={service.category}
        />
      )} */}

      {/* STEP 1: Club Profile */}
      {currentStepIndex === 0 && (
        <div className="space-y-4">
          <div className="border-b pb-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary">
              Club / Association Profile
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Enter the registered name and secretariat contact details for the association.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="clubName">Full Name of Club / Association *</Label>
              <Input
                id="clubName"
                required
                value={formData.clubName}
                onChange={(e) => setFormData({ ...formData, clubName: e.target.value })}
                placeholder="e.g. Odeda Dynamic Elite Club of Nigeria"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="clubAcronym">Acronym / Abbreviation</Label>
              <Input
                id="clubAcronym"
                value={formData.clubAcronym}
                onChange={(e) => setFormData({ ...formData, clubAcronym: e.target.value })}
                placeholder="e.g. ODEC"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="category">Club Classification *</Label>
              <Select
                value={formData.category}
                onValueChange={(val) => setFormData({ ...formData, category: val })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Social & Cultural Club">Social & Cultural Club</SelectItem>
                  <SelectItem value="Youth & Sports Association">Youth & Sports Association</SelectItem>
                  <SelectItem value="Women Empowerment Association">Women Empowerment Association</SelectItem>
                  <SelectItem value="Professional & Trade Association">Professional & Trade Association</SelectItem>
                  <SelectItem value="Charitable & Philanthropic Society">Charitable & Philanthropic Society</SelectItem>
                  <SelectItem value="Academic & Alumni Association">Academic & Alumni Association</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dateFounded">Date Founded / Inaugurated *</Label>
              <Input
                id="dateFounded"
                type="date"
                required
                value={formData.dateFounded}
                onChange={(e) => setFormData({ ...formData, dateFounded: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ward">Ward of Secretariat *</Label>
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

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="secretariatAddress">Physical Secretariat Address in Odeda LGA *</Label>
              <Input
                id="secretariatAddress"
                required
                value={formData.secretariatAddress}
                onChange={(e) => setFormData({ ...formData, secretariatAddress: e.target.value })}
                placeholder="Suite / House No, Street name, Quarter, Odeda LGA"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Official Secretariat Phone *</Label>
              <Input
                id="phone"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="080XXXXXXXX"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Official Club Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@odedaclub.org"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Aims & Operations */}
      {currentStepIndex === 1 && (
        <div className="space-y-4">
          <div className="border-b pb-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary">
              Aims, Objectives & Financial Operations
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Specify the statutory mission, meeting operations, and bank governance details.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <Label htmlFor="primaryAims">Primary Aims & Objectives *</Label>
              <Textarea
                id="primaryAims"
                rows={3}
                required
                value={formData.primaryAims}
                onChange={(e) => setFormData({ ...formData, primaryAims: e.target.value })}
                placeholder="State the core purposes of the association in Odeda LGA..."
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="communityProjects">Community Development Initiatives (Past / Planned)</Label>
              <Textarea
                id="communityProjects"
                rows={2}
                value={formData.communityProjects}
                onChange={(e) => setFormData({ ...formData, communityProjects: e.target.value })}
                placeholder="e.g. Annual scholarship for Odeda youth, grading of community link roads, health outreach..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="meetingFrequency">Meeting Frequency *</Label>
                <Select
                  value={formData.meetingFrequency}
                  onValueChange={(val) => setFormData({ ...formData, meetingFrequency: val })}
                >
                  <SelectTrigger id="meetingFrequency">
                    <SelectValue placeholder="Select Frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Fortnightly (Bi-weekly)">Fortnightly (Bi-weekly)</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="meetingVenue">Designated Meeting Venue *</Label>
                <Input
                  id="meetingVenue"
                  required
                  value={formData.meetingVenue}
                  onChange={(e) => setFormData({ ...formData, meetingVenue: e.target.value })}
                  placeholder="e.g. Odeda Town Hall or Club Secretariat"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="patronName">Grand Patron / Matron Name</Label>
                <Input
                  id="patronName"
                  value={formData.patronName}
                  onChange={(e) => setFormData({ ...formData, patronName: e.target.value })}
                  placeholder="Chief / High Chief Patron"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="patronPhone">Patron Phone Contact</Label>
                <Input
                  id="patronPhone"
                  value={formData.patronPhone}
                  onChange={(e) => setFormData({ ...formData, patronPhone: e.target.value })}
                  placeholder="080XXXXXXXX"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bankName">Official Bankers in Nigeria</Label>
                <Input
                  id="bankName"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  placeholder="e.g. First Bank of Nigeria / Wema Bank"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="annualDuesAmount">Annual Statutory Dues per Member (₦)</Label>
                <Input
                  id="annualDuesAmount"
                  type="number"
                  value={formData.annualDuesAmount}
                  onChange={(e) => setFormData({ ...formData, annualDuesAmount: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Executive Officers & Members */}
      {currentStepIndex === 2 && (
        <div className="space-y-6">
          {/* Officers Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Executive Officers Council
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Record full details for the President, Secretary, Treasurer, and additional executive officers.
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
                Add Officer
              </Button>
            </div>

            <div className="space-y-3">
              {officers.map((officer, index) => (
                <div
                  key={index}
                  className="border rounded-xl p-4 bg-muted/20 space-y-3 relative transition-all shadow-2xs"
                >
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs font-semibold">
                        Officer #{index + 1}
                      </Badge>
                      <span className="font-bold text-xs text-foreground">{officer.role}</span>
                    </div>
                    {officers.length > 3 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOfficer(index)}
                        className="h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 px-2"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    <div className="space-y-1">
                      <Label>Official Designation / Title *</Label>
                      <Input
                        value={officer.role}
                        onChange={(e) => updateOfficer(index, "role", e.target.value)}
                        placeholder="e.g. Welfare Director"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <Label>Full Name *</Label>
                      <Input
                        required
                        value={officer.fullName}
                        onChange={(e) => updateOfficer(index, "fullName", e.target.value)}
                        placeholder="Officer full legal name"
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
                        placeholder="officer@email.com"
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

                    <div className="space-y-1 sm:col-span-2 md:col-span-3">
                      <Label>Residential Address in Odeda / Ogun State</Label>
                      <Input
                        value={officer.address}
                        onChange={(e) => updateOfficer(index, "address", e.target.value)}
                        placeholder="Residential address"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Members Roster Section */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                  <Users className="w-4 h-4" /> Foundation Members List
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Record the roster of founding members of the club.
                </p>
              </div>
              <Button
                type="button"
                onClick={addMember}
                size="sm"
                variant="outline"
                className="text-xs gap-1 h-8"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Member
              </Button>
            </div>

            <div className="space-y-2.5">
              {members.map((member, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-3 bg-muted/10 grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center text-xs"
                >
                  <div className="sm:col-span-1 font-mono font-bold text-muted-foreground text-center">
                    #{index + 1}
                  </div>
                  <div className="sm:col-span-4">
                    <Input
                      value={member.fullName}
                      onChange={(e) => updateMember(index, "fullName", e.target.value)}
                      placeholder="Member Full Name"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <Input
                      value={member.phone}
                      onChange={(e) => updateMember(index, "phone", e.target.value)}
                      placeholder="Phone Number"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <Input
                      value={member.address}
                      onChange={(e) => updateMember(index, "address", e.target.value)}
                      placeholder="Address / Town"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="sm:col-span-1 flex justify-end">
                    {members.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeMember(index)}
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
          applicant={applicant}
          sections={reviewSections}
          repeatableSections={reviewRepeatables}
          documents={DOCUMENTS}
          uploadedFiles={uploadedFiles}
          declarationChecked={declaration}
          onDeclarationChange={setDeclaration}
          declarationText="We, the undersigned executive officers of the club/association, hereby declare under oath that the constitution, aims, officer roster, and credentials presented are genuine and enacted according to law. We pledge adherence to the Community Development bye-laws of Odeda Local Government Authority."
        />
      )}
    </FormWizard>
  );
}
