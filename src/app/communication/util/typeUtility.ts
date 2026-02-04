import { Role } from "@prisma/client";

export function getOrReplace<T>(champ: T | null | undefined, replace: T) {
  if (champ === null || champ === undefined) {
    return replace;
  } else {
    console.log(champ);
    return champ;
  }
}
export function getRoleFromString(string: string): Role {
  if (string == "COMEDIEN") {
    return "COMEDIEN";
  } else if (string == "PARTENAIRE") {
    return "PARTENAIRE";
  } else if (string == "TECHNICIEN") {
    return "TECHNICIEN";
  }
  return "COMEDIEN";
}
