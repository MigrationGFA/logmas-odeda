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
import { Plus, Trash2, Store, ShoppingBag, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Props {
  service: OdedaService;
  onSubmit: (formData: Record<string, any>) => void;
  isSubmitting?: boolean;
}

interface ProductLine {
  itemCategory: string;
  stockValue: string;
  sourceSupplier: string;
}

interface KioskAttendant {
  fullName: string;
  role: string;
  phone: string;
}

interface SafetyFixture {
  fixtureType: string;
  quantity: string;
}

const STEPS: FormStep[] = [
  {
    id: "operator_profile",
    title: "Kiosk Operator & Enterprise Identity",
    shortTitle: "Operator Identity",
    description: "Enter kiosk operator personal details, trade category, and residential address in Odeda LGA.",
  },
  {
    id: "structure_setback",
    title: "Kiosk Structure, Setback & Sanitation",
    shortTitle: "Structure & Setback",
    description: "Provide physical dimensions, material fabrication, road setback, and waste disposal.",
  },
  {
    id: "products_staff_fixtures",
    title: "Retail Products, Staff & Safety Fixtures",
    shortTitle: "Products & Staff",
    description: "Itemize merchandise product lines, sales attendants, and fire safety fixtures.",
  },
  {
    id: "documents",
    title: "Supporting Documents",
    shortTitle: "Documents",
    description: "Upload kiosk site photograph, landowner consent letter, passport photo, and ID card.",
  },
  {
    id: "review",
    title: "Review & Submit",
    shortTitle: "Review",
    description: "Review kiosk licensing particulars and submit for statutory LGA market permit.",
  },
];

const DOCUMENTS: DocumentSpec[] = [
  {
    id: "kiosk_photo",
    label: "Proposed Kiosk Location / Structure Photograph",
    description: "Clear photo showing the kiosk structure and its surrounding roadside environment.",
    required: true,
    acceptedFormats: ".jpg,.jpeg,.png",
  },
  {
    id: "landowner_consent",
    label: "Written Consent of Landowner / Space Allottee",
    description: "Letter from the property owner, frontage landlord, or market master granting permission.",
    required: true,
  },
  {
    id: "passport_photo",
    label: "Operator Passport Photograph",
    description: "Recent color passport photograph of the principal kiosk operator.",
    required: true,
    acceptedFormats: ".jpg,.jpeg,.png",
  },
  {
    id: "operator_id",
    label: "Operator National ID / NIN Slip",
    description: "Valid National Identity Card, NIN Slip, or Voter's Card.",
    required: true,
  },
];

export default function KioskLicenceForm({ service, onSubmit, isSubmitting }: Props) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});
  const [declaration, setDeclaration] = useState(false);

  // Form Basic Info
  const [formData, setFormData] = useState({
    operatorName: "",
    tradingName: "",
    tradeCategory: "Provisions, Cold Drinks & Retail FMCG",
    phone: "",
    email: "",
    residentialAddress: "",
    ward: WARDS[0] || "Odeda",
    nin: "",
    proposedLocation: "Opposite Community Primary School Gate, Odeda",
    structureType: "Fabricated Metal Container (8ft x 10ft)",
    dimensions: "8ft x 10ft (Footprint 7.4 sqm)",
    setbackFromRoad: "3.5 Metres from Road Kerb / Drainage",
    powerSource: "Rechargeable Solar LED Light & Small 1.5kVA Generator",
    wasteManagement: "Dedicated Covered Waste Bin & Municipal PSP Collection",
  });

  // Repeatable: Product Lines
  const [productLines, setProductLines] = useState<ProductLine[]>([
    { itemCategory: "Packaged Foodstuff, Beverages & Soft Drinks", stockValue: "₦150,000", sourceSupplier: "Abeokuta Major Wholesale Depot" },
    { itemCategory: "Toiletries, Confectioneries & Snacks", stockValue: "₦80,000", sourceSupplier: "Direct FMCG Distributors" },
  ]);

  // Repeatable: Attendants
  const [attendants, setAttendants] = useState<KioskAttendant[]>([
    { fullName: "Bose Adeyemi", role: "Sales Attendant / Cashier", phone: "08033399911" },
  ]);

  // Repeatable: Safety Fixtures
  const [fixtures, setFixtures] = useState<SafetyFixture[]>([
    { fixtureType: "2kg Dry Powder Fire Extinguisher", quantity: "1" },
    { fixtureType: "Reinforced Steel Padlocks & Iron Grille", quantity: "3" },
  ]);

  // Handlers for Products
  const addProductLine = () => {
    setProductLines((prev) => [
      ...prev,
      {
        itemCategory: "",
        stockValue: "₦50,000",
        sourceSupplier: "",
      },
    ]);
  };

  const removeProductLine = (idx: number) => {
    setProductLines((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateProductLine = (idx: number, field: keyof ProductLine, val: string) => {
    setProductLines((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });
  };

  // Handlers for Attendants
  const addAttendant = () => {
    setAttendants((prev) => [
      ...prev,
      {
        fullName: "",
        role: "Sales Assistant",
        phone: "",
      },
    ]);
  };

  const removeAttendant = (idx: number) => {
    setAttendants((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateAttendant = (idx: number, field: keyof KioskAttendant, val: string) => {
    setAttendants((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });
  };

  // Handlers for Fixtures
  const addFixture = () => {
    setFixtures((prev) => [
      ...prev,
      {
        fixtureType: "",
        quantity: "1",
      },
    ]);
  };

  const removeFixture = (idx: number) => {
    setFixtures((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateFixture = (idx: number, field: keyof SafetyFixture, val: string) => {
    setFixtures((prev) => {
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
        !!formData.operatorName.trim() &&
        !!formData.tradingName.trim() &&
        !!formData.phone.trim() &&
        !!formData.residentialAddress.trim() &&
        !!formData.ward &&
        !!formData.nin.trim()
      );
    }
    if (index === 1) {
      return !!formData.proposedLocation.trim() && !!formData.structureType;
    }
    if (index === 2) {
      return productLines.length > 0 && !!productLines[0].itemCategory.trim();
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
      productLines: productLines.filter((p) => p.itemCategory.trim()),
      attendants: attendants.filter((a) => a.fullName.trim()),
      fixtures: fixtures.filter((f) => f.fixtureType.trim()),
      uploadedFiles,
      amount: currentFee,
      revenueHead: service.revenueHead,
      serviceName: service.name,
      applicant: formData.tradingName || formData.operatorName,
    });
  };

  const reviewSections: ReviewSection[] = [
    {
      title: "Kiosk Operator & Enterprise Profile",
      items: [
        { label: "Operator Full Name", value: formData.operatorName },
        { label: "Kiosk / Business Trading Name", value: formData.tradingName },
        { label: "Trade Category", value: formData.tradeCategory },
        { label: "Contact Phone Number", value: formData.phone },
        { label: "Email Address", value: formData.email },
        { label: "National ID (NIN)", value: formData.nin },
        { label: "Residential Address", value: formData.residentialAddress },
        { label: "Ward in Odeda LGA", value: formData.ward },
      ],
    },
    {
      title: "Structure Fabrication, Setback & Hygiene",
      items: [
        { label: "Physical Kiosk Location", value: formData.proposedLocation },
        { label: "Structure Typology", value: formData.structureType },
        { label: "Dimensions / Footprint", value: formData.dimensions },
        { label: "Roadway Setback Distance", value: formData.setbackFromRoad },
        { label: "Power / Lighting Source", value: formData.powerSource },
        { label: "Refuse Disposal Protocol", value: formData.wasteManagement },
      ],
    },
  ];

  const reviewRepeatableSections: ReviewRepeatableSection[] = [
    {
      title: "Retail Merchandise & Inventory Handled",
      countLabel: "Product Lines",
      items: productLines
        .filter((p) => p.itemCategory.trim())
        .map((p) => ({
          "Merchandise Category": p.itemCategory,
          "Estimated Stock Value": p.stockValue,
          "Supplier Channel": p.sourceSupplier,
        })),
    },
    {
      title: "Kiosk Staff & Sales Attendants",
      countLabel: "Attendants",
      items: attendants
        .filter((a) => a.fullName.trim())
        .map((a) => ({
          "Attendant Name": a.fullName,
          "Role / Duty": a.role,
          "Phone Number": a.phone,
        })),
    },
    {
      title: "Installed Safety & Lock Security Fixtures",
      countLabel: "Fixtures",
      items: fixtures
        .filter((f) => f.fixtureType.trim())
        .map((f) => ({
          "Fixture Type": f.fixtureType,
          Quantity: `${f.quantity} Units`,
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
      {/* STEP 1: Operator Identity */}
      {currentStepIndex === 0 && (
        <div className="space-y-4">
          <div className="border-b pb-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary">
              Kiosk Operator & Enterprise Identity
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Enter operator personal credentials and trading enterprise identity for statutory kiosk licensing in Odeda LGA.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="tradingName">Kiosk / Enterprise Business Name *</Label>
              <Input
                id="tradingName"
                required
                value={formData.tradingName}
                onChange={(e) => setFormData({ ...formData, tradingName: e.target.value })}
                placeholder="e.g. Mama Funke Mini Provisions & Cold Drinks Kiosk"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="operatorName">Operator Legal Full Name *</Label>
              <Input
                id="operatorName"
                required
                value={formData.operatorName}
                onChange={(e) => setFormData({ ...formData, operatorName: e.target.value })}
                placeholder="e.g. Mrs. Funke Adebayo"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tradeCategory">Kiosk Commercial Category *</Label>
              <Select value={formData.tradeCategory} onValueChange={(val) => setFormData({ ...formData, tradeCategory: val })}>
                <SelectTrigger id="tradeCategory">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Provisions, Cold Drinks & Retail FMCG">Provisions, Cold Drinks & Retail FMCG</SelectItem>
                  <SelectItem value="Cooked Food, Snacks & Refreshment Kiosk">Cooked Food, Snacks & Refreshment</SelectItem>
                  <SelectItem value="POS Agency Banking & Financial Services">POS Agency Banking & Financial Services</SelectItem>
                  <SelectItem value="Phone Accessories, Gadgets & Electronics">Phone Accessories, Gadgets & Electronics</SelectItem>
                  <SelectItem value="Tailoring, Fashion & Dry Cleaning Depot">Tailoring, Fashion & Dry Cleaning Depot</SelectItem>
                  <SelectItem value="Barbershop / Hair Salon Kiosk">Barbershop / Hair Salon Kiosk</SelectItem>
                  <SelectItem value="Auto Electrician / Battery Charging Booth">Auto Electrician / Battery Booth</SelectItem>
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
                placeholder="kiosk@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="nin">National Identity Number (NIN) *</Label>
              <Input
                id="nin"
                required
                maxLength={11}
                value={formData.nin}
                onChange={(e) => setFormData({ ...formData, nin: e.target.value })}
                placeholder="11-digit NIN"
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
              <Label htmlFor="residentialAddress">Operator Residential Address *</Label>
              <Input
                id="residentialAddress"
                required
                value={formData.residentialAddress}
                onChange={(e) => setFormData({ ...formData, residentialAddress: e.target.value })}
                placeholder="Residential home address in Odeda LGA"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Structure & Setback */}
      {currentStepIndex === 1 && (
        <div className="space-y-4">
          <div className="border-b pb-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary">
              Kiosk Structure, Setback & Sanitation
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ensure compliance with town planning setbacks, drainage clearance, and waste disposal bye-laws.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="proposedLocation">Physical Kiosk Location / Street Frontage *</Label>
              <Input
                id="proposedLocation"
                required
                value={formData.proposedLocation}
                onChange={(e) => setFormData({ ...formData, proposedLocation: e.target.value })}
                placeholder="e.g. Opposite Community Primary School Gate, Odeda Road"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="structureType">Structure Fabrication Material *</Label>
              <Select value={formData.structureType} onValueChange={(val) => setFormData({ ...formData, structureType: val })}>
                <SelectTrigger id="structureType">
                  <SelectValue placeholder="Select Structure" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fabricated Metal Container (8ft x 10ft)">Fabricated Metal Container (8x10)</SelectItem>
                  <SelectItem value="Fabricated Metal Container (6ft x 8ft)">Fabricated Metal Container (6x8)</SelectItem>
                  <SelectItem value="Prefabricated Fiberglass Booth">Prefabricated Fiberglass Booth</SelectItem>
                  <SelectItem value="Movable Wooden Kiosk with Corrugated Roof">Movable Wooden Kiosk</SelectItem>
                  <SelectItem value="Movable Metal Canopy / Lockup Stall">Movable Canopy / Lockup Stall</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dimensions">Footprint Dimensions (Length x Width)</Label>
              <Input
                id="dimensions"
                value={formData.dimensions}
                onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                placeholder="e.g. 8ft x 10ft"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="setbackFromRoad">Setback from Road Kerb / Public Drainage *</Label>
              <Input
                id="setbackFromRoad"
                required
                value={formData.setbackFromRoad}
                onChange={(e) => setFormData({ ...formData, setbackFromRoad: e.target.value })}
                placeholder="e.g. Minimum 3.0 Metres clear of gutter"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="powerSource">Lighting & Power Source</Label>
              <Input
                id="powerSource"
                value={formData.powerSource}
                onChange={(e) => setFormData({ ...formData, powerSource: e.target.value })}
                placeholder="e.g. Solar Lamp / Extension line"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="wasteManagement">Sanitation & Waste Disposal Channel</Label>
              <Input
                id="wasteManagement"
                value={formData.wasteManagement}
                onChange={(e) => setFormData({ ...formData, wasteManagement: e.target.value })}
                placeholder="e.g. Covered trash bin with municipal PSP waste collection"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Products, Staff & Fixtures (REPEATABLE UI) */}
      {currentStepIndex === 2 && (
        <div className="space-y-6">
          <div className="border-b pb-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-primary">
              Retail Products, Staff & Safety Fixtures
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Provide complete breakdown of retail goods sold, sales attendants, and fire safety equipment.
            </p>
          </div>

          {/* REPEATABLE SECTION: Product Lines */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-primary" /> Retail Merchandise & Product Lines *
                </h5>
                <p className="text-[11px] text-muted-foreground">
                  Record categories of items sold in the kiosk and estimated capital value.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addProductLine}
                className="gap-1 text-xs h-8"
              >
                <Plus className="w-3.5 h-3.5" /> Add Product Line
              </Button>
            </div>

            {productLines.map((pl, idx) => (
              <div key={idx} className="bg-muted/10 border rounded-xl p-4 space-y-3 relative group">
                <div className="flex items-center justify-between border-b pb-2">
                  <span className="font-bold text-xs text-foreground">Product Line #{idx + 1}: {pl.itemCategory || "New Line"}</span>
                  {productLines.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeProductLine(idx)}
                      className="text-red-500 hover:text-red-700 h-7 px-2 text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-xs">Merchandise Category *</Label>
                    <Input
                      value={pl.itemCategory}
                      onChange={(e) => updateProductLine(idx, "itemCategory", e.target.value)}
                      placeholder="e.g. Cold Soft Drinks, Biscuits & Toiletries"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Estimated Stock Value</Label>
                    <Input
                      value={pl.stockValue}
                      onChange={(e) => updateProductLine(idx, "stockValue", e.target.value)}
                      placeholder="e.g. ₦100,000"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Supplier Channel</Label>
                    <Input
                      value={pl.sourceSupplier}
                      onChange={(e) => updateProductLine(idx, "sourceSupplier", e.target.value)}
                      placeholder="e.g. Wholesale Market"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* REPEATABLE SECTION: Attendants */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-primary" /> Kiosk Staff & Sales Attendants
                </h5>
                <p className="text-[11px] text-muted-foreground">
                  Record sales assistants or apprentices operating the kiosk.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addAttendant}
                className="gap-1 text-xs h-8"
              >
                <Plus className="w-3.5 h-3.5" /> Add Attendant
              </Button>
            </div>

            <div className="space-y-2.5">
              {attendants.map((att, idx) => (
                <div key={idx} className="bg-card border rounded-lg p-3 grid grid-cols-1 sm:grid-cols-5 gap-2.5 items-end">
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-[11px]">Attendant Name</Label>
                    <Input
                      value={att.fullName}
                      onChange={(e) => updateAttendant(idx, "fullName", e.target.value)}
                      placeholder="Full Name"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">Role / Duty</Label>
                    <Input
                      value={att.role}
                      onChange={(e) => updateAttendant(idx, "role", e.target.value)}
                      placeholder="Sales Attendant"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">Phone Number</Label>
                    <Input
                      value={att.phone}
                      onChange={(e) => updateAttendant(idx, "phone", e.target.value)}
                      placeholder="080..."
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttendant(idx)}
                      className="text-red-500 hover:text-red-700 h-8 px-2 text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* REPEATABLE SECTION: Safety Fixtures */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-bold text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-primary" /> Safety & Security Fixtures
                </h5>
                <p className="text-[11px] text-muted-foreground">
                  Record fire extinguishers, security padlocks, and solar lamps installed.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFixture}
                className="gap-1 text-xs h-8"
              >
                <Plus className="w-3.5 h-3.5" /> Add Fixture
              </Button>
            </div>

            <div className="space-y-2.5">
              {fixtures.map((fix, idx) => (
                <div key={idx} className="bg-card border rounded-lg p-3 grid grid-cols-1 sm:grid-cols-5 gap-2.5 items-end">
                  <div className="space-y-1 sm:col-span-3">
                    <Label className="text-[11px]">Fixture / Equipment Type</Label>
                    <Input
                      value={fix.fixtureType}
                      onChange={(e) => updateFixture(idx, "fixtureType", e.target.value)}
                      placeholder="e.g. 2kg Fire Extinguisher / Heavy-Duty Padlocks"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px]">Quantity</Label>
                    <Input
                      value={fix.quantity}
                      onChange={(e) => updateFixture(idx, "quantity", e.target.value)}
                      placeholder="1"
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFixture(idx)}
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
          declarationText="I solemnly declare that the kiosk dimensions, location frontage, trade merchandise, and safety equipment conform strictly with the Kiosk Licensing and Market Bye-Laws of Odeda Local Government, Ogun State."
        />
      )}
    </FormWizard>
  );
}
