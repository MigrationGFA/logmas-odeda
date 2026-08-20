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
import { Plus, Trash2, Wine, Users, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ApplicantSnapshot } from "../ApplicantSelectionStep";

interface Props {
  service: OdedaService;
  onSubmit: (formData: Record<string, any>) => void;
  isSubmitting?: boolean;
  initialApplicant?: ApplicantSnapshot;
}

interface BeverageCategory {
  categoryName: string;
  brandsHandled: string;
  monthlyVolume: string;
  supplyDistributor: string;
}

interface BarStaff {
  fullName: string;
  role: string;
  phone: string;
  hygieneCert: string;
}

interface ServingArea {
  areaName: string;
  capacity: string;
  safetyExit: string;
}

const STEPS: FormStep[] = [
  {
    id: "licensee_premises",
    title: "Licensee & Premises Identity",
    shortTitle: "Premises Profile",
    description:
      "Enter licensee details, trading establishment name, and physical location in Odeda LGA.",
  },
  {
    id: "fire_zoning",
    title: "Fire Safety, Zoning & Compliance",
    shortTitle: "Safety & Zoning",
    description:
      "Provide statutory setback from educational/religious institutions, exits, and noise controls.",
  },
  {
    id: "inventory_staff_bars",
    title: "Beverage Categories, Bar Staff & Serving Lounges",
    shortTitle: "Inventory & Staff",
    description:
      "Itemize alcoholic product lines, certified bartenders, and serving lounges.",
  },
  {
    id: "documents",
    title: "Supporting Documents",
    shortTitle: "Documents",
    description:
      "Upload premises floor plan, fire safety clearance, police report, and health certificates.",
  },
  {
    id: "review",
    title: "Review & Submit",
    shortTitle: "Review",
    description:
      "Verify statutory liquor licence application and submit for LGA Board inspection.",
  },
];

const DOCUMENTS: DocumentSpec[] = [
  {
    id: "premises_plan",
    label: "Bar & Premises Architectural Floor Plan",
    description:
      "Layout showing bar counter, seating area, emergency exits, and restrooms.",
    required: true,
  },
  {
    id: "fire_clearance",
    label: "Fire Service Inspection Clearance Certificate",
    description: "Valid certificate issued by the Ogun State Fire Service.",
    required: true,
  },
  {
    id: "police_clearance",
    label: "Police Character Clearance / Station Report",
    description:
      "Report confirming licensee has no criminal conviction regarding disorderly conduct.",
    required: true,
  },
  {
    id: "hygiene_cert",
    label: "Food & Beverage Handlers Medical Certificate",
    description: "Fitness certificates for bar tenders and kitchen staff.",
    required: true,
  },
  {
    id: "cac_cert",
    label: "CAC Business Registration Certificate",
    description: "Certificate of Incorporation or Business Name Registration.",
    required: false,
  },
];

