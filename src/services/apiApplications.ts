/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/lib/api";
import {
  Application,
  CreateApplicationData,
  ApplicationsQueryParams,
  ApplicantSearchResult,
} from "@/types/application";
import {
  getOdedaApplications,
  getOdedaApplicationById,
  saveOdedaApplications,
  createOdedaApplication as createLocalApp,
  updateApplicationStatus as updateLocalStatus,
  approveAndGenerateCertificate as localApproveCert,
} from "@/lib/odedaApplications";
import { tokenManager } from "@/services/apiAuth";
import { getStoreSnapshot } from "@/lib/store";
import { getOdedaServiceById, getConfiguredFeeForService } from "@/config/odedaServices";

// Helper to normalize an application from backend or local storage
function normalizeApplication(raw: any): any {
  if (!raw) return raw;
  const service = getOdedaServiceById(raw.serviceId || "");
  const serviceName = raw.serviceName || service?.name || "Odeda LGA Statutory Service";
  const category = raw.category || service?.category || "Services";
  const rawStatus = raw.status || "submitted";

  // Normalize status text
  let status = rawStatus;
  const lower = String(rawStatus).toLowerCase();
  if (lower === "submitted") status = "Submitted";
  else if (lower === "under_review" || lower === "under review") status = "Under Review";
  else if (lower === "approved") status = "Approved";
  else if (lower === "declined" || lower === "rejected") status = "Declined";
  else if (lower === "cancelled") status = "Cancelled";
  else if (lower === "completed") status = "Completed";

  const applicantName =
    raw.fullName ||
    raw.applicant ||
    (raw.applicant?.firstName ? `${raw.applicant.firstName} ${raw.applicant.lastName || ""}`.trim() : "") ||
    raw.details?.applicantName ||
    raw.details?.fullName ||
    "Applicant";

  const detailsObj = raw.formData || raw.details || {};

  // Normalize documents
  const docs = Array.isArray(raw.applicationDocuments)
    ? raw.applicationDocuments.map((d: any) => ({
        id: d.id || d._id || d.documentType,
        documentType: d.documentType || d.type || d.name?.split("_")[0] || "document",
        name: d.name || d.fileName || d.originalName || "document.pdf",
        url: d.url || d.fileUrl || "/documents/sample.pdf",
        fileSize: d.fileSize || d.size || 250000,
        mimeType: d.mimeType || d.contentType || (d.name?.endsWith(".png") ? "image/png" : d.name?.endsWith(".jpg") || d.name?.endsWith(".jpeg") ? "image/jpeg" : "application/pdf"),
        status: d.status || "uploaded",
        uploadedAt: d.uploadedAt || d.createdAt || raw.createdAt,
      }))
    : [];

  return {
    id: raw.id || raw._id || `ODE-2026-${Math.floor(100 + Math.random() * 900)}`,
    applicationNo: raw.applicationNo || raw.appNo || `ODE/${(raw.serviceId || "APP").substring(0, 3).toUpperCase()}/2026/${Math.floor(1000 + Math.random() * 9000)}`,
    serviceId: raw.serviceId || "",
    serviceName,
    category,
    status: status as any,
    fullName: applicantName,
    phone: raw.phone || raw.applicant?.phone || detailsObj.phone || detailsObj.phoneNo || "—",
    email: raw.email || raw.applicant?.email || detailsObj.email || null,
    address: raw.address || detailsObj.address || detailsObj.siteAddress || "Odeda LGA, Ogun State",
    ward: raw.ward || detailsObj.ward || "Ward 7 (Itesi / Camp)",
    nin: raw.nin || detailsObj.nin || null,
    cacNumber: raw.cacNumber || detailsObj.cacNumber || null,
    applicantId: raw.applicantId || raw.applicant?.id || null,
    createdById: raw.createdById || raw.createdBy?.id,
    applicant: raw.applicant || null,
    createdBy: raw.createdBy || null,
    formData: detailsObj,
    documents: docs,
    declineReason: raw.declineReason || raw.rejectionReason || null,
    rejectionReason: raw.rejectionReason || raw.declineReason || null,
    correctionNotes: raw.correctionNotes || null,
    reviewedByAdminId: raw.reviewedByAdminId || null,
    reviewedByAdminAt: raw.reviewedByAdminAt || null,
    reviewNotes: raw.reviewNotes || null,
    approvedAt: raw.approvedAt || (status === "Approved" || status === "Completed" ? raw.updatedAt : null),
    declinedAt: raw.declinedAt || (status === "Declined" ? raw.updatedAt : null),
    certificateNumber: raw.certificateNumber || raw.licenceNumber || null,
    licenceNumber: raw.licenceNumber || raw.certificateNumber || null,
    issuedAt: raw.issuedAt || null,
    issuedBy: raw.issuedBy || null,
    expiryDate: raw.expiryDate || null,
    feeAmount: raw.feeAmount || raw.amount || getConfiguredFeeForService(raw.serviceId) || 5000,
    amount: raw.amount || raw.feeAmount || getConfiguredFeeForService(raw.serviceId) || 5000,
    revenueHead: raw.revenueHead || service?.revenueHead || "1001 - Statutory LGA Revenue",
    paymentStatus: raw.paymentStatus || (raw.status === "Approved" || raw.status === "Completed" ? "paid" : "unpaid"),
    paidAt: raw.paidAt || null,
    invoiceId: raw.invoiceId || null,
    invoiceNumber: raw.invoiceNumber || raw.invoiceId || null,
    receiptNumber: raw.receiptNumber || null,
    qrToken: raw.qrToken || `QR-ODE-${raw.id || "APP"}`,
    verificationCode: raw.verificationCode || `VER-${Math.floor(100000 + Math.random() * 900000)}`,
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString(),
    timeline: raw.timeline || [],
  };
}

