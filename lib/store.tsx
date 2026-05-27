"use client";

import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import type { Equipment, WorkOrder, MaintenanceRequest, Workflow, RoleProfile, NonQRItem, ExpenditureBill } from "./types";
import {
  equipmentSeed, workOrdersSeed, workflowsSeed, roleProfiles, nonQRItemsSeed,
  expenditureBillsSeed, expenditureBudgetsSeed,
} from "./data";

interface StoreState {
  equipmentAssets: Equipment[];
  nonQRItems: NonQRItem[];
  bills: ExpenditureBill[];
  budgets: { utility: number; repair: number };
  maintenanceRequests: MaintenanceRequest[];
  generatedWorkOrders: WorkOrder[];
  workflows: Workflow[];
  roleId: string;
  activeRole: RoleProfile;
  allWorkOrders: WorkOrder[];
}

interface StoreActions {
  setRoleId: (id: string) => void;
  registerEquipment: (formValues: Partial<Equipment> & Record<string, string>) => Equipment;
  updateEquipment: (id: string, formValues: Partial<Equipment> & Record<string, string>) => Equipment;
  deleteEquipment: (id: string) => void;
  addNonQRItem: (values: Omit<NonQRItem, "id" | "identity" | "lastChecked">) => NonQRItem;
  deleteNonQRItem: (id: string) => void;
  addBill: (values: Omit<ExpenditureBill, "id" | "uploadedAt">) => ExpenditureBill;
  deleteBill: (id: string) => void;
  setBudget: (type: "utility" | "repair", amount: number) => void;
  submitMaintenanceRequest: (values: Omit<MaintenanceRequest, "id" | "status" | "approvalStatus" | "assetName" | "submitted" | "approver">) => MaintenanceRequest;
  approveMaintenanceRequest: (request: MaintenanceRequest) => WorkOrder;
  addWorkflow: (workflow: Workflow) => void;
}

type StoreContext = StoreState & StoreActions;

