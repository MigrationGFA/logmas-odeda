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

export default function TenementRateForm({ service, onSubmit, isSubmitting }: Props) {
  const [formData, setFormData] = useState({
    ownerName: "",
    phone: "",
    email: "",
    propertyAddress: "",
    ward: WARDS[0] || "Odeda",
    propertyCategory: "Residential (Bungalow / Duplex)",
    numberOfUnits: "1",
    assessmentYear: "2026",
    declaration: false,
  });

  const [files, setFiles] = useState<Record<string, string>>({});

  const handleFileChange = (docName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFiles((prev) => ({ ...prev, [docName]: e.target.files![0].name }));
    }
  };

  const calculateRate = () => {
    const units = parseInt(formData.numberOfUnits) || 1;
    switch (formData.propertyCategory) {
      case "Industrial / Factory Premises": return 100000;
      case "Commercial Plaza / Banking Hall": return 50000;
      case "Residential (Tenement / Rooming House)": return 12000 * Math.min(units, 5);
      case "Residential (Bungalow / Duplex)": return 25000;
      default: return 15000;
    }
  };

  const calculatedFee = calculateRate();

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
      <div className="bg-primary/10 p-4 rounded-lg border border-primary/20 flex justify-between items-center">
        <div>
          <h4 className="font-semibold text-primary">{service.name} Assessment</h4>
          <p className="text-xs text-muted-foreground">{service.revenueHead} • Statutory Assessment</p>
        </div>
        <span className="text-lg font-bold text-primary">₦{calculatedFee.toLocaleString()}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="ownerName">Property Owner / Agent Name *</Label>
          <Input
            id="ownerName"
            required
            value={formData.ownerName}
            onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
            placeholder="e.g. Chief Olusanya"
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
          <Label htmlFor="propertyCategory">Property Type / Category *</Label>
          <Select value={formData.propertyCategory} onValueChange={(val) => setFormData({ ...formData, propertyCategory: val })}>
            <SelectTrigger id="propertyCategory">
              <SelectValue placeholder="Select Property Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Residential (Bungalow / Duplex)">Residential (Bungalow / Duplex) — ₦25,000</SelectItem>
              <SelectItem value="Residential (Tenement / Rooming House)">Residential (Rooming House) — Multi-unit</SelectItem>
              <SelectItem value="Commercial Plaza / Banking Hall">Commercial Plaza / Bank — ₦50,000</SelectItem>
              <SelectItem value="Industrial / Factory Premises">Industrial / Factory Premises — ₦100,000</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="ward">Property Ward *</Label>
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
          <Label htmlFor="numberOfUnits">Number of Storeys / Apartments / Units</Label>
          <Input
            id="numberOfUnits"
            type="number"
            value={formData.numberOfUnits}
            onChange={(e) => setFormData({ ...formData, numberOfUnits: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="assessmentYear">Assessment Year</Label>
          <Input
            id="assessmentYear"
            value={formData.assessmentYear}
            onChange={(e) => setFormData({ ...formData, assessmentYear: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="propertyAddress">Full Property Street Address *</Label>
        <Input
          id="propertyAddress"
          required
          value={formData.propertyAddress}
          onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })}
          placeholder="e.g. 12 Obantoko Main Expressway, Odeda LGA"
        />
      </div>

      <div className="border-t pt-4">
        <h5 className="font-medium mb-3 text-sm text-foreground">Required Property Documents</h5>
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
              <Label htmlFor={`doc-tenement-${idx}`} className="cursor-pointer bg-background border px-3 py-1.5 rounded text-xs font-medium hover:bg-accent flex items-center gap-1 shrink-0">
                <Upload className="h-3 w-3" />
                Upload
              </Label>
              <input
                type="file"
                id={`doc-tenement-${idx}`}
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
          id="declaration-tenement"
          checked={formData.declaration}
          onCheckedChange={(checked) => setFormData({ ...formData, declaration: !!checked })}
        />
        <Label htmlFor="declaration-tenement" className="text-xs leading-none">
          I confirm that I am authorized to settle tenement rate for this property in Odeda LGA.
        </Label>
      </div>

      <Button type="submit" disabled={!formData.declaration || isSubmitting} className="w-full">
        {isSubmitting ? "Processing Rate Assessment..." : `Pay ₦${calculatedFee.toLocaleString()} & Obtain Tenement Clearance`}
      </Button>
    </form>
  );
}
