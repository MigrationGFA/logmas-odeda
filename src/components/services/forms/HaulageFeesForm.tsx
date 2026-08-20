"use client";
import React, { useState, useMemo } from "react";
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
import { Plus, Trash2, Truck, ShieldCheck, Gauge } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ApplicantSnapshot } from "../ApplicantSelectionStep";

interface Props {
  service: OdedaService;
  onSubmit: (formData: Record<string, any>) => void;
  isSubmitting?: boolean;
  initialApplicant?: ApplicantSnapshot;
}

interface FleetVehicle {
  plateNumber: string;
  chassisNumber: string;
  vehicleMakeModel: string;
  tonnageCapacity: string;
  driverName: string;
  driverLicence: string;
  driverPhone: string;
}

const STEPS: FormStep[] = [
  {
    id: "operator_profile",
    title: "Transport Operator & Fleet Enterprise",
    shortTitle: "Operator Profile",
    description:
      "Enter transport company or logistics operator identity and corporate contacts.",
  },
  {
    id: "haulage_logistics",
    title: "Logistics Operations & Cargo Corridors",
    shortTitle: "Operations & Routes",
    description:
      "Specify primary cargo categories, loading quarries, and transit corridors.",
  },
  {
    id: "fleet_registry",
    title: "Fleet Vehicles & Drivers Roster",
    shortTitle: "Fleet Vehicles",
    description:
      "Itemize heavy-duty trucks, tippers, trailers, chassis numbers, and assigned drivers.",
  },
  {
    id: "documents",
    title: "Supporting Documents",
    shortTitle: "Documents",
    description:
      "Upload vehicle registration documents, roadworthiness certificates, and driver licences.",
  },
  {
    id: "review",
    title: "Review & Submit",
    shortTitle: "Review",
    description:
      "Review fleet tonnage schedule, axle load declaration, and statutory haulage permit.",
  },
];

const DOCUMENTS: DocumentSpec[] = [
  {
    id: "vehicle_reg_papers",
    label: "Vehicle Registration & Ownership Proof",
    description:
      "Copies of vehicle licences, CMR certificates, or allocation papers for fleet vehicles.",
    required: true,
  },
  {
    id: "roadworthiness_cert",
    label: "State Roadworthiness Certificates",
    description:
      "Valid Computerized Vehicle Inspection Service (VIS) roadworthiness certificates.",
    required: true,
  },
  {
    id: "drivers_licences",
    label: "Commercial Drivers' Licences (Class G/Heavy Duty)",
    description:
      "Copies of valid FRSC commercial driver's licences for assigned fleet drivers.",
    required: true,
  },
  {
    id: "quarry_loading_pass",
    label: "Quarry Loading Point Pass / Waybill",
    description:
      "Recent loading manifest from Odeda granite quarries or sand extraction sites.",
    required: false,
  },
  {
    id: "cac_cert",
    label: "CAC Certificate of Incorporation",
    description:
      "For corporate haulage companies and logistics transport enterprises.",
    required: false,
  },
];

