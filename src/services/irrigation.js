let irrigationLogs = [];

let currentStatus = {
  isActive: false,
  greenhouseId: null,
};

/* =========================
   ▶ MANUEL / DASHBOARD START
   ========================= */
export const startIrrigation = (greenhouseId, source = "manual") => {
  currentStatus = {
    isActive: true,
    greenhouseId,
  };

  const log = {
    id: Date.now(),
    greenhouseId,
    status: "ACTIVE",
    source, // 👉 NEW (dashboard / manual / auto)
    startTime: new Date().toISOString(),
    endTime: null,
  };

  irrigationLogs.push(log);
  return log;
};

/* =========================
   ⛔ STOP
   ========================= */
export const stopIrrigation = () => {
  if (!currentStatus.isActive) return null;

  const lastLog = irrigationLogs
    .filter((l) => l.status === "ACTIVE")
    .slice(-1)[0];

  if (lastLog) {
    lastLog.status = "STOPPED";
    lastLog.endTime = new Date().toISOString();
  }

  currentStatus = {
    isActive: false,
    greenhouseId: null,
  };

  return lastLog;
};

/* =========================
   📡 STATUS / LOGS
   ========================= */
export const getIrrigationLogs = () => irrigationLogs;

export const getIrrigationStatus = () => currentStatus;

/* =========================
   🧠 YENİ ÖZELLİK: AKILLI SULAMA
   ========================= */

// 💧 otomatik öneri kabul edilince çağrılır
export const autoStartIrrigation = (greenhouseId) => {
  return startIrrigation(greenhouseId, "auto");
};

/* =========================
   🧾 ÖNERİ LOGU (AI / SYSTEM EVENT)
   ========================= */
export const addSystemEvent = (message) => {
  irrigationLogs.push({
    id: Date.now(),
    greenhouseId: currentStatus.greenhouseId,
    status: "SYSTEM_EVENT",
    message,
    time: new Date().toISOString(),
  });
};