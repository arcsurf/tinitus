#!/bin/bash
# Post-install script for the .deb package (Ubuntu / Debian).
# electron-builder replaces ${executable} and ${sanitizedProductName}.
# Same as electron-builder's default, plus an AppArmor profile: Ubuntu 23.10+
# blocks unprivileged user namespaces, which Electron's sandbox needs, so
# without this profile the app fails to start on Ubuntu 24.04.

if type update-alternatives 2>/dev/null >&1; then
    # Remove previous link if it doesn't use update-alternatives
    if [ -L '/usr/bin/${executable}' -a -e '/usr/bin/${executable}' -a "`readlink '/usr/bin/${executable}'`" != '/etc/alternatives/${executable}' ]; then
        rm -f '/usr/bin/${executable}'
    fi
    update-alternatives --install '/usr/bin/${executable}' '${executable}' '/opt/${sanitizedProductName}/${executable}' 100 || ln -sf '/opt/${sanitizedProductName}/${executable}' '/usr/bin/${executable}'
else
    ln -sf '/opt/${sanitizedProductName}/${executable}' '/usr/bin/${executable}'
fi

# AppArmor profile allowing user namespaces (only where AppArmor 4 is present).
if [ -f /etc/apparmor.d/abi/4.0 ]; then
    cat > '/etc/apparmor.d/${executable}' <<'EOF'
abi <abi/4.0>,
include <tunables/global>

profile ${executable} /opt/${sanitizedProductName}/${executable} flags=(unconfined) {
  userns,

  include if exists <local/${executable}>
}
EOF
    if hash apparmor_parser 2>/dev/null; then
        apparmor_parser --replace --write-cache --skip-read-cache '/etc/apparmor.d/${executable}' || true
    fi
    chmod 0755 '/opt/${sanitizedProductName}/chrome-sandbox' || true
elif ! { [[ -L /proc/self/ns/user ]] && unshare --user true; }; then
    # Use SUID chrome-sandbox only on systems without user namespaces
    chmod 4755 '/opt/${sanitizedProductName}/chrome-sandbox' || true
else
    chmod 0755 '/opt/${sanitizedProductName}/chrome-sandbox' || true
fi

if hash update-mime-database 2>/dev/null; then
    update-mime-database /usr/share/mime || true
fi

if hash update-desktop-database 2>/dev/null; then
    update-desktop-database /usr/share/applications || true
fi
