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
import { Plus, Trash2, Building, ShieldCheck, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Props {
  service: OdedaService;
  onSubmit: (formData: Record<string, any>) => void;
  isSubmitting?: boolean;
}

interface FacilityUnit {
  unitName: string;
  unitType: string;
  restroomsCount: string;
  wasteBinsCount: string;
}

interface SafetyOfficer {
  fullName: string;
  role: string;
  phone: string;
  certNumber: string;
}

interface WasteStream {
  wasteType: string;
  estimatedVolume: string;
  disposalMethod: string;
}

const STEPS: FormStep[] = [
  {
    id: "facility_profile",
    title: "Facility & Business Profile",
    shortTitle: "Facility Profile",
    description: "Enter commercial/industrial facility details and physical location within Odeda LGA.",
  },
  {
    id: "drainage_waste",
    title: "Water Supply, Drainage & Waste Management",
    shortTitle: "Sanitation Systems",
    description: "Provide details on water sources, drainage conduits, and accredited waste evacuation contractors.",
  },
  {
    id: "units_officers_waste",
    title: "Facility Units, Safety Officers & Waste Streams",
    shortTitle: "Units & Officers",
    description: "Itemize facility operational units, designated sanitation officers, and hazardous/solid waste streams.",
  },
  {
    id: "documents",
    title: "Supporting Documents",
    shortTitle: "Documents",
    description: "Upload facility sanitation layout, fumigation certificate, and accredited waste contract.",
  },
  {
    id: "review",
    title: "Review & Submit",
    shortTitle: "Review",
    description: "Review environmental hygiene specifications and submit for statutory LGA inspection.",
  },
];

const DOCUMENTS: DocumentSpec[] = [
  {
    id: "sanitation_layout",
    label: "Facility Sanitation Layout Plan",
    description: "Architectural/floor plan showing location of restrooms, drainage lines, and waste disposal bins.",
    required: true,
  },
  {
    id: "fumigation_cert",
    label: "Current Pest Control & Fumigation Certificate",
    description: "Official certificate from an accredited environmental pest control company (within last 6 months).",
    required: true,
  },
  {
    id: "waste_contract_agreement",
    label: "Accredited PSP / Waste Evacuation Agreement",
    description: "Service contract with an authorized Ogun State / Odeda LGA waste management contractor.",
    required: true,
  },
  {
    id: "facility_restroom_photos",
    label: "Restrooms & Refuse Storage Photographs",
    description: "Clear photographic evidence of sanitary facilities, handwashing stations, and bin storage.",
    required: true,
    acceptedFormats: ".jpg,.jpeg,.png",
  },
  {
    id: "cac_cert",
    label: "CAC Business Registration Certificate",
    description: "Corporate Affairs Commission certificate for corporate and commercial entities.",
    required: false,
  },
];

export default function EnvironmentalSanitationForm({ service, onSubmit, isSubmitting }: Props) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});
  const [declaration, setDeclaration] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    businessName: "",
    facilityCategory: "Hospitality / Hotel / Event Centre",
    contactPerson: "",
    phone: "",
    email: "",
    physicalAddress: "",
    ward: WARDS[0] || "Odeda",
    cacNumber: "",
    operatingHours: "8:00 AM - 10:00 PM (Daily)",
    totalDailyStaff: "25",
    primaryWaterSource: "Treated Motorized Borehole & Overhead Storage",
    drainageType: "Concrete Covered Drainage Gutter to Central Soakaway",
    wasteContractor: "Ogun State Waste Management Authority (OGWAMA) / Accredited PSP",
    evacuationFrequency: "Twice Weekly",
    fumigationFrequency: "Quarterly (Every 3 Months)",
  });

  // Repeatable: Facility Units
  const [units, setUnits] = useState<FacilityUnit[]>([
    { unitName: "Main Customer Area & Hall", unitType: "Public Dining & Lounges", restroomsCount: "4", wasteBinsCount: "6" },
    { unitName: "Commercial Kitchen & Pantry", unitType: "Food Preparation & Cold Storage", restroomsCount: "2", wasteBinsCount: "4" },
    { unitName: "Rear Waste Yard & Generator Area", unitType: "Refuse Storage & Mechanical", restroomsCount: "1", wasteBinsCount: "3" },
  ]);

  // Repeatable: Health & Safety Officers
  const [safetyOfficers, setSafetyOfficers] = useState<SafetyOfficer[]>([
    { fullName: "", role: "Environmental Health & Safety Manager", phone: "", certNumber: "EHO-2024-089" },
  ]);

  // Repeatable: Waste Streams
  const [wasteStreams, setWasteStreams] = useState<WasteStream[]>([
    { wasteType: "Organic Food Waste & Biodegradables", estimatedVolume: "150 kg/week", disposalMethod: "Segregated PSP Municipal Evacuation" },
    { wasteType: "Plastics, Glass & Cans (Recyclables)", estimatedVolume: "80 kg/week", disposalMethod: "Recycling Vendor Collection" },
  ]);

  // Handlers for Units
  const addUnit = () => {
    setUnits((prev) => [
      ...prev,
      {
        unitName: "",
        unitType: "Operational Unit",
        restroomsCount: "1",
        wasteBinsCount: "2",
      },
    ]);
  };

  const removeUnit = (idx: number) => {
    setUnits((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateUnit = (idx: number, field: keyof FacilityUnit, val: string) => {
    setUnits((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });
  };

  // Handlers for Safety Officers
  const addSafetyOfficer = () => {
    setSafetyOfficers((prev) => [
      ...prev,
      {
        fullName: "",
        role: "Designated Sanitation Officer",
        phone: "",
        certNumber: "",
      },
    ]);
  };

  const removeSafetyOfficer = (idx: number) => {
    setSafetyOfficers((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateSafetyOfficer = (idx: number, field: keyof SafetyOfficer, val: string) => {
    setSafetyOfficers((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });
  };

  // Handlers for Waste Streams
  const addWasteStream = () => {
    setWasteStreams((prev) => [
      ...prev,
      {
        wasteType: "",
        estimatedVolume: "50 kg/week",
        disposalMethod: "PSP Evacuation",
      },
    ]);
  };

  const removeWasteStream = (idx: number) => {
    setWasteStreams((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateWasteStream = (idx: number, field: keyof WasteStream, val: string) => {
    setWasteStreams((prev) => {
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
        !!formData.businessName.trim() &&
        !!formData.contactPerson.trim() &&
        !!formData.phone.trim() &&
        !!formData.physicalAddress.trim() &&
        !!formData.ward
      );
    }
    if (index === 1) {
      return !!formData.primaryWaterSource.trim() && !!formData.drainageType.trim();
    }
    if (index === 2) {
      return units.length > 0 && !!units[0].unitName.trim();
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
      units: units.filter((u) => u.unitName.trim()),
      safetyOfficers: safetyOfficers.filter((o) => o.fullName.trim()),
      wasteStreams: wasteStreams.filter((w) => w.wasteType.trim()),
      uploadedFiles,
      amount: currentFee,
      revenueHead: service.revenueHead,
      serviceName: service.name,
      applicant: formData.businessName,
    });
  };

  const reviewSections: ReviewSection[] = [
    {
      title: "Commercial Facility Profile",
      items: [
        { label: "Business / Facility Name", value: formData.businessName },
        { label: "Facility Classification", value: formData.facilityCategory },
        { label: "Contact Representative", value: formData.contactPerson },
        { label: "Phone Number", value: formData.phone },
        { label: "Email Address", value: formData.email },
        { label: "Physical Facility Address", value: formData.physicalAddress },
        { label: "Ward in Odeda LGA", value: formData.ward },
        { label: "CAC Reg Number", value: formData.cacNumber },
        { label: "Operating Hours", value: formData.operatingHours },
        { label: "Daily Staff & Occupants", value: `${formData.totalDailyStaff} persons` },
      ],
    },
    {
      title: "Drainage, Water & Evacuation Protocols",
      items: [
        { label: "Water Supply System", value: formData.primaryWaterSource },
        { label: "Drainage & Sewerage", value: formData.drainageType },
        { label: "Accredited PSP Waste Contractor", value: formData.wasteContractor },
        { label: "Waste Evacuation Frequency", value: formData.evacuationFrequency },
        { label: "Mandatory Fumigation Schedule", value: formData.fumigationFrequency },
      ],
    },
  ];

  const reviewRepeatableSections: ReviewRepeatableSection[] = [
    {
      title: "Facility Operational Units & Restrooms",
      countLabel: "Facility Units",
      items: units
        .filter((u) => u.unitName.trim())
        .map((u) => ({
          "Unit Name": u.unitName,
          "Unit Function": u.unitType,
          "Restrooms Count": `${u.restroomsCount} Units`,
          "Waste Bins Installed": `${u.wasteBinsCount} Bins`,
        })),
    },
    {
      title: "Designated Health & Safety Officers",
      countLabel: "Safety Personnel",
      items: safetyOfficers
        .filter((o) => o.fullName.trim())
        .map((o) => ({
          "Officer Name": o.fullName,
          "Designation / Role": o.role,
          "Phone Number": o.phone,
          "Certification / License": o.certNumber,
        })),
    },
    {
      title: "Waste Stream Classification & Disposal",
      countLabel: "Waste Streams",
      items: wasteStreams
        .filter((w) => w.wasteType.trim())
        .map((w) => ({
          "Waste Stream Type": w.wasteType,
          "Estimated Volume": w.estimatedVolume,
          "Disposal Protocol": w.disposalMethod,
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
      {/* STEP 1: Facility Profile */}
      {currentStepIndex === 0 && (
        <div className="space-y-4">
          <div className="border-b pb-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary">
              Commercial / Industrial Facility Profile
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Enter facility location and operational parameters for Odeda LGA Environmental Health Officers inspection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="businessName">Facility / Business Trading Name *</Label>
              <Input
                id="businessName"
                required
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                placeholder="e.g. Obantoko Royal Grand Suites & Events Centre"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="facilityCategory">Facility Classification *</Label>
              <Select value={formData.facilityCategory} onValueChange={(val) => setFormData({ ...formData, facilityCategory: val })}>
                <SelectTrigger id="facilityCategory">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hospitality / Hotel / Event Centre">Hospitality / Hotel / Event Centre</SelectItem>
                  <SelectItem value="Food Processing / Restaurant / Bakery">Food Processing / Restaurant / Bakery</SelectItem>
                  <SelectItem value="Healthcare Facility / Private Clinic / Lab">Healthcare Facility / Private Clinic / Lab</SelectItem>
                  <SelectItem value="Educational Institution / School">Educational Institution / School</SelectItem>
                  <SelectItem value="Commercial Shopping Plaza / Supermarket">Commercial Shopping Plaza / Supermarket</SelectItem>
                  <SelectItem value="Industrial Factory / Manufacturing Plant">Industrial Factory / Manufacturing Plant</SelectItem>
                  <SelectItem value="Petrol Station / Auto Workshop">Petrol Station / Auto Workshop</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contactPerson">Designated Manager / Contact Person *</Label>
              <Input
                id="contactPerson"
                required
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="e.g. Mr. Olawale Davies"
              />
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
                placeholder="info@facility.com"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cacNumber">CAC Registration (RC/BN Number)</Label>
              <Input
                id="cacNumber"
                value={formData.cacNumber}
                onChange={(e) => setFormData({ ...formData, cacNumber: e.target.value })}
                placeholder="RC-123456"
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
              <Label htmlFor="physicalAddress">Facility Physical Premises Address *</Label>
              <Input
                id="physicalAddress"
                required
                value={formData.physicalAddress}
                onChange={(e) => setFormData({ ...formData, physicalAddress: e.target.value })}
                placeholder="Plot/Building No, Street name, Village/Town in Odeda LGA"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="operatingHours">Daily Operating Hours</Label>
              <Input
                id="operatingHours"
                value={formData.operatingHours}
                onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
                placeholder="e.g. 24 Hours / 8am - 8pm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="totalDailyStaff">Estimated Daily Staff & Visitors Count</Label>
              <Input
                id="totalDailyStaff"
                type="number"
                value={formData.totalDailyStaff}
                onChange={(e) => setFormData({ ...formData, totalDailyStaff: e.target.value })}
                placeholder="e.g. 50"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Sanitation Systems */}
      {currentStepIndex === 1 && (
        <div className="space-y-4">
          <div className="border-b pb-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary">
              Water Supply, Drainage & Waste Management
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Specify plumbing standards, septic/drainage infrastructure, and accredited waste disposal channels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="primaryWaterSource">Potable Water Supply *</Label>
              <Select value={formData.primaryWaterSource} onValueChange={(val) => setFormData({ ...formData, primaryWaterSource: val })}>
                <SelectTrigger id="primaryWaterSource">
                  <SelectValue placeholder="Select Water Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Treated Motorized Borehole & Overhead Storage">Treated Motorized Borehole & Overhead Storage</SelectItem>
                  <SelectItem value="Public Water Corporation Main">Public Water Corporation Main</SelectItem>
                  <SelectItem value="Certified Commercial Water Tanker Supply">Certified Commercial Water Tanker Supply</SelectItem>
                  <SelectItem value="Deep Protected Hand-Pump Well">Deep Protected Hand-Pump Well</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="drainageType">Drainage & Liquid Waste System *</Label>
              <Select value={formData.drainageType} onValueChange={(val) => setFormData({ ...formData, drainageType: val })}>
                <SelectTrigger id="drainageType">
                  <SelectValue placeholder="Select Drainage System" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Concrete Covered Drainage Gutter to Central Soakaway">Concrete Covered Gutter to Soakaway</SelectItem>
                  <SelectItem value="Underground Septic Tank & Bio-Digester">Underground Septic Tank & Bio-Digester</SelectItem>
                  <SelectItem value="Central Sewage Line Connection">Central Sewage Line Connection</SelectItem>
                  <SelectItem value="Effluent Treatment Plant (ETP)">Effluent Treatment Plant (ETP)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="wasteContractor">Accredited PSP / Refuse Evacuation Contractor *</Label>
              <Input
                id="wasteContractor"
                required
                value={formData.wasteContractor}
                onChange={(e) => setFormData({ ...formData, wasteContractor: e.target.value })}
                placeholder="e.g. OGWAMA / CleanCity Waste Management Ltd"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="evacuationFrequency">Refuse Evacuation Schedule</Label>
              <Select value={formData.evacuationFrequency} onValueChange={(val) => setFormData({ ...formData, evacuationFrequency: val })}>
                <SelectTrigger id="evacuationFrequency">
                  <SelectValue placeholder="Select Frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily Evacuation">Daily Evacuation</SelectItem>
                  <SelectItem value="Twice Weekly">Twice Weekly</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Bi-Weekly">Bi-Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="fumigationFrequency">Periodic Fumigation & Pest Control Routine</Label>
              <Select value={formData.fumigationFrequency} onValueChange={(val) => setFormData({ ...formData, fumigationFrequency: val })}>
                <SelectTrigger id="fumigationFrequency">
                  <SelectValue placeholder="Select Fumigation Schedule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monthly (High Risk Food/Hospitality)">Monthly (High Risk)</SelectItem>
                  <SelectItem value="Bi-Monthly (Every 2 Months)">Bi-Monthly</SelectItem>
                  <SelectItem value="Quarterly (Every 3 Months)">Quarterly (Standard)</SelectItem>
                  <SelectItem value="Bi-Annually (Every 6 Months)">Bi-Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Units, Officers & Waste (REPEATABLE UI) */}
      {currentStepIndex === 2 && (
        <div className="space-y-6">
          <div className="border-b pb-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary">
              Facility Operational Units, Safety Officers & Waste Streams
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Provide complete itemization of internal facility sections, designated sanitation officers, and waste classifications.
            </p>
          </div>

          {/* REPEATABLE SECTION: Facility Units */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-primary" /> Facility Units & Sanitation Fixtures *
                </h5>
                <p className="text-[11px] text-muted-foreground">
                  Record all functional sections (e.g. Guest Rooms, Dining Halls, Restrooms, Production Floors).
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addUnit}
                className="gap-1 text-xs h-8"
              >
                <Plus className="w-3.5 h-3.5" /> Add Facility Unit
              </Button>
            </div>

            {units.map((unit, idx) => (
              <div key={idx} className="bg-muted/10 border rounded-xl p-4 space-y-3 relative group">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-bold text-xs text-foreground">Unit #{idx + 1}: {unit.unitName || "New Unit"}</span>
                  {units.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeUnit(idx)}
                      className="text-red-500 hover:text-red-700 h-7 px-2 text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-xs">Unit Name / Department *</Label>
                    <Input
                      value={unit.unitName}
                      onChange={(e) => updateUnit(idx, "unitName", e.target.value)}
                      placeholder="e.g. Main Kitchen / Public Restroom Wing"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Unit Function / Description</Label>
                    <Input
                      value={unit.unitType}
                      onChange={(e) => updateUnit(idx, "unitType", e.target.value)}
                      placeholder="e.g. Food Prep & Service"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Restroom Fixtures</Label>
                    <Input
                      type="number"
                      value={unit.restroomsCount}
                      onChange={(e) => updateUnit(idx, "restroomsCount", e.target.value)}
                      placeholder="e.g. 4"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Waste Bins Stationed</Label>
                    <Input
                      type="number"
                      value={unit.wasteBinsCount}
                      onChange={(e) => updateUnit(idx, "wasteBinsCount", e.target.value)}
                      placeholder="e.g. 6"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* REPEATABLE SECTION: Safety Officers */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-primary" /> Designated Environmental Health & Safety Officers
                </h5>
                <p className="text-[11px] text-muted-foreground">
                  Record trained staff responsible for daily hygiene, PPE compliance, and chemical handling.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSafetyOfficer}
                className="gap-1 text-xs h-8"
              >
                <Plus className="w-3.5 h-3.5" /> Add Officer
              </Button>
            </div>

            <div className="space-y-2.5">
              {safetyOfficers.map((officer, idx) => (
                <div key={idx} className="bg-card border rounded-lg p-3 grid grid-cols-1 sm:grid-cols-5 gap-2.5 items-end">
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-[11px]">Officer Full Name</Label>
                    <Input
                      value={officer.fullName}
                      onChange={(e) => updateSafetyOfficer(idx, "fullName", e.target.value)}
                      placeholder="e.g. Mrs. Funke Adeleke"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">Role / Designation</Label>
                    <Input
                      value={officer.role}
                      onChange={(e) => updateSafetyOfficer(idx, "role", e.target.value)}
                      placeholder="Hygiene Officer"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">Phone / Cert No</Label>
                    <Input
                      value={officer.phone}
                      onChange={(e) => updateSafetyOfficer(idx, "phone", e.target.value)}
                      placeholder="080... / Reg No"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSafetyOfficer(idx)}
                      className="text-red-500 hover:text-red-700 h-8 px-2 text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* REPEATABLE SECTION: Waste Streams */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Trash className="w-4 h-4 text-primary" /> Hazardous & Solid Waste Stream Classification
                </h5>
                <p className="text-[11px] text-muted-foreground">
                  Record all segregated waste streams produced on premises.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addWasteStream}
                className="gap-1 text-xs h-8"
              >
                <Plus className="w-3.5 h-3.5" /> Add Waste Stream
              </Button>
            </div>

            <div className="space-y-2.5">
              {wasteStreams.map((ws, idx) => (
                <div key={idx} className="bg-card border rounded-lg p-3 grid grid-cols-1 sm:grid-cols-5 gap-2.5 items-end">
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-[11px]">Waste Stream / Material Type</Label>
                    <Input
                      value={ws.wasteType}
                      onChange={(e) => updateWasteStream(idx, "wasteType", e.target.value)}
                      placeholder="e.g. Organic, Medical, Scraps"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">Estimated Volume</Label>
                    <Input
                      value={ws.estimatedVolume}
                      onChange={(e) => updateWasteStream(idx, "estimatedVolume", e.target.value)}
                      placeholder="e.g. 100 kg/week"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">Disposal Protocol</Label>
                    <Input
                      value={ws.disposalMethod}
                      onChange={(e) => updateWasteStream(idx, "disposalMethod", e.target.value)}
                      placeholder="e.g. PSP Evacuation"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeWasteStream(idx)}
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
          declarationText="I solemnly declare that the environmental sanitation facilities, drainage systems, pest control schedules, and waste evacuation contracts described herein comply strictly with the Public Health Laws and Environmental Sanitation Bye-Laws of Odeda Local Government, Ogun State."
        />
      )}
    </FormWizard>
  );
}
