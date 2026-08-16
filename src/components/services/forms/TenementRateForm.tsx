"use client";
import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WARDS } from "@/lib/mock-data";
import { OdedaService, getConfiguredFeeForService } from "@/config/odedaServices";
import { FormWizard, FormStep } from "./FormWizard";
import { DocumentUploadStep, DocumentSpec } from "./DocumentUploadStep";
import { ReviewSubmitStep, ReviewSection, ReviewRepeatableSection } from "./ReviewSubmitStep";
import { Plus, Trash2, Home, Calculator, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Props {
  service: OdedaService;
  onSubmit: (formData: Record<string, any>) => void;
  isSubmitting?: boolean;
}

interface TenementUnit {
  unitIdentifier: string;
  unitType: string;
  occupancyStatus: string;
  occupantName: string;
  annualRent: string;
}

const STEPS: FormStep[] = [
  {
    id: "property_owner",
    title: "Property Ownership & Location",
    shortTitle: "Owner & Location",
    description: "Enter property owner contact details and physical address in Odeda LGA.",
  },
  {
    id: "building_specs",
    title: "Building Specifications & Structural Profile",
    shortTitle: "Building Specs",
    description: "Specify building type, storeys, construction year, and infrastructure access.",
  },
  {
    id: "units_tenancy",
    title: "Tenement Units & Tenancy Schedule",
    shortTitle: "Units & Tenancies",
    description: "Itemize individual flats, shops, and suites with occupancy and annual valuation.",
  },
  {
    id: "documents",
    title: "Supporting Documents",
    shortTitle: "Documents",
    description: "Upload title deeds, building elevation photos, and previous clearance receipts.",
  },
  {
    id: "review",
    title: "Review & Submit",
    shortTitle: "Review",
    description: "Review tenement valuation assessment and submit for statutory LGA billing.",
  },
];

const DOCUMENTS: DocumentSpec[] = [
  {
    id: "title_document",
    label: "Title Deed / Survey Plan / C of O",
    description: "Deed of Conveyance, Certificate of Occupancy, or Registered Cadastral Survey Plan.",
    required: true,
  },
  {
    id: "building_photos",
    label: "Building Elevation & Street Photographs",
    description: "Clear photograph of the front elevation and street approach of the tenement property.",
    required: true,
    acceptedFormats: ".jpg,.jpeg,.png",
  },
  {
    id: "previous_receipt",
    label: "Previous Tenement Rate Clearance Receipt",
    description: "Proof of payment for previous year (if applicable for existing tenement renewal).",
    required: false,
  },
  {
    id: "owner_id",
    label: "Owner / Estate Manager Means of ID",
    description: "National ID Card (NIN), Voter's Card, or International Passport.",
    required: true,
  },
];

export default function TenementRateForm({ service, onSubmit, isSubmitting }: Props) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});
  const [declaration, setDeclaration] = useState(false);

  // Property Information
  const [formData, setFormData] = useState({
    ownerName: "",
    isCorporate: "No",
    corporateName: "",
    phone: "",
    email: "",
    ownerAddress: "",
    propertyAddress: "",
    ward: WARDS[0] || "Odeda",
    cadastralPlotNo: "Plot 12, Block IV",
    propertyType: "Multi-Flat Block / Storey Building",
    numberOfFloors: "2",
    totalUnitsCount: "4",
    constructionYear: "2018",
    buildingMaterials: "Reinforced Concrete & Sandcrete Hollow Blocks",
    accessRoadStatus: "Tarred / Paved Access Road",
    utilitiesAvailable: "National Grid Electricity & Motorized Borehole",
  });

  // Repeatable: Property Units & Tenancy Schedule
  const [units, setUnits] = useState<TenementUnit[]>([
    { unitIdentifier: "Flat 1 (Ground Floor Right)", unitType: "3-Bedroom Flat", occupancyStatus: "Tenant-Occupied", occupantName: "Mr. Kunle Ajayi", annualRent: "450000" },
    { unitIdentifier: "Flat 2 (Ground Floor Left)", unitType: "2-Bedroom Flat", occupancyStatus: "Tenant-Occupied", occupantName: "Alhaja S. Balogun", annualRent: "350000" },
    { unitIdentifier: "Flat 3 (First Floor Right)", unitType: "3-Bedroom Flat", occupancyStatus: "Owner-Occupied", occupantName: "Property Owner", annualRent: "450000" },
    { unitIdentifier: "Flat 4 (First Floor Left)", unitType: "2-Bedroom Flat", occupancyStatus: "Tenant-Occupied", occupantName: "Dr. T. Adeleke", annualRent: "350000" },
  ]);

  // Calculations
  const totalAnnualRent = useMemo(() => {
    return units.reduce((acc, u) => acc + (parseFloat(u.annualRent) || 0), 0);
  }, [units]);

  // Handlers for Units
  const addUnit = () => {
    setUnits((prev) => [
      ...prev,
      {
        unitIdentifier: `Unit ${prev.length + 1}`,
        unitType: "2-Bedroom Flat",
        occupancyStatus: "Tenant-Occupied",
        occupantName: "",
        annualRent: "300000",
      },
    ]);
  };

  const removeUnit = (idx: number) => {
    setUnits((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateUnit = (idx: number, field: keyof TenementUnit, val: string) => {
    setUnits((prev) => {
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
        !!formData.ownerName.trim() &&
        !!formData.phone.trim() &&
        !!formData.propertyAddress.trim() &&
        !!formData.ward
      );
    }
    if (index === 1) {
      return !!formData.propertyType && !!formData.numberOfFloors;
    }
    if (index === 2) {
      return units.length > 0 && !!units[0].unitIdentifier.trim();
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
      units: units.filter((u) => u.unitIdentifier.trim()),
      totalValuation: totalAnnualRent,
      unitsCount: units.length,
      uploadedFiles,
      amount: currentFee,
      revenueHead: service.revenueHead,
      serviceName: service.name,
      applicant: formData.ownerName,
    });
  };

  const reviewSections: ReviewSection[] = [
    {
      title: "Property Ownership & Physical Cadastre",
      items: [
        { label: "Property Owner Full Name", value: formData.ownerName },
        { label: "Corporate Owner Entity", value: formData.isCorporate === "Yes" ? formData.corporateName : "Private Individual" },
        { label: "Owner Contact Phone", value: formData.phone },
        { label: "Owner Email Address", value: formData.email },
        { label: "Physical Property Address", value: formData.propertyAddress },
        { label: "Ward in Odeda LGA", value: formData.ward },
        { label: "Cadastral / Plot Number", value: formData.cadastralPlotNo },
        { label: "Owner Mailing Address", value: formData.ownerAddress },
      ],
    },
    {
      title: "Structural Specifications & Amenities",
      items: [
        { label: "Property Classification", value: formData.propertyType },
        { label: "Number of Storeys/Floors", value: `${formData.numberOfFloors} Floors` },
        { label: "Total Assessment Units", value: `${units.length} Units` },
        { label: "Year of Construction", value: formData.constructionYear },
        { label: "Building Materials", value: formData.buildingMaterials },
        { label: "Access Road Condition", value: formData.accessRoadStatus },
        { label: "Available Utilities", value: formData.utilitiesAvailable },
      ],
    },
  ];

  const reviewRepeatableSections: ReviewRepeatableSection[] = [
    {
      title: "Tenement Units & Rental Valuation Schedule",
      countLabel: "Tenement Units",
      items: units
        .filter((u) => u.unitIdentifier.trim())
        .map((u) => ({
          "Unit Identifier": u.unitIdentifier,
          "Unit Type": u.unitType,
          "Occupancy Status": u.occupancyStatus,
          "Current Occupant": u.occupantName,
          "Annual Rental Value": `₦${(parseFloat(u.annualRent) || 0).toLocaleString()}`,
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
      {/* STEP 1: Property Owner & Location */}
      {currentStepIndex === 0 && (
        <div className="space-y-4">
          <div className="border-b pb-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary">
              Property Ownership & Physical Cadastre
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Enter official property ownership records and physical address within Odeda LGA rating jurisdiction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="ownerName">Property Landlord / Owner Full Legal Name *</Label>
              <Input
                id="ownerName"
                required
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                placeholder="e.g. Chief Babatunde O. Adeleke"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="isCorporate">Is property owned by a Corporate Body / Trust?</Label>
              <Select value={formData.isCorporate} onValueChange={(val) => setFormData({ ...formData, isCorporate: val })}>
                <SelectTrigger id="isCorporate">
                  <SelectValue placeholder="Corporate Ownership?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No">No - Individual / Family Owned</SelectItem>
                  <SelectItem value="Yes">Yes - Registered Company / Trust</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.isCorporate === "Yes" && (
              <div className="space-y-1.5">
                <Label htmlFor="corporateName">Company / Corporate Entity Name</Label>
                <Input
                  id="corporateName"
                  value={formData.corporateName}
                  onChange={(e) => setFormData({ ...formData, corporateName: e.target.value })}
                  placeholder="e.g. Odeda Properties & Investments Ltd"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="phone">Owner / Agent Phone Number *</Label>
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
              <Label htmlFor="email">Owner / Agent Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="landlord@example.com"
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
              <Label htmlFor="cadastralPlotNo">Cadastral Plot / Survey Beacon Number</Label>
              <Input
                id="cadastralPlotNo"
                value={formData.cadastralPlotNo}
                onChange={(e) => setFormData({ ...formData, cadastralPlotNo: e.target.value })}
                placeholder="e.g. Plot 15, Block D, Layout 2"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="propertyAddress">Physical Property Location Address *</Label>
              <Input
                id="propertyAddress"
                required
                value={formData.propertyAddress}
                onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })}
                placeholder="House number, Street name, Community/Town in Odeda LGA"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="ownerAddress">Owner Residential / Correspondence Address</Label>
              <Input
                id="ownerAddress"
                value={formData.ownerAddress}
                onChange={(e) => setFormData({ ...formData, ownerAddress: e.target.value })}
                placeholder="Mailing address for official assessment notices"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Building Specs */}
      {currentStepIndex === 1 && (
        <div className="space-y-4">
          <div className="border-b pb-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary">
              Building Specifications & Structural Profile
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Specify building typology, age, structural components, and neighborhood utility access.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="propertyType">Property Building Classification *</Label>
              <Select value={formData.propertyType} onValueChange={(val) => setFormData({ ...formData, propertyType: val })}>
                <SelectTrigger id="propertyType">
                  <SelectValue placeholder="Select Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Multi-Flat Block / Storey Building">Multi-Flat Block / Storey Building</SelectItem>
                  <SelectItem value="Single Detached Duplex / Bungalow">Single Detached Duplex / Bungalow</SelectItem>
                  <SelectItem value="Tenement Multi-Room (Face-me-I-face-you)">Tenement Multi-Room House</SelectItem>
                  <SelectItem value="Commercial Shopping Complex / Plaza">Commercial Shopping Complex / Plaza</SelectItem>
                  <SelectItem value="Industrial Factory / Warehouse">Industrial Factory / Warehouse</SelectItem>
                  <SelectItem value="Mixed Residential / Commercial Property">Mixed Residential / Commercial Property</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="numberOfFloors">Number of Floors / Storeys *</Label>
              <Select value={formData.numberOfFloors} onValueChange={(val) => setFormData({ ...formData, numberOfFloors: val })}>
                <SelectTrigger id="numberOfFloors">
                  <SelectValue placeholder="Select Storeys" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Bungalow (Ground Floor Only)</SelectItem>
                  <SelectItem value="2">2 Floors (One Storey Building)</SelectItem>
                  <SelectItem value="3">3 Floors (Two Storey Building)</SelectItem>
                  <SelectItem value="4">4+ Floors (Multi-Storey Complex)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="constructionYear">Year of Construction</Label>
              <Input
                id="constructionYear"
                value={formData.constructionYear}
                onChange={(e) => setFormData({ ...formData, constructionYear: e.target.value })}
                placeholder="e.g. 2018"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="buildingMaterials">Primary Building Materials</Label>
              <Input
                id="buildingMaterials"
                value={formData.buildingMaterials}
                onChange={(e) => setFormData({ ...formData, buildingMaterials: e.target.value })}
                placeholder="e.g. Sandcrete blockwall, corrugated aluminium roof"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="accessRoadStatus">Access Road Quality</Label>
              <Select value={formData.accessRoadStatus} onValueChange={(val) => setFormData({ ...formData, accessRoadStatus: val })}>
                <SelectTrigger id="accessRoadStatus">
                  <SelectValue placeholder="Select Road Access" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tarred / Paved Access Road">Tarred / Paved Access Road</SelectItem>
                  <SelectItem value="Graded Earth Road with Concrete Gutters">Graded Earth Road with Gutters</SelectItem>
                  <SelectItem value="Seasonal Unpaved Dirt Track">Seasonal Unpaved Dirt Track</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="utilitiesAvailable">Installed Utilities</Label>
              <Input
                id="utilitiesAvailable"
                value={formData.utilitiesAvailable}
                onChange={(e) => setFormData({ ...formData, utilitiesAvailable: e.target.value })}
                placeholder="e.g. PHCN Electricity, Dedicated Transformer, Borehole"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Units & Tenancy Schedule (REPEATABLE UI) */}
      {currentStepIndex === 2 && (
        <div className="space-y-6">
          <div className="border-b pb-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary">
              Tenement Units & Tenancy Schedule
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Statutory rating assessment requires itemizing all habitable flats, rooms, shops, or suites in the building.
            </p>
          </div>

          {/* Valuation Summary Card */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 text-primary rounded-lg">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold block">
                  Cumulative Annual Rental Valuation
                </span>
                <h4 className="text-lg font-bold text-foreground">
                  ₦{totalAnnualRent.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">({units.length} Habitable Units)</span>
                </h4>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addUnit}
              className="gap-1 text-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Add Tenement Unit
            </Button>
          </div>

          {/* REPEATABLE SECTION: Tenement Units */}
          <div className="space-y-4">
            {units.map((unit, idx) => (
              <div key={idx} className="bg-muted/10 border rounded-xl p-4 space-y-3 relative group">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary" />
                    <span className="font-bold text-xs text-foreground">Unit #{idx + 1}: {unit.unitIdentifier || "Tenement Unit"}</span>
                  </div>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-xs">Unit Identifier / Flat Name *</Label>
                    <Input
                      value={unit.unitIdentifier}
                      onChange={(e) => updateUnit(idx, "unitIdentifier", e.target.value)}
                      placeholder="e.g. Flat 1 (Ground Floor Right) / Shop 3"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Unit Type</Label>
                    <Select value={unit.unitType} onValueChange={(val) => updateUnit(idx, "unitType", val)}>
                      <SelectTrigger className="text-xs h-9">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3-Bedroom Flat">3-Bedroom Flat</SelectItem>
                        <SelectItem value="2-Bedroom Flat">2-Bedroom Flat</SelectItem>
                        <SelectItem value="1-Bedroom Mini Flat">1-Bedroom Mini Flat</SelectItem>
                        <SelectItem value="Self-Contained Studio">Self-Contained Studio</SelectItem>
                        <SelectItem value="Single Room (Tenement)">Single Room (Tenement)</SelectItem>
                        <SelectItem value="Retail Shop / Store">Retail Shop / Store</SelectItem>
                        <SelectItem value="Office Suite">Office Suite</SelectItem>
                        <SelectItem value="Warehouse / Storage Bay">Warehouse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Occupancy</Label>
                    <Select value={unit.occupancyStatus} onValueChange={(val) => updateUnit(idx, "occupancyStatus", val)}>
                      <SelectTrigger className="text-xs h-9">
                        <SelectValue placeholder="Occupancy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tenant-Occupied">Tenant-Occupied</SelectItem>
                        <SelectItem value="Owner-Occupied">Owner-Occupied</SelectItem>
                        <SelectItem value="Vacant / Unoccupied">Vacant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Annual Rent (₦) *</Label>
                    <Input
                      type="number"
                      value={unit.annualRent}
                      onChange={(e) => updateUnit(idx, "annualRent", e.target.value)}
                      placeholder="e.g. 400000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <Label className="text-xs">Current Occupant / Tenant Name</Label>
                    <Input
                      value={unit.occupantName}
                      onChange={(e) => updateUnit(idx, "occupantName", e.target.value)}
                      placeholder="e.g. Mr. S. O. Balogun"
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
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
          declarationText="I solemnly declare that the property specifications, number of tenements, and rental values stated herein are truthful and in full compliance with the Tenement Rate and Valuation Edict of Odeda Local Government, Ogun State."
        />
      )}
    </FormWizard>
  );
}