export default function LiquorLicenceForm({
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
    licenseeName: "",
    tradingName: "",
    licenceType: "Retail Liquor Bar & Lounge",
    contactPerson: "",
    phone: "",
    email: "",
    premisesAddress: "",
    ward: WARDS[0] || "Odeda",
    cacNumber: "",
    seatingCapacity: "80 Persons",
    operatingHours: "12:00 PM - 12:00 AM (Midnight)",
    distanceFromSchool: "More than 500 Meters",
    fireExtinguishersCount: "4 Cylinders (CO2 & Dry Powder)",
    emergencyExitsCount: "2 Dedicated Emergency Exits",
    soundproofing: "Enclosed Acoustic Panelling & Regulated Decibels",
    underagePolicy: "Strict 'No Under-18 Sale / Entry' Policy Enforced",
  });

  // Repeatable: Beverage Categories
  const [beverageCategories, setBeverageCategories] = useState<
    BeverageCategory[]
  >([
    {
      categoryName: "Malt Beverages, Stouts & Lagers",
      brandsHandled: "Heineken, Guinness, Trophy, Star",
      monthlyVolume: "400 Crates",
      supplyDistributor: "Nigerian Breweries Major Depot",
    },
    {
      categoryName: "Spirits, Whiskies & Liqueurs",
      brandsHandled: "Johnnie Walker, Hennessy, Jameson",
      monthlyVolume: "50 Cartons",
      supplyDistributor: "Direct Brand Wholesaler",
    },
    {
      categoryName: "Wines & Champagnes",
      brandsHandled: "Carlo Rossi, Moët, Baron Romero",
      monthlyVolume: "30 Cartons",
      supplyDistributor: "Abeokuta Wine Distributors",
    },
  ]);

  // Repeatable: Staff Roster
  const [staff, setStaff] = useState<BarStaff[]>([
    {
      fullName: "Segun Oduwole",
      role: "Head Bar Supervisor",
      phone: "08055566778",
      hygieneCert: "MOH-OD-2024-110",
    },
    {
      fullName: "Blessing Eze",
      role: "Lead Mixologist / Bartender",
      phone: "08077788990",
      hygieneCert: "MOH-OD-2024-111",
    },
  ]);

  // Repeatable: Serving Lounges
  const [servingAreas, setServingAreas] = useState<ServingArea[]>([
    {
      areaName: "Main Air-Conditioned Lounge",
      capacity: "50 Persons",
      safetyExit: "Dual Fire Doors to Open Compound",
    },
    {
      areaName: "Outdoor Garden & Terrace Deck",
      capacity: "30 Persons",
      safetyExit: "Direct Open Air Access",
    },
  ]);

  // Handlers for Beverage Categories
  const addCategory = () => {
    setBeverageCategories((prev) => [
      ...prev,
      {
        categoryName: "",
        brandsHandled: "",
        monthlyVolume: "20 Crates",
        supplyDistributor: "",
      },
    ]);
  };

  const removeCategory = (idx: number) => {
    setBeverageCategories((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateCategory = (
    idx: number,
    field: keyof BeverageCategory,
    val: string,
  ) => {
    setBeverageCategories((prev) => {
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
        role: "Bartender",
        phone: "",
        hygieneCert: "",
      },
    ]);
  };

  const removeStaff = (idx: number) => {
    setStaff((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateStaff = (idx: number, field: keyof BarStaff, val: string) => {
    setStaff((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });
  };

  // Handlers for Serving Areas
  const addServingArea = () => {
    setServingAreas((prev) => [
      ...prev,
      {
        areaName: "",
        capacity: "20 Persons",
        safetyExit: "Fire Door",
      },
    ]);
  };

  const removeServingArea = (idx: number) => {
    setServingAreas((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateServingArea = (
    idx: number,
    field: keyof ServingArea,
    val: string,
  ) => {
    setServingAreas((prev) => {
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
        !!formData.licenseeName.trim() &&
        !!formData.tradingName.trim() &&
        !!formData.phone.trim() &&
        !!formData.premisesAddress.trim() &&
        !!formData.ward
      );
    }
    if (index === 1) {
      return (
        !!formData.distanceFromSchool &&
        !!formData.fireExtinguishersCount.trim()
      );
    }
    if (index === 2) {
      return (
        beverageCategories.length > 0 &&
        !!beverageCategories[0].categoryName.trim()
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

        beverageCategories: beverageCategories.filter((b) =>
          b.categoryName.trim(),
        ),
        staff: staff.filter((s) => s.fullName.trim()),
        servingAreas: servingAreas.filter((a) => a.areaName.trim()),
      },
      files: uploadedFiles,

      applicant: initialApplicant || null,
    });
  };

  const reviewSections: ReviewSection[] = [
    {
      title: "Licensee & Commercial Establishment",
      items: [
        { label: "Licensee Legal Name", value: formData.licenseeName },
        { label: "Bar / Lounge Trading Name", value: formData.tradingName },
        { label: "Liquor Licence Classification", value: formData.licenceType },
        { label: "Contact Phone Number", value: formData.phone },
        { label: "Email Address", value: formData.email },
        { label: "Premises Physical Address", value: formData.premisesAddress },
        { label: "Ward in Odeda LGA", value: formData.ward },
        { label: "CAC Registration", value: formData.cacNumber },
        { label: "Total Seating Capacity", value: formData.seatingCapacity },
        { label: "Operating Hours", value: formData.operatingHours },
      ],
    },
    {
      title: "Fire Safety, Zoning & Juvenile Protection",
      items: [
        {
          label: "Setback from Schools/Churches",
          value: formData.distanceFromSchool,
        },
        {
          label: "Fire Extinguishers Installed",
          value: formData.fireExtinguishersCount,
        },
        {
          label: "Dedicated Emergency Exits",
          value: formData.emergencyExitsCount,
        },
        { label: "Acoustic / Decibel Control", value: formData.soundproofing },
        { label: "Underage Prohibition", value: formData.underagePolicy },
      ],
    },
  ];

  const reviewRepeatableSections: ReviewRepeatableSection[] = [
    {
      title: "Alcoholic Product Lines & Wholesale Suppliers",
      countLabel: "Beverage Lines",
      items: beverageCategories
        .filter((b) => b.categoryName.trim())
        .map((b) => ({
          "Product Category": b.categoryName,
          "Brands Handled": b.brandsHandled,
          "Monthly Inventory": b.monthlyVolume,
          "Authorized Supplier": b.supplyDistributor,
        })),
    },
    {
      title: "Certified Bartending & Service Staff",
      countLabel: "Staff Members",
      items: staff
        .filter((s) => s.fullName.trim())
        .map((s) => ({
          "Staff Name": s.fullName,
          "Designation / Role": s.role,
          "Phone Number": s.phone,
          "Hygiene / Medical Cert": s.hygieneCert,
        })),
    },
    {
      title: "Internal Serving Lounges & Decks",
      countLabel: "Lounges",
      items: servingAreas
        .filter((a) => a.areaName.trim())
        .map((a) => ({
          "Lounge / Area": a.areaName,
          "Seating Capacity": a.capacity,
          "Emergency Evacuation Route": a.safetyExit,
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
      {/* STEP 1: Licensee & Premises */}
      {currentStepIndex === 0 && (
        <div className="space-y-4">
          <div className="border-b pb-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary">
              Licensee & Premises Identity
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Enter bar operator details, licensed premises location, and
              trading category in Odeda LGA.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="tradingName">
                Bar / Lounge / Establishment Trading Name *
              </Label>
              <Input
                id="tradingName"
                required
                value={formData.tradingName}
                onChange={(e) =>
                  setFormData({ ...formData, tradingName: e.target.value })
                }
                placeholder="e.g. Obantoko Oasis Lounge & Bar"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="licenseeName">
                Licensee Legal Name / Proprietor *
              </Label>
              <Input
                id="licenseeName"
                required
                value={formData.licenseeName}
                onChange={(e) =>
                  setFormData({ ...formData, licenseeName: e.target.value })
                }
                placeholder="e.g. Mr. Femi Alabi"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="licenceType">Liquor Licence Category *</Label>
              <Select
                value={formData.licenceType}
                onValueChange={(val) =>
                  setFormData({ ...formData, licenceType: val })
                }
              >
                <SelectTrigger id="licenceType">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Retail Liquor Bar & Lounge">
                    Retail Liquor Bar & Lounge
                  </SelectItem>
                  <SelectItem value="Hotel / Resort Bar Licence">
                    Hotel / Resort Bar Licence
                  </SelectItem>
                  <SelectItem value="Wholesale Liquor Depot / Distributor">
                    Wholesale Liquor Depot / Distributor
                  </SelectItem>
                  <SelectItem value="Nightclub & Entertainment Lounge">
                    Nightclub & Entertainment Lounge
                  </SelectItem>
                  <SelectItem value="Supermarket / Wine Store Retail Off-Licence">
                    Supermarket / Wine Store Off-Licence
                  </SelectItem>
                  <SelectItem value="Restaurant Table Wine & Beer Licence">
                    Restaurant Table Wine & Beer
                  </SelectItem>
                </SelectContent>
              </Select>
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
                placeholder="lounge@example.com"
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
                placeholder="BN-789012"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="premisesAddress">
                Premises Physical Location Address *
              </Label>
              <Input
                id="premisesAddress"
                required
                value={formData.premisesAddress}
                onChange={(e) =>
                  setFormData({ ...formData, premisesAddress: e.target.value })
                }
                placeholder="Building No, Street name, Town in Odeda LGA"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="seatingCapacity">Customer Seating Capacity</Label>
              <Input
                id="seatingCapacity"
                value={formData.seatingCapacity}
                onChange={(e) =>
                  setFormData({ ...formData, seatingCapacity: e.target.value })
                }
                placeholder="e.g. 100 Persons"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="operatingHours">Daily Operating Hours</Label>
              <Input
                id="operatingHours"
                value={formData.operatingHours}
                onChange={(e) =>
                  setFormData({ ...formData, operatingHours: e.target.value })
                }
                placeholder="e.g. 2:00 PM - 12:00 AM"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Safety & Zoning */}
      {currentStepIndex === 1 && (
        <div className="space-y-4">
          <div className="border-b pb-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary">
              Fire Safety, Zoning & Juvenile Protection
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ensure statutory compliance regarding minimum setbacks, fire
              preparedness, and sound control.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="distanceFromSchool">
                Setback from Nearest School or Place of Worship *
              </Label>
              <Select
                value={formData.distanceFromSchool}
                onValueChange={(val) =>
                  setFormData({ ...formData, distanceFromSchool: val })
                }
              >
                <SelectTrigger id="distanceFromSchool">
                  <SelectValue placeholder="Select Distance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="More than 500 Meters">
                    More than 500 Meters (Compliant)
                  </SelectItem>
                  <SelectItem value="250 to 500 Meters">
                    250 to 500 Meters (Buffer Compliant)
                  </SelectItem>
                  <SelectItem value="Special Commercial Zone / Mall">
                    Special Commercial Zone / Shopping Complex
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="fireExtinguishersCount">
                Fire Fighting Equipment *
              </Label>
              <Input
                id="fireExtinguishersCount"
                required
                value={formData.fireExtinguishersCount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fireExtinguishersCount: e.target.value,
                  })
                }
                placeholder="e.g. 4 Cylinders (CO2 & Dry Powder)"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="emergencyExitsCount">
                Dedicated Emergency Exits
              </Label>
              <Input
                id="emergencyExitsCount"
                value={formData.emergencyExitsCount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emergencyExitsCount: e.target.value,
                  })
                }
                placeholder="e.g. 2 Clear Emergency Exit Doors"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="soundproofing">
                Acoustic & Noise Control Measures
              </Label>
              <Input
                id="soundproofing"
                value={formData.soundproofing}
                onChange={(e) =>
                  setFormData({ ...formData, soundproofing: e.target.value })
                }
                placeholder="e.g. Soundproof enclosure, decibel limiter"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="underagePolicy">Underage Protection Policy</Label>
              <Input
                id="underagePolicy"
                value={formData.underagePolicy}
                onChange={(e) =>
                  setFormData({ ...formData, underagePolicy: e.target.value })
                }
                placeholder="e.g. Prominent warning signage & mandatory ID check at entry"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Inventory, Staff & Lounges (REPEATABLE UI) */}
      {currentStepIndex === 2 && (
        <div className="space-y-6">
          <div className="border-b pb-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary">
              Beverage Categories, Bar Staff & Serving Lounges
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Provide complete breakdown of liquor inventory types, certified
              bartending personnel, and customer serving sections.
            </p>
          </div>

          {/* REPEATABLE SECTION: Product Lines */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Wine className="w-4 h-4 text-primary" /> Liquor Beverage
                  Product Lines *
                </h5>
                <p className="text-[11px] text-muted-foreground">
                  Record categories of alcohol sold and authorized distributors.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCategory}
                className="gap-1 text-xs h-8"
              >
                <Plus className="w-3.5 h-3.5" /> Add Product Line
              </Button>
            </div>

            {beverageCategories.map((b, idx) => (
              <div
                key={idx}
                className="bg-muted/10 border rounded-xl p-4 space-y-3 relative group"
              >
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-bold text-xs text-foreground">
                    Category #{idx + 1}: {b.categoryName || "New Product Line"}
                  </span>
                  {beverageCategories.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCategory(idx)}
                      className="text-red-500 hover:text-red-700 h-7 px-2 text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-xs">Category Name *</Label>
                    <Input
                      value={b.categoryName}
                      onChange={(e) =>
                        updateCategory(idx, "categoryName", e.target.value)
                      }
                      placeholder="e.g. Spirits, Whiskies, Beers, Wines"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Brands Handled</Label>
                    <Input
                      value={b.brandsHandled}
                      onChange={(e) =>
                        updateCategory(idx, "brandsHandled", e.target.value)
                      }
                      placeholder="e.g. Jameson, Hennessy"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Est. Monthly Volume</Label>
                    <Input
                      value={b.monthlyVolume}
                      onChange={(e) =>
                        updateCategory(idx, "monthlyVolume", e.target.value)
                      }
                      placeholder="e.g. 50 Cartons"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-4">
                    <Label className="text-xs">
                      Distributor / Source of Supply
                    </Label>
                    <Input
                      value={b.supplyDistributor}
                      onChange={(e) =>
                        updateCategory(idx, "supplyDistributor", e.target.value)
                      }
                      placeholder="e.g. Authorized Major Distributor, Abeokuta"
                      className="h-8 text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* REPEATABLE SECTION: Staff */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-primary" /> Certified
                  Bartending & Supervisory Staff
                </h5>
                <p className="text-[11px] text-muted-foreground">
                  Record personnel with medical hygiene certificates serving
                  alcohol.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addStaff}
                className="gap-1 text-xs h-8"
              >
                <Plus className="w-3.5 h-3.5" /> Add Staff Member
              </Button>
            </div>

            <div className="space-y-2.5">
              {staff.map((s, idx) => (
                <div
                  key={idx}
                  className="bg-card border rounded-lg p-3 grid grid-cols-1 sm:grid-cols-5 gap-2.5 items-end"
                >
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-[11px]">Staff Full Name</Label>
                    <Input
                      value={s.fullName}
                      onChange={(e) =>
                        updateStaff(idx, "fullName", e.target.value)
                      }
                      placeholder="Staff Name"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">Role / Position</Label>
                    <Input
                      value={s.role}
                      onChange={(e) => updateStaff(idx, "role", e.target.value)}
                      placeholder="Mixologist / Manager"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">Phone / Medical Cert</Label>
                    <Input
                      value={s.phone}
                      onChange={(e) =>
                        updateStaff(idx, "phone", e.target.value)
                      }
                      placeholder="080... / Cert No"
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

          {/* REPEATABLE SECTION: Serving Lounges */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-primary" /> Internal Serving
                  Lounges & Open Bars
                </h5>
                <p className="text-[11px] text-muted-foreground">
                  Itemize distinct service lounges, outdoor gardens, and VIP
                  rooms.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addServingArea}
                className="gap-1 text-xs h-8"
              >
                <Plus className="w-3.5 h-3.5" /> Add Lounge Section
              </Button>
            </div>

            <div className="space-y-2.5">
              {servingAreas.map((sa, idx) => (
                <div
                  key={idx}
                  className="bg-card border rounded-lg p-3 grid grid-cols-1 sm:grid-cols-5 gap-2.5 items-end"
                >
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-[11px]">Lounge / Section Name</Label>
                    <Input
                      value={sa.areaName}
                      onChange={(e) =>
                        updateServingArea(idx, "areaName", e.target.value)
                      }
                      placeholder="e.g. VIP Champagne Lounge"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">Seating Capacity</Label>
                    <Input
                      value={sa.capacity}
                      onChange={(e) =>
                        updateServingArea(idx, "capacity", e.target.value)
                      }
                      placeholder="e.g. 40 Persons"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">Emergency Evacuation</Label>
                    <Input
                      value={sa.safetyExit}
                      onChange={(e) =>
                        updateServingArea(idx, "safetyExit", e.target.value)
                      }
                      placeholder="e.g. Direct Fire Exit"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeServingArea(idx)}
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
          declarationText="I solemnly declare that the liquor licence specifications, safety compliance, age-restriction policies, and premises floor plans stated herein are accurate and comply with the Liquor Licensing Laws of Odeda Local Government, Ogun State."
        />
      )}
    </FormWizard>
  );
}
