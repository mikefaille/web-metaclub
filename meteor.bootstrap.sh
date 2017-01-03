#!/bin/sh

# Maintainer : Michael Faille <michael@faille.io>

# This is the Meteor install script!
#
# Are you looking at this in your web browser, and would like to install Meteor?

# We wrap this whole script in a function, so that we won't execute
# until the entire script is downloaded.
# That's good because it prevents our output overlapping with curl's.
# It also means that we can't run a partially downloaded script.
# We don't indent because it would be really confusing with the heredocs.

# METEOR_RELEASE must be configured from environnements variables.

run_it () {

    # This always does a clean install of the latest version of Meteor into your
    # ~/.meteor, replacing whatever is already there. (~/.meteor is only a cache of
    # packages and package metadata; no personal persistent data is stored there.)

    # Now, on to the actual installer!

    ## NOTE sh NOT bash. This script should be POSIX sh only, since we don't
    ## know what shell the user has. Debian uses 'dash' for 'sh', for
    ## example.

    PREFIX="$HOME"



    set -e
    set -u

    # Let's display everything on stderr.
    exec 1>&2


    UNAME=$(uname)

    TARBALL_URL="https://meteorinstall-4168.kxcdn.com/packages-bootstrap/${METEOR_RELEASE}/meteor-bootstrap-os.linux.x86_64.tar.gz"
    INSTALL_TMPDIR="$HOME/.meteor-install-tmp"
    TARBALL_FILE="$HOME/.meteor-tarball-tmp"

    cleanUp() {
        rm -rf "$TARBALL_FILE"
        rm -rf "$INSTALL_TMPDIR"
    }

    # Remove temporary files now in case they exist.
    cleanUp

    # Make sure cleanUp gets called if we exit abnormally.
    trap cleanUp EXIT

    mkdir "$INSTALL_TMPDIR"

    # Only show progress bar animations if we have a tty
    # (Prevents tons of console junk when installing within a pipe)

    echo "Downloading Meteor distribution"
    # keep trying to curl the file until it works (resuming where possible)
    MAX_ATTEMPTS=10
    RETRY_DELAY_SECS=5
    set +e
    ATTEMPTS=0
    while [ $ATTEMPTS -lt $MAX_ATTEMPTS ]
    do
        ATTEMPTS=$((ATTEMPTS + 1))

        curl --progress-bar --fail --continue-at - \
             "$TARBALL_URL" --output "$TARBALL_FILE"

        if [ $? -eq 0 ]
        then
            break
        fi

        echo "Retrying download in $RETRY_DELAY_SECS seconds..."
        sleep $RETRY_DELAY_SECS
    done
    set -e

    # bomb out if it didn't work, eg no net
    test -e "${TARBALL_FILE}"
    tar -xzf "$TARBALL_FILE" -C "$INSTALL_TMPDIR" -o

    test -x "${INSTALL_TMPDIR}/.meteor/meteor"
    mv "${INSTALL_TMPDIR}/.meteor" "$HOME"
    # just double-checking :)
    test -x "$HOME/.meteor/meteor"

    # The `trap cleanUp EXIT` line above won't actually fire after the exec
    # call below, so call cleanUp manually.
    cleanUp

    echo
    echo "Meteor ${METEOR_RELEASE} has been installed in your home directory (~/.meteor)."

    METEOR_SYMLINK_TARGET="$(readlink "$HOME/.meteor/meteor")"
    METEOR_TOOL_DIRECTORY="$(dirname "$METEOR_SYMLINK_TARGET")"
    LAUNCHER="$HOME/.meteor/$METEOR_TOOL_DIRECTORY/scripts/admin/launch-meteor"

    cp "$LAUNCHER" "$PREFIX/bin/meteor" >/dev/null 2>&1
    echo "Writing a launcher script to $PREFIX/bin/meteor for your convenience."
    cat <<"EOF"

To get started fast:

  $ meteor create ~/my_cool_app
  $ cd ~/my_cool_app
  $ meteor

Or see the docs at:

  docs.meteor.com

EOF

    trap - EXIT
}

run_it
