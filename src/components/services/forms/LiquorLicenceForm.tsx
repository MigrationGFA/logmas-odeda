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

export default function LiquorLicenceForm({ service, onSubmit, isSubmitting }: Props) {
  const [formData, setFormData] = useState({
    businessName: "",
    establishmentCategory: "Hotel / Bar / Lounge",
    premisesAddress: "",
    ward: WARDS[0] || "Odeda",
    proprietorName: "",
    phone: "",
    cacNumber: "",
    operatingHours: "10:00 AM - 11:00 PM",
    declaration: false,
  });

  const [files, setFiles] = useState<Record<string, string>>({});

  const handleFileChange = (docName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFiles((prev) => ({ ...prev, [docName]: e.target.files![0].name }));
    }
  };

  const calculateFee = () => {
    switch (formData.establishmentCategory) {
      case "Major Hotel / Event Resort": return 60000;
      case "Wholesale Distributor / Depot": return 40000;
      case "Hotel / Bar / Lounge": return 25000;
      default: return 20000;
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
      <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20 flex justify-between items-center">
        <div>
          <h4 className="font-semibold text-purple-700 dark:text-purple-300">{service.name} Application</h4>
          <p className="text-xs text-muted-foreground">{service.revenueHead} • Annual Statutory Licence</p>
        </div>
        <span className="text-lg font-bold text-purple-700 dark:text-purple-300">₦{calculatedFee.toLocaleString()}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="businessName">Establishment / Bar Name *</Label>
          <Input
            id="businessName"
            required
            value={formData.businessName}
            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
            placeholder="e.g. Obantoko Royal Lounge"
          />
        </div>

        <div>
          <Label htmlFor="establishmentCategory">Establishment Category *</Label>
          <Select value={formData.establishmentCategory} onValueChange={(val) => setFormData({ ...formData, establishmentCategory: val })}>
            <SelectTrigger id="establishmentCategory">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Retail Beer Parlour / Joint (₦20,000)">Retail Beer Parlour / Joint (₦20,000)</SelectItem>
              <SelectItem value="Hotel / Bar / Lounge">Hotel / Bar / Lounge (₦25,000)</SelectItem>
              <SelectItem value="Wholesale Distributor / Depot">Wholesale Distributor / Depot (₦40,000)</SelectItem>
              <SelectItem value="Major Hotel / Event Resort">Major Hotel / Event Resort (₦60,000)</SelectItem>
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
          <Label htmlFor="proprietorName">Proprietor Name *</Label>
          <Input
            id="proprietorName"
            required
            value={formData.proprietorName}
            onChange={(e) => setFormData({ ...formData, proprietorName: e.target.value })}
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
          <Label htmlFor="cacNumber">CAC Registration Number (Optional)</Label>
          <Input
            id="cacNumber"
            value={formData.cacNumber}
            onChange={(e) => setFormData({ ...formData, cacNumber: e.target.value })}
            placeholder="BN-1234567"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="premisesAddress">Full Premises Physical Address *</Label>
        <Input
          id="premisesAddress"
          required
          value={formData.premisesAddress}
          onChange={(e) => setFormData({ ...formData, premisesAddress: e.target.value })}
        />
      </div>

      <div className="border-t pt-4">
        <h5 className="font-medium mb-3 text-sm text-foreground">Required Statutory Attachments</h5>
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
              <Label htmlFor={`doc-liquor-${idx}`} className="cursor-pointer bg-background border px-3 py-1.5 rounded text-xs font-medium hover:bg-accent flex items-center gap-1 shrink-0">
                <Upload className="h-3 w-3" />
                Upload
              </Label>
              <input
                type="file"
                id={`doc-liquor-${idx}`}
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
          id="declaration-liquor"
          checked={formData.declaration}
          onCheckedChange={(checked) => setFormData({ ...formData, declaration: !!checked })}
        />
        <Label htmlFor="declaration-liquor" className="text-xs leading-none">
          I declare that the liquor premises complies with Odeda LGA noise control and public safety bye-laws.
        </Label>
      </div>

      <Button type="submit" disabled={!formData.declaration || isSubmitting} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
        {isSubmitting ? "Submitting Application..." : `Pay ₦${calculatedFee.toLocaleString()} & Apply for Liquor Licence`}
      </Button>
    </form>
  );
}
