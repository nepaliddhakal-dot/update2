// ══════════════════════════════════════════════════════════════════
// MFD Duty Roster — Google Apps Script (COMPLETE v3)
// Deploy → Manage deployments → New version → Deploy
// Execute as: Me  |  Who has access: Anyone
// ══════════════════════════════════════════════════════════════════

const SHEET_ID    = '1tM7Og_U02E4gLmRrfdRWf1JdiRiCWoaf3IurA7jzS9c';
const ADMIN_EMAIL = 'nepali.ddhakal@gmail.com';

// ── Firebase Service Account (for FCM push notifications) ─────────
const FCM_SERVICE_ACCOUNT = {
  "type": "service_account",
  "project_id": "mfd-roster",
  "private_key_id": "44e7f11dea41a9d226fc7ac7df51b5b2f39a9720",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDrgp9YRFyeBmAz\nHZRx39UUHQ4Dgqwm8PALqSmqhZhRzT2L1DFcjMWf+CPIOp5iqvgsnzOJh/okiJGw\nYLclvzgBMJIeJS7SWiSPNlCAQpjwMkniZmovr9Jt35y8mlGZEkhSA2SxrDavOzMV\nhx4RA/fbTtdUC15naHnQnlMIyplmbfwHYZcyK9+G2nk761nxmZSXiIfUHalFug2/\nbWTq0835BLKexw1jC+C669w+vZ9NXPi87j4R6ST1uyaIQuTQbIXuPRR2xsim7a2A\nq7jOZ4QOdexHEcsPtsorSFxYvS4K5pzvMkhJY1MbVq+vopKhlMYVhVCTn+bMbNma\nDfxt1fc9AgMBAAECggEAMmlCKv5tFc1XE7Hx98MaBOVoPcOfjnFV7KUP3Gae0Wm9\nkhwAWedvGPwgSqiThRrEJycHvNlsp5vNFaRKJ8wL1KNdL5M1d8TgXQBbEG1Q999H\n1eymr6Dyyd6K2gstSrbxYI7F48sxZGZnW6URwEIpcJnqeRy63ycrpgZxzyiw183r\nfCoet/hTMpLa3VR+xPDiQl2CRE9jejo62idJntxvEiVIdoE6N5hASOn9lTSxHWxw\n9Njb+dvyWsHuhX5PcAlB0bOyrIkjqJsdy2fHYgBEq1fQQxZ/ghS0Az1RoarbjK/S\nGADq9nAPb6moVO4IHKp32Q2gIs9P052GhnSib7ATcQKBgQD4KIgzRtKqpX+9Ezv0\nt+6pLP9TBlpiF9lOPazH1vLpjxfA35MUWlF9atNvckNky3kDgbEzLXEksaiwls4V\n+NFRhmiS8Woc+KpS5NMH+FHvOXp/HBIm6sLSo0uDfNnd3BJzsYv9nm7dCMTXTsGg\nAc5MbYfmiCTAJY2kEl7z+9AMLQKBgQDy88YwpujmW28aFSSkiVETn3+cCCuMBWJo\n2FFp3S5WU5LGSoCgtUkdXc3u3mI8CcZ19oMNlty4zdiUSt6qnvef0b3l2DJ2QwE5\n8V+DS61p4ZQomqd8+L7qanWhNrjUlRa6WZ7PbAcb/MUK50jGKDdafcRbCnbyWhL7\nsxqijlOxUQKBgQD3RbQJnB2YypZROdQ5Ufnu+xZjjWYMboUq8Eu1SVr9HYdmuaDd\n2+1tUj/iwfGjgxhPRTDjtPkTvi8/3tT1kdxJJuwW15WLzsAxHy+ktmw2Ooj0FW2E\n99Ivf2VkXMjeyEZen+DFU9RWTUGO5TwMiyAcidur+6bbC9BqV5/j79vr9QKBgDoa\n51mXcbg2Qfog+GSJmuRwjxqIMbIJT6H3qnEBPyXSUxYtl1nYQaZOWwQ4F5J4XAi2\nbl1/qUZhpNzCk0KHRn3osdwYuujh2Zc8DTXfkZfzJXYYltoiu7Zgw8VMyyO8jHUB\nHiRJl+GvsIiNDDCoSaTQ03dap1wLAuND0Kj0FTwhAoGACKS1xVr9X5jYOk/3auhS\nnHZnrQ8hIl4qyIr0mqPlxb7BReEEwfFsxU7pWiRpCDMApuH01zm1L+FtDJQxw+Eo\n2Fsd2/9ivnhayUyoioHogTDM28bdnkn/lKqZyOWdOtYEafF7yUyMXPR0uT23EpAY\nX4BMAEEB9g9I0fCKxoG2zGU=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@mfd-roster.iam.gserviceaccount.com",
  "token_uri": "https://oauth2.googleapis.com/token"
};

