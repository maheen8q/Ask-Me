/* ==========================================================================
   Ask-Me — shared logic (no DOM rendering here)
   Escaping, icons, storage, reminders, countdowns and FAQ keyword matching.
   ========================================================================== */
(function () {
  "use strict";

  var D = window.ASKME_DATA;
  var AskMe = (window.AskMe = {});

  /* ---- Small helpers ------------------------------------------------------ */
  var ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  AskMe.esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return ESC[c]; });
  };

  // Returns the value, or the fallback when it is missing/blank.
  AskMe.val = function (v, fallback) {
    return v === null || v === undefined || String(v).trim() === "" ? fallback : v;
  };

  AskMe.pad = function (n) { return String(n).length < 2 ? "0" + n : String(n); };

  var ICONS = {
    "arrow-ur": '<path d="M4.5 11.5l7-7M5.5 4.5h6v6"/>',
    "arrow-r": '<path d="M2.5 8h11M9.5 4l4 4-4 4"/>',
    "menu": '<path d="M2 4.5h12M2 8h12M2 11.5h12"/>',
    "close": '<path d="M3.5 3.5l9 9M12.5 3.5l-9 9"/>',
    "chevron": '<path d="M4 6l4 4 4-4"/>',
  };
  AskMe.icon = function (name, size) {
    size = size || 14;
    return (
      '<svg class="icon" width="' + size + '" height="' + size + '" viewBox="0 0 16 16" fill="none" ' +
      'stroke="currentColor" stroke-width="1.4" stroke-linecap="square" aria-hidden="true" focusable="false">' +
      ICONS[name] + "</svg>"
    );
  };

  /* ---- Storage (localStorage with an in-memory fallback) ------------------ */
  var mem = {};
  AskMe.storage = {
    get: function (key) {
      try {
        var v = window.localStorage.getItem(key);
        if (v !== null) return v;
      } catch (e) { /* storage blocked: fall through to memory */ }
      return Object.prototype.hasOwnProperty.call(mem, key) ? mem[key] : null;
    },
    set: function (key, value) {
      mem[key] = value;
      try { window.localStorage.setItem(key, value); } catch (e) { /* ignore */ }
    },
  };

  /* ---- Deadlines & countdowns -------------------------------------------- */
  AskMe.deadlineAt = function (d) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String((d && d.date) || ""));
    if (!m) return null;
    var t = /^(\d{1,2}):(\d{2})$/.exec(String(d.time || "23:59")) || [null, "23", "59"];
    var at = new Date(+m[1], +m[2] - 1, +m[3], +t[1], +t[2], 59);
    return isNaN(at.getTime()) ? null : at;
  };

  AskMe.formatDate = function (d) {
    var at = AskMe.deadlineAt(d);
    if (!at) return "Date to be confirmed";
    return at.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
  };

  // state: "upcoming" | "today" (under 24h left) | "passed" | "unknown"
  AskMe.countdown = function (d, now) {
    var at = AskMe.deadlineAt(d);
    if (!at) return { state: "unknown", text: "Date to be confirmed" };
    var ms = at.getTime() - (now || new Date()).getTime();
    if (ms <= 0) return { state: "passed", text: "Deadline passed", ms: ms };
    var s = Math.floor(ms / 1000);
    var days = Math.floor(s / 86400);
    var h = Math.floor((s % 86400) / 3600);
    var m = Math.floor((s % 3600) / 60);
    var sec = s % 60;
    var text;
    if (days >= 1) text = days + (days === 1 ? " day, " : " days, ") + h + (h === 1 ? " hour" : " hours") + " left";
    else if (h >= 1) text = h + " h " + m + " min left";
    else text = (m > 0 ? m + " min " : "") + sec + " s left";
    return { state: days < 1 ? "today" : "upcoming", text: text, days: days, ms: ms };
  };

  AskMe.sortedDeadlines = function () {
    var now = new Date();
    var list = (D.deadlines || []).map(function (d) { return { d: d, at: AskMe.deadlineAt(d) }; });
    var up = list.filter(function (x) { return x.at && x.at > now; }).sort(function (a, b) { return a.at - b.at; });
    var rest = list.filter(function (x) { return !x.at || x.at <= now; }).sort(function (a, b) {
      return (b.at ? b.at.getTime() : 0) - (a.at ? a.at.getTime() : 0);
    });
    return up.concat(rest).map(function (x) { return x.d; });
  };

  /* ---- Reminder preferences (persisted in the browser) -------------------- */
  var REM_KEY = "askme.reminders.v1";
  AskMe.reminders = {
    read: function () {
      try {
        var arr = JSON.parse(AskMe.storage.get(REM_KEY) || "[]");
        var valid = {};
        (D.deadlines || []).forEach(function (d) { valid[d.id] = true; });
        return Array.isArray(arr) ? arr.filter(function (id) { return valid[id]; }) : [];
      } catch (e) { return []; }
    },
    isOn: function (id) { return AskMe.reminders.read().indexOf(id) !== -1; },
    set: function (id, on) {
      var cur = AskMe.reminders.read().filter(function (x) { return x !== id; });
      if (on) cur.push(id);
      AskMe.storage.set(REM_KEY, JSON.stringify(cur));
      return on;
    },
    toggle: function (id) { return AskMe.reminders.set(id, !AskMe.reminders.isOn(id)); },
  };

  /* ---- FAQ keyword matching ----------------------------------------------- */
  var STOP = {};
  ("a an the is are was were be been to of for on in at by with and or my me i we you your our do does did how what when " +
   "where who can could should would will please about it its this that there any get have has need want if not am").split(" ")
    .forEach(function (w) { STOP[w] = true; });

  function stem(w) {
    if (w.length > 4 && /ies$/.test(w)) return w.slice(0, -3) + "y";
    if (w.length > 5 && /ied$/.test(w)) return w.slice(0, -3) + "y";
    if (w.length > 5 && /ing$/.test(w)) return w.slice(0, -3);
    if (w.length > 4 && /[^e]ed$/.test(w)) return w.slice(0, -2);
    if (w.length > 4 && /(ss|x|ch|sh)es$/.test(w)) return w.slice(0, -2);
    if (w.length > 3 && /[^s]s$/.test(w)) return w.slice(0, -1);
    return w;
  }

  // Lower-case, drop apostrophes/hyphens, split into stemmed non-stop words.
  function tokens(text, keepStop) {
    return String(text || "")
      .toLowerCase()
      .replace(/['’]/g, "")
      .replace(/-/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .split(" ")
      .filter(function (w) { return w && (keepStop || !STOP[w]); })
      .map(stem);
  }

  function score(queryTokens, keywords) {
    var set = {};
    queryTokens.forEach(function (t) { set[t] = true; });
    var total = 0;
    (keywords || []).forEach(function (kw) {
      var kt = tokens(kw);
      if (kt.length && kt.every(function (t) { return set[t]; })) total += kt.length * kt.length; // phrases count for more than single words
    });
    return total;
  }

  // Returns matching FAQ entries, best first (empty array when nothing matches).
  AskMe.faqMatch = function (query) {
    var qt = tokens(query);
    if (!qt.length) return [];
    var exact = tokens(query, true).join(" ");
    return D.faq.entries
      .map(function (e, i) {
        var s = score(qt, e.keywords);
        if (exact && exact === tokens(e.question, true).join(" ")) s += 100;
        return { entry: e, score: s, order: i };
      })
      .filter(function (x) { return x.score > 0; })
      .sort(function (a, b) { return b.score - a.score || a.order - b.order; })
      .map(function (x) { return x.entry; });
  };

  AskMe.team = function (id) {
    return (D.teams || []).filter(function (t) { return t.id === id; })[0] || null;
  };

  // Best-guess office for a question we could not answer (falls back to Student Affairs).
  AskMe.suggestTeam = function (query) {
    var qt = tokens(query);
    var best = null, bestScore = 0;
    (D.teams || []).forEach(function (t) {
      var s = score(qt, t.keywords);
      if (s > bestScore) { best = t; bestScore = s; }
    });
    return { team: best || AskMe.team("student-affairs") || D.teams[0], guessed: !!best };
  };
})();
