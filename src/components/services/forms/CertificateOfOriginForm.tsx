"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WARDS } from "@/lib/mock-data";
import { Checkbox } from "@/components/ui/checkbox";
import { OdedaService } from "@/config/odedaServices";
import { Upload, FileCheck, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Props {
  service: OdedaService;
  onSubmit: (formData: Record<string, any>) => void;
  isSubmitting?: boolean;
}

export default function CertificateOfOriginForm({ service, onSubmit, isSubmitting }: Props) {
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    gender: "Male",
    phone: "",
    email: "",
    address: "",
    ward: WARDS[0] || "Odeda",
    fatherName: "",
    fatherCompound: "",
    fatherVillage: "",
    motherName: "",
    motherCompound: "",
    motherVillage: "",
    purpose: "Employment / NYSC / Admission",
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
      <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 flex justify-between items-center">
        <div>
          <h4 className="font-semibold text-primary">{service.name}</h4>
          <p className="text-xs text-muted-foreground">{service.revenueHead} • {service.feeDescription}</p>
        </div>
        <span className="text-lg font-bold text-primary">₦{service.defaultFee.toLocaleString()}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullName">Full Name (Surname First) *</Label>
          <Input
            id="fullName"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="e.g. Adebayo Olusegun"
          />
        </div>

        <div>
          <Label htmlFor="dob">Date of Birth *</Label>
          <Input
            id="dob"
            type="date"
            required
            value={formData.dob}
            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="gender">Gender *</Label>
          <Select value={formData.gender} onValueChange={(val) => setFormData({ ...formData, gender: val })}>
            <SelectTrigger id="gender">
              <SelectValue placeholder="Select Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+234 800 000 0000"
          />
        </div>

        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="applicant@example.com"
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
      </div>

      <div className="border-t pt-4">
        <h5 className="font-medium mb-3 text-sm text-foreground">Ancestral & Lineage Details</h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="fatherName">Father's Full Name *</Label>
            <Input
              id="fatherName"
              required
              value={formData.fatherName}
              onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="fatherCompound">Father's Compound *</Label>
            <Input
              id="fatherCompound"
              required
              value={formData.fatherCompound}
              onChange={(e) => setFormData({ ...formData, fatherCompound: e.target.value })}
              placeholder="e.g. Ile Balogun Compound"
            />
          </div>
          <div>
            <Label htmlFor="fatherVillage">Father's Village / Town *</Label>
            <Input
              id="fatherVillage"
              required
              value={formData.fatherVillage}
              onChange={(e) => setFormData({ ...formData, fatherVillage: e.target.value })}
              placeholder="e.g. Odeda Town"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
          <div>
            <Label htmlFor="motherName">Mother's Full Name</Label>
            <Input
              id="motherName"
              value={formData.motherName}
              onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="motherCompound">Mother's Compound</Label>
            <Input
              id="motherCompound"
              value={formData.motherCompound}
              onChange={(e) => setFormData({ ...formData, motherCompound: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="motherVillage">Mother's Village / Town</Label>
            <Input
              id="motherVillage"
              value={formData.motherVillage}
              onChange={(e) => setFormData({ ...formData, motherVillage: e.target.value })}
            />
          </div>
        </div>
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
              <Label htmlFor={`doc-${idx}`} className="cursor-pointer bg-background border px-3 py-1.5 rounded text-xs font-medium hover:bg-accent flex items-center gap-1 shrink-0">
                <Upload className="h-3 w-3" />
                Upload
              </Label>
              <input
                type="file"
                id={`doc-${idx}`}
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) => handleFileChange(doc, e)}
              />
            </div>
          ))}
        </div>
      </div>

      <Alert className="bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200">
        <AlertTitle className="text-xs font-semibold">Verification Notice</AlertTitle>
        <AlertDescription className="text-xs">
          Your application will be routed to your Ward Councillor and Odeda LGA Chieftaincy/Origin Desk for statutory verification before certificate issuance.
        </AlertDescription>
      </Alert>

      <div className="flex items-center space-x-2 pt-2">
        <Checkbox
          id="declaration"
          checked={formData.declaration}
          onCheckedChange={(checked) => setFormData({ ...formData, declaration: !!checked })}
        />
        <Label htmlFor="declaration" className="text-xs leading-none">
          I solemnly declare that all information supplied is true and accurate according to Odeda LGA customary law.
        </Label>
      </div>

      <Button type="submit" disabled={!formData.declaration || isSubmitting} className="w-full">
        {isSubmitting ? "Submitting Application..." : `Proceed to Pay ₦${service.defaultFee.toLocaleString()} & Submit`}
      </Button>
    </form>
  );
}