// ══════════════════════════════════════════════════════════════════
// DUTY LABELS (used in notification messages)
// ══════════════════════════════════════════════════════════════════
function shiftLabel(s) {
  const map = {
    // Forecaster
    'AFN*' : 'Day Night Forecaster★ (12PM–next day 12PM)',
    'NMF*' : 'Night Morning Forecaster★ (12PM–next day 12PM)',
    'MF'   : 'Morning Forecaster (6AM–12PM)',
    'AF'   : 'Afternoon Forecaster (12PM–6PM)',
    'M1'   : 'Morning Supporter (6AM–12PM)',
    'A1'   : 'Afternoon Supporter (12PM–6PM)',
    'MA'   : 'Morning Aviation Forecaster (6AM–12PM)',
    'DA'   : 'Day Aviation Forecaster (12PM–6PM)',
    // Sr. Div. Met.
    'SM'   : 'Sr. Met. Morning (6AM–12PM)',
    'SA'   : 'Sr. Met. Afternoon (12PM–6PM)',
    'SD'   : 'Sr. Met. Day (12PM–6PM)',
    'SMA'  : 'Sr. Met. Aviation Morning (6AM–12PM)',
    'SDA'  : 'Sr. Met. Aviation Day (12PM–6PM)',
    // Observer
    'AON*' : 'Day Night Observer★ (12PM–next day 12PM)',
    'NMO*' : 'Night Morning Observer★ (12PM–next day 12PM)',
    'MO'   : 'Morning Observer (6AM–12PM)',
    'AO'   : 'Afternoon Observer (12PM–6PM)',
    'MO1'  : 'Morning Supporting Observer (6AM–12PM)',
    'AO2'  : 'Afternoon Supporting Observer (12PM–6PM)',
    // Off
    'xx'   : 'Duty Off',
    'XX'   : 'Duty Off',
  };
  return map[s] || s || 'Duty Off';
}

// ══════════════════════════════════════════════════════════════════
// GET HANDLER
// ══════════════════════════════════════════════════════════════════
function doGet(e) {
  const action = e.parameter.action;

  // ── Load all roster + staff data (used by app on startup) ────────
  if (action === 'getRosters') {
    const rosterSheet = getOrCreateSheet('ROSTER_DATA');
    const staffSheet  = getOrCreateSheet('STAFF_DATA');
    const rosterRaw   = rosterSheet.getRange('A1').getValue();
    const staffRaw    = staffSheet.getRange('A1').getValue();
    return jsonResponse({
      rosters : rosterRaw ? JSON.parse(rosterRaw) : {},
      staff   : staffRaw  ? JSON.parse(staffRaw)  : {}
    });
  }

  // ── Get admin credentials (used by app login) ────────────────────
  if (action === 'getCreds') {
    const sheet    = getOrCreateSheet('SETTINGS');
    const username = sheet.getRange('D1').getValue().toString() || 'admin';
    const pin      = sheet.getRange('A1').getValue().toString() || '1234';
    return jsonResponse({ username, pin });
  }

  // ── Send PIN reset code to admin email ───────────────────────────
  if (action === 'sendCode') {
    return handleSendCode();
  }

  // ── Get all registered FCM tokens ────────────────────────────────
  if (action === 'getTokens') {
    const sheet = getOrCreateSheet('FCM_TOKENS');
    const rows  = sheet.getDataRange().getValues();
    const data  = [];
    rows.forEach(r => {
      if (r[0] && r[2]) {
        data.push({
          name    : r[0],
          role    : r[1],
          token   : r[2],
          updated : r[3] ? r[3].toString().slice(0, 10) : ''
        });
      }
    });
    return jsonResponse({ data });
  }

  // ── Legacy: load all data ────────────────────────────────────────
  if (action === 'loadAll') {
    const sheet = getOrCreateSheet('ROSTER_DATA');
    const cell  = sheet.getRange('A1').getValue();
    return jsonResponse({ data: cell ? JSON.parse(cell) : null });
  }

  // ── Legacy: load staff ───────────────────────────────────────────
  if (action === 'loadStaff') {
    const sheet = getOrCreateSheet('STAFF_DATA');
    const cell  = sheet.getRange('A1').getValue();
    return jsonResponse({ data: cell ? JSON.parse(cell) : null });
  }

  return jsonResponse({ error: 'Unknown action' });
}

