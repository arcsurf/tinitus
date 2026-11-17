#!/bin/bash
# Post-uninstall script for the .rpm package (Fedora / RHEL / openSUSE).
# electron-builder replaces ${executable} and ${sanitizedProductName}.
# Replaces electron-builder's default, which passes the wrong path to
# update-alternatives (making "dnf remove" fail) and also runs on upgrades.

# $1 is the number of versions left installed: 0 = real uninstall, >=1 = upgrade
if [ "$1" = "0" ]; then
    if type update-alternatives >/dev/null 2>&1; then
        update-alternatives --remove '${executable}' '/opt/${sanitizedProductName}/${executable}' >/dev/null 2>&1 || true
    fi
    if [ -L '/usr/bin/${executable}' ] && [ ! -e '/usr/bin/${executable}' ]; then
        rm -f '/usr/bin/${executable}'
    fi
    # Remove empty directories left under /opt
    if [ -d '/opt/${sanitizedProductName}' ]; then
        find '/opt/${sanitizedProductName}' -depth -type d -empty -delete 2>/dev/null || true
    fi
fi
exit 0
