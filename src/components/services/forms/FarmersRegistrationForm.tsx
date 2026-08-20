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
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Trash2, Sprout, Tractor, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Props {
  service: OdedaService;
  onSubmit: (formData: Record<string, any>) => void;
  isSubmitting?: boolean;
  initialApplicant?: {
    applicantId: string;
  };
}

interface FarmParcel {
  locationName: string;
  sizeAcres: string;
  landTenure: string;
  soilTerrain: string;
  nearestLandmark: string;
}

interface CommodityEnterprise {
  commodity: string;
  scaleType: string;
  annualYield: string;
  unit: string;
}

interface FarmEquipment {
  equipmentType: string;
  quantity: string;
  ownership: string;
  condition: string;
}

const STEPS: FormStep[] = [
  {
    id: "farmer_identity",
    title: "Farmer & Enterprise Identity",
    shortTitle: "Farmer Identity",
    description:
      "Enter personal/business contact details, ward location, and farming background.",
  },
  {
    id: "cooperative_extension",
    title: "Cooperative & Extension Services",
    shortTitle: "Cooperative & Support",
    description:
      "Provide agricultural cooperative affiliation, water source, and storage infrastructure.",
  },
  {
    id: "parcels_enterprises_machinery",
    title: "Farm Parcels, Produce & Machinery Roster",
    shortTitle: "Parcels & Produce",
    description:
      "Detail farm land parcels, crop/livestock enterprises, and agricultural equipment inventory.",
  },
  {
    id: "documents",
    title: "Supporting Documents",
    shortTitle: "Documents",
    description:
      "Upload farmer passport, NIN slip, farm sketch, and land ownership/lease proof.",
  },
  {
    id: "review",
    title: "Review & Submit",
    shortTitle: "Review",
    description:
      "Verify agricultural census records and submit statutory registration.",
  },
];

const DOCUMENTS: DocumentSpec[] = [
  {
    id: "farmer_photo",
    label: "Farmer / Manager Passport Photograph",
    description:
      "Recent color passport photo of the principal farmer or farm manager.",
    required: true,
    acceptedFormats: ".jpg,.jpeg,.png",
  },
  {
    id: "farmer_nin",
    label: "NIN Slip / Means of Identification",
    description: "National ID Card, NIN Slip, or Voter's Card.",
    required: true,
  },
  {
    id: "farm_sketch_map",
    label: "Farm Location Sketch / Survey Plan",
    description:
      "Sketch or survey showing farm boundaries and access road from main village.",
    required: true,
  },
  {
    id: "land_tenure_proof",
    label: "Proof of Land Tenure / Lease Agreement",
    description:
      "Deed of gift, family receipt, lease agreement, or C of O for farm land.",
    required: true,
  },
  {
    id: "coop_membership_doc",
    label: "Cooperative Membership Card / CAC",
    description:
      "Membership slip if registered under a farmer group, or CAC certificate for corporate farms.",
    required: false,
  },
];