// ══════════════════════════════════════════════════════════════════
// POST HANDLER
// ══════════════════════════════════════════════════════════════════
function doPost(e) {
  const payload = JSON.parse(e.postData.contents);

  // ── Save full roster + staff data ────────────────────────────────
  if (payload.action === 'saveRosters') {
    if (payload.rosters) {
      getOrCreateSheet('ROSTER_DATA').getRange('A1').setValue(JSON.stringify(payload.rosters));
    }
    if (payload.staff) {
      getOrCreateSheet('STAFF_DATA').getRange('A1').setValue(JSON.stringify(payload.staff));
    }
    return jsonResponse({ success: true });
  }

  // ── Save staff only ──────────────────────────────────────────────
  if (payload.action === 'saveStaff') {
    const staffData = payload.staff || payload.data;
    if (staffData) {
      getOrCreateSheet('STAFF_DATA').getRange('A1').setValue(JSON.stringify(staffData));
    }
    return jsonResponse({ success: true });
  }

  // ── Save admin credentials ───────────────────────────────────────
  if (payload.action === 'saveCreds') {
    const sheet = getOrCreateSheet('SETTINGS');
    if (payload.pin)      sheet.getRange('A1').setValue(payload.pin);
    if (payload.username) sheet.getRange('D1').setValue(payload.username);
    return jsonResponse({ success: true });
  }

  // ── Save duty swap/change request from staff ─────────────────────
  if (payload.action === 'saveSwapRequest') {
    const sheet = getOrCreateSheet('SWAP_REQUESTS');
    // Add header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'User', 'Role', 'Date', 'Current Duty',
        'Requested Duty', 'Message', 'Timestamp'
      ]);
      // Format header row
      sheet.getRange(1, 1, 1, 7).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }
    sheet.appendRow([
      payload.user          || '',
      payload.role          || '',
      payload.date          || '',
      payload.currentDuty   || '',
      payload.requestedDuty || '',
      payload.message       || '',
      payload.timestamp     || new Date().toISOString()
    ]);
    // Optional: send email to admin about new swap request
    try {
      MailApp.sendEmail({
        to      : ADMIN_EMAIL,
        subject : 'MFD Roster — Duty Change Request from ' + (payload.user || 'Staff'),
        body    : [
          'A duty change request has been submitted.',
          '',
          'Staff Name : ' + (payload.user || ''),
          'Role       : ' + (payload.role || ''),
          'Date       : ' + (payload.date || ''),
          'Current    : ' + (payload.currentDuty || ''),
          'Requested  : ' + (payload.requestedDuty || ''),
          'Message    : ' + (payload.message || ''),
          '',
          'Please review in Google Sheets → SWAP_REQUESTS tab.'
        ].join('\n')
      });
    } catch(err) {
      // Email failed but still save the request
    }
    return jsonResponse({ success: true });
  }

  // ── Register FCM device token ────────────────────────────────────
  if (payload.action === 'saveToken') {
    return handleSaveToken(payload.name, payload.role, payload.token);
  }

  // ── Remove FCM device token ──────────────────────────────────────
  if (payload.action === 'removeToken') {
    return handleRemoveToken(payload.name, payload.role);
  }

  // ── Send push notification ───────────────────────────────────────
  if (payload.action === 'sendNotification') {
    return handleSendNotification(
      payload.title,
      payload.body,
      payload.target,
      payload.personName,
      payload.personRole
    );
  }

  // ── Verify PIN reset code ────────────────────────────────────────
  if (payload.action === 'verifyCode') {
    return handleVerifyCode(payload.code);
  }

  // ── Legacy: save all ─────────────────────────────────────────────
  if (payload.action === 'saveAll') {
    getOrCreateSheet('ROSTER_DATA').getRange('A1').setValue(JSON.stringify(payload.data));
    return jsonResponse({ success: true });
  }

  return jsonResponse({ error: 'Unknown action' });
}

