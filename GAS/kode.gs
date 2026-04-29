const SS = SpreadsheetApp.getActiveSpreadsheet();
const protectedRoute = ["getInventory", "addSale", "keluar", "updateInventory"];

function doPost(e) {
  try {
    // Safety: Check if e or postData exists
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ error: "No data received" });
    }
    // Parse the JSON
    const data = JSON.parse(e.postData.contents);
    // Get token
    const APP_SECRET_TOKEN =
      PropertiesService.getScriptProperties().getProperty("TOKEN");
    // Check Token
    if (data.token !== APP_SECRET_TOKEN) {
      return jsonResponse({ error: "Unauthorized: Invalid Token" });
    }

    const action = data.action;
    const deviceId = data.deviceId;

    // Verify Device for protected actions
    if (protectedRoute.includes(action)) {
      const verify = verifyDevice(deviceId);
      if (verify.error) {
        return jsonResponse(verify);
      }
    }

    switch (action) {
      case "checkStatus":
        return jsonResponse(handleCheckStatus());
      case "masuk":
        return jsonResponse(handleMasuk(deviceId));
      case "forceLogin":
        return jsonResponse(handleForceLogin(deviceId));
      case "keluar":
        return jsonResponse(handleKeluar());
      case "getInventory":
        return jsonResponse(handleGetInventory());
      case "addSale":
        return jsonResponse(handleAddSale(data.item, data.price));
      case "updateInventory":
        return jsonResponse(handleUpdateInventory(data.item));
      default:
        return jsonResponse({ error: "Invalid Action: " + action });
    }
  } catch (err) {
    // If JSON.parse fails, it returns this instead of a Google HTML error
    return jsonResponse({
      error: "JSON Error: " + err.message,
      raw: e.postData.contents,
    });
  }
}

// --- Logic Functions ---

function verifyDevice(deviceId) {
  const sheet = SS.getSheetByName("System");
  const currentOwner = sheet.getRange("A2").getValue();
  if (currentOwner !== deviceId) {
    return {
      error: "SESSION_EXPIRED",
      message: "HP lain sudah masuk. Silakan masuk kembali.",
    };
  }
  return { success: true };
}

function handleCheckStatus() {
  const sheet = SS.getSheetByName("System");
  let status = sheet.getRange("A2").getValue();
  const lastActivity = new Date(sheet.getRange("B2").getValue());
  const now = new Date();

  // Auto-unlock if more than 30 minutes have passed
  const diffMinutes = (now - lastActivity) / 1000 / 60;
  if (status !== "FREE" && diffMinutes > 30) {
    status = "FREE";
    sheet.getRange("A2").setValue("FREE");
  }

  return { status: status };
}

function handleMasuk(deviceId) {
  const sheet = SS.getSheetByName("System");
  const current = handleCheckStatus();

  if (current.status === "FREE") {
    sheet.getRange("A2").setValue(deviceId);
    sheet.getRange("B2").setValue(new Date());
    return { success: true, message: "Welcome" };
  } else {
    return { success: false, currentOwner: current.status };
  }
}

function handleForceLogin(deviceId) {
  const sheet = SS.getSheetByName("System");
  sheet.getRange("A2").setValue(deviceId);
  sheet.getRange("B2").setValue(new Date());
  return { success: true, message: "Force login successful" };
}

function handleKeluar() {
  SS.getSheetByName("System").getRange("A2").setValue("FREE");
  return { success: true };
}

function handleGetInventory() {
  const rows = SS.getSheetByName("Inventory").getDataRange().getValues();
  const headers = rows.shift(); // Remove headers
  return rows.map((r) => ({ id: r[0], name: r[1], stock: r[2] }));
}

function handleAddSale(itemName, price) {
  const invSheet = SS.getSheetByName("Inventory");
  const salesSheet = SS.getSheetByName("Sales");

  // 1. Add to Sales
  salesSheet.appendRow([new Date(), itemName, price]);

  // 2. Update Stock
  const data = invSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === itemName) {
      invSheet.getRange(i + 1, 3).setValue(data[i][2] - 1);
      break;
    }
  }

  // 3. Update Activity Timestamp
  SS.getSheetByName("System").getRange("B2").setValue(new Date());

  return { success: true };
}

function handleUpdateInventory(item) {
  const sheet = SS.getSheetByName("Inventory");
  const data = sheet.getDataRange().getValues();
  
  if (item.id) {
    // Edit existing
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] == item.id) {
        sheet.getRange(i + 1, 2).setValue(item.name);
        sheet.getRange(i + 1, 3).setValue(item.stock);
        break;
      }
    }
  } else {
    // Create new
    const newId = Utilities.getUuid();
    sheet.appendRow([newId, item.name, item.stock]);
  }
  
  // Update Activity Timestamp
  SS.getSheetByName("System").getRange("B2").setValue(new Date());
  
  return { success: true };
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
