"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WARDS } from "@/lib/mock-data";
import {
  OdedaService,
  getConfiguredFeeForService,
} from "@/config/odedaServices";
import { FormWizard, FormStep } from "./FormWizard";
import { DocumentUploadStep, DocumentSpec } from "./DocumentUploadStep";
import {
  ReviewSubmitStep,
  ReviewSection,
  ReviewRepeatableSection,
} from "./ReviewSubmitStep";
import { Plus, Trash2, Tv, ShieldCheck, Radio } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ApplicantSnapshot } from "../ApplicantSelectionStep";

interface Props {
  service: OdedaService;
  onSubmit: (formData: Record<string, any>) => void;
  isSubmitting?: boolean;
  initialApplicant?: ApplicantSnapshot;
}

interface DisplayScreen {
  screenType: string;
  sizeInches: string;
  hallPosition: string;
}

interface BroadcastDecoder {
  platform: string;
  decoderNumber: string;
  subscriptionPlan: string;
}

interface HallStaff {
  fullName: string;
  role: string;
  phone: string;
}

const STEPS: FormStep[] = [
  {
    id: "centre_profile",
    title: "Viewing Centre & Operator Profile",
    shortTitle: "Centre Profile",
    description:
      "Enter viewing hall enterprise name, operator identity, and physical location in Odeda LGA.",
  },
  {
    id: "hall_safety",
    title: "Hall Specifications & Fire Safety",
    shortTitle: "Hall Specs & Safety",
    description:
      "Provide seating capacity, ventilation, generator backup, and emergency exit standards.",
  },
  {
    id: "screens_decoders_staff",
    title: "Screens, Commercial Decoders & Safety Staff",
    shortTitle: "Screens & Decoders",
    description:
      "Itemize display monitors, commercial sports broadcast subscriptions, and crowd security staff.",
  },
  {
    id: "documents",
    title: "Supporting Documents",
    shortTitle: "Documents",
    description:
      "Upload hall layout sketch, commercial DStv receipt, fire safety certificate, and ID card.",
  },
  {
    id: "review",
    title: "Review & Submit",
    shortTitle: "Review",
    description:
      "Review viewing centre licensing terms and submit for statutory LGA authorization.",
  },
];

const DOCUMENTS: DocumentSpec[] = [
  {
    id: "hall_layout",
    label: "Hall Seating & Exit Layout Plan",
    description:
      "Floor diagram indicating viewing bench arrangement, screen mounts, and exit aisles.",
    required: true,
  },
  {
    id: "commercial_broadcast_receipt",
    label: "Commercial Broadcast Subscription Receipt",
    description:
      "Proof of active commercial public viewing subscription (e.g. SuperSport/DStv Commercial).",
    required: true,
  },
  {
    id: "fire_safety_cert",
    label: "Fire Prevention & Extinguisher Clearance",
    description:
      "Inspection pass or receipt of certified fire extinguisher servicing.",
    required: true,
  },
  {
    id: "operator_id",
    label: "Centre Operator Means of ID",
    description: "NIN Slip, Voter's Card, or Driver's Licence.",
    required: true,
  },
  {
    id: "cac_cert",
    label: "CAC Business Name Certificate",
    description:
      "Business name registration document (if enterprise is registered).",
    required: false,
  },
];