// ══════════════════════════════════════════════════════════════════
// FCM TOKEN MANAGEMENT
// ══════════════════════════════════════════════════════════════════
function handleSaveToken(name, role, token) {
  try {
    const sheet = getOrCreateSheet('FCM_TOKENS');
    const rows  = sheet.getDataRange().getValues();
    for (let i = 0; i < rows.length; i++) {
      if (rows[i][0] === name && rows[i][1] === role) {
        sheet.getRange(i + 1, 3).setValue(token);
        sheet.getRange(i + 1, 4).setValue(new Date().toISOString().slice(0, 10));
        return jsonResponse({ success: true });
      }
    }
    sheet.appendRow([name, role, token, new Date().toISOString().slice(0, 10)]);
    return jsonResponse({ success: true });
  } catch(err) {
    return jsonResponse({ success: false, error: err.message });
  }
}

function handleRemoveToken(name, role) {
  try {
    const sheet = getOrCreateSheet('FCM_TOKENS');
    const rows  = sheet.getDataRange().getValues();
    for (let i = rows.length - 1; i >= 0; i--) {
      if (rows[i][0] === name && rows[i][1] === role) {
        sheet.deleteRow(i + 1);
      }
    }
    return jsonResponse({ success: true });
  } catch(err) {
    return jsonResponse({ success: false, error: err.message });
  }
}