export const apiApplications = {
  /**
   * Submit an application with multipart/form-data.
   * Document files are attached directly with their machine-readable requirement keys as field names.
   * NOTE: feeAmount is NEVER sent from the frontend per backend contract.
   */
  submitApplication: async (payload: CreateApplicationData): Promise<Application> => {
    const service = getOdedaServiceById(payload.serviceId);
    const serviceName = service?.name || "Statutory Service";

    // Prepare multipart FormData
    const formData = new FormData();
    formData.append("serviceId", payload.serviceId);
    formData.append("fullName", payload.fullName);
    formData.append("phone", payload.phone);
    formData.append("address", payload.address);

    if (payload.email) formData.append("email", payload.email);
    if (payload.ward) formData.append("ward", payload.ward);
    if (payload.nin) formData.append("nin", payload.nin);
    if (payload.cacNumber) formData.append("cacNumber", payload.cacNumber);
    if (payload.applicantId) formData.append("applicantId", payload.applicantId);

    // Dynamic form data serialized as JSON string
    formData.append("formData", JSON.stringify(payload.formData || {}));

    // Attach each document with its machine-readable requirement key
    const attachedDocMeta: Array<{ name: string; url: string; status: "uploaded" | "verified"; documentType: string }> = [];

    if (payload.files) {
      Object.entries(payload.files).forEach(([reqKey, fileOrMeta]) => {
        if (!fileOrMeta) return;

        if (fileOrMeta instanceof File || fileOrMeta instanceof Blob) {
          const fileName = (fileOrMeta as File).name || `${reqKey}.pdf`;
          formData.append(reqKey, fileOrMeta, fileName);
          attachedDocMeta.push({
            documentType: reqKey,
            name: fileName,
            url: URL.createObjectURL ? URL.createObjectURL(fileOrMeta) : `/uploads/${fileName}`,
            status: "uploaded",
          });
        } else if (typeof fileOrMeta === "object" && fileOrMeta.name) {
          // If metadata object was passed
          const dummyBlob = new Blob([`SAMPLE FILE CONTENT FOR ${reqKey}`], { type: "application/pdf" });
          formData.append(reqKey, dummyBlob, fileOrMeta.name);
          attachedDocMeta.push({
            documentType: reqKey,
            name: fileOrMeta.name,
            url: fileOrMeta.url || `/uploads/${fileOrMeta.name}`,
            status: "uploaded",
          });
        }
      });
    }

    try {
      const response = await api.upload<any>("/applications", formData);
      const normalized = normalizeApplication(response);

      // Also mirror to local storage to ensure persistent preview sync
      createLocalApp({
        serviceId: payload.serviceId,
        serviceName,
        category: service?.category || "Services",
        applicant: payload.fullName,
        phone: payload.phone,
        email: payload.email,
        address: payload.address,
        ward: payload.ward || "Ward 7 (Itesi / Camp)",
        nin: payload.nin,
        cacNumber: payload.cacNumber,
        revenueHead: service?.revenueHead || "1001 - Statutory Revenue",
        amount: getConfiguredFeeForService(payload.serviceId) || 5000,
        details: payload.formData,
        documents: attachedDocMeta,
        isDraft: false,
      });

      return normalized;
    } catch (err) {
      console.warn("Backend /applications upload returned an error, falling back to durable local store:", err);

      // Local fallback
      const local = createLocalApp({
        serviceId: payload.serviceId,
        serviceName,
        category: service?.category || "Services",
        applicant: payload.fullName,
        phone: payload.phone,
        email: payload.email,
        address: payload.address,
        ward: payload.ward || "Ward 7 (Itesi / Camp)",
        nin: payload.nin,
        cacNumber: payload.cacNumber,
        revenueHead: service?.revenueHead || "1001 - Statutory Revenue",
        amount: getConfiguredFeeForService(payload.serviceId) || 5000,
        details: payload.formData,
        documents: attachedDocMeta,
        isDraft: false,
      });

      return normalizeApplication({
        ...local,
        fullName: payload.fullName,
        applicantId: payload.applicantId,
        formData: payload.formData,
      });
    }
  },

  /**
   * Get applications with query filtering and pagination.
   */
  getApplications: async (params?: ApplicationsQueryParams): Promise<Application[]> => {
    try {
      const res = await api.get<any>("/applications", { params });
      let list: any[] = [];
      if (Array.isArray(res)) {
        list = res;
      } else if (res && Array.isArray(res.data)) {
        list = res.data;
      } else if (res && Array.isArray(res.applications)) {
        list = res.applications;
      }

      console.log("list",list)

      if (list.length > 0) {
        const normalized = list.map(normalizeApplication);
        return normalized;
      }
    } catch (err) {
      console.log("Backend /applications unreachable, utilizing local storage:", err);
    }

    // Return from local applications store
    const localApps = getOdedaApplications().map(normalizeApplication);
    let filtered = [...localApps];

    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.applicationNo.toLowerCase().includes(q) ||
          a.fullName.toLowerCase().includes(q) ||
          a.serviceName?.toLowerCase().includes(q) ||
          a.phone?.toLowerCase().includes(q) ||
          (a.nin && a.nin.toLowerCase().includes(q))
      );
    }

    if (params?.status && params.status !== "all" && params.status !== "All") {
      const s = params.status.toLowerCase();
      filtered = filtered.filter((a) => a.status.toLowerCase() === s);
    }

    if (params?.serviceId && params.serviceId !== "all" && params.serviceId !== "All") {
      filtered = filtered.filter((a) => a.serviceId === params.serviceId);
    }

    if (params?.wardId && params.wardId !== "all") {
      filtered = filtered.filter((a) => a.ward?.toLowerCase().includes(params.wardId!.toLowerCase()));
    }

    return filtered;
  },

  /**
   * Get single application by ID
   */
  getApplicationById: async (id: string): Promise<Application> => {
    try {
      const res = await api.get<any>(`/applications/${id}`);
      if (res) return normalizeApplication(res);
    } catch (err) {
      console.log(`Backend /applications/${id} unreachable, trying local:`, err);
    }

    const local = getOdedaApplicationById(id);
    if (!local) throw new Error("Application not found");
    return normalizeApplication(local);
  },

  /**
   * Transition status: Submitted -> Under Review
   */
  moveToUnderReview: async (id: string, notes?: string): Promise<Application> => {
    const user = tokenManager.getUser();
    const actorName = user ? `${user.firstName} ${user.lastName || ""}`.trim() : "LGA Admin";
    const actorRole = user?.role || "lga_admin";

    try {
      const res = await api.patch<any>(`/applications/${id}/under-review`, { notes });
      if (res) return normalizeApplication(res);
    } catch (err) {
      try {
        const res2 = await api.post<any>(`/applications/${id}/under-review`, { notes });
        if (res2) return normalizeApplication(res2);
      } catch {
        // Continue to local sync
      }
    }

    const updated = updateLocalStatus(
      id,
      "Under Review",
      { name: actorName, role: actorRole },
      { correctionNotes: notes }
    );

    if (!updated) throw new Error("Application not found to update status");
    return normalizeApplication(updated);
  },

  /**
   * Transition status: Under Review -> Approved
   */
  approveApplication: async (id: string, notes?: string): Promise<Application> => {
    const user = tokenManager.getUser();
    const actorName = user ? `${user.firstName} ${user.lastName || ""}`.trim() : "LGA Executive Admin";
    const actorRole = user?.role || "lga_admin";

    try {
      const res = await api.patch<any>(`/applications/${id}/approve`, { notes });
      if (res) return normalizeApplication(res);
    } catch (err) {
      try {
        const res2 = await api.post<any>(`/applications/${id}/approve`, { notes });
        if (res2) return normalizeApplication(res2);
      } catch {
        // Continue to local sync
      }
    }

    const updated = localApproveCert(id, { name: actorName, role: actorRole });
    if (!updated) {
      const fallbackUpdate = updateLocalStatus(
        id,
        "Approved",
        { name: actorName, role: actorRole },
        {
          certificateNumber: `ODE/CERT/2026/${Math.floor(100000 + Math.random() * 899999)}`,
          issuedAt: new Date().toISOString(),
          issuedBy: actorName,
        }
      );
      if (!fallbackUpdate) throw new Error("Application not found");
      return normalizeApplication(fallbackUpdate);
    }

    return normalizeApplication(updated);
  },

  /**
   * Transition status: Under Review -> Declined (Reason mandatory!)
   */
  declineApplication: async (id: string, declineReason: string): Promise<Application> => {
    if (!declineReason || declineReason.trim().length === 0) {
      throw new Error("A specific decline reason is mandatory to reject this application.");
    }

    const user = tokenManager.getUser();
    const actorName = user ? `${user.firstName} ${user.lastName || ""}`.trim() : "LGA Review Officer";
    const actorRole = user?.role || "lga_admin";

    try {
      const res = await api.patch<any>(`/applications/${id}/decline`, { declineReason });
      if (res) return normalizeApplication(res);
    } catch (err) {
      try {
        const res2 = await api.post<any>(`/applications/${id}/decline`, { declineReason });
        if (res2) return normalizeApplication(res2);
      } catch {
        // Continue to local sync
      }
    }

    const updated = updateLocalStatus(
      id,
      "Rejected",
      { name: actorName, role: actorRole },
      { rejectionReason: declineReason }
    );

    if (!updated) throw new Error("Application not found");
    return normalizeApplication(updated);
  },

  /**
   * Search registered applicants by NIN, phone, name, email for Field Officer flow
   */
  searchApplicants: async (query: string): Promise<ApplicantSearchResult[]> => {
    const q = (query || "").trim().toLowerCase();
    if (!q || q.length < 2) return [];

    const results: ApplicantSearchResult[] = [];

    // 1. Try customer/user search API
    try {
      const res = await api.get<any[]>("/customers", { params: { search: q } });
      if (Array.isArray(res)) {
        res.forEach((c) => {
          results.push({
            id: c.id || c._id,
            name: c.name || `${c.firstName || ""} ${c.lastName || ""}`.trim() || c.businessName || "Registered Citizen",
            firstName: c.firstName,
            lastName: c.lastName,
            email: c.email,
            phone: c.phone || "",
            nin: c.nin,
            cacNumber: c.cacNumber,
            address: c.address,
            ward: c.ward?.name || c.ward,
            role: c.role || (c.businessName ? "business_owner" : "citizen"),
            businessName: c.businessName,
          });
        });
      }
    } catch {
      // Ignore and fallback to local snapshot
    }

    // 2. Query local store snapshot customers
    const storeCustomers = getStoreSnapshot().customers || [];
    storeCustomers.forEach((c) => {
      const text = `${c.name || ""} ${c.phone || ""} ${c.email || ""} ${c.businessName || ""}`.toLowerCase();
      if (text.includes(q)) {
        if (!results.some((r) => r.id === c.id)) {
          results.push({
            id: c.id,
            name: c.name || c.businessName || "Citizen",
            phone: c.phone || "",
            email: c.email,
            address: c.address,
            ward: c.ward,
            role: c.businessName ? "business_owner" : "citizen",
            businessName: c.businessName,
          });
        }
      }
    });

    // 3. Query existing application records for past applicants
    const existingApps = getOdedaApplications();
    existingApps.forEach((app) => {
      const match =
        app.applicant.toLowerCase().includes(q) ||
        (app.phone && app.phone.toLowerCase().includes(q)) ||
        (app.nin && app.nin.toLowerCase().includes(q)) ||
        (app.email && app.email.toLowerCase().includes(q));

      if (match && !results.some((r) => r.phone === app.phone || (app.nin && r.nin === app.nin))) {
        results.push({
          id: app.id,
          name: app.applicant,
          phone: app.phone,
          email: app.email,
          nin: app.nin,
          cacNumber: app.cacNumber,
          address: app.address,
          ward: app.ward,
          role: app.category === "Licences & Permits" ? "business_owner" : "citizen",
        });
      }
    });

    return results;
  },
};
