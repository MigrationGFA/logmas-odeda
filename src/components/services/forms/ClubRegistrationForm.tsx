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
import { Plus, Trash2, User, Users, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Props {
  service: OdedaService;
  onSubmit: (formData: Record<string, any>) => void;
  isSubmitting?: boolean;
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
    label: "Proof of Secretariat / Meeting Venue",
    description: "Tenancy agreement, utility bill, or official letter from venue owner.",
    required: false,
  },
];

export default function ClubRegistrationForm({ service, onSubmit, isSubmitting }: Props) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});
  const [declaration, setDeclaration] = useState(false);

  // Step 1 & 2 Form Data
  const [formData, setFormData] = useState({
    clubName: "",
    acronym: "",
    category: "Social & Cultural Club",
    formationDate: "",
    ward: WARDS[0] || "Odeda",
    secretariatAddress: "",
    phone: "",
    email: "",
    bankName: "",
    bankAccountNo: "",
    aims: "1. Promote unity and welfare among members.\n2. Foster community development initiatives in Odeda LGA.\n3. Organize socio-cultural and educational empowerment programs.",
    meetingFrequency: "Monthly",
    meetingVenue: "",
    totalMembersCount: "25",
    fundingSource: "Monthly Membership Dues, Levies, and Philanthropic Donations",
  });

  // Step 3: Mandatory Core Officers
  const [president, setPresident] = useState<OfficerRecord>({
    role: "President / Chairman",
    fullName: "",
    phone: "",
    email: "",
    address: "",
    occupation: "",
    nin: "",
  });

  const [secretary, setSecretary] = useState<OfficerRecord>({
    role: "General Secretary",
    fullName: "",
    phone: "",
    email: "",
    address: "",
    occupation: "",
    nin: "",
  });

  const [treasurer, setTreasurer] = useState<OfficerRecord>({
    role: "Treasurer / Financial Secretary",
    fullName: "",
    phone: "",
    email: "",
    address: "",
    occupation: "",
    nin: "",
  });

  const [welfareOfficer, setWelfareOfficer] = useState<OfficerRecord>({
    role: "Welfare / PRO",
    fullName: "",
    phone: "",
    email: "",
    address: "",
    occupation: "",
    nin: "",
  });

  // Step 3: Other Executives (Repeatable List)
  const [otherExecutives, setOtherExecutives] = useState<OfficerRecord[]>([
    {
      role: "Vice President",
      fullName: "",
      phone: "",
      email: "",
      address: "",
      occupation: "",
      nin: "",
    },
  ]);

  // Step 3: Members Roster (Repeatable List)
  const [members, setMembers] = useState<MemberRecord[]>([
    { fullName: "", phone: "", address: "", membershipNo: "MB-001", joinedYear: "2024" },
    { fullName: "", phone: "", address: "", membershipNo: "MB-002", joinedYear: "2024" },
  ]);

  // Executive Management Handlers
  const addOtherExecutive = () => {
    setOtherExecutives((prev) => [
      ...prev,
      {
        role: "Executive Member / Trustee",
        fullName: "",
        phone: "",
        email: "",
        address: "",
        occupation: "",
        nin: "",
      },
    ]);
  };

  const removeOtherExecutive = (index: number) => {
    setOtherExecutives((prev) => prev.filter((_, i) => i !== index));
  };

  const updateOtherExecutive = (index: number, field: keyof OfficerRecord, value: string) => {
    setOtherExecutives((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  // Member Roster Handlers
  const addMember = () => {
    setMembers((prev) => [
      ...prev,
      {
        fullName: "",
        phone: "",
        address: "",
        membershipNo: `MB-00${prev.length + 1}`,
        joinedYear: new Date().getFullYear().toString(),
      },
    ]);
  };

  const removeMember = (index: number) => {
    setMembers((prev) => prev.filter((_, i) => i !== index));
  };

  const updateMember = (index: number, field: keyof MemberRecord, value: string) => {
    setMembers((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
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
        !!formData.clubName.trim() &&
        !!formData.formationDate &&
        !!formData.ward &&
        !!formData.secretariatAddress.trim() &&
        !!formData.phone.trim()
      );
    }
    if (index === 1) {
      return (
        !!formData.aims.trim() &&
        !!formData.meetingFrequency &&
        !!formData.totalMembersCount
      );
    }
    if (index === 2) {
      // Must have President and Secretary details filled
      return (
        !!president.fullName.trim() &&
        !!president.phone.trim() &&
        !!secretary.fullName.trim() &&
        !!secretary.phone.trim() &&
        !!treasurer.fullName.trim() &&
        !!welfareOfficer.fullName.trim()
      );
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

    const allOfficers = [
      president,
      secretary,
      treasurer,
      welfareOfficer,
      ...otherExecutives.filter((o) => o.fullName.trim()),
    ];

    const cleanMembers = members.filter((m) => m.fullName.trim());

    onSubmit({
      ...formData,
      president,
      secretary,
      treasurer,
      welfareOfficer,
      otherExecutives: otherExecutives.filter((o) => o.fullName.trim()),
      allOfficers,
      members: cleanMembers,
      uploadedFiles,
      amount: currentFee,
      revenueHead: service.revenueHead,
      serviceName: service.name,
      applicant: formData.clubName,
    });
  };

  const reviewSections: ReviewSection[] = [
    {
      title: "Club & Association Details",
      items: [
        { label: "Club / Association Name", value: formData.clubName },
        { label: "Acronym / Short Name", value: formData.acronym },
        { label: "Category", value: formData.category },
        { label: "Date of Formation", value: formData.formationDate },
        { label: "Ward Jurisdiction", value: formData.ward },
        { label: "Secretariat Physical Address", value: formData.secretariatAddress },
        { label: "Official Contact Phone", value: formData.phone },
        { label: "Official Email", value: formData.email },
        { label: "Bank Account Details", value: formData.bankName ? `${formData.bankName} (${formData.bankAccountNo})` : "N/A" },
      ],
    },
    {
      title: "Operations & Governance",
      items: [
        { label: "Meeting Frequency", value: formData.meetingFrequency },
        { label: "Meeting Venue", value: formData.meetingVenue },
        { label: "Declared Total Members", value: formData.totalMembersCount },
        { label: "Funding Sources", value: formData.fundingSource },
        { label: "Aims & Objectives", value: <div className="text-xs whitespace-pre-line">{formData.aims}</div> },
      ],
    },
  ];

  const reviewRepeatableSections: ReviewRepeatableSection[] = [
    {
      title: "Core & Executive Officers (Statutory Council)",
      countLabel: "Executive Officers",
      items: [
        {
          Role: president.role,
          Name: president.fullName,
          Phone: president.phone,
          Email: president.email,
          Address: president.address,
          Occupation: president.occupation,
          NIN: president.nin,
        },
        {
          Role: secretary.role,
          Name: secretary.fullName,
          Phone: secretary.phone,
          Email: secretary.email,
          Address: secretary.address,
          Occupation: secretary.occupation,
          NIN: secretary.nin,
        },
        {
          Role: treasurer.role,
          Name: treasurer.fullName,
          Phone: treasurer.phone,
          Email: treasurer.email,
          Address: treasurer.address,
          Occupation: treasurer.occupation,
          NIN: treasurer.nin,
        },
        {
          Role: welfareOfficer.role,
          Name: welfareOfficer.fullName,
          Phone: welfareOfficer.phone,
          Email: welfareOfficer.email,
          Address: welfareOfficer.address,
          Occupation: welfareOfficer.occupation,
          NIN: welfareOfficer.nin,
        },
        ...otherExecutives
          .filter((o) => o.fullName.trim())
          .map((o) => ({
            Role: o.role,
            Name: o.fullName,
            Phone: o.phone,
            Email: o.email,
            Address: o.address,
            Occupation: o.occupation,
            NIN: o.nin,
          })),
      ],
    },
    {
      title: "Registered Association Members Roster",
      countLabel: "Members",
      items: members
        .filter((m) => m.fullName.trim())
        .map((m) => ({
          "Member Name": m.fullName,
          "Phone Number": m.phone,
          Address: m.address,
          "Member ID": m.membershipNo,
          "Joined Year": m.joinedYear,
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
      {/* STEP 1: Club Profile */}
      {currentStepIndex === 0 && (
        <div className="space-y-4">
          <div className="border-b pb-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary">
              Club / Association Profile
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Enter official association registry details for Odeda Local Government Community Development records.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="clubName">Club / Association Full Name *</Label>
              <Input
                id="clubName"
                required
                value={formData.clubName}
                onChange={(e) => setFormData({ ...formData, clubName: e.target.value })}
                placeholder="e.g. Odeda Elite Dynamic Social Club"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="acronym">Acronym / Short Name</Label>
              <Input
                id="acronym"
                value={formData.acronym}
                onChange={(e) => setFormData({ ...formData, acronym: e.target.value })}
                placeholder="e.g. OEDSC"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="category">Club Category *</Label>
              <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Social & Cultural Club">Social & Cultural Club</SelectItem>
                  <SelectItem value="Youth & Community Development Association">Youth & Community Development Association</SelectItem>
                  <SelectItem value="Sports & Recreation Club">Sports & Recreation Club</SelectItem>
                  <SelectItem value="Professional & Trade Association">Professional & Trade Association</SelectItem>
                  <SelectItem value="Philanthropic & Charity Society">Philanthropic & Charity Society</SelectItem>
                  <SelectItem value="Religious Fellowship / Guild">Religious Fellowship / Guild</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="formationDate">Date of Formation / Inauguration *</Label>
              <Input
                id="formationDate"
                type="date"
                required
                value={formData.formationDate}
                onChange={(e) => setFormData({ ...formData, formationDate: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ward">Ward Jurisdiction in Odeda LGA *</Label>
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
              <Label htmlFor="secretariatAddress">Physical Secretariat / Headquarters Address *</Label>
              <Input
                id="secretariatAddress"
                required
                value={formData.secretariatAddress}
                onChange={(e) => setFormData({ ...formData, secretariatAddress: e.target.value })}
                placeholder="Building address, Street name, Town/Village in Odeda LGA"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Official Secretariat Phone *</Label>
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
              <Label htmlFor="email">Official Secretariat Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@clubname.org"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bankName">Official Bankers (Bank Name)</Label>
              <Input
                id="bankName"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                placeholder="e.g. First Bank of Nigeria"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bankAccountNo">Bank Account Number (If created)</Label>
              <Input
                id="bankAccountNo"
                maxLength={10}
                value={formData.bankAccountNo}
                onChange={(e) => setFormData({ ...formData, bankAccountNo: e.target.value })}
                placeholder="10-digit NUBAN"
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
              Aims, Objectives & Operational Guidelines
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Provide details on meeting cadence, membership strength, and association constitution summary.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="aims">Key Aims & Objectives of the Club *</Label>
              <Textarea
                id="aims"
                rows={4}
                required
                value={formData.aims}
                onChange={(e) => setFormData({ ...formData, aims: e.target.value })}
                placeholder="List the primary aims and objectives as outlined in your constitution..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="meetingFrequency">Meeting Frequency *</Label>
                <Select value={formData.meetingFrequency} onValueChange={(val) => setFormData({ ...formData, meetingFrequency: val })}>
                  <SelectTrigger id="meetingFrequency">
                    <SelectValue placeholder="Select Frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Bi-Weekly (Fortnightly)">Bi-Weekly (Fortnightly)</SelectItem>
                    <SelectItem value="Monthly (First Sunday)">Monthly (First Sunday)</SelectItem>
                    <SelectItem value="Monthly (Last Saturday)">Monthly (Last Saturday)</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="totalMembersCount">Current Total Membership Count *</Label>
                <Input
                  id="totalMembersCount"
                  type="number"
                  required
                  min={5}
                  value={formData.totalMembersCount}
                  onChange={(e) => setFormData({ ...formData, totalMembersCount: e.target.value })}
                  placeholder="e.g. 35"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="meetingVenue">Regular Meeting Venue / Hall</Label>
                <Input
                  id="meetingVenue"
                  value={formData.meetingVenue}
                  onChange={(e) => setFormData({ ...formData, meetingVenue: e.target.value })}
                  placeholder="e.g. Community Hall, Camp / Odeda Town Hall"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="fundingSource">Sources of Association Income / Funding *</Label>
                <Input
                  id="fundingSource"
                  required
                  value={formData.fundingSource}
                  onChange={(e) => setFormData({ ...formData, fundingSource: e.target.value })}
                  placeholder="e.g. Monthly Dues (₦1,000/member), Annual Levies, Donations"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Executive Officers & Members (REPEATABLE UI) */}
      {currentStepIndex === 2 && (
        <div className="space-y-6">
          <div className="border-b pb-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary">
              Executive Officers & Registered Members Roster
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Statutory bye-laws require full details for Chairman/President, Secretary, Treasurer, Welfare Officer, and other executive trustees.
            </p>
          </div>

          {/* Core Officers */}
          <div className="space-y-4">
            <h5 className="font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-primary" /> Mandatory Principal Executive Officers
            </h5>

            {/* 1. Chairman / President */}
            <div className="bg-muted/20 border border-primary/20 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-bold text-xs text-primary uppercase">1. Chairman / President *</span>
                <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary">Principal Officer</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Full Name *</Label>
                  <Input
                    required
                    value={president.fullName}
                    onChange={(e) => setPresident({ ...president, fullName: e.target.value })}
                    placeholder="Full Legal Name"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Phone Number *</Label>
                  <Input
                    required
                    value={president.phone}
                    onChange={(e) => setPresident({ ...president, phone: e.target.value })}
                    placeholder="+234 800..."
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Email Address</Label>
                  <Input
                    value={president.email}
                    onChange={(e) => setPresident({ ...president, email: e.target.value })}
                    placeholder="president@email.com"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Residential Address</Label>
                  <Input
                    value={president.address}
                    onChange={(e) => setPresident({ ...president, address: e.target.value })}
                    placeholder="Home address in Odeda"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Occupation</Label>
                  <Input
                    value={president.occupation}
                    onChange={(e) => setPresident({ ...president, occupation: e.target.value })}
                    placeholder="e.g. Businessperson / Accountant"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">NIN Number</Label>
                  <Input
                    maxLength={11}
                    value={president.nin}
                    onChange={(e) => setPresident({ ...president, nin: e.target.value })}
                    placeholder="11-digit NIN"
                  />
                </div>
              </div>
            </div>

            {/* 2. General Secretary */}
            <div className="bg-muted/20 border border-primary/20 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-bold text-xs text-primary uppercase">2. General Secretary *</span>
                <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary">Secretariat</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Full Name *</Label>
                  <Input
                    required
                    value={secretary.fullName}
                    onChange={(e) => setSecretary({ ...secretary, fullName: e.target.value })}
                    placeholder="Full Legal Name"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Phone Number *</Label>
                  <Input
                    required
                    value={secretary.phone}
                    onChange={(e) => setSecretary({ ...secretary, phone: e.target.value })}
                    placeholder="+234 800..."
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Email Address</Label>
                  <Input
                    value={secretary.email}
                    onChange={(e) => setSecretary({ ...secretary, email: e.target.value })}
                    placeholder="secretary@email.com"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Residential Address</Label>
                  <Input
                    value={secretary.address}
                    onChange={(e) => setSecretary({ ...secretary, address: e.target.value })}
                    placeholder="Home address"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Occupation</Label>
                  <Input
                    value={secretary.occupation}
                    onChange={(e) => setSecretary({ ...secretary, occupation: e.target.value })}
                    placeholder="e.g. Teacher / Administrator"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">NIN Number</Label>
                  <Input
                    maxLength={11}
                    value={secretary.nin}
                    onChange={(e) => setSecretary({ ...secretary, nin: e.target.value })}
                    placeholder="11-digit NIN"
                  />
                </div>
              </div>
            </div>

            {/* 3. Treasurer / Financial Secretary */}
            <div className="bg-muted/20 border border-primary/20 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-bold text-xs text-primary uppercase">3. Treasurer / Financial Secretary *</span>
                <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary">Treasury</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Full Name *</Label>
                  <Input
                    required
                    value={treasurer.fullName}
                    onChange={(e) => setTreasurer({ ...treasurer, fullName: e.target.value })}
                    placeholder="Full Legal Name"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Phone Number *</Label>
                  <Input
                    required
                    value={treasurer.phone}
                    onChange={(e) => setTreasurer({ ...treasurer, phone: e.target.value })}
                    placeholder="+234 800..."
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Email Address</Label>
                  <Input
                    value={treasurer.email}
                    onChange={(e) => setTreasurer({ ...treasurer, email: e.target.value })}
                    placeholder="treasurer@email.com"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Residential Address</Label>
                  <Input
                    value={treasurer.address}
                    onChange={(e) => setTreasurer({ ...treasurer, address: e.target.value })}
                    placeholder="Home address"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Occupation</Label>
                  <Input
                    value={treasurer.occupation}
                    onChange={(e) => setTreasurer({ ...treasurer, occupation: e.target.value })}
                    placeholder="Occupation"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">NIN Number</Label>
                  <Input
                    maxLength={11}
                    value={treasurer.nin}
                    onChange={(e) => setTreasurer({ ...treasurer, nin: e.target.value })}
                    placeholder="11-digit NIN"
                  />
                </div>
              </div>
            </div>

            {/* 4. Welfare Officer / PRO */}
            <div className="bg-muted/20 border border-primary/20 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-bold text-xs text-primary uppercase">4. Welfare Officer / Public Relations Officer *</span>
                <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary">Welfare & Publicity</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Full Name *</Label>
                  <Input
                    required
                    value={welfareOfficer.fullName}
                    onChange={(e) => setWelfareOfficer({ ...welfareOfficer, fullName: e.target.value })}
                    placeholder="Full Legal Name"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Phone Number *</Label>
                  <Input
                    required
                    value={welfareOfficer.phone}
                    onChange={(e) => setWelfareOfficer({ ...welfareOfficer, phone: e.target.value })}
                    placeholder="+234 800..."
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Email Address</Label>
                  <Input
                    value={welfareOfficer.email}
                    onChange={(e) => setWelfareOfficer({ ...welfareOfficer, email: e.target.value })}
                    placeholder="welfare@email.com"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Residential Address</Label>
                  <Input
                    value={welfareOfficer.address}
                    onChange={(e) => setWelfareOfficer({ ...welfareOfficer, address: e.target.value })}
                    placeholder="Home address"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Occupation</Label>
                  <Input
                    value={welfareOfficer.occupation}
                    onChange={(e) => setWelfareOfficer({ ...welfareOfficer, occupation: e.target.value })}
                    placeholder="Occupation"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">NIN Number</Label>
                  <Input
                    maxLength={11}
                    value={welfareOfficer.nin}
                    onChange={(e) => setWelfareOfficer({ ...welfareOfficer, nin: e.target.value })}
                    placeholder="11-digit NIN"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* REPEATABLE SECTION: Other Executives */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <User className="w-4 h-4 text-primary" /> Other Executive Officers & Trustees
                </h5>
                <p className="text-[11px] text-muted-foreground">
                  Add any additional executive roles (e.g., Vice Chairman, Provost, Chief Whip, Legal Adviser, Patrons).
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOtherExecutive}
                className="gap-1 text-xs h-8"
              >
                <Plus className="w-3.5 h-3.5" /> Add Officer
              </Button>
            </div>

            {otherExecutives.map((officer, idx) => (
              <div key={idx} className="bg-muted/10 border rounded-xl p-4 space-y-3 relative group">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-bold text-xs text-foreground">Officer #{idx + 1}: {officer.role || "Executive Member"}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOtherExecutive(idx)}
                    className="text-red-500 hover:text-red-700 h-7 px-2 text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Executive Role / Designation *</Label>
                    <Input
                      value={officer.role}
                      onChange={(e) => updateOtherExecutive(idx, "role", e.target.value)}
                      placeholder="e.g. Vice President / Provost"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Full Name *</Label>
                    <Input
                      value={officer.fullName}
                      onChange={(e) => updateOtherExecutive(idx, "fullName", e.target.value)}
                      placeholder="Full Name"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Phone Number *</Label>
                    <Input
                      value={officer.phone}
                      onChange={(e) => updateOtherExecutive(idx, "phone", e.target.value)}
                      placeholder="+234 800..."
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Email Address</Label>
                    <Input
                      value={officer.email}
                      onChange={(e) => updateOtherExecutive(idx, "email", e.target.value)}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Residential Address</Label>
                    <Input
                      value={officer.address}
                      onChange={(e) => updateOtherExecutive(idx, "address", e.target.value)}
                      placeholder="Address"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Occupation</Label>
                    <Input
                      value={officer.occupation}
                      onChange={(e) => updateOtherExecutive(idx, "occupation", e.target.value)}
                      placeholder="Occupation"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* REPEATABLE SECTION: Registered Members Roster */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-primary" /> Key Registered Members Roster
                </h5>
                <p className="text-[11px] text-muted-foreground">
                  Record founding or representative members of the association for statutory registry.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMember}
                className="gap-1 text-xs h-8"
              >
                <Plus className="w-3.5 h-3.5" /> Add Member
              </Button>
            </div>

            <div className="space-y-2.5">
              {members.map((member, idx) => (
                <div key={idx} className="bg-card border rounded-lg p-3 grid grid-cols-1 sm:grid-cols-5 gap-2.5 items-end">
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-[11px]">Member Full Name</Label>
                    <Input
                      value={member.fullName}
                      onChange={(e) => updateMember(idx, "fullName", e.target.value)}
                      placeholder="Member Name"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">Phone Number</Label>
                    <Input
                      value={member.phone}
                      onChange={(e) => updateMember(idx, "phone", e.target.value)}
                      placeholder="080..."
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">Member ID / Year</Label>
                    <Input
                      value={member.membershipNo}
                      onChange={(e) => updateMember(idx, "membershipNo", e.target.value)}
                      placeholder="MB-001"
                      className="h-8 text-xs font-mono"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMember(idx)}
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
          declarationText="We, the principal officers of this association, solemnly declare that the information provided is authentic, the constitution has been legitimately adopted, and the association shall operate within the statutory laws of Odeda Local Government and Nigeria."
        />
      )}
    </FormWizard>
  );
}