export default function HaulageFeesForm({
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
    companyName: "",
    rcNumber: "",
    managingDirector: "",
    phone: "",
    email: "",
    officeAddress: "",
    ward: WARDS[0] || "Odeda",
    primaryCargo: "Granite & Quarry Stone Aggregates",
    loadingPoints: "Odeda Granite Quarry Corridor, Alagbagba & Olodo Pits",
    destinationCorridor: "Lagos - Ibadan Interstate Expressway Corridor",
    paymentPlan: "Monthly Fleet Haulage Permit Pass",
  });

  // Repeatable: Fleet Vehicles (Multiple Trucks / Tippers)
  const [vehicles, setVehicles] = useState<FleetVehicle[]>([
    {
      plateNumber: "OG-482-A01",
      chassisNumber: "WDB9540321K892011",
      vehicleMakeModel: "Mack Granite 10-Tyre Tipper (30 Tons)",
      tonnageCapacity: "30",
      driverName: "Sikiru Adebayo",
      driverLicence: "FRSC-OG-882910-A",
      driverPhone: "08033344455",
    },
    {
      plateNumber: "OG-619-B02",
      chassisNumber: "WDB9340321K441092",
      vehicleMakeModel: "Mercedes Actros 3340 (30 Tons)",
      tonnageCapacity: "30",
      driverName: "Kazeem Oladipo",
      driverLicence: "FRSC-OG-772911-B",
      driverPhone: "08022233344",
    },
  ]);

  // Calculations
  const totalFleetTonnage = useMemo(() => {
    return vehicles.reduce(
      (acc, v) => acc + (parseFloat(v.tonnageCapacity) || 0),
      0,
    );
  }, [vehicles]);

  // Handlers for Vehicles
  const addVehicle = () => {
    setVehicles((prev) => [
      ...prev,
      {
        plateNumber: "",
        chassisNumber: "",
        vehicleMakeModel: "Sinotruk Howo 371 (30 Tons)",
        tonnageCapacity: "30",
        driverName: "",
        driverLicence: "",
        driverPhone: "",
      },
    ]);
  };

  const removeVehicle = (idx: number) => {
    setVehicles((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateVehicle = (
    idx: number,
    field: keyof FleetVehicle,
    val: string,
  ) => {
    setVehicles((prev) => {
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
        !!formData.managingDirector.trim() &&
        !!formData.phone.trim() &&
        !!formData.officeAddress.trim() &&
        !!formData.ward
      );
    }
    if (index === 1) {
      return !!formData.primaryCargo && !!formData.loadingPoints.trim();
    }
    if (index === 2) {
      return (
        vehicles.length > 0 &&
        !!vehicles[0].plateNumber.trim() &&
        !!vehicles[0].driverName.trim()
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
        vehicles: vehicles.filter((v) => v.plateNumber.trim()),
        totalFleetTonnage,
        fleetCount: vehicles.length,
      },
      files: uploadedFiles,

      applicant: initialApplicant || null,
    });
  };

  const reviewSections: ReviewSection[] = [
    {
      title: "Transport Operator & Fleet Profile",
      items: [
        { label: "Company / Operator Name", value: formData.companyName },
        {
          label: "CAC / RC Number",
          value: formData.rcNumber || "Private Carrier",
        },
        {
          label: "Managing Director / Manager",
          value: formData.managingDirector,
        },
        { label: "Contact Phone", value: formData.phone },
        { label: "Email Address", value: formData.email },
        { label: "Operating Office Address", value: formData.officeAddress },
        { label: "Ward in Odeda LGA", value: formData.ward },
        {
          label: "Active Fleet Count",
          value: `${vehicles.length} Heavy Commercial Vehicles`,
        },
      ],
    },
    {
      title: "Haulage Logistics & Transit Corridors",
      items: [
        { label: "Primary Cargo Material", value: formData.primaryCargo },
        { label: "Loading Points / Quarries", value: formData.loadingPoints },
        {
          label: "Destination Route Corridor",
          value: formData.destinationCorridor,
        },
        { label: "Haulage Fee Permit Plan", value: formData.paymentPlan },
        {
          label: "Cumulative Fleet Capacity",
          value: `${totalFleetTonnage} Metric Tons`,
        },
      ],
    },
  ];

  const reviewRepeatableSections: ReviewRepeatableSection[] = [
    {
      title: "Fleet Vehicles & Driver Particulars",
      countLabel: "Vehicles",
      items: vehicles
        .filter((v) => v.plateNumber.trim())
        .map((v) => ({
          "Plate Number": v.plateNumber,
          "Chassis Number": v.chassisNumber,
          "Make & Model": v.vehicleMakeModel,
          Capacity: `${v.tonnageCapacity} Tons`,
          "Assigned Driver": v.driverName,
          "Driver Licence": v.driverLicence,
          "Driver Phone": v.driverPhone,
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
      {/* STEP 1: Operator Profile */}
      {currentStepIndex === 0 && (
        <div className="space-y-4">
          <div className="border-b pb-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary">
              Transport Operator & Fleet Enterprise Profile
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Enter official credentials for commercial haulage transit
              licensing in Odeda LGA.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="companyName">
                Transport Company / Enterprise Name *
              </Label>
              <Input
                id="companyName"
                required
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
                placeholder="e.g. Odeda Heavy Haulage & Logistics Limited"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="managingDirector">
                Managing Director / Fleet Manager *
              </Label>
              <Input
                id="managingDirector"
                required
                value={formData.managingDirector}
                onChange={(e) =>
                  setFormData({ ...formData, managingDirector: e.target.value })
                }
                placeholder="e.g. Alhaji Rasheed Adeyemi"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="rcNumber">
                CAC Registration (RC / BN Number)
              </Label>
              <Input
                id="rcNumber"
                value={formData.rcNumber}
                onChange={(e) =>
                  setFormData({ ...formData, rcNumber: e.target.value })
                }
                placeholder="RC-984321"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Official Contact Phone *</Label>
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
              <Label htmlFor="email">Official Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="fleet@company.com"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ward">Ward Operating Base in Odeda LGA *</Label>
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
              <Label htmlFor="officeAddress">
                Physical Operating Office / Transport Garage Address *
              </Label>
              <Input
                id="officeAddress"
                required
                value={formData.officeAddress}
                onChange={(e) =>
                  setFormData({ ...formData, officeAddress: e.target.value })
                }
                placeholder="Garage / Terminal Address, Highway Corridor, Odeda LGA"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Logistics & Operations */}
      {currentStepIndex === 1 && (
        <div className="space-y-4">
          <div className="border-b pb-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary">
              Logistics Operations & Cargo Transit Corridors
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Specify transported materials, extraction quarries, transit
              permits, and payment plan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="primaryCargo">Primary Cargo Material *</Label>
              <Select
                value={formData.primaryCargo}
                onValueChange={(val) =>
                  setFormData({ ...formData, primaryCargo: val })
                }
              >
                <SelectTrigger id="primaryCargo">
                  <SelectValue placeholder="Select Cargo Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Granite & Quarry Stone Aggregates">
                    Granite & Quarry Stone Aggregates
                  </SelectItem>
                  <SelectItem value="Sand & Laterite Earth Fill">
                    Sand & Laterite Earth Fill
                  </SelectItem>
                  <SelectItem value="Timber, Hardwood & Logs">
                    Timber, Hardwood & Logs
                  </SelectItem>
                  <SelectItem value="Agricultural Produce & Cocoa/Cassava">
                    Agricultural Produce & Cocoa/Cassava
                  </SelectItem>
                  <SelectItem value="Cement & Manufactured Building Materials">
                    Cement & Manufactured Building Materials
                  </SelectItem>
                  <SelectItem value="Petroleum & Industrial Chemicals">
                    Petroleum & Industrial Chemicals
                  </SelectItem>
                  <SelectItem value="General Merchandise & Freight">
                    General Merchandise & Freight
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="paymentPlan">Haulage Permit Schedule *</Label>
              <Select
                value={formData.paymentPlan}
                onValueChange={(val) =>
                  setFormData({ ...formData, paymentPlan: val })
                }
              >
                <SelectTrigger id="paymentPlan">
                  <SelectValue placeholder="Select Permit Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monthly Fleet Haulage Permit Pass">
                    Monthly Fleet Haulage Permit Pass
                  </SelectItem>
                  <SelectItem value="Quarterly Fleet Transit Sticker">
                    Quarterly Fleet Transit Sticker
                  </SelectItem>
                  <SelectItem value="Annual Heavy Haulage Operating Licence">
                    Annual Heavy Haulage Operating Licence
                  </SelectItem>
                  <SelectItem value="Single-Trip Statutory Haulage Ticket">
                    Single-Trip Statutory Haulage Ticket
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="loadingPoints">
                Primary Loading Points / Quarry Sites in Odeda *
              </Label>
              <Input
                id="loadingPoints"
                required
                value={formData.loadingPoints}
                onChange={(e) =>
                  setFormData({ ...formData, loadingPoints: e.target.value })
                }
                placeholder="e.g. Alagbagba Granite Quarries, Olodo Stone Site, Camp Sand Beach"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="destinationCorridor">
                Primary Destination Highways & Corridors
              </Label>
              <Input
                id="destinationCorridor"
                value={formData.destinationCorridor}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    destinationCorridor: e.target.value,
                  })
                }
                placeholder="e.g. Abeokuta - Ibadan Expressway to Lagos State / Sagamu Interchange"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Fleet Vehicles (REPEATABLE UI) */}
      {currentStepIndex === 2 && (
        <div className="space-y-6">
          <div className="border-b pb-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary">
              Fleet Vehicles & Drivers Roster
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Statutory regulations require itemizing all trucks, tippers,
              tankers, and assigned heavy-duty drivers.
            </p>
          </div>

          {/* Fleet Summary Card */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 text-primary rounded-lg">
                <Gauge className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold block">
                  Total Active Fleet Tonnage
                </span>
                <h4 className="text-lg font-bold text-foreground">
                  {totalFleetTonnage} Metric Tons{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    ({vehicles.length} Trucks Enrolled)
                  </span>
                </h4>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addVehicle}
              className="gap-1 text-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Add Fleet Truck
            </Button>
          </div>

          {/* REPEATABLE SECTION: Vehicles */}
          <div className="space-y-4">
            {vehicles.map((v, idx) => (
              <div
                key={idx}
                className="bg-muted/10 border rounded-xl p-4 space-y-3 relative group"
              >
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-primary" />
                    <span className="font-bold text-xs text-foreground">
                      Truck #{idx + 1}: {v.plateNumber || "New Vehicle"} (
                      {v.vehicleMakeModel})
                    </span>
                  </div>
                  {vehicles.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeVehicle(idx)}
                      className="text-red-500 hover:text-red-700 h-7 px-2 text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Plate / Reg Number *</Label>
                    <Input
                      value={v.plateNumber}
                      onChange={(e) =>
                        updateVehicle(idx, "plateNumber", e.target.value)
                      }
                      placeholder="e.g. OG-482-A01"
                      className="font-mono uppercase font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Chassis / VIN Number</Label>
                    <Input
                      value={v.chassisNumber}
                      onChange={(e) =>
                        updateVehicle(idx, "chassisNumber", e.target.value)
                      }
                      placeholder="Chassis Number"
                      className="font-mono text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Make & Model *</Label>
                    <Input
                      value={v.vehicleMakeModel}
                      onChange={(e) =>
                        updateVehicle(idx, "vehicleMakeModel", e.target.value)
                      }
                      placeholder="e.g. Mack 10-Tyre Tipper"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Tonnage Capacity (Tons) *</Label>
                    <Select
                      value={v.tonnageCapacity}
                      onValueChange={(val) =>
                        updateVehicle(idx, "tonnageCapacity", val)
                      }
                    >
                      <SelectTrigger className="text-xs h-9">
                        <SelectValue placeholder="Tonnage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">
                          10 Tons (Light Tipper)
                        </SelectItem>
                        <SelectItem value="20">
                          20 Tons (6-Tyre Truck)
                        </SelectItem>
                        <SelectItem value="30">
                          30 Tons (10-Tyre Tipper)
                        </SelectItem>
                        <SelectItem value="45">
                          45 Tons (Articulated Trailer)
                        </SelectItem>
                        <SelectItem value="60">
                          60+ Tons (Heavy Multi-Axle)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-dashed">
                  <div className="space-y-1">
                    <Label className="text-xs">Assigned Driver Name *</Label>
                    <Input
                      value={v.driverName}
                      onChange={(e) =>
                        updateVehicle(idx, "driverName", e.target.value)
                      }
                      placeholder="Driver Full Name"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Driver's Licence No</Label>
                    <Input
                      value={v.driverLicence}
                      onChange={(e) =>
                        updateVehicle(idx, "driverLicence", e.target.value)
                      }
                      placeholder="FRSC Licence No"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Driver Phone</Label>
                    <Input
                      value={v.driverPhone}
                      onChange={(e) =>
                        updateVehicle(idx, "driverPhone", e.target.value)
                      }
                      placeholder="Driver Phone No"
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
          declarationText="I solemnly declare that the registered fleet vehicles, driver licences, tonnage capacities, and loading point declarations comply strictly with Odeda Local Government Haulage Regulations, Highway Axle-Load Limits, and Traffic Safety Bye-laws."
        />
      )}
    </FormWizard>
  );
}
