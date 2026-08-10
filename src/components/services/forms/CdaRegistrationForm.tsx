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

export default function CdaRegistrationForm({ service, onSubmit, isSubmitting }: Props) {
  const [formData, setFormData] = useState({
    cdaName: "",
    communityName: "",
    ward: WARDS[0] || "Odeda",
    estimatedHouseholds: "150",
    chairmanName: "",
    chairmanPhone: "",
    secretaryName: "",
    secretaryPhone: "",
    baaleSupportName: "",
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
      <div className="bg-sky-500/10 p-4 rounded-lg border border-sky-500/20 flex justify-between items-center">
        <div>
          <h4 className="font-semibold text-sky-700 dark:text-sky-300">{service.name}</h4>
          <p className="text-xs text-muted-foreground">{service.revenueHead} • {service.feeDescription}</p>
        </div>
        <span className="text-lg font-bold text-sky-700 dark:text-sky-300">₦{service.defaultFee.toLocaleString()}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="cdaName">CDA Name *</Label>
          <Input
            id="cdaName"
            required
            value={formData.cdaName}
            onChange={(e) => setFormData({ ...formData, cdaName: e.target.value })}
            placeholder="e.g. Osiele Central Community Dev. Assoc."
          />
        </div>

        <div>
          <Label htmlFor="communityName">Community / Estate / Settlement Name *</Label>
          <Input
            id="communityName"
            required
            value={formData.communityName}
            onChange={(e) => setFormData({ ...formData, communityName: e.target.value })}
            placeholder="e.g. Osiele Junction & Environs"
          />
        </div>

        <div>
          <Label htmlFor="ward">Ward in Odeda LGA *</Label>
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
          <Label htmlFor="estimatedHouseholds">Estimated Number of Households Covered</Label>
          <Input
            id="estimatedHouseholds"
            type="number"
            value={formData.estimatedHouseholds}
            onChange={(e) => setFormData({ ...formData, estimatedHouseholds: e.target.value })}
          />
        </div>
      </div>

      <div className="border-t pt-4">
        <h5 className="font-medium mb-3 text-sm text-foreground">CDA Executive Officers</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="chairmanName">CDA Chairman Name *</Label>
            <Input
              id="chairmanName"
              required
              value={formData.chairmanName}
              onChange={(e) => setFormData({ ...formData, chairmanName: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="chairmanPhone">Chairman Phone *</Label>
            <Input
              id="chairmanPhone"
              required
              value={formData.chairmanPhone}
              onChange={(e) => setFormData({ ...formData, chairmanPhone: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="secretaryName">Secretary Name *</Label>
            <Input
              id="secretaryName"
              required
              value={formData.secretaryName}
              onChange={(e) => setFormData({ ...formData, secretaryName: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="secretaryPhone">Secretary Phone *</Label>
            <Input
              id="secretaryPhone"
              required
              value={formData.secretaryPhone}
              onChange={(e) => setFormData({ ...formData, secretaryPhone: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="baaleSupportName">Name of Baale / Traditional Head of Area</Label>
        <Input
          id="baaleSupportName"
          value={formData.baaleSupportName}
          onChange={(e) => setFormData({ ...formData, baaleSupportName: e.target.value })}
          placeholder="e.g. Chief S.A. Adeosun (Baale Osiele)"
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
              <Label htmlFor={`doc-cda-${idx}`} className="cursor-pointer bg-background border px-3 py-1.5 rounded text-xs font-medium hover:bg-accent flex items-center gap-1 shrink-0">
                <Upload className="h-3 w-3" />
                Upload
              </Label>
              <input
                type="file"
                id={`doc-cda-${idx}`}
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
          id="declaration-cda"
          checked={formData.declaration}
          onCheckedChange={(checked) => setFormData({ ...formData, declaration: !!checked })}
        />
        <Label htmlFor="declaration-cda" className="text-xs leading-none">
          I confirm that this CDA is duly constituted to foster peace and development in Odeda LGA.
        </Label>
      </div>

      <Button type="submit" disabled={!formData.declaration || isSubmitting} className="w-full bg-sky-600 hover:bg-sky-700 text-white">
        {isSubmitting ? "Submitting Application..." : `Pay ₦${service.defaultFee.toLocaleString()} & Submit CDA Registration`}
      </Button>
    </form>
  );
}
