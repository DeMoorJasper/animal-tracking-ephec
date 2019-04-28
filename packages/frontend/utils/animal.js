export function getAnimalPhoto(animal) {
  switch (animal.animal_type) {
    case "fox":
      return "/static/fox.png";
    case "bird":
      return "/static/bird.png";
  }
}
