export async function IncreaseSizeOfCard(
  index: number,
  gridRefence: any,
  videoID: string,
  supabase: any
) {
  const item = document.getElementById(`item-${index}`);

  if (item) {
    const classList = item.classList;

    if (classList.contains("item--75")) {
      // Do nothing, size is already at its maximum
    } else if (classList.contains("item--50")) {
      classList.remove("item--50");
      classList.add("item--75");
      gridRefence.refreshItems().layout();
      const { data, error } = await supabase
        .from("videos")
        .update({ size: 75 })
        .match({ id: videoID });
    } else {
      classList.add("item--50");
      gridRefence.refreshItems().layout();
      const { data, error } = await supabase
        .from("videos")
        .update({ size: 50 })
        .match({ id: videoID });
    }
  }
}

export async function DecreaseSizeOfCard(
  index: number,
  gridRefence: any,
  videoID: string,
  supabase: any
) {
  const item = document.getElementById(`item-${index}`);

  if (item) {
    const classList = item.classList;

    if (classList.contains("item--75")) {
      classList.remove("item--75");
      classList.add("item--50");
      gridRefence.refreshItems().layout();
      const { data, error } = await supabase
        .from("videos")
        .update({ size: 50 })
        .match({ id: videoID });
    } else if (classList.contains("item--50")) {
      classList.remove("item--50");
      gridRefence.refreshItems().layout();
      const { data, error } = await supabase
        .from("videos")
        .update({ size: 25 })
        .match({ id: videoID });
    } else {
      // Do nothing, size is already at its minimum
    }
  }
}

export function UpdateProfileCardAspectRatio(
  aspectRatio: any,
  gridRefence: any,
  index: number
) {
  const profileCard = document.getElementById(`item-${index}`);
  if (!profileCard) return;

  profileCard.style.setProperty("aspect-ratio", aspectRatio);
  gridRefence.refreshItems().layout();
}
