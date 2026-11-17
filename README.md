# Tinitus · Tinnitus therapy app

Cross-platform app (**iPhone, iPad, Android, Windows, macOS and web**) that helps people live better with tinnitus through sound therapy, relaxation, exercises and daily tracking. Therapy adapts to **8 profiles** based on the type of tinnitus.

**Languages:** English (default), Español, Deutsch, Français, 日本語. Users can switch from the welcome screen or in *Settings*.

> ⚠️ **Tinitus is not a medical device.** It is a support and wellness tool and does not replace a professional assessment. Users must accept the Terms of Use and Disclaimer before using the app: [English](legal/TERMS.en.md) · [Español](legal/TERMS.es.md) · [Deutsch](legal/TERMS.de.md) · [Français](legal/TERMS.fr.md) · [日本語](legal/TERMS.ja.md)

## Tinnitus profiles

| Profile | How to recognize it | Main therapy |
|---|---|---|
| 🎵 **Tonal (ringing)** | Stable pure tone | Notched noise at your frequency (TMNMT-style) + residual inhibition test |
| 🌫️ **Hissing / broadband** | Static, steam, cicadas | Pink/white noise at the mixing point (TRT-style habituation) |
| 🌀 **Low-pitched / Ménière-type** | Low roar, blocked ear, vertigo | Brown noise and waves + referral to an ENT specialist |
| 💓 **Pulsatile** | Beats with the heart | Relaxing sounds + **priority medical referral** |
| 🦴 **Somatosensory** | Changes with jaw/neck movement | Jaw and neck exercises + pink noise |
| 🔊 **With hyperacusis** | Everyday sounds are bothersome | Progressive desensitization (volume rises weekly) |
| 👂 **Noise-induced / hearing loss** | Noise exposure, hearing worse | High-frequency sound enrichment + hearing protection |
| 🌙 **Stress / insomnia** | Worse at night or with anxiety | CBT reframing, breathing, rain with sleep timer |

A **6-question test** assigns a main and a secondary profile and detects **warning signs** that require medical assessment.

## Features

- **Sound therapy**, generated on the device with the Web Audio API: white, pink and brown noise, notched noise, narrowband, high-frequency enrichment, ocean waves and rain. You can set the volume, choose the ear, and use a timer with fade-out and an optional notch.
- **Pitch matching**: find your tinnitus frequency, check the octave, and run a residual inhibition test.
- **Relaxation**: guided breathing (4-7-8, box, coherent), progressive muscle relaxation, CBT cards and mindful listening.
- **Exercises** for the jaw and neck.
- **Diary** for loudness, annoyance, sleep and stress, with a progress chart and statistics.
- **Privacy**: data is stored only on the device, with JSON export and import.
- Works **offline** (PWA with service worker).
- **Mandatory acceptance** of versioned Terms of Use, plus confirmation of age 18+.

## Project structure

```
www/                    Web app (plain HTML/CSS/JS, no dependencies)
  index.html
  css/styles.css
  js/data.js            Language-independent data (profiles, modes, test scoring, legal version)
  js/i18n/{en,es,de,fr,ja}.js   All texts: UI, profiles, exercises, test, Terms of Use
  js/audio.js           Audio engine (Web Audio API)
  js/app.js             UI, routing, diary, i18n
  sw.js, manifest.webmanifest, icons/
assets/                 Source icon and splash for native apps
electron/main.js        Desktop wrapper (Windows/macOS/Linux)
capacitor.config.json   Native mobile wrapper (iOS/Android)
.github/workflows/      Automatic APK + IPA builds and GitHub Pages
legal/                  Terms of Use in 5 languages
```

**Adding a language:** copy `www/js/i18n/en.js`, translate it, add it to `window.LANGS` in `data.js`, then add the `<script>` to `index.html` and the file to `sw.js`.

## 📲 Try it on your phone

Every push to `main` builds in GitHub Actions and publishes the files to **Releases**:
- `Tinitus.apk`: Android
- `Tinitus-unsigned.ipa`: iPhone/iPad (unsigned)

### Android (APK)
1. On the phone, open the repository's **Releases** page and download `Tinitus.apk`.
2. Open the file and allow *Install unknown apps* when prompted.
3. If Play Protect warns you, tap *More details → Install anyway*. This is a test build that isn't signed for the store.

### iPhone / iPad (IPA)
Apple only allows signed apps. Without a Mac or a paid developer account, the easiest way is **Sideloadly** (Windows/Mac, free) with your Apple ID:
1. Install **iTunes** (the apple.com version, not the Microsoft Store one) and **Sideloadly** (sideloadly.io) on your PC.
2. Connect the iPhone by cable and tap *Trust This Computer*.
3. Open Sideloadly, drag in `Tinitus-unsigned.ipa`, enter your Apple ID and press *Start*.
4. On the iPhone, go to *Settings → General → VPN & Device Management* and trust your Apple ID.
5. On iOS 16+, enable *Settings → Privacy & Security → Developer Mode* and restart.

With a free Apple ID the app **expires after 7 days** and must be reinstalled. TestFlight and the App Store require the **Apple Developer Program** (USD 99/year).

### No-install alternative: web app (PWA)
The repository publishes the app on **GitHub Pages**. On the iPhone, open the URL in Safari, then Share → *Add to Home Screen*. It works like an app and doesn't expire.

## Run and build locally

```bash
python -m http.server 8080 --directory www
```

Desktop with Electron (requires Node.js 18+):
```bash
npm install
npm run desktop
npm run build:win
npm run build:mac
```

App Store / Google Play with Capacitor:
```bash
npm install
npx cap add android && npx cap add ios
npx cap sync
npx cap open android
npx cap open ios
```
To keep sound playing with the screen locked on iOS, enable *Background Modes → Audio* in Xcode.

## Scientific basis (summary)
- **Cognitive Behavioural Therapy (CBT)** has the strongest evidence for reducing tinnitus distress.
- **Sound therapy and enrichment** (TRT) reduce contrast and support habituation.
- **Notched sound therapy** (TMNMT, Okamoto et al., 2010) has shown promising results for tonal tinnitus, but the evidence is mixed.
- **Sound desensitization** is used for hyperacusis.
- **Hearing aids** help when there is hearing loss.

## License
Code under the MIT license (see [LICENSE](LICENSE)). Use is subject to the [Terms of Use](legal/TERMS.en.md).
