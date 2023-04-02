export function increaseSizeOfCard(index: number, gridRefence: any) {
  const item = document.getElementById(`item-${index}`);

  if (item) {
    const classList = item.classList;

    if (classList.contains("item--75")) {
      // Do nothing, size is already at its maximum
    } else if (classList.contains("item--50")) {
      classList.remove("item--50");
      classList.add("item--75");
    } else {
      classList.add("item--50");
    }

    gridRefence.refreshItems().layout();
  }
}

export function decreaseSizeOfCard(index: number, gridRefence: any) {
  const item = document.getElementById(`item-${index}`);

  if (item) {
    const classList = item.classList;

    if (classList.contains("item--75")) {
      classList.remove("item--75");
      classList.add("item--50");
    } else if (classList.contains("item--50")) {
      classList.remove("item--50");
    } else {
      // Do nothing, size is already at its minimum
    }

    gridRefence.refreshItems().layout();
  }
}

export function updateProfileCardAspectRatio(
  aspectRatio: any,
  gridRefence: any
) {
  const profileCard = document.getElementById("item-6");
  if (!profileCard) return;

  profileCard.style.setProperty("aspect-ratio", aspectRatio);
  gridRefence.refreshItems().layout();
}
