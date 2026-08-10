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

export default function KioskLicenceForm({ service, onSubmit, isSubmitting }: Props) {
  const [formData, setFormData] = useState({
    kioskName: "",
    goodsCategory: "Provisions / Soft Drinks",
    locationAddress: "",
    ward: WARDS[0] || "Camp",
    ownerName: "",
    phone: "",
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
      <div className="bg-teal-500/10 p-4 rounded-lg border border-teal-500/20 flex justify-between items-center">
        <div>
          <h4 className="font-semibold text-teal-700 dark:text-teal-300">{service.name}</h4>
          <p className="text-xs text-muted-foreground">{service.revenueHead} • Annual Micro Trade Licence</p>
        </div>
        <span className="text-lg font-bold text-teal-700 dark:text-teal-300">₦{service.defaultFee.toLocaleString()}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="kioskName">Kiosk / Stand Business Name *</Label>
          <Input
            id="kioskName"
            required
            value={formData.kioskName}
            onChange={(e) => setFormData({ ...formData, kioskName: e.target.value })}
            placeholder="e.g. Mama Eniola Cold Drinks & Snacks"
          />
        </div>

        <div>
          <Label htmlFor="goodsCategory">Goods / Trade Category *</Label>
          <Select value={formData.goodsCategory} onValueChange={(val) => setFormData({ ...formData, goodsCategory: val })}>
            <SelectTrigger id="goodsCategory">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Provisions / Soft Drinks">Provisions & Soft Drinks</SelectItem>
              <SelectItem value="POS & Telecom Recharge">POS & Telecom Recharge Kiosk</SelectItem>
              <SelectItem value="Fast Food & Snacks Stand">Fast Food & Snacks Stand</SelectItem>
              <SelectItem value="Artisan / Tailoring Stand">Artisan / Repair Stand</SelectItem>
              <SelectItem value="Fresh Produce / Fruits">Fresh Fruits & Veg Stand</SelectItem>
            </SelectContent>
          </Select>
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
          <Label htmlFor="ownerName">Kiosk Owner Name *</Label>
          <Input
            id="ownerName"
            required
            value={formData.ownerName}
            onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
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
        <Label htmlFor="locationAddress">Kiosk Location / Landmark *</Label>
        <Input
          id="locationAddress"
          required
          value={formData.locationAddress}
          onChange={(e) => setFormData({ ...formData, locationAddress: e.target.value })}
          placeholder="e.g. Opposite FUNAAB Gate, Camp Ward"
        />
      </div>

      <div className="border-t pt-4">
        <h5 className="font-medium mb-3 text-sm text-foreground">Required Kiosk Documents</h5>
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
              <Label htmlFor={`doc-kiosk-${idx}`} className="cursor-pointer bg-background border px-3 py-1.5 rounded text-xs font-medium hover:bg-accent flex items-center gap-1 shrink-0">
                <Upload className="h-3 w-3" />
                Upload
              </Label>
              <input
                type="file"
                id={`doc-kiosk-${idx}`}
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
          id="declaration-kiosk"
          checked={formData.declaration}
          onCheckedChange={(checked) => setFormData({ ...formData, declaration: !!checked })}
        />
        <Label htmlFor="declaration-kiosk" className="text-xs leading-none">
          I declare that the kiosk placement does not obstruct drainage or road right-of-way in Odeda LGA.
        </Label>
      </div>

      <Button type="submit" disabled={!formData.declaration || isSubmitting} className="w-full bg-teal-600 hover:bg-teal-700 text-white">
        {isSubmitting ? "Submitting Application..." : `Pay ₦${service.defaultFee.toLocaleString()} & Get Kiosk Trading Licence`}
      </Button>
    </form>
  );
}