const StoreCtx = createContext<StoreContext | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [equipmentAssets, setEquipmentAssets] = useState<Equipment[]>(equipmentSeed);
  const [nonQRItems, setNonQRItems] = useState<NonQRItem[]>(nonQRItemsSeed);
  const [bills, setBills] = useState<ExpenditureBill[]>(expenditureBillsSeed);
  const [budgets, setBudgets] = useState(expenditureBudgetsSeed);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [generatedWorkOrders, setGeneratedWorkOrders] = useState<WorkOrder[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>(workflowsSeed);
  const [roleId, setRoleId] = useState("engineering-management");

  const activeRole = useMemo(
    () => roleProfiles.find((r) => r.id === roleId) ?? roleProfiles[0],
    [roleId]
  );

  const allWorkOrders = useMemo(
    () => [...generatedWorkOrders, ...workOrdersSeed],
    [generatedWorkOrders]
  );

  const registerEquipment = useCallback((formValues: Partial<Equipment> & Record<string, string>): Equipment => {
    const prefix = (formValues.category ?? "EQ").slice(0, 3).toUpperCase().replace(/[^A-Z]/g, "EQ");
    const nextNumber = equipmentAssets.length + 118;
    const id = `EQ-${prefix}-${String(nextNumber).padStart(4, "0")}`;
    const asset: Equipment = {
      id,
      name: formValues.name ?? "",
      category: formValues.category ?? "HVAC",
      location: formValues.location ?? "",
      status: "Healthy",
      criticality: (formValues.criticality as Equipment["criticality"]) ?? "High",
      warranty: (formValues.warrantyStatus as Equipment["warranty"]) ?? "Active",
      amc: formValues.amcVendor || "Not assigned",
      serialNumber: formValues.serialNumber,
      manufacturer: formValues.manufacturer,
      model: formValues.model,
      purchaseDate: formValues.purchaseDate,
      warrantyExpiry: formValues.warrantyExpiry,
      amcExpiry: formValues.amcExpiry,
      nextService: formValues.nextService ?? "",
      owner: formValues.owner,
      uptime: 100,
      health: 96,
    };
    setEquipmentAssets((prev) => [asset, ...prev]);
    return asset;
  }, [equipmentAssets.length]);

  const updateEquipment = useCallback((id: string, formValues: Partial<Equipment> & Record<string, string>): Equipment => {
    const existing = equipmentAssets.find((a) => a.id === id);
    const updated: Equipment = {
      id,
      name: formValues.name ?? "",
      category: formValues.category ?? "HVAC",
      location: formValues.location ?? "",
      status: existing?.status ?? "Healthy",
      criticality: (formValues.criticality as Equipment["criticality"]) ?? "High",
      warranty: (formValues.warrantyStatus as Equipment["warranty"]) ?? "Active",
      amc: formValues.amcVendor || "Not assigned",
      serialNumber: formValues.serialNumber,
      manufacturer: formValues.manufacturer,
      model: formValues.model,
      purchaseDate: formValues.purchaseDate,
      warrantyExpiry: formValues.warrantyExpiry,
      amcExpiry: formValues.amcExpiry,
      nextService: formValues.nextService ?? "",
      owner: formValues.owner,
      uptime: existing?.uptime ?? 100,
      health: existing?.health ?? 96,
    };
    setEquipmentAssets((prev) => prev.map((a) => a.id === id ? updated : a));
    return updated;
  }, [equipmentAssets]);

  const deleteEquipment = useCallback((id: string) => {
    setEquipmentAssets((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const addNonQRItem = useCallback((values: Omit<NonQRItem, "id" | "identity" | "lastChecked">): NonQRItem => {
    const item: NonQRItem = {
      ...values,
      id: `NQ-${String(Date.now()).slice(-4)}`,
      identity: `NQI-${String(Date.now()).slice(-6)}-${Math.random().toString(36).slice(2, 4).toUpperCase()}`,
      lastChecked: "Just now",
    };
    setNonQRItems((prev) => [item, ...prev]);
    return item;
  }, []);

  const deleteNonQRItem = useCallback((id: string) => {
    setNonQRItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const addBill = useCallback((values: Omit<ExpenditureBill, "id" | "uploadedAt">): ExpenditureBill => {
    const bill: ExpenditureBill = {
      ...values,
      id: `BILL-${String(Date.now()).slice(-5)}`,
      uploadedAt: "Just now",
    };
    setBills((prev) => [bill, ...prev]);
    return bill;
  }, []);

  const deleteBill = useCallback((id: string) => {
    setBills((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const setBudget = useCallback((type: "utility" | "repair", amount: number) => {
    setBudgets((prev) => ({ ...prev, [type]: amount }));
  }, []);

  const submitMaintenanceRequest = useCallback((
    values: Omit<MaintenanceRequest, "id" | "status" | "approvalStatus" | "assetName" | "submitted" | "approver">
  ): MaintenanceRequest => {
    const linkedAsset = equipmentAssets.find((a) => a.id === values.assetId);
    const request: MaintenanceRequest = {
      ...values,
      id: `MR-${String(Date.now()).slice(-5)}`,
      status: "Pending Approval",
      approvalStatus: "Awaiting Engineering Approval",
      assetName: linkedAsset?.name ?? "Not linked",
      submitted: "Just now",
      approver: values.priority === "Critical" ? "Chief Engineer" : "Duty Engineer",
    };
    setMaintenanceRequests((prev) => [request, ...prev]);
    return request;
  }, [equipmentAssets]);

  const approveMaintenanceRequest = useCallback((request: MaintenanceRequest): WorkOrder => {
    const workOrder: WorkOrder = {
      id: `WO-${String(Date.now()).slice(-5)}`,
      title: request.title,
      area: request.location,
      priority: request.priority,
      owner: request.priority === "Critical" ? "Duty Engineer" : "Assigned Team",
      stage: "Assigned",
      eta: request.targetTime ? request.targetTime.replace("T", " ") : "Today",
      asset: request.assetId || "Not linked",
      department: request.department,
      source: "Approved Maintenance Request",
      sla: request.priority === "Critical" || request.priority === "High" ? "At risk" : "On track",
    };
    setGeneratedWorkOrders((prev) => [workOrder, ...prev]);
    setMaintenanceRequests((prev) =>
      prev.map((r) =>
        r.id === request.id
          ? { ...r, status: "Approved", approvalStatus: `Work order ${workOrder.id} raised`, workOrderId: workOrder.id }
          : r
      )
    );
    return workOrder;
  }, []);

  const addWorkflow = useCallback((workflow: Workflow) => {
    setWorkflows((prev) => [workflow, ...prev]);
  }, []);

  const value = useMemo<StoreContext>(
    () => ({
      equipmentAssets,
      nonQRItems,
      bills,
      budgets,
      maintenanceRequests,
      generatedWorkOrders,
      workflows,
      roleId,
      activeRole,
      allWorkOrders,
      setRoleId,
      registerEquipment,
      updateEquipment,
      deleteEquipment,
      addNonQRItem,
      deleteNonQRItem,
      addBill,
      deleteBill,
      setBudget,
      submitMaintenanceRequest,
      approveMaintenanceRequest,
      addWorkflow,
    }),
    [equipmentAssets, nonQRItems, bills, budgets, maintenanceRequests, generatedWorkOrders, workflows, roleId, activeRole, allWorkOrders, registerEquipment, updateEquipment, deleteEquipment, addNonQRItem, deleteNonQRItem, addBill, deleteBill, setBudget, submitMaintenanceRequest, approveMaintenanceRequest, addWorkflow]
  );

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore(): StoreContext {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
