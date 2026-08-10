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

export default function QuarryPermitForm({ service, onSubmit, isSubmitting }: Props) {
  const [formData, setFormData] = useState({
    companyName: "",
    cacNumber: "",
    miningCadastreRef: "",
    siteAddress: "",
    ward: WARDS[0] || "Alagbagba",
    siteAreaHectares: "25",
    extractedMaterial: "Granite / Crusher Dust",
    estimatedDailyTonnage: "500",
    contactPerson: "",
    phone: "",
    email: "",
    declaration: false,
  });

  const [files, setFiles] = useState<Record<string, string>>({});

  const handleFileChange = (docName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFiles((prev) => ({ ...prev, [docName]: e.target.files![0].name }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.declaration) return;
    onSubmit({
      ...formData,
      uploadedFiles: files,
      amount: service.defaultFee,
      revenueHead: service.revenueHead,
      serviceName: service.name,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-slate-900/10 p-4 rounded-lg border border-slate-900/20 flex justify-between items-center dark:bg-slate-100/10 dark:border-slate-100/20">
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-slate-100">{service.name} Operating Licence</h4>
          <p className="text-xs text-muted-foreground">{service.revenueHead} • Annual Mining Base Permit</p>
        </div>
        <span className="text-lg font-bold text-slate-900 dark:text-slate-100">₦{service.defaultFee.toLocaleString()}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="companyName">Quarry Operating Company Name *</Label>
          <Input
            id="companyName"
            required
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            placeholder="e.g. Rockfield Granite Quarries Ltd"
          />
        </div>

        <div>
          <Label htmlFor="cacNumber">CAC Certificate Number *</Label>
          <Input
            id="cacNumber"
            required
            value={formData.cacNumber}
            onChange={(e) => setFormData({ ...formData, cacNumber: e.target.value })}
            placeholder="RC-987654"
          />
        </div>

        <div>
          <Label htmlFor="miningCadastreRef">Federal Mining Cadastre Lease / Ref *</Label>
          <Input
            id="miningCadastreRef"
            required
            value={formData.miningCadastreRef}
            onChange={(e) => setFormData({ ...formData, miningCadastreRef: e.target.value })}
            placeholder="QL-2024-ODE-009"
          />
        </div>

        <div>
          <Label htmlFor="ward">Quarry Site Ward *</Label>
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
          <Label htmlFor="extractedMaterial">Primary Mineral Extracted *</Label>
          <Select value={formData.extractedMaterial} onValueChange={(val) => setFormData({ ...formData, extractedMaterial: val })}>
            <SelectTrigger id="extractedMaterial">
              <SelectValue placeholder="Select Mineral" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Granite / Crusher Dust">Granite & Crusher Dust</SelectItem>
              <SelectItem value="Sharp Sand / River Sand">Sharp Sand & River Sand</SelectItem>
              <SelectItem value="Clay & Laterite">Clay & Laterite Soil</SelectItem>
              <SelectItem value="Dimension Stone / Marble">Dimension Stone & Marble</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="estimatedDailyTonnage">Estimated Daily Output Tonnage</Label>
          <Input
            id="estimatedDailyTonnage"
            value={formData.estimatedDailyTonnage}
            onChange={(e) => setFormData({ ...formData, estimatedDailyTonnage: e.target.value })}
            placeholder="e.g. 500 Tons"
          />
        </div>

        <div>
          <Label htmlFor="contactPerson">Quarry Site Manager Name *</Label>
          <Input
            id="contactPerson"
            required
            value={formData.contactPerson}
            onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="phone">Manager Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="siteAddress">Quarry Site Location & GPS Coordinates *</Label>
        <Input
          id="siteAddress"
          required
          value={formData.siteAddress}
          onChange={(e) => setFormData({ ...formData, siteAddress: e.target.value })}
          placeholder="Detailed GPS / Village Location in Odeda LGA"
        />
      </div>

      <div className="border-t pt-4">
        <h5 className="font-medium mb-3 text-sm text-foreground">Required Mining & EIA Compliance Files</h5>
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
              <Label htmlFor={`doc-quarry-${idx}`} className="cursor-pointer bg-background border px-3 py-1.5 rounded text-xs font-medium hover:bg-accent flex items-center gap-1 shrink-0">
                <Upload className="h-3 w-3" />
                Upload
              </Label>
              <input
                type="file"
                id={`doc-quarry-${idx}`}
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
          id="declaration-quarry"
          checked={formData.declaration}
          onCheckedChange={(checked) => setFormData({ ...formData, declaration: !!checked })}
        />
        <Label htmlFor="declaration-quarry" className="text-xs leading-none">
          I confirm that all quarrying operations comply with Environmental Impact Assessments and Odeda LGA host community MOUs.
        </Label>
      </div>

      <Button type="submit" disabled={!formData.declaration || isSubmitting} className="w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900">
        {isSubmitting ? "Submitting Application..." : `Pay ₦${service.defaultFee.toLocaleString()} & Submit Quarry Permit Application`}
      </Button>
    </form>
  );
}
