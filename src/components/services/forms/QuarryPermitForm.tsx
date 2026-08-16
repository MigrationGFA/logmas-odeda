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
import { Plus, Trash2, Mountain, HardHat, Cog } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Props {
  service: OdedaService;
  onSubmit: (formData: Record<string, any>) => void;
  isSubmitting?: boolean;
}

interface MiningMachinery {
  equipmentType: string;
  makeModel: string;
  quantity: string;
  ratedCapacity: string;
}

interface BlastingEngineer {
  fullName: string;
  licenseNumber: string;
  ministryRef: string;
  phone: string;
}

interface ExtractionPit {
  pitIdentifier: string;
  mineralOre: string;
  pitDepth: string;
  dailyTonnage: string;
}

const STEPS: FormStep[] = [
  {
    id: "operator_lease",
    title: "Mining Operator & Cadastre Lease Profile",
    shortTitle: "Operator Profile",
    description: "Enter mining corporate credentials, Federal Mining Cadastre Lease ID, and physical quarry site.",
  },
  {
    id: "eia_blasting_safety",
    title: "EIA, Blasting Schedule & Community Agreement",
    shortTitle: "Blasting & EIA",
    description: "Provide blasting frequencies, setback from host communities, dust suppression, and CDA status.",
  },
  {
    id: "machinery_pits_engineers",
    title: "Heavy Equipment, Extraction Pits & Certified Engineers",
    shortTitle: "Pits & Machinery",
    description: "Itemize heavy crushers, rotary drill rigs, quarry extraction pits, and certified blasting engineers.",
  },
  {
    id: "documents",
    title: "Supporting Documents",
    shortTitle: "Documents",
    description: "Upload Federal Mining Lease, Ministry of Mines clearance, Police explosives permit, and EIA report.",
  },
  {
    id: "review",
    title: "Review & Submit",
    shortTitle: "Review",
    description: "Review quarry operating permits and submit for Odeda LGA Natural Resources assessment.",
  },
];

const DOCUMENTS: DocumentSpec[] = [
  {
    id: "mining_cadastre_lease",
    label: "Federal Mining Cadastre Quarry Lease (QL)",
    description: "Official grant letter and cadastral map from Mining Cadastre Office (MCO), Abuja.",
    required: true,
  },
  {
    id: "police_explosives_permit",
    label: "Police Explosives & Blasting Permit",
    description: "Valid magazine storage and blasting approval from the Nigerian Police Explosives Ordinance Department.",
    required: true,
  },
  {
    id: "eia_approval",
    label: "Environmental Impact Assessment (EIA) Approval",
    description: "Federal Ministry of Environment / Ogun State Environmental Protection Agency EIA report.",
    required: true,
  },
  {
    id: "cda_agreement",
    label: "Community Development Agreement (CDA)",
    description: "Executed host community agreement endorsed by the traditional council and LGA Chairman.",
    required: true,
  },
  {
    id: "coren_mining_cert",
    label: "Resident Mining Engineer COREN / COMEG Licence",
    description: "Professional practicing licence of the resident mining engineer on site.",
    required: true,
  },
];

