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
import { Plus, Trash2, Shield, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Props {
  service: OdedaService;
  onSubmit: (formData: Record<string, any>) => void;
  isSubmitting?: boolean;
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
    title: "Executive Committee & Street Zones",
    shortTitle: "Executives & Streets",
    description: "Provide complete details for CDA officers and the list of streets/zones within the community.",
  },
  {
    id: "documents",
    title: "Supporting Documents",
    shortTitle: "Documents",
    description: "Upload CDA constitution, inaugural minutes with resident attendance, and boundary map.",
  },
  {
    id: "review",
    title: "Review & Submit",
    shortTitle: "Review",
    description: "Review all community records, council roster, and submit statutory application.",
  },
];

const DOCUMENTS: DocumentSpec[] = [
  {
    id: "cda_constitution",
    label: "CDA Constitution & Bye-Laws",
    description: "Adopted constitution governing community dues, security, and elections.",
    required: true,
  },
  {
    id: "minutes_attendance",
    label: "Inaugural Minutes & Residents Attendance List",
    description: "Signed attendance register from the general community meeting establishing the CDA.",
    required: true,
  },
  {
    id: "executives_roster_signed",
    label: "Signed Executive Council Roster",
    description: "List of all elected executives with signatures and phone numbers.",
    required: true,
  },
  {
    id: "baale_endorsement",
    label: "Baale / Traditional Council Endorsement",
    description: "Official letter of recommendation and consent from the area Baale or traditional ruler.",
    required: true,
  },
  {
    id: "boundary_sketch",
    label: "Community Boundary Sketch / Map",
    description: "Map or survey sketch showing north, south, east, and west perimeter boundaries.",
    required: false,
  },
];

