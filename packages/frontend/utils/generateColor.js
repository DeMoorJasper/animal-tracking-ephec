const COLOR_LIST = [
  "red",
  "blue",
  "orange",
  "pink"
];

export function generateColor(value) {
  let selectedColor = 0;
  if (value.length > 0) {
    for (let i = 0; i < value.length; i++) {
      selectedColor += value.charCodeAt(i);
    }
    selectedColor = selectedColor % COLOR_LIST.length;
  }

  return COLOR_LIST[selectedColor];
}
