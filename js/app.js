/* ==========================================================================
   Ask-Me — app shell
   Hash routing (#/guides/fees), mobile menu, countdown ticker and the
   reminder switches. No build step and no dependencies.
   ========================================================================== */
(function () {
  "use strict";

  var D = window.ASKME_DATA;
  var A = window.AskMe;
  var main = document.getElementById("main");
  var header = document.getElementById("site-header");
  var toggle = document.getElementById("nav-toggle");
  var cleanup = null;
  var prevName = null;

  function parse() {
    var raw = location.hash.replace(/^#\/?/, "");
    var split = raw.split("?");
    var parts = split[0].split("/").filter(Boolean);
    var query = {};
    try { new URLSearchParams(split[1] || "").forEach(function (v, k) { query[k] = v; }); } catch (e) { /* ignore */ }
    var name = parts[0] || "home";
    return { name: name, param: parts[1] || null, query: query };
  }

  function setMenu(open) {
    header.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.querySelector(".nav-toggle-label").textContent = open ? "Close" : "Menu";
    toggle.querySelector(".nav-toggle-icon").innerHTML = A.icon(open ? "close" : "menu", 18);
  }

  function render() {
    var ctx = parse();
    var view = A.views[ctx.name] || A.views.notFound;
    if (cleanup) { cleanup(); cleanup = null; }

    main.innerHTML = view.render(ctx);
    document.title = view.title(ctx) + " · " + D.meta.siteName;
    cleanup = view.mount ? view.mount(main, ctx) || null : null;

    // Highlight the current section in the navigation.
    var current = A.views[ctx.name] ? ctx.name : "";
    document.querySelectorAll("[data-route]").forEach(function (a) {
      if (a.getAttribute("data-route") === current) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    setMenu(false);

    A.syncReminders();
    tick();

    // Move focus and scroll sensibly for keyboard and screen-reader users.
    var sameGuideView = prevName === "guides" && ctx.name === "guides";
    var target = (sameGuideView && main.querySelector("[data-focus]")) || main.querySelector("h1");
    // Keep the natural tab order (skip link first) on the first page load.
    if (target && prevName !== null) target.focus({ preventScroll: true });
    if (sameGuideView) {
      if (window.innerWidth < 900 && target) target.scrollIntoView({ block: "start" });
    } else {
      window.scrollTo(0, 0);
    }
    prevName = ctx.name;
  }

  /* ---- Countdown ticker (updates every second) ---------------------------------- */
  function tick() {
    var now = new Date();
    var passedChanged = false;
    document.querySelectorAll("[data-countdown]").forEach(function (el) {
      var d = (D.deadlines || []).filter(function (x) { return x.id === el.getAttribute("data-countdown"); })[0];
      if (!d) return;
      var c = A.countdown(d, now);
      if (el.textContent !== c.text) el.textContent = c.text;
      if (el.getAttribute("data-state") !== c.state) {
        if (c.state === "passed") passedChanged = true;
        el.setAttribute("data-state", c.state);
      }
    });
    if (passedChanged) A.syncReminders();
  }
  window.setInterval(tick, 1000);

  /* ---- Global events --------------------------------------------------------------- */
  document.addEventListener("click", function (e) {
    var sw = e.target.closest("[data-reminder]");
    if (sw && !sw.disabled) {
      A.reminders.toggle(sw.getAttribute("data-reminder"));
      A.syncReminders();
      return;
    }
    var skip = e.target.closest("[data-skip]");
    if (skip) {
      e.preventDefault();
      main.setAttribute("tabindex", "-1");
      main.focus();
    }
  });

  document.addEventListener("submit", function (e) {
    var form = e.target.closest("[data-ask-form]");
    if (!form) return;
    e.preventDefault();
    var q = (form.querySelector("input[name=q]").value || "").trim();
    location.hash = q ? "#/ask?q=" + encodeURIComponent(q) : "#/ask";
  });

  toggle.addEventListener("click", function () {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      toggle.focus();
    }
  });

  window.addEventListener("hashchange", render);
  render();
})();
