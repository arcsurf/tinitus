#!/bin/bash
# Post-remove script for the .deb package.
# electron-builder replaces ${executable} and ${sanitizedProductName}.
# Only acts on a real removal, not during upgrades.

case "$1" in
    remove|purge)
        if type update-alternatives >/dev/null 2>&1; then
            update-alternatives --remove '${executable}' '/opt/${sanitizedProductName}/${executable}' >/dev/null 2>&1 || true
        fi
        if [ -L '/usr/bin/${executable}' ] && [ ! -e '/usr/bin/${executable}' ]; then
            rm -f '/usr/bin/${executable}'
        fi

        # Remove the AppArmor profile installed by deb-after-install.sh
        if [ -f '/etc/apparmor.d/${executable}' ]; then
            if hash apparmor_parser 2>/dev/null; then
                apparmor_parser --remove '/etc/apparmor.d/${executable}' >/dev/null 2>&1 || true
            fi
            rm -f '/etc/apparmor.d/${executable}'
        fi
        ;;
esac
exit 0