export default function QuarryPermitForm({ service, onSubmit, isSubmitting }: Props) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});
  const [declaration, setDeclaration] = useState(false);

  // Form Basic Info
  const [formData, setFormData] = useState({
    companyName: "",
    rcNumber: "",
    miningCadastreNo: "QL/2022/OG/089",
    managingDirector: "",
    residentEngineer: "",
    phone: "",
    email: "",
    siteLocation: "Alagbagba Quarry Ridge, Odeda LGA",
    ward: WARDS[0] || "Odeda",
    concessionAcreage: "45 Hectares",
    blastingFrequency: "Twice Weekly (Tuesdays & Thursdays, 1:00 PM - 3:00 PM)",
    setbackDistance: "1.5 Kilometers to Nearest Village",
    dustSuppression: "Continuous Water Tanker Sprinklers & Wet Crusher System",
    cdaStatus: "Active 5-Year CDA Executed with Baale and Elders in Council",
  });

  // Repeatable: Heavy Machinery
  const [machinery, setMachinery] = useState<MiningMachinery[]>([
    { equipmentType: "Mobile Rock Crusher & Screen Plant", makeModel: "Metso Nordberg LT106", quantity: "2", ratedCapacity: "250 Tons/Hour" },
    { equipmentType: "Hydraulic Crawler Excavator", makeModel: "CAT 349D Heavy Duty", quantity: "3", ratedCapacity: "3.2 m³ Bucket" },
    { equipmentType: "Down-The-Hole Rotary Drill Rig", makeModel: "Atlas Copco ROC D7", quantity: "2", ratedCapacity: "115mm Hole Diameter" },
  ]);

  // Repeatable: Certified Engineers
  const [engineers, setEngineers] = useState<BlastingEngineer[]>([
    { fullName: "Engr. Olufemi Balogun, FNSE", licenseNumber: "COMEG/MIN/1429", ministryRef: "MMSD/EXPL/2023/44", phone: "08033311122" },
    { fullName: "Mr. Yakubu Danjuma", licenseNumber: "NPD-BLAST-2024/09", ministryRef: "NPF/EOD/SW/891", phone: "08055522233" },
  ]);

  // Repeatable: Extraction Pits
  const [pits, setPits] = useState<ExtractionPit[]>([
    { pitIdentifier: "Pit Alpha (Main Granite Face)", mineralOre: "Grey Granite / Biotite Gneiss", pitDepth: "28 Metres", dailyTonnage: "1,500 Tons/Day" },
    { pitIdentifier: "Pit Beta (Upper Concession)", mineralOre: "Pink Granite Aggregate", pitDepth: "15 Metres", dailyTonnage: "800 Tons/Day" },
  ]);

  // Handlers for Machinery
  const addMachinery = () => {
    setMachinery((prev) => [
      ...prev,
      {
        equipmentType: "",
        makeModel: "",
        quantity: "1",
        ratedCapacity: "",
      },
    ]);
  };

  const removeMachinery = (idx: number) => {
    setMachinery((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateMachinery = (idx: number, field: keyof MiningMachinery, val: string) => {
    setMachinery((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });
  };

  // Handlers for Engineers
  const addEngineer = () => {
    setEngineers((prev) => [
      ...prev,
      {
        fullName: "",
        licenseNumber: "",
        ministryRef: "",
        phone: "",
      },
    ]);
  };

  const removeEngineer = (idx: number) => {
    setEngineers((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateEngineer = (idx: number, field: keyof BlastingEngineer, val: string) => {
    setEngineers((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });
  };

  // Handlers for Extraction Pits
  const addPit = () => {
    setPits((prev) => [
      ...prev,
      {
        pitIdentifier: "",
        mineralOre: "Granite Aggregate",
        pitDepth: "10 Metres",
        dailyTonnage: "500 Tons/Day",
      },
    ]);
  };

  const removePit = (idx: number) => {
    setPits((prev) => prev.filter((_, i) => i !== idx));
  };

  const updatePit = (idx: number, field: keyof ExtractionPit, val: string) => {
    setPits((prev) => {
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
        !!formData.companyName.trim() &&
        !!formData.miningCadastreNo.trim() &&
        !!formData.phone.trim() &&
        !!formData.siteLocation.trim() &&
        !!formData.ward
      );
    }
    if (index === 1) {
      return !!formData.blastingFrequency.trim() && !!formData.setbackDistance.trim();
    }
    if (index === 2) {
      return machinery.length > 0 && !!machinery[0].equipmentType.trim() && pits.length > 0;
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
      machinery: machinery.filter((m) => m.equipmentType.trim()),
      engineers: engineers.filter((eng) => eng.fullName.trim()),
      pits: pits.filter((p) => p.pitIdentifier.trim()),
      uploadedFiles,
      amount: currentFee,
      revenueHead: service.revenueHead,
      serviceName: service.name,
      applicant: formData.companyName,
    });
  };

  const reviewSections: ReviewSection[] = [
    {
      title: "Mining Operator & Cadastre Concession",
      items: [
        { label: "Mining Company Name", value: formData.companyName },
        { label: "RC / Corporate Registration", value: formData.rcNumber },
        { label: "Mining Cadastre Lease (QL) No", value: formData.miningCadastreNo },
        { label: "Managing Director", value: formData.managingDirector },
        { label: "Resident Mining Engineer", value: formData.residentEngineer },
        { label: "Contact Phone Number", value: formData.phone },
        { label: "Email Address", value: formData.email },
        { label: "Quarry Site Location", value: formData.siteLocation },
        { label: "Ward in Odeda LGA", value: formData.ward },
        { label: "Total Concession Size", value: formData.concessionAcreage },
      ],
    },
    {
      title: "Blasting Protocol, EIA & Host Community Agreement",
      items: [
        { label: "Designated Blasting Schedule", value: formData.blastingFrequency },
        { label: "Community Buffer Distance", value: formData.setbackDistance },
        { label: "Environmental Dust Control", value: formData.dustSuppression },
        { label: "Community Development Agreement", value: formData.cdaStatus },
      ],
    },
  ];

  const reviewRepeatableSections: ReviewRepeatableSection[] = [
    {
      title: "Heavy Extraction Machinery & Rock Crushers",
      countLabel: "Equipment",
      items: machinery
        .filter((m) => m.equipmentType.trim())
        .map((m) => ({
          "Equipment Type": m.equipmentType,
          "Make & Model": m.makeModel,
          Quantity: `${m.quantity} Units`,
          "Rated Capacity": m.ratedCapacity,
        })),
    },
    {
      title: "Certified Blasting Engineers & Explosives Officers",
      countLabel: "Engineers",
      items: engineers
        .filter((e) => e.fullName.trim())
        .map((e) => ({
          "Engineer Name": e.fullName,
          "COMEG / COREN Reg No": e.licenseNumber,
          "Mines Ministry Ref": e.ministryRef,
          "Phone Number": e.phone,
        })),
    },
    {
      title: "Quarry Extraction Pits & Geological Benches",
      countLabel: "Extraction Pits",
      items: pits
        .filter((p) => p.pitIdentifier.trim())
        .map((p) => ({
          "Pit Identifier": p.pitIdentifier,
          "Mineral Rock Type": p.mineralOre,
          "Depth of Pit": p.pitDepth,
          "Daily Output": p.dailyTonnage,
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
      {/* STEP 1: Operator & Concession */}
      {currentStepIndex === 0 && (
        <div className="space-y-4">
          <div className="border-b pb-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary">
              Mining Operator & Cadastre Lease Profile
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Enter Federal Mining Cadastre Lease credentials, corporate directors, and physical quarry site in Odeda LGA.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="companyName">Mining / Quarry Enterprise Name *</Label>
              <Input
                id="companyName"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="e.g. Odeda Granite Quarries & Mining Nigeria Limited"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="miningCadastreNo">Mining Cadastre Lease (QL) Number *</Label>
              <Input
                id="miningCadastreNo"
                required
                value={formData.miningCadastreNo}
                onChange={(e) => setFormData({ ...formData, miningCadastreNo: e.target.value })}
                placeholder="e.g. QL-2022-OG-089"
                className="font-mono uppercase font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="rcNumber">CAC Registration (RC Number)</Label>
              <Input
                id="rcNumber"
                value={formData.rcNumber}
                onChange={(e) => setFormData({ ...formData, rcNumber: e.target.value })}
                placeholder="RC-554433"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="managingDirector">Managing Director / Concession Holder *</Label>
              <Input
                id="managingDirector"
                required
                value={formData.managingDirector}
                onChange={(e) => setFormData({ ...formData, managingDirector: e.target.value })}
                placeholder="e.g. Alhaji Mustapha Danladi"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="residentEngineer">Resident Mining Engineer (COMEG / COREN)</Label>
              <Input
                id="residentEngineer"
                value={formData.residentEngineer}
                onChange={(e) => setFormData({ ...formData, residentEngineer: e.target.value })}
                placeholder="e.g. Engr. O. Balogun, COMEG No: 1429"
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
                placeholder="operations@quarry.com"
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

            <div className="space-y-1.5">
              <Label htmlFor="concessionAcreage">Concession Area Size (Hectares)</Label>
              <Input
                id="concessionAcreage"
                value={formData.concessionAcreage}
                onChange={(e) => setFormData({ ...formData, concessionAcreage: e.target.value })}
                placeholder="e.g. 40 Hectares"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="siteLocation">Quarry Site Physical GPS / Route Description *</Label>
              <Input
                id="siteLocation"
                required
                value={formData.siteLocation}
                onChange={(e) => setFormData({ ...formData, siteLocation: e.target.value })}
                placeholder="Ridge Name, Village Corridor, Odeda LGA"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Blasting, EIA & CDA */}
      {currentStepIndex === 1 && (
        <div className="space-y-4">
          <div className="border-b pb-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary">
              EIA, Blasting Schedule & Community Agreement
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ensure strict environmental safety, community development trust adherence, and explosive ordinance compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="blastingFrequency">Authorized Blasting Schedule & Timing *</Label>
              <Input
                id="blastingFrequency"
                required
                value={formData.blastingFrequency}
                onChange={(e) => setFormData({ ...formData, blastingFrequency: e.target.value })}
                placeholder="e.g. Tuesdays & Thursdays, 1:00 PM - 3:00 PM Only"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="setbackDistance">Distance to Nearest Human Settlement *</Label>
              <Select value={formData.setbackDistance} onValueChange={(val) => setFormData({ ...formData, setbackDistance: val })}>
                <SelectTrigger id="setbackDistance">
                  <SelectValue placeholder="Select Setback" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Over 2.0 Kilometers">Over 2.0 Kilometers (Highly Safe)</SelectItem>
                  <SelectItem value="1.0 to 2.0 Kilometers">1.0 to 2.0 Kilometers (Standard)</SelectItem>
                  <SelectItem value="500m to 1.0 Kilometer (Special Blast Mats Required)">500m - 1.0 km (Blast Mats Required)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dustSuppression">Dust & Vibration Suppression System</Label>
              <Input
                id="dustSuppression"
                value={formData.dustSuppression}
                onChange={(e) => setFormData({ ...formData, dustSuppression: e.target.value })}
                placeholder="e.g. Water bowsers on haul roads, wet crushing screens"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="cdaStatus">Community Development Agreement (CDA) Status</Label>
              <Input
                id="cdaStatus"
                value={formData.cdaStatus}
                onChange={(e) => setFormData({ ...formData, cdaStatus: e.target.value })}
                placeholder="e.g. 5-Year CDA Signed with Baale and Elders in Council"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Machinery, Pits & Engineers (REPEATABLE UI) */}
      {currentStepIndex === 2 && (
        <div className="space-y-6">
          <div className="border-b pb-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary">
              Heavy Equipment, Extraction Pits & Certified Engineers
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Provide complete inventory of heavy mining machinery, extraction pits, and licensed blasting engineers.
            </p>
          </div>

          {/* REPEATABLE SECTION: Machinery */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Cog className="w-4 h-4 text-primary" /> Heavy Mining Machinery & Rock Crushers *
                </h5>
                <p className="text-[11px] text-muted-foreground">
                  Record all primary/secondary rock crushers, crawler excavators, and drilling rigs.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMachinery}
                className="gap-1 text-xs h-8"
              >
                <Plus className="w-3.5 h-3.5" /> Add Equipment
              </Button>
            </div>

            {machinery.map((m, idx) => (
              <div key={idx} className="bg-muted/10 border rounded-xl p-4 space-y-3 relative group">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-bold text-xs text-foreground">Machinery #{idx + 1}: {m.equipmentType} ({m.makeModel})</span>
                  {machinery.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMachinery(idx)}
                      className="text-red-500 hover:text-red-700 h-7 px-2 text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-xs">Equipment Type *</Label>
                    <Input
                      value={m.equipmentType}
                      onChange={(e) => updateMachinery(idx, "equipmentType", e.target.value)}
                      placeholder="e.g. Jaw Crusher / Hydraulic Excavator"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Make & Model</Label>
                    <Input
                      value={m.makeModel}
                      onChange={(e) => updateMachinery(idx, "makeModel", e.target.value)}
                      placeholder="e.g. CAT 349D"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Quantity</Label>
                    <Input
                      type="number"
                      value={m.quantity}
                      onChange={(e) => updateMachinery(idx, "quantity", e.target.value)}
                      placeholder="1"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-4">
                    <Label className="text-xs">Rated Output Capacity</Label>
                    <Input
                      value={m.ratedCapacity}
                      onChange={(e) => updateMachinery(idx, "ratedCapacity", e.target.value)}
                      placeholder="e.g. 200 Tons/Hour / 3.0 m³ Bucket"
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* REPEATABLE SECTION: Certified Engineers */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <HardHat className="w-4 h-4 text-primary" /> Certified Blasting Engineers & Explosives Officers
                </h5>
                <p className="text-[11px] text-muted-foreground">
                  Record COMEG/COREN registered mining engineers and licensed explosives handlers.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addEngineer}
                className="gap-1 text-xs h-8"
              >
                <Plus className="w-3.5 h-3.5" /> Add Engineer
              </Button>
            </div>

            <div className="space-y-2.5">
              {engineers.map((eng, idx) => (
                <div key={idx} className="bg-card border rounded-lg p-3 grid grid-cols-1 sm:grid-cols-5 gap-2.5 items-end">
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-[11px]">Engineer Name</Label>
                    <Input
                      value={eng.fullName}
                      onChange={(e) => updateEngineer(idx, "fullName", e.target.value)}
                      placeholder="Full Name"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">COMEG / Licence No</Label>
                    <Input
                      value={eng.licenseNumber}
                      onChange={(e) => updateEngineer(idx, "licenseNumber", e.target.value)}
                      placeholder="COMEG No"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">Phone / Ministry Ref</Label>
                    <Input
                      value={eng.phone}
                      onChange={(e) => updateEngineer(idx, "phone", e.target.value)}
                      placeholder="080... / MMSD Ref"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEngineer(idx)}
                      className="text-red-500 hover:text-red-700 h-8 px-2 text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* REPEATABLE SECTION: Extraction Pits */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Mountain className="w-4 h-4 text-primary" /> Active Extraction Pits & Geological Faces
                </h5>
                <p className="text-[11px] text-muted-foreground">
                  Record pit depths, rock formations, and estimated daily tonnage.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addPit}
                className="gap-1 text-xs h-8"
              >
                <Plus className="w-3.5 h-3.5" /> Add Extraction Pit
              </Button>
            </div>

            <div className="space-y-2.5">
              {pits.map((p, idx) => (
                <div key={idx} className="bg-card border rounded-lg p-3 grid grid-cols-1 sm:grid-cols-5 gap-2.5 items-end">
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-[11px]">Pit Face Identifier</Label>
                    <Input
                      value={p.pitIdentifier}
                      onChange={(e) => updatePit(idx, "pitIdentifier", e.target.value)}
                      placeholder="e.g. Pit Alpha (North Face)"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">Mineral Ore</Label>
                    <Input
                      value={p.mineralOre}
                      onChange={(e) => updatePit(idx, "mineralOre", e.target.value)}
                      placeholder="Granite Aggregate"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">Daily Output</Label>
                    <Input
                      value={p.dailyTonnage}
                      onChange={(e) => updatePit(idx, "dailyTonnage", e.target.value)}
                      placeholder="e.g. 1000 Tons/Day"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removePit(idx)}
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
          declarationText="I solemnly declare that the Federal Mining Cadastre Lease particulars, certified blasting engineer credentials, heavy machinery inventory, and environmental safeguards comply strictly with Odeda Local Government Quarry Bye-Laws and the Nigerian Minerals and Mining Act."
        />
      )}
    </FormWizard>
  );
}
