function desktopHasWindows(desktop) {
  const windows = workspace.windowList();
  const currentActivity = workspace.currentActivity;

  // Log which desktop we are currently scanning
  // console.log("OCCUPIED-DESKTOP-SWITCHER-DEBUG: Checking Desktop ID: " + desktop.x11DesktopNumber);

  for (const w of windows) {
    if (!w.desktopWindow && !w.dock && !w.skipTaskbar) {
      
      const isOnDesktop = w.desktops.includes(desktop);
      
      // If a window's activities array is empty, it is pinned to "All Activities"
      const isOnCurrentActivity = w.activities.length === 0 || w.activities.includes(currentActivity);

      if (isOnDesktop && isOnCurrentActivity) {
        console.log(
          "OCCUPIED-DESKTOP-SWITCHER-DEBUG: -> Found window: " + w.caption,
        );
        return true;
      }
    }
  }
  return false;
}

function switchDesktop(direction) {
  const current = workspace.currentDesktop;
  const desktops = workspace.desktops; // This is the array
  const total = desktops.length; // Use .length for the loop

  // console.log("OCCUPIED-DESKTOP-SWITCHER-DEBUG: Starting switch. Current Desktop: " + current.x11DesktopNumber);

  let index = current.x11DesktopNumber;

  for (let i = 0; i < total; i++) {
    index += direction;

    if (index > total) index = 1;
    if (index < 1) index = total;

    // Log the search progress
    // console.log("OCCUPIED-DESKTOP-SWITCHER-DEBUG: Evaluating index: " + index);

    const desktop = desktops.find((d) => d.x11DesktopNumber === index);

    if (desktop && desktopHasWindows(desktop)) {
      // console.log("OCCUPIED-DESKTOP-SWITCHER-DEBUG: Success! Switching to: " + index);
      workspace.currentDesktop = desktop;
      return;
    }
  }
  // console.log("OCCUPIED-DESKTOP-SWITCHER-DEBUG: No other occupied desktops found.");
}

registerShortcut(
  "Previous-Occupied-Desktop",
  "Previous Occupied Desktop",
  "Meta+Shift+Tab",
  function () {
    // console.log("OCCUPIED-DESKTOP-SWITCHER-DEBUG: Hotkey Meta+Shift+Tab pressed");
    switchDesktop(-1);
  },
);

registerShortcut(
  "Next-Occupied-Desktop",
  "Next Occupied Desktop",
  "Meta+Tab",
  function () {
    // console.log("OCCUPIED-DESKTOP-SWITCHER-DEBUG: Hotkey Meta+Tab pressed");
    switchDesktop(1);
  },
);
