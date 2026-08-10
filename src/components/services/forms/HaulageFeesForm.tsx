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

export default function HaulageFeesForm({ service, onSubmit, isSubmitting }: Props) {
  const [formData, setFormData] = useState({
    companyName: "",
    vehicleRegistration: "",
    truckCapacity: "Heavy Duty Tipper (20-30 Tons)",
    cargoCategory: "Granite / Quarry Stone",
    driverName: "",
    driverPhone: "",
    loadingWard: WARDS[0] || "Odeda",
    destination: "Lagos / Ogun Transit",
    tripFrequency: "Per Trip",
    declaration: false,
  });

  const [files, setFiles] = useState<Record<string, string>>({});

  const handleFileChange = (docName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFiles((prev) => ({ ...prev, [docName]: e.target.files![0].name }));
    }
  };

  const calculateFee = () => {
    switch (formData.truckCapacity) {
      case "Trailer / Heavy Mining Dump Truck (30+ Tons)": return 20000;
      case "Heavy Duty Tipper (20-30 Tons)": return 10000;
      case "Medium Truck / Canter (10-20 Tons)": return 6000;
      default: return 4000;
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
      <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20 flex justify-between items-center">
        <div>
          <h4 className="font-semibold text-blue-700 dark:text-blue-300">{service.name} Transit Pass</h4>
          <p className="text-xs text-muted-foreground">{service.revenueHead} • Instant Haulage Permit</p>
        </div>
        <span className="text-lg font-bold text-blue-700 dark:text-blue-300">₦{calculatedFee.toLocaleString()}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="companyName">Haulage Operator / Company *</Label>
          <Input
            id="companyName"
            required
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            placeholder="e.g. Fast Express Haulage Ltd"
          />
        </div>

        <div>
          <Label htmlFor="vehicleRegistration">Vehicle Registration Plate Number *</Label>
          <Input
            id="vehicleRegistration"
            required
            value={formData.vehicleRegistration}
            onChange={(e) => setFormData({ ...formData, vehicleRegistration: e.target.value })}
            placeholder="e.g. AGB-482-XY"
          />
        </div>

        <div>
          <Label htmlFor="truckCapacity">Truck Tonnage / Capacity *</Label>
          <Select value={formData.truckCapacity} onValueChange={(val) => setFormData({ ...formData, truckCapacity: val })}>
            <SelectTrigger id="truckCapacity">
              <SelectValue placeholder="Select Capacity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Light Truck / Pick-Up (<10 Tons)">Light Truck / Pick-Up (₦4,000)</SelectItem>
              <SelectItem value="Medium Truck / Canter (10-20 Tons)">Medium Truck (₦6,000)</SelectItem>
              <SelectItem value="Heavy Duty Tipper (20-30 Tons)">Heavy Duty Tipper (₦10,000)</SelectItem>
              <SelectItem value="Trailer / Heavy Mining Dump Truck (30+ Tons)">Trailer / Mining Truck (₦20,000)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="cargoCategory">Cargo Material *</Label>
          <Select value={formData.cargoCategory} onValueChange={(val) => setFormData({ ...formData, cargoCategory: val })}>
            <SelectTrigger id="cargoCategory">
              <SelectValue placeholder="Select Cargo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Granite / Quarry Stone">Granite / Quarry Stone</SelectItem>
              <SelectItem value="Sand & Gravel">Sand & Gravel</SelectItem>
              <SelectItem value="Timber & Logs">Timber & Logs</SelectItem>
              <SelectItem value="Cassava & Agricultural Produce">Cassava & Agricultural Produce</SelectItem>
              <SelectItem value="Industrial Goods">Industrial Goods</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="loadingWard">Loading Point Ward *</Label>
          <Select value={formData.loadingWard} onValueChange={(val) => setFormData({ ...formData, loadingWard: val })}>
            <SelectTrigger id="loadingWard">
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
          <Label htmlFor="destination">Destination Route</Label>
          <Input
            id="destination"
            value={formData.destination}
            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
            placeholder="e.g. Abeokuta / Sagamu / Lagos"
          />
        </div>

        <div>
          <Label htmlFor="driverName">Driver's Name *</Label>
          <Input
            id="driverName"
            required
            value={formData.driverName}
            onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="driverPhone">Driver's Phone *</Label>
          <Input
            id="driverPhone"
            required
            value={formData.driverPhone}
            onChange={(e) => setFormData({ ...formData, driverPhone: e.target.value })}
          />
        </div>
      </div>

      <div className="border-t pt-4">
        <h5 className="font-medium mb-3 text-sm text-foreground">Required Haulage Papers</h5>
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
              <Label htmlFor={`doc-haulage-${idx}`} className="cursor-pointer bg-background border px-3 py-1.5 rounded text-xs font-medium hover:bg-accent flex items-center gap-1 shrink-0">
                <Upload className="h-3 w-3" />
                Upload
              </Label>
              <input
                type="file"
                id={`doc-haulage-${idx}`}
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
          id="declaration-haulage"
          checked={formData.declaration}
          onCheckedChange={(checked) => setFormData({ ...formData, declaration: !!checked })}
        />
        <Label htmlFor="declaration-haulage" className="text-xs leading-none">
          I declare that the truck payload matches the declared tonnage for haulage transit in Odeda LGA.
        </Label>
      </div>

      <Button type="submit" disabled={!formData.declaration || isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
        {isSubmitting ? "Generating Haulage Clearance..." : `Pay ₦${calculatedFee.toLocaleString()} & Print Transit Pass`}
      </Button>
    </form>
  );
}