export default function FarmersRegistrationForm({
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

  // Form Basic Info
  const [formData, setFormData] = useState({
    farmerName: "",
    farmingType: "Individual Smallholder Farmer",
    contactPerson: "",
    phone: "",
    email: "",
    residentialAddress: "",
    ward: WARDS[0] || "Odeda",
    nin: "",
    cacNumber: "",
    yearsFarming: "5",
    cooperativeName: "Odeda Farmers Multipurpose Cooperative Society",
    coopRegNo: "OG/FARM/2021/045",
    extensionZone: "Zone A - Odeda / Obantoko Agronomic Block",
    primaryWaterSource: "Borehole & Seasonal Rainfed",
    storageFacilities: "Grain Crib & Processing Shed",
  });

  // Repeatable: Farm Parcels
  const [parcels, setParcels] = useState<FarmParcel[]>([
    {
      locationName: "Olodo Farm Settlement Block 3",
      sizeAcres: "5",
      landTenure: "Leased (10 Years)",
      soilTerrain: "Loamy Topsoil / Flat Terrain",
      nearestLandmark: "Beside Old Cocoa Depot",
    },
  ]);

  // Repeatable: Commodity / Livestock Enterprises
  const [commodities, setCommodities] = useState<CommodityEnterprise[]>([
    {
      commodity: "Cassava (TME 419)",
      scaleType: "Arable Crop",
      annualYield: "50",
      unit: "Tons",
    },
    {
      commodity: "Maize (Yellow Composite)",
      scaleType: "Grain Crop",
      annualYield: "15",
      unit: "Tons",
    },
    {
      commodity: "Poultry (Broilers)",
      scaleType: "Livestock",
      annualYield: "1,200",
      unit: "Birds/Cycle",
    },
  ]);

  // Repeatable: Machinery & Farm Equipment
  const [equipment, setEquipment] = useState<FarmEquipment[]>([
    {
      equipmentType: "Knapsack Sprayers (Manual & Battery)",
      quantity: "4",
      ownership: "Owned",
      condition: "Good Working Order",
    },
    {
      equipmentType: "Irrigation Pumping Machine (3-Inch)",
      quantity: "1",
      ownership: "Owned",
      condition: "Fair",
    },
  ]);

  // Handlers for Parcels
  const addParcel = () => {
    setParcels((prev) => [
      ...prev,
      {
        locationName: "",
        sizeAcres: "2",
        landTenure: "Family Land",
        soilTerrain: "Loamy Soil",
        nearestLandmark: "",
      },
    ]);
  };

  const removeParcel = (idx: number) => {
    setParcels((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateParcel = (idx: number, field: keyof FarmParcel, val: string) => {
    setParcels((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });
  };

  // Handlers for Commodities
  const addCommodity = () => {
    setCommodities((prev) => [
      ...prev,
      {
        commodity: "",
        scaleType: "Arable Crop",
        annualYield: "10",
        unit: "Tons",
      },
    ]);
  };

  const removeCommodity = (idx: number) => {
    setCommodities((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateCommodity = (
    idx: number,
    field: keyof CommodityEnterprise,
    val: string,
  ) => {
    setCommodities((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });
  };

  // Handlers for Equipment
  const addEquipment = () => {
    setEquipment((prev) => [
      ...prev,
      {
        equipmentType: "",
        quantity: "1",
        ownership: "Owned",
        condition: "Good Working Order",
      },
    ]);
  };

  const removeEquipment = (idx: number) => {
    setEquipment((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateEquipment = (
    idx: number,
    field: keyof FarmEquipment,
    val: string,
  ) => {
    setEquipment((prev) => {
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
        !!formData.farmerName.trim() &&
        !!formData.phone.trim() &&
        !!formData.residentialAddress.trim() &&
        !!formData.ward &&
        !!formData.nin.trim()
      );
    }
    if (index === 1) {
      return !!formData.primaryWaterSource.trim();
    }
    if (index === 2) {
      return (
        parcels.length > 0 &&
        !!parcels[0].locationName.trim() &&
        commodities.length > 0
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

        parcels: parcels.filter((p) => p.locationName.trim()),
        commodities: commodities.filter((c) => c.commodity.trim()),
        equipment: equipment.filter((eq) => eq.equipmentType.trim()),
      },
      files: uploadedFiles,
      applicant: {
        applicantId: initialApplicant.applicantId,
      },
    });
  };

  const reviewSections: ReviewSection[] = [
    {
      title: "Farmer & Agricultural Enterprise Profile",
      items: [
        { label: "Farmer / Enterprise Name", value: formData.farmerName },
        { label: "Registration Type", value: formData.farmingType },
        {
          label: "Contact Person",
          value: formData.contactPerson || formData.farmerName,
        },
        { label: "Phone Number", value: formData.phone },
        { label: "Email Address", value: formData.email },
        { label: "NIN / RC Number", value: formData.nin || formData.cacNumber },
        { label: "Residential Address", value: formData.residentialAddress },
        { label: "Ward in Odeda LGA", value: formData.ward },
        {
          label: "Years in Active Farming",
          value: `${formData.yearsFarming} years`,
        },
      ],
    },
    {
      title: "Cooperative Support & Infrastructure",
      items: [
        { label: "Affiliated Cooperative", value: formData.cooperativeName },
        { label: "Cooperative Reg Number", value: formData.coopRegNo },
        { label: "Extension Officer Zone", value: formData.extensionZone },
        { label: "Primary Water Source", value: formData.primaryWaterSource },
        {
          label: "On-Farm Storage Facilities",
          value: formData.storageFacilities,
        },
      ],
    },
  ];

  const reviewRepeatableSections: ReviewRepeatableSection[] = [
    {
      title: "Farm Land Parcels & Plots Schedule",
      countLabel: "Parcels",
      items: parcels
        .filter((p) => p.locationName.trim())
        .map((p) => ({
          "Parcel Location": p.locationName,
          "Size (Acres)": `${p.sizeAcres} Acres`,
          "Land Tenure": p.landTenure,
          "Soil / Terrain": p.soilTerrain,
          "Nearest Landmark": p.nearestLandmark,
        })),
    },
    {
      title: "Crops, Livestock & Fisheries Inventory",
      countLabel: "Enterprises",
      items: commodities
        .filter((c) => c.commodity.trim())
        .map((c) => ({
          "Commodity / Enterprise": c.commodity,
          Category: c.scaleType,
          "Estimated Yield": `${c.annualYield} ${c.unit}`,
        })),
    },
    {
      title: "Agricultural Machinery & Farm Implements",
      countLabel: "Equipment Items",
      items: equipment
        .filter((e) => e.equipmentType.trim())
        .map((e) => ({
          "Equipment Type": e.equipmentType,
          Quantity: e.quantity,
          Ownership: e.ownership,
          Condition: e.condition,
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
      {/* STEP 1: Farmer Identity */}
      {currentStepIndex === 0 && (
        <div className="space-y-4">
          <div className="border-b pb-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary">
              Farmer / Agricultural Enterprise Identity
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Enter official farmer information for agricultural census and LGA
              subsidy/extension registry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="farmerName">
                Farmer Full Name / Enterprise Name *
              </Label>
              <Input
                id="farmerName"
                required
                value={formData.farmerName}
                onChange={(e) =>
                  setFormData({ ...formData, farmerName: e.target.value })
                }
                placeholder="e.g. Chief Johnson Oladele / Oladele Integrated Agro Farms"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="farmingType">
                Agricultural Registration Category *
              </Label>
              <Select
                value={formData.farmingType}
                onValueChange={(val) =>
                  setFormData({ ...formData, farmingType: val })
                }
              >
                <SelectTrigger id="farmingType">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Individual Smallholder Farmer">
                    Individual Smallholder Farmer (&lt; 5 Ha)
                  </SelectItem>
                  <SelectItem value="Medium Commercial Farmer">
                    Medium Commercial Farmer (5 - 20 Ha)
                  </SelectItem>
                  <SelectItem value="Large Commercial Agro-Allied Estate">
                    Large Commercial Agro-Allied Estate (&gt; 20 Ha)
                  </SelectItem>
                  <SelectItem value="Farmers Cooperative / Group">
                    Farmers Cooperative / Group
                  </SelectItem>
                  <SelectItem value="Livestock & Poultry Specialist">
                    Livestock & Poultry Specialist
                  </SelectItem>
                  <SelectItem value="Fisheries & Aquaculture Enterprise">
                    Fisheries & Aquaculture Enterprise
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="yearsFarming">Years in Active Farming</Label>
              <Input
                id="yearsFarming"
                type="number"
                value={formData.yearsFarming}
                onChange={(e) =>
                  setFormData({ ...formData, yearsFarming: e.target.value })
                }
                placeholder="e.g. 8"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number *</Label>
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
                placeholder="farmer@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="nin">National Identity Number (NIN) *</Label>
              <Input
                id="nin"
                required
                maxLength={11}
                value={formData.nin}
                onChange={(e) =>
                  setFormData({ ...formData, nin: e.target.value })
                }
                placeholder="11-digit NIN"
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

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="residentialAddress">
                Farmer Residential Address *
              </Label>
              <Input
                id="residentialAddress"
                required
                value={formData.residentialAddress}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    residentialAddress: e.target.value,
                  })
                }
                placeholder="Home address or primary business address in Odeda LGA"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Cooperative & Support */}
      {currentStepIndex === 1 && (
        <div className="space-y-4">
          <div className="border-b pb-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary">
              Cooperative Affiliation & Infrastructure Support
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Specify agricultural cooperative society memberships, agronomic
              extension zone, and water infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="cooperativeName">
                Affiliated Cooperative Society / Commodity Association
              </Label>
              <Input
                id="cooperativeName"
                value={formData.cooperativeName}
                onChange={(e) =>
                  setFormData({ ...formData, cooperativeName: e.target.value })
                }
                placeholder="e.g. All Farmers Association of Nigeria (AFAN) Odeda"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="coopRegNo">Cooperative Registration Number</Label>
              <Input
                id="coopRegNo"
                value={formData.coopRegNo}
                onChange={(e) =>
                  setFormData({ ...formData, coopRegNo: e.target.value })
                }
                placeholder="e.g. OG/COOP/2022/100"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="extensionZone">LGA Extension Officer Zone</Label>
              <Input
                id="extensionZone"
                value={formData.extensionZone}
                onChange={(e) =>
                  setFormData({ ...formData, extensionZone: e.target.value })
                }
                placeholder="e.g. Zone B - Ilugun / Odeda Agricultural Belt"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="primaryWaterSource">
                Primary Farm Water Supply *
              </Label>
              <Select
                value={formData.primaryWaterSource}
                onValueChange={(val) =>
                  setFormData({ ...formData, primaryWaterSource: val })
                }
              >
                <SelectTrigger id="primaryWaterSource">
                  <SelectValue placeholder="Select Water Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Borehole & Seasonal Rainfed">
                    Borehole & Seasonal Rainfed
                  </SelectItem>
                  <SelectItem value="River / Stream / Earth Dam">
                    River / Stream / Earth Dam
                  </SelectItem>
                  <SelectItem value="100% Rainfed Dependent">
                    100% Rainfed Dependent
                  </SelectItem>
                  <SelectItem value="Motorized Deep Tube Well Irrigation">
                    Motorized Deep Tube Well Irrigation
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="storageFacilities">
                On-Farm Storage & Processing Facilities
              </Label>
              <Input
                id="storageFacilities"
                value={formData.storageFacilities}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    storageFacilities: e.target.value,
                  })
                }
                placeholder="e.g. Cassava Processing Mill, Grain Silos, Cold Room, Smoking Kiln"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Parcels, Commodities & Equipment (REPEATABLE UI) */}
      {currentStepIndex === 2 && (
        <div className="space-y-6">
          <div className="border-b pb-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary">
              Farm Parcels, Crops / Livestock & Machinery Roster
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Provide complete breakdown of your farmlands, planted
              crops/livestock, and farm machinery.
            </p>
          </div>

          {/* REPEATABLE SECTION: Farm Land Parcels */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-primary" /> Farm Land Parcels
                  & Plots Schedule *
                </h5>
                <p className="text-[11px] text-muted-foreground">
                  Record all separate parcels/plots of farmland operated in
                  Odeda LGA.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addParcel}
                className="gap-1 text-xs h-8"
              >
                <Plus className="w-3.5 h-3.5" /> Add Farm Parcel
              </Button>
            </div>

            {parcels.map((parcel, idx) => (
              <div
                key={idx}
                className="bg-muted/10 border rounded-xl p-4 space-y-3 relative group"
              >
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-bold text-xs text-foreground">
                    Parcel #{idx + 1}: {parcel.locationName || "New Farmland"}
                  </span>
                  {parcels.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeParcel(idx)}
                      className="text-red-500 hover:text-red-700 h-7 px-2 text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-xs">
                      Location / Village / Block *
                    </Label>
                    <Input
                      value={parcel.locationName}
                      onChange={(e) =>
                        updateParcel(idx, "locationName", e.target.value)
                      }
                      placeholder="e.g. Olodo Farm Settlement, Plot 14"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Parcel Size (Acres/Ha) *</Label>
                    <Input
                      value={parcel.sizeAcres}
                      onChange={(e) =>
                        updateParcel(idx, "sizeAcres", e.target.value)
                      }
                      placeholder="e.g. 10 Acres"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Land Tenure Status</Label>
                    <Select
                      value={parcel.landTenure}
                      onValueChange={(val) =>
                        updateParcel(idx, "landTenure", val)
                      }
                    >
                      <SelectTrigger className="text-xs h-9">
                        <SelectValue placeholder="Tenure" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Freehold / Purchased">
                          Freehold / Purchased
                        </SelectItem>
                        <SelectItem value="Family / Inherited Land">
                          Family / Inherited Land
                        </SelectItem>
                        <SelectItem value="Leased (Short Term)">
                          Leased (Short Term 1-3 Yrs)
                        </SelectItem>
                        <SelectItem value="Leased (Long Term)">
                          Leased (Long Term &gt;5 Yrs)
                        </SelectItem>
                        <SelectItem value="Government Farm Settlement Allocation">
                          Government Farm Settlement
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Soil / Terrain</Label>
                    <Input
                      value={parcel.soilTerrain}
                      onChange={(e) =>
                        updateParcel(idx, "soilTerrain", e.target.value)
                      }
                      placeholder="e.g. Rich Loamy, Gentle Slope"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Prominent Landmark</Label>
                    <Input
                      value={parcel.nearestLandmark}
                      onChange={(e) =>
                        updateParcel(idx, "nearestLandmark", e.target.value)
                      }
                      placeholder="e.g. Near Catholic Church"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* REPEATABLE SECTION: Crops & Livestock */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Sprout className="w-4 h-4 text-primary" /> Crops, Livestock &
                  Aquaculture Commodities *
                </h5>
                <p className="text-[11px] text-muted-foreground">
                  Record all agricultural products cultivated or reared on the
                  farm.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCommodity}
                className="gap-1 text-xs h-8"
              >
                <Plus className="w-3.5 h-3.5" /> Add Commodity
              </Button>
            </div>

            <div className="space-y-2.5">
              {commodities.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-card border rounded-lg p-3 grid grid-cols-1 sm:grid-cols-5 gap-2.5 items-end"
                >
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-[11px]">
                      Commodity / Enterprise
                    </Label>
                    <Input
                      value={item.commodity}
                      onChange={(e) =>
                        updateCommodity(idx, "commodity", e.target.value)
                      }
                      placeholder="e.g. Cassava, Cocoa, Catfish"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">Category</Label>
                    <Select
                      value={item.scaleType}
                      onValueChange={(val) =>
                        updateCommodity(idx, "scaleType", val)
                      }
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Arable Crop">Arable Crop</SelectItem>
                        <SelectItem value="Grain Crop">Grain Crop</SelectItem>
                        <SelectItem value="Tree Crop / Plantation">
                          Tree Crop
                        </SelectItem>
                        <SelectItem value="Vegetables / Horticulture">
                          Vegetables
                        </SelectItem>
                        <SelectItem value="Livestock (Poultry/Cattle/Goats)">
                          Livestock
                        </SelectItem>
                        <SelectItem value="Aquaculture / Fisheries">
                          Fisheries
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">Annual Yield / Unit</Label>
                    <Input
                      value={item.annualYield}
                      onChange={(e) =>
                        updateCommodity(idx, "annualYield", e.target.value)
                      }
                      placeholder="e.g. 50 Tons"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCommodity(idx)}
                      className="text-red-500 hover:text-red-700 h-8 px-2 text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* REPEATABLE SECTION: Machinery & Implements */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Tractor className="w-4 h-4 text-primary" /> Agricultural
                  Machinery & Equipment Roster
                </h5>
                <p className="text-[11px] text-muted-foreground">
                  Record tractors, pumps, processing machines, and storage
                  equipment.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addEquipment}
                className="gap-1 text-xs h-8"
              >
                <Plus className="w-3.5 h-3.5" /> Add Equipment
              </Button>
            </div>

            <div className="space-y-2.5">
              {equipment.map((eq, idx) => (
                <div
                  key={idx}
                  className="bg-card border rounded-lg p-3 grid grid-cols-1 sm:grid-cols-5 gap-2.5 items-end"
                >
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-[11px]">
                      Equipment Type & Model
                    </Label>
                    <Input
                      value={eq.equipmentType}
                      onChange={(e) =>
                        updateEquipment(idx, "equipmentType", e.target.value)
                      }
                      placeholder="e.g. MF 375 Tractor / Irrigation Pump"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">Quantity</Label>
                    <Input
                      value={eq.quantity}
                      onChange={(e) =>
                        updateEquipment(idx, "quantity", e.target.value)
                      }
                      placeholder="e.g. 2 Units"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">Ownership</Label>
                    <Select
                      value={eq.ownership}
                      onValueChange={(val) =>
                        updateEquipment(idx, "ownership", val)
                      }
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Ownership" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Owned">Owned</SelectItem>
                        <SelectItem value="Leased / Financed">
                          Leased
                        </SelectItem>
                        <SelectItem value="Cooperative Shared">
                          Cooperative Shared
                        </SelectItem>
                        <SelectItem value="Hired / Commercial Rented">
                          Hired / Rented
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEquipment(idx)}
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
          declarationText="I solemnly declare that the farmland parcels, acreage, crops, livestock, and machinery recorded herein are accurate and verifiable upon physical inspection by Odeda Local Government Agricultural Extension Officers."
        />
      )}
    </FormWizard>
  );
}
