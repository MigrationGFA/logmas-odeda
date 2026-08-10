"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WARDS } from "@/lib/mock-data";
import { Checkbox } from "@/components/ui/checkbox";
import { OdedaService } from "@/config/odedaServices";
import { Upload, FileCheck } from "lucide-react";

interface Props {
  service: OdedaService;
  onSubmit: (formData: Record<string, any>) => void;
  isSubmitting?: boolean;
}

export default function EnvironmentalSanitationForm({ service, onSubmit, isSubmitting }: Props) {
  const [formData, setFormData] = useState({
    businessName: "",
    facilityType: "Commercial Complex / Shopping Plaza",
    address: "",
    ward: WARDS[0] || "Odeda",
    contactPerson: "",
    phone: "",
    wasteProvider: "Odeda LGA Waste Management Board",
    sanitationFacilities: "Flush Toilets & Covered Waste Bins",
    declaration: false,
  });

  const [files, setFiles] = useState<Record<string, string>>({});

  const handleFileChange = (docName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFiles((prev) => ({ ...prev, [docName]: e.target.files![0].name }));
    }
  };

  const calculateFee = () => {
    switch (formData.facilityType) {
      case "Industrial Factory / Quarry Plant": return 50000;
      case "Hotel / Hospital / Event Center": return 35000;
      case "Commercial Complex / Shopping Plaza": return 20000;
      default: return 15000;
    }
  };

  const calculatedFee = calculateFee();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.declaration) return;
    onSubmit({
      ...formData,
      uploadedFiles: files,
      amount: calculatedFee,
      revenueHead: service.revenueHead,
      serviceName: service.name,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-orange-500/10 p-4 rounded-lg border border-orange-500/20 flex justify-between items-center">
        <div>
          <h4 className="font-semibold text-orange-700 dark:text-orange-300">{service.name}</h4>
          <p className="text-xs text-muted-foreground">{service.revenueHead} • Tiered Assessment</p>
        </div>
        <span className="text-lg font-bold text-orange-700 dark:text-orange-300">₦{calculatedFee.toLocaleString()}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="businessName">Premises / Facility Name *</Label>
          <Input
            id="businessName"
            required
            value={formData.businessName}
            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
            placeholder="e.g. Obantoko Commercial Plaza"
          />
        </div>

        <div>
          <Label htmlFor="facilityType">Facility Category *</Label>
          <Select value={formData.facilityType} onValueChange={(val) => setFormData({ ...formData, facilityType: val })}>
            <SelectTrigger id="facilityType">
              <SelectValue placeholder="Select Facility Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Small Shop / Eatery (₦15,000)">Small Shop / Eatery (₦15,000)</SelectItem>
              <SelectItem value="Commercial Complex / Shopping Plaza">Commercial Complex (₦20,000)</SelectItem>
              <SelectItem value="Hotel / Hospital / Event Center">Hotel / Hospital / Event Center (₦35,000)</SelectItem>
              <SelectItem value="Industrial Factory / Quarry Plant">Industrial / Quarry Plant (₦50,000)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="ward">Facility Ward *</Label>
          <Select value={formData.ward} onValueChange={(val) => setFormData({ ...formData, ward: val })}>
            <SelectTrigger id="ward">
              <SelectValue placeholder="Select Ward" />
            </SelectTrigger>
            <SelectContent>
              {WARDS.map((w) => (
                <SelectItem key={w} value={w}>{w} Ward</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="contactPerson">Contact Manager Name *</Label>
          <Input
            id="contactPerson"
            required
            value={formData.contactPerson}
            onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="wasteProvider">Waste Disposal Method</Label>
          <Input
            id="wasteProvider"
            value={formData.wasteProvider}
            onChange={(e) => setFormData({ ...formData, wasteProvider: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="address">Physical Premises Address *</Label>
        <Input
          id="address"
          required
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
      </div>

      <div className="border-t pt-4">
        <h5 className="font-medium mb-3 text-sm text-foreground">Required Documents</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {service.requiredDocuments.map((doc, idx) => (
            <div key={idx} className="border rounded-md p-3 bg-muted/20 flex items-center justify-between">
              <div className="text-xs space-y-1 pr-2">
                <span className="font-medium block">{doc}</span>
                {files[doc] ? (
                  <span className="text-success flex items-center gap-1 font-medium">
                    <FileCheck className="h-3 w-3" /> {files[doc]}
                  </span>
                ) : (
                  <span className="text-muted-foreground">PDF or JPG (Max 5MB)</span>
                )}
              </div>
              <Label htmlFor={`doc-sanitation-${idx}`} className="cursor-pointer bg-background border px-3 py-1.5 rounded text-xs font-medium hover:bg-accent flex items-center gap-1 shrink-0">
                <Upload className="h-3 w-3" />
                Upload
              </Label>
              <input
                type="file"
                id={`doc-sanitation-${idx}`}
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) => handleFileChange(doc, e)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <Checkbox
          id="declaration-sanitation"
          checked={formData.declaration}
          onCheckedChange={(checked) => setFormData({ ...formData, declaration: !!checked })}
        />
        <Label htmlFor="declaration-sanitation" className="text-xs leading-none">
          I confirm that these premises meet public health and waste management standards of Odeda LGA.
        </Label>
      </div>

      <Button type="submit" disabled={!formData.declaration || isSubmitting} className="w-full bg-orange-600 hover:bg-orange-700 text-white">
        {isSubmitting ? "Submitting Application..." : `Pay ₦${calculatedFee.toLocaleString()} & Request Inspection`}
      </Button>
    </form>
  );
}