export default function CdaRegistrationForm({ service, onSubmit, isSubmitting }: Props) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});
  const [declaration, setDeclaration] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    cdaName: "",
    communityName: "",
    ward: WARDS[0] || "Odeda",
    quarterZone: "",
    yearFormed: "2023",
    estimatedHouseholds: "120",
    estimatedPopulation: "600",
    northBoundary: "",
    southBoundary: "",
    eastBoundary: "",
    westBoundary: "",
    sponsoringBaale: "",
    baalePhone: "",
    ongoingProjects: "Community security gate installation and street lighting along Main Access Road.",
    proposedProjects: "Grading of internal access roads and installation of 500kVA community transformer.",
    meetingVenue: "Community Secretariat / Baale Palace Grounds",
    meetingDay: "First Saturday of Every Month (8:00 AM)",
    monthlyDues: "₦1,000 per household per month",
  });

  // Core Executive Officers
  const [chairman, setChairman] = useState<CdaOfficer>({
    role: "CDA Chairman",
    fullName: "",
    phone: "",
    email: "",
    address: "",
    occupation: "",
    nin: "",
  });

  const [viceChairman, setViceChairman] = useState<CdaOfficer>({
    role: "Vice Chairman",
    fullName: "",
    phone: "",
    email: "",
    address: "",
    occupation: "",
    nin: "",
  });

  const [secretary, setSecretary] = useState<CdaOfficer>({
    role: "General Secretary",
    fullName: "",
    phone: "",
    email: "",
    address: "",
    occupation: "",
    nin: "",
  });

  const [treasurer, setTreasurer] = useState<CdaOfficer>({
    role: "Treasurer",
    fullName: "",
    phone: "",
    email: "",
    address: "",
    occupation: "",
    nin: "",
  });

  const [securityOfficer, setSecurityOfficer] = useState<CdaOfficer>({
    role: "Chief Security Officer (CSO)",
    fullName: "",
    phone: "",
    email: "",
    address: "",
    occupation: "",
    nin: "",
  });

  // Other Executive Officers (Repeatable List)
  const [otherOfficers, setOtherOfficers] = useState<CdaOfficer[]>([
    {
      role: "Financial Secretary",
      fullName: "",
      phone: "",
      email: "",
      address: "",
      occupation: "",
      nin: "",
    },
    {
      role: "Public Relations Officer (PRO)",
      fullName: "",
      phone: "",
      email: "",
      address: "",
      occupation: "",
      nin: "",
    },
    {
      role: "Women Leader",
      fullName: "",
      phone: "",
      email: "",
      address: "",
      occupation: "",
      nin: "",
    },
  ]);

  // Repeatable Streets / Zones in Community
  const [streets, setStreets] = useState<CommunityStreet[]>([
    { streetName: "Main Community Boulevard", estimatedHouses: "35", zoneLeader: "", leaderPhone: "" },
    { streetName: "Peace & Unity Avenue", estimatedHouses: "28", zoneLeader: "", leaderPhone: "" },
  ]);

  // Handlers for Other Officers
  const addOfficer = () => {
    setOtherOfficers((prev) => [
      ...prev,
      {
        role: "Executive Member / Zonal Head",
        fullName: "",
        phone: "",
        email: "",
        address: "",
        occupation: "",
        nin: "",
      },
    ]);
  };

  const removeOfficer = (idx: number) => {
    setOtherOfficers((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateOfficer = (idx: number, field: keyof CdaOfficer, val: string) => {
    setOtherOfficers((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });
  };

  // Handlers for Streets
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

  const removeStreet = (idx: number) => {
    setStreets((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateStreet = (idx: number, field: keyof CommunityStreet, val: string) => {
    setStreets((prev) => {
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
        !!formData.cdaName.trim() &&
        !!formData.communityName.trim() &&
        !!formData.ward &&
        !!formData.estimatedHouseholds &&
        !!formData.sponsoringBaale.trim()
      );
    }
    if (index === 1) {
      return !!formData.ongoingProjects.trim() && !!formData.meetingVenue.trim();
    }
    if (index === 2) {
      return (
        !!chairman.fullName.trim() &&
        !!chairman.phone.trim() &&
        !!secretary.fullName.trim() &&
        !!secretary.phone.trim() &&
        !!treasurer.fullName.trim()
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
      chairman,
      viceChairman,
      secretary,
      treasurer,
      securityOfficer,
      ...otherOfficers.filter((o) => o.fullName.trim()),
    ];

    const cleanStreets = streets.filter((s) => s.streetName.trim());

    onSubmit({
      ...formData,
      chairman,
      viceChairman,
      secretary,
      treasurer,
      securityOfficer,
      otherOfficers: otherOfficers.filter((o) => o.fullName.trim()),
      allOfficers,
      streets: cleanStreets,
      uploadedFiles,
      amount: currentFee,
      revenueHead: service.revenueHead,
      serviceName: service.name,
      applicant: formData.cdaName,
    });
  };

  const reviewSections: ReviewSection[] = [
    {
      title: "CDA & Community Demographics",
      items: [
        { label: "CDA Name", value: formData.cdaName },
        { label: "Community / Settlement", value: formData.communityName },
        { label: "Ward Jurisdiction", value: formData.ward },
        { label: "Quarter / Zone", value: formData.quarterZone },
        { label: "Year Formed", value: formData.yearFormed },
        { label: "Estimated Households", value: `${formData.estimatedHouseholds} homes` },
        { label: "Estimated Population", value: `${formData.estimatedPopulation} residents` },
        { label: "Sponsoring Baale / Ruler", value: `${formData.sponsoringBaale} (${formData.baalePhone})` },
      ],
    },
    {
      title: "Geographical Perimeter Boundaries",
      items: [
        { label: "North Boundary", value: formData.northBoundary },
        { label: "South Boundary", value: formData.southBoundary },
        { label: "East Boundary", value: formData.eastBoundary },
        { label: "West Boundary", value: formData.westBoundary },
      ],
    },
    {
      title: "Development Programs & Governance",
      items: [
        { label: "Regular Meeting Venue", value: formData.meetingVenue },
        { label: "Meeting Schedule", value: formData.meetingDay },
        { label: "Community Security Dues", value: formData.monthlyDues },
        { label: "Ongoing Projects", value: formData.ongoingProjects },
        { label: "Proposed Projects", value: formData.proposedProjects },
      ],
    },
  ];

  const reviewRepeatableSections: ReviewRepeatableSection[] = [
    {
      title: "CDA Executive Committee (Cabinet)",
      countLabel: "Executive Officers",
      items: [
        {
          Role: chairman.role,
          Name: chairman.fullName,
          Phone: chairman.phone,
          Email: chairman.email,
          Address: chairman.address,
          Occupation: chairman.occupation,
          NIN: chairman.nin,
        },
        {
          Role: viceChairman.role,
          Name: viceChairman.fullName,
          Phone: viceChairman.phone,
          Email: viceChairman.email,
          Address: viceChairman.address,
          Occupation: viceChairman.occupation,
          NIN: viceChairman.nin,
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
          Role: securityOfficer.role,
          Name: securityOfficer.fullName,
          Phone: securityOfficer.phone,
          Email: securityOfficer.email,
          Address: securityOfficer.address,
          Occupation: securityOfficer.occupation,
          NIN: securityOfficer.nin,
        },
        ...otherOfficers
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
      title: "Streets & Residential Zones Covered",
      countLabel: "Streets / Zones",
      items: streets
        .filter((s) => s.streetName.trim())
        .map((s) => ({
          "Street Name": s.streetName,
          "Est. Houses": `${s.estimatedHouses} units`,
          "Zone Leader": s.zoneLeader,
          "Leader Phone": s.leaderPhone,
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
      {/* STEP 1: CDA Profile */}
      {currentStepIndex === 0 && (
        <div className="space-y-4">
          <div className="border-b pb-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary">
              Community Development Association Profile
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Enter official CDA registration credentials and geographic territory within Odeda LGA.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="cdaName">Proposed CDA Official Name *</Label>
              <Input
                id="cdaName"
                required
                value={formData.cdaName}
                onChange={(e) => setFormData({ ...formData, cdaName: e.target.value })}
                placeholder="e.g. Obantoko Harmony Community Development Association"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="communityName">Community / Estate / Settlement Name *</Label>
              <Input
                id="communityName"
                required
                value={formData.communityName}
                onChange={(e) => setFormData({ ...formData, communityName: e.target.value })}
                placeholder="e.g. Harmony Estate, Camp Area"
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

            <div className="space-y-1.5">
              <Label htmlFor="quarterZone">Quarter / Zonal Section</Label>
              <Input
                id="quarterZone"
                value={formData.quarterZone}
                onChange={(e) => setFormData({ ...formData, quarterZone: e.target.value })}
                placeholder="e.g. Zone 4 / Upper Camp"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="yearFormed">Year Community Formed</Label>
              <Input
                id="yearFormed"
                value={formData.yearFormed}
                onChange={(e) => setFormData({ ...formData, yearFormed: e.target.value })}
                placeholder="e.g. 2022"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="estimatedHouseholds">Estimated Number of Households *</Label>
              <Input
                id="estimatedHouseholds"
                type="number"
                required
                value={formData.estimatedHouseholds}
                onChange={(e) => setFormData({ ...formData, estimatedHouseholds: e.target.value })}
                placeholder="e.g. 150"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="estimatedPopulation">Estimated Total Resident Population</Label>
              <Input
                id="estimatedPopulation"
                type="number"
                value={formData.estimatedPopulation}
                onChange={(e) => setFormData({ ...formData, estimatedPopulation: e.target.value })}
                placeholder="e.g. 800"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sponsoringBaale">Sponsoring Baale / Traditional Chief *</Label>
              <Input
                id="sponsoringBaale"
                required
                value={formData.sponsoringBaale}
                onChange={(e) => setFormData({ ...formData, sponsoringBaale: e.target.value })}
                placeholder="e.g. Baale Adesanya of Camp"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="baalePhone">Baale / Chief Phone Contact</Label>
              <Input
                id="baalePhone"
                type="tel"
                value={formData.baalePhone}
                onChange={(e) => setFormData({ ...formData, baalePhone: e.target.value })}
                placeholder="+234 800 000 0000"
              />
            </div>
          </div>

          <div className="bg-muted/30 p-4 rounded-xl border space-y-3 mt-4">
            <h5 className="font-bold text-xs uppercase tracking-wide text-foreground flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary" /> Community Perimeter Boundaries
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">North Boundary Landmark</Label>
                <Input
                  value={formData.northBoundary}
                  onChange={(e) => setFormData({ ...formData, northBoundary: e.target.value })}
                  placeholder="e.g. Express Road"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">South Boundary Landmark</Label>
                <Input
                  value={formData.southBoundary}
                  onChange={(e) => setFormData({ ...formData, southBoundary: e.target.value })}
                  placeholder="e.g. Stream / River"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">East Boundary Landmark</Label>
                <Input
                  value={formData.eastBoundary}
                  onChange={(e) => setFormData({ ...formData, eastBoundary: e.target.value })}
                  placeholder="e.g. Odeda High School"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">West Boundary Landmark</Label>
                <Input
                  value={formData.westBoundary}
                  onChange={(e) => setFormData({ ...formData, westBoundary: e.target.value })}
                  placeholder="e.g. Boundary with Ward 8"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Projects & Development */}
      {currentStepIndex === 1 && (
        <div className="space-y-4">
          <div className="border-b pb-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary">
              Community Development Projects & Operations
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Provide information on community projects, security initiatives, and meeting protocols.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="ongoingProjects">Ongoing Community Self-Help Projects *</Label>
              <Textarea
                id="ongoingProjects"
                rows={3}
                required
                value={formData.ongoingProjects}
                onChange={(e) => setFormData({ ...formData, ongoingProjects: e.target.value })}
                placeholder="Describe current security gates, grading, culverts, or water borehole projects..."
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="proposedProjects">Proposed Future Priority Projects (Next 1-3 Years)</Label>
              <Textarea
                id="proposedProjects"
                rows={3}
                value={formData.proposedProjects}
                onChange={(e) => setFormData({ ...formData, proposedProjects: e.target.value })}
                placeholder="Planned transformers, healthcare posts, drainage gutters, paving..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="meetingVenue">General Meeting Venue *</Label>
                <Input
                  id="meetingVenue"
                  required
                  value={formData.meetingVenue}
                  onChange={(e) => setFormData({ ...formData, meetingVenue: e.target.value })}
                  placeholder="e.g. Community Central Hall"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="meetingDay">Meeting Day & Time</Label>
                <Input
                  id="meetingDay"
                  value={formData.meetingDay}
                  onChange={(e) => setFormData({ ...formData, meetingDay: e.target.value })}
                  placeholder="e.g. 1st Saturday 7:00 AM"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="monthlyDues">Agreed Household Security & Dev Dues</Label>
                <Input
                  id="monthlyDues"
                  value={formData.monthlyDues}
                  onChange={(e) => setFormData({ ...formData, monthlyDues: e.target.value })}
                  placeholder="e.g. ₦1,500 / month"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Executives & Streets (REPEATABLE UI) */}
      {currentStepIndex === 2 && (
        <div className="space-y-6">
          <div className="border-b pb-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary">
              CDA Executive Committee & Street Zones Roster
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Provide complete executive council particulars and the streets/zones falling within this CDA.
            </p>
          </div>

          {/* Core CDA Officers */}
          <div className="space-y-4">
            <h5 className="font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-primary" /> Mandatory Principal CDA Officers
            </h5>

            {/* 1. Chairman */}
            <div className="bg-muted/20 border border-primary/20 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-bold text-xs text-primary uppercase">1. CDA Chairman *</span>
                <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary">Head of Executive</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Full Name *</Label>
                  <Input
                    required
                    value={chairman.fullName}
                    onChange={(e) => setChairman({ ...chairman, fullName: e.target.value })}
                    placeholder="Full Legal Name"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Phone Number *</Label>
                  <Input
                    required
                    value={chairman.phone}
                    onChange={(e) => setChairman({ ...chairman, phone: e.target.value })}
                    placeholder="+234 800..."
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Email Address</Label>
                  <Input
                    value={chairman.email}
                    onChange={(e) => setChairman({ ...chairman, email: e.target.value })}
                    placeholder="chairman@email.com"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Residential Address in Community</Label>
                  <Input
                    value={chairman.address}
                    onChange={(e) => setChairman({ ...chairman, address: e.target.value })}
                    placeholder="House number & street"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Occupation</Label>
                  <Input
                    value={chairman.occupation}
                    onChange={(e) => setChairman({ ...chairman, occupation: e.target.value })}
                    placeholder="Occupation"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">NIN Number</Label>
                  <Input
                    maxLength={11}
                    value={chairman.nin}
                    onChange={(e) => setChairman({ ...chairman, nin: e.target.value })}
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
                    placeholder="Address"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Occupation</Label>
                  <Input
                    value={secretary.occupation}
                    onChange={(e) => setSecretary({ ...secretary, occupation: e.target.value })}
                    placeholder="Occupation"
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

            {/* 3. Treasurer */}
            <div className="bg-muted/20 border border-primary/20 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-bold text-xs text-primary uppercase">3. Treasurer *</span>
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
                    placeholder="Address"
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

            {/* 4. Chief Security Officer */}
            <div className="bg-muted/20 border border-primary/20 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-bold text-xs text-primary uppercase">4. Chief Security Officer (CSO) *</span>
                <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary">Community Vigilance</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Full Name</Label>
                  <Input
                    value={securityOfficer.fullName}
                    onChange={(e) => setSecurityOfficer({ ...securityOfficer, fullName: e.target.value })}
                    placeholder="Full Legal Name"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Phone Number</Label>
                  <Input
                    value={securityOfficer.phone}
                    onChange={(e) => setSecurityOfficer({ ...securityOfficer, phone: e.target.value })}
                    placeholder="+234 800..."
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Residential Address</Label>
                  <Input
                    value={securityOfficer.address}
                    onChange={(e) => setSecurityOfficer({ ...securityOfficer, address: e.target.value })}
                    placeholder="Address in community"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* REPEATABLE SECTION: Other Executive Officers */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-primary" /> Other CDA Executive Council Members
                </h5>
                <p className="text-[11px] text-muted-foreground">
                  Add additional positions (Financial Sec, PRO, Women Leader, Youth Leader, Auditor, Legal Adviser).
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOfficer}
                className="gap-1 text-xs h-8"
              >
                <Plus className="w-3.5 h-3.5" /> Add Council Member
              </Button>
            </div>

            {otherOfficers.map((officer, idx) => (
              <div key={idx} className="bg-muted/10 border rounded-xl p-4 space-y-3 relative group">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-bold text-xs text-foreground">Officer #{idx + 1}: {officer.role || "Executive Member"}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOfficer(idx)}
                    className="text-red-500 hover:text-red-700 h-7 px-2 text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">CDA Role / Title *</Label>
                    <Input
                      value={officer.role}
                      onChange={(e) => updateOfficer(idx, "role", e.target.value)}
                      placeholder="e.g. Financial Secretary / PRO"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Full Name *</Label>
                    <Input
                      value={officer.fullName}
                      onChange={(e) => updateOfficer(idx, "fullName", e.target.value)}
                      placeholder="Full Legal Name"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Phone Number *</Label>
                    <Input
                      value={officer.phone}
                      onChange={(e) => updateOfficer(idx, "phone", e.target.value)}
                      placeholder="+234 800..."
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Residential Address</Label>
                    <Input
                      value={officer.address}
                      onChange={(e) => updateOfficer(idx, "address", e.target.value)}
                      placeholder="House address"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Occupation</Label>
                    <Input
                      value={officer.occupation}
                      onChange={(e) => updateOfficer(idx, "occupation", e.target.value)}
                      placeholder="Occupation"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">NIN Number</Label>
                    <Input
                      maxLength={11}
                      value={officer.nin}
                      onChange={(e) => updateOfficer(idx, "nin", e.target.value)}
                      placeholder="11-digit NIN"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* REPEATABLE SECTION: Streets & Zones Covered */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-primary" /> Community Streets & Zones Schedule
                </h5>
                <p className="text-[11px] text-muted-foreground">
                  List all residential streets, closes, and zones represented by this CDA.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addStreet}
                className="gap-1 text-xs h-8"
              >
                <Plus className="w-3.5 h-3.5" /> Add Street
              </Button>
            </div>

            <div className="space-y-2.5">
              {streets.map((street, idx) => (
                <div key={idx} className="bg-card border rounded-lg p-3 grid grid-cols-1 sm:grid-cols-5 gap-2.5 items-end">
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-[11px]">Street / Zone Name</Label>
                    <Input
                      value={street.streetName}
                      onChange={(e) => updateStreet(idx, "streetName", e.target.value)}
                      placeholder="e.g. Adebayo Close"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">Estimated Houses</Label>
                    <Input
                      value={street.estimatedHouses}
                      onChange={(e) => updateStreet(idx, "estimatedHouses", e.target.value)}
                      placeholder="e.g. 24"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">Zone Rep & Phone</Label>
                    <Input
                      value={street.zoneLeader}
                      onChange={(e) => updateStreet(idx, "zoneLeader", e.target.value)}
                      placeholder="Rep Name / 080..."
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStreet(idx)}
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
          declarationText="We, the elected executive council of this Community Development Association, solemnly declare that this application represents the authentic will of the residents, and that we shall collaborate with Odeda Local Government in advancing peace, security, and infrastructure development."
        />
      )}
    </FormWizard>
  );
}
