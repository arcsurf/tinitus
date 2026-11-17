# Tinitus · Tinnitus therapy app

Cross-platform app (**iPhone, iPad, Android, Windows, macOS and web**) that helps people live better with tinnitus through sound therapy, relaxation, exercises and daily tracking. Therapy adapts to **8 profiles** based on the type of tinnitus.

**Languages:** English (default) · Español · Deutsch · Français · 日本語

> ⚠️ **Tinitus is not a medical device.** It is a support and wellness tool and does not replace a professional assessment. Users must accept the Terms of Use and Disclaimer before using the app: [English](legal/TERMS.en.md) · [Español](legal/TERMS.es.md) · [Deutsch](legal/TERMS.de.md) · [Français](legal/TERMS.fr.md) · [日本語](legal/TERMS.ja.md)

🇪🇸 **[Instrucciones en español ↓](#-instrucciones-en-español)**

---

## ⬇️ Quick download

| Platform | Download | How to install |
|---|---|---|
| 🌐 **Web app (any device)** | **https://arcsurf.github.io/tinitus/** | [Install as an app](#web-app-pwa-all-devices) |
| 🤖 **Android** | [`Tinitus.apk`](https://github.com/arcsurf/tinitus/releases/latest/download/Tinitus.apk) | [Android guide](#android-apk) |
| 🍎 **iPhone / iPad** | [`Tinitus-unsigned.ipa`](https://github.com/arcsurf/tinitus/releases/latest/download/Tinitus-unsigned.ipa) | [iPhone/iPad guide](#iphone--ipad-ipa) |
| 🐧 **Linux: Ubuntu 24.04** | [`Tinitus-amd64.deb`](https://github.com/arcsurf/tinitus/releases/latest/download/Tinitus-amd64.deb) | [Linux guide](#linux-ubuntu--fedora) |
| 🐧 **Linux: Fedora** | [`Tinitus-x86_64.rpm`](https://github.com/arcsurf/tinitus/releases/latest/download/Tinitus-x86_64.rpm) | [Linux guide](#linux-ubuntu--fedora) |
| 💻 **Windows / macOS** | Web app, or build it yourself | [Desktop guide](#windows--macos) |

All builds are on the [**Releases**](https://github.com/arcsurf/tinitus/releases) page. A new build is published automatically every time code is pushed to `main`.

---

## 📲 Installation

### Web app (PWA), all devices
This is the fastest option. Nothing to download, it never expires, it works offline and it updates automatically.

**iPhone / iPad (Safari):**
1. Open **https://arcsurf.github.io/tinitus/** in **Safari**. It must be Safari, not Chrome.
2. Tap the **Share** button (square with an arrow).
3. Scroll down and tap **Add to Home Screen** → **Add**.
4. Open **Tinitus** from your home screen.

**Android (Chrome):**
1. Open **https://arcsurf.github.io/tinitus/** in Chrome.
2. Tap the menu **⋮** → **Install app** (or **Add to Home screen**).

**Windows / macOS (Chrome or Edge):**
1. Open **https://arcsurf.github.io/tinitus/**.
2. Click the **Install** icon in the address bar (monitor with an arrow), or menu → *Install Tinitus*.
3. The app opens in its own window and appears in the Start menu or Launchpad.

### Android (APK)
1. On your phone, open the [Releases](https://github.com/arcsurf/tinitus/releases/latest) page and download **`Tinitus.apk`**.
2. Open the downloaded file (from notifications or the *Files / Downloads* app).
3. If Android asks, allow **Install unknown apps** for your browser or file manager.
4. Tap **Install**.
5. If **Play Protect** shows a warning, tap **More details → Install anyway**. This is a test build that is not signed for the Play Store.
6. **To update**, download the new APK and install it over the old one. Your data is kept.

### iPhone / iPad (IPA)
Apple only allows apps that are **signed**. The IPA in Releases is **unsigned**, so you sign it with your own Apple ID using **Sideloadly** (free, Windows or Mac).

**What you need:** a PC or Mac, a USB cable for your iPhone/iPad, and a free Apple ID.

1. On your computer, install:
   - **iTunes** downloaded from apple.com, *not* the Microsoft Store version (Windows only), and
   - **Sideloadly** from https://sideloadly.io
2. Download **`Tinitus-unsigned.ipa`** from [Releases](https://github.com/arcsurf/tinitus/releases/latest).
3. Connect the iPhone by cable, unlock it and tap **Trust This Computer**.
4. Open Sideloadly and drag `Tinitus-unsigned.ipa` into it.
5. Enter your **Apple ID** email and press **Start**. Sideloadly asks for your Apple ID password. Enter it yourself, and the 2FA code if requested.
6. On the iPhone, go to **Settings → General → VPN & Device Management**, tap your Apple ID and tap **Trust**.
7. On **iOS 16 or later**, go to **Settings → Privacy & Security → Developer Mode**, turn it on, and restart. Confirm when asked.
8. Open **Tinitus**.

> ⏳ With a **free Apple ID** the app **expires after 7 days**. Repeat steps 4–5 to renew it; your data is kept. A free Apple ID can have at most 3 sideloaded apps at once.
>
> For a permanent install, use the [web app](#web-app-pwa-all-devices), or [publish via TestFlight / App Store](#-publishing-to-the-app-store-and-google-play) with a paid Apple Developer account.

### Linux (Ubuntu / Fedora)
Packages are for 64-bit PCs (x86_64). Open a terminal and run:

**Ubuntu 24.04** (and other Debian-based distros):
```bash
wget https://github.com/arcsurf/tinitus/releases/latest/download/Tinitus-amd64.deb
sudo apt install ./Tinitus-amd64.deb
```

**Fedora 45** (and other RPM-based distros):
```bash
sudo dnf install https://github.com/arcsurf/tinitus/releases/latest/download/Tinitus-x86_64.rpm
```

Then open **Tinitus** from the applications menu, or run `tinitus`. To update, repeat the same commands with the new release. To uninstall: `sudo apt remove tinitus` or `sudo dnf remove tinitus`.

> The packages are not signed, so `dnf` shows a warning about skipped OpenPGP checks. That is expected.

### Windows / macOS
- **Easiest:** install the [web app](#web-app-pwa-all-devices) from Chrome or Edge.
- **Native app (.exe / .dmg):** see [Build it yourself](#-build-it-yourself).

---

## 🧭 How to use Tinitus

1. **Accept the terms.** On first launch, read the Terms of Use, tick both boxes (terms and age 18+) and tap *I accept*. You can choose your language here with the 🌐 selector.
2. **Find your profile.** Tap *Take the test* (6 questions plus warning signs). The app assigns a main and a secondary profile. You can also pick a profile manually in *More → Tinnitus profiles*.
3. **Pitch matching** (needed for tonal tinnitus). Go to *More → Pitch matching*, start with a very low volume, move the slider until the tone matches your tinnitus, check the octave, and tap *Save my frequency*.
4. **Sound therapy.** Open *Therapy*, choose a sound (the recommended one is tagged), and set the volume to the **mixing point**: comfortable, with your tinnitus still slightly audible. Choose the ear and a timer, then press ▶.
5. **Relaxation.** *Relax* includes guided breathing (4-7-8, box, coherent), progressive muscle relaxation, CBT reframing cards and mindful listening.
6. **Diary.** Log loudness, annoyance, sleep and stress every day. The chart shows your trend.
7. **Settings.** Change the language, export or import your data (JSON backup), see the accepted terms, or delete everything.

### The 8 profiles

| Profile | How to recognize it | Main therapy |
|---|---|---|
| 🎵 **Tonal (ringing)** | Stable pure tone | Notched noise at your frequency (TMNMT-style) + residual inhibition test |
| 🌫️ **Hissing / broadband** | Static, steam, cicadas | Pink/white noise at the mixing point (TRT-style habituation) |
| 🌀 **Low-pitched / Ménière-type** | Low roar, blocked ear, vertigo | Brown noise and waves + referral to an ENT |
| 💓 **Pulsatile** | Beats with the heart | Relaxing sounds + **priority medical referral** |
| 🦴 **Somatosensory** | Changes with jaw/neck movement | Jaw and neck exercises + pink noise |
| 🔊 **With hyperacusis** | Everyday sounds are bothersome | Progressive desensitization (volume rises weekly) |
| 👂 **Noise-induced / hearing loss** | Noise exposure, hearing worse | High-frequency sound enrichment + hearing protection |
| 🌙 **Stress / insomnia** | Worse at night or with anxiety | CBT reframing, breathing, rain with sleep timer |

### Safety
- Always use **low, comfortable volumes**, and even lower with headphones.
- Stop if a sound is unpleasant or makes your tinnitus worse.
- See a doctor if your tinnitus is **sudden, in one ear, pulsatile**, or comes with hearing loss, vertigo, pain or neurological symptoms.

---

## 🛠️ Troubleshooting

| Problem | Solution |
|---|---|
| No sound on iPhone | Turn off silent mode (side switch), turn up the volume, and tap ▶ again. iOS requires a tap to start audio. |
| Sound stops when the screen locks | Keep the app open during the session. In the web version iOS pauses audio in the background; the native build has background audio enabled. |
| Android: "App not installed" | Uninstall any previous version signed differently, free up space, and try again. |
| Android: can't open the APK | Allow *Install unknown apps* for the browser or file manager you are using. |
| iPhone: "Untrusted Developer" | *Settings → General → VPN & Device Management* → trust your Apple ID. |
| iPhone: app stopped opening after a week | The free signature expired (7 days). Reinstall with Sideloadly. |
| iPhone: no Developer Mode option | Install the app once with Sideloadly; the option then appears in *Privacy & Security*. |
| "Install" option doesn't appear (web) | iPhone: use **Safari**. PC: use Chrome or Edge. The site must be opened over https. |
| The app asks me to accept the terms again | The Terms of Use were updated (new version); this is expected. |
| I lost my data | Data lives only on the device. Use *Settings → Export* regularly to keep a backup. |

---

## 🔒 Privacy
- No accounts, no servers, no analytics. All data stays **on your device**.
- Sounds are generated on the device; no audio files are downloaded.

---

## 🔧 Build it yourself

### Run the web app locally
```bash
python -m http.server 8080 --directory www
```
Then open http://localhost:8080

### Desktop (.exe / .dmg / .deb / .rpm) with Electron
Requires [Node.js](https://nodejs.org) 18+.
```bash
npm install
npm run desktop
npm run build:win
npm run build:mac
npm run build:linux
```
The installers are created in `dist/`. Build the `.dmg` on a Mac. `build:linux` creates both the `.deb` and the `.rpm`. It needs `rpmbuild`: on Ubuntu, `sudo apt install rpm`; on Fedora, `sudo dnf install rpm-build libxcrypt-compat`.

### Android and iOS with Capacitor
Requires Node.js 18+, plus Android Studio (Android) and/or a Mac with Xcode (iOS).
```bash
npm install
npx cap add android
npx cap add ios
npx --yes @capacitor/assets generate
npx cap sync
npx cap open android
npx cap open ios
```
For iOS, enable *Signing & Capabilities → Background Modes → Audio* in Xcode.

### Automatic builds (GitHub Actions)
- [`.github/workflows/build-apps.yml`](.github/workflows/build-apps.yml) builds the **Android APK** (Ubuntu), the **unsigned iOS IPA** (macOS) and the **Linux .deb and .rpm** (Ubuntu) on every push to `main` and publishes them as a Release.
- [`.github/workflows/pages.yml`](.github/workflows/pages.yml) publishes `www/` to **GitHub Pages**.
- To start a build manually, go to *Actions → Compilar apps → Run workflow*.

---

## 🏪 Publishing to the App Store and Google Play

**Google Play**
1. Create a [Google Play Console](https://play.google.com/console) account (one-time fee of USD 25).
2. Generate a signing key and build a signed **AAB** (`./gradlew bundleRelease` in Android Studio).
3. Create the app listing, complete the *Health apps* declaration and the privacy policy, and upload the AAB.

**Apple App Store / TestFlight**
1. Join the [Apple Developer Program](https://developer.apple.com/programs/) (USD 99/year).
2. In Xcode, select your team, archive the app and upload it to App Store Connect.
3. Test with **TestFlight**, which installs on iPhone without cables or 7-day expiry, then submit for review.

> Health apps get closer review in both stores. Keep the "not a medical device" notice visible and have the Terms of Use reviewed by a lawyer.

---

## 📁 Project structure

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
electron/linux/          .deb/.rpm install and uninstall scripts
capacitor.config.json   Native mobile wrapper (iOS/Android)
.github/workflows/      Automatic APK, IPA, .deb and .rpm builds, and GitHub Pages
legal/                  Terms of Use in 5 languages
```

**Adding a language:**
1. Copy `www/js/i18n/en.js` and translate it.
2. Add it to `window.LANGS` in `data.js`.
3. Add its `<script>` to `index.html` and the file to `sw.js`.

**Changing the Terms of Use:** edit the `legal` text in each language file and increase `LEGAL_VERSION` in `data.js`. Users will be asked to accept again.

## 🔬 Scientific basis (summary)
- **Cognitive Behavioural Therapy (CBT)** has the strongest evidence for reducing tinnitus distress.
- **Sound therapy and enrichment** (TRT) reduce contrast and support habituation.
- **Notched sound therapy** (TMNMT, Okamoto et al., 2010) has shown promising results for tonal tinnitus, but the evidence is mixed.
- **Sound desensitization** is used for hyperacusis.
- **Hearing aids** help when there is hearing loss.

---

# 🇪🇸 Instrucciones en español

Tinitus es una app multiplataforma (**iPhone, iPad, Android, Windows, macOS y web**) de terapia sonora, relajación y seguimiento para los acúfenos (tinnitus), con **8 perfiles** según el tipo de acúfeno. Viene en **inglés por defecto**. Para cambiar a español, usa el selector 🌐 de la pantalla de bienvenida o ve a *More → Settings → Español*.

> ⚠️ **Tinitus no es un producto sanitario.** No sustituye la valoración de un profesional. Antes de usarla hay que aceptar los [Términos de uso](legal/TERMS.es.md).

## ⬇️ Descarga rápida

| Plataforma | Descarga | Instalación |
|---|---|---|
| 🌐 **Web (cualquier dispositivo)** | **https://arcsurf.github.io/tinitus/** | [Instalar como app](#web-pwa-todos-los-dispositivos) |
| 🤖 **Android** | [`Tinitus.apk`](https://github.com/arcsurf/tinitus/releases/latest/download/Tinitus.apk) | [Guía Android](#android-apk-1) |
| 🍎 **iPhone / iPad** | [`Tinitus-unsigned.ipa`](https://github.com/arcsurf/tinitus/releases/latest/download/Tinitus-unsigned.ipa) | [Guía iPhone/iPad](#iphone--ipad-ipa-1) |
| 🐧 **Linux: Ubuntu 24.04** | [`Tinitus-amd64.deb`](https://github.com/arcsurf/tinitus/releases/latest/download/Tinitus-amd64.deb) | [Guía Linux](#linux-ubuntu--fedora-1) |
| 🐧 **Linux: Fedora** | [`Tinitus-x86_64.rpm`](https://github.com/arcsurf/tinitus/releases/latest/download/Tinitus-x86_64.rpm) | [Guía Linux](#linux-ubuntu--fedora-1) |
| 💻 **Windows / macOS** | App web, o compilar | [Guía escritorio](#windows--macos-1) |

Todas las compilaciones están en [**Releases**](https://github.com/arcsurf/tinitus/releases). Cada vez que se sube código a `main` se publica una nueva automáticamente.

## 📲 Instalación

### Web (PWA), todos los dispositivos
Es la opción más rápida: no hay que descargar nada, no caduca, funciona sin conexión y se actualiza sola.

**iPhone / iPad (Safari):**
1. Abre **https://arcsurf.github.io/tinitus/** en **Safari**. Tiene que ser Safari, no Chrome.
2. Pulsa el botón **Compartir** (cuadrado con flecha).
3. Baja y pulsa **Añadir a pantalla de inicio** → **Añadir**.
4. Abre **Tinitus** desde la pantalla de inicio.

**Android (Chrome):**
1. Abre **https://arcsurf.github.io/tinitus/** en Chrome.
2. Menú **⋮** → **Instalar aplicación** (o **Añadir a pantalla de inicio**).

**Windows / macOS (Chrome o Edge):**
1. Abre **https://arcsurf.github.io/tinitus/**.
2. Haz clic en el icono **Instalar** de la barra de direcciones, o en menú → *Instalar Tinitus*.
3. Se abre en su propia ventana y aparece en el menú Inicio o en el Launchpad.

### Android (APK)
1. En el móvil, entra en [Releases](https://github.com/arcsurf/tinitus/releases/latest) y descarga **`Tinitus.apk`**.
2. Abre el archivo descargado (desde las notificaciones o la app *Archivos / Descargas*).
3. Si Android lo pide, permite **Instalar apps desconocidas** para tu navegador o gestor de archivos.
4. Pulsa **Instalar**.
5. Si **Play Protect** muestra un aviso, pulsa **Más detalles → Instalar de todos modos**. Es una versión de prueba que no está firmada para Play Store.
6. **Para actualizar**, descarga el APK nuevo e instálalo encima. Tus datos se conservan.

### iPhone / iPad (IPA)
Apple solo permite apps **firmadas**. El IPA de Releases **no está firmado**, así que lo firmas con tu propio Apple ID usando **Sideloadly** (gratis, Windows o Mac).

**Necesitas:** un PC o Mac, el cable USB del iPhone/iPad y un Apple ID gratuito.

1. En el ordenador, instala:
   - **iTunes** descargado de apple.com, *no* el de Microsoft Store (solo en Windows), y
   - **Sideloadly** desde https://sideloadly.io
2. Descarga **`Tinitus-unsigned.ipa`** desde [Releases](https://github.com/arcsurf/tinitus/releases/latest).
3. Conecta el iPhone por cable, desbloquéalo y pulsa **Confiar en este ordenador**.
4. Abre Sideloadly y arrastra `Tinitus-unsigned.ipa` a la ventana.
5. Escribe el email de tu **Apple ID** y pulsa **Start**. Sideloadly te pedirá la contraseña del Apple ID. Escríbela tú, y también el código de verificación si lo pide.
6. En el iPhone, ve a **Ajustes → General → VPN y gestión de dispositivos**, toca tu Apple ID y pulsa **Confiar**.
7. En **iOS 16 o superior**, ve a **Ajustes → Privacidad y seguridad → Modo de desarrollador**, actívalo y reinicia. Confirma cuando lo pida.
8. Abre **Tinitus**.

> ⏳ Con un **Apple ID gratuito** la app **caduca a los 7 días**. Repite los pasos 4–5 para renovarla; tus datos se conservan. Un Apple ID gratuito admite como máximo 3 apps instaladas así a la vez.
>
> Para una instalación permanente usa la [versión web](#web-pwa-todos-los-dispositivos), o [publica en TestFlight / App Store](#-publicar-en-app-store-y-google-play) con una cuenta de desarrollador de pago.

### Linux (Ubuntu / Fedora)
Los paquetes son para PCs de 64 bits (x86_64). Abre una terminal y ejecuta:

**Ubuntu 24.04** (y otras distros basadas en Debian):
```bash
wget https://github.com/arcsurf/tinitus/releases/latest/download/Tinitus-amd64.deb
sudo apt install ./Tinitus-amd64.deb
```

**Fedora 45** (y otras distros basadas en RPM):
```bash
sudo dnf install https://github.com/arcsurf/tinitus/releases/latest/download/Tinitus-x86_64.rpm
```

Después abre **Tinitus** desde el menú de aplicaciones, o ejecuta `tinitus`. Para actualizar, repite los mismos comandos con la nueva versión. Para desinstalar: `sudo apt remove tinitus` o `sudo dnf remove tinitus`.

> Los paquetes no están firmados, así que `dnf` avisa de que se saltan las comprobaciones OpenPGP. Es lo esperado.

### Windows / macOS
- **Lo más fácil:** instala la [versión web](#web-pwa-todos-los-dispositivos) desde Chrome o Edge.
- **App nativa (.exe / .dmg):** ver [Compilar tú mismo](#-compilar-tú-mismo).

## 🧭 Cómo usar Tinitus

1. **Acepta los términos.** La primera vez, lee los Términos de uso, marca las dos casillas (términos y mayoría de edad) y pulsa aceptar. Aquí puedes elegir **Español** con el selector 🌐.
2. **Descubre tu perfil.** Pulsa *Hacer el test* (6 preguntas más señales de alarma). La app te asigna un perfil principal y uno secundario. También puedes elegirlo a mano en *Más → Perfiles de acúfeno*.
3. **Ajuste de tono** (necesario en acúfeno tonal). Ve a *Más → Ajuste de tono*, empieza con el volumen muy bajo y mueve el deslizador hasta que el tono se parezca a tu acúfeno. Comprueba la octava y pulsa *Guardar mi frecuencia*.
4. **Terapia sonora.** En *Terapia*, elige un sonido (el recomendado está marcado) y ajusta el volumen al **punto de mezcla**: cómodo, y que aún oigas ligeramente tu acúfeno. Elige el oído y un temporizador, y pulsa ▶.
5. **Relajación.** En *Relajar* tienes respiración guiada (4-7-8, caja, coherente), relajación muscular progresiva, tarjetas de reformulación (TCC) y atención plena al sonido.
6. **Diario.** Registra cada día el volumen, la molestia, el sueño y el estrés. La gráfica muestra tu tendencia.
7. **Ajustes.** Cambia el idioma, exporta o importa tus datos (copia de seguridad JSON), consulta los términos aceptados o bórralo todo.

### Los 8 perfiles

| Perfil | Cómo se reconoce | Terapia principal |
|---|---|---|
| 🎵 **Tonal (pitido)** | Tono puro y estable | Ruido con muesca en tu frecuencia + inhibición residual |
| 🌫️ **Siseo / banda ancha** | Estática, vapor, chicharra | Ruido rosa/blanco en "punto de mezcla" (habituación) |
| 🌀 **Grave / tipo Ménière** | Rugido grave, oído tapado, vértigo | Ruido marrón y olas + consulta al otorrino |
| 💓 **Pulsátil** | Late con el corazón | Sonidos relajantes + **consulta médica prioritaria** |
| 🦴 **Somatosensorial** | Cambia con mandíbula/cuello | Ejercicios de mandíbula y cuello + ruido rosa |
| 🔊 **Con hiperacusia** | Sonidos cotidianos molestan | Desensibilización progresiva (volumen sube cada semana) |
| 👂 **Por ruido / pérdida auditiva** | Exposición a ruido, oye peor | Enriquecimiento en agudos + protección auditiva |
| 🌙 **Estrés / insomnio** | Peor de noche o con ansiedad | TCC, respiración y lluvia con temporizador |

### Seguridad
- Usa siempre **volúmenes bajos y cómodos**, y aún más bajos con auriculares.
- Para si un sonido te molesta o empeora el acúfeno.
- Acude al médico si el acúfeno es **súbito, en un solo oído, pulsátil**, o viene con pérdida de audición, vértigo, dolor o síntomas neurológicos.

## 🛠️ Solución de problemas

| Problema | Solución |
|---|---|
| No se oye nada en iPhone | Quita el modo silencio (interruptor lateral), sube el volumen y vuelve a pulsar ▶. iOS exige un toque para iniciar el audio. |
| El sonido se para al bloquear la pantalla | Mantén la app abierta durante la sesión. En la versión web iOS pausa el audio en segundo plano; la versión nativa tiene audio en segundo plano. |
| Android: "Aplicación no instalada" | Desinstala versiones anteriores firmadas de otra forma, libera espacio y reintenta. |
| Android: no puedo abrir el APK | Permite *Instalar apps desconocidas* para el navegador o el gestor de archivos que uses. |
| iPhone: "Desarrollador no fiable" | *Ajustes → General → VPN y gestión de dispositivos* → confía en tu Apple ID. |
| iPhone: la app dejó de abrirse tras una semana | Caducó la firma gratuita (7 días). Reinstálala con Sideloadly. |
| iPhone: no aparece "Modo de desarrollador" | Instala la app una vez con Sideloadly; después aparece en *Privacidad y seguridad*. |
| No aparece "Instalar" (web) | En iPhone usa **Safari**. En PC usa Chrome o Edge. La web debe abrirse por https. |
| La app me pide aceptar los términos otra vez | Se actualizaron los Términos de uso (nueva versión); es lo esperado. |
| He perdido mis datos | Los datos solo están en el dispositivo. Usa *Ajustes → Exportar* de vez en cuando para tener copia. |

## 🔒 Privacidad
- Sin cuentas, sin servidores y sin analítica. Todos los datos se quedan **en tu dispositivo**.
- Los sonidos se generan en el propio dispositivo; no se descargan archivos de audio.

## 🔧 Compilar tú mismo

**Web en local:**
```bash
python -m http.server 8080 --directory www
```
Después abre http://localhost:8080

**Escritorio (.exe / .dmg / .deb / .rpm) con Electron.** Requiere [Node.js](https://nodejs.org) 18+.
```bash
npm install
npm run desktop
npm run build:win
npm run build:mac
npm run build:linux
```
Los instaladores se generan en `dist/`. El `.dmg` hay que generarlo en un Mac. `build:linux` genera el `.deb` y el `.rpm`. Necesita `rpmbuild`: en Ubuntu, `sudo apt install rpm`; en Fedora, `sudo dnf install rpm-build libxcrypt-compat`.

**Android e iOS con Capacitor.** Requiere Node.js 18+, y además Android Studio (Android) y/o un Mac con Xcode (iOS).
```bash
npm install
npx cap add android
npx cap add ios
npx --yes @capacitor/assets generate
npx cap sync
npx cap open android
npx cap open ios
```
En iOS, activa en Xcode *Signing & Capabilities → Background Modes → Audio*.

**Compilaciones automáticas (GitHub Actions):**
- [`build-apps.yml`](.github/workflows/build-apps.yml) genera el **APK de Android**, el **IPA de iOS sin firmar** y los paquetes **.deb y .rpm de Linux** en cada push a `main` y los publica en Releases.
- [`pages.yml`](.github/workflows/pages.yml) publica `www/` en **GitHub Pages**.
- Para lanzar una compilación a mano: *Actions → Compilar apps → Run workflow*.

## 🏪 Publicar en App Store y Google Play

**Google Play**
1. Crea una cuenta de [Google Play Console](https://play.google.com/console) (pago único de 25 USD).
2. Genera una clave de firma y compila un **AAB** firmado (`./gradlew bundleRelease` en Android Studio).
3. Crea la ficha de la app, completa la declaración de *Apps de salud* y la política de privacidad, y sube el AAB.

**App Store / TestFlight**
1. Date de alta en el [Apple Developer Program](https://developer.apple.com/programs/) (99 USD/año).
2. En Xcode, selecciona tu equipo, archiva la app y súbela a App Store Connect.
3. Pruébala con **TestFlight**, que instala en el iPhone sin cable y sin caducidad de 7 días, y envíala a revisión.

> Las tiendas revisan con más detalle las apps de salud. Mantén visible el aviso de que no es un producto sanitario y haz revisar los Términos de uso por un abogado.

## 🌍 Añadir un idioma o cambiar los términos
- **Nuevo idioma:**
  1. Copia `www/js/i18n/en.js` y tradúcelo.
  2. Añádelo a `window.LANGS` en `data.js`.
  3. Añade su `<script>` en `index.html` y el archivo en `sw.js`.
- **Cambiar los Términos de uso:** edita el texto `legal` de cada idioma y sube `LEGAL_VERSION` en `data.js`. Los usuarios tendrán que aceptarlos de nuevo.

---

## License / Licencia
Code under the MIT license (see [LICENSE](LICENSE)). Use is subject to the [Terms of Use](legal/TERMS.en.md).
Código bajo licencia MIT. El uso está sujeto a los [Términos de uso](legal/TERMS.es.md).
