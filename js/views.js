/* ==========================================================================
   Ask-Me — views
   Each view is { title(ctx), render(ctx) -> html, mount(root, ctx) -> cleanup? }
   All content comes from window.ASKME_DATA (see data.js).
   ========================================================================== */
(function () {
  "use strict";

  var D = window.ASKME_DATA;
  var A = window.AskMe;
  var esc = A.esc, val = A.val, icon = A.icon, pad = A.pad;
  var views = (A.views = {});

  /* ---- Reusable components ------------------------------------------------ */
  function crumbs(items) {
    return (
      '<nav class="crumbs" aria-label="Breadcrumb"><ol>' +
      items.map(function (it, i) {
        var last = i === items.length - 1;
        return "<li" + (last ? ' aria-current="page"' : "") + ">" +
          (it[1] && !last ? '<a href="' + it[1] + '">' + esc(it[0]) + "</a>" : esc(it[0])) + "</li>";
      }).join("") +
      "</ol></nav>"
    );
  }

  function pageHead(o) {
    return (
      '<header class="page-head wrap">' + crumbs(o.crumbs) +
      '<h1 tabindex="-1">' + o.title + "</h1>" +
      (o.lede ? '<p class="lede">' + esc(o.lede) + "</p>" : "") +
      "</header>"
    );
  }

  function sampleNotice() {
    if (!D.meta.sampleData) return "";
    return (
      '<p class="notice"><strong>Sample information.</strong> Names, rooms, emails, phone numbers and dates on this page ' +
      "are placeholders. Please confirm details with the university before relying on them.</p>"
    );
  }

  function phoneHref(p) { return "tel:" + String(p).replace(/[^\d+]/g, ""); }

  function contactDl(c) {
    c = c || {};
    var email = val(c.email, ""), phone = val(c.phone, "");
    return (
      '<dl class="facts">' +
      "<div><dt>Office</dt><dd>" + esc(val(c.office, "Office to be confirmed")) + "</dd></div>" +
      "<div><dt>Room</dt><dd>" + esc(val(c.room, "Room to be confirmed")) + "</dd></div>" +
      "<div><dt>Hours</dt><dd>" + esc(val(c.hours, "Hours to be confirmed")) + "</dd></div>" +
      "<div><dt>Contact</dt><dd>" +
      (email ? '<a href="mailto:' + esc(email) + '">' + esc(email) + "</a>" : '<span class="muted">Email not listed</span>') +
      "<br>" +
      (phone ? '<a href="' + esc(phoneHref(phone)) + '">' + esc(phone) + "</a>" : '<span class="muted">Phone not listed</span>') +
      "</dd></div></dl>"
    );
  }

  function countdownText(d) {
    var c = A.countdown(d);
    return '<span class="countdown" data-countdown="' + esc(d.id) + '" data-state="' + c.state + '">' + esc(c.text) + "</span>";
  }

  function reminderSwitch(d) {
    return (
      '<button type="button" class="switch" role="switch" aria-checked="false" data-reminder="' + esc(d.id) + '"' +
      ' aria-label="Remind me about: ' + esc(d.title) + '">' +
      '<span class="switch-track" aria-hidden="true"><span class="switch-thumb"></span></span>' +
      '<span class="switch-label" aria-hidden="true">Remind me</span></button>'
    );
  }

  function guideLink(id) {
    var g = (D.guides || []).filter(function (x) { return x.id === id; })[0];
    return g ? '<a class="text-link" href="#/guides/' + esc(g.id) + '">' + esc(g.label) + " guide " + icon("arrow-ur") + "</a>" : "";
  }

  /* Keeps every reminder switch, row and summary line in step with storage. */
  A.syncReminders = function () {
    var on = A.reminders.read();
    var now = new Date();
    document.querySelectorAll("[data-reminder]").forEach(function (btn) {
      var id = btn.getAttribute("data-reminder");
      var d = (D.deadlines || []).filter(function (x) { return x.id === id; })[0];
      var closed = d && A.countdown(d, now).state === "passed";
      var isOn = on.indexOf(id) !== -1 && !closed;
      btn.setAttribute("aria-checked", isOn ? "true" : "false");
      btn.disabled = !!closed;
      var label = btn.querySelector(".switch-label");
      if (label) label.textContent = closed ? "Closed" : isOn ? "Reminder on" : "Remind me";
      var row = btn.closest("[data-deadline-row]");
      if (row) {
        row.classList.toggle("is-on", isOn);
        row.classList.toggle("is-closed", !!closed);
        var soon = row.querySelector(".tag-soon");
        if (soon) soon.hidden = !(isOn && d && A.countdown(d, now).days < 7);
      }
    });
    var summary = document.getElementById("reminder-summary");
    if (summary) {
      var next = A.sortedDeadlines().filter(function (d) {
        return on.indexOf(d.id) !== -1 && A.countdown(d, now).state !== "passed" && A.countdown(d, now).state !== "unknown";
      })[0];
      var count = on.filter(function (id) {
        var d = (D.deadlines || []).filter(function (x) { return x.id === id; })[0];
        return d && A.countdown(d, now).state !== "passed";
      }).length;
      summary.innerHTML = count === 0
        ? "No reminders switched on yet. Choose a deadline below. Your choices are saved in this browser."
        : "<strong>" + count + (count === 1 ? " reminder" : " reminders") + " on.</strong> " +
          (next ? "Next: " + esc(next.title) + " (" + esc(A.formatDate(next)) + "). " : "") +
          "Saved in this browser.";
    }
  };

  /* ---- Home ------------------------------------------------------------------ */
  views.home = {
    title: function () { return "Home"; },
    render: function () {
      var guides = D.guides.map(function (g, i) {
        return (
          '<li class="row"><a class="row-link" href="#/guides/' + esc(g.id) + '">' +
          '<span class="num">' + pad(i + 1) + "</span>" +
          '<span class="row-body"><span class="row-title">' + esc(g.label) + "</span>" +
          '<span class="row-desc">' + esc(g.summary) + "</span>" +
          '<span class="row-cta">Open guide ' + icon("arrow-ur") + "</span></span></a></li>"
        );
      }).join("");

      var upcoming = A.sortedDeadlines().filter(function (d) {
        var s = A.countdown(d).state; return s === "upcoming" || s === "today";
      }).slice(0, 3);
      var coming = upcoming.length
        ? '<ul class="mini-list">' + upcoming.map(function (d) {
            return "<li><span class=\"mini-title\">" + esc(d.title) + "</span>" +
              '<span class="mini-date">' + esc(A.formatDate(d)) + "</span>" + countdownText(d) + "</li>";
          }).join("") + "</ul>"
        : '<p class="muted">No upcoming deadlines are listed right now.</p>';

      return (
        '<section class="hero wrap">' +
        '<h1 class="display" tabindex="-1">A little guidance.<br>A better university journey.</h1>' +
        '<p class="lede">Clear steps, the right office and real people for the questions that come up during your time at ' +
        esc(D.meta.university.replace(/,.*$/, "")) + ".</p>" +
        '<form class="ask-inline" data-ask-form role="search" aria-label="Ask a question">' +
        '<label class="sr-only" for="home-q">Your question</label>' +
        '<input id="home-q" name="q" type="text" autocomplete="off" placeholder="Try: how do I apply for a hostel?">' +
        '<button type="submit" class="btn">Ask a question ' + icon("arrow-r", 16) + "</button></form>" +
        '<p class="hint">Answers come from a fixed list of common questions, matched by keyword. This is not an AI chatbot, and if it cannot help it points you to a real office.</p>' +
        "</section>" +

        '<section class="wrap split section">' +
        "<div><h2 class=\"section-title\">Find answers by topic</h2>" +
        '<ol class="index">' + guides + "</ol></div>" +
        '<aside class="aside" aria-labelledby="coming-h"><h2 class="aside-title" id="coming-h">Coming up</h2>' +
        coming + '<p><a class="text-link" href="#/deadlines">All deadlines and reminders ' + icon("arrow-ur") + "</a></p></aside>" +
        "</section>" +

        '<section class="wrap trio section" aria-label="More ways to get help">' +
        '<a class="trio-item" href="#/mentors"><span class="eyebrow">Mentors</span><span class="trio-title">Talk to someone who has been there</span>' +
        '<span class="row-cta">Browse mentors ' + icon("arrow-ur") + "</span></a>" +
        '<a class="trio-item" href="#/directory"><span class="eyebrow">Support directory</span><span class="trio-title">Find the right team for your question</span>' +
        '<span class="row-cta">Open the directory ' + icon("arrow-ur") + "</span></a>" +
        '<a class="trio-item" href="#/deadlines"><span class="eyebrow">Deadlines</span><span class="trio-title">Keep track of the dates that matter</span>' +
        '<span class="row-cta">Set reminders ' + icon("arrow-ur") + "</span></a>" +
        "</section>"
      );
    },
  };

  /* ---- Guides ---------------------------------------------------------------- */
  views.guides = {
    title: function (ctx) {
      var g = findGuide(ctx.param);
      return g ? g.label + " guide" : "Find answers";
    },
    render: function (ctx) {
      var g = findGuide(ctx.param) || D.guides[0];
      var nav = D.guides.map(function (x, i) {
        var cur = x.id === g.id;
        return '<li><a href="#/guides/' + esc(x.id) + '"' + (cur ? ' aria-current="page"' : "") + ">" +
          '<span class="num">' + pad(i + 1) + "</span><span>" + esc(x.label) + "</span></a></li>";
      }).join("");
      var steps = (g.steps || []).slice(0, 3).map(function (s, i) {
        return '<li><span class="step-n" aria-hidden="true">' + (i + 1) + "</span><p>" + esc(s) + "</p></li>";
      }).join("");

      return (
        pageHead({
          crumbs: [["Home", "#/"], ["Find answers"]],
          title: "Find answers",
          lede: "Choose a topic to see three clear steps and the office that can help.",
        }) +
        '<div class="wrap guide-layout">' +
        '<nav class="guide-nav" aria-label="Topics"><ul>' + nav + "</ul></nav>" +
        '<article class="guide" aria-labelledby="guide-h">' +
        '<h2 id="guide-h" class="guide-title" data-focus tabindex="-1">' + esc(g.label) + "</h2>" +
        '<p class="guide-summary">' + esc(g.summary) + "</p>" +
        '<h3 class="label">What to do</h3><ol class="steps">' + steps + "</ol>" +
        '<section class="who" aria-labelledby="who-h"><h3 class="label" id="who-h">Who &amp; where</h3>' +
        contactDl(g.contact) +
        '<p><a class="text-link" href="#/directory">See all support teams ' + icon("arrow-ur") + "</a></p>" +
        "</section>" + sampleNotice() +
        "</article></div>"
      );
    },
  };

  function findGuide(id) {
    return (D.guides || []).filter(function (g) { return g.id === id; })[0] || null;
  }

  /* ---- Support directory (matches the Figma frames) ---------------------------- */
  views.directory = {
    title: function () { return "Support directory"; },
    render: function () {
      var rows = D.teams.map(function (t, i) {
        var pid = "team-panel-" + esc(t.id);
        return (
          '<li class="row team"><span class="num">' + pad(i + 1) + "</span>" +
          '<div class="row-body"><h2 class="row-title">' + esc(t.name) + "</h2>" +
          '<p class="row-desc">' + esc(t.summary) + "</p>" +
          '<button type="button" class="row-cta link-btn" aria-expanded="false" aria-controls="' + pid + '" data-team-toggle>' +
          "Ask this team " + icon("arrow-ur") + "</button>" +
          '<div class="team-panel" id="' + pid + '" hidden>' + contactDl(t) +
          (val(t.email, "")
            ? '<p><a class="btn btn-small" href="mailto:' + esc(t.email) + '">Email ' + esc(t.name) + " " + icon("arrow-r", 14) + "</a></p>"
            : "") +
          "</div></div></li>"
        );
      }).join("");

      return (
        pageHead({
          crumbs: [["Home", "#/"], ["Support directory"]],
          title: "The right people.<br>A clearer next step.",
          lede: "Find the university team that can help with your question.",
        }) +
        '<div class="wrap split section-tight">' +
        '<div><ol class="index index-open">' + rows + "</ol>" + sampleNotice() + "</div>" +
        '<aside class="aside aside-photo" aria-labelledby="who-ask-h">' +
        '<img class="photo" src="assets/img/campus-staircase-library.png" width="376" height="280" ' +
        'alt="A staircase beside a library reading area inside a university building">' +
        '<h2 class="aside-title" id="who-ask-h">Not sure who to ask?</h2>' +
        "<p>You don’t have to figure it out alone. Tell us what you need and we’ll help find the right team.</p>" +
        '<a class="btn btn-block" href="#/ask">Ask a question ' + icon("arrow-r", 16) + "</a></aside>" +
        "</div>"
      );
    },
    mount: function (root) {
      function onClick(e) {
        var btn = e.target.closest("[data-team-toggle]");
        if (!btn) return;
        var open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", open ? "false" : "true");
        document.getElementById(btn.getAttribute("aria-controls")).hidden = open;
      }
      root.addEventListener("click", onClick);
      return function () { root.removeEventListener("click", onClick); };
    },
  };

  /* ---- Mentors ----------------------------------------------------------------- */
  var mentorFilters = { dept: "", topic: "" };

  function uniqueSorted(list) {
    var seen = {};
    return list.filter(function (x) { return x && !seen[x] && (seen[x] = true); }).sort();
  }

  function initials(name) {
    return String(name || "?").split(/\s+/).map(function (p) { return p.charAt(0); }).join("").slice(0, 2).toUpperCase();
  }

  function mentorList() {
    var list = D.mentors.filter(function (m) {
      return (!mentorFilters.dept || m.department === mentorFilters.dept) &&
             (!mentorFilters.topic || (m.topics || []).indexOf(mentorFilters.topic) !== -1);
    });
    var count = '<p class="count" role="status">Showing ' + list.length + " of " + D.mentors.length + (D.mentors.length === 1 ? " mentor" : " mentors") + "</p>";
    if (!list.length) {
      return count + '<div class="empty"><p><strong>No mentors match those filters.</strong></p><p>Try a different department or topic, or reset the filters.</p>' +
        '<button type="button" class="btn btn-ghost" data-reset>Reset filters</button></div>';
    }
    return count + '<ul class="mentors">' + list.map(function (m) {
      var pid = "mentor-" + esc(m.id);
      return (
        '<li class="mentor"><div class="mono" aria-hidden="true">' + esc(initials(m.name)) + "</div>" +
        '<div class="mentor-body"><h3 class="mentor-name">' + esc(m.name) + "</h3>" +
        '<p class="mentor-meta">' + esc(val(m.department, "Department to be confirmed")) + (m.role ? " · " + esc(m.role) : "") + "</p>" +
        '<ul class="topics" aria-label="Topics">' + (m.topics || []).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>" +
        '<button type="button" class="link-btn row-cta" aria-expanded="false" aria-controls="' + pid + '" data-mentor-toggle>View profile ' + icon("chevron") + "</button>" +
        '<div class="mentor-panel" id="' + pid + '" hidden><p>' + esc(val(m.bio, "Profile to be added.")) + "</p>" +
        '<dl class="facts"><div><dt>Availability</dt><dd>' + esc(val(m.availability, "To be confirmed")) + "</dd></div>" +
        "<div><dt>Contact</dt><dd>" + (val(m.email, "") ? '<a href="mailto:' + esc(m.email) + '">' + esc(m.email) + "</a>" : '<span class="muted">Email not listed</span>') + "</dd></div></dl></div>" +
        "</div></li>"
      );
    }).join("") + "</ul>";
  }

  views.mentors = {
    title: function () { return "Mentors"; },
    render: function () {
      var depts = uniqueSorted(D.mentors.map(function (m) { return m.department; }));
      var topics = uniqueSorted([].concat.apply([], D.mentors.map(function (m) { return m.topics || []; })));
      function opts(list, cur, all) {
        return '<option value="">' + all + "</option>" + list.map(function (x) {
          return '<option value="' + esc(x) + '"' + (x === cur ? " selected" : "") + ">" + esc(x) + "</option>";
        }).join("");
      }
      return (
        pageHead({
          crumbs: [["Home", "#/"], ["Mentors"]],
          title: "Talk to someone<br>who has been there.",
          lede: "Mentors are students and alumni who volunteer to share what they have learned. Filter by department or topic.",
        }) +
        '<div class="wrap section-tight">' +
        '<form class="filters" onsubmit="return false" aria-label="Filter mentors">' +
        '<div class="field"><label for="f-dept">Department</label><select id="f-dept">' + opts(depts, mentorFilters.dept, "All departments") + "</select></div>" +
        '<div class="field"><label for="f-topic">Topic</label><select id="f-topic">' + opts(topics, mentorFilters.topic, "All topics") + "</select></div>" +
        '<button type="button" class="btn btn-ghost" data-reset>Reset filters</button></form>' +
        '<div id="mentor-results">' + mentorList() + "</div>" + sampleNotice() + "</div>"
      );
    },
    mount: function (root) {
      var results = root.querySelector("#mentor-results");
      var dept = root.querySelector("#f-dept"), topic = root.querySelector("#f-topic");
      function refresh() { results.innerHTML = mentorList(); }
      function onChange() { mentorFilters.dept = dept.value; mentorFilters.topic = topic.value; refresh(); }
      function onClick(e) {
        if (e.target.closest("[data-reset]")) {
          mentorFilters.dept = ""; mentorFilters.topic = ""; dept.value = ""; topic.value = ""; refresh();
          dept.focus();
          return;
        }
        var btn = e.target.closest("[data-mentor-toggle]");
        if (btn) {
          var open = btn.getAttribute("aria-expanded") === "true";
          btn.setAttribute("aria-expanded", open ? "false" : "true");
          btn.classList.toggle("is-open", !open);
          document.getElementById(btn.getAttribute("aria-controls")).hidden = open;
        }
      }
      dept.addEventListener("change", onChange);
      topic.addEventListener("change", onChange);
      root.addEventListener("click", onClick);
      return function () {
        dept.removeEventListener("change", onChange);
        topic.removeEventListener("change", onChange);
        root.removeEventListener("click", onClick);
      };
    },
  };

  /* ---- Deadlines ---------------------------------------------------------------- */
  views.deadlines = {
    title: function () { return "Deadlines"; },
    render: function () {
      var items = A.sortedDeadlines().map(function (d) {
        var at = A.deadlineAt(d);
        var day = at ? at.getDate() : "–";
        var mon = at ? at.toLocaleDateString("en-GB", { month: "short" }) : "TBC";
        return (
          '<li class="deadline" data-deadline-row>' +
          '<div class="date" aria-hidden="true"><span class="date-day">' + day + '</span><span class="date-mon">' + esc(mon) + "</span></div>" +
          '<div class="deadline-body"><h2 class="deadline-title">' + esc(d.title) +
          ' <span class="tag-soon" hidden>Due soon</span></h2>' +
          '<p class="deadline-date">' + esc(A.formatDate(d)) + "</p>" +
          (d.description ? '<p class="deadline-desc">' + esc(d.description) + "</p>" : "") +
          "<p>" + countdownText(d) + (d.guide ? '<span class="sep" aria-hidden="true"></span>' + guideLink(d.guide) : "") + "</p></div>" +
          '<div class="deadline-action">' + reminderSwitch(d) + "</div></li>"
        );
      }).join("");
      return (
        pageHead({
          crumbs: [["Home", "#/"], ["Deadlines"]],
          title: "Never miss<br>a date that matters.",
          lede: "Switch on a reminder for the deadlines you care about. They stay on when you come back.",
        }) +
        '<div class="wrap section-tight">' +
        '<p class="summary" id="reminder-summary" role="status"></p>' +
        '<ul class="deadlines">' + (items || '<li class="empty">No deadlines are listed right now.</li>') + "</ul>" +
        '<p class="small muted">Reminders mark deadlines inside Ask-Me on this device. They do not send emails or notifications.</p>' +
        sampleNotice() + "</div>"
      );
    },
  };

  /* ---- Ask (FAQ helper) ----------------------------------------------------------- */
  var chat = null; // survives navigation within a visit

  function chips(list) {
    return '<div class="chips">' + list.map(function (q) {
      return '<button type="button" class="chip" data-suggest="' + esc(q) + '">' + esc(q) + "</button>";
    }).join("") + "</div>";
  }

  function teamCard(t, heading) {
    return (
      '<div class="team-card">' + (heading ? '<p class="label">' + esc(heading) + "</p>" : "") +
      '<p class="team-card-name">' + esc(t.name) + "</p>" + contactDl(t) + "</div>"
    );
  }

  function answerFor(q) {
    var matches = A.faqMatch(q);
    if (matches.length) {
      var top = matches[0], related = matches.slice(1, 3);
      var team = A.team(top.team);
      return (
        "<p>" + esc(top.answer) + "</p>" +
        (top.link ? '<p><a class="text-link" href="' + esc(top.link.href) + '">' + esc(top.link.label) + " " + icon("arrow-ur") + "</a></p>" : "") +
        (team ? teamCard(team, "Prefer to talk to a person?") : "") +
        (related.length ? '<p class="label">You might also mean</p>' + chips(related.map(function (r) { return r.question; })) : "")
      );
    }
    var s = A.suggestTeam(q);
    return (
      "<p>" + esc(D.faq.fallback) + "</p>" +
      teamCard(s.team, s.guessed ? "This office may be able to help" : "A good place to start") +
      '<p><a class="text-link" href="#/directory">See every support team ' + icon("arrow-ur") + "</a></p>" +
      '<p class="label">Or try one of these</p>' + chips(D.faq.suggested)
    );
  }

  views.ask = {
    title: function () { return "Ask a question"; },
    render: function () {
      var contacts = D.teams.slice(0, 3).map(function (t) {
        return '<li><span class="mini-title">' + esc(t.name) + '</span><span class="mini-date">' + esc(val(t.hours, "Hours to be confirmed")) + "</span></li>";
      }).join("");
      return (
        pageHead({
          crumbs: [["Home", "#/"], ["Ask a question"]],
          title: "Ask a question.",
          lede: "Ask-Me matches your words against a fixed list of common student questions. It is not an AI chatbot. If it cannot help, it will point you to a real office.",
        }) +
        '<div class="wrap split section-tight">' +
        '<section class="chat" aria-label="Question helper">' +
        '<div class="chat-log" id="chat-log" role="log" aria-live="polite" aria-label="Conversation" tabindex="0"></div>' +
        '<form class="chat-form" id="chat-form"><label class="sr-only" for="chat-input">Type your question</label>' +
        '<input id="chat-input" name="q" type="text" autocomplete="off" placeholder="Type your question…">' +
        '<button type="submit" class="btn">Ask ' + icon("arrow-r", 16) + "</button></form></section>" +
        '<aside class="aside" aria-labelledby="person-h"><h2 class="aside-title" id="person-h">Prefer a person?</h2>' +
        "<p>The support directory lists every team with their office, room and hours.</p>" +
        '<ul class="mini-list">' + contacts + "</ul>" +
        '<p><a class="text-link" href="#/directory">Open the support directory ' + icon("arrow-ur") + "</a></p></aside>" +
        "</div>"
      );
    },
    mount: function (root, ctx) {
      var log = root.querySelector("#chat-log");
      var form = root.querySelector("#chat-form");
      var input = root.querySelector("#chat-input");

      if (!chat) chat = [{ role: "bot", html: "<p>" + esc(D.faq.intro) + "</p>" + chips(D.faq.suggested) }];

      function bubble(m) {
        return '<div class="msg msg-' + m.role + '"><span class="msg-who">' + (m.role === "bot" ? "Ask-Me" : "You") +
          "</span><div class=\"msg-text\">" + m.html + "</div></div>";
      }
      function add(m) {
        chat.push(m);
        log.insertAdjacentHTML("beforeend", bubble(m));
        // Show the start of the newest message (clamps to the bottom for short ones).
        log.scrollTop = log.lastElementChild.offsetTop - 12;
      }
      function ask(q) {
        q = String(q || "").trim();
        if (!q) return;
        add({ role: "user", html: "<p>" + esc(q) + "</p>" });
        add({ role: "bot", html: answerFor(q) });
        input.value = "";
        // On small screens keep the input visible without animating (smooth scrolling gets cancelled by focus).
        if (window.innerWidth < 900) form.scrollIntoView({ block: "nearest", behavior: "instant" });
      }

      log.innerHTML = chat.map(bubble).join("");
      // Fresh chat: show the top of the intro. Returning visit: show the start of the latest message.
      log.scrollTop = chat.length > 1 ? log.lastElementChild.offsetTop - 12 : 0;

      function onSubmit(e) { e.preventDefault(); input.focus({ preventScroll: true }); ask(input.value); }
      function onClick(e) {
        var chip = e.target.closest("[data-suggest]");
        if (!chip) return;
        ask(chip.getAttribute("data-suggest"));
        // Don't pop the on-screen keyboard open after tapping a suggestion on touch devices.
        if (!(window.matchMedia && window.matchMedia("(pointer: coarse)").matches)) input.focus({ preventScroll: true });
      }
      form.addEventListener("submit", onSubmit);
      log.addEventListener("click", onClick);

      // Arrived from the home-page question box: answer it once, then tidy the URL.
      if (ctx.query && ctx.query.q) {
        ask(ctx.query.q);
        if (window.history && history.replaceState) history.replaceState(null, "", "#/ask");
      }
      return function () {
        form.removeEventListener("submit", onSubmit);
        log.removeEventListener("click", onClick);
      };
    },
  };

  /* ---- Plain pages -------------------------------------------------------------------- */
  views.accessibility = {
    title: function () { return "Accessibility"; },
    render: function () {
      return (
        pageHead({ crumbs: [["Home", "#/"], ["Accessibility"]], title: "Accessibility", lede: "Ask-Me should be usable by every student." }) +
        '<div class="wrap prose section-tight">' +
        "<p>This site is built with semantic HTML, keyboard-friendly controls, visible focus outlines, text that scales with your browser settings, and respects the reduced-motion setting on your device.</p>" +
        "<p>If something does not work for you, please tell the support team so it can be fixed. Include the page and the device or assistive technology you were using.</p>" +
        '<p><a class="text-link" href="#/directory">Find a support team ' + icon("arrow-ur") + "</a></p>" +
        '<p class="notice"><strong>Draft statement.</strong> This text should be reviewed and approved by the department before launch.</p></div>'
      );
    },
  };

  views.privacy = {
    title: function () { return "Privacy"; },
    render: function () {
      return (
        pageHead({ crumbs: [["Home", "#/"], ["Privacy"]], title: "Privacy", lede: "What Ask-Me keeps, and where." }) +
        '<div class="wrap prose section-tight">' +
        "<p>Ask-Me has no accounts and no database. Your reminder choices are stored only in this browser, on this device, using local storage. They are not sent anywhere.</p>" +
        "<p>The questions you type into the helper are matched in your browser and are not stored or transmitted. You can clear your saved reminders at any time by clearing this site’s data in your browser settings.</p>" +
        '<p class="notice"><strong>Draft statement.</strong> This text should be reviewed and approved by the department before launch.</p></div>'
      );
    },
  };

  views.notFound = {
    title: function () { return "Page not found"; },
    render: function () {
      return (
        pageHead({ crumbs: [["Home", "#/"], ["Page not found"]], title: "We could not find that page.", lede: "The link may be out of date." }) +
        '<div class="wrap prose section-tight"><p><a class="btn" href="#/">Back to home ' + icon("arrow-r", 16) + "</a></p></div>"
      );
    },
  };
})();
