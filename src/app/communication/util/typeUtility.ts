import { Role } from "@prisma/client";

export function getOrReplace<T>(champ: T | null | undefined, replace: T) {
  if (champ === null || champ === undefined) {
    return replace;
  } else {
    return champ;
  }
}
export function getRoleFromString(string: string): Role {
  if (string == "USER") {
    return "USER";
  } else if (string == "PARTENAIRE") {
    return "PARTENAIRE";
  }
  return "USER";
}
