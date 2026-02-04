import { Role } from "@prisma/client";

export function getOrReplace<T>(champ: T | null | undefined, replace: T) {
  return champ ?? replace;
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
