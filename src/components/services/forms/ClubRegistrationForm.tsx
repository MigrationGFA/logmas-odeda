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

export default function ClubRegistrationForm({ service, onSubmit, isSubmitting }: Props) {
  const [formData, setFormData] = useState({
    clubName: "",
    clubType: "Social & Cultural",
    meetingAddress: "",
    ward: WARDS[0] || "Odeda",
    presidentName: "",
    presidentPhone: "",
    secretaryName: "",
    secretaryPhone: "",
    membershipCount: "20",
    objectives: "",
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
          <Label htmlFor="clubName">Club / Organization Name *</Label>
          <Input
            id="clubName"
            required
            value={formData.clubName}
            onChange={(e) => setFormData({ ...formData, clubName: e.target.value })}
            placeholder="e.g. Obantoko Dynamic Youth Club"
          />
        </div>

        <div>
          <Label htmlFor="clubType">Category / Type *</Label>
          <Select value={formData.clubType} onValueChange={(val) => setFormData({ ...formData, clubType: val })}>
            <SelectTrigger id="clubType">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Social & Cultural">Social & Cultural</SelectItem>
              <SelectItem value="Sports & Recreation">Sports & Recreation</SelectItem>
              <SelectItem value="Youth & Educational">Youth & Educational</SelectItem>
              <SelectItem value="Professional & Business">Professional & Business</SelectItem>
              <SelectItem value="Philanthropic">Philanthropic / NGO</SelectItem>
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
          <Label htmlFor="membershipCount">Estimated Active Membership Count</Label>
          <Input
            id="membershipCount"
            type="number"
            value={formData.membershipCount}
            onChange={(e) => setFormData({ ...formData, membershipCount: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="meetingAddress">Official Secretariat / Meeting Address *</Label>
        <Input
          id="meetingAddress"
          required
          value={formData.meetingAddress}
          onChange={(e) => setFormData({ ...formData, meetingAddress: e.target.value })}
          placeholder="Full physical address in Odeda LGA"
        />
      </div>

      <div className="border-t pt-4">
        <h5 className="font-medium mb-3 text-sm text-foreground">Executive Officers</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="presidentName">President / Chairman Name *</Label>
            <Input
              id="presidentName"
              required
              value={formData.presidentName}
              onChange={(e) => setFormData({ ...formData, presidentName: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="presidentPhone">President Phone Number *</Label>
            <Input
              id="presidentPhone"
              required
              value={formData.presidentPhone}
              onChange={(e) => setFormData({ ...formData, presidentPhone: e.target.value })}
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
            <Label htmlFor="secretaryPhone">Secretary Phone Number *</Label>
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
        <Label htmlFor="objectives">Brief Statement of Objectives</Label>
        <Textarea
          id="objectives"
          rows={3}
          value={formData.objectives}
          onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
          placeholder="State the core goals and community activities of the club"
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
              <Label htmlFor={`doc-club-${idx}`} className="cursor-pointer bg-background border px-3 py-1.5 rounded text-xs font-medium hover:bg-accent flex items-center gap-1 shrink-0">
                <Upload className="h-3 w-3" />
                Upload
              </Label>
              <input
                type="file"
                id={`doc-club-${idx}`}
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
          id="declaration-club"
          checked={formData.declaration}
          onCheckedChange={(checked) => setFormData({ ...formData, declaration: !!checked })}
        />
        <Label htmlFor="declaration-club" className="text-xs leading-none">
          I confirm that this club operates lawfully within Odeda Local Government regulations.
        </Label>
      </div>

      <Button type="submit" disabled={!formData.declaration || isSubmitting} className="w-full bg-amber-600 hover:bg-amber-700 text-white">
        {isSubmitting ? "Submitting Registration..." : `Pay ₦${service.defaultFee.toLocaleString()} & Apply for Certificate`}
      </Button>
    </form>
  );
}
