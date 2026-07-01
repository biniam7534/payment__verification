/** Navigate to a screen on the root AppStack from any nested tab/screen. */
export function navigateToAppScreen(navigation, screen, params) {
  const parent = navigation.getParent?.();
  if (parent?.navigate) {
    parent.navigate(screen, params);
    return;
  }
  navigation.navigate(screen, params);
}
