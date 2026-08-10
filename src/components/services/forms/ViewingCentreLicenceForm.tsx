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

export default function ViewingCentreLicenceForm({ service, onSubmit, isSubmitting }: Props) {
  const [formData, setFormData] = useState({
    centreName: "",
    seatingCapacity: "80",
    tvScreenCount: "3",
    generatorCapacity: "7.5 KVA",
    operatorName: "",
    phone: "",
    address: "",
    ward: WARDS[0] || "Odeda",
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
      <div className="bg-amber-500/10 p-4 rounded-lg border border-amber-500/20 flex justify-between items-center">
        <div>
          <h4 className="font-semibold text-amber-700 dark:text-amber-300">{service.name}</h4>
          <p className="text-xs text-muted-foreground">{service.revenueHead} • {service.feeDescription}</p>
        </div>
        <span className="text-lg font-bold text-amber-700 dark:text-amber-300">₦{service.defaultFee.toLocaleString()}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="centreName">Viewing Centre / Arena Name *</Label>
          <Input
            id="centreName"
            required
            value={formData.centreName}
            onChange={(e) => setFormData({ ...formData, centreName: e.target.value })}
            placeholder="e.g. Osiele Champions Viewing Centre"
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
          <Label htmlFor="seatingCapacity">Seating Capacity</Label>
          <Input
            id="seatingCapacity"
            type="number"
            value={formData.seatingCapacity}
            onChange={(e) => setFormData({ ...formData, seatingCapacity: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="tvScreenCount">Number of TV Screens / Projectors</Label>
          <Input
            id="tvScreenCount"
            type="number"
            value={formData.tvScreenCount}
            onChange={(e) => setFormData({ ...formData, tvScreenCount: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="operatorName">Operator Name *</Label>
          <Input
            id="operatorName"
            required
            value={formData.operatorName}
            onChange={(e) => setFormData({ ...formData, operatorName: e.target.value })}
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
      </div>

      <div>
        <Label htmlFor="address">Centre Physical Address *</Label>
        <Input
          id="address"
          required
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
      </div>

      <div className="border-t pt-4">
        <h5 className="font-medium mb-3 text-sm text-foreground">Required Safety & Location Documents</h5>
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
              <Label htmlFor={`doc-viewing-${idx}`} className="cursor-pointer bg-background border px-3 py-1.5 rounded text-xs font-medium hover:bg-accent flex items-center gap-1 shrink-0">
                <Upload className="h-3 w-3" />
                Upload
              </Label>
              <input
                type="file"
                id={`doc-viewing-${idx}`}
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
          id="declaration-viewing"
          checked={formData.declaration}
          onCheckedChange={(checked) => setFormData({ ...formData, declaration: !!checked })}
        />
        <Label htmlFor="declaration-viewing" className="text-xs leading-none">
          I confirm that fire extinguishers and ventilation emergency exits are present in the centre.
        </Label>
      </div>

      <Button type="submit" disabled={!formData.declaration || isSubmitting} className="w-full bg-amber-600 hover:bg-amber-700 text-white">
        {isSubmitting ? "Submitting Application..." : `Pay ₦${service.defaultFee.toLocaleString()} & Get Viewing Centre Licence`}
      </Button>
    </form>
  );
}