export default function ViewingCentreLicenceForm({
  service,
  onSubmit,
  isSubmitting,
  initialApplicant,
}: Props) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>(
    {},
  );
  const [declaration, setDeclaration] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    centreName: "",
    operatorName: "",
    phone: "",
    email: "",
    physicalAddress: "",
    ward: WARDS[0] || "Odeda",
    cacNumber: "",
    seatingCapacity: "120 Seats",
    standardFee: "₦200 per Match",
    ventilationType: "Heavy Duty Industrial Wall Fans & Cross Ventilation",
    powerBackup: "15kVA Soundproof Diesel Generator & Inverter",
    fireExtinguishers: "2 x 6kg Dry Chemical Powder Extinguishers",
    exitDoors: "2 Wide Double-Leaf Exit Doors",
    juvenileSafety:
      "Strict ban on schoolchildren in uniform during school hours",
  });

  // Repeatable: Display Screens
  const [screens, setScreens] = useState<DisplayScreen[]>([
    {
      screenType: "4K UHD Commercial LED Screen",
      sizeInches: "75 Inches",
      hallPosition: "Main Front Stage Left",
    },
    {
      screenType: "4K UHD Commercial LED Screen",
      sizeInches: "75 Inches",
      hallPosition: "Main Front Stage Right",
    },
    {
      screenType: "HD Overhead Digital Projector",
      sizeInches: "120-Inch Screen",
      hallPosition: "Central Overhead Display",
    },
  ]);

  // Repeatable: Broadcast Decoders
  const [decoders, setDecoders] = useState<BroadcastDecoder[]>([
    {
      platform: "DStv Commercial (SuperSport Premier League)",
      decoderNumber: "1049281729",
      subscriptionPlan: "Commercial Premium Sports Package",
    },
    {
      platform: "StarTimes Sports Arena",
      decoderNumber: "0293847192",
      subscriptionPlan: "Commercial Bundesliga & Serie A Package",
    },
  ]);

  // Repeatable: Staff
  const [staff, setStaff] = useState<HallStaff[]>([
    {
      fullName: "Olamide Soyinka",
      role: "Hall Manager / Cashier",
      phone: "08033344499",
    },
    {
      fullName: "Ibrahim Adeyemi",
      role: "Crowd Control & Security Guard",
      phone: "08055566677",
    },
  ]);

  // Handlers for Screens
  const addScreen = () => {
    setScreens((prev) => [
      ...prev,
      {
        screenType: "Smart LED TV",
        sizeInches: "65 Inches",
        hallPosition: "Rear Hall Wing",
      },
    ]);
  };

  const removeScreen = (idx: number) => {
    setScreens((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateScreen = (
    idx: number,
    field: keyof DisplayScreen,
    val: string,
  ) => {
    setScreens((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });
  };

  // Handlers for Decoders
  const addDecoder = () => {
    setDecoders((prev) => [
      ...prev,
      {
        platform: "DStv Commercial",
        decoderNumber: "",
        subscriptionPlan: "Commercial HD",
      },
    ]);
  };

  const removeDecoder = (idx: number) => {
    setDecoders((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateDecoder = (
    idx: number,
    field: keyof BroadcastDecoder,
    val: string,
  ) => {
    setDecoders((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });
  };

  // Handlers for Staff
  const addStaff = () => {
    setStaff((prev) => [
      ...prev,
      {
        fullName: "",
        role: "Security / Attendant",
        phone: "",
      },
    ]);
  };

  const removeStaff = (idx: number) => {
    setStaff((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateStaff = (idx: number, field: keyof HallStaff, val: string) => {
    setStaff((prev) => {
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
        !!formData.centreName.trim() &&
        !!formData.operatorName.trim() &&
        !!formData.phone.trim() &&
        !!formData.physicalAddress.trim() &&
        !!formData.ward
      );
    }
    if (index === 1) {
      return (
        !!formData.seatingCapacity.trim() && !!formData.fireExtinguishers.trim()
      );
    }
    if (index === 2) {
      return (
        screens.length > 0 &&
        !!screens[0].screenType.trim() &&
        decoders.length > 0
      );
    }
    if (index === 3) {
      const missing = DOCUMENTS.filter(
        (d) => d.required && !uploadedFiles[d.id],
      );
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

  const currentFee = service.feeConfig.amount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!declaration) return;

    onSubmit({
      formData: {
        ...formData,
        screens: screens.filter((s) => s.screenType.trim()),
        decoders: decoders.filter((d) => d.platform.trim()),
        staff: staff.filter((st) => st.fullName.trim()),
      },
      files: uploadedFiles,

      applicant: initialApplicant || null,
    });
  };

  const reviewSections: ReviewSection[] = [
    {
      title: "Viewing Centre & Operator Details",
      items: [
        { label: "Centre Name", value: formData.centreName },
        { label: "Operator / Owner Name", value: formData.operatorName },
        { label: "Contact Phone Number", value: formData.phone },
        { label: "Email Address", value: formData.email },
        { label: "Physical Location", value: formData.physicalAddress },
        { label: "Ward in Odeda LGA", value: formData.ward },
        { label: "CAC Reg Number", value: formData.cacNumber },
        { label: "Standard Admission Fee", value: formData.standardFee },
      ],
    },
    {
      title: "Hall Capacity, Safety & Power Standards",
      items: [
        { label: "Total Seating Capacity", value: formData.seatingCapacity },
        { label: "Hall Ventilation", value: formData.ventilationType },
        { label: "Backup Generator System", value: formData.powerBackup },
        {
          label: "Fire Extinguishers Provided",
          value: formData.fireExtinguishers,
        },
        { label: "Emergency Exits", value: formData.exitDoors },
        { label: "Juvenile Protection Clause", value: formData.juvenileSafety },
      ],
    },
  ];

  const reviewRepeatableSections: ReviewRepeatableSection[] = [
    {
      title: "Display Screens & Projection Equipment",
      countLabel: "Screens",
      items: screens
        .filter((s) => s.screenType.trim())
        .map((s) => ({
          "Screen Hardware": s.screenType,
          "Diagonal Size": s.sizeInches,
          "Mounting Position": s.hallPosition,
        })),
    },
    {
      title: "Commercial Broadcast Decoders & Subscriptions",
      countLabel: "Decoders",
      items: decoders
        .filter((d) => d.platform.trim())
        .map((d) => ({
          "Broadcast Service": d.platform,
          "Smartcard / Box ID": d.decoderNumber,
          "Commercial Package": d.subscriptionPlan,
        })),
    },
    {
      title: "Hall Supervisory & Crowd Security Personnel",
      countLabel: "Personnel",
      items: staff
        .filter((st) => st.fullName.trim())
        .map((st) => ({
          "Staff Name": st.fullName,
          "Assigned Role": st.role,
          "Phone Number": st.phone,
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
      submitDisabled={
        !declaration ||
        !validateStep(0) ||
        !validateStep(1) ||
        !validateStep(2) ||
        !validateStep(3)
      }
    >
      {/* STEP 1: Centre Profile */}
      {currentStepIndex === 0 && (
        <div className="space-y-4">
          <div className="border-b pb-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary">
              Viewing Centre & Operator Profile
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Enter sports viewing hall details and operator contact credentials
              in Odeda LGA.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="centreName">
                Viewing Centre Commercial Name *
              </Label>
              <Input
                id="centreName"
                required
                value={formData.centreName}
                onChange={(e) =>
                  setFormData({ ...formData, centreName: e.target.value })
                }
                placeholder="e.g. Champions League Arena Viewing Centre"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="operatorName">
                Operator / Proprietor Full Name *
              </Label>
              <Input
                id="operatorName"
                required
                value={formData.operatorName}
                onChange={(e) =>
                  setFormData({ ...formData, operatorName: e.target.value })
                }
                placeholder="e.g. Mr. Kehinde Adegbite"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Contact Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+234 800 000 0000"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="viewingcentre@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ward">Ward in Odeda LGA *</Label>
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
              <Label htmlFor="cacNumber">CAC Registration Number</Label>
              <Input
                id="cacNumber"
                value={formData.cacNumber}
                onChange={(e) =>
                  setFormData({ ...formData, cacNumber: e.target.value })
                }
                placeholder="BN-334455"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="standardFee">Standard Match Admission Fee</Label>
              <Input
                id="standardFee"
                value={formData.standardFee}
                onChange={(e) =>
                  setFormData({ ...formData, standardFee: e.target.value })
                }
                placeholder="e.g. ₦200 - ₦300"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="physicalAddress">
                Viewing Hall Physical Location Address *
              </Label>
              <Input
                id="physicalAddress"
                required
                value={formData.physicalAddress}
                onChange={(e) =>
                  setFormData({ ...formData, physicalAddress: e.target.value })
                }
                placeholder="Building No, Street name, Community in Odeda LGA"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Hall Specs & Safety */}
      {currentStepIndex === 1 && (
        <div className="space-y-4">
          <div className="border-b pb-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary">
              Hall Specifications, Safety & Fire Controls
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Provide crowd safety specifications, acoustic measures, and
              emergency evacuation exits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="seatingCapacity">Hall Seating Capacity *</Label>
              <Input
                id="seatingCapacity"
                required
                value={formData.seatingCapacity}
                onChange={(e) =>
                  setFormData({ ...formData, seatingCapacity: e.target.value })
                }
                placeholder="e.g. 100 Seats"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ventilationType">
                Ventilation & Cooling System *
              </Label>
              <Select
                value={formData.ventilationType}
                onValueChange={(val) =>
                  setFormData({ ...formData, ventilationType: val })
                }
              >
                <SelectTrigger id="ventilationType">
                  <SelectValue placeholder="Select Ventilation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Heavy Duty Industrial Wall Fans & Cross Ventilation">
                    Industrial Wall Fans & Cross Ventilation
                  </SelectItem>
                  <SelectItem value="Split-Unit Air Conditioning System">
                    Split-Unit Air Conditioning System
                  </SelectItem>
                  <SelectItem value="Natural Cross Ventilation with Ceiling Fans">
                    Natural Cross Ventilation with Ceiling Fans
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="powerBackup">Alternative Power Backup *</Label>
              <Select
                value={formData.powerBackup}
                onValueChange={(val) =>
                  setFormData({ ...formData, powerBackup: val })
                }
              >
                <SelectTrigger id="powerBackup">
                  <SelectValue placeholder="Select Power Backup" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15kVA Soundproof Diesel Generator & Inverter">
                    Soundproof Diesel Generator & Inverter
                  </SelectItem>
                  <SelectItem value="10kVA Petrol Generator Set">
                    10kVA Petrol Generator Set
                  </SelectItem>
                  <SelectItem value="Solar PV & Lithium Inverter Backup">
                    Solar PV & Lithium Inverter Backup
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="fireExtinguishers">
                Fire Extinguishers Installed *
              </Label>
              <Input
                id="fireExtinguishers"
                required
                value={formData.fireExtinguishers}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fireExtinguishers: e.target.value,
                  })
                }
                placeholder="e.g. 2 x 6kg Dry Chemical Extinguishers"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="exitDoors">Emergency Evacuation Exit Doors</Label>
              <Input
                id="exitDoors"
                value={formData.exitDoors}
                onChange={(e) =>
                  setFormData({ ...formData, exitDoors: e.target.value })
                }
                placeholder="e.g. 2 Dedicated Outward-Opening Exit Doors"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="juvenileSafety">Juvenile Protection Policy</Label>
              <Input
                id="juvenileSafety"
                value={formData.juvenileSafety}
                onChange={(e) =>
                  setFormData({ ...formData, juvenileSafety: e.target.value })
                }
                placeholder="No underage gambling or admission in school uniform"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Screens, Decoders & Staff (REPEATABLE UI) */}
      {currentStepIndex === 2 && (
        <div className="space-y-6">
          <div className="border-b pb-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary">
              Display Screens, Commercial Decoders & Safety Staff
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Itemize all visual display units, commercial sports broadcasting
              decoders, and security attendants.
            </p>
          </div>

          {/* REPEATABLE SECTION: Display Screens */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Tv className="w-4 h-4 text-primary" /> Display Screens &
                  Projectors *
                </h5>
                <p className="text-[11px] text-muted-foreground">
                  Record all TVs, laser projectors, and display monitors
                  installed in the viewing centre.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addScreen}
                className="gap-1 text-xs h-8"
              >
                <Plus className="w-3.5 h-3.5" /> Add Screen
              </Button>
            </div>

            {screens.map((sc, idx) => (
              <div
                key={idx}
                className="bg-muted/10 border rounded-xl p-4 space-y-3 relative group"
              >
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-bold text-xs text-foreground">
                    Screen #{idx + 1}: {sc.screenType} ({sc.sizeInches})
                  </span>
                  {screens.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeScreen(idx)}
                      className="text-red-500 hover:text-red-700 h-7 px-2 text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Display Type *</Label>
                    <Input
                      value={sc.screenType}
                      onChange={(e) =>
                        updateScreen(idx, "screenType", e.target.value)
                      }
                      placeholder="e.g. 4K UHD Smart TV / Laser Projector"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Screen Size (Inches)</Label>
                    <Input
                      value={sc.sizeInches}
                      onChange={(e) =>
                        updateScreen(idx, "sizeInches", e.target.value)
                      }
                      placeholder="e.g. 75 Inches / 120 Inches"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Hall Mounting Position</Label>
                    <Input
                      value={sc.hallPosition}
                      onChange={(e) =>
                        updateScreen(idx, "hallPosition", e.target.value)
                      }
                      placeholder="e.g. Front Stage / Side Wing"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* REPEATABLE SECTION: Commercial Decoders */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-primary" /> Commercial
                  Broadcast Decoders *
                </h5>
                <p className="text-[11px] text-muted-foreground">
                  Record commercial sports decoders and smartcard numbers.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addDecoder}
                className="gap-1 text-xs h-8"
              >
                <Plus className="w-3.5 h-3.5" /> Add Decoder
              </Button>
            </div>

            <div className="space-y-2.5">
              {decoders.map((dec, idx) => (
                <div
                  key={idx}
                  className="bg-card border rounded-lg p-3 grid grid-cols-1 sm:grid-cols-5 gap-2.5 items-end"
                >
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-[11px]">
                      Broadcaster / Platform
                    </Label>
                    <Input
                      value={dec.platform}
                      onChange={(e) =>
                        updateDecoder(idx, "platform", e.target.value)
                      }
                      placeholder="e.g. DStv Commercial / StarTimes"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">
                      Smartcard / IUC Number
                    </Label>
                    <Input
                      value={dec.decoderNumber}
                      onChange={(e) =>
                        updateDecoder(idx, "decoderNumber", e.target.value)
                      }
                      placeholder="10-digit number"
                      className="h-8 text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">Commercial Plan</Label>
                    <Input
                      value={dec.subscriptionPlan}
                      onChange={(e) =>
                        updateDecoder(idx, "subscriptionPlan", e.target.value)
                      }
                      placeholder="Commercial Sports"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDecoder(idx)}
                      className="text-red-500 hover:text-red-700 h-8 px-2 text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* REPEATABLE SECTION: Staff */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-primary" /> Hall
                  Supervisory & Crowd Security Personnel
                </h5>
                <p className="text-[11px] text-muted-foreground">
                  Record staff responsible for ticketing, electrical safety, and
                  crowd control.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addStaff}
                className="gap-1 text-xs h-8"
              >
                <Plus className="w-3.5 h-3.5" /> Add Staff
              </Button>
            </div>

            <div className="space-y-2.5">
              {staff.map((st, idx) => (
                <div
                  key={idx}
                  className="bg-card border rounded-lg p-3 grid grid-cols-1 sm:grid-cols-5 gap-2.5 items-end"
                >
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-[11px]">Staff Name</Label>
                    <Input
                      value={st.fullName}
                      onChange={(e) =>
                        updateStaff(idx, "fullName", e.target.value)
                      }
                      placeholder="Full Name"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">Role / Duty</Label>
                    <Input
                      value={st.role}
                      onChange={(e) => updateStaff(idx, "role", e.target.value)}
                      placeholder="Security / Cashier"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">Phone Number</Label>
                    <Input
                      value={st.phone}
                      onChange={(e) =>
                        updateStaff(idx, "phone", e.target.value)
                      }
                      placeholder="080..."
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStaff(idx)}
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
          declarationText="I solemnly declare that the viewing hall seating layout, electrical wiring safety, commercial broadcast subscriptions, and crowd control measures comply strictly with the Public Entertainment & Viewing Centre Regulations of Odeda Local Government, Ogun State."
        />
      )}
    </FormWizard>
  );
}