// ══════════════════════════════════════════════════════════════════
// FCM PUSH NOTIFICATIONS
// ══════════════════════════════════════════════════════════════════
function getFCMAccessToken() {
  const now      = Math.floor(Date.now() / 1000);
  const header   = Utilities.base64EncodeWebSafe(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claimSet = Utilities.base64EncodeWebSafe(JSON.stringify({
    iss   : FCM_SERVICE_ACCOUNT.client_email,
    scope : 'https://www.googleapis.com/auth/firebase.messaging',
    aud   : FCM_SERVICE_ACCOUNT.token_uri,
    exp   : now + 3600,
    iat   : now
  }));
  const signInput = header + '.' + claimSet;
  const signature = Utilities.base64EncodeWebSafe(
    Utilities.computeRsaSha256Signature(signInput, FCM_SERVICE_ACCOUNT.private_key)
  );
  const jwt  = signInput + '.' + signature;
  const resp = UrlFetchApp.fetch(FCM_SERVICE_ACCOUNT.token_uri, {
    method      : 'POST',
    contentType : 'application/x-www-form-urlencoded',
    payload     : 'grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=' + jwt,
    muteHttpExceptions: true
  });
  return JSON.parse(resp.getContentText()).access_token;
}

function sendOneFCM(token, title, body, accessToken) {
  const url = 'https://fcm.googleapis.com/v1/projects/' +
    FCM_SERVICE_ACCOUNT.project_id + '/messages:send';
  const msg = {
    message: {
      token        : token,
      notification : { title, body },
      android      : {
        notification: {
          icon       : 'ic_notification',
          sound      : 'default',
          channel_id : 'mfd_duties'
        }
      },
      webpush: {
        notification: {
          icon    : '/icons/icon-192.png',
          badge   : '/icons/icon-96.png',
          vibrate : [200, 100, 200]
        },
        fcm_options: { link: '/' }
      }
    }
  };
  const resp = UrlFetchApp.fetch(url, {
    method             : 'POST',
    contentType        : 'application/json',
    headers            : { Authorization: 'Bearer ' + accessToken },
    payload            : JSON.stringify(msg),
    muteHttpExceptions : true
  });
  return resp.getResponseCode() === 200;
}

function handleSendNotification(title, body, target, personName, personRole) {
  try {
    const sheet  = getOrCreateSheet('FCM_TOKENS');
    const rows   = sheet.getDataRange().getValues();
    const token_ = getFCMAccessToken();
    let tokens   = [];
    rows.forEach(r => {
      if (!r[0] || !r[2]) return;
      const name = r[0], role = r[1], tok = r[2];
      if      (target === 'all')                                                tokens.push(tok);
      else if (target === 'person' && name === personName && role === personRole) tokens.push(tok);
      else if (target === role)                                                  tokens.push(tok);
    });
    if (!tokens.length) {
      return jsonResponse({ success: false, error: 'No registered devices for this target.' });
    }
    let sent = 0;
    tokens.forEach(tok => { if (sendOneFCM(tok, title, body, token_)) sent++; });
    return jsonResponse({ success: true, sent });
  } catch(err) {
    return jsonResponse({ success: false, error: err.message });
  }
}

// ══════════════════════════════════════════════════════════════════
// PIN RESET VIA EMAIL
// ══════════════════════════════════════════════════════════════════
function handleSendCode() {
  try {
    const code    = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
    const sheet   = getOrCreateSheet('SETTINGS');
    sheet.getRange('B1').setValue(code);
    sheet.getRange('C1').setValue(expires);
    MailApp.sendEmail({
      to      : ADMIN_EMAIL,
      subject : 'MFD Roster — PIN Reset Code',
      body    : [
        'Your PIN reset code is: ' + code,
        '',
        'This code expires in 10 minutes.',
        '',
        'If you did not request this, please ignore this email.'
      ].join('\n')
    });
    return jsonResponse({ success: true, email: maskEmail(ADMIN_EMAIL) });
  } catch(err) {
    return jsonResponse({ success: false, error: err.message });
  }
}

function handleVerifyCode(code) {
  try {
    const sheet   = getOrCreateSheet('SETTINGS');
    const stored  = sheet.getRange('B1').getValue().toString().trim();
    const expires = parseInt(sheet.getRange('C1').getValue()) || 0;
    if (!stored)              return jsonResponse({ success: false, error: 'No code was requested.' });
    if (Date.now() > expires) return jsonResponse({ success: false, error: 'Code expired. Request a new one.' });
    if (code.trim() !== stored) return jsonResponse({ success: false, error: 'Incorrect code. Try again.' });
    // Clear code after successful verify
    sheet.getRange('B1').setValue('');
    sheet.getRange('C1').setValue('');
    return jsonResponse({ success: true });
  } catch(err) {
    return jsonResponse({ success: false, error: err.message });
  }
}

// ══════════════════════════════════════════════════════════════════
// AUTO NOTIFICATIONS — Time-triggered (run setupDailyTriggers once)
// ══════════════════════════════════════════════════════════════════
const NEPAL_OFFSET_MS = (5 * 60 + 45) * 60 * 1000; // UTC+5:45

function getTodayNepal() {
  return new Date(Date.now() + NEPAL_OFFSET_MS).toISOString().slice(0, 10);
}
function getTomorrowNepal() {
  return new Date(Date.now() + NEPAL_OFFSET_MS + 86400000).toISOString().slice(0, 10);
}

// Get all duties for a specific date from ROSTER_DATA
function getDutiesForDate(isoDate) {
  try {
    const sheet = getOrCreateSheet('ROSTER_DATA');
    const raw   = sheet.getRange('A1').getValue();
    if (!raw) return [];
    const roster  = JSON.parse(raw);
    const results = [];
    const roleMap = {
      'observer'   : 'observer',
      'forecaster' : 'forecaster',
      'sdm'        : 'sdm',
      'obs'        : 'observer',
      'fore'       : 'forecaster',
      'smet'       : 'sdm'
    };
    Object.keys(roster).forEach(key => {
      const role     = roleMap[key] || key;
      const roleData = roster[key];
      const months   = roleData.months || (Array.isArray(roleData) ? roleData : []);
      months.forEach(month => {
        (month.days || []).forEach(day => {
          const dayDate = day.date || day.isoDate;
          if (dayDate === isoDate && day.duties) {
            Object.entries(day.duties).forEach(([name, shift]) => {
              if (shift && shift !== 'xx' && shift !== 'XX') {
                results.push({ name, role, shift });
              }
            });
          }
        });
      });
    });
    return results;
  } catch(e) {
    console.error('getDutiesForDate error:', e);
    return [];
  }
}

function getTokensMap() {
  const sheet = getOrCreateSheet('FCM_TOKENS');
  const rows  = sheet.getDataRange().getValues();
  const map   = {};
  rows.forEach(r => { if (r[0] && r[2]) map[r[0] + '|' + r[1]] = r[2]; });
  return map;
}

// ── 5:30 AM Nepal — Today's duty notification ─────────────────────
// ⚙️ Change atHour(5).nearMinute(30) to change time
function sendMorningNotifications() {
  try {
    const today       = getTodayNepal();
    const duties      = getDutiesForDate(today);
    const tokenMap    = getTokensMap();
    const accessToken = getFCMAccessToken();
    let sent = 0;
    duties.forEach(({ name, role, shift }) => {
      const token = tokenMap[name + '|' + role];
      if (!token) return;
      const title = '📋 MFD — Duty Today';
      const body  = 'नमस्ते ' + name + '! आजको ड्युटि: ' + shiftLabel(shift) +
                    '. Please report on time.';
      if (sendOneFCM(token, title, body, accessToken)) sent++;
    });
    console.log('Morning notifications sent: ' + sent + ' for ' + today);
  } catch(e) {
    console.error('sendMorningNotifications error:', e);
  }
}

// ── 8:30 PM Nepal — Tomorrow's duty notification ──────────────────
// ⚙️ Change atHour(20).nearMinute(30) to change time
function sendEveningNotifications() {
  try {
    const tomorrow    = getTomorrowNepal();
    const duties      = getDutiesForDate(tomorrow);
    const tokenMap    = getTokensMap();
    const accessToken = getFCMAccessToken();
    let sent = 0;

    duties.forEach(({ name, role, shift }) => {
      const token = tokenMap[name + '|' + role];
      if (!token) return;
      const title = '🌙 MFD — Duty Tomorrow';
      const body  = 'नमस्ते ' + name + '! भोलिको ड्युटि: ' + shiftLabel(shift) +
                    ' (' + tomorrow + '). Please be prepared!';
      if (sendOneFCM(token, title, body, accessToken)) sent++;
    });

    // Also notify day-off staff
    const sheet      = getOrCreateSheet('FCM_TOKENS');
    const rows       = sheet.getDataRange().getValues();
    const onDutyKeys = new Set(duties.map(d => d.name + '|' + d.role));
    rows.forEach(r => {
      if (!r[0] || !r[2]) return;
      const key = r[0] + '|' + r[1];
      if (!onDutyKeys.has(key)) {
        const title = '✅ MFD — Day Off Tomorrow';
        const body  = 'नमस्ते ' + r[0] + '! भोलि तपाईंको बिदा छ। आराम गर्नुहोस्!';
        if (sendOneFCM(r[2], title, body, accessToken)) sent++;
      }
    });

    console.log('Evening notifications sent: ' + sent + ' for ' + tomorrow);
  } catch(e) {
    console.error('sendEveningNotifications error:', e);
  }
}

// ══════════════════════════════════════════════════════════════════
// SETUP TRIGGERS — Run this function ONCE manually
// ══════════════════════════════════════════════════════════════════
function setupDailyTriggers() {
  // Remove existing triggers first
  ScriptApp.getProjectTriggers().forEach(t => {
    const fn = t.getHandlerFunction();
    if (fn === 'sendMorningNotifications' || fn === 'sendEveningNotifications') {
      ScriptApp.deleteTrigger(t);
    }
  });

  // 5:30 AM Nepal time (Nepal is UTC+5:45, so ~11:45 PM UTC previous day)
  // Google triggers use server time — set to UTC 23:45 which = Nepal 5:30 AM
  ScriptApp.newTrigger('sendMorningNotifications')
    .timeBased().everyDays(1).atHour(5).nearMinute(30).create();

  // 8:30 PM Nepal time
  ScriptApp.newTrigger('sendEveningNotifications')
    .timeBased().everyDays(1).atHour(20).nearMinute(30).create();

  console.log('✅ Triggers set! Morning: 5:30 AM | Evening: 8:30 PM (Nepal time)');
}

// ══════════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════════
function getOrCreateSheet(name) {
  const ss    = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName(name);
  return sheet || ss.insertSheet(name);
}

function maskEmail(email) {
  const [user, domain] = email.split('@');
  return user.slice(0, 2) + '***@' + domain;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ══════════════════════════════════════════════════════════════════
// MANUAL TEST FUNCTIONS — Run these to test without waiting
// ══════════════════════════════════════════════════════════════════
function testMorningNow()  { sendMorningNotifications(); }
function testEveningNow()  { sendEveningNotifications(); }
function testSwapEmail()   {
  // Test swap request email
  MailApp.sendEmail({
    to      : ADMIN_EMAIL,
    subject : 'TEST — MFD Duty Change Request',
    body    : 'This is a test swap request email from Apps Script.'
  });
  console.log('Test email sent to ' + ADMIN_EMAIL);
}
