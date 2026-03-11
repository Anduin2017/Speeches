/**
 * Reveal.js Cross-Device Sync + Mobile Speaker Remote
 *
 * Usage:
 *   Audience (computer):  http://localhost:3000
 *   Speaker  (phone):     http://<LAN_IP>:3000/?role=speaker
 */
(function () {
  'use strict';

  const params = new URLSearchParams(window.location.search);
  const role = params.get('role');
  const isSpeaker = (role === 'speaker');

  // ---- WebSocket Connection ----
  const wsProtocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
  let ws;
  let reconnectTimer;

  function connectWS() {
    ws = new WebSocket(wsProtocol + '//' + location.host);

    ws.onopen = function () {
      console.log('[Sync] Connected as ' + (isSpeaker ? 'SPEAKER' : 'AUDIENCE'));
    };

    ws.onclose = function () {
      console.log('[Sync] Disconnected, retrying in 2s...');
      clearTimeout(reconnectTimer);
      reconnectTimer = setTimeout(connectWS, 2000);
    };

    ws.onerror = function () {
      ws.close();
    };

    if (!isSpeaker) {
      ws.onmessage = function (event) {
        try {
          var data = JSON.parse(event.data);
          if (data.type === 'state') {
            Reveal.setState(data.state);
          }
        } catch (e) { }
      };
    }
  }

  function sendState() {
    if (ws && ws.readyState === 1) {
      ws.send(JSON.stringify({
        type: 'state',
        state: Reveal.getState()
      }));
    }
  }

  // ---- Speaker Mode (Phone) ----
  if (isSpeaker) {
    // Inject speaker UI styles
    var style = document.createElement('style');
    style.textContent = [
      /* --- Keep Reveal rendered normally but behind our UI panels --- */
      '.reveal {',
      '  z-index: 0 !important;',
      '}',
      /* Disable Reveal\'s own UI controls in speaker mode */
      '.reveal .controls,',
      '.reveal .progress,',
      '.reveal .slide-number {',
      '  display: none !important;',
      '}',

      /* --- Next-slide preview (top area) --- */
      '#next-slide-preview {',
      '  position: fixed;',
      '  top: 0; left: 0; right: 0;',
      '  height: 36vh;',
      '  background: #1a1a2e;',
      '  z-index: 999;',
      '  display: flex;',
      '  flex-direction: column;',
      '  overflow: hidden;',
      '}',
      '#next-slide-preview .preview-header {',
      '  display: flex;',
      '  justify-content: space-between;',
      '  align-items: center;',
      '  padding: 4px 14px;',
      '  background: rgba(0,0,0,0.6);',
      '  flex-shrink: 0;',
      '}',
      '#next-slide-preview .preview-label {',
      '  color: #42affa;',
      '  font-size: 13px;',
      '  font-weight: bold;',
      '}',
      '#next-slide-preview .preview-meta {',
      '  color: #888;',
      '  font-size: 12px;',
      '  font-family: monospace;',
      '}',
      '#next-slide-preview .preview-slide-frame {',
      '  flex: 1;',
      '  margin: 4px 6px 6px;',
      '  border-radius: 6px;',
      '  overflow: hidden;',
      '  background: #fff;',
      '  position: relative;',
      '}',
      '#next-slide-preview .preview-slide-scaler {',
      '  position: absolute;',
      '  top: 0; left: 0;',
      '  width: 960px;',
      '  transform-origin: top left;',
      '  font-size: 28px;',
      '  line-height: 1.4;',
      '  padding: 20px 30px;',
      '  box-sizing: border-box;',
      '}',
      '#next-slide-preview .preview-slide-scaler aside.notes { display: none; }',
      '#next-slide-preview .preview-slide-scaler img { max-width: 100%; height: auto; }',
      '#next-slide-preview .preview-end {',
      '  flex: 1;',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: center;',
      '  color: #555;',
      '  font-size: 16px;',
      '}',

      /* --- Notes Panel (middle area) --- */
      '#speaker-notes-panel {',
      '  position: fixed;',
      '  top: 36vh;',
      '  left: 0; right: 0;',
      '  bottom: 56px;',
      '  background: rgba(0,0,0,0.92);',
      '  color: #e8e8e8;',
      '  padding: 10px 18px;',
      '  font-size: 17px;',
      '  line-height: 1.7;',
      '  overflow-y: auto;',
      '  z-index: 1000;',
      '  border-top: 3px solid #42affa;',
      '  -webkit-overflow-scrolling: touch;',
      '}',
      '#speaker-notes-panel p { margin: 0.4em 0; }',
      '#speaker-notes-panel:empty::after {',
      '  content: "（本页无备注）";',
      '  color: #666;',
      '  font-style: italic;',
      '}',

      /* --- Navigation Buttons (bottom bar) --- */
      '#speaker-nav {',
      '  position: fixed;',
      '  bottom: 0;',
      '  left: 0; right: 0;',
      '  display: flex;',
      '  z-index: 1002;',
      '  height: 56px;',
      '  background: #111;',
      '  border-top: 1px solid #333;',
      '}',
      '#speaker-nav button {',
      '  flex: 1;',
      '  border: none;',
      '  background: transparent;',
      '  color: #fff;',
      '  font-size: 22px;',
      '  cursor: pointer;',
      '  -webkit-tap-highlight-color: rgba(66,175,250,0.3);',
      '  transition: background 0.15s;',
      '  user-select: none;',
      '}',
      '#speaker-nav button:active {',
      '  background: rgba(66,175,250,0.25);',
      '}',
      '#speaker-nav .nav-divider {',
      '  width: 1px;',
      '  background: #333;',
      '}',
    ].join('\n');
    document.head.appendChild(style);

    // ---- Build DOM elements ----

    // Next slide preview
    var nextPreview = document.createElement('div');
    nextPreview.id = 'next-slide-preview';
    document.body.appendChild(nextPreview);

    // Notes panel
    var notesPanel = document.createElement('div');
    notesPanel.id = 'speaker-notes-panel';
    document.body.appendChild(notesPanel);

    // Nav buttons
    var nav = document.createElement('div');
    nav.id = 'speaker-nav';
    nav.innerHTML =
      '<button id="btn-prev">◀ 上一页</button>' +
      '<div class="nav-divider"></div>' +
      '<button id="btn-next">下一页 ▶</button>';
    document.body.appendChild(nav);

    document.getElementById('btn-prev').addEventListener('click', function () {
      Reveal.prev();
    });
    document.getElementById('btn-next').addEventListener('click', function () {
      Reveal.next();
    });

    // ---- Helper: build preview of what the NEXT button press will show ----
    // Returns { element: clonedNode, label: string } or null if at the end.
    function getNextStepPreview() {
      var currentSlide = Reveal.getCurrentSlide();
      if (!currentSlide) return null;

      // Find all fragments on the current slide, sorted by index
      var allFragments = Array.from(currentSlide.querySelectorAll('.fragment'));

      // Check if there are still-hidden fragments on the current slide
      var hiddenFragments = allFragments.filter(function (f) {
        return !f.classList.contains('visible');
      });

      if (hiddenFragments.length > 0) {
        // Next press will reveal the next fragment group (same data-fragment-index)
        var nextIdx = hiddenFragments[0].getAttribute('data-fragment-index');
        // Clone the entire current slide
        var clone = currentSlide.cloneNode(true);
        // In the clone, mark fragments as visible up to and including the next group
        var cloneFragments = Array.from(clone.querySelectorAll('.fragment'));
        cloneFragments.forEach(function (f) {
          var fIdx = f.getAttribute('data-fragment-index');
          // Already visible ones stay visible; reveal the next group too
          var original = allFragments[cloneFragments.indexOf(f)];
          if (original && original.classList.contains('visible')) {
            f.classList.add('visible');
          } else if (fIdx === nextIdx) {
            f.classList.add('visible');
          }
        });
        return { element: clone, label: '▶ 下一步（动画）' };
      }

      // All fragments shown (or none exist) → next press goes to the next slide
      var slides = Reveal.getSlides();
      var currentIndex = slides.indexOf(currentSlide);
      if (currentIndex >= 0 && currentIndex + 1 < slides.length) {
        var nextSlide = slides[currentIndex + 1];
        var clone = nextSlide.cloneNode(true);
        // Hide all fragments in the clone (fresh state)
        Array.from(clone.querySelectorAll('.fragment')).forEach(function (f) {
          f.classList.remove('visible');
        });
        return { element: clone, label: '▶ 下一步（新页面）' };
      }

      return null; // End of presentation
    }

    // ---- Update next-step preview ----
    function updateNextPreview() {
      nextPreview.innerHTML = '';

      var slides = Reveal.getSlides();
      var current = Reveal.getCurrentSlide();
      var currentIdx = 0;
      for (var i = 0; i < slides.length; i++) {
        if (slides[i] === current) { currentIdx = i + 1; break; }
      }
      var total = slides.length;

      var preview = getNextStepPreview();
      var labelText = preview ? preview.label : '▶ 下一步';

      // Header row: label + page counter + timer
      var header = document.createElement('div');
      header.className = 'preview-header';
      header.innerHTML =
        '<span class="preview-label">' + labelText + '</span>' +
        '<span class="preview-meta">' + currentIdx + ' / ' + total + '  ·  <span id="speaker-timer">00:00:00</span></span>';
      nextPreview.appendChild(header);

      if (preview) {
        var frame = document.createElement('div');
        frame.className = 'preview-slide-frame';

        var scaler = document.createElement('div');
        scaler.className = 'preview-slide-scaler';
        scaler.innerHTML = preview.element.innerHTML;

        frame.appendChild(scaler);
        nextPreview.appendChild(frame);

        // Scale the 960px-wide content to fit the phone screen
        requestAnimationFrame(function () {
          var frameW = frame.clientWidth;
          if (frameW > 0) {
            var scale = frameW / 960;
            scaler.style.transform = 'scale(' + scale + ')';
          }
        });
      } else {
        var endMsg = document.createElement('div');
        endMsg.className = 'preview-end';
        endMsg.textContent = '🏁 已是最后一页';
        nextPreview.appendChild(endMsg);
      }
    }

    // ---- Update notes display (for CURRENT slide) ----
    function updateNotes() {
      var slide = Reveal.getCurrentSlide();
      if (!slide) return;
      var notesEl = slide.querySelector('aside.notes');
      notesPanel.innerHTML = notesEl ? notesEl.innerHTML : '';
    }

    // ---- Timer ----
    var startTime = Date.now();
    setInterval(function () {
      var elapsed = Math.floor((Date.now() - startTime) / 1000);
      var h = Math.floor(elapsed / 3600);
      var m = Math.floor((elapsed % 3600) / 60);
      var s = elapsed % 60;
      var el = document.getElementById('speaker-timer');
      if (el) {
        el.textContent =
          (h < 10 ? '0' : '') + h + ':' +
          (m < 10 ? '0' : '') + m + ':' +
          (s < 10 ? '0' : '') + s;
      }
    }, 1000);

    // ---- Listen for slide changes → update UI + broadcast ----
    function onSlideChange() {
      updateNotes();
      updateNextPreview();
      sendState();
    }

    Reveal.on('slidechanged', onSlideChange);
    Reveal.on('fragmentshown', onSlideChange);
    Reveal.on('fragmenthidden', onSlideChange);
    Reveal.on('ready', function () {
      updateNotes();
      updateNextPreview();
    });
  } else {
    // ---- Audience Mode (Computer) ----
    // Disable manual navigation so only the speaker controls it
    Reveal.on('ready', function () {
      Reveal.configure({
        keyboard: false,
        touch: false,
        controls: false,
        progress: false
      });
    });
  }

  // Start WebSocket connection
  connectWS();
})();
