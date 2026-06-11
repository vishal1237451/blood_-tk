import fs from "fs";
import path from "path";

const DB_FILE = path.join(process.cwd(), "local_db.json");

const DEFAULT_INVENTORY = [
  { id: "1", blood_type: "A+", units_available: 10, last_updated: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: "2", blood_type: "A-", units_available: 5, last_updated: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: "3", blood_type: "B+", units_available: 12, last_updated: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: "4", blood_type: "B-", units_available: 3, last_updated: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: "5", blood_type: "AB+", units_available: 4, last_updated: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: "6", blood_type: "AB-", units_available: 2, last_updated: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: "7", blood_type: "O+", units_available: 15, last_updated: new Date().toISOString(), created_at: new Date().toISOString() },
  { id: "8", blood_type: "O-", units_available: 8, last_updated: new Date().toISOString(), created_at: new Date().toISOString() }
];

interface LocalDb {
  blood_inventory: any[];
  donor_applications: any[];
  blood_test_requests: any[];
}

function getDb(): LocalDb {
  if (!fs.existsSync(DB_FILE)) {
    const initialDb: LocalDb = {
      blood_inventory: DEFAULT_INVENTORY,
      donor_applications: [],
      blood_test_requests: []
    };
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), "utf-8");
    } catch (err) {
      console.error("Failed to initialize local DB file:", err);
    }
    return initialDb;
  }
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading local DB file, using empty default state:", error);
    return {
      blood_inventory: DEFAULT_INVENTORY,
      donor_applications: [],
      blood_test_requests: []
    };
  }
}

function saveDb(db: LocalDb) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to local DB file:", error);
  }
}

export async function localGetBloodInventory() {
  const db = getDb();
  return db.blood_inventory;
}

export async function localGetDonorApplications() {
  const db = getDb();
  return db.donor_applications;
}

export async function localGetBloodTestRequests() {
  const db = getDb();
  return db.blood_test_requests;
}

export async function localInsertDonorApplication(app: any) {
  const db = getDb();
  const newApp = {
    id: Math.random().toString(36).substring(2, 9),
    created_at: new Date().toISOString(),
    ...app
  };
  db.donor_applications.unshift(newApp);
  saveDb(db);
  return { success: true, data: newApp };
}

export async function localInsertBloodTestRequest(req: any) {
  const db = getDb();
  const newReq = {
    id: Math.random().toString(36).substring(2, 9),
    created_at: new Date().toISOString(),
    ...req
  };
  db.blood_test_requests.unshift(newReq);
  saveDb(db);
  return { success: true, data: newReq };
}

export async function localUpdateDonorApplicationStatus(id: string, status: string) {
  const db = getDb();
  const app = db.donor_applications.find(a => a.id === id);
  if (app) {
    app.status = status;
    saveDb(db);
    return { success: true };
  }
  return { success: false, error: "Not found" };
}

export async function localUpdateBloodTestRequestStatus(id: string, status: string) {
  const db = getDb();
  const req = db.blood_test_requests.find(r => r.id === id);
  if (req) {
    req.status = status;
    saveDb(db);
    return { success: true };
  }
  return { success: false, error: "Not found" };
}

export async function localDeleteDonorApplication(id: string) {
  const db = getDb();
  const index = db.donor_applications.findIndex(a => a.id === id);
  if (index !== -1) {
    db.donor_applications.splice(index, 1);
    saveDb(db);
    return { success: true };
  }
  return { success: false, error: "Not found" };
}

export async function localDeleteBloodTestRequest(id: string) {
  const db = getDb();
  const index = db.blood_test_requests.findIndex(r => r.id === id);
  if (index !== -1) {
    db.blood_test_requests.splice(index, 1);
    saveDb(db);
    return { success: true };
  }
  return { success: false, error: "Not found" };
}

