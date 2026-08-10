"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

export default function StreetNamingForm({ service, onSubmit, isSubmitting }: Props) {
  const [formData, setFormData] = useState({
    proposedStreetName: "",
    alternativeName: "",
    ward: WARDS[0] || "Obantoko",
    communityArea: "",
    propertyCount: "25",
    applicantName: "",
    applicantRole: "CDA Chairman",
    phone: "",
    email: "",
    justification: "",
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
      <div className="bg-indigo-500/10 p-4 rounded-lg border border-indigo-500/20 flex justify-between items-center">
        <div>
          <h4 className="font-semibold text-indigo-700 dark:text-indigo-300">{service.name} Approval</h4>
          <p className="text-xs text-muted-foreground">{service.revenueHead} • Statutory Urban Planning Fee</p>
        </div>
        <span className="text-lg font-bold text-indigo-700 dark:text-indigo-300">₦{service.defaultFee.toLocaleString()}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="proposedStreetName">Proposed Street Name *</Label>
          <Input
            id="proposedStreetName"
            required
            value={formData.proposedStreetName}
            onChange={(e) => setFormData({ ...formData, proposedStreetName: e.target.value })}
            placeholder="e.g. Chief Adebisi Way"
          />
        </div>

        <div>
          <Label htmlFor="alternativeName">Alternative Choice Name</Label>
          <Input
            id="alternativeName"
            value={formData.alternativeName}
            onChange={(e) => setFormData({ ...formData, alternativeName: e.target.value })}
            placeholder="e.g. Harmony Close"
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
          <Label htmlFor="communityArea">Community / Estate Area *</Label>
          <Input
            id="communityArea"
            required
            value={formData.communityArea}
            onChange={(e) => setFormData({ ...formData, communityArea: e.target.value })}
            placeholder="e.g. Obantoko Housing Estate Phase 2"
          />
        </div>

        <div>
          <Label htmlFor="propertyCount">Estimated Properties on Street</Label>
          <Input
            id="propertyCount"
            type="number"
            value={formData.propertyCount}
            onChange={(e) => setFormData({ ...formData, propertyCount: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="applicantRole">Applicant Capacity *</Label>
          <Select value={formData.applicantRole} onValueChange={(val) => setFormData({ ...formData, applicantRole: val })}>
            <SelectTrigger id="applicantRole">
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CDA Chairman">CDA Chairman / Executive</SelectItem>
              <SelectItem value="Estate Developer">Estate Developer / Promoter</SelectItem>
              <SelectItem value="Family Head">Family Head / Landowner</SelectItem>
              <SelectItem value="Resident Representative">Resident Representative</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="applicantName">Applicant Name *</Label>
          <Input
            id="applicantName"
            required
            value={formData.applicantName}
            onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="phone">Applicant Phone *</Label>
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
        <Label htmlFor="justification">Historical / Civic Justification for Proposed Naming</Label>
        <Textarea
          id="justification"
          rows={3}
          value={formData.justification}
          onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
          placeholder="Briefly state why this name is significant to Odeda LGA community"
        />
      </div>

      <div className="border-t pt-4">
        <h5 className="font-medium mb-3 text-sm text-foreground">Required Urban Planning Documents</h5>
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
              <Label htmlFor={`doc-street-${idx}`} className="cursor-pointer bg-background border px-3 py-1.5 rounded text-xs font-medium hover:bg-accent flex items-center gap-1 shrink-0">
                <Upload className="h-3 w-3" />
                Upload
              </Label>
              <input
                type="file"
                id={`doc-street-${idx}`}
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
          id="declaration-street"
          checked={formData.declaration}
          onCheckedChange={(checked) => setFormData({ ...formData, declaration: !!checked })}
        />
        <Label htmlFor="declaration-street" className="text-xs leading-none">
          I confirm that majority residents consent to this street naming application in Odeda LGA.
        </Label>
      </div>

      <Button type="submit" disabled={!formData.declaration || isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
        {isSubmitting ? "Submitting Naming Request..." : `Pay ₦${service.defaultFee.toLocaleString()} & Apply for Street Naming`}
      </Button>
    </form>
  );
}
