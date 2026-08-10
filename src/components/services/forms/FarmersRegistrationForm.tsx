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

export default function FarmersRegistrationForm({ service, onSubmit, isSubmitting }: Props) {
  const [formData, setFormData] = useState({
    farmerName: "",
    phone: "",
    email: "",
    ward: WARDS[0] || "Odeda",
    farmingType: "Crop Farming (Cassava / Maize)",
    farmLocation: "",
    farmSizeAcres: "5",
    cooperativeName: "",
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
      <div className="bg-emerald-500/10 p-4 rounded-lg border border-emerald-500/20 flex justify-between items-center">
        <div>
          <h4 className="font-semibold text-emerald-700 dark:text-emerald-300">{service.name}</h4>
          <p className="text-xs text-muted-foreground">{service.revenueHead} • {service.feeDescription}</p>
        </div>
        <span className="text-lg font-bold text-emerald-700 dark:text-emerald-300">₦{service.defaultFee.toLocaleString()}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="farmerName">Farmer Full Name / Enterprise Name *</Label>
          <Input
            id="farmerName"
            required
            value={formData.farmerName}
            onChange={(e) => setFormData({ ...formData, farmerName: e.target.value })}
            placeholder="e.g. Samuel Adebiyi Farms"
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
          <Label htmlFor="farmingType">Primary Farming Enterprise *</Label>
          <Select value={formData.farmingType} onValueChange={(val) => setFormData({ ...formData, farmingType: val })}>
            <SelectTrigger id="farmingType">
              <SelectValue placeholder="Select Farming Enterprise" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Crop Farming (Cassava / Maize)">Crop Farming (Cassava / Maize)</SelectItem>
              <SelectItem value="Poultry Production">Poultry Production</SelectItem>
              <SelectItem value="Livestock & Cattle">Livestock & Cattle Farming</SelectItem>
              <SelectItem value="Fishery & Aquaculture">Fishery & Aquaculture</SelectItem>
              <SelectItem value="Cocoa & Plantation">Cocoa & Tree Crops</SelectItem>
              <SelectItem value="Agro-Processing & Milling">Agro-Processing & Milling</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="ward">Farm Location Ward *</Label>
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
          <Label htmlFor="farmSizeAcres">Farm Size (In Acres or Hectares)</Label>
          <Input
            id="farmSizeAcres"
            value={formData.farmSizeAcres}
            onChange={(e) => setFormData({ ...formData, farmSizeAcres: e.target.value })}
            placeholder="e.g. 10 Acres"
          />
        </div>

        <div>
          <Label htmlFor="cooperativeName">Farmers Cooperative Name (If Any)</Label>
          <Input
            id="cooperativeName"
            value={formData.cooperativeName}
            onChange={(e) => setFormData({ ...formData, cooperativeName: e.target.value })}
            placeholder="e.g. Odeda Cassava Farmers Coop"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="farmLocation">Farm Site Address / Landmarks *</Label>
        <Input
          id="farmLocation"
          required
          value={formData.farmLocation}
          onChange={(e) => setFormData({ ...formData, farmLocation: e.target.value })}
          placeholder="Detailed location or nearest village landmark in Odeda LGA"
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
              <Label htmlFor={`doc-farmer-${idx}`} className="cursor-pointer bg-background border px-3 py-1.5 rounded text-xs font-medium hover:bg-accent flex items-center gap-1 shrink-0">
                <Upload className="h-3 w-3" />
                Upload
              </Label>
              <input
                type="file"
                id={`doc-farmer-${idx}`}
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
          id="declaration-farmer"
          checked={formData.declaration}
          onCheckedChange={(checked) => setFormData({ ...formData, declaration: !!checked })}
        />
        <Label htmlFor="declaration-farmer" className="text-xs leading-none">
          I declare that my farming operations are located in Odeda LGA and eligible for agricultural support schemes.
        </Label>
      </div>

      <Button type="submit" disabled={!formData.declaration || isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
        {isSubmitting ? "Registering Farmer..." : `Pay ₦${service.defaultFee.toLocaleString()} & Get Farmers Certificate`}
      </Button>
    </form>
  );
}
